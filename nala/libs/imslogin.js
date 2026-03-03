/* eslint-disable import/no-import-module-exports, import/no-extraneous-dependencies, max-len, no-console */
import { expect } from '@playwright/test';
import selectors from '../features/imslogin/imslogin.page.js';

const isLocatorVisible = async (locator) => {
  try { return await locator.first().isVisible(); } catch { return false; }
};

const getPasswordField = async (page) => {
  // IMS native selectors first, then generic visible password inputs.
  // Microsoft SSO pages contain a hidden input[name="passwd"] that must be
  // skipped; restrict the generic fallback to *visible* elements.
  const selectorCandidates = [
    selectors['@password'],
    'input[name="passwd"]:visible',
    'input[type="password"]:visible',
  ];

  for (const selector of selectorCandidates) {
    const locator = page.locator(selector);
    if (await locator.count() && await isLocatorVisible(locator)) {
      return locator.first();
    }
  }

  for (const frame of page.frames()) {
    for (const selector of selectorCandidates) {
      const locator = frame.locator(selector);
      if (await locator.count() && await isLocatorVisible(locator)) {
        return locator.first();
      }
    }
  }

  return null;
};

const clickUsePasswordIfPresent = async (page) => {
  const usePassword = page.getByText(/use (a )?password/i).first();
  if (await usePassword.count()) {
    await usePassword.click().catch(() => {});
  }

  for (const frame of page.frames()) {
    const frameUsePassword = frame.getByText(/use (a )?password/i).first();
    if (await frameUsePassword.count()) {
      await frameUsePassword.click().catch(() => {});
    }
  }
};

async function clickSignin(page) {
  const signinBtn = page.locator(selectors['@gnav-signin']);
  await expect(signinBtn).toBeVisible();
  await signinBtn.click();
}

async function fillOutSignInForm(props, page) {
  expect(process.env.IMS_EMAIL, 'ERROR: No environment variable for email provided for IMS Test.').toBeTruthy();
  expect(process.env.IMS_PASS, 'ERROR: No environment variable for password provided for IMS Test.').toBeTruthy();

  await expect(page).toHaveTitle(/Adobe ID|Sign in|Sign In/i, { timeout: 30000 });
  const emailField = page.locator(selectors['@email']);
  await expect(emailField).toBeVisible({ timeout: 45000 });

  // Heading can vary by IMS rollout; validate only if it exists.
  const headingLocator = page.locator(selectors['@page-heading']).first();
  if (await headingLocator.count()) {
    const heading = await headingLocator.innerText();
    expect(heading.toLowerCase()).toContain('sign in');
  }

  // Fill out Sign-in Form
  await expect(async () => {
    await emailField.fill(process.env.IMS_EMAIL);
    await page.locator(selectors['@email-continue-btn']).click();

    // Wait for the password page to load; some IMS flows show a
    // "Use password" link before revealing the actual password field.
    await clickUsePasswordIfPresent(page);

    // Poll until a *visible* password field appears.
    await expect.poll(async () => {
      await clickUsePasswordIfPresent(page);
      const field = await getPasswordField(page);
      return !!field;
    }, { timeout: 60000, intervals: [1_000] }).toBeTruthy();
  }).toPass({
    intervals: [1_000],
    timeout: 60_000,
  });

  const passwordHeading = page.locator(selectors['@page-heading'], { hasText: 'Enter your password' }).first();
  if (await passwordHeading.count()) {
    const heading = await passwordHeading.innerText();
    expect(heading).toBe('Enter your password');
  }
  const passwordField = await getPasswordField(page);
  expect(passwordField, 'Expected a visible password field on IMS login page').toBeTruthy();
  await passwordField.fill(process.env.IMS_PASS);

  // Click the appropriate continue/submit button.
  // Adobe IMS uses a specific data-id selector; Microsoft SSO uses
  // input[type=submit] with id "idSIButton9".
  const imsContinueBtn = page.locator(selectors['@password-continue-btn']);
  const msSubmitBtn = page.locator('input#idSIButton9');
  if (await imsContinueBtn.count()) {
    await imsContinueBtn.click();
  } else if (await msSubmitBtn.count()) {
    await msSubmitBtn.click();
  } else {
    // Fallback: click any visible submit-like button.
    await page.locator('button[type="submit"], input[type="submit"]').first().click();
  }
  // Microsoft SSO may show a "Stay signed in?" interstitial; dismiss it.
  const staySignedIn = page.locator('input#idSIButton9, input#idBtn_Back');
  if (await staySignedIn.count().catch(() => 0)) {
    await staySignedIn.first().click().catch(() => {});
  }

  await page.waitForURL(`${props.url}#`, { timeout: 60000 });
  await expect(page).toHaveURL(`${props.url}#`);
}

module.exports = { clickSignin, fillOutSignInForm };
