import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { stub } from 'sinon';
import { delay, waitForElement } from '../../helpers/waitfor.js';
import init, { getDefaultStates, cleanPanelData, getConfigOptions } from '../../../libs/blocks/marketo-config/marketo-config.js';
import { sanitizeConfigValue, sanitizeHashConfig, loadStateFromLocalStorage } from '../../../libs/blocks/marketo-config/context.js';
import { setConfig } from '../../../libs/utils/utils.js';

const innerHTML = await readFile({ path: './mocks/body.html' });
const options = JSON.parse(await readFile({ path: './mocks/options.json' }));
const config = { codeRoot: '/libs' };
const ogFetch = window.fetch;

setConfig(config);

// Renders a sanitized string the way the marketo sink does (insertAdjacentHTML)
// so tests can assert whether a live/executable element actually reaches the DOM.
const renderToDom = (htmlString) => {
  const div = document.createElement('div');
  div.insertAdjacentHTML('beforeend', htmlString ?? '');
  return div;
};

describe('marketo-config', () => {
  beforeEach(() => {
    document.body.innerHTML = innerHTML;
    localStorage.clear();
  });

  afterEach(() => {
    window.fetch = ogFetch;
  });

  it('cleans panel data correctly', () => {
    const data = [
      { prop: 'PROP1', required: 'YES' },
      { prop: 'PROP2', required: 'no' },
    ];
    const cleanedData = cleanPanelData(data);

    expect(cleanedData).to.deep.equal([
      { prop: 'prop1', required: 'yes' },
      { prop: 'prop2', required: 'no' },
    ]);
  });

  it('gets config options correctly', () => {
    const configOptions = getConfigOptions(options);
    expect(configOptions['Sheet 1'][0].prop).to.exist;
  });

  it('retrieves default states correctly', () => {
    const panelsData = getConfigOptions(options);
    const defaults = getDefaultStates(panelsData);

    expect(defaults).to.deep.equal({
      prop1: 'option1', prop2: '', prop3: '', prop4: '', prop5: 'option1', prop6: '', prop7: 'option1', prop8: 'option1',
    });
  });

  it('shows error message', async () => {
    const el = document.querySelector('.marketo-config');
    window.fetch = stub().returns(
      new Promise((resolve) => {
        resolve({
          ok: false,
          status: 500,
        });
      }),
    );
    await init(el);
    await delay(50);

    const content = await waitForElement('.error', { rootEl: el });
    expect(content.textContent).to.contain('Error');
  });

  it('renders correctly', async () => {
    const el = document.querySelector('.marketo-config');
    await init(el);

    const title = await waitForElement('.tool-title');
    expect(title.textContent).to.contain('Marketo Test Configurator');

    const accordion = await waitForElement('.accordion');
    expect(accordion).to.exist;

    const marketo = await waitForElement('iframe');
    expect(marketo).to.exist;
  });

  it('updates state and local storage', async () => {
    let lsState = {};
    const el = document.querySelector('.marketo-config');
    await init(el);

    const accordion = await waitForElement('.accordion');
    const select = accordion.querySelector('select');

    select.value = 'option2';
    select.dispatchEvent(new window.Event('change'));
    await delay(50);

    lsState = JSON.parse(localStorage.getItem('marketo-test-ConfiguratorState'));
    expect(lsState).to.deep.equal({
      prop1: 'option2', prop2: '', prop3: '', prop4: '', prop5: 'option1', prop6: '', prop7: 'option1', prop8: 'option1',
    });

    const input = accordion.querySelector('input');

    input.value = 'input';
    input.dispatchEvent(new window.Event('change'));
    await delay(50);

    lsState = JSON.parse(localStorage.getItem('marketo-test-ConfiguratorState'));

    expect(lsState).to.deep.equal({
      prop1: 'option2', prop2: '', prop3: 'input', prop4: '', prop5: 'option1', prop6: '', prop7: 'option1', prop8: 'option1',
    });
  });

  it('validate config and copy', async () => {
    const el = document.querySelector('.marketo-config');
    await init(el);
    const accordion = await waitForElement('.accordion');
    const copyBtn = await waitForElement('.copy-button');
    const select = accordion.querySelector('select#prop2');
    const input = accordion.querySelector('input#prop3');

    select.value = 'option2';
    select.dispatchEvent(new window.Event('change'));
    await delay(50);

    const copyButton = copyBtn.querySelector('.copy-config');
    copyButton.click();
    await delay(50);

    const message = copyBtn.querySelector('.message');
    expect(message.textContent).to.contain('Required fields must be filled');

    input.value = 'input';
    input.dispatchEvent(new window.Event('change'));
    await delay(50);

    copyButton.click();
    await delay(50);

    const copyContent = copyBtn.querySelector('.copy-content');
    expect(copyContent.textContent).to.contain('http');
  });

  describe('sanitizeConfigValue (XSS prevention)', () => {
    it('strips the onerror handler from an img payload (the reported attack vector)', () => {
      const result = sanitizeConfigValue('"><img onerror=1>');
      expect(result).to.not.include('onerror');
      expect(renderToDom(result).querySelectorAll('[onerror]').length).to.equal(0);
    });

    it('neutralizes the entity-encoded bypass (VULN-36919) so no live element renders', () => {
      // The prior fix decoded entities via .textContent, turning this inert
      // string back into live "<img ... onerror>" markup. Allowlist sanitization
      // must re-encode it so insertAdjacentHTML never builds an element.
      const result = sanitizeConfigValue('&lt;img onerror=1&gt;');
      expect(renderToDom(result).querySelectorAll('img').length).to.equal(0);
      // The payload stays entity-escaped (inert text), never decoded to markup.
      expect(result).to.include('&lt;');
    });

    it('removes script elements', () => {
      const result = sanitizeConfigValue('<script>alert(1)</script>');
      expect(renderToDom(result).querySelectorAll('script').length).to.equal(0);
    });

    it('strips the onload handler from an svg payload', () => {
      const result = sanitizeConfigValue('<svg onload=1>');
      expect(result).to.not.include('onload');
      expect(renderToDom(result).querySelectorAll('[onload]').length).to.equal(0);
    });

    it('preserves safe inline HTML (does not blanket-escape legitimate markup)', () => {
      expect(sanitizeConfigValue('<b>Free</b> trial')).to.equal('<b>Free</b> trial');
    });

    it('preserves plain text values unchanged', () => {
      expect(sanitizeConfigValue('Request a Demo')).to.equal('Request a Demo');
      expect(sanitizeConfigValue('https://example.com/thank-you')).to.equal('https://example.com/thank-you');
      expect(sanitizeConfigValue('')).to.equal('');
    });

    it('passes through non-string values unchanged', () => {
      expect(sanitizeConfigValue(42)).to.equal(42);
      expect(sanitizeConfigValue(null)).to.equal(null);
      expect(sanitizeConfigValue(undefined)).to.equal(undefined);
    });
  });

  describe('sanitizeHashConfig (XSS prevention)', () => {
    it('neutralizes HTML injection in cta.override and success.content (the reported attack)', () => {
      const maliciousConfig = {
        'form.cta.override': '"><img onerror=1>',
        'form.success.content': '<svg onload=1>',
        'form.template': 'flex_contact',
      };
      const result = sanitizeHashConfig(maliciousConfig);
      expect(result['form.cta.override']).to.not.include('onerror');
      expect(renderToDom(result['form.cta.override']).querySelectorAll('[onerror]').length).to.equal(0);
      expect(result['form.success.content']).to.not.include('onload');
      expect(renderToDom(result['form.success.content']).querySelectorAll('[onload]').length).to.equal(0);
      expect(result['form.template']).to.equal('flex_contact');
    });

    it('returns null/undefined config unchanged', () => {
      expect(sanitizeHashConfig(null)).to.equal(null);
      expect(sanitizeHashConfig(undefined)).to.equal(undefined);
    });
  });

  describe('loadStateFromLocalStorage (XSS prevention on the load path)', () => {
    it('sanitizes a raw payload injected directly into localStorage', () => {
      const lsKey = 'load-path-raw';
      localStorage.setItem(lsKey, JSON.stringify({
        'form.cta.override': '<img onerror=1>',
        'form id': '1723',
      }));
      const state = loadStateFromLocalStorage(lsKey);
      expect(renderToDom(state['form.cta.override']).querySelectorAll('[onerror]').length).to.equal(0);
      expect(state['form id']).to.equal('1723');
    });

    it('stays inert across a save/reload cycle, including the entity-encoded bypass (re-render)', () => {
      const lsKey = 'load-path-rerender';
      const sanitized = sanitizeConfigValue('&lt;img onerror=1&gt;');
      localStorage.setItem(lsKey, JSON.stringify({ title: sanitized }));
      const reloaded = loadStateFromLocalStorage(lsKey);
      expect(renderToDom(reloaded.title).querySelectorAll('img').length).to.equal(0);
    });

    it('returns null when there is no stored state', () => {
      expect(loadStateFromLocalStorage('does-not-exist')).to.be.null;
    });
  });

  it('resets to default state', async () => {
    const el = document.querySelector('.marketo-config');
    await init(el);

    const accordion = await waitForElement('.accordion');

    const resetButton = accordion.querySelector('.resetToDefaultState');
    resetButton.click();

    await delay(50);

    const lsState = JSON.parse(localStorage.getItem('marketo-test-ConfiguratorState'));

    const panelsData = getConfigOptions(options);
    const defaults = getDefaultStates(panelsData);
    expect(lsState).to.deep.equal(defaults);
  });
});
