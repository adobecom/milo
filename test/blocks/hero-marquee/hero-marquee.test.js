import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { stub } from 'sinon';
import { waitForElement } from '../../helpers/waitfor.js';
import { setConfig } from '../../../libs/utils/utils.js';
import { getViewportOrder } from '../../../libs/blocks/hero-marquee/hero-marquee.js';

window.lana = { log: stub() };

const locales = { '': { ietf: 'en-US', tk: 'hah7vzn.css' } };
const conf = { locales };
setConfig(conf);

describe('Hero Marquee', () => {
  before(async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const { default: init } = await import('../../../libs/blocks/hero-marquee/hero-marquee.js');
    const marquees = document.querySelectorAll('.hero-marquee');
    marquees.forEach(async (marquee) => {
      await init(marquee);
    });
  });
  it('supports main copy and additinoal block-rows (list, qrcode, lockup, text)', async () => {
    const copy = await waitForElement('.main-copy');
    const rowList = await waitForElement('.row-list');
    const rowQrCode = await waitForElement('.row-qrcode');
    const rowLockup = await waitForElement('.row-lockup');
    const rowText = await waitForElement('.row-text');
    expect(copy).to.exist;
    expect(rowList).to.exist;
    expect(rowQrCode).to.exist;
    expect(rowLockup).to.exist;
    expect(rowText).to.exist;
  });
  it('supports authorable horizontal rules', async () => {
    const hr = await waitForElement('.has-divider');
    expect(hr).to.exist;
  });
  it('sorts con-block elements based on order class and viewport', async () => {
    const orderHero = await readFile({ path: './mocks/order-marquee.html' });
    const orderMarquee = document.querySelector('#order-hero');
    orderMarquee.innerHTML = orderHero;
    const orderCopy = orderMarquee.querySelector('.copy');
    const tabletOrder = getViewportOrder('tablet', orderCopy);
    const desktopOrder = getViewportOrder('desktop', orderCopy);

    expect(tabletOrder[0].classList.contains('main-copy')).to.be.true;
    expect(desktopOrder[0].classList.contains('main-copy')).to.be.true;

    expect(tabletOrder[1].classList.contains('order-0-tablet')).to.be.true;
    expect(desktopOrder[1].classList.contains('no-order-element')).to.be.true;

    expect(tabletOrder[2].classList.contains('no-order-element')).to.be.true;
    expect(desktopOrder[2].classList.contains('order-0-desktop')).to.be.true;

    expect(tabletOrder[3].classList.contains('order-1-tablet')).to.be.true;
    expect(desktopOrder[3].classList.contains('order-1-tablet')).to.be.true;

    expect(tabletOrder[4].classList.contains('order-2-tablet')).to.be.true;
    expect(desktopOrder[4].classList.contains('order-1-desktop')).to.be.true;

    expect(tabletOrder[5].classList.contains('order-3-tablet')).to.be.true;
    expect(desktopOrder[5].classList.contains('order-2-desktop')).to.be.true;
  });
  it('order of con-blocks is the same as mobile if there is no order class', async () => {
    const noOrderHero = await readFile({ path: './mocks/no-order-marquee.html' });
    const noOrderMarquee = document.querySelector('#no-order-hero');
    noOrderMarquee.innerHTML = noOrderHero;
    const noOrderCopy = noOrderMarquee.querySelector('.copy');
    const mobileOrder = [...noOrderCopy.children];
    const tabletOrder = getViewportOrder('tablet', noOrderCopy);
    for (const [index, el] of tabletOrder.entries()) expect(el === mobileOrder[index]).to.be.true;
  });
});
