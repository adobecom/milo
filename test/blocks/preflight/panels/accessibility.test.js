/* eslint-disable import/no-named-as-default-member */
import { expect } from '@esm-bundle/chai';
import { html, render } from '../../../../libs/deps/htm-preact.js';
import Accessibility, { checkAlt } from '../../../../libs/blocks/preflight/panels/accessibility.js';

const PNG = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M8AAAMBAQDJ/pLvAAAAAElFTkSuQmCC';

const waitFor = async (fn, tries = 60) => {
  for (let i = 0; i < tries; i += 1) {
    if (fn()) return;
    // eslint-disable-next-line no-await-in-loop
    await new Promise((r) => { setTimeout(r, 15); });
  }
  throw new Error('waitFor timed out');
};

describe('preflight panels accessibility', () => {
  let main;

  before(() => {
    main = document.createElement('main');
    main.innerHTML = `
      <img class="p-valid" src="${PNG}?valid" alt="A described image">
      <img class="p-deco" src="${PNG}?deco" alt="">
    `;
    document.body.append(main);
  });

  after(() => main.remove());

  it('classifies images by alt text', async () => {
    const result = await checkAlt();
    expect(result.altTextImages.find((i) => i.src.includes('?valid')).alt).to.equal('A described image');
    expect(result.decorativeImages.find((i) => i.src.includes('?deco')).altCheck).to.equal('Decorative');
  });

  it('decorates the images with metadata nodes', () => {
    expect(main.querySelector('.p-valid').dataset.pageLocation).to.equal('main-content');
    expect(main.querySelector('.p-deco').dataset.altCheck).to.equal('Decorative');
    expect(main.querySelector('.asset-meta')).to.exist;
  });

  it('short-circuits on a second run', async () => {
    expect(await checkAlt()).to.be.undefined;
  });

  describe('Accessibility component', () => {
    let container;
    beforeEach(() => { container = document.createElement('div'); document.body.append(container); });
    afterEach(() => { render(null, container); container.remove(); });

    it('renders the image groups and a working filter dropdown', async () => {
      render(html`<${Accessibility} />`, container);
      await waitFor(() => container.querySelector('.image-filter'));
      expect(container.querySelector('.image-filter').querySelectorAll('option').length).to.equal(4);
      const grid = container.querySelector('.image-filter').closest('.access-image-grid');
      const select = container.querySelector('.image-filter');
      select.value = 'show-gnav';
      select.dispatchEvent(new Event('change', { bubbles: true }));
      expect(grid.classList.contains('show-gnav')).to.be.true;
    });

    it('toggles a group open and closed', async () => {
      render(html`<${Accessibility} />`, container);
      await waitFor(() => container.querySelector('.grid-toggle'));
      const toggle = container.querySelector('.grid-toggle');
      const heading = toggle.closest('.grid-heading');
      const start = heading.classList.contains('is-closed');
      toggle.querySelector('.preflight-group-expand').click();
      expect(heading.classList.contains('is-closed')).to.equal(!start);
    });
  });
});
