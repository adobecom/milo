import { expect, test } from '@playwright/test';
import WebUtil from '../../libs/webutil.js';
import { features } from './email-collection.spec.js';
import EmailCollectionBlock from './email-collection.page.js';
import { runAccessibilityTest } from '../../libs/accessibility.js';

let webUtil;
let marquee;
let emailCollection;

const miloLibs = process.env.MILO_LIBS || '';
const branchName = process.env.branch || '';

const isValidBranch = /^mwpw-\d{6}$/i.test(branchName);

test.skip(
  !isValidBranch,
  `Skipping Email Collection tests — branch name "${branchName}" does not match format "MWPW-123456"`,
);

test.describe('Milo Email Collection Block test suite', () => {
  test.beforeEach(async ({ page }) => {
    webUtil = new WebUtil(page);
    emailCollection = new EmailCollectionBlock(page);
    marquee = new EmailCollectionBlock(page);
  });

  test(`[Test Id - ${features[0].tcid}] ${features[0].name},${features[0].tags}`, async ({ page, baseURL }) => {
    console.info(`[Test Page]: ${baseURL}${features[0].path}${miloLibs}`);
    const { data } = features[0];

    await test.step('step-1: Go to test page', async () => {
      await page.goto(`${baseURL}${features[0].path}${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[0].path}${miloLibs}`);
    });

    await test.step('step-2: Verify marquee dark specs', async () => {
      await expect(await marquee.marqueeDark).toBeVisible();

      await expect(await marquee.headingXL).toContainText(data.marquee.h2Text);
      await expect(await marquee.bodyM).toContainText(data.marquee.bodyText);
      await expect(await marquee.outlineButton).toContainText(data.marquee.outlineButtonText);
      await expect(await marquee.filledButtonL).toContainText(data.marquee.blueButtonText);
    });

    await test.step('step-3: Verify marquee dark analytic attributes', async () => {
      await expect(await marquee.marqueeDark).toHaveAttribute('daa-lh', await webUtil.getBlockDaalh('marquee', 1));
    });

    await test.step('step-4: Verify the accessibility test on the marquee dark', async () => {
      await runAccessibilityTest({ page, testScope: marquee.marqueeDark });
    });

    await test.step('step-5: Login on full form', async () => {
      test.setTimeout(120000);
      const context = page.context();
      await context.setExtraHTTPHeaders({
        'sec-ch-ua': '"Chromium";v="125", "Not.A/Brand";v="8", "Google Chrome";v="125"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      });
      await emailCollection.outlineButton.click();
      await page.waitForLoadState('domcontentloaded');
      const email = process.env.EMAIL_COLLECTION_IMS_MAIL;
      const password = process.env.EMAIL_COLLECTION_IMS_PASS;
      await emailCollection.loginToOpenForm(email, password);
      await marquee.emailCollection.waitFor({ state: 'visible', timeout: 60000 });
      await emailCollection.emailCollectionFillForm.waitFor({ state: 'visible', timeout: 60000 });
    });

    await test.step('step-6: Verify email-collection form spec', async () => {
      await expect(await emailCollection.firstNameLabel).toHaveValue(data.emailCollectionForm.firstNameLabel);
      await expect(await emailCollection.lastNameLabel).toHaveValue(data.emailCollectionForm.lastNameLabel);
      await expect(await emailCollection.emailLabel).toHaveValue(process.env.EMAIL_COLLECTION_IMS_MAIL);
      await expect(await emailCollection.countryLabel).toHaveValue(data.emailCollectionForm.countryLabel);
      await expect(await emailCollection.organizationLabel).toHaveAttribute('placeholder', data.emailCollectionForm.organizationLabel);
      await expect(await emailCollection.occupationLabel).toHaveAttribute('placeholder', data.emailCollectionForm.occupationLabel);
      await expect(await emailCollection.emailLabel).toHaveAttribute('required', 'true');
      await expect(await emailCollection.organizationLabel).toHaveAttribute('required', 'true');
      await expect(await emailCollection.occupationLabel).toHaveAttribute('required', 'true');
      await expect(await emailCollection.consentString).toContainText(data.emailCollectionForm.consentText);
      await expect(await emailCollection.submitButton).toContainText(data.emailCollectionForm.outlineButtonText);

      await emailCollection.closeOneTrustBanner();
      await emailCollection.clearEmailField();
      await emailCollection.submitButton.click();

      await expect(await emailCollection.requiredEmailField).toContainText(data.emailCollectionForm.bodyXS);
      await expect(await emailCollection.requiredOrganizationField).toContainText(data.emailCollectionForm.bodyXS);
      await expect(await emailCollection.requiredOccupationField).toContainText(data.emailCollectionForm.bodyXS);

      expect(await webUtil.verifyAttributes(emailCollection.foregroundImg, emailCollection.attributes['email.collection.form'].foregroundImg)).toBeTruthy();
    });

    await test.step('step-7: Verify email-collection form analytic attributes', async () => {
      await expect(await marquee.emailCollection).toHaveAttribute('daa-lh', await webUtil.getBlockDaalh('email-collectio', 1));
      await expect(await emailCollection.submitButton).toHaveAttribute('daa-ll', await webUtil.getLinkDaall('Submit', 4, ''));

      const { links } = data.emailCollectionForm;
      for (const link of links) {
        const linkLocator = emailCollection.consentString.locator(`a:has-text("${link.text}")`);
        await expect(linkLocator).toHaveAttribute(
          'daa-ll',
          await webUtil.getLinkDaall(link.text, link.number, ''),
        );
      }
    });

    await test.step('step-8: Verify the accessibility test on the email-collection form', async () => {
      await runAccessibilityTest({ page, testScope: marquee.emailCollection });
    });

    await test.step('step-9: Submit with another email', async () => {
      await emailCollection.enterNewEmail();
      await emailCollection.enterOrganization();
      await emailCollection.enterOccupation();
      await emailCollection.submitButton.click({ force: true });
      await page.waitForLoadState('domcontentloaded');
      await marquee.foregroundMessage.waitFor({ state: 'visible', timeout: 60000 });
      await expect(marquee.foregroundMessage).toBeVisible();
    });

    await test.step('step-10: Verify submited message spec', async () => {
      await expect(emailCollection.foregroundHeading).toContainText(data.submitedMessage.h2Text);
      await expect(emailCollection.foregroundText).toContainText(data.submitedMessage.bodyText);
      await expect(emailCollection.backToTheWebsiteButton).toContainText(data.submitedMessage.outlineButtonText);

      expect(await webUtil.verifyAttributes(emailCollection.foregroundImg, emailCollection.attributes['email.collection.form'].foregroundImg)).toBeTruthy();
    });

    await test.step('step-11: Verify submited message analytic attributes', async () => {
      const actualDaaLl = await emailCollection.backToTheWebsiteButton.getAttribute('daa-ll');
      const expectedDaaLl = await webUtil.getLinkDaall(data.submitedMessage.outlineButtonText, 5, 'We ve received your');
      expect(actualDaaLl?.trim()).toBe(expectedDaaLl);
    });

    await test.step('step-12: Verify the accessibility test on the submited message', async () => {
      await runAccessibilityTest({ page, testScope: marquee.foregroundMessage });
    });

    await test.step('step-13: Verify subscribed message spec', async () => {
      await emailCollection.closeForm();
      await marquee.filledButtonL.click();
      await page.waitForLoadState('networkidle');

      await marquee.foregroundMessage.waitFor({ state: 'visible', timeout: 60000 });
      await expect(emailCollection.foregroundHeading).toContainText(data.submitedMessage.h2Text);
      await expect(emailCollection.subscribedEmail).toContainText(process.env.EMAIL_COLLECTION_IMS_MAIL);

      expect(await webUtil.verifyAttributes(emailCollection.foregroundImg, emailCollection.attributes['email.collection.form'].foregroundImg)).toBeTruthy();
    });

    await test.step('step-14: Verify subscribed message analytic attributes', async () => {
      await expect(await emailCollection.closeButton).toHaveAttribute('daa-ll', 'large-image:modalClose:buttonClose');
    });
  });
});
