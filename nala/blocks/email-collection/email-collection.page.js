import { expect } from '@playwright/test';
import FedsLogin from '../../features/feds/login/login.page.js';

export default class EmailCollectionBlock {
  constructor(page) {
    this.page = page;
    this.FedsLogin = new FedsLogin(this.page);
    // marquee
    this.marqueeDark = page.locator('.marquee');
    this.headingXL = this.marqueeDark.locator('.heading-xl');
    this.bodyM = this.marqueeDark.locator('.body-m');
    this.outlineButton = this.marqueeDark.locator('.con-button.outline');
    this.filledButtonL = this.marqueeDark.locator('.con-button.blue.button-l');

    // email collection form
    this.emailCollection = page.locator('.email-collection');
    this.emailCollectionFillForm = this.emailCollection.locator('.text #email-collection-form');
    this.firstNameLabel = this.emailCollectionFillForm.locator('#first-name');
    this.lastNameLabel = this.emailCollectionFillForm.locator('#last-name');
    this.emailLabel = this.emailCollectionFillForm.locator('#email');
    this.countryLabel = this.emailCollectionFillForm.locator('#country');
    this.organizationLabel = this.emailCollectionFillForm.locator('#organization');
    this.occupationLabel = this.emailCollectionFillForm.locator('#occupation');
    this.emailInputContainer = this.emailCollectionFillForm.locator('.input-container').nth(0);
    this.organizationInputContainer = this.emailCollectionFillForm.locator('.input-container').nth(1);
    this.occupationInputContainer = this.emailCollectionFillForm.locator('.input-container').nth(2);
    this.consentString = this.emailCollectionFillForm.locator('.body-xxs.consent-string');
    this.submitButton = this.emailCollectionFillForm.locator('.button-container .con-button.outline');
    this.closeButton = this.page.locator('.dialog-close');

    // required fields
    this.requiredEmailField = this.emailCollection.locator('#error-email');
    this.requiredOrganizationField = this.emailCollection.locator('#error-organization');
    this.requiredOccupationField = this.emailCollectionFillForm.locator('#error-occupation');

    // foregound messages
    this.foregroundMessage = this.page.locator('.foreground.message');
    this.foregroundHeading = this.emailCollection.locator('.foreground.message .text h2').first();
    this.foregroundText = this.emailCollection.locator('.foreground.message .text p.body-m').nth(1);
    this.subscribedEmail = this.emailCollection.locator('.foreground.message .text p.body-m');
    this.backToTheWebsiteButton = this.emailCollection.locator('.button-container .con-button.outline').nth(1);

    // foreground images
    this.foreground = this.emailCollection.locator('.foreground');
    this.foregroundImg = this.emailCollection.locator('div.foreground img').nth(0);
    this.iconImage = this.foreground.locator('.text p.icon-area img');
    this.bodyText = this.foreground.locator('.text p.body-m');

    // attributes
    this.attributes = {
      'email.collection.form': {
        foregroundImg: {
          loading: 'lazy',
          width: '442',
          height: '304',
        },
      },
    };
  }

  async loginToOpenForm(email, password) {
    // Check EMAIL & PASSWWORD status:
    expect(process.env.EMAIL_COLLECTION_IMS_MAIL, 'ERROR: No environment variable found for EMAIL_COLLECTION_IMS_MAIL').toBeTruthy();
    expect(process.env.EMAIL_COLLECTION_IMS_PASS, 'ERROR: No environment variable found for EMAIL_COLLECTION_IMS_PASS').toBeTruthy();

    // Wait for page to load & stabilize:
    await this.FedsLogin.appEmailField.waitFor({ state: 'visible', timeout: 15000 });
    await this.page.waitForLoadState('domcontentloaded');
    // Insert email & click 'Continue':
    await this.FedsLogin.appEmailField.waitFor({ state: 'visible', timeout: 15000 });
    await this.FedsLogin.appEmailField.fill(email);
    await this.FedsLogin.appPasswordContinue.waitFor({ state: 'visible', timeout: 15000 });
    await expect(this.FedsLogin.appPasswordContinue).toHaveText('Continue');
    await this.FedsLogin.appPasswordContinue.waitFor({ state: 'visible', timeout: 15000 });
    await expect(this.FedsLogin.appPasswordContinue).toBeEnabled();
    await this.FedsLogin.appPasswordContinue.click();
    // Insert password & click 'Continue':
    await this.FedsLogin.appPasswordField.waitFor({ state: 'visible', timeout: 15000 });
    await this.FedsLogin.appPasswordField.fill(password);
    await this.FedsLogin.appLoginContinue.waitFor({ state: 'visible', timeout: 15000 });
    await expect(this.FedsLogin.appLoginContinue).toHaveText('Continue');
    await this.FedsLogin.appLoginContinue.click();
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForLoadState('networkidle', { timeout: 30000 });
  }

  async closeForm() {
    const closeButton = this.page.locator('.dialog-close');
    await closeButton.click();
  }

  async enterNewEmail() {
    const emailLabel = this.page.locator('#email');
    const timestamp = Date.now();
    const newEmail = `test${timestamp}@adobe.com`;

    await emailLabel.fill(newEmail);
    await expect(emailLabel).toHaveValue(newEmail);
  }

  async clearEmailField() {
    const emailLabel = this.page.locator('#email');
    await emailLabel.fill('');
    await expect(emailLabel).toHaveValue('');
  }

  async enterOrganization() {
    const organizationLabel = this.page.locator('#organization');
    await organizationLabel.fill('Adobe');
  }

  async enterOccupation() {
    const occupationLabel = this.page.locator('#occupation');
    await occupationLabel.fill('QE');
  }

  async closeOneTrustBanner() {
    try {
      const acceptButton = await this.page.waitForSelector('#onetrust-accept-btn-handler', {
        timeout: 2000,
        state: 'visible',
      });

      if (acceptButton) {
        await acceptButton.click();
        const closeButton = await this.page.waitForSelector('.cs-close', {
          timeout: 2000,
          state: 'visible',
        }).catch(() => null);

        if (closeButton) {
          await closeButton.click();
        }
      }
    } catch (error) {
      'Button not visible';
    }
  }
}
