/* eslint-disable no-await-in-loop, import/extensions */
import { expect, test } from '@playwright/test';
import { features } from './header.spec.js';
import FedsHeader from './header.page.js';

const miloLibs = process.env.MILO_LIBS || '';

test.describe('Header Block Test Suite', () => {
  // FEDS Default Header Checks:
  test(`${features[0].name}, ${features[0].tags}`, async ({ page, baseURL }) => {
    const Header = new FedsHeader(page);
    console.info(`[FEDSInfo] Checking page: ${baseURL}${features[0].path}${miloLibs}`);

    await test.step('Navigate to FEDS HEADER page', async () => {
      await page.goto(`${baseURL}${features[0].path}${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[0].path}${miloLibs}`);
    });

    await test.step('Check HEADER block content', async () => {
      // Wait for FEDS GNAV to be visible:
      await Header.mainNavContainer.waitFor({ state: 'visible', timeout: 5000 });
      // Check HEADER block content:
      await expect(Header.mainNavLogo).toBeVisible();

      // skipping the step for PR branch runs
      // working on better workaround soloution
      // await expect(Header.signInButton).toBeVisible();
    });

    await test.step('Check HEADER search component', async () => {
      // adding the below check to accommodate testing on consuming sites
      const isSearchIconVisible = await Header.searchIcon.isVisible();
      if (isSearchIconVisible) {
        await test.step('Check HEADER search component', async () => {
          await Header.openSearchBar();
          await Header.closeSearchBar();
        });
      } else {
        console.info('Search icon is not visible, skipping the search component test.');
      }
    });

    await test.step('Check HEADER block mega menu component', async () => {
      await Header.megaMenuToggle.waitFor({ state: 'visible', timeout: 5000 });
      await Header.megaMenuToggle.click();
      await expect(Header.megaMenuContainer).toBeVisible();
      await Header.megaMenuToggle.click();
      await expect(Header.megaMenuContainer).not.toBeVisible();
    });
  });
});
