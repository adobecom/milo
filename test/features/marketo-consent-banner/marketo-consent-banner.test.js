import sinon from 'sinon';
import { expect } from '@esm-bundle/chai';
import { loadScript, setConfig } from '../../../libs/utils/utils.js';
import { formSuccess, formSubmit, loadMarketo } from '../../../libs/blocks/marketo/marketo.js';
import init from '../../../libs/features/marketo-consent-banner/marketo-consent-banner.js';

const STORAGE_KEY = 'milo:marketo-consent-reminder';
const originalUrl = window.location.href;
const destination = new URL('/fr/thank-you.html?campaign=keep#asset', originalUrl);
const eligibleValues = { Country: 'DE', mktoKoreaPrivacyThirdParty: 'yes', Email: 'test@example.com' };
const formData = {
  'form id': '2277',
  'marketo host': 'engage.adobe.com',
  'marketo munckin': '360-KCI-804',
  'form.success.type': 'redirect',
  'form.success.content': destination.href,
};

describe('Marketo consent reminder', () => {
  let clock;
  let formEl;

  before(async () => {
    await loadScript('/test/blocks/marketo/mocks/deps/forms2.min.js');
  });

  beforeEach(() => {
    clock = sinon.useFakeTimers({ now: Date.now() });
    window.lana = { log: sinon.spy() };
    setConfig({ codeRoot: '/test/blocks/marketo/mocks' });
    window.history.replaceState({}, '', '/fr/form.html');
    document.body.innerHTML = '<main><div class="marketo"><form id="mktoForm_2277"></form></div></main>';
    formEl = document.querySelector('form');
    sessionStorage.removeItem(STORAGE_KEY);
  });

  afterEach(() => {
    window.dispatchEvent(new Event('pagehide'));
    clock.restore();
    sinon.restore();
    sessionStorage.removeItem(STORAGE_KEY);
    window.history.replaceState({}, '', originalUrl);
    document.head.querySelectorAll('link[href$="/marketo-consent-banner.css"]').forEach((link) => link.remove());
    document.body.innerHTML = '';
    window.mcz_marketoForm_pref = undefined;
  });

  const succeed = (values = eligibleValues, data = formData) => formSuccess(
    formEl, data, values, destination.href,
  );
  const visitThankYou = () => {
    window.history.replaceState({}, '', destination.href);
    document.body.innerHTML = '<div class="language-banner">Language</div><div class="feds-promo-aside-wrapper">Promo</div><main><h1>Thank you</h1></main>';
  };

  it('passes submitted values through the owning form callback and hands off only UI state', async () => {
    const form = {
      getFormElem: () => ({ get: () => formEl }),
      onValidate: sinon.spy(),
      onSubmit: sinon.spy(),
      onSuccess: sinon.spy(),
    };
    const otherForm = { getFormElem: () => ({ get: () => document.createElement('form') }) };
    sinon.stub(window, 'MktoForms2').value({
      loadForm: sinon.spy(),
      whenReady: (callback) => {
        callback(otherForm);
        callback(form);
      },
    });
    await loadMarketo(document.querySelector('.marketo'), formData);
    expect(form.onSuccess.calledOnce).to.be.true;
    const callback = form.onSuccess.firstCall.args[0];
    expect(callback(eligibleValues, destination.href)).to.be.true;

    const reminder = JSON.parse(sessionStorage.getItem(STORAGE_KEY));
    expect(reminder).to.deep.equal({
      version: 1,
      destination: `${destination.origin}${destination.pathname}`,
      createdAt: Date.now(),
    });
    expect(new URL(window.location).pathname).to.equal('/fr/form.html');
    expect(document.querySelector('.marketo-consent-banner')).to.be.null;
  });

  it('renders German text once on the separate page without changing other banners or cookies', () => {
    succeed();
    visitThankYou();
    const cookies = document.cookie;
    const languageBanner = document.querySelector('.language-banner');
    const promo = document.querySelector('.feds-promo-aside-wrapper');
    init();
    init();

    const banner = document.querySelector('.marketo-consent-banner');
    expect(document.querySelectorAll('.marketo-consent-banner').length).to.equal(1);
    expect(document.querySelector('main').firstElementChild).to.equal(banner);
    expect(banner.lang).to.equal('de');
    expect(banner.getAttribute('role')).to.equal('status');
    expect(banner.querySelector('p').textContent).to.equal('Bitte pr\u00fcfen Sie Ihr E-Mail-Postfach und best\u00e4tigen Sie Ihre Anmeldung \u00fcber den Link in unserer E-Mail.');
    expect(sessionStorage.getItem(STORAGE_KEY)).to.be.null;
    expect(document.querySelector('.language-banner')).to.equal(languageBanner);
    expect(document.querySelector('.feds-promo-aside-wrapper')).to.equal(promo);
    expect(document.cookie).to.equal(cookies);
    expect(window.location.href).to.equal(destination.href);

    const close = banner.querySelector('button');
    expect(close.getAttribute('aria-label')).to.equal('Hinweis schlie\u00dfen');
    close.click();
    init();
    expect(document.querySelector('.marketo-consent-banner')).to.be.null;
  });

  [
    { Country: 'DE', mktoKoreaPrivacyThirdParty: 'no' },
    { Country: 'US', mktoKoreaPrivacyThirdParty: 'yes' },
    { Country: 'DE', mktoKoreaPrivacyThirdParty: 'false' },
    { Country: 'DE', mktoOKtoEmail: 'Y', mktoCoPartnerPermissionValue: 'yes' },
    { mktoKoreaPrivacyThirdParty: 'yes' },
  ].forEach((values) => {
    it(`clears stale eligibility for an ineligible submission: ${JSON.stringify(values)}`, () => {
      succeed();
      succeed(values);
      expect(sessionStorage.getItem(STORAGE_KEY)).to.be.null;
    });
  });

  it('clears prior eligibility when another submission starts, before it succeeds or fails', () => {
    succeed();
    formSubmit(formEl);
    expect(sessionStorage.getItem(STORAGE_KEY)).to.be.null;
  });

  it('does not queue a reminder for section, IMS, modal, or cross-origin outcomes', () => {
    ['section', 'ims'].forEach((type) => {
      succeed();
      succeed(eligibleValues, { ...formData, 'form.success.type': type });
      expect(sessionStorage.getItem(STORAGE_KEY)).to.be.null;
    });

    const modal = document.createElement('div');
    modal.className = 'dialog-modal';
    const close = document.createElement('button');
    close.className = 'dialog-close';
    document.body.append(modal);
    modal.append(document.querySelector('.marketo'), close);
    succeed();
    expect(sessionStorage.getItem(STORAGE_KEY)).to.be.null;

    modal.before(document.querySelector('.marketo'));
    succeed(eligibleValues, { ...formData, 'form.success.content': 'https://example.com/thank-you' });
    expect(sessionStorage.getItem(STORAGE_KEY)).to.be.null;
  });

  it('preserves form success when storage is blocked', () => {
    sinon.stub(Storage.prototype, 'setItem').throws(new DOMException('Blocked', 'SecurityError'));
    expect(succeed()).to.be.true;
    expect(document.querySelector('.marketo').classList.contains('success')).to.be.true;
    expect(window.lana.log.calledWith('Could not update Marketo consent reminder')).to.be.true;
  });

  it('does not load banner styles when state is missing', () => {
    visitThankYou();
    init();
    expect(document.querySelector('.marketo-consent-banner')).to.be.null;
    expect(document.head.querySelector('link[href$="/marketo-consent-banner.css"]')).to.be.null;
  });

  it('preserves valid state on intermediate pages until the destination is reached', () => {
    succeed();
    const pending = sessionStorage.getItem(STORAGE_KEY);
    init();
    expect(document.querySelector('.marketo-consent-banner')).to.be.null;
    expect(document.head.querySelector('link[href$="/marketo-consent-banner.css"]')).to.be.null;
    expect(sessionStorage.getItem(STORAGE_KEY)).to.equal(pending);
    visitThankYou();
    init();
    expect(document.querySelector('.marketo-consent-banner')).to.exist;
    expect(sessionStorage.getItem(STORAGE_KEY)).to.be.null;
  });

  [
    ['expired', (record) => ({ ...record, createdAt: Date.now() - 600001 })],
    ['future', (record) => ({ ...record, createdAt: Date.now() + 1 })],
    ['invalid destination', (record) => ({ ...record, destination: null })],
    ['unknown version', (record) => ({ ...record, version: 2 })],
    ['invalid timestamp', (record) => ({ ...record, createdAt: String(Date.now()) })],
  ].forEach(([name, change]) => {
    it(`discards ${name} state without displaying a reminder`, () => {
      succeed();
      const record = JSON.parse(sessionStorage.getItem(STORAGE_KEY));
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(change(record)));
      visitThankYou();
      init();
      expect(document.querySelector('.marketo-consent-banner')).to.be.null;
      expect(sessionStorage.getItem(STORAGE_KEY)).to.be.null;
    });
  });

  it('discards malformed state and reports the failure', () => {
    sessionStorage.setItem(STORAGE_KEY, '{');
    visitThankYou();
    init();
    expect(sessionStorage.getItem(STORAGE_KEY)).to.be.null;
    expect(document.querySelector('.marketo-consent-banner')).to.be.null;
    expect(window.lana.log.calledWith('Could not read Marketo consent reminder')).to.be.true;
  });

  it('leaves the thank-you content intact when reading storage is blocked', () => {
    visitThankYou();
    sinon.stub(Storage.prototype, 'getItem').throws(new DOMException('Blocked', 'SecurityError'));
    init();
    expect(document.querySelector('h1').textContent).to.equal('Thank you');
    expect(document.querySelector('.marketo-consent-banner')).to.be.null;
    expect(window.lana.log.calledWith('Could not read Marketo consent reminder')).to.be.true;
  });

  it('removes the reminder before a cached page can be restored by back navigation', () => {
    succeed();
    visitThankYou();
    init();
    window.dispatchEvent(new Event('pagehide'));
    init();
    expect(document.querySelector('.marketo-consent-banner')).to.be.null;
  });

  it('reports a stylesheet failure without disturbing thank-you content', () => {
    succeed();
    visitThankYou();
    init();
    document.head.querySelector('link[href$="/marketo-consent-banner.css"]').dispatchEvent(new Event('error'));
    expect(document.querySelector('.marketo-consent-banner')).to.be.null;
    expect(document.querySelector('h1').textContent).to.equal('Thank you');
    expect(window.lana.log.calledWith('Could not load Marketo consent banner styles')).to.be.true;
  });
});
