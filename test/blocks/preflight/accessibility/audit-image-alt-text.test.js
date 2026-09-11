/* eslint-disable import/no-named-as-default-member */
import { expect } from '@esm-bundle/chai';
import { html, render } from '../../../../libs/deps/htm-preact.js';
import AuditImageAltText, { checkAlt } from '../../../../libs/blocks/preflight/accessibility/audit-image-alt-text.js';

// 1x1 PNG so the image has intrinsic size and reads as visible.
const PNG = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M8AAAMBAQDJ/pLvAAAAAElFTkSuQmCC';

const waitFor = async (fn, tries = 60) => {
  for (let i = 0; i < tries; i += 1) {
    if (fn()) return;
    // eslint-disable-next-line no-await-in-loop
    await new Promise((r) => { setTimeout(r, 15); });
  }
  throw new Error('waitFor timed out');
};

describe('preflight accessibility audit-image-alt-text', () => {
  let main;

  before(() => {
    main = document.createElement('main');
    main.innerHTML = `
      <img class="a11y-valid" src="${PNG}?valid" alt="A descriptive label">
      <img class="a11y-decorative" src="${PNG}?deco" alt="">
    `;
    document.body.append(main);
  });

  after(() => main.remove());

  it('classifies images with alt text vs decorative (empty alt)', async () => {
    const result = await checkAlt();
    expect(result).to.be.an('object');
    const valid = result.altTextImages.find((i) => i.src.includes('?valid'));
    expect(valid).to.exist;
    expect(valid.alt).to.equal('A descriptive label');
    expect(valid.parent).to.equal('main-content');

    const deco = result.decorativeImages.find((i) => i.src.includes('?deco'));
    expect(deco).to.exist;
    expect(deco.altCheck).to.equal('Decorative');
  });

  it('decorates the DOM with alt-check metadata', () => {
    const valid = main.querySelector('.a11y-valid');
    expect(valid.dataset.pageLocation).to.equal('main-content');
    const deco = main.querySelector('.a11y-decorative');
    expect(deco.dataset.altCheck).to.equal('Decorative');
    expect(main.querySelector('.asset-meta')).to.exist;
  });

  it('is idempotent - a second run short-circuits', async () => {
    const second = await checkAlt();
    expect(second).to.be.undefined;
  });

  describe('AuditImageAltText component', () => {
    let container;

    beforeEach(() => { container = document.createElement('div'); document.body.append(container); });
    afterEach(() => { render(null, container); container.remove(); });

    it('renders image groups populated from the earlier checkAlt run', async () => {
      render(html`<${AuditImageAltText} />`, container);
      await waitFor(() => container.querySelector('.access-image-grid'));
      expect(container.querySelector('.image-filter')).to.exist;
      expect(container.querySelectorAll('.access-image-grid-item').length).to.be.greaterThan(0);
      // dropdown options rendered from filterOptions (per select)
      expect(container.querySelector('.image-filter').querySelectorAll('option').length).to.equal(4);
    });

    it('toggles a group open/closed via the grid heading', async () => {
      render(html`<${AuditImageAltText} />`, container);
      await waitFor(() => container.querySelector('.grid-toggle'));
      const toggle = container.querySelector('.grid-toggle');
      const heading = toggle.closest('.grid-heading');
      const before = heading.classList.contains('is-closed');
      toggle.querySelector('.preflight-group-expand').click(); // SPAN branch
      expect(heading.classList.contains('is-closed')).to.equal(!before);
      toggle.click(); // anchor branch
      expect(heading.classList.contains('is-closed')).to.equal(before);
    });

    it('applies a view filter when the dropdown changes', async () => {
      render(html`<${AuditImageAltText} />`, container);
      await waitFor(() => container.querySelector('.image-filter'));
      const select = container.querySelector('.image-filter');
      const grid = select.closest('.access-image-grid');
      select.value = 'show-footer';
      select.dispatchEvent(new Event('change', { bubbles: true }));
      expect(grid.classList.contains('show-footer')).to.be.true;
    });
  });
});
