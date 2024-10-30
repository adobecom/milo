import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { stub } from 'sinon';
import { waitForElement } from '../../helpers/waitfor.js';
import { setConfig } from '../../../libs/utils/utils.js';

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
});
