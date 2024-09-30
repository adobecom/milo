/* eslint-disable max-len */
/* eslint-disable func-names */
/* eslint-disable compat/compat */
import sinon from 'sinon';
import { readFile, sendKeys } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
// import userEvent from '@testing-library/user-event';
import { delay, waitForElement } from '../../helpers/waitfor.js';
import {
  organizationsStore,
  registriesStore,
  SCENARIOS,
  stepperStore,
} from '../../../libs/blocks/nonprofit/nonprofit.js';
import { mockedOrganizations, mockedRegistries } from './mocks/data.js';

const { default: init } = await import('../../../libs/blocks/nonprofit/nonprofit.js');

const body = await readFile({ path: './mocks/body.html' });

describe('nonprofit - General', () => {
  before(() => {
    window.mph = {
      'nonprofit-title-select-non-profit': "What's your nonprofit organization?",
      'nonprofit-title-organization-details': 'Verify your organization details',
      'nonprofit-title-organization-address': "What's the physical address of your organization?",
      'nonprofit-title-personal-details': 'Confirm your details?',
      'nonprofit-subtitle-personal-details':
        'We need to confirm your name and email in order to finish checking if your organisation is eligible.',
      'nonprofit-title-application-review': 'Your application is being reviewed',
    };
  });

  beforeEach(() => {
    document.body.innerHTML = body;
    const np = document.querySelector('.nonprofit');
    init(np);
  });

  afterEach(() => {
    stepperStore.update((prev) => ({ ...prev, step: 1, scenario: SCENARIOS.FOUND_IN_SEARCH }));
  });

  function validateStepTitle(value) {
    const title = document.querySelector('.np-title');
    expect(title.textContent).to.equal(value);
  }

  it('should display nonprofit', async () => {
    const container = await waitForElement('.np-container');
    const form = container.querySelector('.np-form');
    const countryInput = form.querySelector('input[name="country"]');
    const organizationInput = form.querySelector('input[name="organizationId"]');
    expect(container).to.exist;
    expect(countryInput).to.exist;
    expect(organizationInput).to.exist;
  });

  it('should enable organizations select on country selection', async () => {
    const countrySearch = document.querySelector('input[data-for="country"]');
    const organizationSearch = document.querySelector('input[data-for="organizationId"]');

    expect(organizationSearch.getAttribute('disabled')).to.equal('disabled');

    countrySearch.focus();
    await sendKeys({ press: 'ArrowDown' });
    await sendKeys({ press: 'Enter' });

    expect(organizationSearch.hasAttribute('disabled')).to.be.false;
  });

  it('should change step on stepperStore update', async () => {
    validateStepTitle("What's your nonprofit organization?");

    stepperStore.update({ step: 2, scenario: SCENARIOS.FOUND_IN_SEARCH });
    validateStepTitle('Confirm your details?');

    stepperStore.update({ step: 3, scenario: SCENARIOS.FOUND_IN_SEARCH });
    validateStepTitle('Your application is being reviewed');

    stepperStore.update({ step: 1, scenario: SCENARIOS.NOT_FOUND_IN_SEARCH });
    validateStepTitle("What's your nonprofit organization?");

    stepperStore.update({ step: 2, scenario: SCENARIOS.NOT_FOUND_IN_SEARCH });
    validateStepTitle('Verify your organization details');

    stepperStore.update({ step: 3, scenario: SCENARIOS.NOT_FOUND_IN_SEARCH });
    validateStepTitle("What's the physical address of your organization?");

    stepperStore.update({ step: 4, scenario: SCENARIOS.NOT_FOUND_IN_SEARCH });
    validateStepTitle('Confirm your details?');

    stepperStore.update({ step: 5, scenario: SCENARIOS.NOT_FOUND_IN_SEARCH });
    validateStepTitle('Your application is being reviewed');
  });

  it('should go to previous step on back button click', async () => {
    stepperStore.update({ step: 2, scenario: SCENARIOS.FOUND_IN_SEARCH });
    validateStepTitle('Confirm your details?');

    const backButton = document.querySelector('.np-stepper-back');

    expect(backButton.style.display).to.equal('flex');

    backButton.click();

    expect(stepperStore.data.step).to.equal(1);
  });

  it('should go to previous step on back button Enter keypress', async () => {
    stepperStore.update({ step: 2, scenario: SCENARIOS.FOUND_IN_SEARCH });
    validateStepTitle('Confirm your details?');

    const backButton = document.querySelector('.np-stepper-back');

    expect(backButton.style.display).to.equal('flex');

    backButton.focus();
    await sendKeys({ press: 'Enter' });

    expect(stepperStore.data.step).to.equal(1);
  });
});

describe('nonprofit - Organization search', () => {
  const mockedFetchReturnData = {
    default: { data: mockedOrganizations, _links: { next: '' } },
    'should search next organizations': {
      data: mockedOrganizations,
      _links: { next: 'a.test?link=' },
    },
    'should navigate to alternate flow': {
      data: [],
      _links: { next: '' },
    },
  };

  before(() => {
    window.mph = {};
    window.lana = { log: () => {} };
  });

  beforeEach(async function () {
    document.body.innerHTML = body;
    const np = document.querySelector('.nonprofit');
    init(np);

    const data = mockedFetchReturnData[this.currentTest.title] || mockedFetchReturnData.default;

    sinon.stub(window, 'fetch');
    window.fetch.returns(
      Promise.resolve({
        json: () => Promise.resolve(data),
        ok: !data.error,
      }),
    );

    const countrySearch = document.querySelector('input[data-for="country"]');
    const organizationSearch = document.querySelector('input[data-for="organizationId"]');

    countrySearch.focus();
    await sendKeys({ press: 'ArrowDown' });
    await sendKeys({ press: 'Enter' });

    expect(document.activeElement).to.equal(organizationSearch);
  });

  afterEach(() => {
    if (window.fetch.restore) window.fetch.restore();
    if (window.lana.log.restore) window.lana.log.restore();
    organizationsStore.update([]);
    stepperStore.update((prev) => ({ ...prev, step: 1, scenario: SCENARIOS.FOUND_IN_SEARCH }));
  });

  it('should search organizations', async () => {
    const selectedOrganizationContainer = document.querySelector(
      '.np-selected-organization-container',
    );

    expect(selectedOrganizationContainer.style.display).to.equal('');

    await sendKeys({ press: 'a' });

    await waitForElement('.np-select-list[data-for="organizationId"] .np-select-item');

    await sendKeys({ press: 'ArrowDown' });
    await sendKeys({ press: 'Enter' });

    expect(selectedOrganizationContainer.style.display).to.equal('flex');
  });

  it('should search next organizations', async () => {
    const organizationSearch = document.querySelector('input[data-for="organizationId"]');
    expect(document.activeElement).to.equal(organizationSearch);

    await sendKeys({ press: 'a' });

    await waitForElement('.np-select-list[data-for="organizationId"] .np-select-item');
    const organizationsList = document.querySelector('.np-select-list[data-for="organizationId"]');
    organizationsList.dispatchEvent(new Event('scroll'));

    expect(window.fetch.getCall(1).args[0]).to.equal('a.test?link=');
  });

  it('should navigate options with arrows', async () => {
    await sendKeys({ press: 'a' });

    const firstOption = await waitForElement(
      '.np-select-list[data-for="organizationId"] .np-select-item',
    );
    const lastOption = document.querySelector(
      '.np-select-list[data-for="organizationId"] .np-select-item:last-child',
    );

    await sendKeys({ press: 'ArrowDown' });
    await sendKeys({ press: 'ArrowDown' });
    await sendKeys({ press: 'ArrowDown' });
    await sendKeys({ press: 'ArrowDown' });

    expect(document.activeElement).to.equal(lastOption);

    await sendKeys({ press: 'ArrowUp' });
    await sendKeys({ press: 'ArrowUp' });
    await sendKeys({ press: 'ArrowUp' });

    expect(document.activeElement).to.equal(firstOption);
  });

  it('should focus the organization search from new keypresses (except arrows and Enter) on select options', async () => {
    await sendKeys({ press: 'a' });

    const firstOption = await waitForElement(
      '.np-select-list[data-for="organizationId"] .np-select-item',
    );

    await sendKeys({ press: 'ArrowDown' });
    await sendKeys({ press: 'ArrowDown' });
    await sendKeys({ press: 'ArrowUp' });

    expect(document.activeElement).to.equal(firstOption);

    await sendKeys({ press: 'a' });

    const organizationSearch = document.querySelector('input[data-for="organizationId"]');

    expect(document.activeElement).to.equal(organizationSearch);
    expect(organizationSearch.value).to.equal('aa');
  });

  it('should reset select search value on blur without selection', async () => {
    await sendKeys({ press: 'a' });

    const organizationSearch = document.querySelector(
      '.np-select-search[data-for="organizationId"]',
    );

    expect(organizationSearch.value).to.equal('a');

    await waitForElement('.np-select-list[data-for="organizationId"] .np-select-no-options');
    organizationSearch.blur();

    expect(organizationSearch.value).to.equal('');
  });

  it('should navigate to personal data', async () => {
    const selectedOrganizationContainer = document.querySelector(
      '.np-selected-organization-container',
    );

    expect(selectedOrganizationContainer.style.display).to.equal('');

    await sendKeys({ press: 'a' });

    await waitForElement('.np-select-list[data-for="organizationId"] .np-select-item');

    await sendKeys({ press: 'ArrowDown' });
    await sendKeys({ press: 'Enter' });

    expect(selectedOrganizationContainer.style.display).to.equal('flex');

    const form = document.querySelector('.np-form');
    form.dispatchEvent(new Event('submit'));

    expect(stepperStore.data.step).to.equal(2);
    expect(stepperStore.data.scenario).to.equal(SCENARIOS.FOUND_IN_SEARCH);
  });

  it('should navigate to alternate flow', async () => {
    await sendKeys({ press: 'a' });

    await waitForElement('.np-select-list[data-for="organizationId"] .np-select-no-options');

    await sendKeys({ press: 'Tab' });

    const cannotFind = document.querySelector('.np-organization-cannot-find a');
    expect(document.activeElement).to.equal(cannotFind);

    await sendKeys({ press: 'Enter' });

    expect(stepperStore.data.step).to.equal(2);
    expect(stepperStore.data.scenario).to.equal(SCENARIOS.NOT_FOUND_IN_SEARCH);
  });
});

describe('nonprofit - Organization details', () => {
  const mockedFetchReturnData = {
    default: { data: mockedRegistries },
    'should search organizations': { data: mockedRegistries },
  };

  before(() => {
    window.mph = {};
  });

  beforeEach(async function () {
    document.body.innerHTML = body;
    const np = document.querySelector('.nonprofit');
    init(np);

    const data = mockedFetchReturnData[this.currentTest.title] || mockedFetchReturnData.default;

    sinon.stub(window, 'fetch');
    window.fetch.returns(
      Promise.resolve({
        json: () => Promise.resolve(data),
        ok: true,
      }),
    );

    stepperStore.update({ step: 2, scenario: SCENARIOS.NOT_FOUND_IN_SEARCH });
  });

  afterEach(() => {
    if (window.fetch.restore) window.fetch.restore();
    registriesStore.update([]);
  });

  it('should fetch registries on country select', async () => {
    const countrySearch = document.querySelector('.np-select-search[data-for="country"]');

    countrySearch.focus();
    await sendKeys({ press: 'ArrowDown' });
    await sendKeys({ press: 'Enter' });

    await waitForElement('.np-select-list[data-for="registry"] .np-select-item');

    expect(window.fetch.getCall(0)).to.not.be.null;
  });

  it('should not navigate without completed fields', async () => {
    const submit = document.querySelector('input[type="submit"]');
    expect(submit).to.exist;
    submit.click();

    expect(stepperStore.data.step).to.equal(2);
  });

  // userEvent crashes on import - this test is skipped
  it.skip('should navigate to address details on submit', async () => {
    const countrySearch = document.querySelector('.np-select-search[data-for="country"]');

    countrySearch.focus();
    await sendKeys({ press: 'ArrowDown' });
    await sendKeys({ press: 'Enter' });

    await waitForElement('.np-select-list[data-for="registry"] .np-select-item');

    const registrySearch = document.querySelector('.np-select-search[data-for="registry"]');

    registrySearch.focus();
    await sendKeys({ press: 'ArrowDown' });
    await sendKeys({ press: 'Enter' });

    const organizationName = document.querySelector('.np-input[name="organizationName"]');
    organizationName.value = 'A Test Name';
    organizationName.dispatchEvent(new Event('input'));

    const organizationRegistrationId = document.querySelector(
      '.np-input[name="organizationRegistrationId"]',
    );
    organizationRegistrationId.value = 'atestid';
    organizationRegistrationId.dispatchEvent(new Event('input'));

    const website = document.querySelector('.np-input[name="website"]');
    website.value = 'www.atestwebsite.com';
    website.dispatchEvent(new Event('input'));

    const submit = document.querySelector('input[type="submit"]');
    expect(submit).to.exist;
    submit.click();

    expect(stepperStore.data.step).to.equal(3);
  });
});

describe('nonprofit - Address details', () => {
  before(() => {
    window.mph = {};
  });

  beforeEach(async () => {
    document.body.innerHTML = body;
    const np = document.querySelector('.nonprofit');
    init(np);

    stepperStore.update({ step: 3, scenario: SCENARIOS.NOT_FOUND_IN_SEARCH });
  });

  it('should not navigate without completed fields', async () => {
    const submit = document.querySelector('input[type="submit"]');
    expect(submit).to.exist;
    submit.click();

    expect(stepperStore.data.step).to.equal(3);
  });

  it('should navigate to personal details on submit with all fields completed', async () => {
    const streetAddress = document.querySelector('.np-input[name="streetAddress"]');
    streetAddress.value = 'A Test Street, 40';
    streetAddress.dispatchEvent(new Event('input'));

    const addressDetails = document.querySelector('.np-input[name="addressDetails"]');
    addressDetails.value = 'Block C, Floor 2';
    addressDetails.dispatchEvent(new Event('input'));

    const state = document.querySelector('.np-input[name="state"]');
    state.value = 'A Test State';
    state.dispatchEvent(new Event('input'));

    const city = document.querySelector('.np-input[name="city"]');
    city.value = 'A Test City';
    city.dispatchEvent(new Event('input'));

    const zipCode = document.querySelector('.np-input[name="zipCode"]');
    zipCode.value = 'TEST-0123';
    zipCode.dispatchEvent(new Event('input'));

    const submit = document.querySelector('input[type="submit"]');
    expect(submit).to.exist;
    submit.click();

    expect(stepperStore.data.step).to.equal(4);
  });

  it('should navigate to personal details on submit with just the required fields completed', async () => {
    const streetAddress = document.querySelector('.np-input[name="streetAddress"]');
    streetAddress.value = 'A Test Street, 40';
    streetAddress.dispatchEvent(new Event('input'));

    const city = document.querySelector('.np-input[name="city"]');
    city.value = 'A Test City';
    city.dispatchEvent(new Event('input'));

    const zipCode = document.querySelector('.np-input[name="zipCode"]');
    zipCode.value = 'TEST-0123';
    zipCode.dispatchEvent(new Event('input'));

    const submit = document.querySelector('input[type="submit"]');
    expect(submit).to.exist;
    submit.click();

    expect(stepperStore.data.step).to.equal(4);
  });
});

describe('nonprofit - Personal details', () => {
  const fillFields = () => {
    const firstName = document.querySelector('.np-input[name="firstName"]');
    firstName.value = 'Atest';
    firstName.dispatchEvent(new Event('input'));

    const lastName = document.querySelector('.np-input[name="lastName"]');
    lastName.value = 'Name';
    lastName.dispatchEvent(new Event('input'));

    const email = document.querySelector('.np-input[name="email"]');
    email.value = 'atest@email.com';
    email.dispatchEvent(new Event('input'));
  };

  before(() => {
    window.mph = {};
    window.lana = { log: () => {} };
  });

  beforeEach(async () => {
    document.body.innerHTML = body;
    const np = document.querySelector('.nonprofit');
    init(np);
  });

  afterEach(() => {
    if (window.fetch.restore) window.fetch.restore();
    if (window.lana.log.restore) window.lana.log.restore();
  });

  it('should not submit without completed fields', async () => {
    stepperStore.update({ step: 2, scenario: SCENARIOS.FOUND_IN_SEARCH });

    const submit = document.querySelector('input[type="submit"]');
    expect(submit).to.exist;
    submit.click();

    expect(stepperStore.data.step).to.equal(2);
  });

  it('should submit completed form in found in search scenario', async () => {
    sinon.stub(window, 'fetch');
    window.fetch.returns(
      Promise.resolve({
        json: () => Promise.resolve({ data: { validationInviteId: 'avalidationinviteid_0123' } }),
        ok: true,
      }),
    );

    stepperStore.update({ step: 2, scenario: SCENARIOS.FOUND_IN_SEARCH });

    fillFields();

    const submit = document.querySelector('input[type="submit"]');
    expect(submit).to.exist;
    submit.click();

    await waitForElement('.np-application-review-container');

    expect(stepperStore.data.step).to.equal(3);
  });

  it('should submit completed form in not found in search scenario', async () => {
    sinon.stub(window, 'fetch');
    window.fetch.returns(
      Promise.resolve({
        json: () => Promise.resolve({ data: { validationInviteId: 'avalidationinviteid_0123' } }),
        ok: true,
      }),
    );

    stepperStore.update({ step: 4, scenario: SCENARIOS.NOT_FOUND_IN_SEARCH });

    fillFields();

    const submit = document.querySelector('input[type="submit"]');
    expect(submit).to.exist;
    submit.click();

    await waitForElement('.np-application-review-container');

    expect(stepperStore.data.step).to.equal(5);
  });

  it('should not navigate on submission failure', async () => {
    sinon.stub(window, 'fetch');
    sinon.stub(window.lana, 'log');

    window.fetch.returns(
      Promise.resolve({
        json: () => Promise.resolve({ error: { title: 'An error title', message: 'A submission failure' } }),
        ok: false,
      }),
    );

    stepperStore.update({ step: 2, scenario: SCENARIOS.FOUND_IN_SEARCH });

    fillFields();

    const submit = document.querySelector('input[type="submit"]');
    expect(submit).to.exist;
    submit.click();

    await delay(500);

    expect(stepperStore.data.step).to.equal(2);
    expect(window.lana.log.getCall(0).args[0]).to.equal(
      'Could not send organization data: Error: An error title: A submission failure',
    );
  });
});
