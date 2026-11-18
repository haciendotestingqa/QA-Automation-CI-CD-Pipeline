import path from 'node:path';
import { PactV3, MatchersV3 } from '@pact-foundation/pact';
import { describe, expect, it } from 'vitest';

const { like, eachLike } = MatchersV3;

/**
 * Consumer 2 — simulates a mobile shop client.
 * Same provider, slightly different expectations (multi-consumer lesson).
 */
const provider = new PactV3({
  consumer: 'mobile-shop',
  provider: 'catalog-api',
  dir: path.resolve(__dirname, 'pacts'),
});

describe('mobile-shop → catalog-api', () => {
  it('GET /api/products', async () => {
    provider
      .given('catalog exists')
      .uponReceiving('a mobile-shop request for products')
      .withRequest({ method: 'GET', path: '/api/products' })
      .willRespondWith({
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: {
          products: eachLike({
            id: like(1),
            title: like('Fjallraven Backpack'),
            price: like(109.95),
            image: like('https://example.com/backpack.jpg'),
          }),
          count: like(2),
        },
      });

    await provider.executeTest(async (mockServer) => {
      const res = await fetch(`${mockServer.url}/api/products`);
      expect(res.status).toBe(200);
      const data = (await res.json()) as { products: Array<{ image?: string }> };
      expect(data.products[0]?.image).toBeTruthy();
    });
  });
});
