import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { waitForElement } from '../../helpers/waitfor.js';
import { setConfig } from '../../../libs/utils/utils.js';
import init, { formValidate, formSuccess } from '../../../libs/blocks/marketo/marketo.js';

const innerHTML = await readFile({ path: './mocks/body.html' });
const config = {
  marketoBaseURL: '//engage.adobe.com',
  marketoFormID: '1723',
  marketoMunchkinID: '360-KCI-804',
};

describe('marketo', () => {
  it('hide form if no base url', async () => {
    setConfig({});
    document.body.innerHTML = innerHTML;
    const el = document.querySelector('.marketo');
    init(el);

    expect(el.style.display).to.equal('none');
  });

  describe('with correct config', () => {
    before(() => {
      setConfig(config);
      document.body.innerHTML = innerHTML;
      const el = document.querySelector('.marketo');
      init(el);
    });

    it('init marketo form', async () => {
      const wrapper = await waitForElement('.marketo-form-wrapper');
      expect(wrapper).to.exist;

      const title = document.querySelector('.marketo-title');
      expect(title).to.exist;
    });

    it('marketo hidden fields', async function () {
      this.timeout(3000);
      const hiddenInput = await waitForElement('.marketo form input[name="hiddenField"]');
      expect(hiddenInput).to.exist;
    });

    it('validate marketo fields error', async () => {
      expect(window.MktoForms2).to.exist;
      const form = window.MktoForms2.getForm(config.marketoFormID);
      const formEl = await waitForElement(`#mktoForm_${config.marketoFormID}`);

      formValidate(form);

      expect(formEl.classList.contains('show-warnings')).to.be.true;
    });

    it('marketo field error visible', async () => {
      const button = await waitForElement('.marketo button');
      button.click();

      const firstField = document.querySelector('.mktoField');
      const bounding = firstField.getBoundingClientRect();

      expect(bounding.top >= 0 && bounding.bottom <= window.innerHeight).to.be.true;
    });

    it('marketo form formSuccess', async () => {
      const redirectUrl = '';

      expect(window.MktoForms2).to.exist;
      const form = window.MktoForms2.getForm(config.marketoFormID);

      formSuccess(form, redirectUrl);
      expect(window.mktoSubmitted).to.be.true;
    });
  });
});
