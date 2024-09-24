// eslint-disable-next-line import/no-import-module-exports
import { expect } from '@playwright/test';

export default class FedsLogin {
  constructor(page) {
    this.page = page;

    this.loginButton = page.locator('button#sign_in');
    this.loginForm = page.locator('form#adobeid_signin');
    this.emailField = page.locator('input#adobeid_username');
    this.passwordField = page.locator('input#adobeid_password');

    this.loggedInState = page.locator('img.feds-profile-img');
    this.loginWithEnterpriseId = page.locator('a#enterprise_signin_link');
    this.forgotPasswordLink = page.locator('a#adobeid_trouble_signing_in');

    this.loginWithFacebook = page.locator('a.mod-facebook');
    this.loginWithGoogle = page.locator('a.mod-google');
    this.loginWithApple = page.locator('a.mod-apple');

    this.appEmailForm = page.locator('form#EmailForm');
    this.appPasswordForm = page.locator('form#PasswordForm');
    this.appEmailField = page.locator('input#EmailPage-EmailField');
    this.appPasswordField = page.locator('input#PasswordPage-PasswordField');
    this.appVisibilityToggle = page.locator('button.PasswordField-VisibilityToggle');
    this.appPasswordContinue = page.locator('button[data-id^="EmailPage"]');
    this.appLoginContinue = page.locator('button[data-id^="PasswordPage"]');
    this.personalAccountLogo = page.locator('img[alt="Personal Account"]');
    this.selectAccountForm = page.locator('div[data-id="Profile"]');

    this.appEmailFieldSelector = page.locator('input#EmailPage-EmailField');
    this.appPasswordFieldSelector = page.locator('input#PasswordPage-PasswordField');
    this.codePadChallenge = page.locator('div[data-id="ChallengeCodePage"]');
  }

  /**
   * Login on the IMS APP login form with email & password.
   * @param  {string} email
   * @param  {string} password
   * @return {Promise} PlayWright promise
   */
  async loginOnAppForm(email, password) {
    console.info('[EuroLogin] APP login form identified!');
    // Check EMAIL & PASSWWORD status:
    expect(process.env.IMS_EMAIL, 'ERROR: No environment variable found for IMS_EMAIL').toBeTruthy();
    expect(process.env.IMS_PASS, 'ERROR: No environment variable found for IMS_PASS.').toBeTruthy();
    console.info(`[EuroLogin] Logging in with '${email}' account ...`);
    // Wait for page to load & stabilize:
    await this.page.waitForLoadState('domcontentloaded');
    // Wait for the SUSI login form to load:
    await this.appEmailForm.waitFor({ state: 'visible', timeout: 15000 });
    // Insert account email & click 'Continue':
    await this.appEmailField.waitFor({ state: 'visible', timeout: 15000 });
    await this.appEmailField.fill(email);
    await this.appPasswordContinue.waitFor({ state: 'visible', timeout: 15000 });
    await expect(this.appPasswordContinue).toHaveText('Continue');
    await this.appPasswordContinue.click();
    // Wait for page to load & stabilize:
    await this.page.waitForTimeout(5000);
    // Insert account password & click 'Continue':
    // await this.appPasswordForm.waitFor({state: 'visible', timeout: 15000});
    await this.appPasswordField.waitFor({ state: 'visible', timeout: 15000 });
    await this.appPasswordField.fill(password);
    await this.appLoginContinue.waitFor({ state: 'visible', timeout: 15000 });
    await expect(this.appLoginContinue).toHaveText('Continue');
    await this.appLoginContinue.click();
    // Check if login process was successful:
    await this.loggedInState.waitFor({ state: 'visible', timeout: 20000 });
    console.info(`[EuroLogin] Successfully logged-in as '${email}' (via APP login form).`);
  }

  /**
   * Login on the IMS SUSI login form with email & password.
   * @param  {string} email
   * @param  {string} password
   * @return {Promise} PlayWright promise
   */
  async loginOnSusiForm(email, password) {
    console.info('[EuroLogin] SUSI login form identified!');
    // Check EMAIL & PASSWWORD status:
    expect(process.env.IMS_EMAIL, 'ERROR: No environment variable found for IMS_EMAIL').toBeTruthy();
    expect(process.env.IMS_PASS, 'ERROR: No environment variable found for IMS_PASS.').toBeTruthy();
    console.info(`[EuroLogin] Logging in with '${email}' account ...`);
    // Wait for page to load & stabilize:
    await this.page.waitForLoadState('networkidle');
    // Wait for the SUSI login form to load:
    await this.loginForm.waitFor({ state: 'visible', timeout: 15000 });
    await this.emailField.fill(email);
    // !Note: Email field has short client-side validation (load).
    //        Password field is not interactable during that time.
    await this.page.keyboard.press('Tab');
    // Wait for page to load & stabilize:
    await this.page.waitForLoadState('domcontentloaded');
    // Set password & click 'Continue':
    await this.appPasswordForm.waitFor({ state: 'visible', timeout: 15000 });
    await this.passwordField.waitFor({ state: 'visible', timeout: 15000 });
    await this.passwordField.fill(password);
    // Complete the login flow:
    await this.loginButton.waitFor({ state: 'visible', timeout: 15000 });
    await this.loginButton.click();
    // Check if login process was successful:
    await this.loggedInState.waitFor({ state: 'visible', timeout: 20000 });
    console.info(`[EuroLogin] Successfully logged-in as '${email}' (via SUSI login form).`);
  }

  /**
   * Toggles the visibility of the IMS password field.
   * @param  {string} password
   * @return {Promise} PlayWright promise
   */
  async TogglePasswordVisibility(password) {
    await this.appVisibilityToggle.waitFor({ state: 'visible', timeout: 15000 });
    await this.appVisibilityToggle.click();
    await expect(this.appPasswordField).toContain(password);
    await this.appVisibilityToggle.click();
    await this.appVisibilityToggle.waitFor({ state: 'visible', timeout: 15000 });
  }
}
