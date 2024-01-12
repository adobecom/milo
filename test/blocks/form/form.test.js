import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { waitForElement } from '../../helpers/waitfor.js';

document.body.innerHTML = await (readFile({ path: './mocks/body.html' }));
const { default: init } = await import('../../../libs/blocks/form/form.js');
let formData = await (readFile({ path: './mocks/form-data.json' }));
formData = JSON.parse(formData);

describe('Form Block', async () => {
  const div = document.querySelector('.form');
  await init(div, formData);

  it('initializes successfully', async () => {
    const form = await waitForElement('form');
    expect(form).to.exist;
  });

  it('prevents submission without required', async () => {
    const form = await waitForElement('form');
    const submit = form.querySelector('.form-submit-wrapper button');
    submit.dispatchEvent(new Event('click'));
    const thanks = form.querySelector('.thank-you');
    expect(thanks).to.be.null;
  });

  describe('conditional field rules', async () => {
    const form = await waitForElement('form');
    const numField = form.querySelector('#favoriteNumber');
    numField.value = 10;
    form.dispatchEvent(new Event('input'));

    it('applies an "is equal" rule', () => {
      const fieldWrapper = form.querySelector('[data-field-id="hiddenFieldEq"');
      expect(fieldWrapper.classList.contains('hidden')).to.be.true;
    });

    it('applies an "is not equal" rule', () => {
      const fieldWrapper = form.querySelector('[data-field-id="hiddenFieldNe"');
      expect(fieldWrapper.classList.contains('hidden')).to.be.false;
    });

    it('applies an "is greater than" rule', () => {
      const fieldWrapper = form.querySelector('[data-field-id="hiddenFieldGt"');
      expect(fieldWrapper.classList.contains('hidden')).to.be.false;
    });

    it('applies an "is greater than or equal to" rule', () => {
      const fieldWrapper = form.querySelector('[data-field-id="hiddenFieldGe"');
      expect(fieldWrapper.classList.contains('hidden')).to.be.true;
    });

    it('applies an "is less than" rule', () => {
      const fieldWrapper = form.querySelector('[data-field-id="hiddenFieldLt"');
      expect(fieldWrapper.classList.contains('hidden')).to.be.false;
    });

    it('applies an "is less than or equal to" rule', () => {
      const fieldWrapper = form.querySelector('[data-field-id="hiddenFieldLe"');
      expect(fieldWrapper.classList.contains('hidden')).to.be.true;
    });
  });

  it('prevents submission when required checkboxes are not checked', async () => {
    const form = await waitForElement('form');
    const submit = form.querySelector('.form-submit-wrapper button');
    const reqFields = form.querySelectorAll('[required="required"]');
    [...reqFields].forEach((field) => {
      let val = '';
      switch (field.type) {
        case 'number':
          val = 10;
          break;
        case 'email':
          val = 'test@test.com';
          break;
        case 'date':
          val = '1991-10-13';
          break;
        case 'select-one':
          val = field.lastChild.value;
          break;
        default:
          val = 'test';
      }
      field.value = val;
    });
    submit.dispatchEvent(new Event('click'));
    const thanks = form.querySelector('.thank-you');
    expect(thanks).to.be.null;
  });

  it('submits successfully', async () => {
    const form = await waitForElement('form');
    const reqCheck = form.querySelector('.group-container.required input');
    const submit = form.querySelector('.form-submit-wrapper button');
    reqCheck.checked = true;
    reqCheck.closest('.field-wrapper').dispatchEvent(new Event('input'));
    submit.dispatchEvent(new Event('click'));
    const thanks = document.querySelector('.thank-you');
    expect(thanks).to.exist;
  });

  it('clears successfully', async () => {
    const form = await waitForElement('form');
    const clear = form.querySelector('.form-clear-wrapper button');
    clear.dispatchEvent(new Event('click'));
    const textarea = form.querySelector('textarea');
    expect(textarea.value).to.be.empty;
  });
});
