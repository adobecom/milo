import { expect } from '@playwright/test';

export default class Georouting {
    constructor(page) {
        this.page = page;

        // global footer locators
        this.footer = this.page.locator('.global-footer');
        //this.changeRegionLink = this.footer.locator('//a[@data-modal-path="/fragments/regions"]');
        this.changeRegionLink = this.footer.locator('.modal.link-block');

        // change region modal locators
        this.changeRegionModal = this.page.locator('.dialog-modal');
        this.fragment = this.changeRegionModal.locator('.fragment');
        this.regionNav = this.changeRegionModal.locator('.region-nav');
        this.deLink = this.changeRegionModal.locator('//a[text()="Deutschland"]');
        this.usLink = this.changeRegionModal.locator('//a[text()="United States"]/@href');
        this.modalClose = this.changeRegionModal.locator('.dialog-close');

        // georouting modal locators
        this.geoModal = this.page.locator('#locale-modal-v2');
        this.geoModalTitle = this.geoModal.locator('h3');
        this.geoModalText = this.geoModal.locator('.locale-text');
        this.geoModalClose = this.geoModal.locator('.dialog-close');
        this.usButton = this.geoModal.locator('//a[text()="United States"][@lang="en-US"]');
    }

    /**
    * Verifies georouting modal.
    * @param {data}  - data object from spec.
    * @returns {Promise<boolean>} - Returns true if modal content is as expected.
    */
    async verifyGeoModal(data) {
        try {
            await expect(this.geoModal).toBeVisible();
            await expect(this.geoModalClose).toBeVisible();
            await expect(this.geoModalTitle).toContainText(data.title);
            await expect(this.geoModalText).toContainText(data.text);
            await expect(this.geoModal.locator(`//a[text()="${data.button}"]`)).toBeVisible({ timeout: 1000 });
            await expect(this.geoModal.locator(`//a[text()="${data.link}"]`)).toBeVisible({ timeout: 1000 });
            await expect(this.geoModal.locator(`//img[@alt="${data.flag}"]`)).toBeVisible({ timeout: 1000 });

            return true;
        } catch (error) {
            console.error('Georouting modal verification is failed:', error);
            return false;
        }
    }

    /**
    * Verifies multi tab georouting modal.
    * @param {data}  - data object from spec.
    * @returns {Promise<boolean>} - Returns true if modal content is as expected.
    */
    async verifyMultiTabGeoModal(data) {
        try {
            await expect(this.geoModal).toBeVisible();
            await expect(this.geoModalClose).toBeVisible();
            let index = 0;
            for (const tab in data) {
                console.info(`[Tab]: "${data[tab].name}"`);
                await this.geoModal.locator(`//button[text()="${data[tab].name}"]`).click();
                await expect(this.geoModalTitle.nth(index)).toContainText(data[tab].title,);
                await expect(this.geoModalText.nth(index)).toContainText(data[tab].text);
                await expect(this.geoModal.locator(`//a[text()="${data[tab].button}"]`)).toBeVisible({ timeout: 1000 });
                await expect(this.geoModal.locator(`//a[text()="${data[tab].link}"]`).nth(index)).toBeVisible({ timeout: 1000 });
                await expect(this.geoModal.locator(`//img[@alt="${data[tab].flag}"]`)).toBeVisible({ timeout: 1000 });
                index++
            }

            return true;
        } catch (error) {
            console.log('Georouting multi tab modal verification is failed:', error);
            return false;
        }
    }
}
