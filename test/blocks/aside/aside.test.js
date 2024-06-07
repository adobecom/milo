import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { waitForElement } from '../../helpers/waitfor.js';
import { setConfig } from '../../../libs/utils/utils.js';

const { default: init } = await import('../../../libs/blocks/aside/aside.js');
const standardBody = await readFile({ path: './mocks/standard.html' });
const splitBody = await readFile({ path: './mocks/split.html' });
const conf = { miloLibs: 'http://localhost:2000/libs' };

setConfig(conf);

describe('aside', () => {
  // describe('standard', () => {
  //   before(() => {
  //     document.body.innerHTML = standardBody;
  //     const blocks = document.querySelectorAll('.aside');
  //     blocks.forEach((el) => init(el));
  //   });

  //   it('allows a background color', () => {
  //     const el = document.querySelector('#test-default');
  //     expect(window.getComputedStyle(el)?.backgroundColor).to.equal('rgb(238, 238, 238)');
  //   });

  //   it('allows a background image', () => {
  //     expect(document.querySelector('#test-default-2 .background img')).to.exist;
  //   });

  //   it('allows an icon image', () => {
  //     expect(document.querySelector('#test-default .icon-area img')).to.exist;
  //   });

  //   it('has Detail M by default', () => {
  //     expect(document.querySelector('#test-default .detail-m')).to.exist;
  //   });

  //   it('has Heading XL by default', () => {
  //     expect(document.querySelector('#test-default .heading-xl')).to.exist;
  //   });

  //   it('has Body S by default', () => {
  //     expect(document.querySelector('#test-default p.body-s')).to.exist;
  //   });

  //   it('allows a cta', () => {
  //     expect(document.querySelector('#test-default .action-area .con-button')).to.exist;
  //   });

  //   it('allows supplemental text', () => {
  //     expect(document.querySelector('#test-default .supplemental-text')).to.exist;
  //   });

  //   it('allows a foreground image', () => {
  //     expect(document.querySelector('#test-default .foreground .image img')).to.exist;
  //   });

  //   it('allows text overrides', () => {
  //     const el = document.querySelector('#test-text-overrides');
  //     expect(el.querySelector('.detail-l')).to.exist;
  //     expect(el.querySelector('.heading-l')).to.exist;
  //     expect(el.querySelector('p.body-m')).to.exist;
  //   });

  //   it('allows Title L to override Detail', () => {
  //     expect(document.querySelector('#test-title .detail-m.title-l')).to.exist;
  //   });

  //   it('allows an avatar', () => {
  //     expect(document.querySelector('#test-avatar .avatar-area img')).to.exist;
  //   });

  //   it('allows a product lockup', () => {
  //     expect(document.querySelector('#test-lockup .lockup-area img')).to.exist;
  //   });
  // });

  describe('split', () => {
    before(() => {
      document.body.innerHTML = splitBody;
      const blocks = document.querySelectorAll('.aside');
      blocks.forEach(async (el) => {
        await init(el);
      });
    });

    it('allows a background color', async () => {
      const el = await waitForElement('#test-default');
      expect(window.getComputedStyle(el)?.backgroundColor).to.equal('rgb(30, 30, 30)');
    });

    it('allows an icon image', async () => {
      const el = await waitForElement('#test-default .icon-area img');
      expect(el).to.exist;
    });

    it('has Detail M by default', async () => {
      const el = await waitForElement('#test-default .detail-m');
      expect(el).to.exist;
    });

    it('has Heading XL by default', async () => {
      const el = await waitForElement('#test-default .heading-xl');
      expect(el).to.exist;
    });

    it('has Body S by default', async () => {
      const el = await waitForElement('#test-default p.body-s');
      expect(el).to.exist;
    });

    it('allows icon stack', async () => {
      const el = await waitForElement('#test-default .icon-stack-area');
      expect(el).to.exist;
    });

    it('allows a cta', async () => {
      const el = await waitForElement('#test-default .action-area .con-button');
      expect(el).to.exist;
    });

    it('allows supplemental text', async () => {
      const el = await waitForElement('#test-default .supplemental-text');
      expect(el).to.exist;
    });

    it('allows a split image', async () => {
      const el = await waitForElement('#test-default .split-image img');
      expect(el).to.exist;
    });

    it('allows text overrides', async () => {
      const el = await waitForElement('#test-text-overrides');
      expect(el.querySelector('.detail-l')).to.exist;
      expect(el.querySelector('.heading-l')).to.exist;
      expect(el.querySelector('p.body-m')).to.exist;
    });

    it('allows Title L to override Detail', async () => {
      const el = await waitForElement('#test-title .detail-m.title-l');
      expect(el).to.exist;
    });

    it('allows an avatar', async () => {
      const el = await waitForElement('#test-avatar .avatar-area img');
      expect(el).to.exist;
    });

    it('allows a product lockup', async () => {
      const el = await waitForElement('#test-lockup .lockup-area img');
      expect(el).to.exist;
    });
  });
});
