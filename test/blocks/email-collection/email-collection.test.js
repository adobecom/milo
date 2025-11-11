import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
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
const { default: init, overrideForegroundContent } = emailCollectionModule;

async function sleep(time = 10) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), time);
  });
}

function setIms(signedIn = true) {
  window.adobeIMS = {
    isSignedInUser: () => signedIn,
    signIn: () => {},
    getProfile: () => (signedIn ? {
      countryCode: 'US',
      first_name: 'Test first name',
      last_name: 'Test last name',
      email: 'test@test.com',
      userId: 'Test',
    } : {}),
  };
}

function setGetIdentity() {
  window.alloy_getIdentity = { identity: { ECID: 'test-ecid' } };
}

function setAdobePrivacy(hasConsent = true) {
  window.adobePrivacy = { activeCookieGroups: () => (hasConsent ? ['C0001', 'C0004'] : ['C0001']) };
}

function setAlloyAll() {
  window.alloy_all = {
    data: {
      _adobe_corpnew: {
        cmp: { state: 'test' },
        otherConsents: {
          configuration: {
            performance: true,
            functional: true,
            advertising: true,
          },
        },
      },
    },
  };
}

describe('Email collection', () => {
  beforeEach(async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    setGetIdentity();
    setAdobePrivacy();
    setAlloyAll();
    setIms();
    mockFetch({});
  });

  afterEach(() => {
    document.body.innerHTML = '';
    restoreFetch();
    setAdobePrivacy();
    setIms();
  });

  it('Should redirect user to the IMS if not signed in.', async () => {
    setIms(false);
    sinon.spy(window.adobeIMS, 'signIn');
    window.location.hash = 'modal';
    const block = document.querySelector('#waitlist');
    await init(block);
    await sleep();
    expect(window.adobeIMS.signIn.called).to.be.true;
  });

  it('Should not redirect user to the IMS if not signed in and if form is anonymous', async () => {
    setIms(false);
    sinon.spy(window.adobeIMS, 'signIn');
    window.location.hash = 'modal';
    const block = document.querySelector('#mailing-list');
    await init(block);
    await sleep();
    expect(window.adobeIMS.signIn.called).to.be.false;
  });

  it('Should redirect user to the IMS if runtime reutrns 401', async () => {
    mockFetch({ signedIn: false });
    sinon.spy(window.adobeIMS, 'signIn');
    window.location.hash = 'modal';
    const block = document.querySelector('#waitlist');
    await init(block);
    await sleep();
    expect(window.adobeIMS.signIn.called).to.be.true;
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
    const ariaLive = block.parentElement.querySelector('.email-collection-aria-live');
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
          disabled: '',
        },
      },
      'last-name': {
        label: 'Last Name',
        attributes: {
          type: 'text',
          disabled: '',
        },
      },
      country: {
        label: 'Country',
        url: 'https://main--federal--adobecom.aem.page/federal/email-collection/form-config.json?sheet=countries',
        attributes: {
          type: 'text',
          disabled: '',
        },
      },
      state: {
        tag: 'select',
        label: 'State',
        url: 'https://main--federal--adobecom.aem.page/federal/email-collection/form-config.json?sheet=states&limit=2000',
        attributes: { required: 'true' },
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
    expect(inputs.length).to.be.equal(7);
    inputs.forEach((inputContainer) => {
      const label = inputContainer.querySelector('label');
      const input = inputContainer.querySelector('input, select');
      const error = inputContainer.querySelector('div[id^="error"]');
      expect(label).to.exist;
      expect(input).to.exist;
      if (input.getAttribute('disabled') === null) expect(error).to.exist;
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
    const state = block.querySelector('form select#state');
    state.value = 'NY';
    submitButton.click();
    await sleep(10);
    const foregroundText = block.querySelectorAll('.foreground > .text');
    expect(foregroundText[0].classList.contains('hidden')).to.be.true;
    expect(foregroundText[1].classList.contains('hidden')).to.be.false;
  });

  it('Should submit form and not send ecid if there is no cookie consent', async () => {
    setIms(false);
    setAdobePrivacy(false);
    const fetchSpy = sinon.spy(window, 'fetch');

    const block = document.querySelector('#mailing-list');
    await init(block);
    await sleep();
    const submitButton = block.querySelector('form button[type="submit"]');
    const email = block.querySelector('form input#email');
    email.value = 'test@test.com';
    submitButton.click();
    await sleep(10);
    const submitFetch = fetchSpy.getCalls()[2];
    const { body } = submitFetch.args[1];
    expect(JSON.parse(body).ecid).to.be.undefined;
  });

  it('Should submit form and send ecid if there is cookie consent', async () => {
    setIms(false);
    setAdobePrivacy(true);
    const fetchSpy = sinon.spy(window, 'fetch');

    const block = document.querySelector('#mailing-list');
    await init(block);
    await sleep();
    const submitButton = block.querySelector('form button[type="submit"]');
    const email = block.querySelector('form input#email');
    email.value = 'test@test.com';
    submitButton.click();
    await sleep(10);
    const submitFetch = fetchSpy.getCalls()[2];
    const { body } = submitFetch.args[1];
    expect(JSON.parse(body).ecid).to.equal('test-ecid');
  });

  it('Should submit form and not send guid if user is not signed in', async () => {
    setIms(false);
    const fetchSpy = sinon.spy(window, 'fetch');

    const block = document.querySelector('#mailing-list');
    await init(block);
    await sleep();
    const submitButton = block.querySelector('form button[type="submit"]');
    const email = block.querySelector('form input#email');
    email.value = 'test@test.com';
    submitButton.click();
    await sleep(10);
    const submitFetch = fetchSpy.getCalls()[2];
    const { body } = submitFetch.args[1];
    expect(JSON.parse(body).guid).to.be.undefined;
  });

  it('Should submit form and send guid if user is signed in', async () => {
    setIms(true);
    setAdobePrivacy(true);
    const fetchSpy = sinon.spy(window, 'fetch');

    const block = document.querySelector('#mailing-list');
    await init(block);
    await sleep();
    const submitButton = block.querySelector('form button[type="submit"]');
    const email = block.querySelector('form input#email');
    email.value = 'test@test.com';
    submitButton.click();
    await sleep(10);
    const submitFetch = fetchSpy.getCalls()[3];
    const { body } = submitFetch.args[1];
    expect(JSON.parse(body).guid).to.be.equal('Test');
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

  it('Should override foreground content based on query param', async () => {
    const block = document.querySelector('#waitlist');
    await init(block);
    await sleep();
    const text = block.querySelectorAll('.foreground > .text');
    const newUrl = new URL(window.location.href);

    newUrl.searchParams.set('email-collection-show', 'success');
    window.history.replaceState({}, '', newUrl.toString());
    overrideForegroundContent();
    expect(text[0].classList.contains('hidden')).to.be.true;
    expect(text[1].classList.contains('hidden')).to.be.false;
    expect(text[2].classList.contains('hidden')).to.be.true;

    newUrl.searchParams.set('email-collection-show', 'error');
    window.history.replaceState({}, '', newUrl.toString());
    overrideForegroundContent();
    expect(text[0].classList.contains('hidden')).to.be.true;
    expect(text[1].classList.contains('hidden')).to.be.true;
    expect(text[2].classList.contains('hidden')).to.be.false;

    newUrl.searchParams.set('email-collection-show', 'form');
    window.history.replaceState({}, '', newUrl.toString());
    overrideForegroundContent();
    expect(text[0].classList.contains('hidden')).to.be.false;
    expect(text[1].classList.contains('hidden')).to.be.true;
    expect(text[2].classList.contains('hidden')).to.be.true;

    newUrl.searchParams.set('email-collection-show', 'subscribed');
    window.history.replaceState({}, '', newUrl.toString());
    overrideForegroundContent();
    expect(text[0].classList.contains('hidden')).to.be.true;
    expect(text[1].classList.contains('hidden')).to.be.false;
    expect(text[2].classList.contains('hidden')).to.be.true;

    const subscribed = text[1].querySelector('.subscribed-email');
    expect(subscribed.classList.contains('hidden')).to.be.false;
  });
});
