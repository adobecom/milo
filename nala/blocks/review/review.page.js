/* eslint-disable import/no-extraneous-dependencies, max-len, no-console */
import { expect } from '@playwright/test';

export default class Review {
  constructor(page) {
    this.page = page;
    // review block locators
    this.review = this.page.locator('.review');
    this.reviewTitle = this.review.locator('.hlx-reviewTitle');
    this.reviewFieldSet = this.review.locator('form input');
    this.reviewTextArea = this.review.locator('#rating-comments');
    this.sendButton = this.review.locator('input[type="submit"]');
  }

  /**
 * Verifies milo review block .
 * @param {string} data - data required to verify review block.
 * @returns {Promise<boolean>} - A Promise that resolves to true if the verification
 * is successful, or false if an error occurs.
 */
  async verifyReview(data) {
    try {
      // verify review blcok
      await expect(await this.review).toBeVisible();
      await expect(await this.reviewTitle).toContainText(data.reviewTitle);
      await expect(await this.reviewFieldSet).toHaveCount(data.reviewFields);

      // Expected values review checkboxes
      const expectedValues = [
        { tooltip: 'Poor', ariaLabel: 'Poor 1 Star', value: '1' },
        { tooltip: 'Below Average', ariaLabel: 'Below Average 2 Star', value: '2' },
        { tooltip: 'Good', ariaLabel: 'Good 3 Star', value: '3' },
        { tooltip: 'Very Good', ariaLabel: 'Very Good 4 Star', value: '4' },
        { tooltip: 'Outstanding', ariaLabel: 'Outstanding 5 Star', value: '5' },
      ];
      const reviewCheckBoxes = await this.reviewFieldSet.all();
      const checkBoxes = await Promise.all(reviewCheckBoxes.map(async (el) => el));
      // eslint-disable-next-line no-restricted-syntax
      for (const checkbox of checkBoxes) {
        const tooltip = await checkbox.getAttribute('data-tooltip');
        const ariaLabel = await checkbox.getAttribute('aria-label');
        const value = await checkbox.getAttribute('value');
        // Find the matching expected value
        const expectedValue = expectedValues.find((expected) => expected.tooltip === tooltip
        && expected.ariaLabel === ariaLabel
        && expected.value === value);
        // Verify the expected value
        if (!expectedValue) {
          console.log('Attributes and values are incorrect');
          return false;
        }
      }
      return true;
    } catch (error) {
      console.error(`Error review block: ${error}`);
      return false;
    }
  }

  /**
   * Submits the review rating / form.
   * @param {string} checkboxValue - The value of the checkbox to be selected.
   * @param {string} textareaValue - The value to be entered in the text area.
   * @returns {Promise<boolean>} - A Promise that resolves to true if the submission is successful,
   * or false if an error occurs.
   */
  async submitReview(data) {
    try {
      // Select the n-th rating checkbox
      const checkbox = await this.reviewFieldSet.nth(data.rating);

      // if the rating less than 3 then text area field is visible
      if (data.rating < 3) {
        await checkbox.check();
        await expect(await this.reviewTextArea).toBeVisible();
        await this.reviewTextArea.fill(data.reviewComment);

        // Click the send button
        await this.sendButton.click();
        return true;
      }
      await checkbox.check();
      return true;
    } catch (error) {
      console.error(`Error submitting the review: ${error}`);
      return false;
    }
  }
}
