/* eslint-disable no-unused-expressions */
/* global describe beforeEach afterEach it */

import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { waitForElement } from '../../../helpers/selectors.js';

document.body.innerHTML = await readFile({ path: './mocks/body.html' });
const { parseEncodedConfig } = await import('../../../../libs/utils/utils.js');
const { loadFaasFiles, initFaas, makeFaasConfig, defaultState } = await import('../../../../libs/blocks/faas/utils.js');

describe('Faas', () => {
  beforeEach(() => {
    sinon.spy(console, 'log');
  });

  afterEach(() => {
    console.log.restore();
  });

  const a = document.querySelector('a');
  const encodedConfig = a.href.split('#')[1];
  const state = parseEncodedConfig(encodedConfig);

  it('Parse Enconded Config', () => {
    expect(typeof state).to.equal('object');
  });

  it('Load FaaS Files', async () => {
    await loadFaasFiles();
    expect(typeof $).to.equal('function');
  });

  it('Make FaaS config', () => {
    const config = makeFaasConfig(state);
    expect(config.e.afterYiiLoadedCallback).to.exist;
    expect(config.e.afterSubmitCallback).to.exist;
    expect(makeFaasConfig()).to.equal(defaultState);
  });

  it('FaaS Initiation Error Case test', async () => {
    await initFaas('', '');
    const faas = document.querySelector('.faas-form');
    expect(faas).to.be.null;
  });

  it('FaaS Initiation', async () => {
    state.style_backgroundTheme = '';
    state.style_layout = '';
    state.isGate = false;
    await initFaas(state, a);
    const faas = await waitForElement('.faas-form-wrapper');
    expect(faas).to.exist;
    const formWrapperEl = document.querySelector('.block.faas');
    expect(formWrapperEl.classList.contains('white')).to.equal(true);
    expect(formWrapperEl.classList.contains('column1')).to.equal(true);
    expect(formWrapperEl.classList.contains('gated')).to.equal(false);
  });

  it('FaaS Title', () => {
    const title = document.querySelector('.faas-title');
    expect(title).to.exist;
  });
});
