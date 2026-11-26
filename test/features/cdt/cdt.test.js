import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { loadCDT } from '../../../libs/utils/decorate.js';
import { setConfig } from '../../../libs/utils/utils.js';
import initCDT from '../../../libs/features/cdt/cdt.js';

const locales = { '': { ietf: 'en-US', tk: 'hah7vzn.css' } };
const conf = {
  locales,
  placeholders: { 'cdt-days': 'days', 'cdt-hours': 'hours', 'cdt-mins': 'mins', 'cdt-secs': 'secs' },
};
setConfig(conf);

// End date one year out so the "active timer" fixtures never expire over time.
const futureCdtEnd = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();

document.body.innerHTML = await readFile({ path: './mocks/body.html' });

// Each case needs its own block element: loadCDT claims a block for one countdown timer only.
function newCdtContainer() {
  const previous = document.getElementById('cdt-container');
  const container = previous.cloneNode(false);
  previous.replaceWith(container);
  return container;
}
describe('CDT test error case no metadata', () => {
  it('check for countdown-timer meta data', async () => {
    const container = newCdtContainer();
    await loadCDT(container, container.classList);
    expect(container.querySelectorAll('.timer-label')).to.have.lengthOf(0);
  });
});

describe('CDT test error case invalid date', () => {
  before(() => {
    document.head.innerHTML = '<meta name="countdown-timer" content="2026-08-30 00:00:00 PST,invalid">';
  });
  it('check for countdown-timer meta data', async () => {
    const container = newCdtContainer();
    await loadCDT(container, container.classList);
    expect(container.querySelectorAll('.timer-label')).to.have.lengthOf(0);
  });
});

describe('CDT test success case', () => {
  before(() => {
    document.head.innerHTML = `<meta name="countdown-timer" content="2024-08-26 12:00:00 PST,${futureCdtEnd}">`;
  });
  it('check for countdown-timer meta data', async () => {
    const container = newCdtContainer();
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
    const container = newCdtContainer();
    await loadCDT(container, container.classList);
    expect(container.querySelectorAll('.timer-label')).to.have.lengthOf(0);
  });
});

describe('CDT test start is equal to end date', () => {
  before(() => {
    document.head.innerHTML = '<meta name="countdown-timer" content="2024-08-26 12:00:00 PST,2024-08-26 12:00:00 PST">';
  });
  it('check for countdown-timer meta data', async () => {
    const container = newCdtContainer();
    await loadCDT(container, container.classList);
    expect(container.querySelectorAll('.timer-label')).to.have.lengthOf(0);
  });
});

describe('CDT test start is equal to end date', () => {
  before(() => {
    document.head.innerHTML = `<meta name="manifestnames" content="black-friday-offer,twp-cct"><meta name="schedule" content=", black-friday-offer | 2024-03-22T05:00:00 | 2038-03-31T05:00:00 | https://main--milo--adobecom.aem.page/drafts/nala/features/promotions/manifests/promo-with-fragments-insert.json |  | 2024-08-26T12:00:00 | ${futureCdtEnd}, mwpw-159157-delayed-modal-space-between | 2024-09-26T00:00:00 | 2026-11-30T00:00:00 | https://main--milo--adobecom.aem.live/fragments/mirafedas/promos/2024/global/delayed-modal-promo/delayed-modal-promo.json |  |  |">`;
  });
  it('check for countdown-timer meta data by MEP', async () => {
    const container = newCdtContainer();
    await loadCDT(container, container.classList);
    expect(container.querySelectorAll('.timer-label')).to.have.lengthOf(1);
    container.innerHTML = '';
  });
});

describe('CDT opt-in C2 mode', () => {
  const START = Date.parse('2026-11-01T00:00:00Z');
  const END = Date.parse('2026-11-02T01:01:01Z');
  const DATES = '2026-11-01T00:00:00Z,2026-11-02T01:01:01Z';
  let clock;

  afterEach(() => clock.restore());

  it('waits for the start date, ticks every second and reports status changes', async () => {
    clock = sinon.useFakeTimers({ now: START - 2000, toFake: ['Date', 'setTimeout', 'clearTimeout'] });
    const container = newCdtContainer();
    const onStatus = sinon.spy();
    const timer = await initCDT(container, container.classList, DATES, { c2: true, className: 'custom', onStatus });

    expect(timer.className).to.equal('custom');
    expect(timer.getAttribute('role')).to.equal('timer');
    expect(timer.hidden).to.be.true;
    expect(onStatus.args).to.deep.equal([['pending']]);

    clock.tick(2010);
    const digits = timer.querySelector('.countdown-digits');
    expect(timer.hidden).to.be.false;
    expect(onStatus.lastCall.args).to.deep.equal(['running']);
    expect(digits.getAttribute('dir')).to.equal('ltr');
    expect(digits.getAttribute('aria-hidden')).to.equal('true');
    expect(digits.textContent).to.equal('01:01:01:00');
    expect(timer.querySelector('.sr-only').textContent).to.equal('1 days 1 hours 1 mins 0 secs');

    clock.tick(1000);
    expect(digits.textContent).to.equal('01:01:00:59');

    clock.tick(END - START);
    expect(timer.hidden).to.be.true;
    expect(onStatus.lastCall.args).to.deep.equal(['ended']);
    expect(clock.countTimers()).to.equal(0);
  });

  it('stops once removed from the page', async () => {
    clock = sinon.useFakeTimers({ now: START, toFake: ['Date', 'setTimeout', 'clearTimeout'] });
    const container = newCdtContainer();
    const timer = await initCDT(container, container.classList, DATES, { c2: true });
    timer.remove();
    clock.tick(1010);
    expect(clock.countTimers()).to.equal(0);
  });
});
