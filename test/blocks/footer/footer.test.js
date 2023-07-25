import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

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
});
