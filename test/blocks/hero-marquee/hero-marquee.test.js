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
    const meta = Object.assign(document.createElement('meta'), { name: 'countdown-timer', content: '2024-08-26 12:00:00 PST,2026-08-30 00:00:00 PST' });
    document.head.appendChild(meta);
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

  it('Embedding countdown-timer inside hero-marquee', async () => {
    const marquee = document.getElementById('hero-cdt');
    expect(marquee.getElementsByClassName('timer-label')).to.exist;

    // update the meta tag for negative cases of countdown-timer
    const meta = document.querySelector('meta[name="countdown-timer"]');
    meta.setAttribute('content', '2024-08-26 12:00:00 PST');
    const { default: init } = await import('../../../libs/blocks/hero-marquee/hero-marquee.js');
    await init(marquee);
    expect(marquee.getElementsByClassName('timer-label')).to.not.exist;

    // update the meta tag for invalid countdown-timer
    meta.setAttribute('content', 'random,invalid');
    await init(marquee);
    expect(marquee.getElementsByClassName('timer-label')).to.not.exist;

    // update the meta tag for invalid countdown-timer
    document.head.removeChild(meta);
    await init(marquee);
    expect(marquee.getElementsByClassName('timer-label')).to.not.exist;
  });
});
