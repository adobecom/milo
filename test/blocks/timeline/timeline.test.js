import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { setConfig } from '../../../libs/utils/utils.js';

const config = { codeRoot: '/libs' };
setConfig(config);

const { default: init } = await import('../../../libs/blocks/timeline/timeline.js');

describe('Timeline', () => {
  beforeEach(async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('has 3 headers', async () => {
    const timelineEl = document.querySelector('.timeline');
    init(timelineEl);
    const headers = timelineEl.querySelectorAll('.timeline h3');
    expect(headers[0].textContent).to.equal('Day 1');
    expect(headers[1].textContent).to.equal('Day 8');
    expect(headers[2].textContent).to.equal('Day 21');
  });
  it('has 3 descriptions', async () => {
    const timelineEl = document.querySelector('.timeline');
    init(timelineEl);
    const descriptions = timelineEl.querySelectorAll('.timeline h3 + p');

    expect(descriptions[0].textContent).to.equal('If you start your free trial today');
    expect(descriptions[1].textContent).to.equal('Your subscription starts and billing begins');
    expect(descriptions[2].textContent).to.equal('Full refund period ends');
  });
  it('has a payment period and a refund period section', async () => {
    const timelineEl = document.querySelector('.timeline');
    init(timelineEl);
    const trialPeriod = timelineEl.querySelector('.left .period');
    const refundPeriod = timelineEl.querySelector('.right .period');

    expect(trialPeriod.textContent).to.equal('7-day free trial');
    expect(refundPeriod.textContent).to.equal('14-day full refund period');
    expect(trialPeriod.style.background.includes('to right')).to.be.true;
  });
  it('sets bar background colors based on colors in free trial and refund period section', async () => {
    const timelineEl = document.querySelector('.timeline');
    init(timelineEl);
    const bars = timelineEl.querySelectorAll('.bar');

    expect(bars[0].style.backgroundColor).to.equal('rgb(230, 56, 136)');
    expect(bars[1].style.backgroundColor).to.equal('rgb(233, 116, 154)');
    expect(bars[2].style.backgroundColor).to.equal('rgb(255, 206, 46)');
  });
  it('marks bar wrappers as decorative for screen readers', async () => {
    const timelineEl = document.querySelector('.timeline');
    init(timelineEl);
    const barWrappers = timelineEl.querySelectorAll('.bar-wrapper');
    barWrappers.forEach((wrapper) => {
      expect(wrapper.getAttribute('aria-hidden')).to.equal('true');
    });
  });
  it('has correct DOM reading order for screen readers', async () => {
    const timelineEl = document.querySelector('.timeline');
    init(timelineEl);
    const left = timelineEl.querySelector('.left');
    const right = timelineEl.querySelector('.right');

    const leftText = left.querySelector('[data-valign]');
    const leftPeriod = left.querySelector('.period');
    const rightTexts = right.querySelectorAll('[data-valign]');
    const rightPeriod = right.querySelector('.period');

    const follows = (a, b) => a.compareDocumentPosition(b) === Node.DOCUMENT_POSITION_FOLLOWING;

    // Left column: text before period
    expect(follows(leftText, leftPeriod)).to.be.true;

    // Right column: Day 8 before period, period before Day 21
    expect(follows(rightTexts[0], rightPeriod)).to.be.true;
    expect(follows(rightPeriod, rightTexts[1])).to.be.true;
  });
  it('updates background linear gradient for rtl', async () => {
    const timelineEl = document.querySelector('.timeline');
    timelineEl.parentElement.setAttribute('dir', 'rtl');
    init(timelineEl);
    const trialPeriod = timelineEl.querySelector('.left .period');
    expect(trialPeriod.style.background.includes('to left')).to.be.true;
  });
  describe('rtl ', () => {
    beforeEach(async () => {
      document.body.innerHTML = await readFile({ path: './mocks/switchcolors.html' });
    });
    afterEach(() => {
      document.body.innerHTML = '';
    });
    it('updates linear-gradient for rtl', async () => {
      const timelineEl = document.querySelector('.timeline');
      init(timelineEl);
      const refundPeriod = timelineEl.querySelector('.right .period');
      expect(refundPeriod.textContent).to.equal('14-day full refund period');
      expect(refundPeriod.style.background.includes('to left')).to.be.true;
    });
  });
  describe('segment classes', () => {
    beforeEach(async () => {
      document.body.innerHTML = await readFile({ path: './mocks/segmentclasses.html' });
    });
    afterEach(() => {
      document.body.innerHTML = '';
    });
    it('adds classes to handle center text alignment', async () => {
      const timelineEl = document.querySelector('.timeline');
      init(timelineEl);
      const leftCenter = timelineEl.querySelector('.left-center');
      const rightCenter = timelineEl.querySelector('.right-center');
      expect(rightCenter).to.exist;
      expect(leftCenter).to.exist;
    });
  });
  describe('broken segment classes', () => {
    beforeEach(async () => {
      document.body.innerHTML = await readFile({ path: './mocks/brokensegmentclass.html' });
    });
    afterEach(() => {
      document.body.innerHTML = '';
    });
    it('replaces broken segment class width segment-timeline-6-6', async () => {
      const timelineEl = document.querySelector('.timeline');
      init(timelineEl);
      expect(timelineEl.classList.contains('segment-timeline-6-6')).to.be.true;
    });
  });
});
