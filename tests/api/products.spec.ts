import { test, expect } from '@playwright/test';

/**
 * Hits the lab's local catalog provider (not Fake Store).
 * Start it with: npm run provider:start
 * CI starts the provider before this job.
 */
test.describe('Catalog API — products', () => {
  test('GET /api/products returns 200 and a valid catalog payload', async ({ request }) => {
    const response = await request.get('/api/products');

    expect(response.status()).toBe(200);
    expect(response.ok()).toBeTruthy();

    const body = await response.json();
    expect(Array.isArray(body.products)).toBeTruthy();
    expect(body.products.length).toBeGreaterThan(0);
    expect(body.count).toBeGreaterThan(0);

    const first = body.products[0];
    expect(first).toMatchObject({
      id: expect.any(Number),
      title: expect.any(String),
      price: expect.any(Number),
      category: expect.any(String),
      image: expect.any(String),
    });
  });
});
