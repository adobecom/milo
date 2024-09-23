/* eslint-disable import/no-extraneous-dependencies, max-len, no-console, no-await-in-loop, import/extensions */
import { expect } from '@playwright/test';
import WebUtil from '../../libs/webutil.js';

export default class Icon {
  constructor(page) {
    this.page = page;
    this.webUtil = new WebUtil(page);
    // Icon block locators
    this.icon = this.page.locator('.icon-block').nth(0);
    this.iconImage = this.icon.locator('img');
    this.iconHeadingL = this.icon.locator('.heading-l');
    this.iconHeadingXL = this.icon.locator('.heading-xl');
    this.iconBodyM = this.icon.locator('p.body-m').nth(0);
    this.iconActionAreaBodyM = this.icon.locator('p.body-m.action-area').nth(0);
    this.iconActionAreaLink = this.icon.locator('.action-area a').nth(0);
    this.iconActionArea = this.icon.locator('.action-area');
    this.iconSupplemental = this.icon.locator('.supplemental-text');

    // icon blocks css
    this.cssProperties = {
      '.icon-block': {
        display: 'block',
        width: /^\d+px$/,
        position: 'relative',
      },
      '.con-block.xl-spacing-static-bottom': { 'padding-bottom': '56px' },
      '.con-block.xl-spacing-static-top': { 'padding-top': '104px' },
    };

    // icon blocks attributes
    this.attProperties = {
      icon: { class: 'icon-block' },
      'icon-fullwidth-medium': { class: 'icon-block full-width medium con-block' },
      'icon-fullwidth-medium-intro': {
        class:
          'icon-block full-width medium intro con-block xxxl-spacing-top xl-spacing-static-bottom',
      },
      'icon-fullwidth-large': { class: 'icon-block full-width large con-block' },
    };
  }

  /**
   * Verifies the visibility, css, attributes, styles, of elements or sections of
   * the specified Icon block.
   *
   * @param {string} iconType - The type of the Icon block to verify.
   * Possible values are 'icon-block (fullwidth, medium) ', 'icon-block (fullwidth, medium, intro)', and
   * 'icon-block (fullwidth, large)'.
   * @returns {Promise<boolean>} - Returns true if the specified Quote type has the expected values.
   */
  async verifyIcon(iconType, data) {
    // verify icon block and image visibility
    await expect(await this.icon).toBeVisible();
    await expect(await this.iconImage).toBeVisible();

    switch (iconType) {
      case 'icon block (fullwidth, medium)':
        // verify icon block contents
        await expect(await this.iconHeadingL).toContainText(data.headline);
        await expect(await this.iconBodyM).toContainText(data.body);
        await expect(await this.iconActionAreaBodyM).toContainText(data.buttonText);
        await expect(await this.iconSupplemental).toContainText(data.supplementalText);

        // verify icon block attributes and css
        expect(await this.webUtil.verifyAttributes(await this.icon, this.attProperties['icon-fullwidth-medium'])).toBeTruthy();

        expect(await this.webUtil.verifyCSS(await this.icon, this.cssProperties['.icon-block'])).toBeTruthy();

        return true;
      case 'icon block (fullwidth, medium, intro)':
        // verify icon block contents
        await expect(await this.iconHeadingL).toContainText(data.headline);
        await expect(await this.iconBodyM).toContainText(data.body);
        await expect(await this.iconActionAreaBodyM).toContainText(data.buttonText);
        await expect(await this.iconSupplemental).toContainText(data.supplementalText);

        // verify icon block attributes and css
        expect(await this.webUtil.verifyAttributes(await this.icon, this.attProperties['icon-fullwidth-medium-intro'])).toBeTruthy();

        expect(await this.webUtil.verifyCSS(await this.icon, this.cssProperties['.icon-block'])).toBeTruthy();
        expect(await this.webUtil.verifyCSS(await this.icon, this.cssProperties['.con-block.xl-spacing-static-bottom'])).toBeTruthy();
        expect(await this.webUtil.verifyCSS(await this.icon, this.cssProperties['.con-block.xl-spacing-static-top'])).toBeTruthy();

        return true;
      case 'icon block (fullwidth, large)':
        // verify icon block contents
        await expect(await this.iconHeadingXL).toContainText(data.headline);
        await expect(await this.iconBodyM).toContainText(data.body);
        await expect(await this.iconActionAreaLink).toContainText(data.linkText);

        // verify icon block attributes and css
        expect(await this.webUtil.verifyAttributes(await this.icon, this.attProperties['icon-fullwidth-large'])).toBeTruthy();

        expect(await this.webUtil.verifyCSS(await this.icon, this.cssProperties['.icon-block'])).toBeTruthy();

        return true;
      default:
        throw new Error(`Unsupported Text type: ${this.iconType}`);
    }
  }
}
