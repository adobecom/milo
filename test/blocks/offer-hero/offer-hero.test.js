import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

import init from '../../../libs/c2/blocks/offer-hero/offer-hero.js';

describe('offer-hero', () => {
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
