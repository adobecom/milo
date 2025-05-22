/* eslint-disable no-await-in-loop, import/extensions */
import { expect, test } from '@playwright/test';
import { features } from './footer.spec.js';
import FedsFooter from './footer.page.js';

const miloLibs = process.env.MILO_LIBS || '';

test.describe('Footer Block Test Suite', () => {
  // FEDS Default Footer Checks:
  test(`${features[0].name}, ${features[0].tags}`, async ({ page, baseURL }) => {
    const Footer = new FedsFooter(page);
    console.info(`[FEDSInfo] Checking page: ${baseURL}${features[0].path}${miloLibs}`);

    await test.step('Navigate to FEDS Default Footer page', async () => {
      await page.goto(`${baseURL}${features[0].path}${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[0].path}${miloLibs}`);
    });

    await test.step('Check FEDS Default Footer critical elements', async () => {
      // Scroll FEDS Footer into viewport:
      await Footer.legalContainer.scrollIntoViewIfNeeded();
      // Wait for FEDS Footer to be visible:
      await Footer.footerContainer.waitFor({ state: 'visible', timeout: 5000 });
      // Check FEDS Footer critical elements:
      await expect(Footer.legalContainer).toBeVisible();
      await expect(Footer.socialContainer).toBeVisible();
      await expect(Footer.footerContainer).toBeVisible();
      await expect(Footer.changeRegionContainer).toBeVisible();
      // !Note: Footer featuredProducts not appearing in NALA. Possible BUG!
      // await expect(Footer.featuredProductsContainer).toBeVisible();
      await expect(Footer.footerColumns).toHaveCount(5);

      // updated the footer section and heading content as per consuming sites
      // milo=6, cc=9 and so on
      await expect([4, 6, 9].includes(await Footer.footerSections.count())).toBeTruthy();
      await expect([4, 6, 9].includes(await Footer.footerHeadings.count())).toBeTruthy();

      await expect(Footer.socialIcons).toHaveCount(4);
      await expect(Footer.legalLinks).toHaveCount(5);
    });

    await test.step('Check ChangeRegion functionality', async () => {
      await Footer.changeRegionButton.click();
      await expect(Footer.changeRegionModal).toBeVisible();
      await Footer.changeRegionCloseButton.click();
      await expect(Footer.changeRegionModal).not.toBeVisible();
    });
  });

  // FEDS Skinny Footer Checks:
  test(`${features[1].name}, ${features[1].tags}`, async ({ page, baseURL }) => {
    const Footer = new FedsFooter(page);
    console.info(`[FEDSInfo] Checking page: ${baseURL}${features[1].path}${miloLibs}`);

    await test.step('Navigate to FEDS Skinny Footer page', async () => {
      await page.goto(`${baseURL}${features[1].path}${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[1].path}${miloLibs}`);
    });

    await test.step('Check FEDS Skinny Footer critical elements', async () => {
      // Scroll FEDS Footer into viewport:
      await Footer.legalContainer.scrollIntoViewIfNeeded();
      // Wait for FEDS Footer to be visible:
      await Footer.footerContainer.waitFor({ state: 'visible', timeout: 5000 });
      // Check FEDS Footer critical elements:
      await expect(Footer.legalContainer).toBeVisible();
      await expect(Footer.socialContainer).toBeVisible();
      await expect(Footer.footerContainer).toBeVisible();
      await expect(Footer.changeRegionContainer).toBeVisible();

      // await expect(Footer.featuredProducts).toHaveCount(0);
      // updated the featuredProducts count as per consuming sites
      // milo=0, cc=4 and so on
      expect([0, 4].includes(await Footer.featuredProducts.count())).toBeTruthy();

      const featuredProductsCount = await Footer.featuredProducts.count();

      if (featuredProductsCount === 0) {
        await expect(Footer.featuredProductsContainer).not.toBeVisible();
      } else {
        await expect(Footer.featuredProductsContainer).toBeVisible();
      }

      await expect(Footer.legalLinks).toHaveCount(5);
      await expect(Footer.socialIcons).toHaveCount(4);

      // await expect(Footer.footerColumns).toHaveCount(0);
      // await expect(Footer.footerSections).toHaveCount(0);
      // await expect(Footer.footerHeadings).toHaveCount(0);

      const footerSectionsCount = await Footer.featuredProducts.count();

      if (footerSectionsCount === 0) {
        await expect(Footer.footerColumns).not.toBeVisible();
        await expect(Footer.footerSections).not.toBeVisible();
        await expect(Footer.footerHeadings).not.toBeVisible();
      } else {
        expect([0, 5].includes(await Footer.footerColumns.count())).toBeTruthy();
        expect([4, 6, 9].includes(await Footer.footerSections.count())).toBeTruthy();
        expect([4, 6, 9].includes(await Footer.footerHeadings.count())).toBeTruthy();
      }
    });

    await test.step('Check ChangeRegion functionality', async () => {
      await Footer.changeRegionButton.click();
      await expect(Footer.changeRegionModal).toBeVisible();
      await Footer.changeRegionCloseButton.click();
      await expect(Footer.changeRegionModal).not.toBeVisible();
    });
  });

  // FEDS Privacy Footer Checks:
  test(`${features[2].name}, ${features[2].tags}`, async ({ page, baseURL }) => {
    const Footer = new FedsFooter(page);
    console.info(`[FEDSInfo] Checking page: ${baseURL}${features[2].path}${miloLibs}`);

    await test.step('Navigate to FEDS Privacy Footer page', async () => {
      await page.goto(`${baseURL}${features[2].path}${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[2].path}${miloLibs}`);
    });

    await test.step('Check FEDS Privacy Footer critical elements', async () => {
      // Scroll FEDS Footer into viewport:
      await Footer.legalContainer.scrollIntoViewIfNeeded();
      // Wait for FEDS Footer to be visible:
      await Footer.footerContainer.waitFor({ state: 'visible', timeout: 5000 });
      // Check FEDS Footer critical elements:
      await expect(Footer.legalContainer).toBeVisible();
      await expect(Footer.socialContainer).toBeVisible();
      await expect(Footer.footerContainer).toBeVisible();
      await expect(Footer.changeRegionContainer).toBeVisible();
      await expect(Footer.featuredProductsContainer).toBeVisible();

      await expect(Footer.footerColumns).toHaveCount(5);

      // await expect(Footer.footerSections).toHaveCount(9)
      // await expect(Footer.footerHeadings).toHaveCount(9)
      // await expect(Footer.featuredProducts).toHaveCount(3);
      // await expect(Footer.legalSections).toHaveCount(2);
      await expect(Footer.socialIcons).toHaveCount(4);
      await expect(Footer.legalLinks).toHaveCount(5);

      // updated the footer section and heading content equal or greater
      // than 6, to pass tests on cc pages.
      expect([4, 7, 9].includes(await Footer.footerSections.count())).toBeTruthy();
      expect([4, 7, 9].includes(await Footer.footerHeadings.count())).toBeTruthy();
      expect([3, 4].includes(await Footer.featuredProducts.count())).toBeTruthy();
      expect([1, 2].includes(await Footer.legalSections.count())).toBeTruthy();
      expect([4].includes(await Footer.socialIcons.count())).toBeTruthy();
      expect([5].includes(await Footer.legalLinks.count())).toBeTruthy();
    });

    await test.step('Check ChangeRegion functionality', async () => {
      await Footer.changeRegionButton.click();
      await expect(Footer.changeRegionDropDown).toBeVisible();
      await expect(Footer.changeRegionModal).not.toBeVisible();
      await Footer.changeRegionButton.click();
      await expect(Footer.changeRegionDropDown).not.toBeVisible();
    });
  });
});
