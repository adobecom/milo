import { expect, test } from '@playwright/test';
import { features } from './three-in-one.spec.js';
import ThreeInOne from './three-in-one.page.js';

const miloLibs = process.env.MILO_LIBS || '';

test.describe('ThreeInOne Block test suite', () => {
  test.beforeEach(async ({ page, browserName }) => {
    if (browserName === 'chromium') {
      await page.setExtraHTTPHeaders({ 'sec-ch-ua': '"Chromium";v="123", "Not:A-Brand";v="8"' });
    }
  });

  test(`${features[0].name}, ${features[0].tags}`, async ({ page, baseURL }) => {
    const threeInOne = new ThreeInOne(page);
    console.info(`[Test Page]: ${baseURL}${features[0].path}${miloLibs}`);

    await test.step('Navigate to page with ThreeInOne CTAs', async () => {
      await page.goto(`${baseURL}${features[0].path}${features[0].browserParams}&${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[0].path}${features[0].browserParams}&${miloLibs}`);
    });

    await test.step('Validate if each CTA is visible and has proper href', async () => {
      for (const { el, href } of Object.values(threeInOne.ctas)) {
        await expect(el).toBeVisible();
        await expect(el).toHaveAttribute('href', href);
      }
    });
  });

  test(`${features[1].name}, ${features[1].tags}`, async ({ page, baseURL }) => {
    const threeInOne = new ThreeInOne(page);
    console.info(`[Test Page]: ${baseURL}${features[1].path}${miloLibs}`);

    await test.step('Navigate to page with ThreeInOne Fallback CTAs', async () => {
      await page.goto(`${baseURL}${features[1].path}${features[0].browserParams}&${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
    });

    const useCases = [
      {
        sectionId: 'modal-twp-fallback-twp',
        attributes: {
          'data-modal': 'twp',
          href: 'https://commerce.adobe.com/store/segmentation?cli=adobe_com&ctx=fp&co=US&lang=en&ms=COM&ot=TRIAL&pa=phsp_direct_individual',
          'aria-label': 'Free trial - PHOTOSHOP - INDIVIDUAL',
        },
      },
      {
        sectionId: 'modal-d2p-fallback-d2p',
        attributes: {
          'data-modal': 'd2p',
          href: 'https://commerce.adobe.com/store/segmentation?cli=adobe_com&ctx=fp&co=US&lang=en&ms=COM&ot=BASE&pa=phsp_direct_individual',
          'aria-label': 'Buy now - PHOTOSHOP - INDIVIDUAL',
        },
      },
      {
        sectionId: 'modal-d2p-fallback-crm',
        attributes: {
          'data-modal': 'd2p',
          href: 'https://commerce.adobe.com/store/segmentation?cli=adobe_com&ctx=fp&co=US&lang=en&ms=COM&ot=BASE&pa=ccsn_direct_individual',
          'aria-label': 'Buy now - CREATIVE CLOUD ALL APPS - INDIVIDUAL',
        },
      },
      {
        sectionId: 'modal-crm-fallback-twp',
        attributes: {
          'data-modal': 'crm',
          href: 'https://commerce.adobe.com/store/segmentation?cli=adobe_com&ctx=fp&co=US&lang=en&ms=COM&ot=TRIAL&pa=phsp_direct_individual',
          'aria-label': 'Free trial - PHOTOSHOP - INDIVIDUAL',
        },
      },
      {
        sectionId: 'modal-crm-fallback-crm',
        attributes: {
          'data-modal': 'crm',
          href: 'https://commerce.adobe.com/store/segmentation?cli=adobe_com&ctx=fp&co=US&lang=en&ms=COM&ot=BASE&pa=ccsn_direct_individual',
          'aria-label': 'Buy now - CREATIVE CLOUD ALL APPS - INDIVIDUAL',
        },
      },
      {
        sectionId: 'deeplink-students',
        attributes: {
          'data-modal': 'twp',
          href: 'https://commerce.adobe.com/store/segmentation?cli=adobe_com&ctx=fp&co=US&lang=en&ms=EDU&ot=TRIAL&pa=ccsn_direct_individual',
          'aria-label': 'Free trial - CREATIVE CLOUD ALL APPS - STUDENTS AND TEACHERS',
        },
      },
      {
        sectionId: 'deeplink-business',
        attributes: {
          'data-modal': 'twp',
          href: 'https://commerce.adobe.com/store/segmentation?cli=adobe_com&ctx=fp&co=US&lang=en&ms=COM&ot=TRIAL&pa=phsp_direct_indirect_team',
          'aria-label': 'Free trial - PHOTOSHOP - BUSINESS',
        },
      },
      {
        sectionId: 'deeplink-students-override',
        attributes: {
          'data-modal': 'crm',
          href: 'https://commerce.adobe.com/store/segmentation?cli=adobe_com&ctx=fp&co=US&lang=en&ms=COM&ot=BASE&pa=phsp_direct_individual',
          'aria-label': 'Buy now - PHOTOSHOP - INDIVIDUAL',
          'data-extra-options': '{"ms":"e"}',
        },
      },
      {
        sectionId: 'deeplink-business-override',
        attributes: {
          'data-modal': 'crm',
          href: 'https://commerce.adobe.com/store/segmentation?cs=t&cli=adobe_com&ctx=fp&co=US&lang=en&ms=COM&ot=BASE&pa=phsp_direct_individual',
          'aria-label': 'Buy now - PHOTOSHOP - INDIVIDUAL',
          'data-extra-options': '{"cs":"t"}',
        },
      },
      {
        sectionId: 'deeplink-promoid',
        attributes: {
          'data-modal': 'crm',
          href: 'https://commerce.adobe.com/store/segmentation?cli=adobe_com&ctx=fp&co=US&promoid=K42KVSWP&mv=other&lang=en&ms=COM&ot=BASE&pa=phsp_direct_individual',
          'aria-label': 'Buy now - PHOTOSHOP - INDIVIDUAL',
          'data-extra-options': '{"promoid":"K42KVSWP","mv":"other"}',
        },
      },
    ];
    for (const { sectionId, attributes } of useCases) {
      await test.step(`Validate ${sectionId} CTA is visible and has proper attributes`, async () => {
        const el = threeInOne.getFallbackCta(sectionId);
        await expect(el).toBeVisible();
        for (const [key, value] of Object.entries(attributes)) {
          await expect(el).toHaveAttribute(key, value);
        }
      });
    }
  });
});
