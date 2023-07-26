import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { setConfig, getConfig } from '../../../libs/utils/utils.js';

async function loadDefaultHtml() {
  document.head.innerHTML = await readFile({ path: './mocks/head.html' });
  document.body.innerHTML = await readFile({ path: './mocks/body.html' });
}

await loadDefaultHtml();

const gnavMod = await import('../../../libs/blocks/gnav/gnav.js');
const searchMod = await import('../../../libs/blocks/gnav/gnav-search.js');
let gnav;

const conf = { locales: { '': { ietf: 'en-US', tk: 'hah7vzn.css' } } };
setConfig(conf);
const config = getConfig();

async function mockAutoComplete(value) {
  sinon.stub(window, 'fetch');
  const fetchText = await readFile({ path: `./mocks/autocomplete.${value}.json` });
  const res = new window.Response(fetchText, { status: 200 });
  window.fetch.returns(Promise.resolve(res));
}

describe('contextual search', () => {
  before(async () => {
    gnav = await gnavMod.default(document.querySelector('header'));
    window.adobeid = { locale: 'en_US' };
  });

  afterEach(() => {
    sinon.restore();
  });

  it('tests gnav search', async () => {
    const searchEl = gnav.decorateSearch();

    expect(searchEl.classList.contains('contextual')).to.be.false;
  });

  it('populates search results ', async () => {
    config.locale.contentRoot = '/test/blocks/gnav/mocks';

    const searchInputEl = gnav.el.querySelector('.gnav-search-input');
    const resultsEl = gnav.el.querySelector('.gnav-search-results > ul');
    const advancedSearchEl = null;
    const value = 'photoshop';
    const locale = { prefix: '/fr' };

    await mockAutoComplete(value);

    await searchMod.onSearchInput({
      value,
      resultsEl,
      locale,
      searchInputEl,
      advancedSearchEl,
    });
    const helpxUrl = resultsEl.querySelector('a').getAttribute('href');

    expect(searchInputEl.classList.contains('gnav-search-input--isPopulated'))
      .to.be.true;
    expect(resultsEl.classList.contains('no-results')).to.be.false;
    expect(helpxUrl).to.contains(`https://helpx.adobe.com${locale.prefix}/globalsearch.html?q=${value}&start_index=0`);
  });

  it('no results is shown when the input is empty', async () => {
    config.locale.contentRoot = '/test/blocks/gnav/mocks';

    const searchInputEl = gnav.el.querySelector('.gnav-search-input');
    const resultsEl = gnav.el.querySelector('.gnav-search-results > ul');
    const advancedSearchEl = null;
    const value = '';
    const locale = { prefix: '' };

    await mockAutoComplete(value);

    await searchMod.onSearchInput({
      value,
      resultsEl,
      locale,
      searchInputEl,
      advancedSearchEl,
    });

    expect(resultsEl.querySelector('li')).to.not.exist;
  });

  it('shows advanced link when no results are found', async () => {
    config.locale.contentRoot = '/test/blocks/gnav/mocks';

    const searchInputEl = gnav.el.querySelector('.gnav-search-input');
    const resultsEl = gnav.el.querySelector('.gnav-search-results > ul');
    const advancedSearchEl = null;
    const value = 'photoshopx';
    const locale = { prefix: '/fr' };

    await mockAutoComplete(value);

    await searchMod.onSearchInput({
      value,
      resultsEl,
      locale,
      searchInputEl,
      advancedSearchEl,
    });

    const liEl = resultsEl.querySelector('li a');
    const [ariaLabel, helpxUrl] = ['aria-label', 'href'].map((x) => liEl.getAttribute(x));

    expect(ariaLabel).to.eq('Try our advanced search');
    expect(helpxUrl).to.contains(`https://helpx.adobe.com${locale.prefix}/globalsearch.html?q=${value}&start_index=0`);
  });
});
