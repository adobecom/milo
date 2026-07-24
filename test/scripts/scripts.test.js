import { readFile, setViewport } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { waitForElement } from '../helpers/waitfor.js';

document.head.innerHTML = await readFile({ path: './mocks/head.html' });
document.body.innerHTML = await readFile({ path: './mocks/body.html' });

describe('Decorating', async () => {
  before(async () => {
    await import('../../libs/scripts/scripts.js');
  });

  it('Decorates adobetv autoblock', async () => {
    const autoBlock = await waitForElement(
      'iframe[class="adobetv"]',
      { rootEl: document.body },
    );
    expect(autoBlock.className).to.equal('adobetv');
  });

  it('Decorates modal link', async () => {
    const modalLink = await waitForElement(
      'a[data-modal-path]',
      { rootEl: document.body },
    );
    expect(modalLink.dataset.modalPath).to.equal('/fragments/mock');
  });

  it('martech test', async () => {
    const el = await waitForElement(
      'script[src*="main.standard.qa.min.js"]',
      { rootEl: document.head },
    );
    expect(el).to.exist;
    expect(window.alloy_all).to.exist;
  });
});

describe('loadLCPImage', () => {
  let loadLCPImage;

  before(async () => {
    ({ default: loadLCPImage } = await import('../../libs/scripts/scripts.js'));
  });

  const isEager = (img) => img.getAttribute('loading') === 'eager'
    && img.getAttribute('fetchpriority') === 'high';

  const setMarquee = (name, bgCells, contentImg = true) => {
    const cells = bgCells.map((id) => `<div><picture><img data-bg="${id}"></picture></div>`).join('');
    const bgRow = bgCells.length ? `<div>${cells}</div>` : '';
    const content = `<div><div><h1>Heading</h1>${contentImg ? '<picture><img data-fg="fg"></picture>' : ''}</div></div>`;
    document.body.innerHTML = `<main><div><div class="${name}">${bgRow}${content}</div></div></main>`;
  };

  it('eager loads only the desktop background variant on wide viewports', async () => {
    await setViewport({ width: 1300, height: 800 });
    setMarquee('marquee', ['mobile', 'tablet', 'desktop']);
    loadLCPImage();
    expect(isEager(document.querySelector('img[data-bg="desktop"]'))).to.be.true;
    expect(isEager(document.querySelector('img[data-bg="mobile"]'))).to.be.false;
    expect(isEager(document.querySelector('img[data-bg="tablet"]'))).to.be.false;
    expect(isEager(document.querySelector('img[data-fg]'))).to.be.true;
  });

  it('eager loads the tablet background variant on medium viewports', async () => {
    await setViewport({ width: 800, height: 800 });
    setMarquee('marquee', ['mobile', 'tablet', 'desktop']);
    loadLCPImage();
    expect(isEager(document.querySelector('img[data-bg="tablet"]'))).to.be.true;
    expect(isEager(document.querySelector('img[data-bg="mobile"]'))).to.be.false;
    expect(isEager(document.querySelector('img[data-bg="desktop"]'))).to.be.false;
  });

  it('eager loads the mobile background variant on small viewports', async () => {
    await setViewport({ width: 500, height: 800 });
    setMarquee('marquee', ['mobile', 'tablet', 'desktop']);
    loadLCPImage();
    expect(isEager(document.querySelector('img[data-bg="mobile"]'))).to.be.true;
    expect(isEager(document.querySelector('img[data-bg="tablet"]'))).to.be.false;
    expect(isEager(document.querySelector('img[data-bg="desktop"]'))).to.be.false;
  });

  it('handles two-cell backgrounds and hero-marquee blocks', async () => {
    await setViewport({ width: 800, height: 800 });
    setMarquee('hero-marquee', ['mobile', 'wide']);
    loadLCPImage();
    expect(isEager(document.querySelector('img[data-bg="wide"]'))).to.be.true;
    expect(isEager(document.querySelector('img[data-bg="mobile"]'))).to.be.false;
  });

  it('eager loads all images in a single-row marquee', async () => {
    setMarquee('marquee', [], true);
    loadLCPImage();
    expect(isEager(document.querySelector('img[data-fg]'))).to.be.true;
  });

  it('falls back to the first document image for non-marquee pages', async () => {
    document.body.innerHTML = '<main><div><div class="hero"><picture><img data-first></picture></div></div></main>';
    loadLCPImage();
    expect(isEager(document.querySelector('img[data-first]'))).to.be.true;
  });

  after(async () => {
    await setViewport({ width: 1000, height: 800 });
  });
});
