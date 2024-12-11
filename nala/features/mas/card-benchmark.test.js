import { expect, test } from '@playwright/test';

test.describe('Merch Card benchmark passes', () => {
  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    // heating CDN cache without filling browser cache
    await page.goto('/libs/features/mas/docs/benchmarks.html');
    page.close();
    // Create a new context (clears cache automatically)
    await browser.newContext();
  });

  test('@mas-benchmark-ccd', {
    path: '/libs/features/mas/docs/benchmarks.html',
    tag: '@mas-ccd @mas-benchmark @suggested-card @commerce @smoke @regression @milo',
  }, async ({ page }) => {
    await page.goto('/libs/features/mas/docs/benchmarks.html');
    const container = page.locator('.ccd-cards');
    await page.waitForTimeout(5000);
    const limit = await container.getAttribute('data-benchmark-limit');
    const times = await page.locator('.ccd-cards .benchmark-mask')
      .evaluateAll((nodes) => nodes.map((node) => {
        const time = node.getAttribute('data-benchmark-time');
        console.log(time);
        return time;
      }));
    console.log(times);
    expect(times.length).toBeGreaterThan(0);
    times.forEach((time) => {
      expect(parseFloat(time) < parseFloat(limit), `${time}ms should be less than limit ${limit}ms`).toBeTruthy();
    });
  });
});
