/* eslint-disable import/no-import-module-exports, import/no-extraneous-dependencies, max-len, no-console */
import { expect } from '@playwright/test';
import selectors from '../features/imslogin/imslogin.page.js';

async function clickSignin(page) {
  const signinBtn = page.locator(selectors['@gnav-signin']);
  await expect(signinBtn).toBeVisible();
  await signinBtn.click();
}

async function fillOutSignInForm(props, page) {
  expect(process.env.IMS_EMAIL, 'ERROR: No environment variable for email provided for IMS Test.').toBeTruthy();
  expect(process.env.IMS_PASS, 'ERROR: No environment variable for password provided for IMS Test.').toBeTruthy();

  await expect(page).toHaveTitle(/Adobe ID/);
  let heading = await page.locator(selectors['@page-heading']).first().innerText();
  expect(heading).toBe('Sign in');

  // Fill out Sign-in Form
  await expect(async () => {
    await page.locator(selectors['@email']).fill(process.env.IMS_EMAIL);
    await page.locator(selectors['@email-continue-btn']).click();
    await expect(page.locator(selectors['@password-reset'])).toBeVisible({ timeout: 45000 }); // Timeout accounting for how long IMS Login page takes to switch form
  }).toPass({
    intervals: [1_000],
    timeout: 10_000,
  });

  heading = await page.locator(selectors['@page-heading'], { hasText: 'Enter your password' }).first().innerText();
  expect(heading).toBe('Enter your password');
  await page.locator(selectors['@password']).fill(process.env.IMS_PASS);
  await page.locator(selectors['@password-continue-btn']).click();
  await page.waitForURL(`${props.url}#`);
  await expect(page).toHaveURL(`${props.url}#`);
}

module.exports = { clickSignin, fillOutSignInForm };
