import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { loadCDT } from '../../../libs/utils/decorate.js';
import { setConfig } from '../../../libs/utils/utils.js';

const locales = { '': { ietf: 'en-US', tk: 'hah7vzn.css' } };
const conf = { locales };
setConfig(conf);

document.body.innerHTML = await readFile({ path: './mocks/body.html' });
describe('CDT test error case no metadata', () => {
  it('check for countdown-timer meta data', async () => {
    const container = document.getElementById('cdt-container');
    await loadCDT(container, container.classList);
    expect(container.querySelectorAll('.timer-label')).to.have.lengthOf(0);
  });
});

describe('CDT test error case invalid date', () => {
  before(() => {
    document.head.innerHTML = '<meta name="countdown-timer" content="2026-08-30 00:00:00 PST,invalid">';
  });
  it('check for countdown-timer meta data', async () => {
    const container = document.getElementById('cdt-container');
    await loadCDT(container, container.classList);
    expect(container.querySelectorAll('.timer-label')).to.have.lengthOf(0);
  });
});

describe('CDT test success case', () => {
  before(() => {
    document.head.innerHTML = '<meta name="countdown-timer" content="2024-08-26 12:00:00 PST,2026-08-30 00:00:00 PST">';
  });
  it('check for countdown-timer meta data', async () => {
    const container = document.getElementById('cdt-container');
    await loadCDT(container, container.classList);
    expect(container.querySelectorAll('.timer-label')).to.have.lengthOf(1);
    container.innerHTML = '';
  });
});

describe('CDT test error case invalid  cdt metdata format', () => {
  before(() => {
    document.head.innerHTML = '<meta name="countdown-timer" content="a,b,c">';
  });
  it('check for countdown-timer meta data', async () => {
    const container = document.getElementById('cdt-container');
    await loadCDT(container, container.classList);
    expect(container.querySelectorAll('.timer-label')).to.have.lengthOf(0);
  });
});

describe('CDT test start is equal to end date', () => {
  before(() => {
    document.head.innerHTML = '<meta name="countdown-timer" content="2024-08-26 12:00:00 PST,2024-08-26 12:00:00 PST">';
  });
  it('check for countdown-timer meta data', async () => {
    const container = document.getElementById('cdt-container');
    await loadCDT(container, container.classList);
    expect(container.querySelectorAll('.timer-label')).to.have.lengthOf(0);
  });
});
