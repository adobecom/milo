import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

import init from '../../../libs/c2/blocks/product-marquee-grid/product-marquee-grid.js';

const FEDERAL_SVG = 'https://main--federal--adobecom.aem.page/federal/assets/svgs/photoshop.svg';

async function initBlock(path) {
  document.body.innerHTML = await readFile({ path });
  const block = document.querySelector('.product-marquee-grid');
  await init(block);
  return block;
}

describe('Product Marquee Grid', () => {
  describe('soft offer (default) variant', () => {
    let block;
    let content;
    beforeEach(async () => {
      block = await initBlock('./mocks/soft-offer.html');
      content = block.querySelector('.pm-content');
    });

    it('replaces the block content with a single pm-content container', () => {
      expect(block.children.length).to.equal(1);
      expect(content).to.exist;
      expect(content.classList.contains('container')).to.be.true;
      expect(content.children.length).to.equal(2);
      expect(content.children[0].classList.contains('pm-foreground')).to.be.true;
      expect(content.children[1].classList.contains('pm-promo-area')).to.be.true;
    });

    it('builds the chiclet row with the icon and the super heading', () => {
      const chicletRow = content.querySelector('.pm-foreground .pm-chiclet-row');
      expect(chicletRow).to.exist;

      const icon = chicletRow.querySelector('img.icon');
      expect(icon).to.exist;

      const heading = chicletRow.querySelector('h2.heading-super');
      expect(heading).to.exist;
      expect(heading.textContent).to.equal('Photoshop');
    });

    it('rewrites the federated svg icon src to the absolute federal URL', () => {
      const icon = content.querySelector('.pm-chiclet-row img.icon');
      expect(icon.getAttribute('src')).to.equal(FEDERAL_SVG);
    });

    it('marks body paragraphs with heading-5 and excludes the label paragraph', () => {
      const bodyEls = content.querySelectorAll('.pm-foreground > p.heading-5');
      expect(bodyEls.length).to.equal(1);
      expect(bodyEls[0].textContent).to.equal(
        'Create and enhance photographs, illustrations, and 3D artwork.',
      );
      // the label paragraph is moved into the promo cta, not left in the foreground
      expect(content.querySelector('.pm-foreground .pm-promo-cta-label')).to.be.null;
    });

    it('builds a soft-offer cta with the trailing paragraph as the label', () => {
      const cta = content.querySelector('.pm-promo-area .pm-promo-cta');
      expect(cta).to.exist;

      const label = cta.querySelector('.pm-promo-cta-label');
      expect(label).to.exist;
      expect(label.textContent).to.equal('Save over 40% on your first year.');

      const button = cta.querySelector('a.con-button');
      expect(button).to.exist;
      expect(button.getAttribute('href')).to.equal('https://www.adobe.com/buy/photoshop');
      expect(button.textContent.trim()).to.equal('Buy now');

      // soft offer must NOT produce the featured-offer promo button
      expect(content.querySelector('.pm-promo-button')).to.be.null;
    });
  });

  describe('featured-offer variant', () => {
    let block;
    let content;
    beforeEach(async () => {
      block = await initBlock('./mocks/featured-offer.html');
      content = block.querySelector('.pm-content');
    });

    it('builds a promo button instead of a soft-offer cta', () => {
      const promoButton = content.querySelector('.pm-promo-area a.pm-promo-button');
      expect(promoButton).to.exist;
      expect(promoButton.getAttribute('href')).to.equal('https://www.adobe.com/buy/lightroom');

      const text = promoButton.querySelector('span.pm-promo-text.eyebrow');
      expect(text).to.exist;
      expect(text.textContent).to.equal('Learn more');

      const chevron = promoButton.querySelector('span.pm-promo-chevron');
      expect(chevron).to.exist;
      expect(chevron.getAttribute('aria-hidden')).to.equal('true');
      expect(chevron.querySelector('svg')).to.exist;

      // the soft-offer cta path must NOT run for the featured variant
      expect(content.querySelector('.pm-promo-cta')).to.be.null;
    });

    it('treats every non-cta paragraph as body copy (no label extraction)', () => {
      const bodyEls = content.querySelectorAll('.pm-foreground > p.heading-5');
      expect(bodyEls.length).to.equal(2);
      expect(content.querySelector('.pm-promo-cta-label')).to.be.null;
    });
  });

  describe('fallback / negative branches', () => {
    it('leaves the promo area empty when the column has no cta link', async () => {
      const block = await initBlock('./mocks/no-cta.html');
      const promoArea = block.querySelector('.pm-promo-area');
      expect(promoArea).to.exist;
      expect(promoArea.children.length).to.equal(0);
      expect(block.querySelector('.pm-promo-cta')).to.be.null;
      expect(block.querySelector('.pm-promo-button')).to.be.null;
    });

    it('omits the cta label when there is only a single paragraph', async () => {
      const block = await initBlock('./mocks/single-para.html');
      const cta = block.querySelector('.pm-promo-cta');
      expect(cta).to.exist;
      expect(cta.querySelector('.pm-promo-cta-label')).to.be.null;
      expect(cta.querySelector('a.con-button')).to.exist;

      const bodyEls = block.querySelectorAll('.pm-foreground > p.heading-5');
      expect(bodyEls.length).to.equal(1);
    });

    it('builds a chiclet row with only the heading when there is no icon', async () => {
      const block = await initBlock('./mocks/no-icon.html');
      const chicletRow = block.querySelector('.pm-chiclet-row');
      expect(chicletRow).to.exist;
      expect(chicletRow.querySelector('img.icon')).to.be.null;
      expect(chicletRow.querySelector('h2.heading-super')).to.exist;
    });

    it('is a no-op and does not throw when the block has no rows', async () => {
      const block = await initBlock('./mocks/empty.html');
      expect(block.querySelector('.pm-content')).to.be.null;
      expect(block.children.length).to.equal(0);
    });
  });
});
