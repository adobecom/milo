import { readFile, setViewport } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

document.head.innerHTML = "<link rel='stylesheet' href='../../../libs/blocks/media/media.css'>";
document.body.innerHTML = await readFile({ path: './mocks/body.html' });
const { default: init } = await import('../../../libs/blocks/media/media.js');
describe('media', () => {
  const medias = document.querySelectorAll('.media');
  medias.forEach((media) => {
    init(media);
  });
  describe('default media medium', () => {
    it('has a heading-m', () => {
      const heading = medias[0].querySelector('.heading-m');
      expect(heading).to.exist;
    });
    it('has a supporting image', () => {
      const image = medias[0].querySelector('.foreground .image img');
      expect(image).to.exist;
    });
    it('has a icon area', () => {
      const iconArea = medias[0].querySelector('.icon-area');
      expect(iconArea).to.exist;
    });
    it('has an icon area with blue button', () => {
      const actionArea = medias[3].querySelector('.action-area');
      expect(actionArea).to.exist;
      const blueButton = actionArea.querySelector('.con-button.blue');
      expect(blueButton).to.exist;
    });
  });
  describe('dark media large', () => {
    it('has a heading-xl', () => {
      const heading = medias[1].querySelector('.heading-xl');
      expect(heading).to.exist;
    });
    it('has a supporting bg color', () => {
      const isDark = medias[1].classList.contains('dark');
      expect(isDark).to.exist;
    });
  });
  describe('simple media ', () => {
    it('does not have CTA', () => {
      const buttons = medias[2].querySelectorAll('em a, strong a');
      expect(buttons.length).to.equal(0);
    });
    it('does not have a dark variant', () => {
      const isDark = medias[2].classList.contains('dark');
      expect(isDark).to.equal(false);
    });
  });
  describe('subcopy with links media', () => {
    it('does have subcopy with links', () => {
      const links = medias[4].querySelectorAll('h3.heading-xs ~ p.subcopy-link > a');
      expect(links.length).to.greaterThanOrEqual(2);
    });
  });
  describe('media with qr-code', () => {
    it('does have qr-code image', () => {
      const qrCodeImg = medias[5].querySelector('img.qr-code-img');
      expect(qrCodeImg).to.exist;
    });
    it('does have CTA for google-play', () => {
      const googlePlayCta = medias[5].querySelector('a.google-play');
      expect(googlePlayCta).to.exist;
    });
    it('does have CTA for app-store', () => {
      const appStoreCta = medias[5].querySelector('a.app-store');
      expect(appStoreCta).to.exist;
    });
    it('desktop view has visibile qr code image and no google-play and app-store CTA', async () => {
      await setViewport({ width: 1200, height: 100 });
      const qrCodeImg = medias[5].querySelector('img.qr-code-img');
      const qrCTA = medias[5].querySelectorAll('.qr-button-container');
      expect(window.getComputedStyle(qrCodeImg).getPropertyValue('display')).not.to.equal('none');
      qrCTA.forEach((cta) => {
        expect(window.getComputedStyle(cta).getPropertyValue('display')).to.equal('none');
      });
    });
    it('mobile view has visibile google-play and app-store CTA and no qr code image', async () => {
      await setViewport({ width: 600, height: 100 });
      const qrCodeImg = medias[5].querySelector('img.qr-code-img');
      const qrCTA = medias[5].querySelectorAll('.qr-button-container');
      expect(window.getComputedStyle(qrCodeImg).getPropertyValue('display')).to.equal('none');
      qrCTA.forEach((cta) => {
        expect(window.getComputedStyle(cta).getPropertyValue('display')).not.to.equal('none');
      });
    });
    it('tablet view has visibile google-play and app-store CTA and no qr code image', async () => {
      await setViewport({ width: 1199, height: 100 });
      const qrCodeImg = medias[5].querySelector('img.qr-code-img');
      const qrCTA = medias[5].querySelectorAll('.qr-button-container');
      expect(window.getComputedStyle(qrCodeImg).getPropertyValue('display')).to.equal('none');
      qrCTA.forEach((cta) => {
        expect(window.getComputedStyle(cta).getPropertyValue('display')).not.to.equal('none');
      });
    });
  });
  describe('with bio variant', () => {
    it('has a bio avatar and icon-stack area', () => {
      const avatar = medias[6].querySelectorAll('.avatar');
      const iconStack = medias[6].querySelectorAll('.icon-stack-area');
      expect(avatar).to.exist;
      expect(iconStack).to.exist;
    });
  });
});
