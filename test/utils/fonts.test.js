/* eslint-disable no-unused-expressions */
/* global it */
import { expect } from '@esm-bundle/chai';
import { setConfig, loadStyle } from '../../../libs/utils/utils.js';

const cssConfig = {
  codeRoot: `${window.location.origin}/libs`,
  locales: { '': { ietf: 'en-US', tk: 'hah7vzn.css' } },
};

const jsConfig = {
  codeRoot: `${window.location.origin}/libs`,
  locales: { '': { ietf: 'en-US', tk: 'hah7vzn' } },
};

it('Loads CSS fonts', async () => {
  const { locale } = setConfig(cssConfig);
  const { default: loadFonts } = await import('../../../libs/utils/fonts.js');
  const fontResp = await loadFonts(locale, loadStyle);
  expect(fontResp).to.exist;
});

it('Loads JS fonts', async () => {
  const { locale } = setConfig(jsConfig);
  const { default: loadFonts } = await import('../../../libs/utils/fonts.js');
  const fontResp = await loadFonts(locale, loadStyle);
  expect(fontResp.classList.contains('wf-loading')).to.be.true;
});
