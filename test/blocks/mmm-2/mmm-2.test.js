import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { stub } from 'sinon';
import { getConfig } from '../../../libs/utils/utils.js';

const config = getConfig();
config.mep = {
  akamaiCode: 'us',
  consentState: { performance: true, advertising: true },
};

// Generous delay: Preact's useEffect flush can fall back to a rAF/~100ms-timeout
// scheduling path rather than a microtask, so short delays here are flaky.
const delay = (ms = 150) => new Promise((resolve) => { setTimeout(resolve, ms); });

const FAKE_INACTIVITY_PLAIN_HTML = `
  <body>
    <div class="mmm target-cleanup">
      <div><div>Menu: geos</div><div>Regions/Top Geos</div></div>
      <div><div>us,ca</div><div>NA all geos: US, CA</div></div>
    </div>
  </body>
`;

function jsonResponse(data) {
  return { ok: true, json: () => Promise.resolve(data) };
}

function textResponse(text) {
  return { ok: true, text: () => Promise.resolve(text) };
}

async function loadJson(path) {
  return JSON.parse(await readFile({ path }));
}

/** Routes fetch calls by substring match against the request URL. */
function setRoutedFetch(routes) {
  window.fetch = stub().callsFake((url) => {
    const key = Object.keys(routes).find((pattern) => url.includes(pattern));
    if (!key) throw new Error(`Unmocked fetch: ${url}`);
    return Promise.resolve(routes[key]);
  });
}

describe('mmm-2', () => {
  let getPagesData;
  let getPageData;
  let getReportData;

  before(async () => {
    getPagesData = await loadJson('./mocks/get-pages.json');
    getPageData = await loadJson('./mocks/get-page.json');
    getReportData = await loadJson('./mocks/get-report.json');
  });

  beforeEach(async () => {
    localStorage.clear();
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
  });

  it('renders the search view by default with the authored pages/geos dropdowns', async () => {
    setRoutedFetch({ '/get-pages': jsonResponse(getPagesData) });
    const module = await import('../../../libs/blocks/mmm-2/mmm-2.js');
    await module.default(document.querySelector('.mmm-2'));
    await delay();

    const tabs = document.querySelectorAll('.mmm2-tab-button');
    expect(tabs.length).to.equal(3);
    expect(tabs[0].classList.contains('is-active')).to.be.true;

    expect(document.querySelector('#mmm2-filter-pages')).to.exist;
    expect(document.querySelector('#mmm2-filter-geos')).to.exist;

    const pageItems = document.querySelectorAll('.mmm2-page-item');
    expect(pageItems.length).to.equal(getPagesData.result.length);
    expect(pageItems[0].querySelector('.mmm2-page-heading a').href).to.equal(getPagesData.result[0].url);
  });

  it('expands a page row and loads its manifest details', async () => {
    setRoutedFetch({
      '/get-pages': jsonResponse(getPagesData),
      '/get-page': jsonResponse(getPageData),
    });
    const module = await import('../../../libs/blocks/mmm-2/mmm-2.js');
    await module.default(document.querySelector('.mmm-2'));
    await delay();

    const trigger = document.querySelector('.mmm2-page-trigger');
    expect(trigger.getAttribute('aria-expanded')).to.equal('false');
    trigger.click();
    await delay();
    expect(trigger.getAttribute('aria-expanded')).to.equal('true');
    expect(document.querySelector('.mmm2-page-detail .mep-popup')).to.exist;
  });

  it('switches tabs, updates the URL, and loads the inactivity report via the cross-page geos fetch', async () => {
    window.history.pushState({}, '', window.location.pathname);
    setRoutedFetch({
      '/get-pages': jsonResponse(getPagesData),
      '.plain.html': textResponse(FAKE_INACTIVITY_PLAIN_HTML),
      '/get-report': jsonResponse(getReportData),
    });
    const module = await import('../../../libs/blocks/mmm-2/mmm-2.js');
    await module.default(document.querySelector('.mmm-2'));
    await delay();

    const [, inactivityTab] = document.querySelectorAll('.mmm2-tab-button');
    inactivityTab.click();
    await delay();

    expect(window.location.search).to.equal('?tab=inactivity');
    expect(document.querySelector('.mmm2-inactivity-view')).to.exist;
    expect(document.querySelector('#mmm2-report-filter-geos')).to.exist;
    const rows = document.querySelectorAll('.mmm2-report-row');
    expect(rows.length).to.equal(getReportData.result.length);

    const [searchTab] = document.querySelectorAll('.mmm2-tab-button');
    searchTab.click();
    await delay();
    expect(window.location.search).to.equal('');
    expect(document.querySelector('.mmm2-search-view')).to.exist;
  });

  it('restores the active tab from the URL on load', async () => {
    window.history.pushState({}, '', `${window.location.pathname}?tab=metadata-lookup`);
    setRoutedFetch({
      '/get-pages': jsonResponse(getPagesData),
      'metadata-optimization.json': jsonResponse({ data: [] }),
    });
    const module = await import('../../../libs/blocks/mmm-2/mmm-2.js');
    await module.default(document.querySelector('.mmm-2'));
    await delay();

    const tabs = document.querySelectorAll('.mmm2-tab-button');
    expect(tabs[2].classList.contains('is-active')).to.be.true;
    expect(document.querySelector('.mmm2-metadata-view')).to.exist;
    window.history.pushState({}, '', window.location.pathname);
  });
});
