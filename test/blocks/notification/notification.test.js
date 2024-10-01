import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { setConfig } from '../../../libs/utils/utils.js';

const locales = { '': { ietf: 'en-US', tk: 'hah7vzn.css' } };
const conf = { locales };
setConfig(conf);

const mockBody = await readFile({ path: './mocks/body.html' });
const { default: init } = await import('../../../libs/blocks/notification/notification.js');

describe('notification', async () => {
  let notifs;
  beforeEach(async () => {
    document.body.innerHTML = mockBody;
    notifs = document.querySelectorAll('.notification');
    notifs.forEach(async (notif) => {
      await init(notif);
    });
  });

  afterEach(() => {
    document.body.innerHTML = '';
    notifs = [];
  });

  describe('banner notifications (default)', () => {
    it('has a heading-m', () => {
      const heading = notifs[0].querySelector('.heading-m');
      expect(heading).to.exist;
    });
    it('has a body-m', () => {
      const body = notifs[0].querySelector('.body-m');
      expect(body).to.exist;
    });
    it('has CTAs', () => {
      const ctas = notifs[0].querySelector('.action-area > a');
      expect(ctas).to.exist;
    });
    it('has an image', () => {
      const img = notifs[0].querySelector('.foreground .image img');
      expect(img).to.exist;
    });
    it('supports a bottom border', () => {
      const border = notifs[2].querySelector(':scope > .border');
      expect(border).to.exist;
    });
  });

  describe('ribbon notifications', () => {
    let ribbons;
    beforeEach(() => {
      ribbons = [...notifs].filter((e) => e.classList.contains('ribbon'));
    });
    it('supports multiple icons', () => {
      const icons = ribbons[0].querySelectorAll('.icon-area picture');
      expect(icons.length).to.be.greaterThan(1);
    });
    it('has large buttons by default', () => {
      const btn = ribbons[0].querySelector('a.con-button');
      expect(btn.classList.contains('button-l')).to.be.true;
    });
    it('can be closed', () => {
      const close = ribbons[0].querySelector('button.close');
      close.dispatchEvent(new MouseEvent('click'));
      expect(close.closest('.notification').style.display).to.equal('none');
    });
  });

  describe('pill notifications', () => {
    let pills;
    beforeEach(() => {
      pills = [...notifs].filter((e) => e.classList.contains('pill'));
    });
    it('supports variant without a close button', () => {
      const close = pills[2].querySelector('button.close');
      expect(close).to.not.exist;
    });
    it('has large buttons by default', () => {
      const btn = pills[0].querySelector('a.con-button');
      expect(btn.classList.contains('button-l')).to.be.true;
    });
    it('can be closed', () => {
      const close = pills[0].querySelector('button.close');
      close.dispatchEvent(new MouseEvent('click'));
      expect(close.closest('.notification').style.display).to.equal('none');
    });
  });
});
