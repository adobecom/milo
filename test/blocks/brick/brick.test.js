import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { getLocale, setConfig } from '../../../libs/utils/utils.js';

document.body.innerHTML = await readFile({ path: './mocks/body.html' });
const { default: init } = await import('../../../libs/blocks/brick/brick.js');
const { default: getFragment } = await import('../../../libs/blocks/fragment/fragment.js');

const locales = { '': { ietf: 'en-US', tk: 'hah7vzn.css' } };
const config = {
  imsClientId: 'milo',
  codeRoot: '/libs',
  contentRoot: `${window.location.origin}${getLocale(locales).prefix}`,
  locales,
};
setConfig(config);

describe('basic brick', () => {
  const bricks = document.querySelectorAll('.brick');
  bricks.forEach((brick) => {
    init(brick);
  });
  const fullCopy = document.querySelector('#full-copy');

  it('has a heading-xxl for large brick', () => {
    const heading = document.body.querySelector('.large .heading-xxl');
    expect(heading).to.exist;
  });

  it('has a body-m', () => {
    const bodyCopy = document.body.querySelector('.brick .foreground .body-m');
    expect(bodyCopy).to.exist;
  });

  it('has a detail-l', () => {
    const bodyCopy = document.body.querySelector('.brick .foreground .detail-l');
    expect(bodyCopy).to.exist;
  });

  it('has text overrides', () => {
    const heading = document.body.querySelector('#textOverride .foreground .heading-l');
    const bodyCopy = document.body.querySelector('#textOverride .foreground .body-l');
    expect(heading).to.exist;
    expect(bodyCopy).to.exist;
  });

  it('has clickable brick', () => {
    const a = document.body.querySelector('.click a');
    expect(a.classList.contains('foreground')).to.be.true;
  });

  it('supports gradient color', () => {
    const bgColor = document.body.querySelector('.brick .background');
    expect(bgColor.style.background).to.not.be.null;
  });

  it('has background image', () => {
    const bgImage = document.body.querySelector('.brick .background');
    expect(bgImage.querySelector('picture')).to.exist;
  });

  it('has icon stack', () => {
    expect(fullCopy.querySelector('.icon-stack-area')).to.exist;
  });

  it('has supplemental text with small font', () => {
    expect(fullCopy.querySelector('.supplemental-text.body-xs')).to.exist;
  });

  it('has supplemental text with small font in override', () => {
    expect(bricks[0].querySelector('.supplemental-text.body-xs')).to.exist;
  });

  it('Arranges media with split row', async () => {
    expect(document.querySelector('.media-brick.split.row.media-right')).to.exist;
  });

  it('renders in fragments', async () => {
    const fragmentLink = document.body.querySelector('.fragment-link');
    await getFragment(fragmentLink);
    const fragment = document.querySelector('.fragment');
    expect(fragment).to.exist;
  });

  it('fragment labels grid in section', async () => {
    const fragment = document.querySelector('.fragment');
    init(fragment);
    const fullGrids = fragment.closest('.section.masonry-layout').querySelectorAll('.large');
    expect(fullGrids.length > 2).to.be.true;
  });
});

describe('brick with media-visible-mobile-tablet and focal point', () => {
  it('sets focal point to left when media-cover-left is used', () => {
    const brick = document.querySelector('#focal-point-left');
    const position = brick.style.getPropertyValue('--brick-media-position');
    expect(position).to.equal('left');
  });

  it('sets focal point to right when media-cover-right is used', () => {
    const brick = document.querySelector('#focal-point-right');
    const position = brick.style.getPropertyValue('--brick-media-position');
    expect(position).to.equal('right');
  });

  it('sets focal point to top when media-cover-top is used', () => {
    const brick = document.querySelector('#focal-point-top');
    const position = brick.style.getPropertyValue('--brick-media-position');
    expect(position).to.equal('top');
  });

  it('sets focal point to bottom when media-cover-bottom is used', () => {
    const brick = document.querySelector('#focal-point-bottom');
    const position = brick.style.getPropertyValue('--brick-media-position');
    expect(position).to.equal('bottom');
  });

  it('does not set focal point when no media-cover class is used', () => {
    const brick = document.querySelector('#focal-point-none');
    const position = brick.style.getPropertyValue('--brick-media-position');
    expect(position).to.equal('');
  });

  it('does not set focal point when media-visible-mobile-tablet is not present', () => {
    const brick = document.querySelector('#focal-point-without-media-visible');
    const position = brick.style.getPropertyValue('--brick-media-position');
    expect(position).to.equal('');
    expect(brick.classList.contains('split')).to.be.true;
  });

  it('has split row layout with media-visible-mobile-tablet', () => {
    const brick = document.querySelector('#focal-point-left');
    expect(brick.classList.contains('split')).to.be.true;
    expect(brick.classList.contains('row')).to.be.true;
  });

  it('has brick-media element with media-visible-mobile-tablet', () => {
    const brick = document.querySelector('#focal-point-left');
    const mediaEl = brick.querySelector('.brick-media');
    expect(mediaEl).to.exist;
  });

  it('applies object-position CSS to media elements', () => {
    const brick = document.querySelector('#focal-point-bottom');
    const img = brick.querySelector('.brick-media img');
    expect(img).to.exist;
  });
});
