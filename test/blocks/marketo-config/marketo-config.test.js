import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { restore, stub } from 'sinon';
import { delay, waitFor, waitForElement } from '../../helpers/waitfor.js';
import init, { getDefaultStates, cleanPanelData, getConfigOptions } from '../../../libs/blocks/marketo-config/marketo-config.js';
import { sanitizeConfigValue, sanitizeHashConfig, loadStateFromLocalStorage, ConfiguratorProvider } from '../../../libs/blocks/marketo-config/context.js';
import { html, render } from '../../../libs/deps/htm-preact.js';
import FieldsPanel from '../../../libs/blocks/marketo-config/fields-panel.js';
import { createFieldMap, getTemplateRules, STEP_PREF } from '../../../libs/blocks/marketo-config/field-map.js';
import { parseEncodedConfig, setConfig } from '../../../libs/utils/utils.js';

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

  describe('multi-step fields', () => {
    const preferences = [
      { prop: 'form.template', label: 'Template', options: 'demo:Demo', default: 'demo' },
      {
        prop: 'field_visibility.name',
        label: 'Name',
        stepname: 'firstName',
        linkedstepname: 'lastName',
        defaultstep: 2,
        requiredpolicy: 'always',
        default: 'visible',
        options: 'hidden:Hidden,visible:Visible,required:Required',
      },
      {
        prop: 'field_visibility.company',
        label: 'Company',
        stepname: 'company',
        defaultstep: 3,
        requiredpolicy: 'toggle',
        default: 'visible',
        options: 'hidden:Hidden,visible:Visible,required:Required',
      },
      {
        prop: 'field_filters.products',
        label: 'Products',
        stepname: 'products',
        defaultstep: 3,
        requiredpolicy: 'never',
        default: 'all',
        options: 'hidden:Hidden,all:All products,selected:Selected products',
      },
    ];
    const ruleRows = [
      ['form.id', '1723'], ['form.subtype', 'contact'], ['form.success.type', 'inline'],
      ['field_visibility.company', 'required'], ['field_filters.products', 'selected'],
    ].map(([prop, value]) => ({ template: 'demo', prop, value }));
    let fieldMap;
    let templateRules;

    beforeEach(() => {
      fieldMap = createFieldMap(preferences);
      templateRules = getTemplateRules(ruleRows, preferences);
    });

    afterEach(() => {
      render(null, document.querySelector('.marketo-config'));
      window.location.hash = '';
      restore();
    });

    it('applies template metadata and defaults, and resets edits without replacing unrelated preferences', () => {
      const defaults = fieldMap.applyTemplate('demo', templateRules, 3);
      expect(defaults).to.deep.equal({
        'form.template': 'demo',
        'form id': '1723',
        'form.id': '1723',
        'form.subtype': 'contact',
        'form.success.type': 'inline',
        'field_visibility.name': 'required',
        'field_visibility.company': 'required',
        'field_filters.products': 'selected',
        [STEP_PREF]: { 1: ['email', 'country'], 2: ['firstName', 'lastName'], 3: ['company', 'products'] },
      });
      const edited = { ...defaults, ...fieldMap.moveField(defaults, 'company', 'hidden'), 'program.poi': 'Acrobat' };
      expect({ ...edited, ...fieldMap.applyTemplate('demo', templateRules, 3) })
        .to.deep.equal({ ...defaults, 'program.poi': 'Acrobat' });
    });

    it('rejects invalid template rules and duplicate field identifiers', () => {
      const invalidRules = [
        [[{ ...ruleRows[0], template: 'unknown' }], 'Unknown template: unknown'],
        [[...ruleRows, ruleRows[0]], 'Duplicate template rule: demo:form.id'],
        [[...ruleRows, { template: 'demo', prop: 'field_visibility.unknown', value: 'visible' }], 'Unknown template property'],
        [ruleRows.map((row) => (row.prop === 'field_filters.products' ? { ...row, value: 'invalid' } : row)), 'Invalid template value'],
        [ruleRows.filter((row) => row.prop !== 'form.id'), 'Missing template rule: demo:form.id'],
      ];
      invalidRules.forEach(([rows, message]) => {
        expect(() => getTemplateRules(rows, preferences)).to.throw(message);
      });
      expect(() => createFieldMap([...preferences, preferences[1]])).to.throw('Duplicate field identifier');
    });

    it('redistributes fields from one to three steps and back, keeping linked fields together', () => {
      const initial = fieldMap.applyTemplate('demo', templateRules);
      const expanded = { ...initial, ...fieldMap.setStepCount(initial, 3) };
      const collapsed = { ...expanded, ...fieldMap.setStepCount(expanded, 1) };
      expect(expanded[STEP_PREF]).to.deep.equal({ 1: ['email', 'country'], 2: ['firstName', 'lastName'], 3: ['company', 'products'] });
      expect(collapsed).to.deep.equal(initial);
      expect(fieldMap.deriveStepCount(expanded)).to.equal(3);
      expect(fieldMap.deriveStepCount(collapsed)).to.equal(1);
    });

    it('moves and hides linked fields together while protecting locked and invalid fields', () => {
      const initial = fieldMap.applyTemplate('demo', templateRules, 3);
      [['email', 'hidden'], ['country', 'hidden'], ['lastName', '3'], ['unknown', '2']].forEach(([id, bucket]) => {
        expect(fieldMap.moveField(initial, id, bucket)).to.deep.equal({});
      });
      const moved = { ...initial, ...fieldMap.moveField(initial, 'name', '3') };
      expect(moved[STEP_PREF][2]).to.deep.equal([]);
      expect(moved[STEP_PREF][3]).to.deep.equal(['company', 'products', 'firstName', 'lastName']);
      const hidden = { ...moved, ...fieldMap.moveField(moved, 'name', 'hidden') };
      expect(hidden[STEP_PREF][3]).to.deep.equal(['company', 'products']);
      expect(fieldMap.deriveBuckets(hidden).hidden).to.deep.equal(['name']);
      const shown = { ...hidden, ...fieldMap.moveField(hidden, 'name', '2') };
      expect(shown['field_visibility.name']).to.equal('required');
      expect(shown[STEP_PREF][2]).to.deep.equal(['firstName', 'lastName']);
      expect(initial[STEP_PREF][2]).to.deep.equal(['firstName', 'lastName']);
    });

    it('round-trips multi-step settings and saved filter values through copied links, then resets to the template', async () => {
      const lsKey = 'marketo-test-ConfiguratorState';
      const saved = { ...fieldMap.applyTemplate('demo', templateRules, 3), 'field_filters.products': 'retired' };
      Object.assign(saved, fieldMap.moveField(saved, 'company', '2'));
      localStorage.setItem(lsKey, JSON.stringify(saved));
      window.fetch = stub().resolves({
        ok: true,
        json: async () => ({
          ':names': ['metadata', 'preferences', 'template-rules'],
          metadata: { data: [{ sheet: 'preferences', title: 'Core Preferences' }] },
          preferences: { data: preferences },
          'template-rules': { data: ruleRows },
        }),
      });
      stub(navigator.clipboard, 'write').resolves();
      const el = document.querySelector('.marketo-config');
      await init(el);
      const filter = await waitForElement('#ff-filter-products', { rootEl: el });
      expect(filter.value).to.equal('retired');
      expect(filter.selectedOptions[0].textContent).to.equal('retired (saved value)');
      el.querySelector('.copy-config').click();
      await waitFor(() => el.querySelector('.copy-content').value);
      const { hash } = new URL(el.querySelector('.copy-content').value);
      expect(hash).not.to.equal('');
      render(null, el);
      localStorage.clear();
      window.location.hash = hash;
      document.body.innerHTML = innerHTML;
      const reloaded = document.querySelector('.marketo-config');
      await init(reloaded);
      const restoredFilter = await waitForElement('#ff-filter-products', { rootEl: reloaded });
      expect(restoredFilter.value).to.equal('retired');
      await waitFor(() => localStorage.getItem(lsKey));
      expect(loadStateFromLocalStorage(lsKey)).to.deep.equal(saved);
      reloaded.querySelector('.ff-reset').click();
      await waitFor(() => loadStateFromLocalStorage(lsKey)?.['field_filters.products'] === 'selected');
      expect(loadStateFromLocalStorage(lsKey)).to.deep.equal(fieldMap.applyTemplate('demo', templateRules, 3));
    });

    it('copies template IDs that load in the Marketo runtime with new and legacy preferences', async () => {
      const { default: initMarketo } = await import('../../../libs/blocks/marketo/marketo.js');
      stub(navigator.clipboard, 'write').resolves();
      for (const legacy of [false, true]) {
        document.body.innerHTML = innerHTML;
        localStorage.clear();
        const runtimePreferences = [
          ...preferences,
          { prop: 'marketo host', label: 'Host', default: 'engage.adobe.com' },
          { prop: 'marketo munckin', label: 'Munchkin', default: '360-KCI-804' },
          ...(legacy ? [{ prop: 'form id', label: 'Form ID', default: '9999' }] : []),
        ];
        window.fetch = stub().resolves({
          ok: true,
          json: async () => ({
            ':names': ['metadata', 'preferences', 'template-rules'],
            metadata: { data: [{ sheet: 'preferences', title: 'Core Preferences' }] },
            preferences: { data: runtimePreferences },
            'template-rules': { data: ruleRows },
          }),
        });
        const el = document.querySelector('.marketo-config');
        await init(el);
        const copyButton = await waitForElement('.copy-config', { rootEl: el });
        copyButton.click();
        await waitFor(() => el.querySelector('.copy-content').value);
        const url = el.querySelector('.copy-content').value;
        const copiedState = parseEncodedConfig(new URL(url).hash.slice(1));
        expect(copiedState['form.id']).to.equal('1723');
        expect(copiedState['form id']).to.equal('1723');

        const block = document.createElement('div');
        block.className = 'marketo';
        block.hidden = true;
        block.innerHTML = `<div><a href="${url}">Configuration</a></div>`;
        el.append(block);
        await initMarketo(block);
        expect(block.querySelector('form')?.id).to.equal('mktoForm_1723');
        block.remove();
        render(null, el);
      }
    });

    it('preserves placements when selecting the active step count and resets them only on request', async () => {
      const el = document.querySelector('.marketo-config');
      el.replaceChildren();
      render(html`
        <${ConfiguratorProvider} defaultState=${fieldMap.applyTemplate('demo', templateRules, 3)} lsKey="active-step-count">
          <${FieldsPanel} fieldMap=${fieldMap} templateRules=${templateRules} />
        </${ConfiguratorProvider}>`, el);
      const placement = await waitForElement('#ff-placement-company', { rootEl: el });
      placement.value = '2';
      placement.dispatchEvent(new Event('change', { bubbles: true }));
      await delay(50);

      el.querySelector('.ff-step-count-btn.is-active').click();
      await delay(50);
      expect(el.querySelector('#ff-placement-company').closest('[data-bucket]').dataset.bucket)
        .to.equal('2');
      expect(el.querySelector('.ff-step-count-btn.is-active').textContent.trim()).to.equal('3');

      el.querySelector('.ff-reset').click();
      await delay(50);
      expect(el.querySelector('#ff-placement-company').closest('[data-bucket]').dataset.bucket)
        .to.equal('3');
    });

    it('moves dragged fields to the drop target and refuses to hide locked fields', async () => {
      const el = document.querySelector('.marketo-config');
      el.replaceChildren();
      render(html`
        <${ConfiguratorProvider} defaultState=${fieldMap.applyTemplate('demo', templateRules, 3)} lsKey="field-drag">
          <${FieldsPanel} fieldMap=${fieldMap} templateRules=${templateRules} />
        </${ConfiguratorProvider}>`, el);
      await delay(50);
      for (const [id, bucket, allowed] of [['name', '3', true], ['email', 'hidden', false]]) {
        const chip = el.querySelector(`[data-field="${id}"]`);
        const target = el.querySelector(`[data-bucket="${bucket}"]`);
        const dataTransfer = new DataTransfer();
        chip.dispatchEvent(new DragEvent('dragstart', { bubbles: true, dataTransfer }));
        await delay(50);
        target.dispatchEvent(new DragEvent('dragover', { bubbles: true, cancelable: true, dataTransfer }));
        await waitFor(() => target.classList.contains(allowed ? 'is-over' : 'is-blocked'));
        const drop = new DragEvent('drop', { bubbles: true, cancelable: true, dataTransfer });
        target.dispatchEvent(drop);
        await delay(50);
        expect(drop.defaultPrevented).to.be.true;
        expect(Boolean(target.querySelector(`[data-field="${id}"]`))).to.equal(allowed);
        el.querySelector(`[data-field="${id}"]`).dispatchEvent(new DragEvent('dragend', { bubbles: true }));
      }
    });
  });

  it('preserves native bucket toggles, field values, and focus across updates and moves', async () => {
    const el = document.querySelector('.marketo-config');
    const fieldMap = createFieldMap([
      { prop: 'field_visibility.company', label: 'Company', stepname: 'company', defaultstep: 1, requiredpolicy: 'toggle' },
      {
        prop: 'field_filters.products', label: 'Products', stepname: 'products', defaultstep: 2, requiredpolicy: 'never', options: 'all:All products,selected:Selected products',
      },
    ]);
    const templateRules = { demo: { label: 'Demo', field_visibility: { company: 'visible' }, field_filters: { products: 'all' } } };
    el.replaceChildren();
    render(html`
      <${ConfiguratorProvider} defaultState=${fieldMap.applyTemplate('demo', templateRules, 2)} lsKey="native-buckets">
        <${FieldsPanel} fieldMap=${fieldMap} templateRules=${templateRules} />
      </${ConfiguratorProvider}>`, el);
    await delay(50);
    const available = el.querySelector('[data-bucket="hidden"]');
    const step2 = el.querySelector('[data-bucket="2"]');
    expect(available.open).to.be.false;
    expect(step2.open).to.be.true;
    available.querySelector('summary').click();
    step2.querySelector('summary').click();
    await delay(50);

    const required = el.querySelector('[data-field="company"] input');
    expect(required.checked).to.be.false;
    required.checked = true;
    required.dispatchEvent(new Event('change', { bubbles: true }));
    await delay(50);
    expect(available.open).to.be.true;
    expect(step2.open).to.be.false;

    const placement = el.querySelector('#ff-placement-company');
    placement.value = '2';
    placement.dispatchEvent(new Event('change', { bubbles: true }));
    await delay(50);
    expect(step2.open).to.be.true;
    expect(document.activeElement).to.equal(step2.querySelector('#ff-placement-company'));
    expect(step2.querySelector('[data-field="company"] input').checked).to.be.true;

    available.querySelector('summary').click();
    await delay(50);
    const movedPlacement = step2.querySelector('#ff-placement-company');
    movedPlacement.value = 'hidden';
    movedPlacement.dispatchEvent(new Event('change', { bubbles: true }));
    await delay(50);
    expect(available.open).to.be.true;
    expect(document.activeElement).to.equal(available.querySelector('#ff-placement-company'));

    const filter = step2.querySelector('#ff-filter-products');
    filter.value = 'selected';
    filter.dispatchEvent(new Event('change', { bubbles: true }));
    await delay(50);
    const filterPlacement = step2.querySelector('#ff-placement-products');
    filterPlacement.value = '1';
    filterPlacement.dispatchEvent(new Event('change', { bubbles: true }));
    await delay(50);
    const step1 = el.querySelector('[data-bucket="1"]');
    expect(step1.querySelector('#ff-filter-products').value).to.equal('selected');
    const movedFilterPlacement = step1.querySelector('#ff-placement-products');
    movedFilterPlacement.value = 'hidden';
    movedFilterPlacement.dispatchEvent(new Event('change', { bubbles: true }));
    await delay(50);
    expect(available.querySelector('#ff-placement-products')).to.exist;
    expect(el.querySelector('#ff-filter-products')).not.to.exist;
    expect(el.querySelector('.ff-step-count-btn.is-active').textContent.trim()).to.equal('2');
    render(null, el);
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
