/* eslint-disable no-unused-expressions */
/* global it */
import { expect } from '@esm-bundle/chai';
import { isHexColorDark, initIcons } from '../../../libs/utils/decorate.js';
import { loadTokens } from '../../../libs/utils/utils.js';
import { readFile } from "@web/test-runner-commands";

document.head.innerHTML = await readFile({ path: './mocks/head.html' });
document.body.innerHTML = await readFile({ path: './mocks/body.html' });

it('Verifies a hex color is dark', () => {
  expect(isHexColorDark('#fafafa')).to.be.false;
  expect(isHexColorDark('#323232')).to.be.true;
});

it('Load tokens and has an icon', async () => {
  initIcons(document.body);
  const blocks = document.querySelectorAll('main > div > div[class]');
  const blocksArray = Array.prototype.slice.call(blocks);
  await loadTokens(blocksArray);
  const icons = document.querySelectorAll('.icon');
  expect(icons).to.exist;
});

