import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { waitForElement } from '../../helpers/waitfor.js';
import { stub } from 'sinon';
import init, { formValidate, formSuccess, setPreferences } from '../../../libs/blocks/marketo/marketo.js';

const innerHTML = await readFile({ path: './mocks/body.html' });

describe('marketo', () => {
  let loadScriptStub;

  const forms2Mock = {
    getFormElem: () => ({ get: () => document.querySelector('form') }),
    onValidate: stub(),
    onSuccess: stub(),
    loadForm: stub(),
    whenReady: stub().callsFake((fn) => fn(forms2Mock))
  };

  beforeEach(() => {
    document.body.innerHTML = innerHTML;
    loadScriptStub = stub().returns(new Promise(resolve => {
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
  });

  it('set preferences on the data layer', async () => {
    const formData = {
      'first.key': 'value1',
      'second.key': 'value2'
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
});
