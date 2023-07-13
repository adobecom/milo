import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { stub } from 'sinon';
import { delay, waitForElement } from '../../helpers/waitfor.js';
import init, { getDefaultStates, cleanPanelData, getConfigOptions } from '../../../libs/blocks/marketo-config/marketo-config.js';
import { setConfig } from '../../../libs/utils/utils.js';

const innerHTML = await readFile({ path: './mocks/body.html' });
const options = JSON.parse(await readFile({ path: './mocks/options.json' }));
const config = { codeRoot: '/libs' };
const ogFetch = window.fetch;

setConfig(config);

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

    const marketo = await waitForElement('.marketo');
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
