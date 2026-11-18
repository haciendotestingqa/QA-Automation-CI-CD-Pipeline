import path from 'node:path';
import { PactV3, MatchersV3 } from '@pact-foundation/pact';
import { describe, expect, it } from 'vitest';

const { like, eachLike } = MatchersV3;

/** Consumer 1 — simulates a web shop client. */
const provider = new PactV3({
  consumer: 'web-shop',
  provider: 'catalog-api',
  dir: path.resolve(__dirname, 'pacts'),
});

describe('web-shop → catalog-api', () => {
  it('GET /api/products', async () => {
    provider
      .given('catalog exists')
      .uponReceiving('a web-shop request for products')
      .withRequest({ method: 'GET', path: '/api/products' })
      .willRespondWith({
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: {
          products: eachLike({
            id: like(1),
            title: like('Fjallraven Backpack'),
            price: like(109.95),
            category: like('bags'),
          }),
          count: like(2),
        },
      });

    await provider.executeTest(async (mockServer) => {
      const res = await fetch(`${mockServer.url}/api/products`);
      expect(res.status).toBe(200);
      const data = (await res.json()) as { products: unknown[]; count: number };
      expect(data.products.length).toBeGreaterThan(0);
      expect(data.count).toBeGreaterThan(0);
    });
  });
});
