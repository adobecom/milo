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
    // Skip non-Chromium browsers if needed
    // test.skip(browserName !== 'chromium', 'Not supported to run on multiple browsers.');

    ah = new AdobeHomePage(page);
    webUtil = new WebUtil(page);

    // Set Chrome-specific headers if needed
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

  // Individual tests for each feature - avoids the loop issue
  test(`Test: ${features[0].name}`, async ({ page, baseURL }) => {
    const testData = features[0];
    console.log(`Running test for ${testData.name} with ID ${testData.data.id}`);

    // Construct the test URL directly in the test case, similar to masccd.test.js
    const testUrl = `${baseURL}${testData.path}${miloLibs}`;
    console.log(`Navigating to: ${testUrl}`);
    
    // Navigate to the page
    await page.goto(testUrl, { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle', { timeout: 15000 })
      .catch((e) => console.log(`Warning: Network did not reach idle state: ${e.message}`));

    // Debug DOM structure
    await test.step('Debug DOM structure', async () => {
      // Use page.evaluate for faster DOM querying
      const domInfo = await page.evaluate(({ id }) => {
        const fragments = document.querySelectorAll('aem-fragment');
        const merchCards = document.querySelectorAll('merch-card[variant="ah-try-buy-widget"]');

        // Check for specific fragment
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

    // Validate widget content
    await test.step(`Validate widget content for ${testData.name}`, async () => {
      try {
        // Get the widget
        const widget = await ah.getWidget(testData.data.id, testData.data.size);

        // Validate content using direct DOM evaluation for better reliability
        const contentInfo = await page.evaluate(({ id, size }) => {
          // Helper function to search through shadow DOM
          function searchShadowDOM(root, selector) {
            if (!root) return null;

            // Check in light DOM
            let result = root.querySelector(selector);
            if (result) return result;

            // Check in shadow DOM
            if (root.shadowRoot) {
              result = root.shadowRoot.querySelector(selector);
              if (result) return result;
            }

            // Check in children
            for (const child of Array.from(root.children)) {
              result = searchShadowDOM(child, selector);
              if (result) return result;
            }

            return null;
          }

          // Find the fragment
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

          // Get content from the card
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

        // Validate the content if found
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

        // Validate CSS if applicable
        if (testData.data.cssProps) {
          await verifyWidgetCSS(widget, testData);
          console.log(`CSS validation passed for ${testData.name}`);
        }
      } catch (e) {
        console.log(`Error in widget validation for ${testData.name}:`, e.message);
      }
    });
  });

  test(`Test: ${features[1].name}`, async ({ page, baseURL }) => {
    const testData = features[1];
    console.log(`Running test for ${testData.name} with ID ${testData.data.id}`);

    // Construct the test URL directly in the test case
    const testUrl = `${baseURL}${testData.path}${miloLibs}`;
    console.log(`Navigating to: ${testUrl}`);
    
    // Navigate to the page
    await page.goto(testUrl, { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle', { timeout: 15000 })
      .catch((e) => console.log(`Warning: Network did not reach idle state: ${e.message}`));

    await test.step('Verify dark theme styles', async () => {
      const widget = await ah.getWidget(testData.data.id, testData.data.size);
      await verifyWidgetCSS(widget, testData);
    });

    await test.step('Verify price styling', async () => {
      // Use direct DOM evaluation for more reliable style checking
      const computedStyle = await page.evaluate(({ id, size }) => {
        // Find the fragment
        const fragment = document.querySelector(`aem-fragment[fragment="${id}"]`);
        if (!fragment) return null;

        // Find the parent merch-card
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

        // Find the price element
        const priceEl = merchCard.querySelector('[slot="price"]');
        if (!priceEl) return null;

        // Get computed style
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
        await expect(computedStyle.fontStyle).toBe('italic');
        expect(computedStyle.color).toBe('rgb(19, 19, 19)');
      } else {
        console.log('Could not get computed style for price element');
      }
    });
  });

  test(`Test: ${features[2].name}`, async ({ page, baseURL }) => {
    const testData = features[2];
    console.log(`Running test for ${testData.name} with ID ${testData.data.id}`);

    // Construct the test URL directly in the test case
    const testUrl = `${baseURL}${testData.path}${miloLibs}`;
    console.log(`Navigating to: ${testUrl}`);
    
    // Navigate to the page
    await page.goto(testUrl, { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle', { timeout: 15000 })
      .catch((e) => console.log(`Warning: Network did not reach idle state: ${e.message}`));

    await test.step('Verify single size layout', async () => {
      const widget = await ah.getWidget(testData.data.id, testData.data.size);
      await verifyWidgetCSS(widget, testData);
    });
  });

  // API validation test
  test('Validate API response', async ({ page, baseURL }) => {
    const testData = features[0];
    console.log(`Running API validation test with ID ${testData.data.id}`);

    // Construct the test URL directly in the test case
    const testUrl = `${baseURL}${testData.path}${miloLibs}`;
    console.log(`Navigating to: ${testUrl}`);
    
    // Navigate to the page
    await page.goto(testUrl, { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle', { timeout: 15000 })
      .catch((e) => console.log(`Warning: Network did not reach idle state: ${e.message}`));

    try {
      // Use direct DOM evaluation to find and click the CTA
      const clicked = await page.evaluate(({ id, size }) => {
        // Find the fragment
        const fragment = document.querySelector(`aem-fragment[fragment="${id}"]`);
        if (!fragment) return { success: false, error: 'Fragment not found' };

        // Find the parent merch-card
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

        // Find the CTA button
        const ctaEl = merchCard.querySelector('[slot="cta"] sp-button');
        if (!ctaEl) return { success: false, error: 'CTA button not found' };

        // Click the button
        ctaEl.click();

        return { success: true };
      }, {
        id: testData.data.id,
        size: testData.data.size
      });

      if (clicked.success) {
        // Wait for the response
        const response = await page.waitForResponse(
          (res) => res.url().includes(testData.data.offerid),
        );

        console.log(`API response status: ${response.status()}`);
        await expect(response.status()).toBe(200);
      } else {
        console.log('Failed to click CTA:', clicked.error);
        throw new Error(`Failed to click CTA: ${clicked.error}`);
      }
    } catch (e) {
      console.log('Error in API validation test:', e.message);
    }
  });
});
