import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { stub } from 'sinon';
import { waitForElement } from '../../helpers/waitfor.js';
import init, { formValidate, formSuccess, setPreferences, decorateURL } from '../../../libs/blocks/marketo/marketo.js';

const innerHTML = await readFile({ path: './mocks/body.html' });

describe('marketo', () => {
  let loadScriptStub;

  const forms2Mock = {
    getFormElem: () => ({ get: () => document.querySelector('form') }),
    onValidate: stub(),
    onSuccess: stub(),
    loadForm: stub(),
    whenReady: stub().callsFake((fn) => fn(forms2Mock)),
  };

  beforeEach(() => {
    document.body.innerHTML = innerHTML;
    loadScriptStub = stub().returns(new Promise((resolve) => {
      window.MktoForms2 = forms2Mock;
      resolve();
    }));
  });

  afterEach(() => {
    loadScriptStub.reset();
    window.MktoForms2 = undefined;
    window.mcz_marketoForm_pref = undefined;
  });

  it('hides form if no data url', async () => {
    document.body.innerHTML = innerHTML;
    const el = document.querySelector('.marketo');
    el.querySelector('a').remove();

    init(el);

    expect(el.style.display).to.equal('none');
  });

  it('initializes form with correct data', async () => {
    const marketoElement = document.querySelector('.marketo');

    init(marketoElement, loadScriptStub);

    expect(loadScriptStub.calledOnce).to.be.true;
    expect(loadScriptStub.calledWith('https://engage.adobe.com/js/forms2/js/forms2.min.js')).to.be.true;

    const wrapper = await waitForElement('.marketo-form-wrapper');
    expect(wrapper).to.exist;

    const title = document.querySelector('.marketo-title');
    expect(title).to.exist;

    expect(window.mcz_marketoForm_pref).to.exist;
    expect(window.MktoForms2).to.exist;

    expect(window.mcz_marketoForm_pref).to.have.property('program');
    expect(window.mcz_marketoForm_pref.program).to.have.property('campaignids');
    expect(window.mcz_marketoForm_pref.program.campaignids).to.have.property('sfdc');
  });

  it('sets preferences on the data layer', async () => {
    const formData = {
      'first.key': 'value1',
      'second.key': 'value2',
    };

    setPreferences(formData);

    expect(window.mcz_marketoForm_pref).to.have.property('first');
    expect(window.mcz_marketoForm_pref.first).to.have.property('key');
    expect(window.mcz_marketoForm_pref.first.key).to.equal('value1');
    expect(window.mcz_marketoForm_pref).to.have.property('second');
    expect(window.mcz_marketoForm_pref.second).to.have.property('key');
    expect(window.mcz_marketoForm_pref.second.key).to.equal('value2');
  });

  it('formValidate adds class', async () => {
    const marketoElement = document.querySelector('.marketo');
    init(marketoElement, loadScriptStub);

    expect(window.MktoForms2).to.exist;

    formValidate(window.MktoForms2);
    const formElem = window.MktoForms2.getFormElem().get(0);
    expect(formElem.classList.contains('show-warnings')).to.be.true;
  });

  it('submits successfully', async () => {
    const marketoElement = document.querySelector('.marketo');
    init(marketoElement, loadScriptStub);

    expect(window.MktoForms2).to.exist;

    formSuccess(window.MktoForms2);
    expect(window.mktoSubmitted).to.be.true;
  });

  it('decorate destination urls', () => {
    let baseURL = new URL('http://localhost:6456/marketo-block');
    let result = decorateURL('https://main--milo--adobecom.hlx.page/marketo-block/thank-you', baseURL);
    expect(result.href).to.equal('http://localhost:6456/marketo-block/thank-you');

    baseURL = new URL('https://main--milo--adobecom.hlx.page/marketo-block');
    result = decorateURL('/marketo-block/thank-you', baseURL);
    expect(result.href).to.equal('https://main--milo--adobecom.hlx.page/marketo-block/thank-you');

    baseURL = new URL('https://main--milo--adobecom.hlx.page/marketo-block');
    result = decorateURL('https://main--milo--adobecom.hlx.page/marketo-block/thank-you', baseURL);
    expect(result.href).to.equal('https://main--milo--adobecom.hlx.page/marketo-block/thank-you');

    baseURL = new URL('https://business.adobe.com/marketo-block.html');
    result = decorateURL('https://main--milo--adobecom.hlx.page/marketo-block/thank-you', baseURL);
    expect(result.href).to.equal('https://business.adobe.com/marketo-block/thank-you.html');

    baseURL = new URL('https://business.adobe.com/marketo-block.html');
    result = decorateURL('https://business.adobe.com/marketo-block/thank-you.html', baseURL);
    expect(result.href).to.equal('https://business.adobe.com/marketo-block/thank-you.html');
  });
});
