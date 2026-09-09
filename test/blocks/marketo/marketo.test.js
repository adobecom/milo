import sinon from 'sinon';
import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { setConfig, getConfig, MILO_EVENTS } from '../../../libs/utils/utils.js';
import init, {
  setDataLayer,
  setDataLayerObj,
  getDataLayer,
  decorateURL,
  formSuccess,
  formSubmit,
  formValidate,
  loadMarketo,
  logFailure,
  formTimeout,
  LANA_MESSAGE,
  UNGATED_PARAM,
  FORM_ID_PARAM,
  NAMED_FORM_IDS,
  getMarketoLibsBase,
  loadDaMarketoBlock,
} from '../../../libs/blocks/marketo/marketo.js';
import { waitForElement } from '../../helpers/waitfor.js';

const FAILURE_TIMEOUT = 10000;

const blockHTML = await readFile({ path: './mocks/block.html' });
const onePage = await readFile({ path: './mocks/one-page-experience.html' });
const config = {
  codeRoot: '/test/blocks/marketo/mocks',
  placeholders: { 'marketo-load-error': 'marketo load error', 'marketo-try-again': 'try again' },
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

    setDataLayerObj(formData);

    expect(window.mcz_marketoForm_pref).to.have.property('first');
    expect(window.mcz_marketoForm_pref.first).to.have.property('key');
    expect(window.mcz_marketoForm_pref.first.key).to.equal('value1');
    expect(window.mcz_marketoForm_pref).to.have.property('second');
    expect(window.mcz_marketoForm_pref.second).to.have.property('key');
    expect(window.mcz_marketoForm_pref.second.key).to.equal('value2');
  });

  it('gets a nested value from the data layer', () => {
    setDataLayer('form.status', 'ready');
    expect(getDataLayer('form.status')).to.equal('ready');
  });

  it('returns undefined for a key that has not been set', () => {
    expect(getDataLayer('form.status')).to.be.undefined;
    expect(getDataLayer('nothing.here')).to.be.undefined;
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
    url.searchParams.set(UNGATED_PARAM, 'off');
    window.history.pushState({}, '', url);
    document.body.innerHTML = onePage;
    clock = sinon.useFakeTimers();
  });

  afterEach(() => {
    url.searchParams.delete(UNGATED_PARAM);
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

describe('Marketo failure logging', () => {
  let clock;
  let el;

  const formData = {
    'form id': '1723',
    'marketo host': 'engage.adobe.com',
    'marketo munckin': '360-KCI-804',
  };

  const buildBlock = ({ visibleForm = true } = {}) => {
    el = document.createElement('div');
    el.className = 'marketo';
    const form = document.createElement('form');
    if (!visibleForm) form.style.visibility = 'hidden';
    el.appendChild(form);
    document.body.appendChild(el);
    return el;
  };

  const tick = async (ms) => {
    clock.tick(ms);
    await clock.nextAsync();
  };

  beforeEach(() => {
    clock = sinon.useFakeTimers();
    window.lana = { log: sinon.spy() };
    setConfig(config);
    document.body.innerHTML = '';
  });

  afterEach(() => {
    clock.restore();
    sinon.restore();
    window.mcz_marketoForm_pref = undefined;
    document.body.innerHTML = '';
  });

  describe('logFailure', () => {
    it('logs once, sets error status, and shows an overlay', async () => {
      buildBlock();
      logFailure(el, LANA_MESSAGE.RENDER_FAILED);

      expect(window.lana.log.calledOnce).to.be.true;
      expect(window.lana.log.firstCall.args[0]).to.equal(LANA_MESSAGE.RENDER_FAILED);
      expect(window.lana.log.firstCall.args[1]).to.include({ severity: 'e', sampleRate: 100 });
      expect(window.mcz_marketoForm_pref.form.status).to.equal('init');
      expect(el.dataset.mktoFailed).to.equal('true');
      expect(await waitForElement('.marketo-overlay', { rootEl: el })).to.exist;
    });

    it('does not log or duplicate the overlay on a repeat failure', async () => {
      buildBlock();
      logFailure(el, LANA_MESSAGE.RENDER_FAILED);
      await waitForElement('.marketo-overlay', { rootEl: el });
      logFailure(el, LANA_MESSAGE.HANDSHAKE_FAILED);

      expect(window.lana.log.calledOnce).to.be.true;
      expect(el.querySelectorAll('.marketo-overlay').length).to.equal(1);
    });
  });

  describe('formTimeout', () => {
    it('logs the failure when the condition is still true after the timeout', async () => {
      buildBlock();
      formTimeout(el, () => true, LANA_MESSAGE.RENDER_FAILED);
      await tick(FAILURE_TIMEOUT);

      expect(window.lana.log.calledOnceWith(LANA_MESSAGE.RENDER_FAILED)).to.be.true;
    });

    it('does not log when the condition resolves before the timeout', async () => {
      buildBlock();
      formTimeout(el, () => false, LANA_MESSAGE.RENDER_FAILED);
      await tick(FAILURE_TIMEOUT);

      expect(window.lana.log.called).to.be.false;
    });
  });

  describe('loadMarketo', () => {
    it('logs handshake failure when the iframe never signals ready', async () => {
      buildBlock();
      await loadMarketo(el, formData);
      await tick(FAILURE_TIMEOUT);

      expect(window.lana.log.calledWith(
        LANA_MESSAGE.HANDSHAKE_FAILED,
        sinon.match({ severity: 'e', sampleRate: 100 }),
      )).to.be.true;
      expect(window.mcz_marketoForm_pref.form.status).to.equal('loaded');
      expect(el.dataset.mktoFailed).to.equal('true');
      expect(await waitForElement('.marketo-overlay', { rootEl: el })).to.exist;
    });

    it('logs recovery and removes the overlay when the iframe signals ready after a failure', async () => {
      buildBlock();
      await loadMarketo(el, formData);
      await tick(FAILURE_TIMEOUT);
      expect(await waitForElement('.marketo-overlay', { rootEl: el })).to.exist;

      window.dispatchEvent(new MessageEvent('message', {
        origin: 'https://engage.adobe.com',
        data: JSON.stringify({ mktoReady: true }),
      }));

      expect(window.lana.log.calledWith(
        LANA_MESSAGE.RENDER_RECOVERED,
        sinon.match({ severity: 'i', sampleRate: 100 }),
      )).to.be.true;
      expect(window.mcz_marketoForm_pref.form.xdframe).to.equal('ready');
      expect(el.querySelector('.marketo-overlay')).to.not.exist;
    });

    it('logs render failure when the form never becomes visible', async () => {
      buildBlock({ visibleForm: false });
      window.MktoForms2 = {
        getFormElem: () => ({ get: () => el.querySelector('form') }),
        onValidate: () => {},
        onSubmit: () => {},
        onSuccess: () => {},
        loadForm: (host, munchkin, formID, callback) => callback?.(),
        whenReady: () => {},
      };
      await loadMarketo(el, formData);
      await tick(FAILURE_TIMEOUT);

      expect(window.lana.log.calledWith(
        LANA_MESSAGE.RENDER_FAILED,
        sinon.match({ severity: 'e' }),
      )).to.be.true;
    });

    it('logs a forms2 load failure and hides the block when the script fails to load', async () => {
      buildBlock();
      setConfig({ ...config, codeRoot: '/test/blocks/marketo/mocks/missing' });
      await loadMarketo(el, formData);

      expect(el.style.display).to.equal('none');
      expect(window.lana.log.calledWith(
        LANA_MESSAGE.MARKETO_FORMS_JS,
        sinon.match({ severity: 'e' }),
      )).to.be.true;
    });
  });

  describe('formSubmit', () => {
    it('logs submit failure when the form is not marked success in time', async () => {
      buildBlock();
      formSubmit(el.querySelector('form'));
      await tick(FAILURE_TIMEOUT);

      expect(window.lana.log.calledWith(
        LANA_MESSAGE.SUBMIT_FAILED,
        sinon.match({ severity: 'e' }),
      )).to.be.true;
    });

    it('does not log submit failure once the form is marked success', async () => {
      buildBlock();
      el.classList.add('success');
      formSubmit(el.querySelector('form'));
      await tick(FAILURE_TIMEOUT);

      expect(window.lana.log.called).to.be.false;
    });

    it('cancels the pending submit-failure timeout once formSuccess runs', async () => {
      buildBlock();
      const formEl = el.querySelector('form');
      formSubmit(formEl);
      formSuccess(formEl, {});
      await tick(FAILURE_TIMEOUT);

      expect(window.lana.log.calledWith(LANA_MESSAGE.SUBMIT_FAILED)).to.be.false;
    });
  });

  describe('formValidate', () => {
    it('logs a warning when a hidden field is marked required', () => {
      buildBlock();
      const formEl = el.querySelector('form');
      const hiddenField = document.createElement('div');
      hiddenField.className = 'mktoHidden';
      hiddenField.innerHTML = '<input class="mktoRequired">';
      formEl.appendChild(hiddenField);

      formValidate(formEl);

      expect(window.lana.log.calledWith(
        LANA_MESSAGE.HIDDEN_REQUIRED_FIELD,
        sinon.match({ severity: 'w', sampleRate: 100 }),
      )).to.be.true;
    });

    it('does not log when no hidden fields are marked required', () => {
      buildBlock();
      const formEl = el.querySelector('form');

      formValidate(formEl);

      expect(window.lana.log.called).to.be.false;
    });
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

describe('Marketo form id param', () => {
  let url;

  const setParam = (value) => {
    url = new URL(window.location);
    if (value === undefined) {
      url.searchParams.delete(FORM_ID_PARAM);
    } else {
      url.searchParams.set(FORM_ID_PARAM, value);
    }
    window.history.pushState({}, '', url);
  };

  const formEl = () => document.querySelector('.marketo form');

  beforeEach(() => {
    window.lana = { log: sinon.spy() };
    document.body.innerHTML = blockHTML;
  });

  afterEach(() => {
    sinon.restore();
    setParam(undefined);
    setConfig(config);
  });

  describe('non-prod', () => {
    beforeEach(() => setConfig({ ...config, env: { name: 'stage' } }));

    it('uses the configured form id when no param is present', async () => {
      await init(document.querySelector('.marketo'));
      expect(formEl().id).to.equal('mktoForm_1723');
    });

    it('resolves a named alias to its form id', async () => {
      setParam('prod');
      await init(document.querySelector('.marketo'));
      expect(formEl().id).to.equal(`mktoForm_${NAMED_FORM_IDS.prod}`);
    });

    it('accepts a raw 4-digit form id', async () => {
      setParam('9999');
      await init(document.querySelector('.marketo'));
      expect(formEl().id).to.equal('mktoForm_9999');
    });

    it('ignores an id that is not exactly 4 digits', async () => {
      setParam('123');
      await init(document.querySelector('.marketo'));
      expect(formEl().id).to.equal('mktoForm_1723');
    });

    it('ignores a non-numeric value', async () => {
      setParam('abcd');
      await init(document.querySelector('.marketo'));
      expect(formEl().id).to.equal('mktoForm_1723');
    });
  });

  describe('prod', () => {
    beforeEach(() => setConfig({ ...config, env: { name: 'prod' } }));

    it('allows a named alias', async () => {
      setParam('prod');
      await init(document.querySelector('.marketo'));
      expect(formEl().id).to.equal(`mktoForm_${NAMED_FORM_IDS.prod}`);
    });

    it('allows a raw id that matches a named form id', async () => {
      setParam(NAMED_FORM_IDS.prod);
      await init(document.querySelector('.marketo'));
      expect(formEl().id).to.equal(`mktoForm_${NAMED_FORM_IDS.prod}`);
    });

    it('blocks a raw id that is not an allow-listed named form id', async () => {
      setParam('9999');
      await init(document.querySelector('.marketo'));
      expect(formEl().id).to.equal('mktoForm_1723');
    });
  });
});

describe('da-marketo libs', () => {
  const plainEl = () => document.createElement('div');
  // default to a dev host so branch resolution falls through to the CDN URLs;
  // pass a production host explicitly to exercise the /mkto DNS route.
  const loc = (search, hostname = 'main--milo--adobecom.aem.live') => ({ search, hostname });
  const noMeta = () => '';

  beforeEach(() => {
    window.lana = { log: sinon.spy() };
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('getMarketoLibsBase', () => {
    it('returns null when there is no trigger', () => {
      expect(getMarketoLibsBase(plainEl(), loc(''), noMeta)).to.be.null;
    });

    it('resolves ?marketolibs=main to the da-marketo production mkto base', () => {
      expect(getMarketoLibsBase(plainEl(), loc('?marketolibs=main'), noMeta))
        .to.equal('https://main--da-marketo--adobecom.aem.live/mkto');
    });

    it('treats a bare ?marketolibs as main', () => {
      expect(getMarketoLibsBase(plainEl(), loc('?marketolibs'), noMeta))
        .to.equal('https://main--da-marketo--adobecom.aem.live/mkto');
    });

    it('treats ?marketolibs=true as a literal branch', () => {
      expect(getMarketoLibsBase(plainEl(), loc('?marketolibs=true'), noMeta))
        .to.equal('https://true--da-marketo--adobecom.aem.live/mkto');
    });

    it('resolves a named branch to a da-marketo branch mkto base', () => {
      expect(getMarketoLibsBase(plainEl(), loc('?marketolibs=stage'), noMeta))
        .to.equal('https://stage--da-marketo--adobecom.aem.live/mkto');
    });

    it('resolves any marketo-libs metadata value to main', () => {
      expect(getMarketoLibsBase(plainEl(), loc(''), () => 'stage'))
        .to.equal('https://main--da-marketo--adobecom.aem.live/mkto');
    });

    it('resolves the da-marketo block class to main', () => {
      const el = plainEl();
      el.classList.add('da-marketo');
      expect(getMarketoLibsBase(el, loc(''), noMeta))
        .to.equal('https://main--da-marketo--adobecom.aem.live/mkto');
    });

    it('gives the query param precedence over metadata and class', () => {
      const el = plainEl();
      el.classList.add('da-marketo');
      expect(getMarketoLibsBase(el, loc('?marketolibs=parambranch'), () => 'metabranch'))
        .to.equal('https://parambranch--da-marketo--adobecom.aem.live/mkto');
    });

    it('resolves metadata to main even when a da-marketo class is present', () => {
      const el = plainEl();
      el.classList.add('da-marketo');
      expect(getMarketoLibsBase(el, loc(''), () => 'metabranch'))
        .to.equal('https://main--da-marketo--adobecom.aem.live/mkto');
    });

    it('resolves a fork branch containing -- to an aem.live mkto base', () => {
      expect(getMarketoLibsBase(plainEl(), loc('?marketolibs=feature--da-marketo--adobecom'), noMeta))
        .to.equal('https://feature--da-marketo--adobecom.aem.live/mkto');
    });

    it('resolves local to the da-marketo local mkto base', () => {
      expect(getMarketoLibsBase(plainEl(), loc('?marketolibs=local'), noMeta))
        .to.equal('http://localhost:6586/mkto');
    });

    it('throws on an invalid branch name', () => {
      expect(() => getMarketoLibsBase(plainEl(), loc('?marketolibs=bad!name'), noMeta))
        .to.throw(/Invalid marketolibs branch name/);
    });

    it('resolves to /mkto on a production adobe.com host when triggered', () => {
      expect(getMarketoLibsBase(plainEl(), loc('?marketolibs=main', 'business.adobe.com'), noMeta))
        .to.equal('/mkto');
    });

    it('returns null on a production host when there is no trigger', () => {
      expect(getMarketoLibsBase(plainEl(), loc('', 'www.adobe.com'), noMeta)).to.be.null;
    });
  });

  describe('loadDaMarketoBlock', () => {
    const MOCK_BASE = '/test/blocks/marketo/mocks/da-marketo/mkto';

    afterEach(() => {
      document.head.querySelectorAll(`link[href^="${MOCK_BASE}"]`).forEach((l) => l.remove());
    });

    it('runs da-marketo\'s da-marketo block, loads its css, and returns true', async () => {
      const el = plainEl();
      el.className = 'marketo da-marketo';
      const result = await loadDaMarketoBlock(el, MOCK_BASE);
      expect(result).to.be.true;
      expect(el.dataset.daMarketoRan).to.equal('true');
      expect(document.head.querySelector(`link[href="${MOCK_BASE}/blocks/da-marketo/da-marketo.css"]`)).to.exist;
    });

    it('returns false and warns when the da-marketo block cannot load', async () => {
      const el = plainEl();
      const result = await loadDaMarketoBlock(el, '/test/blocks/marketo/mocks/does-not-exist/mkto');
      expect(result).to.be.false;
      expect(window.lana.log.calledOnce).to.be.true;
      expect(window.lana.log.firstCall.args[1]).to.include({ severity: 'w' });
    });
  });

  describe('init delegation', () => {
    beforeEach(() => {
      setConfig(config);
      document.body.innerHTML = '';
    });

    it('does not delegate to da-marketo when there is no trigger', async () => {
      document.body.innerHTML = blockHTML;
      const el = document.querySelector('.marketo');
      await init(el);
      expect(el.dataset.daMarketoRan).to.be.undefined;
    });
  });
});
