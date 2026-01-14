import { expect, test } from '@playwright/test';
import { features } from './carousel.spec.js';
import CarouselBlock from './carousel.page.js';
import { runAccessibilityTest } from '../../libs/accessibility.js';

let carousel;

const miloLibs = process.env.MILO_LIBS || '';

test.describe('Milo Carousel Block test suite', () => {
  test.beforeEach(async ({ page }) => {
    carousel = new CarouselBlock(page);
  });

  test(`${features[0].name},${features[0].tags}`, async ({ page, baseURL }) => {
    console.info(`[Test Page]: ${baseURL}${features[0].path}${miloLibs}`);

    await test.step('step-1: Go to Carousel block test page', async () => {
      await page.goto(`${baseURL}${features[0].path}${miloLibs}`);
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL(`${baseURL}${features[0].path}${miloLibs}`);
    });

    await test.step('step-2: Verify Carousel container', async () => {
      // verify carousel elements
      expect(await carousel.isCarouselDisplayed('carouselContainer')).toBeTruthy();

      // verify carousel slides count and active slide index
      expect(await carousel.getNumberOfSlides()).toBe(4);
      expect(await carousel.getCurrentSlideIndex()).toBe('0');
      expect(await carousel.validateAriaHidden()).toBeTruthy();
      expect(await carousel.areAllSlidesVisible()).toBeTruthy();
      expect(await carousel.validateSlideFocusableElements()).toBeTruthy();

      // verify carousel indictor and active indicator
      // Disabled because indicators are currently hidden by default
      // expect(await carousel.areIndicatorsDisplayed()).toBeTruthy();
      // expect(await carousel.getNumberOfIndicators()).toBe(4);
      // expect(await carousel.getCurrentIndicatorIndex()).toBeNull();

      // verify carousel next and previous buttons
      expect(await carousel.isNextButtonlVisible()).toBeTruthy();
      expect(await carousel.isPreviousButtonlVisible()).toBeTruthy();
    });

    await test.step('step-3: Perform carousel slides and controls operation and verify contents', async () => {
      // move to next slide by clicking next button and verify h2 tag header
      await carousel.moveToNextSlide();
      expect(await carousel.getCurrentSlideIndex()).toBe('1');
      expect(await carousel.getSlideText(1, 'h2', 'Orange Slices')).toBeTruthy();
      expect(await carousel.validateAriaHidden()).toBeTruthy();
      expect(await carousel.areAllSlidesVisible()).toBeTruthy();
      expect(await carousel.validateSlideFocusableElements()).toBeTruthy();

      // move to 3rd slide by clicking indicator and verify h2 tag header
      // Disabled because indicators are currently hidden by default
      // await carousel.moveToIndicator(3);
      // expect(await carousel.getCurrentIndicatorIndex()).toBeNull;
      // expect(await carousel.getSlideText(3, 'h2', 'Apples')).toBeTruthy();
      // expect(await carousel.validateAriaHidden()).toBeTruthy();
      // expect(await carousel.areAllSlidesVisible()).toBeTruthy();
      // expect(await carousel.validateSlideFocusableElements()).toBeTruthy();
    });

    await test.step('step-4: Verify the accessibility test on the carousel block', async () => {
      // The accessibility test for the carousel container is failing, so skipping the test step
      await runAccessibilityTest({ page, testScope: carousel.carouselContainer });
    });
  });

  test(`${features[1].name},${features[1].tags}`, async ({ page, baseURL }) => {
    console.info(`[Test Page]: ${baseURL}${features[0].path}${miloLibs}`);

    await test.step('step-1: Go to Carousel lightbox block test page', async () => {
      await page.goto(`${baseURL}${features[1].path}${miloLibs}`);
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL(`${baseURL}${features[1].path}${miloLibs}`);
    });

    await test.step('step-2: Verify carousel with lightbox features', async () => {
      expect(await carousel.isCarouselDisplayed('carouselLightbox')).toBeTruthy();

      // verify active slide and slides count
      expect(await carousel.getNumberOfSlides()).toBe(4);
      expect(await carousel.getCurrentSlideIndex()).toBe('0');
      expect(await carousel.validateAriaHidden()).toBeTruthy();
      expect(await carousel.areAllSlidesVisible()).toBeTruthy();
      expect(await carousel.validateSlideFocusableElements()).toBeTruthy();

      // verify indicator visibility, count and index of active slide
      // Disabled because indicators are currently hidden by default
      // expect(await carousel.areIndicatorsDisplayed()).toBeTruthy();
      // expect(await carousel.getNumberOfIndicators()).toBe(4);
      // expect(await carousel.getCurrentIndicatorIndex()).toBeNull();

      expect(await carousel.isNextButtonlVisible()).toBeTruthy();
      expect(await carousel.isPreviousButtonlVisible()).toBeTruthy();

      // verify expand and close lightbox
      expect(await carousel.isLightboxExpandButtonVisible()).toBeTruthy();
      await carousel.expandLightboxModal();
      await page.waitForTimeout(300); // Wait for modal transition

      expect(await carousel.isLightboxCloseButtonVisible()).toBeTruthy();
      await carousel.closeLightboxModal();
    });

    await test.step('step-3: Verify the accessibility test on the carousel lightbox block', async () => {
      await runAccessibilityTest({ page, testScope: carousel.carouselLightbox });
    });
  });

  test(`${features[2].name},${features[2].tags}`, async ({ page, baseURL }) => {
    console.info(`[Test Page]: ${baseURL}${features[2].path}${miloLibs}`);

    await test.step('step-1: Go to Carousel multi-slide show-2 block test page', async () => {
      await page.goto(`${baseURL}${features[2].path}${miloLibs}`);
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL(`${baseURL}${features[2].path}${miloLibs}`);
    });

    await test.step('step-2: Verify multi slide carousel show-2 features', async () => {
      expect(await carousel.isCarouselDisplayed('carouselShow-2')).toBeTruthy();

      // In multi-slide 2 number of slides will be n-slides +1 so it will be 5
      expect(await carousel.getNumberOfSlides()).toBe(5);
      expect(await carousel.getCurrentSlideIndex()).toBe('0');
      expect(await carousel.validateAriaHidden(2)).toBeTruthy();
      expect(await carousel.areAllSlidesVisible()).toBeTruthy();
      expect(await carousel.validateSlideFocusableElements()).toBeTruthy();

      // In multi-slide carousel indicators are not shown
      // Disabled because indicators are currently hidden by default
      // expect(await carousel.areIndicatorsDisplayed()).toBeFalsy();
      expect(await carousel.isNextButtonlVisible()).toBeTruthy();
      expect(await carousel.isPreviousButtonlVisible()).toBeTruthy();
    });

    await test.step('step-3: Perform carousel slides and controls operation and verify contents', async () => {
      // move to next slide by clicking next button and verify h2 tag header
      await carousel.moveToNextSlide();
      expect(await carousel.getSlideText(1, 'h2', 'Melon')).toBeTruthy();
      expect(await carousel.validateAriaHidden(2)).toBeTruthy();
      expect(await carousel.areAllSlidesVisible()).toBeTruthy();
      expect(await carousel.validateSlideFocusableElements()).toBeTruthy();
    });

    await test.step('step-3: Verify the accessibility test on the carousel show-2 container block', async () => {
      await runAccessibilityTest({ page, testScope: carousel.carouselContainerShow2 });
    });
  });

  test(`${features[3].name},${features[3].tags}`, async ({ page, baseURL }) => {
    console.info(`[Test Page]: ${baseURL}${features[3].path}${miloLibs}`);

    await test.step('step-1: Go to Carousel jump-to block test page', async () => {
      await page.goto(`${baseURL}${features[3].path}${miloLibs}`);
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL(`${baseURL}${features[3].path}${miloLibs}`);
    });

    await test.step('step-2: Verify carousel with jump-to features', async () => {
      expect(await carousel.isCarouselDisplayed('carouselJumpTo')).toBeTruthy();

      // verify active slide and slides count
      expect(await carousel.getNumberOfSlides()).toBe(4);
      expect(await carousel.getCurrentSlideIndex()).toBe('0');
      expect(await carousel.validateAriaHidden()).toBeTruthy();
      expect(await carousel.areAllSlidesVisible()).toBeTruthy();
      expect(await carousel.validateSlideFocusableElements()).toBeTruthy();

      // verify indicator visibility, count and index of active slide
      // Disabled because indicators are currently hidden by default
      // expect(await carousel.areIndicatorsDisplayed()).toBeTruthy();
      // expect(await carousel.getNumberOfIndicators()).toBe(4);
      // expect(await carousel.getCurrentIndicatorIndex()).toBe('0');

      expect(await carousel.isNextButtonlVisible()).toBeTruthy();
      expect(await carousel.isPreviousButtonlVisible()).toBeTruthy();
    });

    await test.step('step-3: Verify the accessibility test on the carousel jump-to block', async () => {
      await runAccessibilityTest({ page, testScope: carousel.carouselJumpTo });
    });
  });

  // ============================================
  // WCAG 2.1 Level A & AA Compliance Tests
  // ============================================

  test.describe('Accessibility - WCAG 2.1 A/AA', () => {
    test(`${features[4].name},${features[4].tags}`, async ({ page, baseURL }) => {
      // ============================================
      // Keyboard Navigation (WCAG 2.1.1, 2.1.2)
      // ============================================

      await test.step('A/AA - Arrow Keys Move Slides', async () => {
        await page.goto(`${baseURL}${features[0].path}${miloLibs}`);
        await page.waitForLoadState('networkidle');
        
        await carousel.nextButton.focus();
        const initialIndex = await carousel.getCurrentSlideIndex();
        expect(initialIndex).toBe('0');

        await page.keyboard.press('ArrowRight');
        await page.waitForTimeout(500);
        
        const secondSlideIndex = await carousel.getCurrentSlideIndex();
        expect(secondSlideIndex).toBe('1');

        await page.keyboard.press('ArrowLeft');
        await page.waitForTimeout(500);
        
        const backToFirstIndex = await carousel.getCurrentSlideIndex();
        expect(backToFirstIndex).toBe('0');
      });

      await test.step('A/AA - Tab Order Is Logical', async () => {
        await page.goto(`${baseURL}${features[0].path}${miloLibs}`);
        await page.waitForLoadState('networkidle');
        
        await carousel.previousButton.focus();
        const prevButtonFocused = await carousel.previousButton.evaluate((el) => 
          el === document.activeElement
        );
        expect(prevButtonFocused).toBeTruthy();

        await page.keyboard.press('Tab');
        const nextButtonFocused = await carousel.nextButton.evaluate((el) => 
          el === document.activeElement
        );
        expect(nextButtonFocused).toBeTruthy();
      });

      await test.step('A/AA - Space and Enter Activate Buttons', async () => {
        await page.goto(`${baseURL}${features[0].path}${miloLibs}`);
        await page.waitForLoadState('networkidle');
        
        await carousel.nextButton.focus();
        const initialIndex = await carousel.getCurrentSlideIndex();
        
        await page.keyboard.press('Space');
        await page.waitForTimeout(300);
        
        const newIndex = await carousel.getCurrentSlideIndex();
        expect(parseInt(newIndex)).toBeGreaterThan(parseInt(initialIndex));
      });

      await test.step('A/AA - Hidden Slides Are Not Focusable', async () => {
        await page.goto(`${baseURL}${features[0].path}${miloLibs}`);
        await page.waitForLoadState('networkidle');
        
        const hiddenSlides = await carousel.ariaHiddenSlides.all();
        for (const slide of hiddenSlides) {
          const focusableElements = await slide.locator('a, button, input, select, textarea, [tabindex]').all();
          for (const element of focusableElements) {
            const tabindex = await element.getAttribute('tabindex');
            expect(tabindex).toBe('-1');
          }
        }
      });

      // ============================================
      // Focus Management (WCAG 2.4.7)
      // ============================================

      await test.step('A/AA - Focus Visible on All Buttons', async () => {
        await page.goto(`${baseURL}${features[0].path}${miloLibs}`);
        await page.waitForLoadState('networkidle');
        
        await carousel.previousButton.focus();
        const prevOutline = await carousel.previousButton.evaluate((el) => {
          const styles = window.getComputedStyle(el);
          return styles.outlineWidth;
        });
        expect(prevOutline).not.toBe('0px');
      });

      await test.step('A/AA - Focus Order Updates When Slide Changes', async () => {
        await page.goto(`${baseURL}${features[0].path}${miloLibs}`);
        await page.waitForLoadState('networkidle');
        
        await carousel.moveToNextSlide();
        await page.waitForTimeout(300);
        expect(await carousel.validateSlideFocusableElements()).toBeTruthy();
        expect(await carousel.validateAriaHidden()).toBeTruthy();
      });

      // ============================================
      // Lightbox Modal (WCAG 2.1.1, 2.1.2, 4.1.3)
      // ============================================

      await test.step('A/AA - Escape Key Closes Modal', async () => {
        await page.goto(`${baseURL}${features[1].path}${miloLibs}`);
        await page.waitForLoadState('networkidle');
        
        await carousel.expandLightboxModal();
        await page.waitForTimeout(300);
        
        const isLightboxActive = await page.locator('.carousel.lightbox-active').isVisible();
        expect(isLightboxActive).toBeTruthy();
        
        await page.keyboard.press('Escape');
        await page.waitForTimeout(300);
        
        const isLightboxClosed = await page.locator('.carousel.lightbox-active').isVisible().catch(() => false);
        expect(isLightboxClosed).toBeFalsy();
      });

      await test.step('A/AA - Focus Trapped in Modal', async () => {
        await page.goto(`${baseURL}${features[1].path}${miloLibs}`);
        await page.waitForLoadState('networkidle');
        
        await carousel.expandLightboxModal();
        await page.waitForTimeout(300);
        
        const focusableElements = await page.locator('.carousel.lightbox-active button:not(.carousel-expand), .carousel.lightbox-active a').all();
        expect(focusableElements.length).toBeGreaterThan(0);
        
        for (let i = 0; i < focusableElements.length + 2; i++) {
          await page.keyboard.press('Tab');
        }
        
        const focusedElement = await page.evaluate(() => {
          const activeEl = document.activeElement;
          return activeEl?.closest('.carousel.lightbox-active') !== null;
        });
        expect(focusedElement).toBeTruthy();
      });

      await test.step('A/AA - Modal Has Correct ARIA Attributes', async () => {
        await page.goto(`${baseURL}${features[1].path}${miloLibs}`);
        await page.waitForLoadState('networkidle');
        
        await carousel.expandLightboxModal();
        await page.waitForTimeout(300);
        
        const lightbox = page.locator('.carousel.lightbox-active');
        const role = await lightbox.getAttribute('role');
        expect(role).toBe('dialog');
        
        const ariaModal = await lightbox.getAttribute('aria-modal');
        expect(ariaModal).toBe('true');
      });

      // ============================================
      // ARIA Live Regions (WCAG 4.1.3)
      // ============================================

      await test.step('A/AA - Live Region Exists with Correct Attributes', async () => {
        await page.goto(`${baseURL}${features[0].path}${miloLibs}`);
        await page.waitForLoadState('networkidle');
        
        const liveRegion = page.locator('.aria-live-container');
        expect(await liveRegion.count()).toBeGreaterThan(0);
        
        const ariaLive = await liveRegion.getAttribute('aria-live');
        expect(ariaLive).toBe('polite');
      });

      await test.step('A/AA - Live Region Updates When Slide Changes', async () => {
        await page.goto(`${baseURL}${features[0].path}${miloLibs}`);
        await page.waitForLoadState('networkidle');
        
        const liveRegion = page.locator('.aria-live-container');
        const initialContent = await liveRegion.textContent();
        
        await carousel.moveToNextSlide();
        await page.waitForTimeout(500);
        
        const updatedContent = await liveRegion.textContent();
        expect(updatedContent).not.toBe(initialContent);
        expect(updatedContent).toContain('Slide');
      });

      // ============================================
      // ARIA Attributes (WCAG 1.3.1, 4.1.2)
      // ============================================

      await test.step('A/AA - Button Labels Are Descriptive', async () => {
        await page.goto(`${baseURL}${features[0].path}${miloLibs}`);
        await page.waitForLoadState('networkidle');
        
        const prevLabel = await carousel.previousButton.getAttribute('aria-label');
        expect(prevLabel).toBeTruthy();
        expect(prevLabel.toLowerCase()).toContain('previous');
        
        const nextLabel = await carousel.nextButton.getAttribute('aria-label');
        expect(nextLabel).toBeTruthy();
        expect(nextLabel.toLowerCase()).toContain('next');
      });

      await test.step('A/AA - Active Indicator Has aria-current', async () => {
        await page.goto(`${baseURL}${features[0].path}${miloLibs}`);
        await page.waitForLoadState('networkidle');
        
        const ariaCurrent = await carousel.activeIndicator.getAttribute('aria-current');
        expect(ariaCurrent).toBe('location');
      });

      await test.step('A/AA - Hidden Slides Have aria-hidden', async () => {
        await page.goto(`${baseURL}${features[0].path}${miloLibs}`);
        await page.waitForLoadState('networkidle');
        
        expect(await carousel.validateAriaHidden()).toBeTruthy();
        const hiddenCount = await carousel.ariaHiddenSlides.count();
        const totalCount = await carousel.getNumberOfSlides();
        expect(hiddenCount).toBe(totalCount - 1);
      });

      // ============================================
      // Semantic HTML (WCAG 1.3.1, 4.1.2)
      // ============================================

      await test.step('A/AA - Navigation Controls Are Buttons', async () => {
        await page.goto(`${baseURL}${features[0].path}${miloLibs}`);
        await page.waitForLoadState('networkidle');
        
        const prevTagName = await carousel.previousButton.evaluate((el) => el.tagName);
        expect(prevTagName.toLowerCase()).toBe('button');
        
        const nextTagName = await carousel.nextButton.evaluate((el) => el.tagName);
        expect(nextTagName.toLowerCase()).toBe('button');
        
        const prevType = await carousel.previousButton.getAttribute('type');
        const nextType = await carousel.nextButton.getAttribute('type');
        expect(prevType).toBe('button');
        expect(nextType).toBe('button');
      });

      await test.step('A/AA - SVG Icons Are Hidden from Screen Readers', async () => {
        await page.goto(`${baseURL}${features[0].path}${miloLibs}`);
        await page.waitForLoadState('networkidle');
        
        const prevSvg = await carousel.previousButton.locator('svg').first();
        const prevSvgHidden = await prevSvg.getAttribute('aria-hidden');
        expect(prevSvgHidden).toBe('true');
        
        const nextSvg = await carousel.nextButton.locator('svg').first();
        const nextSvgHidden = await nextSvg.getAttribute('aria-hidden');
        expect(nextSvgHidden).toBe('true');
      });

      // ============================================
      // WCAG 2.1 A/AA Axe Scans
      // ============================================

      await test.step('A/AA - No WCAG Violations on Carousel Container', async () => {
        await page.goto(`${baseURL}${features[0].path}${miloLibs}`);
        await page.waitForLoadState('networkidle');
        
        await runAccessibilityTest({
          page,
          testScope: carousel.carouselContainer,
          maxViolations: 0,
        });
      });

      await test.step('A/AA - No WCAG Violations on Lightbox', async () => {
        await page.goto(`${baseURL}${features[1].path}${miloLibs}`);
        await page.waitForLoadState('networkidle');
        
        await runAccessibilityTest({
          page,
          testScope: carousel.carouselLightbox,
          maxViolations: 0,
        });
      });

      await test.step('A/AA - No WCAG Violations on Lightbox Modal State', async () => {
        await page.goto(`${baseURL}${features[1].path}${miloLibs}`);
        await page.waitForLoadState('networkidle');
        
        await carousel.expandLightboxModal();
        await page.waitForTimeout(300);
        
        await runAccessibilityTest({
          page,
          testScope: page.locator('.carousel.lightbox-active'),
          maxViolations: 0,
        });
      });
    });
  });
});
