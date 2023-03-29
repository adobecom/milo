import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { waitForElement } from '../../helpers/waitfor.js';
import init, { formValidate, formSuccess } from '../../../libs/blocks/marketo/marketo.js';

const innerHTML = await readFile({ path: './mocks/body.html' });

const MARKETO_BASE_URL = '//app-aba.marketo.com';
const MARKETO_FORM_ID = '1761';

describe('marketo', () => {
  it('init marketo form', async () => {
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
    const styleSheet = styleSheets.find((sheet) => sheet.href === `http:${MARKETO_BASE_URL}/js/forms2/css/forms2.css`);
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
    const form = window.MktoForms2.getForm(MARKETO_FORM_ID);

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
    const form = window.MktoForms2.getForm(MARKETO_FORM_ID);

    formValidate(form, true, error, errorMessage);
    expect(error.classList.contains('alert')).to.be.false;
  });

  it('marketo form formSuccess', async () => {
    const redirectUrl = '';

    expect(window.MktoForms2).to.exist;
    const form = window.MktoForms2.getForm(MARKETO_FORM_ID);

    formSuccess(form, redirectUrl);
    expect(window.mktoSubmitted).to.be.true;
  });
});
