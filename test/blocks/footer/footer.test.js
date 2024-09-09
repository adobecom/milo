import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { setConfig } from '../../../libs/utils/utils.js';

const { Footer } = await import('../../../libs/blocks/footer/footer.js');

describe('Footer', () => {
  describe('copyright ul', () => {
    let privacy = null;

    before(async () => {
      const copyright = await readFile({ path: './mocks/copyright-ul.html' });
      const parser = new DOMParser();
      const copyrightDom = parser.parseFromString(copyright, 'text/html');
      document.body.innerHTML = '<footer></footer>';
      const footer = new Footer(copyrightDom.body, document.querySelector('footer'));
      privacy = footer.decoratePrivacy();
    });

    it('adds ul', () => {
      expect(privacy.querySelector('ul.footer-privacy-links')).not.to.be.null;
    });

    it('adds li', () => {
      expect(privacy.querySelector('li.footer-privacy-link')).not.to.be.null;
    });

    it('allows text without link', () => {
      expect(privacy.querySelector('li#no-link')).not.to.be.null;
    });

    it('supports second line of text', () => {
      expect(privacy.querySelector('p:nth-of-type(2)')).not.to.be.null;
    });
  });

  describe('copyright p', async () => {
    let privacy = null;

    before(async () => {
      const copyright = await readFile({ path: './mocks/copyright-p.html' });
      const parser = new DOMParser();
      const copyrightDom = parser.parseFromString(copyright, 'text/html');
      document.body.innerHTML = '<footer></footer>';
      const footer = new Footer(copyrightDom.body, document.querySelector('footer'));
      privacy = footer.decoratePrivacy();
    });

    it('adds ul', () => {
      expect(privacy.querySelector('ul.footer-privacy-links')).not.to.be.null;
    });

    it('adds li', () => {
      expect(privacy.querySelector('li.footer-privacy-link')).not.to.be.null;
    });

    it('supports second line of text', () => {
      expect(privacy.querySelector('p:nth-of-type(2)')).not.to.be.null;
    });
  });

  describe('region selector', async () => {
    let infoRow = null;

    before(async () => {
      const config = {
        codeRoot: '/libs',
        autoBlocks: [{ }],
      };
      setConfig(config);
      const regionSelector = await readFile({ path: './mocks/region-selector.html' });
      const parser = new DOMParser();
      const regionSelectorDom = parser.parseFromString(regionSelector, 'text/html');
      document.body.innerHTML = '<footer></footer>';
      const footer = new Footer(regionSelectorDom.body, document.querySelector('footer'));
      infoRow = await footer.createInfoRow();
    });

    it('expect region selector modal to be visible', () => {
      expect(infoRow).not.to.be.null;
      const button = infoRow.querySelector('.footer-region button');
      button.click();
      expect(button.getAttribute('aria-expanded')).to.equal('true');
      expect(button.classList.contains('inline-dialog-active')).to.be.true;
    });

    it('expect region selector modal to be closed on clicking outside', () => {
      expect(infoRow).not.to.be.null;
      const button = infoRow.querySelector('.footer-region button');
      document.body.click();
      expect(button.getAttribute('aria-expanded')).to.equal('false');
      expect(button.classList.contains('inline-dialog-active')).to.be.false;
    });
  });
});
