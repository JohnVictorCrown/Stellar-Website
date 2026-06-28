function log(...args: any[]) {
  const ts = new Date().toISOString();
  console.log(`[${ts}]`, ...args);
}

const PORT = parseInt(process.env.PORT || '3001');
const HOST = process.env.HOST || '0.0.0.0';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

let callerController: ReadableStreamDefaultController<Uint8Array> | null = null;
let calleeController: ReadableStreamDefaultController<Uint8Array> | null = null;
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
  log('encodeControl', type, json.length, 'bytes');
  return buf;
}

function forwardAudio(controller: ReadableStreamDefaultController<Uint8Array> | null, data: Uint8Array) {
  if (!controller) {
    log('forwardAudio: no controller, dropping', data.length, 'bytes');
    return;
  }
  try {
    const len = writeInt32BE(data.length);
    const buf = new Uint8Array(1 + 4 + data.length);
    buf[0] = 1;
    buf.set(len, 1);
    buf.set(data, 5);
    controller.enqueue(buf);
    log('forwardAudio: enqueued', data.length, 'bytes');
  } catch (e) {
    log('forwardAudio: enqueue failed:', e);
  }
}

function hangupAll() {
  log('hangupAll: starting');
  [callerController, calleeController].forEach((ctrl, i) => {
    if (ctrl) {
      try {
        ctrl.enqueue(encodeControl('hangup'));
        ctrl.close();
        log('hangupAll: closed controller', i);
      } catch (e) {
        log('hangupAll: error closing controller', i, e);
      }
    }
  });
  callerController = null;
  calleeController = null;
  callActive = false;
  log('hangupAll: done, callActive=false');
}

function makeStream(label: string): ReadableStream<Uint8Array> {
  log('makeStream: creating stream for', label);
  let controller: ReadableStreamDefaultController<Uint8Array> | null = null;
  const stream = new ReadableStream({
    start(ctrl) {
      controller = ctrl;
      log('makeStream: stream started, controller assigned for', label);
      if (label === 'caller') {
        callerController = ctrl;
        log('makeStream: callerController set');
        if (calleeController) {
          log('makeStream: callee already connected, sending incoming_call');
          try { calleeController.enqueue(encodeControl('incoming_call')); } catch (e) {
            log('makeStream: incoming_call enqueue failed:', e);
          }
        }
      } else if (label === 'callee') {
        calleeController = ctrl;
        log('makeStream: calleeController set');
      }
    },
    cancel() {
      log('makeStream: stream cancelled for', label);
      if (label === 'caller') {
        callerController = null;
        log('makeStream: callerController cleared');
        if (callActive) hangupAll();
      } else if (label === 'callee') {
        calleeController = null;
        log('makeStream: calleeController cleared');
        if (callActive) hangupAll();
      }
    }
  });
  return stream;
}

function respond(body: string | ReadableStream<Uint8Array>, status = 200): Response {
  const headers: Record<string, string> = { ...CORS_HEADERS };
  if (body instanceof ReadableStream) {
    headers['Content-Type'] = 'application/octet-stream';
  }
  log('respond: status=' + status + ' type=' + (typeof body));
  return new Response(body, { status, headers });
}

Bun.serve({
  port: PORT,
  hostname: HOST,
  async fetch(req: Request) {
    const url = new URL(req.url);
    const method = req.method;
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    log(`--> ${method} ${url.pathname} from ${ip}`);

    try {
      // CORS preflight
      if (method === 'OPTIONS') {
        log('OPTIONS: returning CORS headers');
        return new Response(null, { headers: CORS_HEADERS });
      }

      // ---- CALLER endpoints ----

      if (url.pathname === '/caller' && method === 'GET') {
        if (callerController) {
          log('GET /caller: conflict, caller already connected');
          return respond('Call already in progress', 409);
        }
        log('GET /caller: creating caller stream');
        return respond(makeStream('caller'));
      }

      if (url.pathname === '/caller' && method === 'POST') {
        if (!req.body) {
          log('POST /caller: no body');
          return respond('No body', 400);
        }
        log('POST /caller: reading body');
        const reader = req.body.getReader();
        (async () => {
          let totalBytes = 0;
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              log('POST /caller: done reading, total', totalBytes, 'bytes forwarded to callee');
              break;
            }
            totalBytes += value.length;
            log('POST /caller: read chunk', value.length, 'bytes (total', totalBytes + ')');
            if (callActive) {
              forwardAudio(calleeController, value);
            } else {
              log('POST /caller: call not active, dropping chunk');
            }
          }
        })();
        log('POST /caller: returning ok');
        return respond('ok');
      }

      if (url.pathname === '/caller' && method === 'DELETE') {
        log('DELETE /caller: hanging up');
        hangupAll();
        return respond('ok');
      }

      // ---- CALLEE endpoints ----

      if (url.pathname === '/callee' && method === 'GET') {
        if (calleeController) {
          log('GET /callee: conflict, callee already connected');
          return respond('Already connected', 409);
        }
        log('GET /callee: creating callee stream');
        return respond(makeStream('callee'));
      }

      if (url.pathname === '/callee' && method === 'POST') {
        if (!req.body) {
          log('POST /callee: no body');
          return respond('No body', 400);
        }

        if (!callActive) {
          log('POST /callee: first POST -> answering call');
          callActive = true;
          if (callerController) {
            try {
              callerController.enqueue(encodeControl('call_answered'));
              log('POST /callee: sent call_answered to caller');
            } catch (e) {
              log('POST /callee: call_answered enqueue failed:', e);
            }
          } else {
            log('POST /callee: no callerController to send call_answered');
          }
        } else {
          log('POST /callee: call already active');
        }

        log('POST /callee: reading body');
        const reader = req.body.getReader();
        (async () => {
          let totalBytes = 0;
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              log('POST /callee: done reading, total', totalBytes, 'bytes forwarded to caller');
              break;
            }
            totalBytes += value.length;
            log('POST /callee: read chunk', value.length, 'bytes (total', totalBytes + ')');
            forwardAudio(callerController, value);
          }
        })();
        return respond('ok');
      }

      if (url.pathname === '/callee' && method === 'DELETE') {
        log('DELETE /callee: hanging up');
        hangupAll();
        return respond('ok');
      }

      log('404: unknown path', url.pathname);
      return respond('Not found', 404);
    } catch (e) {
      log('ERROR in fetch handler:', e);
      return new Response('Internal Server Error', {
        status: 500,
        headers: CORS_HEADERS
      });
    }
  }
});

log(`Server started on http://${HOST}:${PORT}`);
