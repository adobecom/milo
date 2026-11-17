import { readFile, setViewport } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { waitFor } from '../../helpers/waitfor.js';

const DESKTOP = { width: 1280, height: 800 };
const TABLET = { width: 1024, height: 800 };
const MOBILE = { width: 375, height: 800 };

const foundation = document.createElement('meta');
foundation.name = 'foundation';
foundation.content = 'c2';
document.head.append(foundation);
const { default: init } = await import('../../../libs/c2/blocks/aside-c2/aside-c2.js');

const loadStyle = (path) => new Promise((resolve) => {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = new URL(path, import.meta.url).href;
  link.onload = resolve;
  document.head.append(link);
});

const getBlock = (name) => document.querySelector(`.aside-c2.${name}`);
const inner = (block) => block.querySelector(':scope > .inner');
const childClasses = (block) => [...inner(block).children].map((child) => child.className);
const isMediaFirstInDom = (block) => block.querySelector(':scope > .inner > .media + .foreground') !== null;

describe('aside-c2', () => {
  beforeEach(async () => {
    await setViewport(DESKTOP);
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    document.querySelectorAll('.aside-c2').forEach(init);
  });

  after(async () => {
    await setViewport(DESKTOP);
    foundation.remove();
    document.body.innerHTML = '';
  });

  it('replaces the row with foreground and media children', () => {
    expect(childClasses(getBlock('lockup'))).to.deep.equal(['foreground', 'media']);
  });

  it('applies heading-4 to the heading and body-md to the body', () => {
    const block = getBlock('lockup');
    expect(block.querySelector('h2').classList.contains('heading-4')).to.be.true;
    expect(block.querySelector('h2 + p').classList.contains('body-md')).to.be.true;
  });

  it('marks a leading paragraph with a picture as product lockup', () => {
    const label = getBlock('lockup').querySelector('.foreground').firstElementChild;
    expect(label.classList.contains('product-lockup')).to.be.true;
    expect(label.classList.contains('body-md')).to.be.false;
    expect(label.classList.contains('eyebrow')).to.be.true;
  });

  it('marks an SVG lockup icon as product lockup and resolves its federal URL', () => {
    const lockup = getBlock('svg-lockup').querySelector('.foreground').firstElementChild;
    expect(lockup.classList.contains('product-lockup')).to.be.true;
    expect(lockup.classList.contains('eyebrow')).to.be.true;
    expect(lockup.classList.contains('body-md')).to.be.false;
    expect(lockup.querySelector('img').getAttribute('src'))
      .to.equal('https://main--federal--adobecom.aem.page/federal/assets/svgs/photoshop.svg');
  });

  it('marks the paragraph between lockup and heading as eyebrow', () => {
    const eyebrow = getBlock('lockup').querySelector('.product-lockup + p');
    expect(eyebrow.classList.contains('eyebrow')).to.be.true;
    expect(eyebrow.classList.contains('body-md')).to.be.false;
  });

  it('marks a plain-text pre-heading as eyebrow', () => {
    const label = getBlock('plain').querySelector('h2').previousElementSibling;
    expect(label.classList.contains('eyebrow')).to.be.true;
    expect(label.classList.contains('product-lockup')).to.be.false;
  });

  it('decorates CTAs as buttons inside the action area', () => {
    const buttons = getBlock('lockup').querySelectorAll('.action-area a.con-button');
    expect(buttons.length).to.equal(2);
    expect(buttons[0].classList.contains('fill')).to.be.true;
    expect(buttons[1].classList.contains('fill')).to.be.false;
  });

  it('decorates a trailing link-only paragraph as a standalone link', () => {
    const link = getBlock('lockup').querySelector('a[href*="/link"]');
    expect(link.classList.contains('standalone-link')).to.be.true;
    expect(link.classList.contains('con-button')).to.be.false;
    expect(link.parentElement.className).to.equal('link-container');
  });

  it('does not mark CTAs as standalone links', () => {
    expect(getBlock('plain').querySelector('.standalone-link')).to.not.exist;
  });

  it('creates a color background from the cell above the media', () => {
    const block = getBlock('with-background');
    expect(childClasses(block)).to.deep.equal(['foreground', 'media', 'background']);
    expect(block.querySelector('.background').style.backgroundColor).to.equal('rgb(243, 243, 243)');
  });

  it('takes the media from the last cell of an unmerged second row', () => {
    const block = getBlock('unmerged-background');
    expect(childClasses(block)).to.deep.equal(['foreground', 'media', 'background']);
    expect(block.querySelector('.media picture')).to.exist;
  });

  it('keeps media inherited from a merged second row into an unmerged one', () => {
    const block = getBlock('viewport-inherited-media');
    expect(block.querySelector('h2').textContent).to.equal('Desktop heading');
    expect(childClasses(block)).to.deep.equal(['foreground', 'media', 'background']);
    expect(block.querySelector('.media picture')).to.exist;
  });

  it('puts the media first in the DOM on load for a per-viewport media-first variant', () => {
    const block = getBlock('viewport-media-first');
    expect(block.classList.contains('media-first')).to.be.true;
    expect(block.querySelector('h2').textContent).to.equal('Desktop heading');
    expect(isMediaFirstInDom(block)).to.be.true;
  });

  it('ignores a background cell that is not a valid color', () => {
    const block = getBlock('injected-color');
    expect(block.querySelector('.background')).to.not.exist;
    expect(block.querySelector('[style]')).to.not.exist;
    expect(block.querySelector('.foreground h2')).to.exist;
  });

  it('does not create a background without a background cell', () => {
    expect(getBlock('lockup').querySelector('.background')).to.not.exist;
  });

  it('puts the media first for the media-first variant at every breakpoint', async () => {
    const block = getBlock('mirrored');
    expect(childClasses(block)).to.deep.equal(['media', 'foreground']);
    expect(block.querySelector('.foreground h2')).to.exist;
    await setViewport(MOBILE);
    await setViewport(TABLET);
    await waitFor(() => isMediaFirstInDom(block));
    expect(isMediaFirstInDom(getBlock('lockup'))).to.be.false;
  });

  it('puts the media first on mobile and restores the authored order above (crossing only 768)', async () => {
    const block = getBlock('lockup');
    await setViewport(TABLET);
    await setViewport(MOBILE);
    await waitFor(() => isMediaFirstInDom(block));
    await setViewport(TABLET);
    await waitFor(() => !isMediaFirstInDom(block));
  });

  it('keeps keyboard focus when reordering', async () => {
    const button = getBlock('lockup').querySelector('.con-button');
    button.focus();
    await setViewport(MOBILE);
    await waitFor(() => isMediaFirstInDom(getBlock('lockup')));
    expect(document.activeElement).to.equal(button);
  });

  it('keeps the correct order with viewport content after resizing', async () => {
    const block = getBlock('viewports');
    expect(block.querySelector('h2').textContent).to.equal('Desktop heading');
    expect(isMediaFirstInDom(block)).to.be.false;
    await setViewport(MOBILE);
    await waitFor(() => block.querySelector('h2').textContent === 'Mobile heading');
    await waitFor(() => isMediaFirstInDom(block));
    await setViewport(DESKTOP);
    await waitFor(() => block.querySelector('h2').textContent === 'Desktop heading');
    await waitFor(() => !isMediaFirstInDom(block));
  });

  it('keeps the correct order with viewport content when loaded on mobile and resized step by step', async () => {
    await setViewport(MOBILE);
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const block = getBlock('viewports');
    init(block);
    const heading = () => block.querySelector('h2').textContent;
    expect(heading()).to.equal('Mobile heading');
    expect(isMediaFirstInDom(block)).to.be.true;
    await setViewport(TABLET);
    await waitFor(() => heading() === 'Tablet heading' && !isMediaFirstInDom(block));
    await setViewport(DESKTOP);
    await waitFor(() => heading() === 'Desktop heading' && !isMediaFirstInDom(block));
    await setViewport(TABLET);
    await waitFor(() => heading() === 'Tablet heading' && !isMediaFirstInDom(block));
    await setViewport(MOBILE);
    await waitFor(() => heading() === 'Mobile heading' && isMediaFirstInDom(block));
  });

  it('keeps a heading that is also a color name as the foreground', () => {
    const block = getBlock('color-heading');
    expect(block.querySelector('.foreground h2').textContent).to.equal('Red');
    expect(block.querySelector('.background').style.backgroundColor).to.equal('rgb(243, 243, 243)');
  });

  it('does not decorate an image-only link as a standalone link', () => {
    expect(getBlock('image-link').querySelector('.standalone-link')).to.not.exist;
  });

  it('ignores a background image and keeps a heading-less text cell as the foreground', () => {
    const block = getBlock('image-background');
    expect(childClasses(block)).to.deep.equal(['foreground', 'media']);
    expect(block.querySelector('.background-image')).to.not.exist;
    expect(block.querySelector('.foreground').textContent).to.contain('Plain text without a heading.');
    expect(block.querySelector('.media .media-image')).to.exist;
  });

  it('keeps a heading-less text cell with a lockup icon as the foreground next to a color', () => {
    const block = getBlock('lockup-color');
    expect(childClasses(block)).to.deep.equal(['foreground', 'media', 'background']);
    expect(block.querySelector('.foreground .product-lockup')).to.exist;
  });

  it('ignores a background video and keeps the text cell as the foreground', () => {
    const block = getBlock('video-background');
    expect(block.querySelector('.background')).to.not.exist;
    expect(block.querySelector('video, .play-pause-button, .hide-video')).to.not.exist;
    expect(block.querySelector('.foreground h2')).to.exist;
    expect(block.querySelector('.media picture')).to.exist;
  });

  it('does not throw for an empty block', () => {
    const block = document.createElement('div');
    block.className = 'aside-c2';
    document.body.append(block);
    expect(() => init(block)).to.not.throw();
    expect(childClasses(block)).to.deep.equal([]);
  });
});

describe('aside-c2 styles', () => {
  before(async () => {
    await Promise.all([
      loadStyle('../../../libs/c2/styles/styles.css'),
      loadStyle('../../../libs/c2/blocks/aside-c2/aside-c2.css'),
    ]);
  });

  beforeEach(async () => {
    await setViewport(DESKTOP);
    document.body.innerHTML = await readFile({ path: './mocks/styles.html' });
    document.querySelectorAll('.aside-c2').forEach(init);
  });

  after(async () => {
    await setViewport(DESKTOP);
    document.head.querySelectorAll('link[rel="stylesheet"]').forEach((link) => link.remove());
    document.body.innerHTML = '';
  });

  it('scales video height with its width', () => {
    const { width, height } = getBlock('video').querySelector('video').getBoundingClientRect();
    expect(height).to.be.closeTo((width * 180) / 320, 1);
  });

  it('rounds images wrapped in a link', () => {
    const img = getBlock('nested').querySelector('.media img');
    expect(getComputedStyle(img).borderRadius).to.equal('16px');
  });

  it('places media-first content in the mirrored offset columns', () => {
    const block = getBlock('media-first-offset');
    expect(getComputedStyle(block.querySelector('.media')).gridColumnStart).to.equal('1');
    expect(getComputedStyle(block.querySelector('.foreground')).gridColumnStart).to.equal('9');
  });

  it('covers the content area with the background without growing the block', () => {
    const block = getBlock('covering-background');
    const backgroundRect = block.querySelector('.background').getBoundingClientRect();
    const innerRect = block.querySelector('.inner').getBoundingClientRect();
    const mediaRect = block.querySelector('.media').getBoundingClientRect();
    expect(block.getBoundingClientRect().height).to.be.closeTo(mediaRect.height, 1);
    expect(backgroundRect.height).to.be.closeTo(innerRect.height, 1);
    expect(backgroundRect.width).to.be.closeTo(innerRect.width, 1);
  });

  it('extends the mobile background to the section edges inside a nested container', async () => {
    await setViewport(MOBILE);
    const section = document.querySelector('.section');
    const background = getBlock('nested').querySelector('.background');
    await waitFor(() => Math.abs(background.getBoundingClientRect().width
      - section.getBoundingClientRect().width) < 1);
    const sectionRect = section.getBoundingClientRect();
    const backgroundRect = background.getBoundingClientRect();
    expect(backgroundRect.left).to.be.closeTo(sectionRect.left, 1);
    expect(backgroundRect.width).to.be.closeTo(sectionRect.width, 1);
  });

  it('keeps block spacing outside the background on mobile', async () => {
    await setViewport(MOBILE);
    const block = getBlock('spaced');
    const background = block.querySelector('.background');
    await waitFor(() => getComputedStyle(block).gridTemplateColumns.split(' ').length === 1);
    const { paddingTop, paddingBottom } = getComputedStyle(block);
    const blockRect = block.getBoundingClientRect();
    const backgroundRect = background.getBoundingClientRect();
    expect(parseFloat(paddingTop)).to.be.above(0);
    expect(backgroundRect.top - blockRect.top).to.be.closeTo(parseFloat(paddingTop), 1);
    expect(blockRect.bottom - backgroundRect.bottom).to.be.closeTo(parseFloat(paddingBottom), 1);
  });

  it('limits the background to the grid area from tablet up', () => {
    const block = getBlock('nested');
    const backgroundRect = block.querySelector('.background').getBoundingClientRect();
    const mediaRect = block.querySelector('.media').getBoundingClientRect();
    expect(backgroundRect.left).to.be.closeTo(block.querySelector('.foreground').getBoundingClientRect().left, 1);
    expect(backgroundRect.right).to.be.closeTo(mediaRect.right, 1);
  });

  it('insets all content-boxed content with the card padding', () => {
    const cardInner = getBlock('card').querySelector('.inner');
    const innerRect = cardInner.getBoundingClientRect();
    const fgRect = cardInner.querySelector('.foreground').getBoundingClientRect();
    const mediaRect = cardInner.querySelector('.media').getBoundingClientRect();
    const padding = parseFloat(getComputedStyle(cardInner).paddingTop);
    expect(padding).to.be.above(0);
    expect(cardInner.querySelector('.background').getBoundingClientRect().height)
      .to.be.closeTo(innerRect.height, 1);
    expect(fgRect.left - innerRect.left).to.be.closeTo(padding, 1);
    expect(innerRect.right - mediaRect.right).to.be.closeTo(padding, 1);
    expect(Math.min(fgRect.top, mediaRect.top) - innerRect.top).to.be.closeTo(padding, 1);
    expect(innerRect.bottom - Math.max(fgRect.bottom, mediaRect.bottom)).to.be.closeTo(padding, 1);
  });

  it('paints the content above the background', () => {
    const block = getBlock('card');
    block.scrollIntoView({ block: 'center' });
    const heading = block.querySelector('h2');
    const { left, top, height } = heading.getBoundingClientRect();
    expect(heading.contains(document.elementFromPoint(left + 2, top + height / 2))).to.be.true;
  });

  it('styles the product lockup with eyebrow typography in the default content color', () => {
    const lockup = getBlock('boxed-default').querySelector('.product-lockup');
    const { fontSize, lineHeight, fontWeight, color } = getComputedStyle(lockup);
    expect(fontWeight).to.equal('700');
    expect(fontSize).to.equal('16px');
    expect(lineHeight).to.equal('20px');
    expect(color).to.equal('rgb(0, 0, 0)');
  });

  it('gives a content-boxed block without a background cell the subtle card fill', () => {
    const cardInner = getBlock('boxed-default').querySelector('.inner');
    const { backgroundColor, borderRadius, paddingTop, paddingLeft } = getComputedStyle(cardInner);
    expect(backgroundColor).to.equal('rgb(248, 248, 248)');
    expect(borderRadius).to.equal('22px');
    expect(paddingTop).to.equal('24px');
    expect(paddingLeft).to.equal('24px');
  });

  it('adds 8px under the product lockup from 1440px', async () => {
    const block = getBlock('boxed-default');
    const gap = () => block.querySelector('h2').getBoundingClientRect().top
      - block.querySelector('.product-lockup').getBoundingClientRect().bottom;
    expect(gap()).to.be.closeTo(8, 1);
    await setViewport({ width: 1440, height: 800 });
    await waitFor(() => Math.abs(gap() - 16) < 1);
  });
});
