import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { waitForElement } from '../../helpers/waitfor.js';
import { setConfig, parseEncodedConfig } from '../../../libs/utils/utils.js';

const config = {
  imsClientId: 'milo',
  codeRoot: '/libs',
  locales: { '': { ietf: 'en-US', tk: 'hah7vzn.css' } },
};
setConfig(config);

document.body.innerHTML = await readFile({ path: './mocks/body.html' });
const { getFaasHostSubDomain, loadFaasFiles, initFaas, makeFaasConfig, defaultState } = await import('../../../libs/blocks/faas/utils.js');

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
    expect(makeFaasConfig()).to.equal(defaultState);
    state[149] = 1;
    state[172] = 'last asset';
    const faasConfig = makeFaasConfig(state);
    expect(faasConfig.id).to.equal('42');
    expect(faasConfig.l).to.equal('en_us');
    expect(faasConfig.d).to.equal('https://business.adobe.com/request-consultation/thankyou.html');
    expect(faasConfig.as).to.equal(true);
    expect(faasConfig.ar).to.equal(false);
    expect(faasConfig.e.afterYiiLoadedCallback).to.exist;
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
    state.complete = true;
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

  it('Test environment', () => {
    expect(getFaasHostSubDomain('prod')).to.equal('');
    expect(getFaasHostSubDomain('stage')).to.equal('dev.');
    expect(getFaasHostSubDomain('dev')).to.equal('dev.');
    expect(getFaasHostSubDomain()).to.equal('qa.');
  });
});
