// to run this test:
// npm run nala stage update-attribute-prepend.test.js

import { expect, test } from '@playwright/test';
import { features } from './update-attribute-prepend.spec.js';
import TextBlock from '../../blocks/text/text.page.js';
import MarqueeBlock from '../../blocks/marquee/marquee.page.js';

const miloLibs = process.env.MILO_LIBS || '';

// 0. check updateAttribute functionality
test(`${features[0].name},${features[0].tags}`, async ({ page, baseURL }) => {
  const text = new TextBlock(page);
  const URL = `${baseURL}${features[0].path}${miloLibs}`;
  console.info(`[Test Page]: ${URL}`);
  await page.goto(URL);
  await expect(text.outlineButton).toHaveClass(/blue/);
  await expect(text.outlineButton).toHaveAttribute('href', 'https://www.apple.com/');
  await expect(text.outlineButton).toHaveAttribute('daa-ll', 'new link tracking');
});

// 1. check prepend and append using a non-section element
test(`${features[1].name},${features[1].tags}`, async ({ page, baseURL }) => {
  const marquee = new MarqueeBlock(page);
  const URL = `${baseURL}${features[1].path}${miloLibs}`;
  console.info(`[Test Page]: ${URL}`);
  await page.goto(URL);
  await expect(marquee.headingXL).toHaveText('This is prepending to the headingHeading XL Marquee standard medium leftThis is appending to the heading');
});

// 2. Verify the control
test(`${features[2].name},${features[2].tags}`, async ({ page, baseURL }) => {
  const marquee = new MarqueeBlock(page);
  const text = new TextBlock(page);
  const URL = `${baseURL}${features[2].path}${miloLibs}`;
  console.info(`[Test Page]: ${URL}`);
  await page.goto(URL);
  await expect(text.outlineButton).not.toHaveClass(/blue/);
  await expect(text.outlineButton).not.toHaveAttribute('href', 'https://www.apple.com/');
  await expect(text.outlineButton).not.toHaveAttribute('daa-ll', 'new link tracking');
  await expect(marquee.headingXL).not.toHaveText('This is prepending to the headingHeading XL Marquee standard medium leftThis is appending to the heading');
});
