import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { waitForElement } from '../../helpers/waitfor.js';
import { setConfig } from '../../../libs/utils/utils.js';
import init, { formValidate, formSuccess } from '../../../libs/blocks/marketo/marketo.js';

const innerHTML = await readFile({ path: './mocks/body.html' });
const config = {
  marketoBaseURL: '//app-aba.marketo.com',
  marketoFormID: '1761',
  marketoMunchkinID: '345-TTI-184',
};

describe('marketo', () => {
  it('hide form if no base url', async () => {
    setConfig({});
    document.body.innerHTML = innerHTML;
    const el = document.querySelector('.marketo');
    init(el);

    expect(el.style.display).to.equal('none');
  });

  it('init marketo form', async () => {
    setConfig(config);
    document.body.innerHTML = innerHTML;
    const el = document.querySelector('.marketo');
    init(el);

    const wrapper = await waitForElement('.marketo-form-wrapper');
    expect(wrapper).to.exist;

    const title = el.querySelector('.marketo-title');
    expect(title).to.exist;
  });

  it('load marketo disables stylesheets', async () => {
    const formRow = await waitForElement('.mktoFormRow');
    expect(formRow).to.exist;

    const styleSheets = [...document.styleSheets];
    const styleSheet = styleSheets.find((sheet) => sheet.href === `http:${config.marketoBaseURL}/js/forms2/css/forms2.css`);
    expect(styleSheet.disabled).to.be.true;
  });

  it('marketo hidden fields', async () => {
    const hiddenInput = await waitForElement('input[name="hiddenField"]');
    expect(hiddenInput).to.exist;
  });

  it('validate marketo fields error', async () => {
    const error = await waitForElement('.marketo-error');
    const errorMessage = 'There are some fields that require your attention';

    expect(error).to.exist;

    expect(window.MktoForms2).to.exist;
    const form = window.MktoForms2.getForm(config.marketoFormID);

    formValidate(form, false, error, errorMessage);
    expect(error.classList.contains('alert')).to.be.true;
  });

  it('marketo field error visible', async () => {
    const button = await waitForElement('.marketo button');
    button.click();

    const firstField = document.querySelector('.mktoField');
    const bounding = firstField.getBoundingClientRect();

    expect(bounding.top >= 0 && bounding.bottom <= window.innerHeight).to.be.true;
  });

  it('validate marketo fields success', async () => {
    const error = await waitForElement('.marketo-error');
    const errorMessage = 'There are some fields that require your attention';

    expect(error).to.exist;

    expect(window.MktoForms2).to.exist;
    const form = window.MktoForms2.getForm(config.marketoFormID);

    formValidate(form, true, error, errorMessage);
    expect(error.classList.contains('alert')).to.be.false;
  });

  it('marketo form formSuccess', async () => {
    const redirectUrl = '';

    expect(window.MktoForms2).to.exist;
    const form = window.MktoForms2.getForm(config.marketoFormID);

    formSuccess(form, redirectUrl);
    expect(window.mktoSubmitted).to.be.true;
  });
});
