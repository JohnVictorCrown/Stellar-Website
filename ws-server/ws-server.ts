import { Hono } from 'hono';
import { stream } from 'hono/streaming';
import { cors } from 'hono/cors';

function log(...args: any[]) {
  const ts = new Date().toISOString();
  console.log(`[${ts}]`, ...args);
}

interface StreamPair {
  writable: WritableStream<Uint8Array>;
}

let callerPair: StreamPair | null = null;
let calleePair: StreamPair | null = null;
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

function encodeControl(type: string): Uint8Array {
  const json = JSON.stringify({ type });
  const text = encoder.encode(json);
  const len = writeInt32BE(text.length);
  const buf = new Uint8Array(1 + 4 + text.length);
  buf[0] = 0;
  buf.set(len, 1);
  buf.set(text, 5);
  log('encodeControl:', type, '-', text.length, 'bytes');
  return buf;
}

async function writeFrame(writable: WritableStream<Uint8Array> | null, frame: Uint8Array) {
  if (!writable) {
    log('writeFrame: no writable, dropping frame');
    return;
  }
  try {
    const writer = writable.getWriter();
    await writer.write(frame);
    writer.releaseLock();
    log('writeFrame: wrote', frame.length, 'bytes');
  } catch (e) {
    log('writeFrame: write failed:', e);
  }
}

async function hangupAll() {
  log('hangupAll: starting');
  const hangup = encodeControl('hangup');
  if (callerPair) {
    try {
      await writeFrame(callerPair.writable, hangup);
      await callerPair.writable.close();
      log('hangupAll: closed caller writable');
    } catch (e) {
      log('hangupAll: caller writable close error:', e);
    }
  }
  if (calleePair) {
    try {
      await writeFrame(calleePair.writable, hangup);
      await calleePair.writable.close();
      log('hangupAll: closed callee writable');
    } catch (e) {
      log('hangupAll: callee writable close error:', e);
    }
  }
  callerPair = null;
  calleePair = null;
  callActive = false;
  log('hangupAll: done, callActive=false');
}

const app = new Hono();

app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type'],
}));

// ---- CALLER ----

app.get('/caller', (c) => {
  if (callerPair) {
    log('GET /caller: conflict');
    return c.text('Call already in progress', 409);
  }
  const ts = new TransformStream<Uint8Array>();
  callerPair = { writable: ts.writable };
  log('GET /caller: callerPair set');

  writeFrame(callerPair.writable, encodeControl('connected'));

  if (calleePair) {
    writeFrame(calleePair.writable, encodeControl('incoming_call'));
  }

  return stream(c, async (stream) => {
    const reader = ts.readable.getReader();
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        await stream.write(value);
      }
    } catch (e) {
      log('GET /caller stream error:', e);
    } finally {
      reader.releaseLock();
      log('GET /caller stream ended');
    }
  });
});

app.post('/caller', async (c) => {
  const body = c.req.raw.body;
  if (!body) return c.text('No body', 400);
  log('POST /caller: reading body');
  const reader = body.getReader();
  let totalBytes = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      log('POST /caller: done reading, total', totalBytes, 'bytes');
      break;
    }
    totalBytes += value.length;
    log('POST /caller: chunk', value.length, 'bytes (total', totalBytes + ')');
    if (callActive) {
      forwardAudio(calleePair?.writable ?? null, value);
    } else {
      log('POST /caller: call not active, dropping chunk');
    }
  }
  return c.text('ok');
});

app.delete('/caller', async (c) => {
  log('DELETE /caller');
  await hangupAll();
  return c.text('ok');
});

// ---- CALLEE ----

app.get('/callee', (c) => {
  if (calleePair) {
    log('GET /callee: conflict');
    return c.text('Already connected', 409);
  }
  const ts = new TransformStream<Uint8Array>();
  calleePair = { writable: ts.writable };
  log('GET /callee: calleePair set');

  writeFrame(calleePair.writable, encodeControl('connected'));

  return stream(c, async (stream) => {
    const reader = ts.readable.getReader();
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        await stream.write(value);
      }
    } catch (e) {
      log('GET /callee stream error:', e);
    } finally {
      reader.releaseLock();
      log('GET /callee stream ended');
    }
  });
});

app.post('/callee', async (c) => {
  const body = c.req.raw.body;
  if (!body) return c.text('No body', 400);

  if (!callActive) {
    log('POST /callee: first POST -> answering call');
    callActive = true;
    if (callerPair) {
      await writeFrame(callerPair.writable, encodeControl('call_answered'));
      log('POST /callee: sent call_answered to caller');
    }
  }

  log('POST /callee: reading body');
  const reader = body.getReader();
  let totalBytes = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      log('POST /callee: done reading, total', totalBytes, 'bytes');
      break;
    }
    totalBytes += value.length;
    log('POST /callee: chunk', value.length, 'bytes (total', totalBytes + ')');
    forwardAudio(callerPair?.writable ?? null, value);
  }
  return c.text('ok');
});

app.delete('/callee', async (c) => {
  log('DELETE /callee');
  await hangupAll();
  return c.text('ok');
});

app.notFound((c) => {
  log('404:', c.req.path);
  return c.text('Not found', 404);
});

function forwardAudio(writable: WritableStream<Uint8Array> | null, data: Uint8Array) {
  if (!writable) {
    log('forwardAudio: no writable, dropping', data.length, 'bytes');
    return;
  }
  try {
    const len = writeInt32BE(data.length);
    const buf = new Uint8Array(1 + 4 + data.length);
    buf[0] = 1;
    buf.set(len, 1);
    buf.set(data, 5);
    writeFrame(writable, buf);
    log('forwardAudio: forwarded', data.length, 'bytes');
  } catch (e) {
    log('forwardAudio: error:', e);
  }
}

const PORT = parseInt(process.env.PORT || '3001');
log(`Server started on port ${PORT}`);

export default {
  port: PORT,
  fetch: app.fetch,
};
