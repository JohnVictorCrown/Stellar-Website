import { Hono } from 'hono';
import { stream } from 'hono/streaming';
import { cors } from 'hono/cors';

const START_TIME = Date.now();

function log(...args: any[]) {
  const ts = new Date().toISOString();
  const delta = (Date.now() - START_TIME).toString().padStart(6, ' ');
  console.log(`[${ts} +${delta}ms]`, ...args);
}

class MessageQueue {
  private items: Uint8Array[] = [];
  private resolver: ((value: Uint8Array | null) => void) | null = null;

  push(data: Uint8Array) {
    this.items.push(data);
    if (this.resolver) {
      const r = this.resolver;
      this.resolver = null;
      r(this.items.shift()!);
    }
  }

  async pop(timeoutMs: number): Promise<Uint8Array | null> {
    if (this.items.length > 0) return this.items.shift()!;
    return new Promise((resolve) => {
      this.resolver = resolve;
      setTimeout(() => {
        if (this.resolver) {
          this.resolver(null);
          this.resolver = null;
        }
      }, timeoutMs);
    });
  }
}

let callerQueue: MessageQueue | null = null;
let calleeQueue: MessageQueue | null = null;
let callActive = false;

const encoder = new TextEncoder();

function writeInt32BE(value: number): Uint8Array {
  return new Uint8Array([
    (value >> 24) & 0xFF,
    (value >> 16) & 0xFF,
    (value >> 8) & 0xFF,
    value & 0xFF
  ]);
}

function encodeFrame(ctrlType: string): Uint8Array {
  const json = JSON.stringify({ type: ctrlType });
  const text = encoder.encode(json);
  const len = writeInt32BE(text.length);
  const buf = new Uint8Array(1 + 4 + text.length);
  buf[0] = 0;
  buf.set(len, 1);
  buf.set(text, 5);
  log('CTRL', ctrlType, `(${text.length}B)`);
  return buf;
}

function stateLabel(): string {
  return `[caller=${callerQueue ? 'connected' : 'null'} callee=${calleeQueue ? 'connected' : 'null'} active=${callActive}]`;
}

function pushFrame(queue: MessageQueue | null, frame: Uint8Array, label: string) {
  if (!queue) {
    log('PUSH', `${label}: no queue, dropping ${frame.length}B`);
    return;
  }
  log('PUSH', `${label}: ${frame.length}B`);
  queue.push(frame);
}

function wrapAudio(data: Uint8Array): Uint8Array {
  const len = writeInt32BE(data.length);
  const buf = new Uint8Array(1 + 4 + data.length);
  buf[0] = 1;
  buf.set(len, 1);
  buf.set(data, 5);
  return buf;
}

const app = new Hono();

app.use('*', async (c, next) => {
  const ip = c.req.header('x-forwarded-for') || c.req.header('x-real-ip') || 'unknown';
  log('REQ', `${c.req.method} ${c.req.path} from ${ip}`, stateLabel());
  await next();
  log('RES', `${c.req.method} ${c.req.path} => ${c.res.status}`, stateLabel());
});

app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type'],
}));

// ---- CALLER stream ----

app.get('/caller', (c) => {
  log('CALLER-GET', stateLabel());

  const q = new MessageQueue();
  if (callerQueue) {
    log('CALLER-GET', 'replacing old caller');
    pushFrame(callerQueue, encodeFrame('hangup'), 'hangup->old_caller');
  }
  callerQueue = q;
  log('CALLER-GET', 'caller connected', stateLabel());

  pushFrame(q, encodeFrame('connected'), 'connected->caller');

  if (calleeQueue) {
    log('CALLER-GET', 'notifying callee');
    pushFrame(calleeQueue, encodeFrame('incoming_call'), 'incoming_call->callee');
  }

  return stream(c, async (s) => {
    let seq = 0;
    try {
      while (true) {
        const data = await q.pop(5000);
        if (data === null) {
          try { await s.write(encodeFrame('heartbeat')); }
          catch (e) { log('CALLER stream', 'heartbeat write failed:', e); break; }
          continue;
        }
        seq++;
        try { await s.write(data); }
        catch (e) { log('CALLER stream', 'write error:', e); break; }
      }
    } finally {
      if (callerQueue === q) callerQueue = null;
      if (callActive && calleeQueue) {
        pushFrame(calleeQueue, encodeFrame('hangup'), 'hangup->callee');
        callActive = false;
      }
      log('CALLER stream', 'cleanup done', stateLabel());
    }
  });
});

// ---- CALLER data upload ----

app.post('/caller', async (c) => {
  const body = c.req.raw.body;
  log('CALLER-POST', `body present: ${!!body}`, stateLabel());
  try {
    if (body && callActive && calleeQueue) {
      const payload = await readAllChunks(body, 'CALLER-POST');
      pushFrame(calleeQueue, wrapAudio(payload), 'audio(caller->callee)');
    } else if (body) {
      const reader = body.getReader();
      while (true) { const { done } = await reader.read(); if (done) break; }
      log('CALLER-POST', 'drained body (no target)');
    }
  } catch (e) { log('CALLER-POST', 'error:', e); }
  return c.text('ok');
});

// ---- CALLER hangup ----

app.delete('/caller', async (c) => {
  log('CALLER-DELETE', stateLabel());
  if (callActive && calleeQueue) {
    pushFrame(calleeQueue, encodeFrame('hangup'), 'hangup->callee');
  }
  callActive = false;
  log('CALLER-DELETE done', stateLabel());
  return c.text('ok');
});

// ---- CALLEE stream ----

app.get('/callee', (c) => {
  log('CALLEE-GET', stateLabel());

  const q = new MessageQueue();
  if (calleeQueue) {
    log('CALLEE-GET', 'replacing old callee');
    pushFrame(calleeQueue, encodeFrame('hangup'), 'hangup->old_callee');
  }
  calleeQueue = q;
  log('CALLEE-GET', 'callee connected', stateLabel());

  pushFrame(q, encodeFrame('connected'), 'connected->callee');

  return stream(c, async (s) => {
    let seq = 0;
    try {
      while (true) {
        const data = await q.pop(5000);
        if (data === null) {
          try { await s.write(encodeFrame('heartbeat')); }
          catch (e) { log('CALLEE stream', 'heartbeat write failed:', e); break; }
          continue;
        }
        seq++;
        try { await s.write(data); }
        catch (e) { log('CALLEE stream', 'write error:', e); break; }
      }
    } finally {
      if (calleeQueue === q) calleeQueue = null;
      if (callActive && callerQueue) {
        pushFrame(callerQueue, encodeFrame('hangup'), 'hangup->caller');
        callActive = false;
      }
      log('CALLEE stream', 'cleanup done', stateLabel());
    }
  });
});

// ---- CALLEE data upload / answer ----

app.post('/callee', async (c) => {
  const body = c.req.raw.body;
  log('CALLEE-POST', `body present: ${!!body}`, stateLabel());

  try {
    if (!callActive) {
      log('CALLEE-POST', 'answering call');
      callActive = true;
      if (callerQueue) {
        pushFrame(callerQueue, encodeFrame('call_answered'), 'call_answered->caller');
      }
    }

    if (body && callerQueue) {
      const payload = await readAllChunks(body, 'CALLEE-POST');
      pushFrame(callerQueue, wrapAudio(payload), 'audio(callee->caller)');
    } else {
      log('CALLEE-POST', 'no target or empty body');
    }
  } catch (e) { log('CALLEE-POST', 'error:', e); }
  return c.text('ok');
});

// ---- CALLEE hangup ----

app.delete('/callee', async (c) => {
  log('CALLEE-DELETE', stateLabel());
  if (callActive && callerQueue) {
    pushFrame(callerQueue, encodeFrame('hangup'), 'hangup->caller');
  }
  callActive = false;
  log('CALLEE-DELETE done', stateLabel());
  return c.text('ok');
});

app.notFound((c) => {
  log('404', c.req.method, c.req.path);
  return c.text('Not found', 404);
});

async function readAllChunks(stream: ReadableStream<Uint8Array>, label: string): Promise<Uint8Array> {
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    total += value.length;
  }
  log('READ', `${label}: ${chunks.length} chunks, ${total}B`);
  if (chunks.length === 1) return chunks[0];
  const merged = new Uint8Array(total);
  let offset = 0;
  for (const c of chunks) { merged.set(c, offset); offset += c.length; }
  return merged;
}

const PORT = parseInt(process.env.PORT || '3001');
log('========================================');
log(`Server starting on port ${PORT}`);
log('========================================');

export default {
  port: PORT,
  fetch: app.fetch,
};
