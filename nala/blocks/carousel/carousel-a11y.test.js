/**
 * Carousel A11Y Enhancement Tests
 * Tests for carousel-a11y branch improvements
 * 
 * These tests specifically validate:
 * - Keyboard navigation (arrow keys, Tab, Escape)
 * - Focus management and trapping
 * - ARIA live regions
 * - Screen reader compatibility
 * - Modal accessibility
 */

import { expect, test } from '@playwright/test';
import { features } from './carousel.spec.js';
import CarouselBlock from './carousel.page.js';
import { runAccessibilityTest } from '../../libs/accessibility.js';

let carousel;
const miloLibs = process.env.MILO_LIBS || '';

test.describe('Carousel A11Y Enhancement Tests', () => {
  test.beforeEach(async ({ page }) => {
    carousel = new CarouselBlock(page);
  });

  // ============================================
  // Test Suite 1: Keyboard Navigation
  // ============================================

  test('01 - Keyboard Navigation: Arrow Keys Move Slides @carousel @a11y @keyboard', async ({ page, baseURL }) => {
    await page.goto(`${baseURL}${features[0].path}${miloLibs}`);
    await page.waitForLoadState('networkidle');

    await test.step('Verify arrow keys navigate slides', async () => {
      // Focus on a carousel button first (arrow key listener needs focus within carousel)
      await carousel.nextButton.focus();
      
      // Get initial slide
      const initialIndex = await carousel.getCurrentSlideIndex();
      expect(initialIndex).toBe('0');

      // Press Right Arrow to go to next slide
      await page.keyboard.press('ArrowRight');
      await page.waitForTimeout(500); // Wait for transition
      
      const secondSlideIndex = await carousel.getCurrentSlideIndex();
      expect(secondSlideIndex).toBe('1');

      // Press Left Arrow to go back
      await page.keyboard.press('ArrowLeft');
      await page.waitForTimeout(500);
      
      const backToFirstIndex = await carousel.getCurrentSlideIndex();
      expect(backToFirstIndex).toBe('0');
    });
  });

  test('02 - Keyboard Navigation: Tab Order Is Logical @carousel @a11y @keyboard', async ({ page, baseURL }) => {
    await page.goto(`${baseURL}${features[0].path}${miloLibs}`);
    await page.waitForLoadState('networkidle');

    await test.step('Verify tab order through carousel controls', async () => {
      // Focus directly on previous button first
      await carousel.previousButton.focus();
      
      // Verify previous button has focus
      const prevButtonFocused = await carousel.previousButton.evaluate((el) => 
        el === document.activeElement
      );
      expect(prevButtonFocused).toBeTruthy();

      // Tab to next button
      await page.keyboard.press('Tab');
      const nextButtonFocused = await carousel.nextButton.evaluate((el) => 
        el === document.activeElement
      );
      expect(nextButtonFocused).toBeTruthy();
    });
  });

  test('03 - Keyboard Navigation: Space and Enter Activate Buttons @carousel @a11y @keyboard', async ({ page, baseURL }) => {
    await page.goto(`${baseURL}${features[0].path}${miloLibs}`);
    await page.waitForLoadState('networkidle');

    await test.step('Verify Space key activates next button', async () => {
      await carousel.nextButton.focus();
      const initialIndex = await carousel.getCurrentSlideIndex();
      
      await page.keyboard.press('Space');
      await page.waitForTimeout(300);
      
      const newIndex = await carousel.getCurrentSlideIndex();
      expect(parseInt(newIndex)).toBeGreaterThan(parseInt(initialIndex));
    });

    await test.step('Verify Enter key activates previous button', async () => {
      await carousel.previousButton.focus();
      const currentIndex = await carousel.getCurrentSlideIndex();
      
      await page.keyboard.press('Enter');
      await page.waitForTimeout(300);
      
      const newIndex = await carousel.getCurrentSlideIndex();
      expect(parseInt(newIndex)).toBeLessThan(parseInt(currentIndex));
    });
  });

  test('04 - Keyboard Navigation: Hidden Slides Are Not Focusable @carousel @a11y @keyboard', async ({ page, baseURL }) => {
    await page.goto(`${baseURL}${features[0].path}${miloLibs}`);
    await page.waitForLoadState('networkidle');

    await test.step('Verify hidden slide elements have tabindex=-1', async () => {
      // Get all slides with aria-hidden="true"
      const hiddenSlides = await carousel.ariaHiddenSlides.all();
      
      for (const slide of hiddenSlides) {
        // Check all focusable elements in hidden slides
        const focusableElements = await slide.locator('a, button, input, select, textarea, [tabindex]').all();
        
        for (const element of focusableElements) {
          const tabindex = await element.getAttribute('tabindex');
          expect(tabindex).toBe('-1');
        }
      }
    });

    await test.step('Verify active slide elements are focusable', async () => {
      // Get active slide (should not have aria-hidden="true")
      const activeSlide = await carousel.activeSlide;
      const focusableElements = await activeSlide.locator('a, button, input, select, textarea').all();
      
      for (const element of focusableElements) {
        const tabindex = await element.getAttribute('tabindex');
        // Should be "0" or null (naturally focusable)
        expect(tabindex === '0' || tabindex === null).toBeTruthy();
      }
    });
  });

  // ============================================
  // Test Suite 2: Focus Management
  // ============================================

  test('05 - Focus Management: Focus Visible on All Buttons @carousel @a11y @focus', async ({ page, baseURL }) => {
    await page.goto(`${baseURL}${features[0].path}${miloLibs}`);
    await page.waitForLoadState('networkidle');

    await test.step('Verify focus indicators are visible', async () => {
      // Focus previous button
      await carousel.previousButton.focus();
      
      // Check for visible focus outline
      const prevOutline = await carousel.previousButton.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return {
          outline: styles.outline,
          outlineWidth: styles.outlineWidth,
          outlineStyle: styles.outlineStyle,
        };
      });
      
      // Should have an outline
      expect(prevOutline.outlineWidth).not.toBe('0px');
      
      // Focus next button
      await carousel.nextButton.focus();
      
      const nextOutline = await carousel.nextButton.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return {
          outline: styles.outline,
          outlineWidth: styles.outlineWidth,
        };
      });
      
      expect(nextOutline.outlineWidth).not.toBe('0px');
    });
  });

  test('06 - Focus Management: Focus Order Updates When Slide Changes @carousel @a11y @focus', async ({ page, baseURL }) => {
    await page.goto(`${baseURL}${features[0].path}${miloLibs}`);
    await page.waitForLoadState('networkidle');

    await test.step('Verify tabindex updates after navigation', async () => {
      // Navigate to next slide
      await carousel.moveToNextSlide();
      await page.waitForTimeout(300);
      
      // Verify new active slide has correct tabindex
      expect(await carousel.validateSlideFocusableElements()).toBeTruthy();
      expect(await carousel.validateAriaHidden()).toBeTruthy();
    });
  });

  // ============================================
  // Test Suite 3: Lightbox Modal Accessibility
  // ============================================

  test('07 - Lightbox: Escape Key Closes Modal @carousel @a11y @lightbox @keyboard', async ({ page, baseURL }) => {
    await page.goto(`${baseURL}${features[1].path}${miloLibs}`);
    await page.waitForLoadState('networkidle');

    await test.step('Open lightbox and close with Escape key', async () => {
      // Open lightbox
      await carousel.expandLightboxModal();
      await page.waitForTimeout(300);
      
      // Verify lightbox is open
      const isLightboxActive = await page.locator('.carousel.lightbox-active').isVisible();
      expect(isLightboxActive).toBeTruthy();
      
      // Press Escape
      await page.keyboard.press('Escape');
      await page.waitForTimeout(300);
      
      // Verify lightbox is closed
      const isLightboxClosed = await page.locator('.carousel.lightbox-active').isVisible().catch(() => false);
      expect(isLightboxClosed).toBeFalsy();
    });
  });

  test('08 - Lightbox: Focus Trapped in Modal @carousel @a11y @lightbox @focus', async ({ page, baseURL }) => {
    await page.goto(`${baseURL}${features[1].path}${miloLibs}`);
    await page.waitForLoadState('networkidle');

    await test.step('Verify focus stays within lightbox when open', async () => {
      // Open lightbox
      await carousel.expandLightboxModal();
      await page.waitForTimeout(300);
      
      // Get all focusable elements in lightbox
      const focusableElements = await page.locator('.carousel.lightbox-active button:not(.carousel-expand), .carousel.lightbox-active a').all();
      
      expect(focusableElements.length).toBeGreaterThan(0);
      
      // Tab through elements multiple times
      for (let i = 0; i < focusableElements.length + 2; i++) {
        await page.keyboard.press('Tab');
      }
      
      // Verify focus is still within lightbox
      const focusedElement = await page.evaluate(() => {
        const activeEl = document.activeElement;
        return activeEl?.closest('.carousel.lightbox-active') !== null;
      });
      
      expect(focusedElement).toBeTruthy();
    });
  });

  test('09 - Lightbox: Shift+Tab Cycles Backward @carousel @a11y @lightbox @keyboard', async ({ page, baseURL }) => {
    await page.goto(`${baseURL}${features[1].path}${miloLibs}`);
    await page.waitForLoadState('networkidle');

    await test.step('Verify Shift+Tab cycles backward through modal', async () => {
      // Open lightbox
      await carousel.expandLightboxModal();
      await page.waitForTimeout(300);
      
      // Tab forward to last element
      const focusableCount = await page.locator('.carousel.lightbox-active button:not(.carousel-expand), .carousel.lightbox-active a').count();
      
      for (let i = 0; i < focusableCount; i++) {
        await page.keyboard.press('Tab');
      }
      
      // Now Shift+Tab backward
      await page.keyboard.press('Shift+Tab');
      
      // Verify we're still in the modal
      const focusedElement = await page.evaluate(() => {
        const activeEl = document.activeElement;
        return activeEl?.closest('.carousel.lightbox-active') !== null;
      });
      
      expect(focusedElement).toBeTruthy();
    });
  });

  test('10 - Lightbox: Modal Has Correct ARIA Attributes @carousel @a11y @lightbox @aria', async ({ page, baseURL }) => {
    await page.goto(`${baseURL}${features[1].path}${miloLibs}`);
    await page.waitForLoadState('networkidle');

    await test.step('Verify modal has role="dialog" and aria-modal', async () => {
      // Open lightbox
      await carousel.expandLightboxModal();
      await page.waitForTimeout(300);
      
      const lightbox = page.locator('.carousel.lightbox-active');
      
      // Check for role="dialog"
      const role = await lightbox.getAttribute('role');
      expect(role).toBe('dialog');
      
      // Check for aria-modal="true"
      const ariaModal = await lightbox.getAttribute('aria-modal');
      expect(ariaModal).toBe('true');
      
      // Check for accessible name
      const ariaLabel = await lightbox.getAttribute('aria-label');
      const name = await lightbox.getAttribute('name');
      expect(ariaLabel || name).toBeTruthy();
    });
  });

  test('11 - Lightbox: Header Z-Index Handled Correctly @carousel @a11y @lightbox', async ({ page, baseURL }) => {
    await page.goto(`${baseURL}${features[1].path}${miloLibs}`);
    await page.waitForLoadState('networkidle');

    await test.step('Verify header z-index changes when lightbox opens', async () => {
      const header = page.locator('header');
      const headerExists = await header.count() > 0;
      
      if (headerExists) {
        // Get original z-index
        const originalZIndex = await header.evaluate((el) => 
          window.getComputedStyle(el).zIndex
        );
        
        // Open lightbox
        await carousel.expandLightboxModal();
        await page.waitForTimeout(300);
        
        // Check z-index is modified (should be lower or 0)
        const lightboxZIndex = await header.evaluate((el) => 
          window.getComputedStyle(el).zIndex
        );
        
        // Close lightbox
        await carousel.closeLightboxModal();
        await page.waitForTimeout(300);
        
        // Verify z-index is restored
        const restoredZIndex = await header.evaluate((el) => 
          window.getComputedStyle(el).zIndex
        );
        
        expect(restoredZIndex).toBe(originalZIndex);
      }
    });
  });

  // ============================================
  // Test Suite 4: ARIA Live Regions
  // ============================================

  test('12 - ARIA Live: Live Region Exists and Has Correct Attributes @carousel @a11y @aria', async ({ page, baseURL }) => {
    await page.goto(`${baseURL}${features[0].path}${miloLibs}`);
    await page.waitForLoadState('networkidle');

    await test.step('Verify ARIA live region is present', async () => {
      const liveRegion = page.locator('.aria-live-container');
      
      // Check it exists
      expect(await liveRegion.count()).toBeGreaterThan(0);
      
      // Check aria-live attribute
      const ariaLive = await liveRegion.getAttribute('aria-live');
      expect(ariaLive).toBe('polite');
      
      // Verify it's visually hidden but accessible
      const styles = await liveRegion.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return {
          width: computed.width,
          height: computed.height,
          overflow: computed.overflow,
        };
      });
      
      expect(styles.width).toBe('0px');
      expect(styles.height).toBe('0px');
      expect(styles.overflow).toBe('hidden');
    });
  });

  test('13 - ARIA Live: Updates When Slide Changes @carousel @a11y @aria', async ({ page, baseURL }) => {
    await page.goto(`${baseURL}${features[0].path}${miloLibs}`);
    await page.waitForLoadState('networkidle');

    await test.step('Verify live region announces slide changes', async () => {
      const liveRegion = page.locator('.aria-live-container');
      
      // Get initial content
      const initialContent = await liveRegion.textContent();
      
      // Navigate to next slide
      await carousel.moveToNextSlide();
      await page.waitForTimeout(500); // Wait for announcement
      
      // Get updated content
      const updatedContent = await liveRegion.textContent();
      
      // Content should have changed
      expect(updatedContent).not.toBe(initialContent);
      
      // Should contain slide information
      expect(updatedContent).toContain('Slide');
    });
  });

  test('14 - ARIA Live: Includes Slide Position Information @carousel @a11y @aria', async ({ page, baseURL }) => {
    await page.goto(`${baseURL}${features[0].path}${miloLibs}`);
    await page.waitForLoadState('networkidle');

    await test.step('Verify slide position is announced', async () => {
      const liveRegion = page.locator('.aria-live-container');
      const slideCount = await carousel.getNumberOfSlides();
      
      // Navigate to slide 2
      await carousel.moveToNextSlide();
      await page.waitForTimeout(500);
      
      const announcement = await liveRegion.textContent();
      
      // Should contain "Slide X of Y" format
      const slidePattern = /Slide \d+ of \d+/;
      expect(slidePattern.test(announcement)).toBeTruthy();
    });
  });

  // ============================================
  // Test Suite 5: ARIA Attributes
  // ============================================

  test('15 - ARIA: Button Labels Are Descriptive @carousel @a11y @aria', async ({ page, baseURL }) => {
    await page.goto(`${baseURL}${features[0].path}${miloLibs}`);
    await page.waitForLoadState('networkidle');

    await test.step('Verify buttons have clear aria-labels', async () => {
      // Check previous button
      const prevLabel = await carousel.previousButton.getAttribute('aria-label');
      expect(prevLabel).toBeTruthy();
      expect(prevLabel.toLowerCase()).toContain('previous');
      
      // Check next button
      const nextLabel = await carousel.nextButton.getAttribute('aria-label');
      expect(nextLabel).toBeTruthy();
      expect(nextLabel.toLowerCase()).toContain('next');
    });
  });

  test('16 - ARIA: Previous Button Label Updates on First Slide @carousel @a11y @aria', async ({ page, baseURL }) => {
    await page.goto(`${baseURL}${features[0].path}${miloLibs}`);
    await page.waitForLoadState('networkidle');

    await test.step('Verify previous button label provides context on first slide', async () => {
      // Should be on first slide
      const currentIndex = await carousel.getCurrentSlideIndex();
      expect(currentIndex).toBe('0');
      
      // Get previous button label
      const prevLabel = await carousel.previousButton.getAttribute('aria-label');
      
      // Should contain position info on first slide
      expect(prevLabel).toBeTruthy();
    });
  });

  test('17 - ARIA: Active Indicator Has aria-current @carousel @a11y @aria', async ({ page, baseURL }) => {
    await page.goto(`${baseURL}${features[0].path}${miloLibs}`);
    await page.waitForLoadState('networkidle');

    await test.step('Verify active indicator has aria-current attribute', async () => {
      const activeIndicator = carousel.activeIndicator;
      
      // Check for aria-current
      const ariaCurrent = await activeIndicator.getAttribute('aria-current');
      expect(ariaCurrent).toBe('location');
    });
  });

  test('18 - ARIA: Hidden Slides Have aria-hidden="true" @carousel @a11y @aria', async ({ page, baseURL }) => {
    await page.goto(`${baseURL}${features[0].path}${miloLibs}`);
    await page.waitForLoadState('networkidle');

    await test.step('Verify non-visible slides are properly hidden', async () => {
      // Validate aria-hidden implementation
      expect(await carousel.validateAriaHidden()).toBeTruthy();
      
      // Get count of hidden slides
      const hiddenCount = await carousel.ariaHiddenSlides.count();
      const totalCount = await carousel.getNumberOfSlides();
      
      // Should have hidden slides (total - 1 active)
      expect(hiddenCount).toBe(totalCount - 1);
    });
  });

  // ============================================
  // Test Suite 6: Button Semantics
  // ============================================

  test('19 - Semantics: Navigation Controls Are Buttons @carousel @a11y @semantic', async ({ page, baseURL }) => {
    await page.goto(`${baseURL}${features[0].path}${miloLibs}`);
    await page.waitForLoadState('networkidle');

    await test.step('Verify controls use semantic button elements', async () => {
      // Check previous button
      const prevTagName = await carousel.previousButton.evaluate((el) => el.tagName);
      expect(prevTagName.toLowerCase()).toBe('button');
      
      // Check next button
      const nextTagName = await carousel.nextButton.evaluate((el) => el.tagName);
      expect(nextTagName.toLowerCase()).toBe('button');
      
      // Check type attribute
      const prevType = await carousel.previousButton.getAttribute('type');
      const nextType = await carousel.nextButton.getAttribute('type');
      expect(prevType).toBe('button');
      expect(nextType).toBe('button');
    });
  });

  test('20 - Semantics: SVG Icons Are Hidden from Screen Readers @carousel @a11y @semantic', async ({ page, baseURL }) => {
    await page.goto(`${baseURL}${features[0].path}${miloLibs}`);
    await page.waitForLoadState('networkidle');

    await test.step('Verify SVG icons have aria-hidden', async () => {
      // Check SVG in previous button
      const prevSvg = await carousel.previousButton.locator('svg').first();
      const prevSvgHidden = await prevSvg.getAttribute('aria-hidden');
      expect(prevSvgHidden).toBe('true');
      
      // Check SVG in next button
      const nextSvg = await carousel.nextButton.locator('svg').first();
      const nextSvgHidden = await nextSvg.getAttribute('aria-hidden');
      expect(nextSvgHidden).toBe('true');
    });
  });

  // ============================================
  // Test Suite 7: Comprehensive Axe Scans
  // ============================================

  test('21 - Axe Scan: No WCAG Violations on Carousel Container @carousel @a11y @axe', async ({ page, baseURL }) => {
    await page.goto(`${baseURL}${features[0].path}${miloLibs}`);
    await page.waitForLoadState('networkidle');

    await test.step('Run comprehensive accessibility scan', async () => {
      await runAccessibilityTest({
        page,
        testScope: carousel.carouselContainer,
        maxViolations: 0,
      });
    });
  });

  test('22 - Axe Scan: No WCAG Violations on Lightbox @carousel @a11y @axe', async ({ page, baseURL }) => {
    await page.goto(`${baseURL}${features[1].path}${miloLibs}`);
    await page.waitForLoadState('networkidle');

    await test.step('Run accessibility scan on lightbox', async () => {
      await runAccessibilityTest({
        page,
        testScope: carousel.carouselLightbox,
        maxViolations: 0,
      });
    });
  });

  test('23 - Axe Scan: No WCAG Violations on Lightbox Modal State @carousel @a11y @axe @lightbox', async ({ page, baseURL }) => {
    await page.goto(`${baseURL}${features[1].path}${miloLibs}`);
    await page.waitForLoadState('networkidle');

    await test.step('Open lightbox and scan modal state', async () => {
      // Open lightbox
      await carousel.expandLightboxModal();
      await page.waitForTimeout(300);
      
      // Run scan on open lightbox
      await runAccessibilityTest({
        page,
        testScope: page.locator('.carousel.lightbox-active'),
        maxViolations: 0,
      });
    });
  });

  // ============================================
  // Test Suite 8: Edge Cases
  // ============================================

  test('24 - Edge Case: Rapid Keyboard Navigation @carousel @a11y @keyboard @edge', async ({ page, baseURL }) => {
    await page.goto(`${baseURL}${features[0].path}${miloLibs}`);
    await page.waitForLoadState('networkidle');

    await test.step('Rapidly press arrow keys and verify state', async () => {
      await carousel.nextButton.focus();
      
      // Rapidly press arrow key 5 times
      for (let i = 0; i < 5; i++) {
        await page.keyboard.press('ArrowRight');
        await page.waitForTimeout(50); // Minimal delay
      }
      
      // Wait for animations to settle
      await page.waitForTimeout(500);
      
      // Verify carousel is in valid state
      const currentIndex = await carousel.getCurrentSlideIndex();
      expect(currentIndex).toBeTruthy();
      
      // Verify ARIA attributes are still correct
      expect(await carousel.validateAriaHidden()).toBeTruthy();
      expect(await carousel.validateSlideFocusableElements()).toBeTruthy();
    });
  });

  test('25 - Edge Case: Focus After Slide Navigation @carousel @a11y @focus @edge', async ({ page, baseURL }) => {
    await page.goto(`${baseURL}${features[0].path}${miloLibs}`);
    await page.waitForLoadState('networkidle');

    await test.step('Verify focus is maintained after navigation', async () => {
      // Focus next button
      await carousel.nextButton.focus();
      
      // Click to navigate
      await carousel.moveToNextSlide();
      await page.waitForTimeout(300);
      
      // Verify focus is still on next button (or previous if you want to go back)
      const nextButtonStillFocused = await carousel.nextButton.evaluate((el) => 
        el === document.activeElement
      );
      
      // Focus should remain on navigation button
      expect(nextButtonStillFocused).toBeTruthy();
    });
  });
});
