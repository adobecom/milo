import { readFile, setViewport } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { loadStyle } from '../../../libs/utils/utils.js';
import init from '../../../libs/c2/blocks/product-marquee-media/product-marquee-media.js';

describe('Product Marquee Media', () => {
  let block;

  before(async () => {
    await Promise.all([
      '/libs/c2/styles/styles.css',
      '/libs/blocks/video/video.css',
      '/libs/c2/blocks/product-marquee-media/product-marquee-media.css',
    ].map((href) => new Promise((resolve, reject) => {
      loadStyle(href, (status) => {
        if (status === 'error') reject(new Error(`Failed to load ${href}`));
        else resolve();
      });
    })));
  });

  beforeEach(async () => {
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    block = document.querySelector('.product-marquee-media');
  });

  afterEach(async () => {
    await setViewport({ width: 800, height: 600 });
  });

  it('moves the existing merch card below the copy and keeps live fields and links', () => {
    const fields = [...block.querySelectorAll('mas-field')];
    init(block);

    const foreground = block.querySelector('.pm-foreground');
    const promo = foreground.querySelector('.pm-copy').lastElementChild;
    expect(promo.classList.contains('pm-promo-area')).to.be.true;
    expect(promo.previousElementSibling.classList.contains('pm-text')).to.be.true;
    expect([...promo.querySelectorAll('mas-field')]).to.deep.equal(fields);
    expect(promo.querySelector('.mas-price-commitment').textContent).to.equal('Annual, billed monthly');
    expect([...promo.querySelectorAll('.pm-merch-ctas a')].map((a) => a.href)).to.deep.equal([
      'https://www.adobe.com/free-trial',
      'https://www.adobe.com/plans',
    ]);
    fields[0].textContent = 'Updated live description';
    expect(promo.querySelector('.mas-description').textContent).to.equal('Updated live description');
  });

  it('keeps the original picture in a separate media cell after the foreground', () => {
    const picture = block.firstElementChild.children[2].querySelector('picture');
    init(block);

    const media = block.querySelector('.pm-media');
    expect(media.querySelector('picture')).to.equal(picture);
    expect(media.previousElementSibling.classList.contains('pm-foreground')).to.be.true;
  });

  it('keeps the authored icon and eyebrow above the main heading', () => {
    const icon = block.querySelector('img');
    init(block);

    const eyebrow = block.querySelector('.pm-product-lockup');
    expect(eyebrow.querySelector('img')).to.equal(icon);
    expect(eyebrow.textContent.trim()).to.equal('Photoshop');
    expect(eyebrow.nextElementSibling.matches('h2.heading-2')).to.be.true;
    expect(eyebrow.nextElementSibling.nextElementSibling.matches('p.body-md')).to.be.true;
  });

  it('keeps supporting links below the buttons without turning them into merch CTAs', () => {
    const supporting = block.lastElementChild.firstElementChild;
    const links = [...supporting.querySelectorAll('a')];
    init(block);

    expect(block.querySelector('.pm-foreground').lastElementChild).to.equal(supporting);
    expect(supporting.classList.contains('caption')).to.be.true;
    expect([...supporting.querySelectorAll('a')]).to.deep.equal(links);
    expect(supporting.querySelector('.con-button')).to.be.null;
    expect(block.querySelectorAll('.pm-merch-ctas a').length).to.equal(2);
  });

  it('supports copy without an eyebrow or supporting row', () => {
    block.querySelector('p').remove();
    block.lastElementChild.remove();
    init(block);

    expect(block.querySelector('.pm-text').firstElementChild.matches('h2.heading-2')).to.be.true;
    expect(block.querySelector('.pm-supporting')).to.be.null;
  });

  it('preserves decorated video, playback controls, and event listeners', () => {
    const media = block.firstElementChild.children[2];
    media.innerHTML = '<div class="video-holder"><video controls muted playsinline aria-label="Product overview"></video><button type="button">Pause motion</button></div>';
    const video = media.querySelector('video');
    const button = media.querySelector('button');
    let clicked = false;
    button.addEventListener('click', () => { clicked = true; });
    init(block);

    expect(block.querySelector('.pm-media video')).to.equal(video);
    expect(video.controls).to.be.true;
    expect(video.getAttribute('aria-label')).to.equal('Product overview');
    button.click();
    expect(clicked).to.be.true;
  });

  it('retains the existing special-promo theme treatment', () => {
    block.classList.add('special-promo', 'dark');
    init(block);
    expect(block.querySelector('.pm-foreground .pm-merch-card.light')).to.exist;
  });

  it('keeps playback controls onscreen when a desktop video is wider than its cell', async () => {
    block.insertAdjacentHTML('beforebegin', '<meta name="foundation" content="c2">');
    const media = block.firstElementChild.children[2];
    media.innerHTML = '<div class="video-container video-holder"><video style="width: 1400px"></video><button class="play-pause-button video-button" type="button" aria-label="Pause motion"></button></div>';
    await setViewport({ width: 900, height: 900 });
    init(block);

    const control = block.querySelector('.pm-media button').getBoundingClientRect();
    expect(control.left).to.be.at.least(0);
    expect(control.right).to.be.at.most(window.innerWidth);
    expect(document.documentElement.scrollWidth).to.equal(window.innerWidth);
  });

  it('inherits copy and merch when a desktop viewport overrides only media', async () => {
    block.firstElementChild.insertAdjacentHTML('beforebegin', '<div><div>Mobile-viewport()</div></div>');
    block.insertAdjacentHTML('beforeend', '<div><div>Tablet-viewport()</div></div><div><div><h2>Tablet headline</h2></div><div></div><div></div></div><div><div><p>Tablet support <a href="https://www.adobe.com/plans">Compare plans</a></p></div></div><div><div>Desktop-viewport()</div></div><div><div></div><div></div><div><video controls aria-label="Desktop overview"></video></div></div><div><div></div></div>');
    await setViewport({ width: 1440, height: 900 });
    init(block);

    expect(block.querySelector('.pm-text h2').textContent).to.equal('Tablet headline');
    expect(block.querySelectorAll('.pm-foreground .pm-merch-ctas a').length).to.equal(2);
    expect(block.querySelector('.pm-media video')).to.exist;
    expect(block.querySelector('.pm-supporting').textContent).to.include('Tablet support');

    await setViewport({ width: 900, height: 900 });
    await new Promise((resolve) => { requestAnimationFrame(resolve); });
    expect(block.querySelector('.pm-text h2').textContent).to.equal('Tablet headline');
    expect(block.querySelector('.pm-media picture')).to.exist;
    expect(block.querySelector('.pm-supporting a').textContent).to.equal('Compare plans');

    await setViewport({ width: 390, height: 844 });
    await new Promise((resolve) => { requestAnimationFrame(resolve); });
    expect(block.querySelector('.pm-text h2').textContent)
      .to.equal('Make something amazing.');
    expect(block.querySelector('.pm-media picture')).to.exist;
    expect(block.querySelectorAll('.pm-foreground .pm-merch-ctas a').length).to.equal(2);
    expect(block.querySelector('.pm-supporting').textContent).to.include('Not a student or teacher?');
  });

  it('bleeds mobile media and uses a five/seven desktop split without page overflow', async () => {
    init(block);
    const image = block.querySelector('.pm-media img');
    await image.decode();

    await setViewport({ width: 390, height: 844 });
    const foreground = block.querySelector('.pm-foreground');
    const media = block.querySelector('.pm-media');
    expect(media.getBoundingClientRect().top)
      .to.be.at.least(foreground.getBoundingClientRect().bottom);
    const frame = block.querySelector('.pm-media-frame');
    const mobileScale = frame.getBoundingClientRect().width / media.getBoundingClientRect().width;
    expect(Math.abs(mobileScale - 1.2)).to.be.lessThan(0.01);
    expect(image.getBoundingClientRect().right).to.be.greaterThan(window.innerWidth);
    expect(document.documentElement.scrollWidth).to.equal(window.innerWidth);

    await setViewport({ width: 768, height: 900 });
    expect(media.getBoundingClientRect().top)
      .to.be.at.least(foreground.getBoundingClientRect().bottom);
    expect(Math.round(image.getBoundingClientRect().width)).to.equal(1052);

    await setViewport({ width: 1440, height: 900 });
    const left = foreground.getBoundingClientRect();
    const right = media.getBoundingClientRect();
    const asset = image.getBoundingClientRect();
    expect(right.width).to.be.greaterThan(left.width);
    expect(right.left).to.be.greaterThan(left.right);
    expect(asset.left - right.left).to.equal(72);
    expect(asset.right).to.be.greaterThan(window.innerWidth);
    expect(document.documentElement.scrollWidth).to.equal(window.innerWidth);
  });

  it('supports copy and merch without media', () => {
    block.firstElementChild.children[2].remove();
    init(block);
    expect(block.querySelector('.pm-foreground .pm-merch-card')).to.exist;
    expect(block.querySelector('.pm-media')).to.be.null;
  });
});
