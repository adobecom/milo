import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

describe('Sitemap List', () => {
  let init;
  let originalPath;

  before(async () => {
    ({ default: init } = await import('../../../libs/blocks/sitemap-list/sitemap-list.js'));
    originalPath = `${window.location.pathname}${window.location.search}`;
  });

  beforeEach(async () => {
    window.history.replaceState({}, '', '/fr/sitemap.html');
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    await init(document.querySelector('#sitemap-list'));
  });

  afterEach(() => {
    window.history.replaceState({}, '', originalPath);
  });

  it('removes the link matching the current sitemap pathname', () => {
    const links = [...document.querySelectorAll('#sitemap-list .sitemap-list-item a')];

    expect(links).to.have.length(2);
    expect(links.map((link) => link.textContent.trim())).to.deep.equal([
      'Australia Sitemap',
      'Germany Sitemap',
    ]);
  });

  it('removes the link when the locale prefix matches even on a different domain', async () => {
    window.history.replaceState({}, '', '/es/sitemap.html');
    document.body.innerHTML = `
      <div class="sitemap-list static-links" id="sitemap-list">
        <div>
          <div>
            <p><a href="https://business.adobe.com/es/sitemap.html">Spain Sitemap</a></p>
            <p><a href="https://business.adobe.com/pt/sitemap.html">Portugal Sitemap</a></p>
          </div>
        </div>
      </div>
    `;

    await init(document.querySelector('#sitemap-list'));

    const links = [...document.querySelectorAll('#sitemap-list .sitemap-list-item a')];
    expect(links.map((link) => link.textContent.trim())).to.deep.equal(['Portugal Sitemap']);
  });

  it('renders a presentational inline list without bullets', () => {
    const block = document.querySelector('#sitemap-list');

    expect(block.querySelector('.sitemap-list-items')).to.exist;
    expect(block.querySelector('ul')).not.to.exist;
    expect(block.querySelectorAll('.sitemap-list-item')).to.have.length(2);
  });
});
