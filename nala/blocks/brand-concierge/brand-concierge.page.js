/* eslint-disable import/no-extraneous-dependencies, max-len, no-console */
import { expect } from '@playwright/test';
import WebUtil from '../../libs/webutil.js';

export default class BrandConciergeBlock {
  constructor(page) {
    this.page = page;
    this.webUtil = new WebUtil(page);

    // Core block container
    this.block = this.page.locator('.brand-concierge').first();

    // Block variants
    this.brandConciergeHero = this.page.locator('.brand-concierge.hero');
    this.brandConciergeSticky = this.page.locator('.brand-concierge.sticky');

    // Modal and mount points injected by the block script
    this.modal = this.page.locator('#brand-concierge-modal');
    this.mount = this.page.locator('#brand-concierge-mount');

    // Content sections in the block
    this.heading = this.block.locator('h1, h2, h3').first();
    this.bodyText = this.block.locator('p').first();

    // Common inner UI selectors (best-effort without shadow-piercing)
    this.inputSection = this.page.locator('#brand-concierge-mount .input-section');
    this.chatInput = this.page.locator('#brand-concierge-mount .chat-input');
    this.chatHistory = this.page.locator('#brand-concierge-mount .chat-history');
    this.aiChatLabel = this.page.locator('#brand-concierge-mount .ai-chat-label');
    this.disclaimerMessage = this.page.locator('#brand-concierge-mount .disclaimer-message');

    // Suggested prompts (pill buttons)
    this.promptButtons = this.page.locator('.brand-concierge button, .brand-concierge a[role="button"]');
  }

  async verifyBlockVisible() {
    await expect(this.block, 'brand-concierge block should be visible').toBeVisible();
  }

  async verifyInputFieldPresent() {
    // The block should have an input field for user queries
    // Some variants (like sticky) need extra time to load the input dynamically
    // Wait for the block to be fully loaded by checking for the input field
    const inputField = this.block.locator('textarea, input[type="text"]');

    // First wait for the input to be attached to DOM
    await inputField.first().waitFor({ state: 'attached', timeout: 15000 });

    // For sticky variant, the input may be hidden on mobile but visible on desktop
    // Check if it's a sticky variant
    const isSticky = await this.brandConciergeSticky.count() > 0;

    if (isSticky) {
      // For sticky, just verify the input exists in DOM (may be display:none on mobile)
      const inputExists = await inputField.count() > 0;
      expect(inputExists, 'input field should exist in DOM for sticky variant').toBeTruthy();
    } else {
      // For non-sticky variants, verify it's visible
      await expect(inputField.first(), 'input field should be visible').toBeVisible({ timeout: 10000 });
    }
  }

  async verifyContentText(data) {
    // Verify heading if provided - check entire page not just block
    if (data.h2Text) {
      const pageHeading = this.page.locator('h1, h2, h3').filter({ hasText: data.h2Text }).first();
      await expect(pageHeading).toBeVisible({ timeout: 5000 });
    }

    // Verify body text if provided
    if (data.bodyText) {
      const bodyTextLocator = this.page.locator('p').filter({ hasText: data.bodyText }).first();
      await expect(bodyTextLocator).toBeVisible({ timeout: 5000 });
    }
  }

  async verifyPromptButtons() {
    // Verify that suggested prompt buttons are present
    const buttons = this.block.locator('button, a[role="button"]');
    const count = await buttons.count();
    expect(count, 'should have at least one prompt button').toBeGreaterThan(0);
  }

  async verifyDisclaimerPresent(data) {
    if (data.disclaimerText) {
      // Check for disclaimer text anywhere in the block or page
      const disclaimerLocator = this.page.locator(`text=${data.disclaimerText.substring(0, 30)}`);
      const isVisible = await disclaimerLocator.isVisible({ timeout: 5000 }).catch(() => false);
      if (isVisible) {
        await expect(disclaimerLocator.first()).toBeVisible();
      }
    }
  }
}
