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
});
