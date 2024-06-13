import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { loadStyle, MILO_EVENTS } from '../../../libs/utils/utils.js';
import { waitForElement, waitForRemoval } from '../../helpers/waitfor.js';

const { default: init } = await import('../../../libs/blocks/graybox/graybox.js');
await loadStyle('../../../libs/blocks/graybox/graybox.css');

describe('Graybox', () => {
  before(async () => {
    document.body.innerHTML = await readFile({ path: './mocks/graybox.html' });
    await init(document.querySelector('.graybox'));
    document.dispatchEvent(new Event(MILO_EVENTS.DEFERRED));
  });

  it('Displays a graybox dialog', async () => {
    const dialogEl = document.querySelector('.graybox-container');
    expect(dialogEl).to.exist;
    expect(dialogEl.classList.contains('open')).to.be.true;
  });

  it('Displays a mobile iframe on device button click', async () => {
    const dialogEl = document.querySelector('.graybox-container');
    const mobileBtn = dialogEl.querySelector('.graybox-mobile');
    mobileBtn.click();
    await waitForElement('iframe');
    let iframeEl = document.querySelector('iframe');
    expect(iframeEl).to.exist;

    const desktopBtn = dialogEl.querySelector('.graybox-desktop');
    desktopBtn.click();
    await waitForRemoval('iframe');
    iframeEl = document.querySelector('iframe');
    expect(iframeEl).not.to.exist;

    const tabletBtn = dialogEl.querySelector('.graybox-tablet');
    tabletBtn.click();
    await waitForElement('iframe');
    iframeEl = document.querySelector('iframe');
    expect(iframeEl).to.exist;

    desktopBtn.click();
    await waitForRemoval('iframe');
    iframeEl = document.querySelector('iframe');
    expect(iframeEl).not.to.exist;
  });

  it('Can open and close the dialog', async () => {
    const dialogEl = document.querySelector('.graybox-container');
    expect(dialogEl.classList.contains('open')).to.be.true;
    const toggleBtn = document.querySelector('.gb-toggle');
    toggleBtn.click();
    expect(dialogEl.classList.contains('open')).to.be.false;
    toggleBtn.click();
    expect(dialogEl.classList.contains('open')).to.be.true;
  });

  it('Puts an overlay on the entire page', async () => {
    const overlayDiv = document.querySelector('body > .gb-page-overlay');
    expect(overlayDiv).to.exist;
    const beforeStyle = window.getComputedStyle(overlayDiv);
    expect(beforeStyle.backgroundColor).to.equal('rgba(0, 0, 0, 0.45)');
  });

  it('Does not put an overlay on gb-changed blocks', async () => {
    const gbChangedEl = document.querySelector('.gb-changed');
    const gbChangedElStyle = window.getComputedStyle(gbChangedEl);
    expect(gbChangedElStyle.backgroundColor).to.equal('rgb(255, 255, 255)');
  });

  it('Does not put an overlay on gb-no-change sections', async () => {
    const gbChangedSection = document.querySelector('main > div.gb-changed');
    const gbChangedSectionStyle = window.getComputedStyle(gbChangedSection);
    expect(gbChangedSectionStyle.backgroundColor).to.equal('rgb(255, 255, 255)');
  });

  it('Can use gb-no-change inside of a gb-changed section', async () => {
    const noChangeEl = document.querySelector('.gb-no-change');
    const beforeStyle = window.getComputedStyle(noChangeEl, '::before');
    expect(beforeStyle.backgroundColor).to.equal('rgba(0, 0, 0, 0.45)');
  });

  it('Can use gb-no-click to disable clicks', async () => {
    const noClickEl = document.querySelector('.gb-no-click');
    const noClickElStyle = window.getComputedStyle(noClickEl, '::after');
    expect(noClickElStyle.pointerEvents).to.equal('none');
  });
});
