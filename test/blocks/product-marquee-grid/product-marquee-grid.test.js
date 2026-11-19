import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { loadStyle } from '../../../libs/utils/utils.js';
import { mepMasStudioUrls } from '../../../libs/blocks/merch/mas-mep-utils.js';
import { watchForMasContent, unwatchForMasContent } from '../../../libs/features/mep/mep-next/mep-mas.js';

import init from '../../../libs/c2/blocks/product-marquee-grid/product-marquee-grid.js';

const FEDERAL_SVG = 'https://main--federal--adobecom.aem.page/federal/assets/svgs/photoshop.svg';

const loadStyles = (path) => new Promise((resolve) => { loadStyle(path, resolve); });

async function initBlock(path) {
  document.body.innerHTML = await readFile({ path });
  const block = document.querySelector('.product-marquee-grid');
  await init(block);
  return block;
}

describe('Product Marquee Grid', () => {
  describe('MEP inline MAS editing', () => {
    afterEach(() => {
      unwatchForMasContent();
      delete document.body.dataset.mepMasHighlight;
      sinon.restore();
    });

    it('preserves Studio editing and live field state when demoting a foreground heading', async () => {
      document.body.innerHTML = await readFile({ path: './mocks/default.html' });
      const block = document.querySelector('.product-marquee-grid');
      const heading = block.querySelector('h5');
      heading.id = 'product-description';
      heading.innerHTML = '<mas-field field="description" data-mas-block="inline"><span data-role="mas-field-content">Product description</span></mas-field>';
      const leftField = heading.firstElementChild;
      const rightField = block.querySelector('mas-field[field="prices"]');
      rightField.dataset.masBlock = 'inline';
      const fields = [leftField, rightField];
      const urls = [
        'https://mas.adobe.com/studio.html#content-type=merch-card&query=left&field=description',
        'https://mas.adobe.com/studio.html#content-type=merch-card&query=right&field=prices',
      ];
      fields.forEach((field, index) => mepMasStudioUrls.set(field, urls[index]));
      const readySpy = sinon.spy();
      leftField.addEventListener('mas:ready', readySpy);
      const openStub = sinon.stub(window, 'open');
      document.body.dataset.mepMasHighlight = 'true';
      watchForMasContent();

      init(block);

      const renderedLeft = block.querySelector('.pm-foreground mas-field');
      expect(renderedLeft).to.equal(leftField);
      const subtext = renderedLeft.closest('.pm-subtext');
      expect(subtext.tagName).to.equal('DIV');
      expect(subtext.id).to.equal('product-description');
      expect(subtext.classList.contains('heading-5')).to.be.true;
      expect(block.querySelector('.pm-foreground h5')).to.be.null;
      leftField.dispatchEvent(new Event('mas:ready'));
      expect(readySpy.calledOnce).to.be.true;

      fields.forEach((field, index) => {
        sinon.stub(field, 'getBoundingClientRect').returns({ top: 100, right: 400, height: 30 });
        field.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true, cancelable: true, clientX: 300, clientY: 90 }));
        expect(openStub.getCall(index).args).to.deep.equal([urls[index], '_blank', 'noopener,noreferrer']);
      });
    });
  });

  describe('MAS body copy', () => {
    before(async () => {
      await new Promise((resolve, reject) => {
        loadStyle('/libs/c2/blocks/product-marquee-grid/product-marquee-grid.css', (status) => {
          if (status === 'error') reject(new Error('Failed to load Product Marquee Grid styles'));
          else resolve();
        });
      });
    });

    ['before decoration', 'after decoration', 'already unwrapped'].forEach((timing) => {
      [1, 2].forEach((paragraphs) => {
        it(`preserves ${paragraphs} paragraphs resolved ${timing} in both columns`, async () => {
          document.body.innerHTML = await readFile({ path: './mocks/default.html' });
          const block = document.querySelector('.product-marquee-grid');
          const foreground = block.firstElementChild.firstElementChild;
          foreground.querySelector('h5').outerHTML = '<p><mas-field field="shortDescription"><span data-role="mas-field-content"></span></mas-field></p>';
          const description = block.querySelector('mas-field[field="description"]');
          description.innerHTML = '<span data-role="mas-field-content"></span>';
          const fields = [foreground.querySelector('mas-field'), description];
          const resolve = () => fields.forEach((field) => {
            field.firstElementChild.innerHTML = `<p>Create with <span is="inline-price">US$9.99/mo</span>.</p>${paragraphs === 2 ? '<p><strong><a href="/terms" data-wcs-osi="terms">Terms apply</a></strong></p>' : ''}`;
          });
          if (timing !== 'after decoration') resolve();
          if (timing === 'already unwrapped') {
            fields.forEach((field) => field.parentElement.replaceWith(field));
          }
          init(block);
          if (timing === 'after decoration') resolve();
          fields.forEach((field) => {
            const body = field.parentElement;
            expect(body.tagName).to.equal('DIV');
            expect(body.classList.contains('body-md')).to.be.true;
            expect(field.querySelectorAll('p').length).to.equal(paragraphs);
            body.style.fontSize = '22px';
            body.style.lineHeight = '30px';
            field.querySelectorAll('p').forEach((p) => {
              expect(getComputedStyle(p).display).to.equal('inline');
              expect(getComputedStyle(p).fontSize).to.equal('22px');
              expect(getComputedStyle(p).lineHeight).to.equal('30px');
            });
            expect(field.querySelector('[is="inline-price"]').textContent).to.equal('US$9.99/mo');
            if (paragraphs === 2) {
              expect(field.querySelector('strong a').getAttribute('href')).to.equal('/terms');
              expect(getComputedStyle(field.querySelector('p + p'), '::before').content).to.equal('" "');
            }
          });
          expect(fields[0].parentElement.classList.contains('pm-subtext')).to.be.true;
          expect(fields[0].closest('.pm-foreground')).to.exist;
          expect(fields[1].closest('.pm-merch-content')).to.exist;
          expect(block.querySelectorAll('.pm-merch-ctas a').length).to.equal(2);
          expect(block.querySelector('.pm-chiclet-row h1').textContent).to.equal('Photoshop');
          expect(block.querySelector('.mas-price').parentElement.tagName).to.equal('P');
          expect(block.querySelector('.mas-price-commitment').textContent).to.equal('Annual, billed monthly');
          expect(block.querySelectorAll('mas-field').length).to.equal(3);
        });
      });
    });
  });

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

    it('groups the ctas into the cta wrapper in place', () => {
      const ctas = content.querySelectorAll('.pm-merch-ctas .con-button');
      expect(ctas.length).to.equal(2);
      // No CTA is left loose directly under the content; they live in the wrapper.
      expect(content.querySelector('.pm-merch-content > .action-area')).to.be.null;
      expect(content.querySelector('.pm-merch-ctas')).to.exist;
    });
  });

  describe('cta grouping', () => {
    const buildBlock = (promoInner, blockClass = '') => {
      document.body.innerHTML = `<div class="product-marquee-grid ${blockClass}"><div>`
        + '<div><h1>Photoshop</h1></div>'
        + `<div>${promoInner}</div>`
        + '</div></div>';
      return document.querySelector('.product-marquee-grid');
    };

    it('keeps a description that contains a button in the content, not the cta wrapper', async () => {
      const block = buildBlock(
        '<p><mas-field field="description">Learn more <a class="con-button" href="/learn">here</a></mas-field></p>'
        + '<p><strong><a href="/plans">See plans</a></strong></p>',
      );
      await init(block);

      const content = block.querySelector('.pm-merch-content');
      const wrapper = block.querySelector('.pm-merch-ctas');
      // The description (with its inline button) stays in the content, outside the cta row.
      expect(content.querySelector('mas-field[field="description"]')).to.exist;
      expect(wrapper.querySelector('mas-field[field="description"]')).to.be.null;
      // Only the real cta moves into the wrapper.
      expect(wrapper.querySelector('.con-button').getAttribute('href')).to.equal('/plans');
    });

    it('keeps body text that follows a cta in place, after the cta wrapper', async () => {
      const block = buildBlock(
        '<p><strong><a href="/plans">See plans</a></strong></p>'
        + '<p>Terms and conditions apply.</p>',
      );
      await init(block);

      const content = block.querySelector('.pm-merch-content');
      const wrapper = content.querySelector('.pm-merch-ctas');
      expect(wrapper).to.exist;
      expect(wrapper.querySelector('.con-button')).to.exist;
      // The wrapper replaces the cta in place; the trailing copy stays after it (not pulled in).
      const trailing = wrapper.nextElementSibling;
      expect(trailing.textContent).to.equal('Terms and conditions apply.');
      expect(wrapper.textContent).to.not.contain('Terms and conditions');
    });

    it('wraps a bare single-line promo column so its cta still groups', async () => {
      const block = buildBlock('<strong><a href="/buy">Buy now</a></strong>');
      await init(block);

      // The loose markup is wrapped into a paragraph and the cta is still grouped.
      const wrapper = block.querySelector('.pm-merch-ctas');
      expect(wrapper).to.exist;
      expect(wrapper.querySelector('.con-button').getAttribute('href')).to.equal('/buy');
    });

    it('appends the cta row at the end of the card for the cta-pill variant', async () => {
      const block = buildBlock(
        '<p>Save 20% this week.</p>'
        + '<p><strong><a href="/plans">See plans</a></strong></p>',
        'cta-pill',
      );
      await init(block);

      const card = block.querySelector('.pm-merch-card');
      const wrapper = card.querySelector('.pm-merch-ctas');
      expect(wrapper).to.exist;
      expect(wrapper.querySelector('.con-button')).to.exist;
      // cta-pill appends the wrapper to the card itself (last child), not in place in the content.
      expect(wrapper.parentElement).to.equal(card);
      expect(card.lastElementChild).to.equal(wrapper);
      expect(block.querySelector('.pm-merch-content .pm-merch-ctas')).to.be.null;
    });
  });

  describe('cta-stack variant', () => {
    let block;
    before(async () => {
      await loadStyles('/libs/c2/blocks/product-marquee-grid/product-marquee-grid.css');
    });

    beforeEach(async () => {
      block = await initBlock('./mocks/cta-stack.html');
      document.body.append(block);
    });

    it('groups both single-paragraph ctas and stacks them full-width', () => {
      const wrapper = block.querySelector('.pm-merch-ctas');
      expect(wrapper).to.exist;
      const ctas = [...wrapper.querySelectorAll('.con-button')];
      expect(ctas.length).to.equal(2);
      ctas.forEach((cta) => {
        let node = cta.parentElement;
        while (node && node !== wrapper) {
          expect(getComputedStyle(node).display).to.equal('contents');
          node = node.parentElement;
        }
      });

      // cta-stack lays the row out as a column: the two buttons sit on different rows.
      expect(getComputedStyle(wrapper).flexDirection).to.equal('column');
      expect(ctas[0].offsetTop).to.not.equal(ctas[1].offsetTop);
      expect(ctas[0].offsetLeft).to.equal(ctas[1].offsetLeft);
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
