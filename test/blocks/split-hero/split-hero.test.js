import { readFile, setViewport } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { loadStyle } from '../../../libs/utils/utils.js';

import init from '../../../libs/c2/blocks/split-hero/split-hero.js';

const FEDERAL_SVG = 'https://main--federal--adobecom.aem.page/federal/assets/svgs/photoshop.svg';
const MEDIA = '<picture><img src="/test/blocks/split-hero/mocks/wide-media.svg" alt="" /></picture>';

const loadStyles = (path) => new Promise((resolve) => { loadStyle(path, resolve); });
const nextFrame = () => new Promise((resolve) => { requestAnimationFrame(resolve); });

async function initBlock(path) {
  document.body.innerHTML = await readFile({ path });
  const block = document.querySelector('.split-hero');
  await init(block);
  return block;
}

const row = (...cells) => `<div>${cells.map((cell) => `<div>${cell}</div>`).join('')}</div>`;

const buildBlock = (mainCells, offerCells) => {
  document.body.innerHTML = `<div class="split-hero">${row(...mainCells)}${offerCells ? row(...offerCells) : ''}</div>`;
  return document.querySelector('.split-hero');
};

describe('Split Hero', () => {
  before(async () => {
    await Promise.all([
      '/libs/c2/styles/styles.css',
      '/libs/c2/blocks/split-hero/split-hero.css',
    ].map(loadStyles));
  });

  afterEach(async () => {
    await setViewport({ width: 800, height: 600 });
  });

  describe('default', () => {
    let block;
    let content;
    beforeEach(async () => {
      block = await initBlock('./mocks/default.html');
      content = block.querySelector('.sh-content');
    });

    it('replaces the block content with a single sh-content container', () => {
      expect(block.children.length).to.equal(1);
      expect(content.classList.contains('container')).to.be.true;
      expect(content.children.length).to.equal(2);
      expect(content.children[0].classList.contains('sh-foreground')).to.be.true;
      expect(content.children[1].classList.contains('sh-media')).to.be.true;
    });

    it('puts the heading before the eyebrow in the DOM and shows the eyebrow on top', () => {
      const text = content.querySelector('.sh-text');
      const heading = text.querySelector('h1');
      const eyebrow = text.querySelector('.eyebrow');
      expect(text.firstElementChild).to.equal(heading);
      expect(heading.nextElementSibling).to.equal(eyebrow);
      expect(heading.classList.contains('heading-2')).to.be.true;
      expect(eyebrow.classList.contains('body-md')).to.be.false;
      expect(eyebrow.textContent.trim()).to.equal('Photoshop');
      expect(eyebrow.nextElementSibling.matches('p.body-md')).to.be.true;
      expect(eyebrow.getBoundingClientRect().top)
        .to.be.lessThan(heading.getBoundingClientRect().top);
    });

    it('rewrites the federated svg icon src to the absolute federal URL', () => {
      expect(content.querySelector('.eyebrow img').getAttribute('src')).to.equal(FEDERAL_SVG);
    });

    it('builds a merch card in the promo area below the copy', () => {
      const promo = content.querySelector('.sh-copy > .sh-promo-area');
      expect(promo.previousElementSibling.classList.contains('sh-text')).to.be.true;
      expect(promo.querySelector('.sh-merch-card .sh-merch-content')).to.exist;
    });

    it('classes the mas-fields and folds the commitment into the price', () => {
      const cardContent = content.querySelector('.sh-merch-content');
      expect(cardContent.querySelector('.mas-short-description')).to.exist;
      const price = cardContent.querySelector('.mas-price.heading-5');
      const commitment = price.parentElement.querySelector('.mas-price-commitment');
      expect(commitment.textContent).to.equal('Annual, billed monthly');
    });

    it('groups the ctas into the cta wrapper in place', () => {
      const ctas = content.querySelectorAll('.sh-merch-content > .sh-merch-ctas .con-button');
      expect([...ctas].map((a) => a.href)).to.deep.equal([
        'https://www.adobe.com/free-trial',
        'https://www.adobe.com/plans',
      ]);
    });

    it('places supporting text last in the foreground as a caption, links untouched', () => {
      const supporting = content.querySelector('.sh-foreground').lastElementChild;
      expect(supporting.classList.contains('sh-supporting')).to.be.true;
      expect(supporting.classList.contains('caption')).to.be.true;
      expect(supporting.querySelectorAll('a').length).to.equal(2);
      expect(supporting.querySelector('.con-button')).to.be.null;
    });

    it('frames the media', () => {
      expect(content.querySelector('.sh-media > .sh-media-frame picture')).to.exist;
    });

    it('renders no background for a two-cell row', () => {
      expect(block.querySelector('.sh-background')).to.be.null;
    });
  });

  describe('MAS body copy', () => {
    ['before decoration', 'after decoration', 'already unwrapped'].forEach((timing) => {
      [1, 2].forEach((paragraphs) => {
        it(`preserves ${paragraphs} paragraphs resolved ${timing}`, async () => {
          document.body.innerHTML = await readFile({ path: './mocks/default.html' });
          const block = document.querySelector('.split-hero');
          const field = block.querySelector('mas-field[field="shortDescription"]');
          field.innerHTML = '<span data-role="mas-field-content"></span>';
          const resolve = () => {
            field.firstElementChild.innerHTML = `<p>Create with <span is="inline-price">US$9.99/mo</span>.</p>${paragraphs === 2 ? '<p><strong><a href="/terms" data-wcs-osi="terms">Terms apply</a></strong></p>' : ''}`;
          };
          if (timing !== 'after decoration') resolve();
          if (timing === 'already unwrapped') field.parentElement.replaceWith(field);
          await init(block);
          if (timing === 'after decoration') resolve();

          const body = field.parentElement;
          expect(body.tagName).to.equal('DIV');
          expect(body.classList.contains('body-md')).to.be.true;
          expect(body.closest('.sh-merch-content')).to.exist;
          expect(field.querySelectorAll('p').length).to.equal(paragraphs);
          field.querySelectorAll('p').forEach((p) => {
            expect(getComputedStyle(p).display).to.equal('inline');
          });
          if (paragraphs === 2) {
            expect(getComputedStyle(field.querySelector('p + p'), '::before').content).to.equal('" "');
            expect(block.querySelector('.sh-merch-ctas a[href="/terms"]')).to.be.null;
          }
          expect(block.querySelectorAll('.sh-merch-ctas .con-button').length).to.equal(2);
        });
      });
    });
  });

  describe('cta grouping', () => {
    const copy = '<h1>Photoshop</h1>';

    it('groups headless CTA fields as buttons', async () => {
      const block = buildBlock([copy], ['<p><strong><mas-field field="ctas[abc]"><a href="/buy">Buy now</a></mas-field></strong></p>']);
      await init(block);

      expect(block.querySelector('.sh-merch-ctas a[href="/buy"]').classList.contains('con-button')).to.be.true;
    });

    it('keeps a description that contains a button in the content, not the cta wrapper', async () => {
      const block = buildBlock([copy], [
        '<p><mas-field field="description">Learn more <a class="con-button" href="/learn">here</a></mas-field></p>'
        + '<p><strong><a href="/plans">See plans</a></strong></p>',
      ]);
      await init(block);

      const wrapper = block.querySelector('.sh-merch-ctas');
      expect(block.querySelector('.sh-merch-content mas-field[field="description"]')).to.exist;
      expect(wrapper.querySelector('mas-field[field="description"]')).to.be.null;
      expect(wrapper.querySelector('.con-button').getAttribute('href')).to.equal('/plans');
    });

    it('keeps body text that follows a cta in place, after the cta wrapper', async () => {
      const block = buildBlock([copy], [
        '<p><strong><a href="/plans">See plans</a></strong></p><p>Terms and conditions apply.</p>',
      ]);
      await init(block);

      const wrapper = block.querySelector('.sh-merch-ctas');
      expect(wrapper.nextElementSibling.textContent).to.equal('Terms and conditions apply.');
      expect(wrapper.textContent).to.not.contain('Terms and conditions');
    });

    it('wraps a bare single-line merch cell so its cta still groups', async () => {
      const block = buildBlock([copy], ['<strong><a href="/buy">Buy now</a></strong>']);
      await init(block);

      expect(block.querySelector('.sh-merch-ctas .con-button').getAttribute('href')).to.equal('/buy');
    });
  });

  describe('background', () => {
    const copy = '<h1>Photoshop</h1>';

    it('renders no background for an empty third cell', async () => {
      const block = buildBlock([copy, MEDIA, '']);
      await init(block);

      expect(block.querySelector('.sh-background')).to.be.null;
    });

    it('turns a text color into a background layer behind the content', async () => {
      const block = buildBlock([copy, MEDIA, 'rgb(255, 0, 0)']);
      await init(block);

      const background = block.firstElementChild;
      expect(background.classList.contains('sh-background')).to.be.true;
      expect(background.style.background).to.include('rgb(255, 0, 0)');
      expect(block.style.background).to.equal('');
      expect(background.nextElementSibling.classList.contains('sh-content')).to.be.true;
    });

    it('covers the block with a background image', async () => {
      const block = buildBlock([copy, MEDIA, MEDIA]);
      await init(block);

      const background = block.querySelector('.sh-background');
      expect(background.querySelector('img')).to.exist;
      const blockRect = block.getBoundingClientRect();
      const bgRect = background.getBoundingClientRect();
      expect(bgRect.width).to.equal(blockRect.width);
      expect(bgRect.height).to.equal(blockRect.height);
    });
  });

  describe('viewports', () => {
    let block;
    beforeEach(async () => {
      document.body.innerHTML = await readFile({ path: './mocks/viewports.html' });
      block = document.querySelector('.split-hero');
      await setViewport({ width: 1000, height: 800 });
    });

    it('inherits empty cells from the previous viewport', async () => {
      await init(block);

      expect(block.querySelector('h1').textContent).to.equal('Mobile headline');
      expect(block.querySelector('.sh-text .eyebrow').textContent).to.equal('Photoshop');
      expect(block.querySelector('.sh-media video')).to.exist;
      expect(block.querySelector('.sh-background').style.background).to.include('rgb(0, 0, 255)');
      expect(block.querySelector('.sh-merch-card')).to.exist;
      expect(block.querySelector('.sh-supporting').textContent).to.equal('Support text');

      await setViewport({ width: 390, height: 844 });
      await nextFrame();
      expect(block.querySelector('.sh-media picture')).to.exist;
    });

    it('drops the background when a later viewport omits the third cell', async () => {
      const tabletMain = block.children[4];
      tabletMain.lastElementChild.remove();
      await init(block);

      expect(block.querySelector('.sh-background')).to.be.null;
    });

    it('drops merch and supporting text when a later viewport omits the second row', async () => {
      block.lastElementChild.remove();
      await init(block);

      expect(block.querySelector('.sh-merch-card')).to.be.null;
      expect(block.querySelector('.sh-supporting')).to.be.null;
    });
  });

  describe('layout', () => {
    let block;
    beforeEach(async () => {
      block = await initBlock('./mocks/default.html');
    });

    it('stacks below 768px with a padded, rounded media frame', async () => {
      await setViewport({ width: 390, height: 844 });

      const foreground = block.querySelector('.sh-foreground');
      const frame = block.querySelector('.sh-media-frame');
      expect(frame.getBoundingClientRect().top)
        .to.be.at.least(foreground.getBoundingClientRect().bottom);
      const style = getComputedStyle(frame);
      expect(parseFloat(style.paddingTop)).to.be.greaterThan(0);
      expect(parseFloat(style.borderTopLeftRadius)).to.be.greaterThan(0);
      expect(document.documentElement.scrollWidth).to.equal(window.innerWidth);
    });

    [768, 1440].forEach((width) => {
      it(`splits copy and media side by side at ${width}px without page overflow`, async () => {
        await setViewport({ width, height: 900 });

        const left = block.querySelector('.sh-foreground').getBoundingClientRect();
        const right = block.querySelector('.sh-media').getBoundingClientRect();
        expect(right.left).to.be.at.least(left.right);
        expect(right.width).to.be.greaterThan(left.width);
        expect(document.documentElement.scrollWidth).to.equal(window.innerWidth);
      });
    });
  });

  describe('fallback / negative branches', () => {
    it('leaves copy without an eyebrow untouched', async () => {
      const block = buildBlock(['<h1>Headline</h1><p>Body copy.</p>', MEDIA]);
      await init(block);

      const text = block.querySelector('.sh-text');
      expect(text.querySelector('.eyebrow')).to.be.null;
      expect(text.firstElementChild.matches('h1.heading-2')).to.be.true;
    });

    it('keeps the heading size on the first heading only', async () => {
      const block = buildBlock(['<p>Eyebrow</p><h1>Headline</h1><h3>Secondary</h3>', MEDIA]);
      await init(block);

      expect(block.querySelector('h3').classList.contains('heading-2')).to.be.false;
    });

    it('renders no card for an empty merch cell but keeps supporting text', async () => {
      const block = buildBlock(['<h1>Headline</h1>', MEDIA], ['', 'Support text']);
      await init(block);

      expect(block.querySelector('.sh-merch-card')).to.be.null;
      expect(block.querySelector('.sh-supporting')).to.exist;
    });

    it('renders no supporting text for an empty supporting cell', async () => {
      const block = buildBlock(['<h1>Headline</h1>', MEDIA], ['<p><mas-field field="prices">US$9.99/mo</mas-field></p>', '']);
      await init(block);

      expect(block.querySelector('.sh-merch-card')).to.exist;
      expect(block.querySelector('.sh-supporting')).to.be.null;
    });

    it('renders no media for an empty media cell', async () => {
      const block = buildBlock(['<h1>Headline</h1>', '']);
      await init(block);

      expect(block.querySelector('.sh-media')).to.be.null;
    });

    it('preserves decorated video, controls, and listeners in the media cell', async () => {
      const block = buildBlock(['<h1>Headline</h1>', '<div class="video-holder"><video controls aria-label="Product overview"></video><button type="button">Pause motion</button></div>']);
      const video = block.querySelector('video');
      let clicked = false;
      block.querySelector('button').addEventListener('click', () => { clicked = true; });
      await init(block);

      expect(block.querySelector('.sh-media video')).to.equal(video);
      block.querySelector('.sh-media button').click();
      expect(clicked).to.be.true;
    });

    it('is a no-op and does not throw when the block has no rows', async () => {
      const block = await initBlock('./mocks/empty.html');
      expect(block.children.length).to.equal(0);
    });
  });
});
