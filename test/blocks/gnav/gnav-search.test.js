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

describe('contextual search', () => {
  let fetchStub;
  before(async () => {
    gnav = await gnavMod.default(document.querySelector('header'));
    window.adobeid = { locale: 'en_US' };
  });

  beforeEach(() => {
    fetchStub = sinon.stub(window, 'fetch');
  });

  afterEach(() => {
    sinon.restore();
    fetchStub.restore();
  });

  it('tests gnav search', async () => {
    const searchEl = gnav.decorateSearch();

    expect(searchEl.classList.contains('contextual')).to.be.false;
  });

  it('populates search results ', async () => {
    const value = 'photoshop';
    fetchStub.callsFake(async (url) => {
      if (url.includes('/config.json')) {
        const miloConfigData = await readFile({ path: '../../../test/utils/mocks/.milo/config.json' });
        const res = new window.Response(miloConfigData, { status: 200 });
        return Promise.resolve(res);
      }
      if (url.includes('/autocomplete')) {
        const autocompleteData = await readFile({ path: `./mocks/autocomplete.${value}.json` });
        const res = new window.Response(autocompleteData, { status: 200 });
        return Promise.resolve(res);
      }
      return null;
    });
    config.locale.contentRoot = '/test/blocks/gnav/mocks';

    const searchInputEl = gnav.el.querySelector('.gnav-search-input');
    const resultsEl = gnav.el.querySelector('.gnav-search-results > ul');
    const advancedSearchEl = null;
    const locale = { prefix: '/fr' };

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
    const value = '';
    fetchStub.callsFake(async (url) => {
      if (url.includes('/config.json')) {
        const miloConfigData = await readFile({ path: '../../../test/utils/mocks/.milo/config.json' });
        const res = new window.Response(miloConfigData, { status: 200 });
        return Promise.resolve(res);
      }
      if (url.includes('/autocomplete')) {
        const autocompleteData = await readFile({ path: `./mocks/autocomplete.${value}.json` });
        const res = new window.Response(autocompleteData, { status: 200 });
        return Promise.resolve(res);
      }
      return null;
    });
    config.locale.contentRoot = '/test/blocks/gnav/mocks';

    const searchInputEl = gnav.el.querySelector('.gnav-search-input');
    const resultsEl = gnav.el.querySelector('.gnav-search-results > ul');
    const advancedSearchEl = null;
    const locale = { prefix: '' };

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
    const value = 'photoshopx';
    fetchStub.callsFake(async (url) => {
      if (url.includes('/config.json')) {
        const miloConfigData = await readFile({ path: '../../../test/utils/mocks/.milo/config.json' });
        const res = new window.Response(miloConfigData, { status: 200 });
        return Promise.resolve(res);
      }
      if (url.includes('/autocomplete')) {
        const autocompleteData = await readFile({ path: `./mocks/autocomplete.${value}.json` });
        const res = new window.Response(autocompleteData, { status: 200 });
        return Promise.resolve(res);
      }
      return null;
    });
    config.locale.contentRoot = '/test/blocks/gnav/mocks';

    const searchInputEl = gnav.el.querySelector('.gnav-search-input');
    const resultsEl = gnav.el.querySelector('.gnav-search-results > ul');
    const advancedSearchEl = null;
    const locale = { prefix: '/fr' };

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
