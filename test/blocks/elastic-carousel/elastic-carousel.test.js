import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

import init from '../../../libs/c2/blocks/elastic-carousel/elastic-carousel.js';

describe('Elastic Carousel', () => {
  afterEach(() => {
    document.documentElement.removeAttribute('dir');
  });

  it('wraps slides in a carousel container and sets carousel dataset roles', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    const block = document.querySelector('.elastic-carousel');
    await init(block);

    const container = block.querySelector('.elastic-carousel-container');
    expect(container).to.exist;
    expect(container.querySelectorAll('.elastic-carousel-item').length).to.equal(2);

    expect(block.dataset.role).to.equal('group');
    expect(block.dataset.ariaRoledescription).to.equal('carousel');
    expect(block.dataset.ariaRole).to.equal('group');
    expect(block.dataset.ariaLabel).to.equal('My Carousel');
  });

  it('builds each slide as an anchor with link, index and accessibility attributes', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    const block = document.querySelector('.elastic-carousel');
    await init(block);

    const slide = block.querySelector('.elastic-carousel-item');
    expect(slide.tagName).to.equal('A');
    expect(slide.getAttribute('href')).to.equal('https://www.adobe.com/one');
    expect(slide.getAttribute('role')).to.equal('link');
    expect(slide.getAttribute('data-index')).to.equal('1');
    expect(slide.getAttribute('aria-describedby')).to.equal('elastic-carousel-slide-1');
    expect(slide.getAttribute('daa-ll')).to.equal('Learn more-1--Slide one heading');
  });

  it('lays out the header, media and footer regions inside the slide', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    const block = document.querySelector('.elastic-carousel');
    await init(block);

    const slide = block.querySelector('.elastic-carousel-item');
    const inner = slide.querySelector('.elastic-carousel-item-container');
    expect(inner.id).to.equal('elastic-carousel-slide-1');

    const header = slide.querySelector('.elastic-carousel-item-header');
    expect(header.querySelector('img')).to.exist;
    expect(header.querySelector('h3').textContent.trim()).to.equal('Slide one heading');

    expect(slide.querySelector('.elastic-carousel-item-media video')).to.exist;

    const footer = slide.querySelector('.elastic-carousel-item-footer');
    expect(footer.textContent).to.contain('Learn more');
  });

  it('rewrites federated svg icon sources to the federated content root', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    const block = document.querySelector('.elastic-carousel');
    await init(block);

    const icon = block.querySelector('.elastic-carousel-item-header img');
    expect(icon.getAttribute('src')).to.equal('https://main--federal--adobecom.aem.page/federal/icons/icon-one.svg');
  });

  it('prepares a video asset with a source, muted playback and no controls', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    const block = document.querySelector('.elastic-carousel');
    await init(block);

    const video = block.querySelector('.elastic-carousel-item-media video');
    expect(video.getAttribute('preload')).to.equal('none');
    expect(video.hasAttribute('muted')).to.be.true;
    expect(video.getAttribute('tabindex')).to.equal('-1');
    expect(video.hasAttribute('controls')).to.be.false;

    const source = video.querySelector('source');
    expect(source.getAttribute('src')).to.equal('/media/one.mp4');
    expect(source.getAttribute('type')).to.equal('video/mp4');
  });

  it('rewrites a federated svg media asset and falls back to the default carousel name', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/image-asset.html' });
    const block = document.querySelector('.elastic-carousel');
    await init(block);

    const media = block.querySelector('.elastic-carousel-item-media img');
    expect(media.getAttribute('src')).to.equal('https://main--federal--adobecom.aem.page/federal/media/hero.svg');
    // link text has no pipe, so the carousel name falls back to the default
    expect(block.dataset.ariaLabel).to.equal('Adobe slides');
  });

  it('reverses slide order in RTL', async () => {
    document.documentElement.setAttribute('dir', 'rtl');
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    const block = document.querySelector('.elastic-carousel');
    await init(block);

    const firstSlide = block.querySelector('.elastic-carousel-item');
    // in RTL the authored last slide becomes the first rendered slide
    expect(firstSlide.querySelector('h3').textContent.trim()).to.equal('Slide two heading');
  });
});
