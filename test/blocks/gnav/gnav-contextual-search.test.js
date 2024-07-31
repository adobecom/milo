import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { setConfig, getConfig } from '../../../libs/utils/utils.js';

async function loadDefaultHtml() {
  document.head.innerHTML = await readFile({ path: './mocks/head.html' });
  document.body.innerHTML = await readFile({ path: './mocks/body.html' });
}

await loadDefaultHtml();

const gnavMod = await import('../../../libs/blocks/gnav/gnav.js');
const contextualMod = await import('../../../libs/blocks/gnav/gnav-contextual-search.js');
let gnav;

const conf = { locales: { '': { ietf: 'en-US', tk: 'hah7vzn.css' } } };
setConfig(conf);
const config = getConfig();

describe('contextual search', () => {
  before(async () => {
    gnav = await gnavMod.default(document.querySelector('header'));
  });

  it('tests contextual gnav', async () => {
    gnav.body.querySelector('.search')?.classList.add('contextual');
    const searchEl = gnav.decorateSearch();

    expect(searchEl.classList.contains('contextual')).to.be.true;
  });

  it('populates contextual results ', async () => {
    config.locale.contentRoot = '/test/blocks/gnav/mocks';

    const searchInputEl = gnav.el.querySelector('.gnav-search-input');
    const resultsEl = gnav.el.querySelector('.gnav-search-results > ul');
    const advancedSearchEl = null;
    const value = 'adobe';

    await contextualMod.default({ value, resultsEl, searchInputEl, advancedSearchEl });

    expect(searchInputEl.classList.contains('gnav-search-input--isPopulated')).to.be.true;
    expect(resultsEl.classList.contains('no-results')).to.be.false;
    expect(resultsEl.querySelector('.article-card')).to.be.exist;
  });

  it('no results is shown when the input is empty', async () => {
    config.locale.contentRoot = '/test/blocks/gnav/mocks';

    const searchInputEl = gnav.el.querySelector('.gnav-search-input');
    const resultsEl = gnav.el.querySelector('.gnav-search-results > ul');
    const advancedSearchEl = null;
    const value = '';

    await contextualMod.default({ value, resultsEl, searchInputEl, advancedSearchEl });

    expect(resultsEl.querySelector('li')).to.not.exist;
  });

  it('shows advanced link when no results are found', async () => {
    config.locale.contentRoot = '/test/blocks/gnav/mocks';

    const searchInputEl = gnav.el.querySelector('.gnav-search-input');
    const resultsEl = gnav.el.querySelector('.gnav-search-results > ul');

    // add advanced link
    const searchBlock = gnav.body.querySelector('.search');
    const advancedSearchEl = searchBlock.querySelector('div > div > p:last-child');
    advancedSearchEl.innerHTML = `
      <a href="https://adobe.com">Try our advanced search</a>
    `;

    const value = 'test-no-results';
    await contextualMod.default({ value, resultsEl, searchInputEl, advancedSearchEl });

    expect(resultsEl.querySelector('a')).to.be.exist;
  });

  it('retains spacing and capitalization of results', async () => {
    config.locale.contentRoot = '/test/blocks/gnav/mocks';

    const searchInputEl = gnav.el.querySelector('.gnav-search-input');
    const resultsEl = gnav.el.querySelector('.gnav-search-results > ul');
    const advancedSearchEl = null;
    const value = 'adobe experience';

    await contextualMod.default({ value, resultsEl, searchInputEl, advancedSearchEl });

    const heading = resultsEl.querySelector('.article-card h3');
    expect(heading.textContent).to.equal('Get Ready For the Adobe Experience Festival');
  });
});
