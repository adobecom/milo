import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

document.body.innerHTML = await readFile({ path: './mocks/body.html' });
const { default: init } = await import('../../../libs/blocks/nav-marquee/nav-marquee.js');

describe('nav-marquee', () => {
  const marquees = document.querySelectorAll('.nav-marquee');
  marquees.forEach((marquee) => {
    init(marquee);
  });

  describe('marquee', () => {
    it('has offer table container', () => {
      const contentTable = marquees[0].querySelectorAll('.content-table');
      expect(contentTable).to.exist;
    });
    it('has table header', () => {
      const offerTitle = marquees[0].querySelectorAll('.offer-title');
      expect(offerTitle).to.exist;
    });
    it('has table footer', () => {
      const offerFooter = marquees[0].querySelectorAll('.offer-footer');
      expect(offerFooter).to.exist;
    });
    it('Link table sections', () => {
      const navMarquee = document.getElementsByClassName('.nav-marquee');
      navMarquee.forEach(init);

      const tableContainer = document.querySelector('.content-table');
      const sections = tableContainer.querySelectorAll('.offer-item > li');
      console.log(sections);
      expect(sections).to.be.a('string');

      const href = sections[0].getElementsByTagName('a')[0].innerHTML;

      expect(href).to.be.a('string');
      //expect(href).to.contain('#what-we-offer');
    });
  });
});
