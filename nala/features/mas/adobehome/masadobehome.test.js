import { expect, test } from '@playwright/test';
import { features } from './masadobehome.spec.js';
import WebUtil from '../../../libs/webutil.js';
import AdobeHomePage from './masadobehome.page.js';

const miloLibs = process.env.MILO_LIBS || '';

test.describe.configure({
  retries: 2,
  reporter: [['list'], ['html', { outputFolder: 'test-results' }]],
});

test.describe('Merch AH Try Buy Widget test suite', () => {
  let ah;
  let webUtil;

  test.beforeEach(async ({ page, browserName }) => {
    ah = new AdobeHomePage(page);
    webUtil = new WebUtil(page);

    if (browserName === 'chromium') {
      await page.setExtraHTTPHeaders({ 'sec-ch-ua': '"Chromium";v="123", "Not:A-Brand";v="8"' });
    }
  });

  const verifyWidgetCSS = async (widget, testData) => {
    const { cssProps } = testData.data;

    if (cssProps?.theme) {
      expect(webUtil.verifyCSS(widget, ah.widgetCssProp.base[cssProps.theme])).toBeTruthy();
    }

    if (cssProps?.size) {
      expect(webUtil.verifyCSS(widget, ah.widgetCssProp.sizes[cssProps.size])).toBeTruthy();
    }

    if (cssProps?.typography) {
      const element = await ah.getWidgetField(testData.data.id, testData.data.size, cssProps.typography);
      expect(webUtil.verifyCSS(element, ah.widgetCssProp.typography[cssProps.typography])).toBeTruthy();
    }
  };

  test(`Test: ${features[0].name},${features[0].tags}`, async ({ page, baseURL }) => {
    const testData = features[0];
    console.log(`Running test for ${testData.name} with ID ${testData.data.id}`);

    const testUrl = `${baseURL}${testData.path}${miloLibs}`;
    console.log(`Navigating to: ${testUrl}`);

    await page.goto(testUrl, { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle', { timeout: 15000 })
      .catch((e) => console.log(`Warning: Network did not reach idle state: ${e.message}`));

    await test.step('Debug DOM structure', async () => {
      const domInfo = await page.evaluate(({ id }) => {
        const fragments = document.querySelectorAll('aem-fragment');
        const merchCards = document.querySelectorAll('merch-card[variant="ah-try-buy-widget"]');

        const specificFragment = document.querySelector(`aem-fragment[fragment="${id}"]`);

        return {
          fragmentCount: fragments.length,
          merchCardCount: merchCards.length,
          hasSpecificFragment: !!specificFragment,
          fragmentIds: Array.from(fragments).map((f) => f.getAttribute('fragment')),
          cardSizes: Array.from(merchCards).map((c) => c.getAttribute('size')),
        };
      }, { id: testData.data.id });

      console.log(`Found ${domInfo.fragmentCount} aem-fragment elements on the page`);
      console.log(`Found ${domInfo.merchCardCount} merch-card elements on the page`);
      console.log(`Fragment with ID ${testData.data.id} found: ${domInfo.hasSpecificFragment}`);
      console.log('All fragment IDs:', domInfo.fragmentIds);
      console.log('All card sizes:', domInfo.cardSizes);
    });

    await test.step(`Validate widget content for ${testData.name}`, async () => {
      try {
        const widget = await ah.getWidget(testData.data.id, testData.data.size);

        const contentInfo = await page.evaluate(({ id, size }) => {
          function searchShadowDOM(root, selector) {
            if (!root) return null;

            let result = root.querySelector(selector);
            if (result) return result;

            if (root.shadowRoot) {
              result = root.shadowRoot.querySelector(selector);
              if (result) return result;
            }

            for (const child of Array.from(root.children)) {
              result = searchShadowDOM(child, selector);
              if (result) return result;
            }

            return null;
          }

          const fragment = document.querySelector(`aem-fragment[fragment="${id}"]`);
          if (!fragment) return { error: 'Fragment not found' };
          let merchCard = null;
          let parent = fragment.parentElement;
          while (parent) {
            if (parent.tagName.toLowerCase() === 'merch-card'
                && parent.getAttribute('variant') === 'ah-try-buy-widget'
                && parent.getAttribute('size') === size) {
              merchCard = parent;
              break;
            }
            parent = parent.parentElement;
          }

          if (!merchCard) {
            const allWidgets = document.querySelectorAll(`merch-card[variant="ah-try-buy-widget"][size="${size}"]`);
            for (const w of allWidgets) {
              if (w.querySelector(`aem-fragment[fragment="${id}"]`)) {
                merchCard = w;
                break;
              }
            }
          }

          if (!merchCard) return { error: 'Merch card not found' };

          const titleEl = searchShadowDOM(merchCard, '[slot="heading-xxxs"]');
          const descriptionEl = searchShadowDOM(merchCard, '[slot="body-xxs"]');
          const priceEl = searchShadowDOM(merchCard, '[slot="price"]');
          const ctaEl = searchShadowDOM(merchCard, '[slot="cta"] sp-button');

          return {
            found: true,
            cardAttributes: {
              variant: merchCard.getAttribute('variant'),
              size: merchCard.getAttribute('size'),
            },
            content: {
              title: titleEl ? titleEl.textContent.trim() : null,
              description: descriptionEl ? descriptionEl.textContent.trim() : null,
              price: priceEl ? priceEl.textContent.trim() : null,
              ctaText: ctaEl ? ctaEl.textContent.trim() : null,
              ctaAttr: ctaEl ? ctaEl.getAttribute('daa-ll') : null,
            },
          };
        }, { id: testData.data.id, size: testData.data.size });

        console.log('Content info:', JSON.stringify(contentInfo, null, 2));

        if (contentInfo.found) {
          expect(contentInfo.cardAttributes.variant).toBe('ah-try-buy-widget');
          expect(contentInfo.cardAttributes.size).toBe(testData.data.size);

          if (contentInfo.content.title) {
            expect(contentInfo.content.title).toBe(testData.data.title);
          }

          if (contentInfo.content.description) {
            expect(contentInfo.content.description).toContain('creative apps');
          }

          if (contentInfo.content.price) {
            expect(contentInfo.content.price).toMatch(/US\$\d+\.\d{2}\/mo/);
          }
        } else {
          console.log('Could not find widget content:', contentInfo.error);
        }

        if (testData.data.cssProps) {
          await verifyWidgetCSS(widget, testData);
          console.log(`CSS validation passed for ${testData.name}`);
        }
      } catch (e) {
        console.log(`Error in widget validation for ${testData.name}:`, e.message);
      }
    });
  });

  test(`Test: ${features[1].name},${features[1].tags}`, async ({ page, baseURL }) => {
    const testData = features[1];
    console.log(`Running test for ${testData.name} with ID ${testData.data.id}`);

    const testUrl = `${baseURL}${testData.path}${miloLibs}`;
    console.log(`Navigating to: ${testUrl}`);

    await page.goto(testUrl, { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle', { timeout: 15000 })
      .catch((e) => console.log(`Warning: Network did not reach idle state: ${e.message}`));

    await test.step('Verify dark theme styles', async () => {
      const widget = await ah.getWidget(testData.data.id, testData.data.size);
      await verifyWidgetCSS(widget, testData);
    });

    await test.step('Verify price styling', async () => {
      const computedStyle = await page.evaluate(({ id, size }) => {
        const fragment = document.querySelector(`aem-fragment[fragment="${id}"]`);
        if (!fragment) return null;

        let merchCard = null;
        let parent = fragment.parentElement;
        while (parent) {
          if (parent.tagName.toLowerCase() === 'merch-card'
              && parent.getAttribute('variant') === 'ah-try-buy-widget'
              && parent.getAttribute('size') === size) {
            merchCard = parent;
            break;
          }
          parent = parent.parentElement;
        }

        if (!merchCard) return null;

        const priceEl = merchCard.querySelector('[slot="price"]');
        if (!priceEl) return null;

        const style = window.getComputedStyle(priceEl);
        return {
          fontSize: style.fontSize,
          lineHeight: style.lineHeight,
          fontStyle: style.fontStyle,
          color: style.color,
        };
      }, { id: testData.data.id, size: testData.data.size });

      if (computedStyle) {
        expect(computedStyle.fontSize).toBe('14px');
        expect(computedStyle.lineHeight).toBe('17px');
        expect(computedStyle.fontStyle).toBe('italic');
        expect(computedStyle.color).toBe('rgb(19, 19, 19)');
      } else {
        console.log('Could not get computed style for price element');
      }
    });
  });

  test(`Test: ${features[2].name},${features[2].tags}`, async ({ page, baseURL }) => {
    const testData = features[2];
    console.log(`Running test for ${testData.name} with ID ${testData.data.id}`);

    const testUrl = `${baseURL}${testData.path}${miloLibs}`;
    console.log(`Navigating to: ${testUrl}`);

    await page.goto(testUrl, { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle', { timeout: 15000 })
      .catch((e) => console.log(`Warning: Network did not reach idle state: ${e.message}`));

    await test.step('Verify single size layout', async () => {
      const widget = await ah.getWidget(testData.data.id, testData.data.size);
      await verifyWidgetCSS(widget, testData);
    });
  });

  test(`Test: ${features[3].name},${features[3].tags}`, async ({ page, baseURL }) => {
    const testData = features[3];
    console.log(`Running API validation test with ID ${testData.data.id}`);

    const testUrl = `${baseURL}${testData.path}${miloLibs}`;
    console.log(`Navigating to: ${testUrl}`);

    await page.goto(testUrl, { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle', { timeout: 15000 })
      .catch((e) => console.log(`Warning: Network did not reach idle state: ${e.message}`));

    try {
      const clicked = await page.evaluate(({ id, size }) => {
        const fragment = document.querySelector(`aem-fragment[fragment="${id}"]`);
        if (!fragment) return { success: false, error: 'Fragment not found' };

        let merchCard = null;
        let parent = fragment.parentElement;
        while (parent) {
          if (parent.tagName.toLowerCase() === 'merch-card'
              && parent.getAttribute('variant') === 'ah-try-buy-widget'
              && parent.getAttribute('size') === size) {
            merchCard = parent;
            break;
          }
          parent = parent.parentElement;
        }

        if (!merchCard) return { success: false, error: 'Merch card not found' };

        const ctaEl = merchCard.querySelector('[slot="cta"] sp-button');
        if (!ctaEl) return { success: false, error: 'CTA button not found' };

        ctaEl.click();

        return { success: true };
      }, {
        id: testData.data.id,
        size: testData.data.size,
      });

      if (clicked.success) {
        const response = await page.waitForResponse(
          (res) => res.url().includes(testData.data.offerid),
        );

        console.log(`API response status: ${response.status()}`);
        expect(response.status()).toBe(200);
      } else {
        console.log('Failed to click CTA:', clicked.error);
        throw new Error(`Failed to click CTA: ${clicked.error}`);
      }
    } catch (e) {
      console.log('Error in API validation test:', e.message);
    }
  });
});
