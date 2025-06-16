import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon, { stub } from 'sinon';
import init, { formValidate, updateTabIndex } from '../../../libs/blocks/marketo/marketo-multi.js';

const innerHTML = await readFile({ path: './mocks/multi-step-2.html' });

describe('marketo multi-step', () => {
  let clock;

  beforeEach(() => {
    document.body.innerHTML = innerHTML;
    clock = sinon.useFakeTimers();
    window.MktoForms2 = { whenReady: stub().callsFake((callback) => callback({ onValidate: () => {}, getFormElem: () => ({ get: () => document.querySelector('form') }) })) };

    const el = document.querySelector('.marketo');
    init(el);
    clock.tick(300);
  });

  afterEach(() => {
    window.MktoForms2 = undefined;
    clock.restore();
  });

  it('initializes multi-step form', () => {
    const el = document.querySelector('.marketo');
    const stepDetails = el.querySelector('.step-details .step');

    expect(stepDetails).to.exist;
    expect(stepDetails.textContent).to.equal('Step 1 of 2');
    expect(window.MktoForms2.whenReady.calledOnce).to.be.true;

    const step1 = el.querySelector('.mktoFormRowTop[data-validate="1"]');
    const step2 = el.querySelector('.mktoFormRowTop[data-validate="2"]');
    expect(step1).to.exist;
    expect(step2).to.exist;
  });

  it('shows next step on valid form step', () => {
    const formEl = document.querySelector('form');

    formValidate(formEl);
    clock.tick(200);

    expect(formEl.dataset.step).to.equal('2');
    expect(formEl.querySelector('#mktoButton_new').textContent).to.equal('Submit');
    expect(formEl.querySelector('.back-btn')).to.exist;
  });

  it('does not show next step on invalid form submission', () => {
    const formEl = document.querySelector('form');
    formEl.querySelector('.mktoFormRowTop[data-validate="1"] input').classList.add('mktoInvalid');

    const result = formValidate(formEl);
    clock.tick(200);

    expect(result).to.be.false;
    expect(formEl.dataset.step).to.equal('1');
  });

  it('shows previous step on back button click', () => {
    const formEl = document.querySelector('form');

    formValidate(formEl);
    clock.tick(200);

    expect(formEl.dataset.step).to.equal('2');
    const backBtn = formEl.querySelector('.back-btn');

    backBtn.click();
    clock.tick(200);

    expect(formEl.dataset.step).to.equal('1');
    expect(formEl.querySelector('.back-btn')).to.be.null;
    expect(formEl.querySelector('.step-details .step').textContent).to.equal('Step 1 of 2');
  });

  it('sets initial tabindex for fields', () => {
    const formEl = document.querySelector('form');
    const step1Field = formEl.querySelector('.mktoFormRowTop[data-validate="1"] input');
    const step2Field = formEl.querySelector('.mktoFormRowTop[data-validate="2"] input');
    expect(step1Field.tabIndex).to.equal(0);
    expect(step2Field.tabIndex).to.equal(-1);
  });

  it('updates tabindex when switching steps', () => {
    const formEl = document.querySelector('form');
    const step1Field = formEl.querySelector('.mktoFormRowTop[data-validate="1"] input');
    const step2Field = formEl.querySelector('.mktoFormRowTop[data-validate="2"] input');

    // Initial state
    expect(step1Field.tabIndex).to.equal(0);
    expect(step2Field.tabIndex).to.equal(-1);

    // Switch to step 2
    updateTabIndex(formEl, 2, 1);
    expect(step1Field.tabIndex).to.equal(-1);
    expect(step2Field.tabIndex).to.equal(0);

    // Switch back to step 1
    updateTabIndex(formEl, 1, 2);
    expect(step1Field.tabIndex).to.equal(0);
    expect(step2Field.tabIndex).to.equal(-1);
  });
});
