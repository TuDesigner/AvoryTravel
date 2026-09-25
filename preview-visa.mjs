// Server tĩnh tối giản để xem thử landing page này.
// Chạy bằng node.exe đi kèm Adobe (máy này không có Node/npm trên PATH).
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('.', import.meta.url));
const PORT = 4327;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
};

createServer(async (req, res) => {
  const url = decodeURIComponent((req.url || '/').split('?')[0]);
  const rel = normalize(url === '/' ? 'index.html' : url.replace(/^\/+/, ''));

  if (rel.startsWith('..')) {
    res.writeHead(403).end('Forbidden');
    return;
  }

  try {
    const body = await readFile(join(ROOT, rel));
    res.writeHead(200, {
      'Content-Type': TYPES[extname(rel).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': 'no-store',
    }).end(body);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Not found');
  }
}).listen(PORT, () => console.log(`Avory visa landing on http://127.0.0.1:${PORT}`));
