import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { getLocale, setConfig } from '../../../libs/utils/utils.js';
import { restoreFetch, mockFetch } from './mocks/fetchMock.js';
import { setFormData, getFormData } from '../../../libs/blocks/email-collection/utils.js';

const locales = { '': { ietf: 'en-US', tk: 'hah7vzn.css' } };
const config = {
  imsClientId: 'milo',
  codeRoot: '/libs',
  contentRoot: `${window.location.origin}${getLocale(locales).prefix}`,
  locales,
};

setConfig(config);

const emailCollectionModule = await import('../../../libs/blocks/email-collection/email-collection.js');
const { default: init } = emailCollectionModule;

async function sleep(time = 10) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), time);
  });
}

function setIms(signedIn = true) {
  window.adobeIMS = {
    isSignedInUser: () => signedIn,
    getProfile: () => ({
      countryCode: 'US',
      first_name: 'Test first name',
      last_name: 'Test last name',
      email: 'test@test.com',
      userId: 'Test',
    }),
  };
}

function setSatellite(martechOff = false) {
  // eslint-disable-next-line
  window.__satelliteLoadedPromise = {
    cookie: { get: () => (martechOff ? undefined : 'test|test') } };
}

describe('Email collection', () => {
  beforeEach(async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    setSatellite();
    setIms();
    mockFetch({});
  });

  afterEach(() => {
    document.body.innerHTML = '';
    restoreFetch();
  });

  it('Should populate email collection data object', async () => {
    const formDataObject = {
      fields: { email: 'Email address' },
      metadata: {
        mpsSname: '1111',
        subscriptionName: '1234',
      },
      config: {
        placeholders: {
          required: 'This field is required.',
          email: 'Enter a valid email.',
        },
      },
      consent: { consentId: 'consent-id' },
    };
    const block = document.querySelector('#metadata');
    setFormData(block);
    expect(getFormData('fields')).to.deep.equal(formDataObject.fields);
    expect(getFormData('metadata')).to.deep.equal(formDataObject.metadata);
    const formConfig = await getFormData('config');
    expect(formConfig).to.deep.equal(formDataObject.config);
    const { consentId, consentDiv } = await getFormData('consent');
    expect(consentId).to.be.equal(formDataObject.consent.consentId);
    expect(consentDiv).to.be.exist;
  });

  it('Should render waitlist email collection block with form', async () => {
    const block = document.querySelector('#waitlist');
    await init(block);
    await sleep();
    const foreground = block.querySelector('.foreground');
    const text = foreground.querySelector('.text');
    const ariaLive = block.parentElement.querySelector('.email-aria-live');
    const form = block.querySelector('form');
    const submitButton = form.querySelector('button[type="submit"]');
    const consentStirng = form.querySelector('.consent-string');

    expect(foreground).to.exist;
    expect(text.classList.contains('hidden')).to.be.false;
    expect(form).to.exist;
    expect(ariaLive).to.exist;
    expect(submitButton).to.exist;
    expect(consentStirng).to.exist;

    const formInputs = {
      email: {
        label: 'Email address',
        attributes: {
          type: 'email',
          required: 'true',
          autocomplete: 'email',
        },
      },
      'first-name': {
        label: 'First Name',
        attributes: {
          type: 'text',
          readonly: '',
        },
      },
      'last-name': {
        label: 'Last Name',
        attributes: {
          type: 'text',
          readonly: '',
        },
      },
      country: {
        label: 'Country',
        url: 'https://main--federal--adobecom.aem.page/federal/email-collection/form-config.json?sheet=countries',
        attributes: {
          type: 'text',
          readonly: '',
        },
      },
      organization: {
        label: 'Organization',
        attributes: {
          type: 'text',
          autocomplete: 'organization',
        },
      },
      occupation: {
        label: 'Occupation',
        attributes: {
          type: 'text',
          required: 'true',
          autocomplete: 'organization-title',
        },
      },
    };

    const inputs = form.querySelectorAll('.input-container');
    expect(inputs.length).to.be.equal(6);
    inputs.forEach((inputContainer) => {
      const label = inputContainer.querySelector('label');
      const input = inputContainer.querySelector('input');
      const error = inputContainer.querySelector('div[id^="error"]');
      expect(label).to.exist;
      expect(input).to.exist;
      if (input.getAttribute('readonly') === null) expect(error).to.exist;
      const { id } = input;
      const { label: labelValue, attributes } = formInputs[id];
      expect(label.textContent).to.be.equal(labelValue);
      Object.entries(attributes).forEach(([key, value]) => {
        expect(input.getAttribute(key)).to.be.equal(value);
      });
    });
  });

  it('Should prefill input fields with the data from IMS', async () => {
    const block = document.querySelector('#waitlist');
    await init(block);
    await sleep();
    const inputs = block.querySelectorAll('form input:is(#email, #first-name, #last-name, #country)');
    const imsProfileData = {
      country: 'United States',
      'first-name': 'Test first name',
      'last-name': 'Test last name',
      email: 'test@test.com',
    };
    inputs.forEach((input) => {
      const { id, value } = input;
      expect(value).to.be.equal(imsProfileData[id]);
    });
  });

  it('Should show error message is input value is not valid', async () => {
    const block = document.querySelector('#waitlist');
    await init(block);
    await sleep();
    const submitButton = block.querySelector('form button[type="submit"]');
    const email = block.querySelector('#email');
    email.value = 'test';
    submitButton.click();

    await sleep(10);
    const form = block.querySelector('form');
    const emailContainer = email.parentElement;
    const errorEmail = emailContainer.querySelector('div[id^="error"]');
    const occupationContainer = form.querySelector('div:has(input#occupation)');
    const occupation = occupationContainer.querySelector('input');
    const errorOccupation = occupationContainer.querySelector('div[id^="error"]');
    const { placeholders } = await getFormData('config');

    expect(occupation.classList.contains('invalid')).to.be.true;
    expect(errorOccupation.textContent).to.be.equal(placeholders.required);
    expect(email.classList.contains('invalid')).to.be.true;
    expect(errorEmail.textContent).to.be.equal(placeholders.email);
  });

  it('Should submit form and show success message', async () => {
    const block = document.querySelector('#waitlist');
    await init(block);
    await sleep();
    const submitButton = block.querySelector('form button[type="submit"]');
    const occupation = block.querySelector('form input#occupation');
    occupation.value = 'Test';
    const organization = block.querySelector('form input#organization');
    organization.value = 'Test';
    submitButton.click();
    await sleep(10);
    const foregroundText = block.querySelectorAll('.foreground > .text');
    expect(foregroundText[0].classList.contains('hidden')).to.be.true;
    expect(foregroundText[1].classList.contains('hidden')).to.be.false;
  });

  it('Should show hide message/form', async () => {
    const block = document.querySelector('#waitlist');
    await init(block);
    await sleep();
    const { showHideMessage } = emailCollectionModule;

    const text = block.querySelectorAll('.foreground > .text');
    expect(text[0].classList.contains('hidden')).to.be.false;
    expect(text[1].classList.contains('hidden')).to.be.true;
    expect(text[2].classList.contains('hidden')).to.be.true;

    showHideMessage({ errorMsg: 'Test error' });
    expect(text[0].classList.contains('hidden')).to.be.true;
    expect(text[1].classList.contains('hidden')).to.be.true;
    expect(text[2].classList.contains('hidden')).to.be.false;

    showHideMessage({});
    expect(text[0].classList.contains('hidden')).to.be.true;
    expect(text[1].classList.contains('hidden')).to.be.false;
    expect(text[2].classList.contains('hidden')).to.be.true;

    showHideMessage({ hideMessage: true });
    expect(text[0].classList.contains('hidden')).to.be.false;
    expect(text[1].classList.contains('hidden')).to.be.true;
    expect(text[2].classList.contains('hidden')).to.be.true;
  });

  it('Should show subscribed message if user is subscribed', async () => {
    mockFetch({ subscribed: true });
    const block = document.querySelector('#waitlist');
    await init(block);
    await sleep();

    const text = block.querySelectorAll('.foreground > .text');
    expect(text[0].classList.contains('hidden')).to.be.true;
    expect(text[1].classList.contains('hidden')).to.be.false;
    expect(text[2].classList.contains('hidden')).to.be.true;

    const subscribedEmail = block.querySelector('.subscribed-email');
    const showForm = block.querySelector('.show-form');
    const { email } = window.adobeIMS.getProfile();
    expect(subscribedEmail).to.exist;
    expect(subscribedEmail.textContent).to.be.equal(email);
    expect(showForm).to.exist;

    showForm.click();
    expect(text[0].classList.contains('hidden')).to.be.false;
    expect(text[1].classList.contains('hidden')).to.be.true;
    expect(text[2].classList.contains('hidden')).to.be.true;
  });

  it('Should submit form and show error message if martech is disabled', async () => {
    setSatellite(true);
    const block = document.querySelector('#waitlist');
    await init(block);
    await sleep();
    const submitButton = block.querySelector('form button[type="submit"]');
    const occupation = block.querySelector('form input#occupation');
    occupation.value = 'Test';
    const organization = block.querySelector('form input#organization');
    organization.value = 'Test';
    submitButton.click();
    await sleep(10);
    const foregroundText = block.querySelectorAll('.foreground > .text');
    expect(foregroundText[0].classList.contains('hidden')).to.be.true;
    expect(foregroundText[1].classList.contains('hidden')).to.be.true;
    expect(foregroundText[2].classList.contains('hidden')).to.be.false;
  });

  it('Should submit form and show subscribed message if user is subscribed', async () => {
    mockFetch({ subscribed: true });
    const block = document.querySelector('#waitlist');
    await init(block);
    await sleep();
    const submitButton = block.querySelector('form button[type="submit"]');
    const occupation = block.querySelector('form input#occupation');
    occupation.value = 'Test';
    const organization = block.querySelector('form input#organization');
    organization.value = 'Test';
    submitButton.click();
    await sleep(10);
    const text = block.querySelectorAll('.foreground > .text');
    expect(text[0].classList.contains('hidden')).to.be.true;
    expect(text[1].classList.contains('hidden')).to.be.false;
    expect(text[2].classList.contains('hidden')).to.be.true;

    const subscribedEmail = block.querySelector('.subscribed-email');
    const showForm = block.querySelector('.show-form');
    const { email } = window.adobeIMS.getProfile();
    expect(subscribedEmail).to.exist;
    expect(subscribedEmail.textContent).to.be.equal(email);
    expect(showForm).to.exist;
  });
});
