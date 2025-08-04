import { expect, test } from '@playwright/test';
import { features } from './benchmark.spec.js';
import BenchmarkPage from './benchmark.page.js';

const miloLibs = process.env.MILO_LIBS || '';

test.beforeAll(async ({ browser, baseURL }) => {
  // Load the benchmarks page 3 times in parallel with 10-second timeout
  const testPage = `${baseURL}/libs/features/mas/docs/benchmarks.html`;
  console.info('[Preloading Benchmark Page]: ', testPage);

  // Create a new browser context for preloading
  const context = await browser.newContext();

  // Create 3 parallel page loads
  const loadPromises = Array.from({ length: 10 }, async (_, i) => {
    console.info(`[Preload ${i + 1}/10]: Starting parallel load`);
    const newPage = await context.newPage();
    await newPage.goto(testPage);
    await newPage.waitForLoadState('load');
    console.info(`[Preload ${i + 1}/10]: Load completed`);
    return newPage;
  });

  loadPromises.push(
    new Promise((resolve) => {
      setTimeout(() => {
        console.info('[Preload Timeout]: 10 seconds reached, proceeding with loaded pages');
        resolve();
      }, 10000);
    }),
  );

  try {
    await Promise.allSettled(loadPromises);
    console.info('[Preload Complete]: All 3 parallel loads finished successfully');
    // Close the context
    await context.close();
  } catch (error) {
    console.error('[Preload Error]:', error.message);
    // Make sure to close context even if there's an error
    await context.close();
    throw error;
  }
});

test.beforeEach(async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'Not supported to run on multiple browsers.');
  if (browserName === 'chromium') {
    await page.setExtraHTTPHeaders({ 'sec-ch-ua': '"Chromium";v="123", "Not:A-Brand";v="8"' });
  }
  // disabling cache
  await page.route('**', (route) => route.continue());
});

test.describe('Benchmark feature test suite', () => {
  test(`${features[0].name},${features[0].tags}`, async ({ page, baseURL }) => {
    const testPage = `${baseURL}${features[0].path}${miloLibs}`;
    console.info('[Test Page]: ', testPage);

    await test.step('step-1: Go to Merch Card Benchmark feature test page', async () => {
      await page.goto(testPage);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[0].path}`);
    });

    await test.step('step-2: Validate benchmark', async () => {
      const selector = '.ccd-slice';
      const benchmarkPage = new BenchmarkPage(page);
      const benchmark = await benchmarkPage.getBenchmark(selector);
      await expect(benchmark).toBeVisible();
      const limit = await benchmark.getAttribute('data-benchmark-limit');
      const previousLimit = await benchmark.getAttribute('data-benchmark-previous-limit');
      const limitMessage = previousLimit ? `${limit}ms (adjusted from ${previousLimit}ms)` : `${limit}ms`;
      const masks = await benchmarkPage.getMasks(selector);
      await expect(await masks.first()).toBeVisible();
      const times = await masks.evaluateAll((nodes) => nodes.map((node) => {
        const time = node.getAttribute('data-benchmark-time');
        console.log(time);
        return time;
      }));

      console.log(times);
      expect(times.length).toBeGreaterThan(0);
      times.forEach((time) => {
        expect(parseFloat(time) < parseFloat(limit), `${time}ms should be less than limit ${limitMessage}`).toBeTruthy();
      });
    });
  });
});
