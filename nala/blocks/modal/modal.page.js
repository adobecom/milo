export default class Modal {
  constructor(page) {
    this.page = page;
    // modal locators
    this.dialog = this.page.locator('.dialog-modal');
    this.modal = this.page.locator('.dialog-modal');
    this.fragment = this.modal.locator('.fragment');
    this.headingXL = this.page.locator('.heading-xl');
    this.bodyM = this.page.locator('.body-m').nth(2);
    this.modalCloseButton = this.modal.locator('.dialog-close');
    this.dialogCloseButton = this.modal.locator('.dialog-close').nth(0);
    this.marqueeLight = this.dialog.locator('.marquee.light');
    this.modelSelector = '.dialog-modal';

    // text block
    this.textBlock = this.modal.locator('.text').nth(0);
    this.textBlockHeading = this.textBlock.locator('h2');
    this.textBlockBodyM = this.textBlock.locator('.body-m');

    // media block
    this.mediaBlock = this.modal.locator('.media').nth(0);
    this.mediaBlockdetailM = this.mediaBlock.locator('.detail-m');
    this.mediaBlockTextHeading = this.mediaBlock.locator('h2');
    this.mediaBlockTextBodyS = this.mediaBlock.locator('.body-s').first();

    // video block
    this.video = this.modal.locator('video').nth(0);

    // modal contents attributes
    this.attributes = {
      'modal-link': { class: 'modal link-block ' },
      'video.inline': {
        playsinline: '',
        autoplay: '',
        loop: '',
        muted: '',
      },
    };
  }

  /**
   * Gets the modal link based on the modal id.
   * Waits for the link to be visible before returning the locator.
   * @param {Object} data - The data object containing modalId.
   * @param {number} [timeout=3000] - Optional timeout for waiting.
   * @returns {Promise<Locator>} - The locator for the modal link.
   * @throws Will throw an error if the link is not found within the timeout.
   */
  async getModalLink(modalId, timeout = 1000) {
    if (!modalId) {
      throw new Error('Invalid data, "modalId" property is required.');
    }
    const selector = `a[href="#${modalId}"]`;
    const modalLink = this.page.locator(selector);
    try {
      await modalLink.waitFor({ state: 'visible', timeout });
      return modalLink;
    } catch (error) {
      throw new Error(`The modal link with selector "${selector}" could not be found within ${timeout}ms.`);
    }
  }
}
