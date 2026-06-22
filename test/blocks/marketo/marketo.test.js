import sinon from 'sinon';
import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { setConfig, getConfig, MILO_EVENTS } from '../../../libs/utils/utils.js';
import init, {
  setPreferences,
  decorateURL,
  formSuccess,
  FORM_PARAM,
  handleIframeTimeout,
  watchSubmit,
  watchLoad,
} from '../../../libs/blocks/marketo/marketo.js';

const ogFetch = window.fetch;
const blockHTML = await readFile({ path: './mocks/block.html' });
const onePage = await readFile({ path: './mocks/one-page-experience.html' });
const config = {
  codeRoot: '/test/blocks/marketo/mocks',
  marketo: {
    iframeTimeout: 3000,
    showError: true,
  },
};

describe('marketo', () => {
  let clock;

  beforeEach(() => {
    clock = sinon.useFakeTimers();
    window.lana = { log: sinon.spy() };
    document.body.innerHTML = blockHTML;
  });

  afterEach(() => {
    clock.restore();
    sinon.restore();
    window.mcz_marketoForm_pref = undefined;
  });

  const tick = async (ms) => {
    clock.tick(ms);
    await clock.nextAsync();
  };

  it('hides form if no data url', async () => {
    document.body.innerHTML = blockHTML;
    const el = document.querySelector('.marketo');
    el.querySelector('a').remove();

    await init(el);
    await tick(10);
    expect(el.style.display).to.equal('none');
  });

  it('sets preferences on the data layer', async () => {
    const formData = {
      'first.key': 'value1',
      'second.key': 'value2',
    };

    setPreferences(formData);

    expect(window.mcz_marketoForm_pref.form.status).to.equal('pending');
    expect(window.mcz_marketoForm_pref).to.have.property('first');
    expect(window.mcz_marketoForm_pref.first).to.have.property('key');
    expect(window.mcz_marketoForm_pref.first.key).to.equal('value1');
    expect(window.mcz_marketoForm_pref).to.have.property('second');
    expect(window.mcz_marketoForm_pref.second).to.have.property('key');
    expect(window.mcz_marketoForm_pref.second.key).to.equal('value2');
  });
});

describe('marketo decorateURL', () => {
  it('decorates absolute URL with local base URL', async () => {
    const baseURL = new URL('http://localhost:6456/marketo-block');
    const result = await decorateURL('https://main--milo--adobecom.aem.page/marketo-block/thank-you', baseURL);
    expect(result).to.equal('http://localhost:6456/marketo-block/thank-you');
  });

  it('decorates relative URL with absolute base URL', async () => {
    const baseURL = new URL('https://main--milo--adobecom.aem.page/marketo-block');
    const result = await decorateURL('/marketo-block/thank-you', baseURL);
    expect(result).to.equal('https://main--milo--adobecom.aem.page/marketo-block/thank-you');
  });

  it('decorates absolute URL with matching base URL', async () => {
    const baseURL = new URL('https://main--milo--adobecom.aem.page/marketo-block');
    const result = await decorateURL('https://main--milo--adobecom.aem.page/marketo-block/thank-you', baseURL);
    expect(result).to.equal('https://main--milo--adobecom.aem.page/marketo-block/thank-you');
  });

  it('decorates absolute URL with .html base URL', async () => {
    const baseURL = new URL('https://business.adobe.com/marketo-block.html');
    const result = await decorateURL('https://main--milo--adobecom.aem.page/marketo-block/thank-you', baseURL);
    expect(result).to.equal('https://business.adobe.com/marketo-block/thank-you.html');
  });

  it('keeps identical absolute URL with .html base URL', async () => {
    const baseURL = new URL('https://business.adobe.com/marketo-block.html');
    const result = await decorateURL('https://business.adobe.com/marketo-block/thank-you.html', baseURL);
    expect(result).to.equal('https://business.adobe.com/marketo-block/thank-you.html');
  });

  it('returns null when provided a malformed URL', async () => {
    const baseURL = new URL('https://business.adobe.com/marketo-block.html');
    const result = await decorateURL('tps://business', baseURL);
    expect(result).to.be.null;
  });

  it('Does not add .html to ending slash', async () => {
    const baseURL = new URL('https://business.adobe.com/marketo-block.html');
    const result = await decorateURL('https://business.adobe.com/', baseURL);
    expect(result).to.equal('https://business.adobe.com/');
  });

  it('Does not add .html to non-html file extension (e.g. PDF)', async () => {
    const baseURL = new URL('https://business.adobe.com/marketo-block.html');
    const result = await decorateURL('https://business.adobe.com/assets/document.pdf', baseURL);
    expect(result).to.equal('https://business.adobe.com/assets/document.pdf');
  });

  it('Does not add .html to ending slash when htmlExclude is set', async () => {
    const { htmlExclude: savedHtmlExclude } = getConfig();
    try {
      setConfig({ htmlExclude: [/experience\.adobe\.com(\/.*)?/] });
      const excludeUrl = 'https://experience.adobe.com/solutions/GenStudio-Adobe-genstudio/trial/welcome';
      const baseURL = new URL('https://business.adobe.com/marketo-block.html');
      const result = await decorateURL(excludeUrl, baseURL);
      expect(result).to.equal('https://experience.adobe.com/solutions/GenStudio-Adobe-genstudio/trial/welcome');
    } finally {
      setConfig({ htmlExclude: savedHtmlExclude });
    }
  });

  it('localizes URL with .html base URL', async () => {
    setConfig({
      pathname: '/uk/marketo-block.html',
      locales: {
        '': {},
        uk: {},
      },
    });
    const baseURL = new URL('https://business.adobe.com/uk/marketo-block.html');
    const result = await decorateURL('/marketo-block/thank-you', baseURL);
    expect(result).to.equal('https://business.adobe.com/uk/marketo-block/thank-you.html');
  });

  it('Does not decorate non-url text', async () => {
    const baseURL = new URL('https://business.adobe.com/marketo-block.html');
    const result = await decorateURL('Thank you for submitting the form', baseURL);
    expect(result).to.be.null;
  });
});

describe('Marketo ungated one page experience', () => {
  let url;
  let clock;

  beforeEach(() => {
    url = new URL(window.location);
    url.searchParams.set(FORM_PARAM, 'off');
    window.history.pushState({}, '', url);
    document.body.innerHTML = onePage;
    clock = sinon.useFakeTimers();
  });

  afterEach(() => {
    url.searchParams.delete(FORM_PARAM);
    window.history.pushState({}, '', url);
    clock.restore();
  });

  it('shows success section', () => {
    init(document.querySelector('.marketo'));
    expect(document.querySelector('.section.form-success').classList.contains('hide-block')).to.be.false;
  });

  it('shows success section that appears after marketo', () => {
    document.querySelector('#success-section').classList.remove('form-success');
    init(document.querySelector('.marketo'));
    expect(document.querySelector('#success-section').classList.contains('hide-block')).to.be.true;
    document.querySelector('#success-section').classList.add('form-success');
    document.dispatchEvent(new Event(MILO_EVENTS.DEFERRED));
    clock.tick(500);
    expect(document.querySelector('#success-section').classList.contains('hide-block')).to.be.false;
  });

  it('hides success hide section that appears after marketo', () => {
    document.querySelector('#success-hide-section').classList.remove('form-success-hide');
    init(document.querySelector('.marketo'));
    expect(document.querySelector('#success-hide-section').classList.contains('hide-block')).to.be.false;
    document.querySelector('#success-hide-section').classList.add('form-success-hide');
    document.dispatchEvent(new Event(MILO_EVENTS.DEFERRED));
    clock.tick(500);
    expect(document.querySelector('#success-hide-section').classList.contains('hide-block')).to.be.true;
  });

  it('logs error if success section is not provided', () => {
    document.querySelector('#success-data').remove();
    document.querySelector('#success-hide-data').remove();
    init(document.querySelector('.marketo'));
    expect(window.lana.log.args[0][0]).to.equal('Error showing Marketo success section');
    expect(window.lana.log.args[1][0]).to.equal('Error hiding Marketo success section');
  });

  it('logs error if success section does not toggle after maximum intervals', () => {
    document.querySelector('#success-section').classList.remove('form-success');
    document.querySelector('#success-hide-section').classList.remove('form-success-hide');
    init(document.querySelector('.marketo'));
    expect(document.querySelector('#success-section').classList.contains('hide-block')).to.be.true;
    expect(document.querySelector('#success-hide-section').classList.contains('hide-block')).to.be.false;
    clock.runAll();
    expect(window.lana.log.args[0][0]).to.equal('Error showing Marketo success section');
    expect(window.lana.log.args[1][0]).to.equal('Error hiding Marketo success section');
  });
});

describe('Marketo Iframe Timeout Handler', () => {
  let clock;
  let marketoBlock;

  beforeEach(() => {
    clock = sinon.useFakeTimers();
    window.fetch = sinon.stub();
    window.lana = { log: sinon.spy() };
    setConfig(config);
    document.body.innerHTML = blockHTML;
    marketoBlock = document.querySelector('.marketo');
    if (!marketoBlock.parentNode) document.body.appendChild(marketoBlock);
    const iframe = document.createElement('iframe');
    iframe.src = '/index.php/form/XDFrame';
    marketoBlock.appendChild(iframe);
  });

  afterEach(() => {
    sinon.restore();
    clock.restore();
    window.fetch = ogFetch;
    window.mcz_marketoForm_pref = undefined;
  });

  const tick = async (ms) => {
    clock.tick(ms);
    await clock.nextAsync();
  };

  it('shows overlay on timeout', async () => {
    handleIframeTimeout(marketoBlock);
    await tick(5000);

    const overlay = marketoBlock.querySelector('.marketo-overlay');
    const errorMsg = marketoBlock.querySelector('.error');

    expect(overlay).to.exist;
    expect(errorMsg.textContent).to.equal('marketo load error');
    expect(window.mcz_marketoForm_pref.form.status).to.equal('error');
  });

  it('removes overlay when iframe is ready', async () => {
    handleIframeTimeout(marketoBlock);
    await tick(5000);

    expect(marketoBlock.querySelector('.marketo-overlay')).to.exist;

    window.dispatchEvent(new MessageEvent('message', {
      origin: 'https://engage.adobe.com',
      data: JSON.stringify({ mktoReady: true }),
    }));
    await tick(200);

    expect(marketoBlock.querySelector('.marketo-overlay')).to.not.exist;
    expect(window.mcz_marketoForm_pref.form.status).to.equal('ready');
  });

  it('retry with success', async () => {
    handleIframeTimeout(marketoBlock);
    await tick(5000);

    const overlay = marketoBlock.querySelector('.marketo-overlay');
    expect(overlay).to.exist;
    expect(window.mcz_marketoForm_pref.form.status).to.equal('error');
    overlay.querySelector('button').click();

    window.dispatchEvent(new MessageEvent('message', {
      origin: 'https://engage.adobe.com',
      data: JSON.stringify({ mktoReady: true }),
    }));

    await tick(500);
    expect(marketoBlock.querySelector('.marketo-overlay')).to.not.exist;
    expect(window.mcz_marketoForm_pref.form.status).to.equal('ready');
  });

  it('tags the render failure with cookie-8k when cookies are large', async () => {
    sinon.stub(Document.prototype, 'cookie').get(() => 'x'.repeat(9000));
    handleIframeTimeout(marketoBlock);
    await tick(10000);
    expect(window.lana.log.calledWith(
      'Marketo form did not render',
      { tags: 'marketo,render-failed,cookie-8k', severity: 'e', sampleRate: 100 },
    )).to.be.true;
  });

  it('adds the pp-incomplete tag when a program is present and no mktoReady', async () => {
    sinon.stub(Document.prototype, 'cookie').get(() => '');
    window.mcz_marketoForm_pref = { program: { id: '92814' } };
    handleIframeTimeout(marketoBlock);
    await tick(10000);
    expect(window.lana.log.calledWith(
      'Marketo form did not render',
      { tags: 'marketo,render-failed,pp-incomplete', severity: 'e', sampleRate: 100 },
    )).to.be.true;
  });

  it('emits no cookie tag when cookies are small and no program is present', async () => {
    sinon.stub(Document.prototype, 'cookie').get(() => '');
    handleIframeTimeout(marketoBlock);
    await tick(10000);
    expect(window.lana.log.calledWith(
      'Marketo form did not render',
      { tags: 'marketo,render-failed', severity: 'e', sampleRate: 100 },
    )).to.be.true;
  });

  it('buckets cookie size into the 6k band', async () => {
    sinon.stub(Document.prototype, 'cookie').get(() => 'x'.repeat(7000));
    handleIframeTimeout(marketoBlock);
    await tick(10000);
    expect(window.lana.log.calledWith(
      'Marketo form did not render',
      { tags: 'marketo,render-failed,cookie-6k', severity: 'e', sampleRate: 100 },
    )).to.be.true;
  });

  it('buckets cookie size into the 4k band', async () => {
    sinon.stub(Document.prototype, 'cookie').get(() => 'x'.repeat(5000));
    handleIframeTimeout(marketoBlock);
    await tick(10000);
    expect(window.lana.log.calledWith(
      'Marketo form did not render',
      { tags: 'marketo,render-failed,cookie-4k', severity: 'e', sampleRate: 100 },
    )).to.be.true;
  });

  it('appends known-visitor tag when the visitor is known', async () => {
    sinon.stub(Document.prototype, 'cookie').get(() => '');
    window.mcz_marketoForm_pref = { profile: { known_visitor: true } };
    handleIframeTimeout(marketoBlock);
    await tick(10000);
    expect(window.lana.log.calledWith(
      'Marketo form did not render',
      { tags: 'marketo,render-failed,known-visitor', severity: 'e', sampleRate: 100 },
    )).to.be.true;
  });

  it('appends preflang-empty tag when prefLanguage failed to resolve', async () => {
    sinon.stub(Document.prototype, 'cookie').get(() => '');
    window.mcz_marketoForm_pref = { profile: { prefLanguage: '' } };
    handleIframeTimeout(marketoBlock);
    await tick(10000);
    expect(window.lana.log.calledWith(
      'Marketo form did not render',
      { tags: 'marketo,render-failed,preflang-empty', severity: 'e', sampleRate: 100 },
    )).to.be.true;
  });

  it('does not log when the form is visible and mktoReady fired', async () => {
    sinon.stub(Document.prototype, 'cookie').get(() => '');
    marketoBlock.appendChild(document.createElement('form'));
    handleIframeTimeout(marketoBlock);
    window.dispatchEvent(new MessageEvent('message', {
      origin: 'https://engage.adobe.com',
      data: JSON.stringify({ mktoReady: true }),
    }));
    await tick(10000);
    const failed = window.lana.log.getCalls().some((c) => /did not render|handshake failed/.test(c.args[0]));
    expect(failed).to.be.false;
  });

  it('logs a render failure when mktoReady fired but the form stayed hidden', async () => {
    sinon.stub(Document.prototype, 'cookie').get(() => '');
    const form = document.createElement('form');
    form.style.opacity = '0';
    form.style.visibility = 'hidden';
    marketoBlock.appendChild(form);
    handleIframeTimeout(marketoBlock);
    window.dispatchEvent(new MessageEvent('message', {
      origin: 'https://engage.adobe.com',
      data: JSON.stringify({ mktoReady: true }),
    }));
    await tick(10000);
    expect(window.lana.log.calledWith(
      'Marketo form did not render',
      { tags: 'marketo,render-failed', severity: 'e', sampleRate: 100 },
    )).to.be.true;
  });

  it('logs a handshake failure when the form is visible but mktoReady never fired', async () => {
    sinon.stub(Document.prototype, 'cookie').get(() => '');
    marketoBlock.appendChild(document.createElement('form'));
    handleIframeTimeout(marketoBlock);
    await tick(10000);
    expect(window.lana.log.calledWith(
      'Marketo form handshake failed',
      { tags: 'marketo,handshake-failed', severity: 'e', sampleRate: 100 },
    )).to.be.true;
  });

  it('tags a handshake failure with cookie-8k when cookies are large', async () => {
    sinon.stub(Document.prototype, 'cookie').get(() => 'x'.repeat(9000));
    marketoBlock.appendChild(document.createElement('form'));
    handleIframeTimeout(marketoBlock);
    await tick(10000);
    expect(window.lana.log.calledWith(
      'Marketo form handshake failed',
      { tags: 'marketo,handshake-failed,cookie-8k', severity: 'e', sampleRate: 100 },
    )).to.be.true;
  });

  it('logs a failure when the form is present but kept hidden (opacity 0)', async () => {
    sinon.stub(Document.prototype, 'cookie').get(() => '');
    const form = document.createElement('form');
    form.style.opacity = '0';
    form.style.visibility = 'hidden';
    marketoBlock.appendChild(form);
    handleIframeTimeout(marketoBlock);
    await tick(10000);
    const failed = window.lana.log.getCalls().some((c) => /did not render/.test(c.args[0]));
    expect(failed).to.be.true;
  });

  it('logs recovery when mktoReady arrives after a failure was logged', async () => {
    sinon.stub(Document.prototype, 'cookie').get(() => '');
    handleIframeTimeout(marketoBlock);
    await tick(10000);

    window.dispatchEvent(new MessageEvent('message', {
      origin: 'https://engage.adobe.com',
      data: JSON.stringify({ mktoReady: true }),
    }));
    await tick(10);

    expect(window.lana.log.calledWith(
      'Marketo form rendered after timeout',
      { tags: 'marketo,render-recovered', severity: 'i' },
    )).to.be.true;
  });

  it('logs never-ready when whenReady never fires', async () => {
    sinon.stub(Document.prototype, 'cookie').get(() => '');
    watchLoad(marketoBlock);
    await tick(10000);
    expect(window.lana.log.calledWith(
      'Marketo form failed to initialize',
      { tags: 'marketo,never-ready', severity: 'e', sampleRate: 100 },
    )).to.be.true;
  });

  it('does not log never-ready once the form signals ready', async () => {
    sinon.stub(Document.prototype, 'cookie').get(() => '');
    const markReady = watchLoad(marketoBlock);
    markReady();
    await tick(10000);
    const logged = window.lana.log.getCalls().some((c) => /failed to initialize/.test(c.args[0]));
    expect(logged).to.be.false;
  });
});

describe('Marketo submit failure', () => {
  let clock;
  let formEl;

  const fakeForm = () => {
    const cbs = {};
    return {
      onSubmit: (cb) => { cbs.submit = cb; },
      onSuccess: (cb) => { cbs.success = cb; },
      fireSubmit: () => cbs.submit?.(),
      fireSuccess: () => cbs.success?.(),
    };
  };

  beforeEach(() => {
    clock = sinon.useFakeTimers();
    window.lana = { log: sinon.spy() };
    setConfig(config);
    document.body.innerHTML = blockHTML;
    formEl = document.createElement('form');
    document.querySelector('.marketo').appendChild(formEl);
  });

  afterEach(() => {
    clock.restore();
    sinon.restore();
    window.mcz_marketoForm_pref = undefined;
    delete window.mkto_isTestRecord;
  });

  it('logs submit failure via the backstop when nothing resolves', () => {
    sinon.stub(Document.prototype, 'cookie').get(() => '');
    const form = fakeForm();
    watchSubmit(form, formEl, {});
    form.fireSubmit();
    clock.tick(10000);
    expect(window.lana.log.calledWith(
      'Marketo form submit failed',
      { tags: 'marketo,submit-failed', severity: 'e', sampleRate: 100 },
    )).to.be.true;
  });

  it('logs submit failure immediately when the error message appears', async () => {
    sinon.stub(Document.prototype, 'cookie').get(() => '');
    const form = fakeForm();
    watchSubmit(form, formEl, {});
    form.fireSubmit();
    const err = document.createElement('div');
    err.className = 'mktoErrorMsg';
    err.textContent = 'Submission failed, please try again later.';
    formEl.appendChild(err);
    await clock.tickAsync(0);
    expect(window.lana.log.calledWith(
      'Marketo form submit failed',
      { tags: 'marketo,submit-failed', severity: 'e', sampleRate: 100 },
    )).to.be.true;
  });

  it('does not log when the submit succeeds', () => {
    sinon.stub(Document.prototype, 'cookie').get(() => '');
    const form = fakeForm();
    watchSubmit(form, formEl, {});
    form.fireSubmit();
    form.fireSuccess();
    clock.tick(10000);
    expect(window.lana.log.calledWith('Marketo form submit failed')).to.be.false;
  });

  it('skips test records', () => {
    window.mkto_isTestRecord = () => 'test_no_submit';
    const form = fakeForm();
    watchSubmit(form, formEl, {});
    form.fireSubmit();
    clock.tick(10000);
    expect(window.lana.log.calledWith('Marketo form submit failed')).to.be.false;
  });

  it('tags the submit failure with cookie-8k when cookies are large', () => {
    sinon.stub(Document.prototype, 'cookie').get(() => 'x'.repeat(9000));
    const form = fakeForm();
    watchSubmit(form, formEl, {});
    form.fireSubmit();
    clock.tick(10000);
    expect(window.lana.log.calledWith(
      'Marketo form submit failed',
      { tags: 'marketo,submit-failed,cookie-8k', severity: 'e', sampleRate: 100 },
    )).to.be.true;
  });
});

describe('Marketo formSuccess IMS', () => {
  let formEl;
  let marketoEl;

  const addMeta = (name, content) => {
    const meta = document.createElement('meta');
    meta.name = name;
    meta.content = content;
    document.head.appendChild(meta);
  };

  const addEmailInput = (value = 'test@adobe.com') => {
    const input = document.createElement('input');
    input.name = 'Email';
    input.value = value;
    formEl.appendChild(input);
  };

  beforeEach(() => {
    window.lana = { log: sinon.spy() };
    document.body.innerHTML = blockHTML;
    marketoEl = document.querySelector('.marketo');
    formEl = document.createElement('form');
    marketoEl.appendChild(formEl);
  });

  afterEach(() => {
    sinon.restore();
    document.head.querySelector('meta[name="marketo-ims"]')?.remove();
    document.head.querySelector('meta[name="marketo-ims-redirect"]')?.remove();
  });

  const imsFormData = { 'form.success.type': 'ims' };

  it('logs warning and returns false when redirect URL is not fully qualified', () => {
    addMeta('marketo-ims-redirect', 'adobe.com/welcome');
    const result = formSuccess(formEl, imsFormData);
    expect(window.lana.log.calledWith(
      'Marketo IMS failure, full url needed for redirect',
      { tags: 'marketo', severity: 'i' },
    )).to.be.true;
    expect(result).to.be.false;
  });

  it('logs error and returns false when marketo-ims param is missing', () => {
    addMeta('marketo-ims-redirect', 'https://adobe.com/welcome');
    addEmailInput();
    const result = formSuccess(formEl, imsFormData);
    expect(window.lana.log.calledWith(
      'Marketo IMS failure, missing data',
      { tags: 'marketo', severity: 'e' },
    )).to.be.true;
    expect(result).to.be.false;
  });

  it('logs error and returns false when email input is missing', () => {
    addMeta('marketo-ims-redirect', 'https://adobe.com/welcome');
    addMeta('marketo-ims', 'ims_na1');
    const result = formSuccess(formEl, imsFormData);
    expect(window.lana.log.calledWith(
      'Marketo IMS failure, missing data',
      { tags: 'marketo', severity: 'e' },
    )).to.be.true;
    expect(result).to.be.false;
  });
});
