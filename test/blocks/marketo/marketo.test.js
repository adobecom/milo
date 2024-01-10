import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { delay } from '../../helpers/waitfor.js';
import init, { setPreferences, decorateURL } from '../../../libs/blocks/marketo/marketo.js';

const innerHTML = await readFile({ path: './mocks/body.html' });

describe('marketo', () => {
  beforeEach(() => {
    document.body.innerHTML = innerHTML;
  });

  afterEach(() => {
    window.mcz_marketoForm_pref = undefined;
  });

  it('hides form if no data url', async () => {
    document.body.innerHTML = innerHTML;
    const el = document.querySelector('.marketo');
    el.querySelector('a').remove();

    init(el);
    await delay(10);
    expect(el.style.display).to.equal('none');
  });

  it('sets preferences on the data layer', async () => {
    const formData = {
      'first.key': 'value1',
      'second.key': 'value2',
    };

    setPreferences(formData);

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
    expect(result.href).to.equal('http://localhost:6456/marketo-block/thank-you');
  });

  it('decorates relative URL with absolute base URL', () => {
    const baseURL = new URL('https://main--milo--adobecom.hlx.page/marketo-block');
    const result = decorateURL('/marketo-block/thank-you', baseURL);
    expect(result.href).to.equal('https://main--milo--adobecom.hlx.page/marketo-block/thank-you');
  });

  it('decorates absolute URL with matching base URL', () => {
    const baseURL = new URL('https://main--milo--adobecom.hlx.page/marketo-block');
    const result = decorateURL('https://main--milo--adobecom.hlx.page/marketo-block/thank-you', baseURL);
    expect(result.href).to.equal('https://main--milo--adobecom.hlx.page/marketo-block/thank-you');
  });

  it('decorates absolute URL with .html base URL', () => {
    const baseURL = new URL('https://business.adobe.com/marketo-block.html');
    const result = decorateURL('https://main--milo--adobecom.hlx.page/marketo-block/thank-you', baseURL);
    expect(result.href).to.equal('https://business.adobe.com/marketo-block/thank-you.html');
  });

  it('keeps identical absolute URL with .html base URL', () => {
    const baseURL = new URL('https://business.adobe.com/marketo-block.html');
    const result = decorateURL('https://business.adobe.com/marketo-block/thank-you.html', baseURL);
    expect(result.href).to.equal('https://business.adobe.com/marketo-block/thank-you.html');
  });

  it('returns null when provided a malformed URL', () => {
    const baseURL = new URL('https://business.adobe.com/marketo-block.html');
    const result = decorateURL('tps://business', baseURL);
    expect(result).to.be.null;
  });

  it('Does not add .html to ending slash', () => {
    const baseURL = new URL('https://business.adobe.com/marketo-block.html');
    const result = decorateURL('https://business.adobe.com/', baseURL);
    expect(result.href).to.equal('https://business.adobe.com/');
  });
});
