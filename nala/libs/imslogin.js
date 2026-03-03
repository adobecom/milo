/* eslint-disable import/no-import-module-exports, import/no-extraneous-dependencies, max-len, no-console */
import { expect } from '@playwright/test';
import selectors from '../features/imslogin/imslogin.page.js';

const getPasswordField = async (page) => {
  const selectorCandidates = [
    selectors['@password'],
    'input[type="password"]',
  ];

  for (const selector of selectorCandidates) {
    const locator = page.locator(selector);
    if (await locator.count()) return locator.first();
  }

  for (const frame of page.frames()) {
    for (const selector of selectorCandidates) {
      const locator = frame.locator(selector);
      if (await locator.count()) return locator.first();
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

  await expect(page).toHaveTitle(/Adobe ID|Sign in/i);
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

    // Some IMS flows require opting into password-based auth.
    await clickUsePasswordIfPresent(page);

    const passwordField = await getPasswordField(page);
    if (!passwordField) {
      await expect.poll(async () => {
        await clickUsePasswordIfPresent(page);
        const field = await getPasswordField(page);
        return !!field;
      }, { timeout: 60000, intervals: [1_000] }).toBeTruthy();
    }
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
  expect(passwordField, 'Expected a password field on IMS login page').toBeTruthy();
  await passwordField.fill(process.env.IMS_PASS);
  await page.locator(selectors['@password-continue-btn']).click();
  await page.waitForURL(`${props.url}#`);
  await expect(page).toHaveURL(`${props.url}#`);
}

module.exports = { clickSignin, fillOutSignInForm };
