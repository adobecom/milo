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
    const orderMarquee = document.querySelector('#hero-order');
    const orderCopy = orderMarquee.querySelector('.copy');
    const mobileOrder = [...orderCopy.children];
    const tabletOrder = getViewportOrder('tablet', orderCopy, mobileOrder);
    const desktopOrder = getViewportOrder('desktop', orderCopy, tabletOrder);
    expect(tabletOrder[0].classList.contains('main-copy')).to.be.true;
    expect(desktopOrder[0].classList.contains('main-copy')).to.be.true;
    tabletOrder.splice(0, 1);
    desktopOrder.splice(0, 1);
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < tabletOrder.length; i++) {
      expect(tabletOrder[i].classList.contains(`order-${i}-tablet`)).to.be.true;
      expect(desktopOrder[i].classList.contains(`order-${i}-desktop`)).to.be.true;
    }
  });
  it('order of con-blocks is the same as mobile if there is no order class', async () => {
    const nonOrderMarquee = document.querySelector('#hero-all');
    const nonOrderCopy = nonOrderMarquee.querySelector('.copy');
    const mobileOrder = [...nonOrderCopy.children];
    const tabletOrder = getViewportOrder('tablet', nonOrderCopy, mobileOrder);
    for (const [index, el] of tabletOrder.entries()) expect(el === mobileOrder[index]).to.be.true;
  });
});
