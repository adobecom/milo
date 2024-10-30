import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { stub } from 'sinon';
import { waitForElement } from '../../helpers/waitfor.js';
import { setConfig } from '../../../libs/utils/utils.js';

window.lana = { log: stub() };

const conf = {
  pathname: '/au/test.html',
  locales: { au: { ietf: 'en-AU', tk: 'hah7vzn.css', prefix: '/au' } },
  locale: { prefix: '/au' },
};
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
  it('support AU ABM prices', async () => {
    const testPriceEl = await waitForElement('.test-price');
    const { checkIfStPriceAddedForAu } = await import('../../../libs/blocks/merch/au-merch.js');
    await checkIfStPriceAddedForAu(testPriceEl);
    expect(testPriceEl).to.exist;
  });
});
