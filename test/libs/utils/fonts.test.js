/* eslint-disable no-unused-expressions */
/* global it */
import { expect } from '@esm-bundle/chai';
import { setConfig } from '../../../libs/utils/utils.js';

const cssConfig = {
  projectRoot: `${window.location.origin}/libs`,
  locales: { '': { ietf: 'en-US', tk: 'hah7vzn.css' } },
};

const jsConfig = {
  projectRoot: `${window.location.origin}/libs`,
  locales: { '': { ietf: 'en-US', tk: 'hah7vzn' } },
};

it('Loads CSS fonts', async () => {
  setConfig(cssConfig);
  const { default: loadFonts } = await import('../../../libs/utils/fonts.js');
  const fontResp = await loadFonts();
  expect(fontResp).to.exist;
});

it('Loads CSS fonts', async () => {
  setConfig(jsConfig);
  const { default: loadFonts } = await import('../../../libs/utils/fonts.js');
  const fontResp = await loadFonts();
  expect(fontResp.classList.contains('wf-loading')).to.be.true;
});
