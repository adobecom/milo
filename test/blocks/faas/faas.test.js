/* eslint-disable no-unused-expressions */
/* global describe beforeEach afterEach it */

import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';

document.body.innerHTML = await readFile({ path: './mocks/body.html' });
const { parseEncodedConfig } = await import('../../../libs/utils/utils.js');
const { loadFaasFiles, initFaas, makeFaasConfig } = await import('../../../libs/blocks/faas/utils.js');

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
  });

  it('FaaS Initiation', async () => {
    await initFaas(parseEncodedConfig(encodedConfig), a);
    const faas = document.querySelector('.faas-form');
    expect(faas).to.exist;
  });

  it('FaaS Title', () => {
    const title = document.querySelector('.faas-title');
    expect(title).to.exist;
  });
});
