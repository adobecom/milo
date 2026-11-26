import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { setConfig } from '../../../../libs/utils/utils.js';
import init from '../../../../libs/c2/blocks/promo/promo.js';

setConfig({
  codeRoot: '/libs',
  placeholders: { 'cdt-days': 'days', 'cdt-hours': 'hours', 'cdt-mins': 'mins', 'cdt-secs': 'secs' },
});

const START = Date.parse('2026-11-01T00:00:00Z');
const END = Date.parse('2026-11-02T01:01:01Z');

// Captured before sinon fakes it, so tests can wait for the MAS path's async label lookup
const realTimeout = window.setTimeout;
const waitFor = async (check, tries = 50) => {
  if (check() || !tries) return;
  await new Promise((resolve) => { realTimeout(resolve, 10); });
  await waitFor(check, tries - 1);
};
const DATES = '2026-11-01T00:00:00Z, 2026-11-02T01:01:01Z';

async function loadBlock(mock, dates = DATES) {
  document.head.innerHTML = `<meta name="countdown-timer" content="${dates}">`;
  document.body.innerHTML = await readFile({ path: `./mocks/${mock}.html` });
  const block = document.querySelector('.promo');
  await init(block);
  return block;
}

const accessibleName = (link) => link.getAttribute('aria-labelledby')
  .split(' ')
  .map((id) => document.getElementById(id).textContent.trim())
  .join(' ');

describe('C2 promo', () => {
  let clock;

  afterEach(() => {
    clock?.restore();
    clock = null;
    document.head.innerHTML = '';
    document.body.innerHTML = '';
  });

  it('moves the logo into the heading and labels CTAs with the heading', async () => {
    const block = await loadBlock('default');
    const heading = block.querySelector('.promo-heading-group h2');
    const link = block.querySelector('.promo-callout a');

    expect(heading.querySelector('.promo-logo img')).to.exist;
    expect(heading.textContent.trim()).to.equal('Upskill and find inspiration.');
    expect(block.querySelector('.promo-heading-group > p')).to.be.null;
    expect(block.querySelector('.promo-callout .action-area')).to.exist;
    link.setAttribute('aria-label', 'Register now - something else');
    expect(accessibleName(link)).to.equal('Register now Upskill and find inspiration.');
    expect(block.querySelector('.promo-timer')).to.be.null;
  });

  it('renders a running timer with screen reader units and hides the live row', async () => {
    clock = sinon.useFakeTimers({ now: START, toFake: ['Date', 'setTimeout', 'clearTimeout'] });
    const block = await loadBlock('countdown');
    const timer = block.querySelector('.promo-content:not(.live) .promo-actions .promo-timer');

    expect(block.classList.contains('has-timer')).to.be.true;
    expect(block.classList.contains('is-live')).to.be.false;
    expect(block.querySelector('.promo-content.live')).to.exist;
    expect(timer.getAttribute('role')).to.equal('timer');
    expect(timer.querySelector('.countdown-digits').getAttribute('aria-hidden')).to.equal('true');
    expect(timer.querySelector('.countdown-digits').textContent).to.equal('01:01:01:01');
    expect(timer.querySelector('.sr-only').textContent).to.equal('1 days 1 hours 1 mins 1 secs');

    clock.tick(2000);
    expect(timer.querySelector('.countdown-digits').textContent).to.equal('01:01:00:59');
  });

  it('waits for the start date before showing the timer', async () => {
    clock = sinon.useFakeTimers({ now: START - 2000, toFake: ['Date', 'setTimeout', 'clearTimeout'] });
    const block = await loadBlock('countdown');
    expect(block.classList.contains('has-timer')).to.be.false;
    clock.tick(2010);
    expect(block.classList.contains('has-timer')).to.be.true;
  });

  it('logs an invalid countdown and keeps the main row without a timer', async () => {
    window.lana = { log: sinon.spy() };
    const block = await loadBlock('countdown', 'soon');

    expect(window.lana.log.calledOnce).to.be.true;
    expect(block.querySelector('.promo-timer')).to.be.null;
    expect(block.querySelector('.promo-content.live')).to.be.null;
    delete window.lana;
  });

  it('switches to the live row when the countdown ends', async () => {
    clock = sinon.useFakeTimers({ now: END - 1000, toFake: ['Date', 'setTimeout', 'clearTimeout'] });
    const block = await loadBlock('countdown');
    expect(block.classList.contains('has-timer')).to.be.true;

    clock.tick(1010);
    expect(block.classList.contains('has-timer')).to.be.false;
    expect(block.classList.contains('is-live')).to.be.true;
  });

  describe('MAS countdown', () => {
    const MAS_DATES = '2026-11-01T00:00:00Z,2026-11-01T00:00:10Z';
    const sendDates = async (block, dates = MAS_DATES) => {
      block.querySelector('.promo-callout').dispatchEvent(new CustomEvent('milo:mas-countdown', { bubbles: true, detail: { dates } }));
      await waitFor(() => block.querySelector('.countdown-digits')?.textContent === '00:00:00:10');
    };

    it('starts a timer from fragment dates', async () => {
      clock = sinon.useFakeTimers({ now: START, toFake: ['Date', 'setTimeout', 'clearTimeout'] });
      const block = await loadBlock('default');
      await sendDates(block);

      expect(block.querySelectorAll('.promo-timer')).to.have.length(1);
      expect(block.querySelector('.countdown-digits').textContent).to.equal('00:00:00:10');
      expect(block.classList.contains('has-timer')).to.be.true;
    });

    it('replaces the page metadata timer and ignores re-renders with the same dates', async () => {
      clock = sinon.useFakeTimers({ now: START, toFake: ['Date', 'setTimeout', 'clearTimeout'] });
      const block = await loadBlock('countdown');
      await sendDates(block);
      const timer = block.querySelector('.promo-timer');
      await sendDates(block);

      expect(block.querySelectorAll('.promo-timer')).to.have.length(1);
      expect(block.querySelector('.promo-timer')).to.equal(timer);
      expect(timer.querySelector('.countdown-digits').textContent).to.equal('00:00:00:10');
      clock.tick(10010);
      expect(block.classList.contains('is-live')).to.be.true;
    });
  });
});
