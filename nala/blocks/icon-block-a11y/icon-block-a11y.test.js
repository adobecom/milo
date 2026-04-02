import { expect, test } from '@playwright/test';
import { features } from './icon-block-a11y.spec.js';
import IconBlockA11y from './icon-block-a11y.page.js';

const { url } = features[0];

const runA11yCheck = async (page, run) => {
  const block = new IconBlockA11y(page);

  await test.step(`[Run ${run}] Navigate to page`, async () => {
    await page.goto(url);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForSelector('.section[tabindex="0"][aria-label]');
  });

  await test.step(`[Run ${run}] Section has tabindex and aria-label with all names`, async () => {
    const section = block.logoSection;
    await expect(section).toBeVisible();
    await expect(section).toHaveAttribute('tabindex', '0');
    const ariaLabel = await section.getAttribute('aria-label');
    expect(ariaLabel, `[Run ${run}] aria-label should be present`).toBeTruthy();
    const altTexts = await block.iconImages.evaluateAll((imgs) => imgs.map((img) => img.alt).filter(Boolean));
    expect(altTexts.length, `[Run ${run}] Should have multiple images`).toBeGreaterThan(1);
    altTexts.forEach((alt) => {
      expect(ariaLabel, `[Run ${run}] aria-label missing: ${alt}`).toContain(alt);
    });
  });

  await test.step(`[Run ${run}] Tab to section announces all names (group focus)`, async () => {
    const section = block.logoSection;
    await section.focus();
    await expect(section).toBeFocused();
    const ariaLabel = await section.getAttribute('aria-label');
    const altTexts = await block.iconImages.evaluateAll((imgs) => imgs.map((img) => img.alt).filter(Boolean));
    // All names must be in the aria-label announced on focus
    altTexts.forEach((alt) => {
      expect(ariaLabel).toContain(alt);
    });
  });

  await test.step(`[Run ${run}] Individual items are aria-hidden (no double announcement)`, async () => {
    const iconBlocks = block.iconBlocks;
    const count = await iconBlocks.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i += 1) {
      await expect(iconBlocks.nth(i)).toHaveAttribute('aria-hidden', 'true');
    }
  });

  await test.step(`[Run ${run}] No lazy images (alt text available in AT tree on load)`, async () => {
    await expect(block.logoSection.locator('img[loading="lazy"]')).toHaveCount(0);
  });
};

test.describe('Icon Block A11y - NVDA Reading Order (3 runs)', () => {
  test(`[Test Id - ${features[0].tcid}] ${features[0].name}, ${features[0].tags}`, async ({ page }) => {
    for (let run = 1; run <= 3; run += 1) {
      await runA11yCheck(page, run);
    }
  });
});
