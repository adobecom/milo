import sinon from 'sinon';
import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { setConfig, MILO_EVENTS } from '../../../libs/utils/utils.js';
import init, { setPreferences, decorateURL, FORM_PARAM, handleIframeTimeout } from '../../../libs/blocks/marketo/marketo.js';

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

    init(el);
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
  it('decorates absolute URL with local base URL', () => {
    const baseURL = new URL('http://localhost:6456/marketo-block');
    const result = decorateURL('https://main--milo--adobecom.hlx.page/marketo-block/thank-you', baseURL);
    expect(result).to.equal('http://localhost:6456/marketo-block/thank-you');
  });

  it('decorates relative URL with absolute base URL', () => {
    const baseURL = new URL('https://main--milo--adobecom.hlx.page/marketo-block');
    const result = decorateURL('/marketo-block/thank-you', baseURL);
    expect(result).to.equal('https://main--milo--adobecom.hlx.page/marketo-block/thank-you');
  });

  it('decorates absolute URL with matching base URL', () => {
    const baseURL = new URL('https://main--milo--adobecom.hlx.page/marketo-block');
    const result = decorateURL('https://main--milo--adobecom.hlx.page/marketo-block/thank-you', baseURL);
    expect(result).to.equal('https://main--milo--adobecom.hlx.page/marketo-block/thank-you');
  });

  it('decorates absolute URL with .html base URL', () => {
    const baseURL = new URL('https://business.adobe.com/marketo-block.html');
    const result = decorateURL('https://main--milo--adobecom.hlx.page/marketo-block/thank-you', baseURL);
    expect(result).to.equal('https://business.adobe.com/marketo-block/thank-you.html');
  });

  it('keeps identical absolute URL with .html base URL', () => {
    const baseURL = new URL('https://business.adobe.com/marketo-block.html');
    const result = decorateURL('https://business.adobe.com/marketo-block/thank-you.html', baseURL);
    expect(result).to.equal('https://business.adobe.com/marketo-block/thank-you.html');
  });

  it('returns null when provided a malformed URL', () => {
    const baseURL = new URL('https://business.adobe.com/marketo-block.html');
    const result = decorateURL('tps://business', baseURL);
    expect(result).to.be.null;
  });

  it('Does not add .html to ending slash', () => {
    const baseURL = new URL('https://business.adobe.com/marketo-block.html');
    const result = decorateURL('https://business.adobe.com/', baseURL);
    expect(result).to.equal('https://business.adobe.com/');
  });

  it('localizes URL with .html base URL', () => {
    setConfig({
      pathname: '/uk/marketo-block.html',
      locales: {
        '': {},
        uk: {},
      },
    });
    const baseURL = new URL('https://business.adobe.com/uk/marketo-block.html');
    const result = decorateURL('/marketo-block/thank-you', baseURL);
    expect(result).to.equal('https://business.adobe.com/uk/marketo-block/thank-you.html');
  });

  it('Does not decorate non-url text', () => {
    const baseURL = new URL('https://business.adobe.com/marketo-block.html');
    const result = decorateURL('Thank you for submitting the form', baseURL);
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
});
