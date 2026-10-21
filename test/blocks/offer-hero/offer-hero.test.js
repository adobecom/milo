import { readFile, setViewport } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { getConfig, loadStyle } from '../../../libs/utils/utils.js';
import { mepMasStudioUrls } from '../../../libs/blocks/merch/mas-mep-utils.js';
import { watchForMasContent, unwatchForMasContent } from '../../../libs/features/mep/mep-next/mep-mas.js';

import init from '../../../libs/c2/blocks/offer-hero/offer-hero.js';

describe('offer-hero', () => {
  describe('MEP inline MAS editing', () => {
    let originalViewport;
    let originalMep;
    beforeEach(() => {
      originalViewport = { width: window.innerWidth, height: window.innerHeight };
      originalMep = getConfig().mep;
      getConfig().mep = { ...originalMep, preview: true };
    });
    afterEach(async () => {
      unwatchForMasContent();
      delete document.body.dataset.mepMasHighlight;
      sinon.restore();
      getConfig().mep = originalMep;
      await setViewport(originalViewport);
    });

    it('opens Studio for fields inherited across mobile, tablet, and desktop viewports', async () => {
      document.body.innerHTML = await readFile({ path: './mocks/mas-fields.html' });
      const block = document.querySelector('.offer-hero');
      const rows = [...block.children];
      block.prepend(Object.assign(document.createElement('div'), { innerHTML: '<div>mobile-viewport</div>' }));
      ['tablet', 'desktop'].forEach((viewport) => {
        block.insertAdjacentHTML('beforeend', `<div><div>${viewport}-viewport</div></div>`);
        rows.forEach((row) => {
          const emptyRow = document.createElement('div');
          [...row.children].forEach(() => emptyRow.append(document.createElement('div')));
          block.append(emptyRow);
        });
      });
      const fields = [...block.querySelectorAll('mas-field')];
      fields.forEach((field, index) => {
        field.dataset.masBlock = 'inline';
        mepMasStudioUrls.set(field, `https://mas.adobe.com/studio.html#query=viewport-${index}`);
      });
      const openStub = sinon.stub(window, 'open');
      document.body.dataset.mepMasHighlight = 'true';
      watchForMasContent();
      init(block);

      for (const width of [375, 1000, 1440]) {
        await setViewport({ width, height: 900 });
        await new Promise((resolve) => { requestAnimationFrame(resolve); });
        const renderedFields = [...block.querySelectorAll('mas-field')];
        expect(renderedFields.length).to.equal(fields.length);
        renderedFields.forEach((field, index) => {
          const url = `https://mas.adobe.com/studio.html#query=viewport-${index}`;
          expect(mepMasStudioUrls.get(field)).to.equal(url);
          const rectStub = sinon.stub(field, 'getBoundingClientRect')
            .returns({ top: 100, right: 400, height: 30 });
          field.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true, cancelable: true, clientX: 300, clientY: 90 }));
          expect(openStub.lastCall.args).to.deep.equal([url, '_blank', 'noopener,noreferrer']);
          rectStub.restore();
        });
      }
    });

    it('preserves MAS editing when promoting the hero heading and moving card text', async () => {
      document.body.innerHTML = await readFile({ path: './mocks/default.html' });
      const block = document.querySelector('.offer-hero');
      const headings = [block.querySelector('h2'), block.querySelector('h4')];
      const fields = headings.map((heading) => {
        heading.innerHTML = '<mas-field field="cardTitle" data-mas-block="inline"><span data-role="mas-field-content">Creative apps</span></mas-field>';
        return heading.firstElementChild;
      });
      const urls = fields.map((field, index) => {
        const url = `https://mas.adobe.com/studio.html#content-type=merch-card&query=offer-${index}&field=cardTitle`;
        mepMasStudioUrls.set(field, url);
        return url;
      });
      const readySpies = fields.map((field) => {
        const spy = sinon.spy();
        field.addEventListener('mas:ready', spy);
        return spy;
      });
      const openStub = sinon.stub(window, 'open');
      document.body.dataset.mepMasHighlight = 'true';
      watchForMasContent();
      init(block);

      expect(block.querySelector('.hero-content h1 mas-field')).to.equal(fields[0]);
      expect(block.querySelector('.hero-content h1').id).to.equal('save-today');
      expect(block.querySelector('.hero-card-title mas-field')).to.equal(fields[1]);
      expect(block.querySelector('.hero-content h2')).to.be.null;
      fields.forEach((field, index) => {
        field.dispatchEvent(new Event('mas:ready'));
        expect(readySpies[index].calledOnce).to.be.true;
        sinon.stub(field, 'getBoundingClientRect').returns({ top: 100, right: 400, height: 30 });
        field.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true, cancelable: true, clientX: 300, clientY: 90 }));
        expect(openStub.getCall(index).args).to.deep.equal([urls[index], '_blank', 'noopener,noreferrer']);
      });
    });
  });

  describe('MAS body fields', () => {
    before(async () => {
      await new Promise((resolve, reject) => {
        loadStyle('/libs/c2/blocks/offer-hero/offer-hero.css', (status) => {
          if (status === 'error') reject(new Error('Failed to load Offer Hero styles'));
          else resolve();
        });
      });
    });

    ['single paragraph', 'multiple paragraphs'].forEach((variant) => {
      ['before decoration', 'after decoration', 'already unwrapped'].forEach((timing) => {
        it(`normalizes ${variant} resolved ${timing}`, async () => {
          document.body.innerHTML = await readFile({ path: './mocks/mas-fields.html' });
          const block = document.querySelector('.offer-hero');
          const fields = [...block.querySelectorAll('mas-field[field="shortDescription"]')];
          const resolve = () => fields.forEach((field) => {
            field.querySelector('[data-role="mas-field-content"]').innerHTML = `
              <p>Creative apps with <span is="inline-price">US$9.99/mo</span>.</p>
              ${variant === 'multiple paragraphs' ? '<p><em>Terms apply.</em> <a href="/terms">See terms</a></p>' : ''}
            `;
          });
          if (timing !== 'after decoration') resolve();
          if (timing === 'already unwrapped') {
            fields.forEach((field) => field.parentElement.replaceWith(field));
          }

          init(block);
          if (timing === 'after decoration') resolve();

          fields.forEach((field, index) => {
            const body = field.parentElement;
            expect(body.tagName).to.equal('DIV');
            expect(body.classList.contains(index === 0 ? 'body-lg' : 'body-md')).to.be.true;
            expect(field.querySelectorAll('p').length).to.equal(variant === 'single paragraph' ? 1 : 2);
            expect(field.querySelector('[is="inline-price"]').textContent).to.equal('US$9.99/mo');
            expect(body.textContent.match(/Creative apps/g).length).to.equal(1);
            body.style.fontSize = '22px';
            body.style.lineHeight = '30px';
            field.querySelectorAll('p').forEach((p) => {
              const styles = getComputedStyle(p);
              expect(styles.display).to.equal('inline');
              expect(styles.fontSize).to.equal('22px');
              expect(styles.lineHeight).to.equal('30px');
            });
            if (variant === 'multiple paragraphs') {
              expect(field.querySelector('em').textContent).to.equal('Terms apply.');
              expect(field.querySelector('a').getAttribute('href')).to.equal('/terms');
              expect(getComputedStyle(field.querySelector('p + p'), '::before').content).to.equal('" "');
            }
          });

          const tablet = window.matchMedia('(768px < width < 1280px)').matches;
          expect(getComputedStyle(fields[0].parentElement).maxWidth)
            .to.equal(tablet ? 'calc(100% - 438px)' : '590px');
          const cardBody = fields[1].closest('.hero-card-body-text');
          expect(cardBody.closest('.hero-card-text-wrapper')).to.exist;
          expect(block.querySelector('.hero-card-tile').getAttribute('href')).to.equal(`${window.location.origin}/apps/cloud`);
          expect(block.querySelector('.learn-more').getAttribute('href')).to.equal('/apps/cloud');
          expect(block.querySelectorAll('mas-field[field="shortDescription"]').length).to.equal(2);
          expect(block.querySelector('.hero-content h1 mas-field').textContent).to.equal('Creative Cloud');
          expect(block.querySelector('.hero-content .con-button').textContent).to.equal('Buy now');
        });
      });
    });
  });

  describe('fully authored block', () => {
    let block;
    beforeEach(async () => {
      document.body.innerHTML = await readFile({ path: './mocks/default.html' });
      block = document.querySelector('.offer-hero');
      init(block);
    });

    it('wraps the first row in a .hero > .hero-content structure', () => {
      const hero = block.querySelector('.hero');
      expect(hero).to.exist;
      const content = hero.querySelector('.hero-content');
      expect(content).to.exist;
      expect(hero.firstElementChild).to.equal(content);
    });

    it('promotes the authored heading to an h1', () => {
      const content = block.querySelector('.hero-content');
      const h1 = content.querySelector('h1');
      expect(h1).to.exist;
      expect(h1.classList.contains('heading-1')).to.be.true;
      expect(h1.textContent).to.equal('Save big on the entire collection today');
      // the original h2-h6 heading is gone
      expect(content.querySelector('h2, h3, h4, h5, h6')).to.be.null;
    });

    it('builds an app-icon eyebrow from the svg image and rewrites its src to a federated URL', () => {
      const eyebrow = block.querySelector('.hero-content .eyebrow');
      expect(eyebrow).to.exist;
      expect(eyebrow.classList.contains('app-icon')).to.be.true;
      const icon = eyebrow.querySelector('img.app-icon-img');
      expect(icon).to.exist;
      expect(icon.getAttribute('alt')).to.equal('');
      expect(icon.src).to.equal('https://main--federal--adobecom.aem.page/federal/assets/icons/app-icon.svg');
      // the icon is the first child of the eyebrow, text follows
      expect(eyebrow.firstElementChild).to.equal(icon);
      // the standalone picture paragraph that held the svg was removed
      const contentImgs = block.querySelectorAll('.hero-content img');
      expect(contentImgs.length).to.equal(1);
    });

    it('decorates the hero body and call-to-action', () => {
      const content = block.querySelector('.hero-content');
      const body = content.querySelector('p.body-lg');
      expect(body).to.exist;
      const cta = content.querySelector('a.con-button');
      expect(cta).to.exist;
      expect(cta.textContent).to.equal('Buy now');
    });

    it('moves the heading row into a .what-included eyebrow', () => {
      const whatIncluded = block.querySelector('.what-included');
      expect(whatIncluded).to.exist;
      const eyebrow = whatIncluded.querySelector('h3.hero-eyebrow');
      expect(eyebrow).to.exist;
      expect(eyebrow.classList.contains('heading-2')).to.be.true;
      expect(eyebrow.textContent).to.equal("What's included");
    });

    it('builds one hero-card per authored card row', () => {
      const cards = block.querySelectorAll('.hero-cards .hero-card');
      expect(cards.length).to.equal(4);
    });

    it('turns a card with a link into an anchor tile with tracking data', () => {
      const tile = block.querySelector('.hero-card .hero-card-tile');
      expect(tile.tagName).to.equal('A');
      expect(tile.getAttribute('href')).to.contain('/apps/photoshop');
      expect(tile.getAttribute('data-tracking-label')).to.equal('Photoshop');
    });

    it('decorates the card title, body text, and media', () => {
      const tile = block.querySelector('.hero-card .hero-card-tile');
      const title = tile.querySelector('.hero-card-text .hero-card-title');
      expect(title.tagName).to.equal('H4');
      expect(title.classList.contains('heading-6')).to.be.true;
      expect(title.textContent).to.equal('Photoshop');
      const body = tile.querySelector('.hero-card-text .hero-card-body-text');
      expect(body.classList.contains('body-md')).to.be.true;
      const media = tile.querySelector('.hero-card-media');
      expect(media).to.exist;
      expect(media.querySelector('picture img')).to.exist;
    });

    it('converts the learn-more link into a labelled, focus-skipped link with a chevron', () => {
      const learnMore = block.querySelector('.hero-card .learn-more');
      expect(learnMore).to.exist;
      expect(learnMore.classList.contains('label')).to.be.true;
      expect(learnMore.getAttribute('tabindex')).to.equal('-1');
      expect(learnMore.getAttribute('href')).to.equal('/apps/photoshop');
      expect(learnMore.querySelector('svg')).to.exist;
      // the learn-more link is a sibling of the text wrapper, not inside it
      expect(learnMore.closest('.hero-card-text-wrapper')).to.be.null;
    });

    it('consumes every authored row, leaving no raw rows behind', () => {
      // block should only contain the .hero and .what-included wrappers now
      const strayRows = [...block.children].filter(
        (child) => !child.classList.contains('hero') && !child.classList.contains('what-included'),
      );
      expect(strayRows.length).to.equal(0);
    });
  });

  describe('branch coverage', () => {
    let block;
    beforeEach(async () => {
      document.body.innerHTML = await readFile({ path: './mocks/variants.html' });
      block = document.querySelector('.offer-hero');
      init(block);
    });

    it('omits the app-icon when the hero has no eyebrow svg but still promotes the heading', () => {
      expect(block.querySelector('.app-icon')).to.be.null;
      const h1 = block.querySelector('.hero-content h1');
      expect(h1).to.exist;
      expect(h1.textContent).to.equal('Everything you need to create');
    });

    it('renders a card without a link as a div tile with no learn-more', () => {
      const firstCard = block.querySelector('.hero-cards .hero-card');
      const tile = firstCard.querySelector('.hero-card-tile');
      expect(tile.tagName).to.equal('DIV');
      expect(tile.getAttribute('href')).to.be.null;
      expect(tile.getAttribute('data-tracking-label')).to.be.null;
      expect(firstCard.querySelector('.learn-more')).to.be.null;
      expect(firstCard.querySelector('.hero-card-title').textContent).to.equal('Fonts');
    });

    it('renders a card without a heading as an anchor tile with no title', () => {
      const cards = block.querySelectorAll('.hero-cards .hero-card');
      const linkedCard = cards[1];
      const tile = linkedCard.querySelector('.hero-card-tile');
      expect(tile.tagName).to.equal('A');
      expect(linkedCard.querySelector('.hero-card-title')).to.be.null;
      expect(linkedCard.querySelector('.learn-more')).to.exist;
    });

    it('skips a row that does not have exactly two cells', () => {
      const cards = block.querySelectorAll('.hero-cards .hero-card');
      expect(cards.length).to.equal(2);
      // the single-cell row is left untouched, still holding its authored text
      expect(block.textContent).to.contain('should be skipped');
    });
  });

  describe('empty block', () => {
    it('does nothing when there are no rows', async () => {
      document.body.innerHTML = await readFile({ path: './mocks/no-rows.html' });
      const block = document.querySelector('.offer-hero');
      init(block);
      expect(block.querySelector('.hero')).to.be.null;
      expect(block.querySelector('.what-included')).to.be.null;
      expect(block.children.length).to.equal(0);
    });
  });
});
