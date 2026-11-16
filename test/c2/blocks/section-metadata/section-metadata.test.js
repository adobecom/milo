import { expect } from '@esm-bundle/chai';
import { readFile, setViewport } from '@web/test-runner-commands';

describe('C2 section metadata bento styles', () => {
  let stylesheet;
  let section;
  let viewport;

  before(async () => {
    viewport = { width: window.innerWidth, height: window.innerHeight };
    stylesheet = document.createElement('style');
    stylesheet.textContent = await readFile({ path: '../../../../libs/c2/blocks/section-metadata/section-metadata.css' });
    document.head.append(stylesheet);
  });

  after(async () => {
    stylesheet.remove();
    await setViewport(viewport);
  });

  beforeEach(() => {
    section = document.createElement('div');
    section.className = 'section bento masonry-layout';
    section.innerHTML = `
      <div class="explore-card grid-span-4">
        <div class="explore-card-content">
          <h2 class="heading-m">Heading</h2>
          <div class="content-aux"></div>
        </div>
      </div>
      <div class="explore-card grid-span-6">
        <div class="explore-card-content"><div class="content-aux"></div></div>
      </div>
      <div class="explore-card grid-full-width">
        <div class="explore-card-content"><div class="content-aux"></div></div>
      </div>`;
    document.body.append(section);
  });

  afterEach(() => {
    section.remove();
  });

  [768, 1280].forEach((width) => {
    it(`excludes only grid-span-4 cards from the selected ratio at ${width}px`, async () => {
      await setViewport({ width, height: 768 });
      const card = section.querySelector('.grid-span-4');
      const cardAux = card.querySelector('.content-aux');
      const siblingAux = section.querySelector('.grid-span-6 .content-aux');
      const fullWidthAux = section.querySelector('.grid-full-width .content-aux');

      expect(getComputedStyle(cardAux).aspectRatio).to.equal('1 / 1.1');
      expect(getComputedStyle(siblingAux).aspectRatio).to.equal('1 / 0.88');
      expect(getComputedStyle(fullWidthAux).aspectRatio).to.equal('4 / 1.65');
      expect(getComputedStyle(section.querySelector('.heading-m')).marginTop).to.equal('0px');

      card.classList.replace('grid-span-4', 'grid-span-6');
      expect(getComputedStyle(cardAux).aspectRatio).to.equal('1 / 0.88');
      expect(getComputedStyle(siblingAux).aspectRatio).to.equal('1 / 0.88');
      expect(getComputedStyle(fullWidthAux).aspectRatio).to.equal('4 / 1.65');

      card.classList.replace('grid-span-6', 'grid-span-4');
      expect(getComputedStyle(cardAux).aspectRatio).to.equal('1 / 1.1');
      expect(getComputedStyle(siblingAux).aspectRatio).to.equal('1 / 0.88');
    });
  });

  it('keeps the existing mobile ratio', async () => {
    await setViewport({ width: 767, height: 768 });
    expect(getComputedStyle(section.querySelector('.grid-span-4 .content-aux')).aspectRatio)
      .to.equal('1 / 1.1');
    expect(getComputedStyle(section.querySelector('.grid-span-6 .content-aux')).aspectRatio)
      .to.equal('1 / 1.1');
    expect(getComputedStyle(section.querySelector('.grid-full-width .content-aux')).aspectRatio)
      .to.equal('1 / 1.1');
  });
});
