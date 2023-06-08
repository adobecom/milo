import { readFile, sendMouse, sendKeys } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';

document.body.innerHTML = await readFile({ path: './mocks/body.html' });
const { default: init } = await import('../../../libs/blocks/tabs/tabs.js');

describe('tabs', () => {
  let clock;
  before(() => {
    clock = sinon.useFakeTimers();
  });

  afterEach(() => {
    sinon.resetHistory();
  });

  after(() => {
    clock.restore();
    sinon.restore();
  });
  const allTabs = document.querySelectorAll('.tabs');
  allTabs.forEach((tabs) => {
    init(tabs);
  });
  describe('default tabs', () => {
    it('has a tabList', () => {
      const tablist = allTabs[0].querySelector('div[role="tablist"]');
      expect(tablist).to.exist;
    });
  });

  it('clicks on a tabList button', async () => {
    const unSelectedBtn = allTabs[0].querySelector('div[role="tablist"] button[aria-selected="false"]');
    unSelectedBtn.click();
    expect(unSelectedBtn.ariaSelected).to.equal('true');
  });

  it('focus on tabList button, ArrowRight key to next tab and Enter key to select aria', async () => {
    const unSelectedBtn1 = allTabs[1].querySelector('div[role="tablist"] button[aria-selected="false"]');
    const unSelectedBtn2 = allTabs[2].querySelector('div[role="tablist"] button[aria-selected="false"]');
    unSelectedBtn1.focus();
    await sendKeys({ down: 'ArrowRight' });
    await sendKeys({ press: 'Enter' });
    expect(unSelectedBtn1.ariaSelected).to.equal('true');

    unSelectedBtn2.focus();
    await sendKeys({ down: 'ArrowLeft' });
    await sendKeys({ press: 'Space' });
    expect(unSelectedBtn2.ariaSelected).to.equal('false');
  });
  it('on click scroll happend',  async () => {
    const firstButton = allTabs[4].querySelector('div[role="tablist"] button[aria-controls="tab-panel-demo-1"]');
    const contentForFirstButton = document.querySelector('[data-jump-to-tab="tab-demo-1"]')
    const yPositionBeforeScroll = contentForFirstButton.getBoundingClientRect().y;
    firstButton.click();
    const yPositionAfterScroll =  contentForFirstButton.getBoundingClientRect().y;
    expect(yPositionBeforeScroll).greaterThan(yPositionAfterScroll);
  });
  it('simulate slow page load',  async () => {
    const firstButton = allTabs[5].querySelector('div[role="tablist"] button[aria-controls="tab-panel-demo-slow-1"]');
    const contentForFirstButton = document.querySelector('[data-jump-to-tab="tab-demo-slow-1"]');
    const yPositionBeforeScroll = contentForFirstButton.getBoundingClientRect().y;
    contentForFirstButton.setAttribute('data-status', 'decorated');
    firstButton.click();
    contentForFirstButton.removeAttribute('data-status');
    clock.tick(1100);
    const yPositionAfterScroll =  contentForFirstButton.getBoundingClientRect().y;
    expect(yPositionBeforeScroll).greaterThan(yPositionAfterScroll);
  });
});
