import http from 'node:http';

/**
 * Tiny educational provider for API + Pact labs.
 * Serves a stable catalog so CI does not depend on Fake Store / Cloudflare.
 */
const PORT = Number(process.env.PROVIDER_PORT || 4010);
// Local default: loopback only. Docker/CD sets PROVIDER_HOST=0.0.0.0 so the container accepts traffic.
const HOST = process.env.PROVIDER_HOST || '127.0.0.1';

const products = [
  {
    id: 1,
    title: 'Fjallraven Backpack',
    price: 109.95,
    description: 'Perfect for everyday use',
    category: 'bags',
    image: 'https://example.com/backpack.jpg',
  },
  {
    id: 2,
    title: 'Mens Casual T-Shirt',
    price: 22.3,
    description: 'Slim-fitting style',
    category: 'clothing',
    image: 'https://example.com/tshirt.jpg',
  },
];

const server = http.createServer((req, res) => {
  const url = new URL(req.url || '/', `http://${req.headers.host}`);

  if (req.method === 'GET' && (url.pathname === '/health' || url.pathname === '/api/health')) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true }));
    return;
  }

  if (req.method === 'GET' && url.pathname === '/api/products') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ products, count: products.length }));
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'not found' }));
});

server.listen(PORT, HOST, () => {
  console.log(`Lab provider listening on http://${HOST}:${PORT}`);
});
