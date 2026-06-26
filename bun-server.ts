import { join } from 'path';
import { watch } from 'fs';
import { execSync } from 'child_process';

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

// Track peer connections
let browserSocket: WebSocket | null = null;
let androidSocket: WebSocket | null = null;

async function performBuild(isProduction: boolean) {
  console.log(`[Bun Build] Starting bundling (production: ${isProduction})...`);
  
  const fs = require('fs');
  if (!fs.existsSync('./dist')) {
    fs.mkdirSync('./dist', { recursive: true });
  }

  try {
    console.log('[Bun Build] Compiling Tailwind CSS...');
    execSync('bunx @tailwindcss/cli -i src/index.css -o dist/index.css --minify', { stdio: 'inherit' });
  } catch (error) {
    console.error('[Bun Build] Tailwind compilation failed:', error);
  }

  const cssIgnorePlugin = {
    name: 'css-ignore',
    setup(build: any) {
      build.onResolve({ filter: /\.css$/ }, () => ({ path: 'empty-css', namespace: 'css-ignore' }));
      build.onLoad({ filter: /.*/, namespace: 'css-ignore' }, () => ({ contents: '', loader: 'js' }));
    }
  };

  const pathModule = require('path');
  const sveltePlugin = {
    name: 'svelte',
    setup(build: any) {
      build.onResolve({ filter: /\.svelte$/ }, (args: any) => {
        return { path: pathModule.resolve(pathModule.dirname(args.importer), args.path), namespace: 'svelte' };
      });
      build.onLoad({ filter: /.*/, namespace: 'svelte' }, async (args: any) => {
        const source = require('fs').readFileSync(args.path, 'utf-8');
        const { compile } = await import('svelte/compiler');
        const result = compile(source, { filename: args.path, generate: 'client', dev: !isProduction, css: 'injected' });
        return { contents: result.js.code, loader: 'js' };
      });
    }
  };

  console.log('[Bun Build] Bundling with Bun...');
  const result = await Bun.build({
    entrypoints: ['./src/main.ts'],
    outdir: './dist',
    minify: isProduction,
    naming: "[name].js",
    plugins: [cssIgnorePlugin, sveltePlugin],
    define: { 'process.env.NODE_ENV': JSON.stringify(isProduction ? 'production' : 'development') },
    external: ['svelte/compiler'],
  });

  if (!result.success) {
    console.error('[Bun Build] Bundle failed:', result.logs);
    return false;
  }

  try {
    let html = await Bun.file('./index.html').text();
    html = html.replace('/src/main.ts', '/main.js').replace('src/main.ts', 'main.js');
    if (!html.includes('index.css') && !html.includes('href="/index.css"')) {
      html = html.replace('</head>', '  <link rel="stylesheet" href="/index.css">\n</head>');
    }
    await Bun.write('./dist/index.html', html);
  } catch (err) {
    console.error('[Bun Build] Processing index.html failed:', err);
    return false;
  }

  try {
    if (fs.existsSync('./public')) fs.cpSync('./public', './dist', { recursive: true });
  } catch (err) {
    console.warn('[Bun Build] Copying public folder warning:', err);
  }

  console.log('[Bun Build] Build completed successfully.');
  return true;
}

const isDev = process.argv.includes('--dev');
const isBuild = process.argv.includes('--build');
const isStart = process.argv.includes('--start');

async function startServer() {
  console.log(`[Bun Server] Starting server at http://${HOST}:${PORT}`);
  
  const server = Bun.serve({
    port: PORT,
    hostname: HOST,
    async fetch(req: Request, server: any) {
      const url = new URL(req.url);

      if (url.pathname === '/ws') {
        if (server.upgrade(req)) return;
        return new Response('WebSocket upgrade failed', { status: 400 });
      }

      if (url.pathname === '/support-us') {
        return new Response(null, { status: 301, headers: { Location: '/sponsor' } });
      }

      let pathname = url.pathname;
      if (pathname === '/') pathname = '/index.html';

      const filePath = join(process.cwd(), 'dist', pathname);
      const file = Bun.file(filePath);

      if (await file.exists()) {
        return new Response(file);
      }

      const indexPath = join(process.cwd(), 'dist', 'index.html');
      const indexFile = Bun.file(indexPath);
      if (await indexFile.exists()) return new Response(indexFile);

      return new Response(null, { status: 301, headers: { Location: '/' } });
    },
    websocket: {
      open(ws) {
        console.log('[WebSocket] New peer connected');
      },
      message(ws, message) {
        if (typeof message === 'string') {
          try {
            const signal = JSON.parse(message);
            console.log('[WebSocket] Signal:', signal.type);
            switch (signal.type) {
              case 'register':
                if (signal.role === 'browser') {
                  if (browserSocket && browserSocket !== ws) {
                    try { browserSocket.close(1000, 'Replaced by new browser'); } catch (_) {}
                  }
                  browserSocket = ws;
                  console.log('[WebSocket] Browser registered (total android connected:', androidSocket?.readyState === WebSocket.OPEN ? 'yes' : 'no', ')');
                } else if (signal.role === 'android') {
                  if (androidSocket && androidSocket !== ws) {
                    try { androidSocket.close(1000, 'Replaced by new android'); } catch (_) {}
                  }
                  androidSocket = ws;
                  console.log('[WebSocket] Android registered');
                }
                break;
              case 'call_request':
              case 'call_start':
                browserSocket = ws;
                console.log('[WebSocket] call_start received, browserSocket set. androidSocket state:', androidSocket?.readyState);
                if (androidSocket && androidSocket.readyState === WebSocket.OPEN) {
                  androidSocket.send(JSON.stringify({ type: 'incoming_call' }));
                  console.log('[WebSocket] incoming_call sent to android');
                } else {
                  ws.send(JSON.stringify({ type: 'error', message: 'Android offline' }));
                  console.log('[WebSocket] Android offline - error sent to browser');
                }
                break;
              case 'call_answered':
              case 'call_accepted':
                if (browserSocket && browserSocket.readyState === WebSocket.OPEN) {
                  browserSocket.send(JSON.stringify({ type: 'call_answered' }));
                  console.log('[WebSocket] call_answered forwarded to browser');
                }
                break;
              case 'call_ended':
              case 'hangup':
                console.log('[WebSocket] hangup received');
                if (browserSocket) browserSocket.send(JSON.stringify({ type: 'call_ended' }));
                if (androidSocket) androidSocket.send(JSON.stringify({ type: 'call_ended' }));
                break;
            }
          } catch (e) {
            console.warn('[WebSocket] Malformed signal:', e);
          }
        } else {
          if (ws === browserSocket && androidSocket?.readyState === WebSocket.OPEN) {
            androidSocket.send(message);
          } else if (ws === androidSocket && browserSocket?.readyState === WebSocket.OPEN) {
            browserSocket.send(message);
          }
        }
      },
      close(ws) {
        if (ws === browserSocket) {
          browserSocket = null;
          if (androidSocket) androidSocket.send(JSON.stringify({ type: 'hangup' }));
          console.log('[WebSocket] Browser disconnected');
        } else if (ws === androidSocket) {
          androidSocket = null;
          if (browserSocket) browserSocket.send(JSON.stringify({ type: 'hangup' }));
          console.log('[WebSocket] Android disconnected');
        }
      }
    }
  });
  console.log(`[Bun Server] Server running on port ${PORT}`);
}

if (isBuild) {
  const success = await performBuild(true);
  process.exit(success ? 0 : 1);
}

if (isStart) {
  await startServer();
}

if (isDev) {
  await performBuild(false);
  
  let rebuilding = false;
  const watchDirectories = ['./src', './index.html'];
  
  const debouncedRebuild = () => {
    if (rebuilding) return;
    rebuilding = true;
    setTimeout(async () => {
      try { await performBuild(false); } catch (e) { console.error('[Bun Watcher] Rebuild error:', e); }
      rebuilding = false;
    }, 200);
  };

  watchDirectories.forEach(dir => {
    try {
      watch(dir, { recursive: true }, (event, filename) => {
        if (filename && !filename.startsWith('.') && !filename.includes('dist')) {
          console.log(`[Bun Watcher] File changed: ${filename}`);
          debouncedRebuild();
        }
      });
    } catch (e) {
      console.warn(`[Bun Watcher] Could not watch ${dir}:`, e);
    }
  });

  console.log(`[Bun Server] Development server at http://${HOST}:${PORT}`);
  
  Bun.serve({
    port: PORT,
    hostname: HOST,
    async fetch(req) {
      const url = new URL(req.url);

      if (url.pathname === '/support-us') {
        return new Response(null, { status: 301, headers: { Location: '/sponsor' } });
      }

      let pathname = url.pathname;
      if (pathname === '/') pathname = '/index.html';

      const filePath = join(process.cwd(), 'dist', pathname);
      const file = Bun.file(filePath);

      if (await file.exists()) {
        const headers = new Headers();
        headers.set('Access-Control-Allow-Origin', '*');
        headers.set('Cache-Control', 'no-store, must-revalidate');
        return new Response(file, { headers });
      }

      const indexPath = join(process.cwd(), 'dist', 'index.html');
      const indexFile = Bun.file(indexPath);
      if (await indexFile.exists()) {
        const headers = new Headers();
        headers.set('Access-Control-Allow-Origin', '*');
        headers.set('Cache-Control', 'no-store, must-revalidate');
        return new Response(indexFile, { headers });
      }

      return new Response(null, { status: 301, headers: { Location: '/' } });
    }
  });
}