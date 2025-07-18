/* eslint-disable no-undef */
import { expect } from '@esm-bundle/chai';
import { hydrate, processPrices, processDescription, processCTAs } from '../../../libs/features/mas/src/hydrate.js';
import '../../../libs/features/mas/src/merch-card.js';
import '../../../libs/features/mas/src/mas-tooltip.js';

describe('MasTooltip Hydration', () => {
  let merchCard;

  beforeEach(() => {
    document.body.innerHTML = '';
    merchCard = document.createElement('merch-card');
    document.body.appendChild(merchCard);
  });

  afterEach(() => {
    document.body.removeChild(merchCard);
  });

  describe('Tooltip processing in fields', () => {
    it('should preserve mas-tooltip elements in prices field', async () => {
      const fields = { prices: '<span>$99.99/mo <mas-tooltip content="Billed annually" placement="top">*</mas-tooltip></span>' };

      const mapping = { prices: { slot: 'prices', tag: 'div' } };

      processPrices(fields, merchCard, mapping);

      await merchCard.updateComplete;

      const pricesSlot = merchCard.querySelector('[slot="prices"]');
      expect(pricesSlot).to.exist;

      const masTooltip = pricesSlot.querySelector('mas-tooltip');
      expect(masTooltip).to.exist;
      expect(masTooltip.getAttribute('content')).to.equal('Billed annually');
      expect(masTooltip.getAttribute('placement')).to.equal('top');
      expect(masTooltip.textContent).to.equal('*');
    });

    it('should preserve mas-tooltip elements in description field', async () => {
      const fields = { description: '<p>Professional tools <mas-tooltip content="Includes all Creative Cloud apps" placement="right">for creative work</mas-tooltip></p>' };

      const mapping = { description: { slot: 'body-xs', tag: 'div' } };

      processDescription(fields, merchCard, mapping);

      await merchCard.updateComplete;

      const descSlot = merchCard.querySelector('[slot="body-xs"]');
      expect(descSlot).to.exist;

      const masTooltip = descSlot.querySelector('mas-tooltip');
      expect(masTooltip).to.exist;
      expect(masTooltip.getAttribute('content')).to.equal('Includes all Creative Cloud apps');
      expect(masTooltip.getAttribute('placement')).to.equal('right');
    });

    it('should preserve mas-tooltip elements in CTAs field', async () => {
      const fields = { ctas: '<a href="#" class="accent">Buy Now</a> <mas-tooltip content="30-day money back guarantee" placement="bottom">ⓘ</mas-tooltip>' };

      const mapping = { ctas: { slot: 'footer', tag: 'div' } };

      processCTAs(fields, merchCard, mapping, 'catalog');

      await merchCard.updateComplete;

      const footerSlot = merchCard.querySelector('[slot="footer"]');
      expect(footerSlot).to.exist;

      const masTooltip = footerSlot.querySelector('mas-tooltip');
      expect(masTooltip).to.exist;
      expect(masTooltip.getAttribute('content')).to.equal('30-day money back guarantee');
      expect(masTooltip.getAttribute('placement')).to.equal('bottom');
      expect(masTooltip.textContent).to.equal('ⓘ');
    });

    it('should handle multiple tooltips in the same field', async () => {
      const fields = {
        description: `
          <ul>
            <li>Feature 1 <mas-tooltip content="Details about feature 1">ⓘ</mas-tooltip></li>
            <li>Feature 2 <mas-tooltip content="Details about feature 2">ⓘ</mas-tooltip></li>
            <li>Feature 3 <mas-tooltip content="Details about feature 3">ⓘ</mas-tooltip></li>
          </ul>
        `,
      };

      const mapping = { description: { slot: 'body-xs', tag: 'div' } };

      processDescription(fields, merchCard, mapping);

      await merchCard.updateComplete;

      const descSlot = merchCard.querySelector('[slot="body-xs"]');
      const tooltips = descSlot.querySelectorAll('mas-tooltip');

      expect(tooltips.length).to.equal(3);
      expect(tooltips[0].getAttribute('content')).to.equal('Details about feature 1');
      expect(tooltips[1].getAttribute('content')).to.equal('Details about feature 2');
      expect(tooltips[2].getAttribute('content')).to.equal('Details about feature 3');
    });
  });

  describe('Full card hydration with tooltips', () => {
    it('should hydrate a complete card with tooltips in multiple fields', async () => {
      const fragment = {
        id: 'test-card',
        fields: {
          variant: 'catalog',
          badge: 'Popular',
          cardTitle: 'Creative Cloud All Apps',
          prices: '<span>$54.99/mo <mas-tooltip content="Price after first year" placement="top">*</mas-tooltip></span>',
          description: 'Get 20+ creative apps <mas-tooltip content="Including Photoshop, Illustrator, Premiere Pro, and more">and services</mas-tooltip>',
          ctas: '<a href="#buy" class="accent">Buy now</a>',
        },
      };

      // Mock the variantLayout
      merchCard.variantLayout = {
        aemFragmentMapping: {
          title: { slot: 'heading-m', tag: 'h3' },
          badge: { slot: 'ribbon', tag: 'span' },
          prices: { slot: 'price', tag: 'div' },
          description: { slot: 'body-xs', tag: 'div' },
          ctas: { slot: 'footer', tag: 'div' },
        },
      };

      await hydrate(fragment, merchCard);

      // Check that tooltips are preserved in the hydrated content
      const priceTooltip = merchCard.querySelector('[slot="price"] mas-tooltip');
      const descTooltip = merchCard.querySelector('[slot="body-xs"] mas-tooltip');

      expect(priceTooltip).to.exist;
      expect(priceTooltip.getAttribute('content')).to.equal('Price after first year');

      expect(descTooltip).to.exist;
      expect(descTooltip.getAttribute('content')).to.equal('Including Photoshop, Illustrator, Premiere Pro, and more');
    });
  });
});
