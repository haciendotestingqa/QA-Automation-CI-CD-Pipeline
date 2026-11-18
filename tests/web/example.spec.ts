import { test, expect } from '@playwright/test';

test.describe('Playwright.dev — onboarding docs', () => {
  test('visits home, opens Get started, and lands on /docs/intro', async ({ page }) => {
    await page.goto('https://playwright.dev/');

    await expect(page).toHaveTitle(/Playwright/);

    await page.getByRole('link', { name: 'Get started' }).click();

    await expect(page).toHaveURL(/.*\/docs\/intro/);
  });
});
