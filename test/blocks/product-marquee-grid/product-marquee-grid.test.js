import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

import init from '../../../libs/c2/blocks/product-marquee-grid/product-marquee-grid.js';

const FEDERAL_SVG_ROOT = 'https://main--federal--adobecom.aem.page/federal/assets/svgs';

async function initBlock(path) {
  document.body.innerHTML = await readFile({ path });
  const block = document.querySelector('.product-marquee-grid');
  await init(block);
  return block;
}

describe('Product Marquee Grid', () => {
  describe('default (icon, subtext, merch card with mas fields and ctas)', () => {
    let block;
    let content;
    beforeEach(async () => {
      block = await initBlock('./mocks/default.html');
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
      expect(chicletRow.querySelector('img.icon')).to.exist;

      const heading = chicletRow.querySelector('h1.heading-super');
      expect(heading).to.exist;
      expect(heading.textContent).to.equal('Photoshop');
    });

    it('rewrites the federated svg icon src to the absolute federal URL', () => {
      const icon = content.querySelector('.pm-chiclet-row img.icon');
      expect(icon.getAttribute('src')).to.equal(`${FEDERAL_SVG_ROOT}/photoshop.svg`);
    });

    it('marks the left-column subtext as pm-subtext regardless of tag', () => {
      const subtext = content.querySelectorAll('.pm-foreground > .pm-subtext');
      expect(subtext.length).to.equal(1);
      // subtext is authored as a heading (h5), not a paragraph
      expect(subtext[0].tagName).to.equal('H5');
      expect(subtext[0].textContent).to.contain('Astonishingly powerful and precise');
      // the super heading must not be treated as subtext
      expect(content.querySelector('.pm-foreground > h1.pm-subtext')).to.be.null;
    });

    it('decorates the mas fields, mapping only known field names', () => {
      const merchContent = content.querySelector('.pm-merch-card .pm-merch-content');
      expect(merchContent).to.exist;

      const price = merchContent.querySelector('mas-field[field="prices"]');
      expect(price.classList.contains('mas-price')).to.be.true;
      expect(price.classList.contains('heading-5')).to.be.true;

      const description = merchContent.querySelector('mas-field[field="description"]');
      expect(description.classList.contains('mas-description')).to.be.true;

      // unmapped fields (subtitle) get no mas class
      const subtitle = merchContent.querySelector('mas-field[field="subtitle"]');
      expect(subtitle.classList.contains('mas-price')).to.be.false;
      expect(subtitle.classList.contains('mas-description')).to.be.false;
    });

    it('folds the trailing commitment paragraph into the price parent', () => {
      const merchContent = content.querySelector('.pm-merch-content');
      const priceParent = merchContent.querySelector(':has(> .mas-price)');
      const commitment = priceParent.querySelector('.mas-price-commitment');
      expect(commitment).to.exist;
      expect(commitment.textContent).to.equal('Annual, paid monthly');
      // the commitment must no longer be a standalone child of the merch content
      expect(merchContent.querySelector(':scope > .mas-price-commitment')).to.be.null;
    });

    it('moves every cta into a single pm-merch-ctas wrapper in authored order', () => {
      const ctas = content.querySelector('.pm-merch-card .pm-merch-ctas');
      expect(ctas).to.exist;
      expect(ctas.children.length).to.equal(2);

      // the wcs checkout link is collected even though it is not a con-button
      const checkoutLink = ctas.children[0];
      expect(checkoutLink.getAttribute('is')).to.equal('checkout-link');
      expect(checkoutLink.getAttribute('data-wcs-osi')).to.exist;
      expect(checkoutLink.textContent.trim()).to.equal('Free trial');

      // the decorated em cta follows, styled as an outline con-button
      const planLink = ctas.children[1];
      expect(planLink.classList.contains('con-button')).to.be.true;
      expect(planLink.classList.contains('outline')).to.be.true;
      expect(planLink.getAttribute('href')).to.equal('https://www.adobe.com/photoshop/pricing.html');

      // ctas must not leak back into the merch content
      expect(content.querySelector('.pm-merch-content a[data-wcs-osi]')).to.be.null;
      expect(content.querySelector('.pm-merch-content a.con-button')).to.be.null;
    });
  });

  describe('fallback / negative branches', () => {
    it('builds a heading-only chiclet and empty promo area for a single column', async () => {
      const block = await initBlock('./mocks/single-column.html');
      const chicletRow = block.querySelector('.pm-chiclet-row');
      expect(chicletRow.querySelector('img.icon')).to.be.null;
      expect(chicletRow.querySelector('h1.heading-super')).to.exist;

      const promoArea = block.querySelector('.pm-promo-area');
      expect(promoArea).to.exist;
      expect(promoArea.children.length).to.equal(0);
      expect(block.querySelector('.pm-merch-card')).to.be.null;
    });

    it('omits the ctas wrapper when the merch column has no cta', async () => {
      const block = await initBlock('./mocks/no-cta.html');
      const merchCard = block.querySelector('.pm-merch-card');
      expect(merchCard).to.exist;
      expect(merchCard.querySelector('.pm-merch-content')).to.exist;
      expect(merchCard.querySelector('.pm-merch-ctas')).to.be.null;
    });

    it('is a no-op and does not throw when the block has no rows', async () => {
      const block = await initBlock('./mocks/empty.html');
      expect(block.querySelector('.pm-content')).to.be.null;
      expect(block.children.length).to.equal(0);
    });
  });
});
