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
    await initFaas(state, a);
    const faas = await waitForElement('.faas-form-wrapper');
    expect(faas).to.exist;
    const formWrapperEl = document.querySelector('.block.faas');
    expect(formWrapperEl.classList.contains('white')).to.equal(true);
    expect(formWrapperEl.classList.contains('column1')).to.equal(true);
    expect(formWrapperEl.classList.contains('gated')).to.equal(false);
  });

  it('FaaS Complete', async () => {
    let newState = '{"l":"en_us","d":"/resources/guides/data-retails-most-important-inventory/thank-you.html","ar":true,"test":false,"q":{},"pc":{"1":"js","2":"faas_submission","3":"sfdc","4":"demandbase","5":"clearbit"},"p":{"js":{"32":"unknown","36":"7015Y000003A7oBQAS","39":"","77":1,"78":1,"79":1,"90":"FAAS","92":2846,"93":"2847","94":3279,"173":"https://main--bacom--adobecom.hlx.page/resources/guides/data-retails-most-important-inventory"},"faas_submission":{},"sfdc":{"contactId":null},"demandbase":{}},"as":"true","o":{},"e":{},"cookie":{"p":{"js":{}}},"url":{"p":{"js":{"36":"70130000000kYe0AAE"}}},"js":{"l":"en_us","d":"/resources/guides/data-retails-most-important-inventory/thank-you.html","ar":true,"test":false,"q":{},"pc":{"1":"js","2":"faas_submission","3":"sfdc","4":"demandbase","5":"clearbit"},"p":{"js":{"36":"7015Y000003A7oBQAS","39":"","77":1,"78":1,"79":1,"90":"FAAS","92":2846,"93":"2847","94":3279}},"as":"true","o":{},"e":{},"cookie":{"p":{"js":{}}},"url":{"p":{"js":{"36":"70130000000kYe0AAE"}}},"onetrust_advertising_acceptance":"no","onetrust_performance_acceptance":"no","onetrust_functionality_acceptance":"no","clearbitStep":1,"formTag":"faas-Offer","id":"79","_fc":1,"complete":false,"title":"Please share some contact information to download the guide.","style_layout":"column2","cleabitStyle":"Cleabit Style","title_size":"p","title_align":"left"},"onetrust_advertising_acceptance":"no","onetrust_performance_acceptance":"no","onetrust_functionality_acceptance":"no","clearbitStep":1,"formTag":"faas-Offer","id":"79","_fc":1,"complete":false,"title":"Please share some contact information to download the guide.","style_layout":"column2","cleabitStyle":"Cleabit Style","title_size":"p","title_align":"left"}';
    newState = JSON.parse(newState);
    newState.complete = true;
    const wrapper = document.createElement('div');
    const newA = document.createElement('a');
    wrapper.append(newA);
    await initFaas(newState, newA);
    console.log(newA);
  });

  it('FaaS Title', () => {
    const title = document.querySelector('.faas-title');
    expect(title).to.exist;
  });

  it('Test environment', () => {
    expect(getFaasHostSubDomain('prod')).to.equal('');
    expect(getFaasHostSubDomain('stage')).to.equal('staging.');
    expect(getFaasHostSubDomain('dev')).to.equal('dev.');
    expect(getFaasHostSubDomain('qa')).to.equal('qa.');
    expect(getFaasHostSubDomain()).to.equal('qa.');
  });

  it('localizes the destination url', () => {
    expect(makeFaasConfig()).to.equal(defaultState);
    const arConfig = config;
    arConfig.locales.ae_ar = { ietf: 'ar', tk: 'nwq1mna.css', dir: 'rtl' };
    arConfig.pathname = '/ae_ar/';
    arConfig.prodDomains = ['business.adobe.com'];
    setConfig(arConfig);
    const faasConfig = makeFaasConfig(state);
    expect(faasConfig.d).to.equal('https://business.adobe.com/ae_ar/request-consultation/thankyou.html');
    setConfig(config);
  });
});
