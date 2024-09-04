/* eslint-disable import/no-extraneous-dependencies, max-len, no-console, class-methods-use-this */

import { expect } from '@playwright/test';

const { request } = require('@playwright/test');

/**
 * A utility class for common web interactions.
 */
export default class WebUtil {
  /**
   * Create a new instance of WebUtil.
   * @param {object} page - A Playwright page object.
   */
  constructor(page) {
    this.page = page;
    this.locator = null;
  }

  /**
   * Check if the element associated with the current locator is visible.
   * @param {Locator} locator - The Playwright locator for the element to check.
   *
   */
  static async isVisible(locator) {
    this.locator = locator;
    await expect(this.locator).toBeVisible();
    return true;
  }

  /**
   * Check if the element associated with the current locator is displayed.
   * @param {Locator} locator - The Playwright locator for the element to check.
   * @returns {Promise<boolean>} - Resolves to `true` if the element is displayed, or `false`.
   */
  static async isDisplayed(locator) {
    this.locator = locator;
    try {
      return await this.locator.evaluate((e) => e.offsetWidth > 0 && e.offsetHeight > 0);
    } catch (e) {
      console.error(`Error checking if element is displayed for locator: ${locator.toString()}`, e);
      return false;
    }
  }

  /**
   * Click the element associated with the current locator.
   * @param {Locator} locator - The Playwright locator for the element to click.
   * @returns {Promise<void>} A Promise that resolves when the element has been clicked.
   */
  static async click(locator) {
    this.locator = locator;
    return this.locator.click();
  }

  /**
   * Get the inner text of the element associated with the current locator.
   * @param {Locator} locator - The Playwright locator for the element to retrieve text from.
   * @returns {Promise<string>} A Promise that resolves to the inner text of the element.
   */
  static async getInnerText(locator) {
    this.locator = locator;
    const innerText = await this.locator.innerText();
    return innerText;
  }

  /**
   * Get the text of the element associated with the current locator, filtered by the specified tag name.
   * @param {Locator} locator - The Playwright locator for the element to retrieve text from.
   * @param {string} tagName - The name of the tag to filter by (e.g. "p", "span", etc.).
   * @returns {Promise<string>} A Promise that resolves to the text of the element, filtered by the specified tag name.
   */
  static async getTextByTag(locator, tagName) {
    this.locator = locator;
    return this.locator.$eval(tagName, (e) => e.textContent);
  }

  /**
   * Get the value of the specified attribute on the element associated with the current locator.
   * @param {Locator} locator - The Playwright locator for the element to retrieve the attribute from.
   * @param {string} attributeName - The name of the attribute to retrieve (e.g. "class", "data-attr", etc.).
   * @returns {Promise<string>} A Promise that resolves to the value of the specified attribute on the element.
   */
  static async getAttribute(locator, attributeName) {
    this.locator = locator;
    return this.locator.getAttribute(attributeName);
  }

  /**
   * Verifies that the specified CSS properties of the given locator match the expected values.
   * @param {Object} locator - The locator to verify CSS properties for.
   * @param {Object} cssProps - The CSS properties and expected values to verify.
   * @returns {Boolean} - True if all CSS properties match the expected values, false otherwise.
   */
  async verifyCSS(locator, cssProps) {
    this.locator = locator;
    let result = true;
    await Promise.allSettled(
      Object.entries(cssProps).map(async ([property, expectedValue]) => {
        try {
          await expect(this.locator).toHaveCSS(property, expectedValue);
        } catch (error) {
          console.error(`CSS property ${property} not found:`, error);
          result = false;
        }
      }),
    );
    return result;
  }

  /**
   * Verifies that the specified attribute properties of the given locator match the expected values.
   * @param {Object} locator - The locator to verify attributes.
   * @param {Object} attProps - The attribute properties and expected values to verify.
   * @returns {Boolean} - True if all attribute properties match the expected values, false otherwise.
  */
  async verifyAttributes(locator, attProps) {
    this.locator = locator;
    let result = true;
    await Promise.allSettled(
      Object.entries(attProps).map(async ([property, expectedValue]) => {
        if (property === 'class' && typeof expectedValue === 'string') {
          // If the property is 'class' and the expected value is an string,
          // split the string value into individual classes
          const classes = expectedValue.split(' ');
          try {
            await expect(await this.locator).toHaveClass(classes.join(' '));
          } catch (error) {
            console.error('Attribute class not found:', error);
            result = false;
          }
        } else {
          try {
            await expect(await this.locator).toHaveAttribute(property, expectedValue);
          } catch (error) {
            console.error(`Attribute ${property} not found:`, error);
            result = false;
          }
        }
      }),
    );
    return result;
  }

  /**
   * Slow/fast scroll of entire page JS evaluation method, aides with lazy loaded content.
   * This wrapper method calls a scroll script in page.evaluate, i.e. page.evaluate(scroll, { dir: 'direction', spd: 'speed' });
   * @param direction string direction you want to scroll on the page
   * @param speed string speed you would like to scroll through the page. Options: slow, fast
   */
  async scrollPage(direction, speed) {
    const scroll = async (args) => {
      const { dir, spd } = args;
      // eslint-disable-next-line no-promise-executor-return
      const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
      const scrollHeight = () => document.body.scrollHeight;
      const start = dir === 'down' ? 0 : scrollHeight();
      const shouldStop = (position) => (dir === 'down' ? position > scrollHeight() : position < 0);
      const increment = dir === 'down' ? 100 : -100;
      const delayTime = spd === 'slow' ? 30 : 5;
      console.error(start, shouldStop(start), increment);
      for (let i = start; !shouldStop(i); i += increment) {
        window.scrollTo(0, i);
        // eslint-disable-next-line no-await-in-loop
        await delay(delayTime);
      }
    };

    await this.page.evaluate(scroll, { dir: direction, spd: speed });
  }

  /**
   * Check if the modal associated with the current locator is within the viewport.
   * @param page - calling method page object.
   * @returns {Promise<boolean>} - Resolves to true if the modal is within the viewport, or false.
   */
  static async isModalInViewport(page, selector) {
    try {
      const inViewport = await page.evaluate((sel) => {
        const modalDialog = document.querySelector('.dialog-modal');
        if (!modalDialog) {
          throw new Error(`Modal element with selector '${sel}' not found.`);
        }
        const rect = modalDialog.getBoundingClientRect();
        return (
          rect.top >= 0
        && rect.left >= 0
        && rect.bottom
          <= (window.innerHeight || document.documentElement.clientHeight)
        && rect.right
          <= (window.innerWidth || document.documentElement.clientWidth)
        );
      }, selector);

      return inViewport;
    } catch (error) {
      console.error('Error verifying modal veiwport:', error);
      return false;
    }
  }

  /**
   * Load test data from remote json file
   * @param {string} path
   * @param {string} url
  */
  static async loadTestDataFromAPI(url, path) {
    const context = await request.newContext({ baseURL: url });
    const res = await context.fetch(path);
    return res.json();
  }

  /**
   * Enable network logging
   * @param {Array} networklogs - An array to store all network logs
   */
  async enableNetworkLogging(networklogs) {
    await this.page.route('**', (route) => {
      const url = route.request().url();
      if (url.includes('sstats.adobe.com/ee/or2/v1/interact')
       || url.includes('sstats.adobe.com/ee/or2/v1/collect')) {
        networklogs.push(url);
        const firstEvent = route.request().postDataJSON().events[0];
        // eslint-disable-next-line no-underscore-dangle
        if (firstEvent.data._adobe_corpnew.digitalData.primaryEvent) {
          // eslint-disable-next-line no-underscore-dangle
          networklogs.push(JSON.stringify(firstEvent.data._adobe_corpnew.digitalData.primaryEvent));
        }

        // eslint-disable-next-line no-underscore-dangle
        if (firstEvent.data._adobe_corpnew.digitalData.search) {
          // eslint-disable-next-line no-underscore-dangle
          networklogs.push(JSON.stringify(firstEvent.data._adobe_corpnew.digitalData.search));
        }
      }
      route.continue();
    });
  }

  /**
   * Disable network logging
   */
  async disableNetworkLogging() {
    await this.page.unroute('**');
  }

  /**
   * Generates analytic string for a given project.
   * @param {string} project - The project identifier, defaulting to 'milo' if not provided.
   * @returns {string} - A string formatted as 'gnav|<project>|nopzn|nopzn'.
   */
  async getGnavDaalh(project) {
    return `gnav|${project}|nopzn|nopzn`;
  }

  /**
   * Generates analytic string for a given project.
   * @param {string} project - The project identifier, defaulting to 'milo' if not provided.
   * @param {string} pznExpName - Personalized experience name, which is sliced to its first 15 characters.
   * @param {string} pznFileName - Manifest filename, which is sliced to its first 20 characters.
   * @returns {string} - A string formatted as 'gnav|<project>|<pznExpName>|<pznFileName>'.
   */
  async getPznGnavDaalh(pznExpName, pznFileName, project) {
    const slicedExpName = pznExpName.slice(0, 15);
    const slicedFileName = pznFileName.slice(0, 15);
    return `gnav|${project}|${slicedExpName}|${slicedFileName}`;
  }

  /**
   * Generates analytic string for a section based on a given counter value.
   * @param {number|string} counter - A counter value used to generate the section identifier.
   * @returns {string} - A string formatted as 's<counter>'.
   */
  async getSectionDaalh(counter) {
    return `s${counter}`;
  }

  /**
   * Generates personalization analytic string for a given block name and a counter.
   * @param {string} blockName - The name of the block, which is sliced to its first 20 characters.
   * @param {number|string} counter - A counter value i.e. block number.
   * @param {string} pznExpName - Personalized experience name, which is sliced to its first 15 characters.
   * @param {string} pznExpName - Manifest filename, which is sliced to its first 20 characters.
   * @returns {string} - A string formatted as 'b<counter>|<slicedBlockName>|<pznExpName>|<pznExpName>'.
   */
  async getPznBlockDaalh(blockName, counter, pznExpName, pznFileName) {
    const slicedBlockName = blockName.slice(0, 20);
    const slicedExpName = pznExpName.slice(0, 15);
    const slicedFileName = pznFileName.slice(0, 15);
    return `b${counter}|${slicedBlockName}|${slicedExpName}|${slicedFileName}`;
  }

  /**
   * Generates an analytic string for a given block name and a counter.
   * @param {string} blockName - The name of the block, which is sliced to its first 20 characters.
   * @param {number|string} counter - A counter value, i.e., block number.
   * @param {boolean} [pzn=false] - A boolean flag indicating whether to use pzntext.
   * @param {string} [pzntext='nopzn'] - The pzntext to use when pzn is true, sliced to its first 15 characters.
   * @returns {string} - A formatted string.
   */
  async getBlockDaalh(blockName, counter, pzn = false, pzntext = 'nopzn') {
    const slicedBlockName = blockName.slice(0, 15);
    const slicedPzntext = pzntext.slice(0, 15);
    if (pzn) {
      return `b${counter}|${slicedBlockName}|${slicedPzntext}|nopzn`;
    }
    return `b${counter}|${slicedBlockName}`;
  }

  /**
   * Generates analytic string for link or button based on link/button text , a counter, and the last header text.
   * @param {string} linkText - The text of the link, which is cleaned and sliced to its first 20 characters.
   * @param {number|string} counter - A counter value used in the identifier.
   * @param {string} lastHeaderText - The last header text, which is cleaned and sliced to its first 20 characters.
   * @param {boolean} [pzn=false] - boolean parameter, defaulting to false.(for personalization)
   * @returns {string} - A string formatted as '<cleanedLinkText>-<counter>--<cleanedLastHeaderText>'.
   */
  async getLinkDaall(linkText, counter, lastHeaderText) {
    const cleanAndSliceText = (text) => text
      ?.replace(/[^\w\s]+/g, ' ')
      .replace(/\s+/g, ' ')
      .replace(/^_+|_+$/g, '')
      .trim()
      .slice(0, 20);
    const slicedLinkText = cleanAndSliceText(linkText);
    const slicedLastHeaderText = cleanAndSliceText(lastHeaderText);
    return `${slicedLinkText}-${counter}--${slicedLastHeaderText}`;
  }
}
