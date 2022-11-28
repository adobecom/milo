import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

document.body.innerHTML = await readFile({ path: './mocks/body.html' });
const { default: init } = await import('../../../libs/blocks/media/media.js');
describe('media', () => {
  const medias = document.querySelectorAll('.media');
  medias.forEach((media) => {
    init(media);
  });
  describe('default media medium', () => {
    it('has a heading-M', () => {
      const heading = medias[0].querySelector('.heading-M');
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
  });
  describe('dark media large', () => {
    it('has a heading-XL', () => {
      const heading = medias[1].querySelector('.heading-XL');
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
});
