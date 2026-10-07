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
  describe('default variant', () => {
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

    it('builds the chiclet row with the icon and the heading', () => {
      const chicletRow = content.querySelector('.pm-foreground .pm-chiclet-row');
      expect(chicletRow).to.exist;
      expect(chicletRow.querySelector('img.icon')).to.exist;

      // The heading keeps its authored tag; the block no longer adds `heading-super`.
      const heading = chicletRow.querySelector('h1');
      expect(heading).to.exist;
      expect(heading.textContent).to.equal('Photoshop');
    });

    it('rewrites the federated svg icon src to the absolute federal URL', () => {
      const icon = content.querySelector('.pm-chiclet-row img.icon');
      expect(icon.getAttribute('src')).to.equal(FEDERAL_SVG);
    });

    it('demotes the sub-headline heading to a styled paragraph (no heading-level jump)', () => {
      const subtext = content.querySelector('.pm-foreground > p.pm-subtext');
      expect(subtext).to.exist;
      expect(subtext.classList.contains('heading-5')).to.be.true;
      expect(subtext.textContent).to.equal(
        'Astonishingly powerful and precise, Photoshop is the industry choice.',
      );
      // the source <h5> must not survive in the output (keeps the heading outline valid)
      expect(content.querySelector('.pm-foreground h5')).to.be.null;
    });

    it('builds a merch card in the promo area', () => {
      const card = content.querySelector('.pm-promo-area .pm-merch-card');
      expect(card).to.exist;
      expect(card.querySelector('.pm-merch-content')).to.exist;
    });

    it('classes the mas-fields and folds the commitment into the price', () => {
      const cardContent = content.querySelector('.pm-merch-content');
      expect(cardContent.querySelector('.mas-description')).to.exist;

      const price = cardContent.querySelector('.mas-price.heading-5');
      expect(price).to.exist;

      const commitment = price.parentElement.querySelector('.mas-price-commitment');
      expect(commitment).to.exist;
      expect(commitment.textContent).to.equal('Annual, billed monthly');
    });

    it('moves the ctas into the cta wrapper, not the content', () => {
      const ctas = content.querySelectorAll('.pm-merch-ctas .con-button');
      expect(ctas.length).to.equal(2);
      expect(content.querySelector('.pm-merch-content .con-button')).to.be.null;
    });
  });

  describe('special-promo variant', () => {
    it('flips the card to the opposite mode of the hero (light hero -> dark card)', async () => {
      const block = await initBlock('./mocks/special-promo.html');
      const card = block.querySelector('.pm-merch-card');
      expect(card).to.exist;
      expect(card.classList.contains('dark')).to.be.true;
    });
  });

  describe('fallback / negative branches', () => {
    it('leaves the promo area empty when there is no second column', async () => {
      const block = await initBlock('./mocks/no-promo.html');
      const promoArea = block.querySelector('.pm-promo-area');
      expect(promoArea).to.exist;
      expect(promoArea.children.length).to.equal(0);
    });

    it('builds a chiclet row with only the heading when there is no icon', async () => {
      const block = await initBlock('./mocks/no-icon.html');
      const chicletRow = block.querySelector('.pm-chiclet-row');
      expect(chicletRow).to.exist;
      expect(chicletRow.querySelector('img.icon')).to.be.null;
      expect(chicletRow.querySelector('h1')).to.exist;
    });

    it('is a no-op and does not throw when the block has no rows', async () => {
      const block = await initBlock('./mocks/empty.html');
      expect(block.querySelector('.pm-content')).to.be.null;
      expect(block.children.length).to.equal(0);
    });
  });
});
