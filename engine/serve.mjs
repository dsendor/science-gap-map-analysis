#!/usr/bin/env node
// Serve app/out for local review, with caching turned off.
//
// Why this exists rather than `python3 -m http.server`: that server answers
// conditional requests with 304, and a browser then keeps showing a page that was
// rebuilt minutes ago. Reviewing prose against a stale build wastes the review, and
// it did twice before this file existed. Every response here is no-store.
//
// Usage: node engine/serve.mjs [port]   (default 4322, over app/out)
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, normalize } from 'node:path';

const root = new URL('../app/out/', import.meta.url).pathname;
const port = Number(process.argv[2] ?? 4322);

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.csv': 'text/csv; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon',
  '.woff2': 'font/woff2', '.txt': 'text/plain; charset=utf-8',
};

const isDir = async (p) => { try { return (await stat(p)).isDirectory(); } catch { return false; } };

createServer(async (req, res) => {
  // Strip the query, decode, and refuse anything that climbs out of app/out.
  const url = decodeURIComponent((req.url ?? '/').split('?')[0]);
  let path = normalize(join(root, url));
  if (!path.startsWith(root)) {
    res.writeHead(403).end('forbidden');
    return;
  }
  if (await isDir(path)) path = join(path, 'index.html');
  try {
    const body = await readFile(path);
    res.writeHead(200, {
      'content-type': TYPES[extname(path)] ?? 'application/octet-stream',
      'cache-control': 'no-store, must-revalidate',
    });
    res.end(body);
  } catch {
    let notFound = '404';
    try { notFound = await readFile(join(root, '404.html'), 'utf8'); } catch {}
    res.writeHead(404, { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' });
    res.end(notFound);
  }
}).listen(port, () => console.log(`serving app/out on http://localhost:${port} (no-store)`));
