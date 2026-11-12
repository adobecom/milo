import { readFile, setViewport } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { stub } from 'sinon';
import { render } from '../../../libs/deps/htm-preact.js';
import { getConfig, setConfig, loadArea, preloadLcpCodeFiles } from '../../../libs/utils/utils.js';
import { LOCAL_STORAGE_KEYS, filterPageActivities } from '../../../libs/blocks/mmm-2/utils.js';
import { waitFor } from '../../helpers/waitfor.js';

const originalFetch = window.fetch;
const FIREWALL_CHECK_HOST = 'mep-auth-check.awesome-sites.corp.adobe.com';
const dataRequests = () => window.fetch.getCalls()
  .filter(({ args }) => !args[0].includes(FIREWALL_CHECK_HOST));
setConfig({ codeRoot: '/libs', env: { name: 'stage' } });
const config = getConfig();
config.mep = {
  akamaiCode: 'us',
  consentState: { performance: true, advertising: true },
};

// Generous delay: Preact's useEffect flush can fall back to a rAF/~100ms-timeout
// scheduling path rather than a microtask, so short delays here are flaky.
const delay = (ms = 150) => new Promise((resolve) => { setTimeout(resolve, ms); });

function jsonResponse(data) {
  return { ok: true, json: () => Promise.resolve(data) };
}

async function loadJson(path) {
  return JSON.parse(await readFile({ path }));
}

/** Routes fetch calls by substring match against the request URL. */
function setRoutedFetch(routes) {
  window.fetch = stub().callsFake((url) => {
    if (url.includes(FIREWALL_CHECK_HOST)) return Promise.reject(new Error('offline'));
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
    window.history.replaceState({}, '', window.location.pathname);
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const sidekick = document.createElement('aem-sidekick');
    const bar = document.createElement('plugin-action-bar');
    const user = document.createElement('login-button');
    user.id = 'user';
    sidekick.attachShadow({ mode: 'open' }).append(bar);
    bar.attachShadow({ mode: 'open' }).append(user);
    document.body.append(sidekick);
  });

  afterEach(() => {
    render(null, document.querySelector('.mmm-2'));
    document.querySelector('aem-sidekick')?.remove();
    window.fetch = originalFetch;
  });

  it('renders Manifest Manager with local authored menus and no reference-page fetch', async () => {
    setRoutedFetch({ '/get-pages': jsonResponse(getPagesData) });
    const module = await import('../../../libs/blocks/mmm-2/mmm-2.js');
    await module.default(document.querySelector('.mmm-2'));
    await delay();

    const tabs = document.querySelectorAll('.mmm2-tab-button');
    expect(tabs.length).to.equal(3);
    expect(tabs[0].classList.contains('is-active')).to.be.true;
    expect(tabs[0].textContent).to.equal('Manifest Manager');
    expect(window.fetch.getCalls().some(({ args }) => args[0].includes('.plain.html'))).to.be.false;
    expect(document.querySelector('.section > :is(.manifest-manager, .inactivity-report, .metadata-lookup):not(.mmm-2)')).to.not.exist;

    expect(document.querySelector('#mmm2-filter-pages')).to.exist;
    expect(document.querySelector('#mmm2-filter-geos')).to.exist;
    expect([...document.querySelectorAll('#mmm2-filter-geos option')]).to.have.length(20);
    expect([...document.querySelectorAll('#mmm2-filter-pages option')]).to.have.length(5);
    expect(document.querySelector('#mmm2-filter-pages option[value="/,/creativecloud.html,/products/photoshop.html,/products/illustrator.html"]')).to.exist;
    expect([...document.querySelectorAll('#mmm2-filter-lastseen option')].map((option) => option.value))
      .to.deep.equal(['', 'day', 'week', 'month', 'threeMonths', 'sixMonths', 'year']);
    expect([...document.querySelectorAll('#mmm2-filter-subdomain option')].map((option) => option.textContent))
      .to.deep.equal(['WWW', 'Business', 'Show all']);
    expect(document.querySelector('#mmm2-filter-lastseen').value).to.equal('threeMonths');
    expect(document.querySelector('#mmm2-filter-subdomain').value).to.equal('www');
    expect(document.querySelector('.mmm2-howto-summary').textContent).to.equal('How to use this report');
    expect(document.querySelectorAll('.mmm2-howto-body li')).to.have.length(5);
    expect(document.querySelector('.mmm2-howto-body ol').classList.contains('body-s')).to.be.true;
    const note = document.querySelector('.mmm2-howto-body .supplemental-text');
    expect(note.textContent).to.include('* Note: Keeping');
    expect(note.classList.contains('body-xs')).to.be.true;
    expect(note.classList.contains('body-xl')).to.be.false;
    expect(note.classList.contains('body-s')).to.be.false;
    const links = [...document.querySelectorAll('.mmm2-howto-body a')];
    expect(links.map((link) => link.textContent)).to.deep.equal(['Tutorial', 'Learn more']);
    expect(links[0].classList.contains('outline')).to.be.true;
    expect(links[1].classList.contains('con-button')).to.be.false;
    links.forEach((link) => {
      expect(link.target).to.equal('_blank');
      expect(link.href).to.not.include('#_blank');
    });

    const fieldGroup = document.querySelector('.mmm2-filter-fields');
    const checkboxGroup = document.querySelector('.mmm2-filter-checkboxes');
    expect(fieldGroup.nextElementSibling).to.equal(checkboxGroup);
    expect(fieldGroup.querySelectorAll('select, input[type="text"]')).to.have.length(6);
    expect([...fieldGroup.querySelectorAll('select')].map(({ id }) => id))
      .to.deep.equal([
        'mmm2-filter-geos', 'mmm2-filter-pages', 'mmm2-filter-lastseen', 'mmm2-filter-manifestconsenttype', 'mmm2-filter-subdomain',
      ]);
    expect(fieldGroup.querySelector('.mmm2-checkbox-group')).to.not.exist;
    expect(checkboxGroup.querySelectorAll('.mmm2-checkbox-group')).to.have.length(2);
    expect(checkboxGroup.querySelector('select, input[type="text"], textarea')).to.not.exist;
    expect(checkboxGroup.nextElementSibling.querySelector('#mmm2-filter-search')).to.exist;

    const pageItems = document.querySelectorAll('.mmm2-page-item');
    expect(pageItems.length).to.equal(getPagesData.result.length);
    expect(pageItems[0].querySelector('.mmm2-page-heading a').href).to.equal(getPagesData.result[0].url);
  });

  it('derives blue and outline instruction buttons from CMS bold and italic formatting', async () => {
    const content = document.querySelector('.manifest-manager');
    const [tutorial, learnMore] = content.querySelectorAll('a');
    tutorial.closest('p').innerHTML = `<strong>${tutorial.outerHTML}</strong> <em>${learnMore.outerHTML}</em>`;
    setRoutedFetch({ '/get-pages': jsonResponse(getPagesData) });
    const module = await import('../../../libs/blocks/mmm-2/mmm-2.js');
    await module.default(document.querySelector('.mmm-2'));
    await waitFor(() => document.querySelector('.mmm2-page-item'));
    const links = [...document.querySelectorAll('.mmm2-howto-body a')];
    expect(links.map((link) => link.textContent)).to.deep.equal(['Tutorial', 'Learn more']);
    expect(links[0].classList.contains('con-button')).to.be.true;
    expect(links[0].classList.contains('blue')).to.be.true;
    expect(links[0].classList.contains('outline')).to.be.false;
    expect(links[1].classList.contains('con-button')).to.be.true;
    expect(links[1].classList.contains('outline')).to.be.true;
    expect(links[1].classList.contains('blue')).to.be.false;
    links.forEach((link) => expect(link.classList.contains('button-s')).to.be.true);
  });

  it('follows CMS menu reordering while retaining API field names and defaults', async () => {
    const content = document.querySelector('.manifest-manager');
    const rows = [...content.children];
    const subdomainIndex = rows.findIndex((row) => row.children[0].textContent.includes('Menu: subdomain'));
    const firstMenu = content.children[1];
    rows.slice(subdomainIndex).forEach((row) => content.insertBefore(row, firstMenu));
    setRoutedFetch({ '/get-pages': jsonResponse(getPagesData) });
    const module = await import('../../../libs/blocks/mmm-2/mmm-2.js');
    await module.default(document.querySelector('.mmm-2'));
    await waitFor(() => document.querySelector('.mmm2-page-item'));
    expect([...document.querySelectorAll('.mmm2-filter-fields select')].map(({ id }) => id))
      .to.deep.equal([
        'mmm2-filter-subdomain', 'mmm2-filter-geos', 'mmm2-filter-pages', 'mmm2-filter-lastseen', 'mmm2-filter-manifestconsenttype',
      ]);
    expect(JSON.parse(dataRequests()[0].args[1].body))
      .to.include({ subdomain: 'www', geos: '', pages: '', lastSeenManifest: 'threeMonths' });
  });

  it('shows one empty-state message and restores both pagers when filters find results', async () => {
    const empty = { result: [], totalRecords: 0 };
    const routes = { '/get-pages': jsonResponse(empty) };
    setRoutedFetch(routes);
    const module = await import('../../../libs/blocks/mmm-2/mmm-2.js');
    await module.default(document.querySelector('.mmm-2'));
    await waitFor(() => window.fetch.called && document.querySelector('.mmm2-pagination-no-results'));
    expect(document.querySelectorAll('.mmm2-pagination-no-results')).to.have.length(1);
    expect(document.querySelector('#mmm2-pagination-dropdown-top')).to.not.exist;
    routes['/get-pages'] = jsonResponse(getPagesData);
    const select = document.querySelector('#mmm2-filter-subdomain');
    select.value = 'business';
    select.dispatchEvent(new Event('change', { bubbles: true }));
    await waitFor(() => document.querySelector('.mmm2-page-item')
      && document.querySelectorAll('.mmm2-pagination').length === 2);
    expect(document.querySelectorAll('.mmm2-pagination-no-results')).to.have.length(0);
    routes['/get-pages'] = jsonResponse(empty);
    select.value = 'www';
    select.dispatchEvent(new Event('change', { bubbles: true }));
    await waitFor(() => document.querySelector('.mmm2-pagination-no-results')
      && !document.querySelector('.mmm2-page-item'));
    expect(document.querySelectorAll('.mmm2-pagination-no-results')).to.have.length(1);
    expect(document.querySelectorAll('.mmm2-pagination')).to.have.length(1);
  });

  it('keeps pagination above and below the list synchronized', async () => {
    setRoutedFetch({ '/get-pages': jsonResponse({ ...getPagesData, totalRecords: 225 }) });
    const module = await import('../../../libs/blocks/mmm-2/mmm-2.js');
    await module.default(document.querySelector('.mmm-2'));
    await waitFor(() => document.querySelector('.mmm2-page-item'));
    const list = document.querySelector('.mmm2-page-list');
    const currentBars = () => [...document.querySelectorAll('.mmm2-pagination')];
    const pagination = [...document.querySelectorAll('.mmm2-pagination')];
    expect(pagination).to.have.length(2);
    expect(list.previousElementSibling).to.equal(pagination[0]);
    expect(list.nextElementSibling).to.equal(pagination[1]);
    const selects = pagination.map((bar) => bar.querySelector('select'));
    expect(selects[0].id).to.not.equal(selects[1].id);
    pagination.forEach((bar, index) => {
      expect(bar.querySelector('label').control).to.equal(selects[index]);
    });
    pagination[0].querySelectorAll('.mmm2-arrow')[2].click();
    await waitFor(() => currentBars().length === 2 && currentBars()
      .every((bar) => bar.dataset.currentPage === '2'));
    expect(JSON.parse(window.fetch.lastCall.args[1].body).pageNum).to.equal(2);
    const topSelect = document.querySelector('#mmm2-pagination-dropdown-top');
    topSelect.value = '100';
    topSelect.dispatchEvent(new Event('change', { bubbles: true }));
    await waitFor(() => currentBars().length === 2 && currentBars()
      .every((bar) => bar.querySelector('select')?.value === '100'));
    expect(JSON.parse(window.fetch.lastCall.args[1].body)).to.include({ pageNum: 2, perPage: 100 });
    expect([...document.querySelectorAll('.mmm2-pagination-summary')]
      .map((summary) => summary.textContent.trim())).to.deep.equal([
      '101 - 200 of 225', '101 - 200 of 225',
    ]);
    document.querySelectorAll('.mmm2-pagination')[1].querySelectorAll('.mmm2-arrow')[1].click();
    await waitFor(() => currentBars().length === 2 && currentBars()
      .every((bar) => bar.dataset.currentPage === '1'));
    expect(JSON.parse(window.fetch.lastCall.args[1].body)).to.include({ pageNum: 1, perPage: 100 });
  });

  it('owns the authored config table before Milo loads section blocks', async () => {
    setRoutedFetch({ '/get-pages': jsonResponse(getPagesData) });
    await loadArea(document.querySelector('main'));
    await waitFor(() => document.querySelector('.mmm2-page-item'));
    expect(document.querySelector('.mmm-2').dataset.blockStatus).to.equal('loaded');
    expect(document.querySelector('.section > .manifest-manager:not(.mmm-2)')).to.not.exist;
    expect(document.querySelector('#mmm2-filter-subdomain option[value="business"]').textContent)
      .to.equal('Business');
    expect(window.fetch.getCalls().some(({ args }) => args[0].includes('.plain.html'))).to.be.false;
  });

  it('owns every tab table before early preloading, without tab-name modifiers', async () => {
    preloadLcpCodeFiles();
    const block = document.querySelector('.mmm-2');
    ['manifest-manager', 'inactivity-report', 'metadata-lookup'].forEach((name) => {
      expect(block.querySelector(`:scope > .${name}`)).to.exist;
      expect(document.head.querySelector(`link[href*="/blocks/${name}/"]`)).to.not.exist;
    });
    expect(document.head.querySelector('link[href*="/blocks/mmm-2/mmm-2.js"]')).to.exist;
    setRoutedFetch({ '/get-pages': jsonResponse(getPagesData) });
    const module = await import('../../../libs/blocks/mmm-2/mmm-2.js');
    await module.default(block);
    await waitFor(() => block.querySelector('.mmm2-page-item'));
    expect(block.querySelector('#mmm2-filter-lastseen').value).to.equal('threeMonths');
  });

  it('owns authored tab tables in a later section during parallel preloading', () => {
    const meta = document.createElement('meta');
    meta.name = 'parallel-sections';
    meta.content = '2';
    document.head.append(meta);
    document.querySelector('main').prepend(document.createElement('div'));
    try {
      preloadLcpCodeFiles();
      const block = document.querySelector('.mmm-2');
      ['manifest-manager', 'inactivity-report', 'metadata-lookup'].forEach((name) => {
        expect(block.querySelector(`:scope > .${name}`)).to.exist;
        expect(document.head.querySelector(`link[href*="/blocks/${name}/"]`)).to.not.exist;
      });
    } finally {
      meta.remove();
    }
  });

  it('uses authored instructions and menu edits rather than hardcoded content', async () => {
    const content = document.querySelector('.section > .manifest-manager:not(.mmm-2)');
    content.firstElementChild.children[0].textContent = 'Authored manager instructions';
    content.firstElementChild.children[1].innerHTML = '<h3>Authored heading</h3><p>Locally authored <strong>instructions</strong>.</p>';
    const subdomainHeader = [...content.children]
      .find((row) => row.children[0].textContent.includes('Menu: subdomain'));
    subdomainHeader.children[1].textContent = 'Authored subdomains';
    const option = document.createElement('div');
    option.innerHTML = '<div>blog</div><div>Blog from this page</div>';
    content.appendChild(option);
    setRoutedFetch({ '/get-pages': jsonResponse(getPagesData) });
    const module = await import('../../../libs/blocks/mmm-2/mmm-2.js');
    await module.default(document.querySelector('.mmm-2'));
    await waitFor(() => document.querySelector('.mmm2-page-item'));
    expect(document.querySelector('.mmm2-howto-summary').textContent)
      .to.equal('Authored manager instructions');
    expect(document.querySelector('.mmm2-howto-body strong').textContent).to.equal('instructions');
    expect(document.querySelector('.mmm2-howto-body h3').classList.contains('heading-m')).to.be.true;
    expect(document.querySelector('.mmm2-howto-body p').classList.contains('body-s')).to.be.true;
    expect(document.querySelector('.mmm2-howto-body a')).to.not.exist;
    expect(document.querySelector('label[for="mmm2-filter-subdomain"]').textContent)
      .to.equal('Authored subdomains:');
    const subdomain = document.querySelector('#mmm2-filter-subdomain');
    expect(subdomain.querySelector('option[value="blog"]').textContent)
      .to.equal('Blog from this page');
    subdomain.value = 'blog';
    subdomain.dispatchEvent(new Event('change', { bubbles: true }));
    await waitFor(() => JSON.parse(window.fetch.lastCall.args[1].body).subdomain === 'blog');
  });

  it('sends authored case-sensitive values and grouped page paths unchanged', async () => {
    setRoutedFetch({ '/get-pages': jsonResponse(getPagesData) });
    const module = await import('../../../libs/blocks/mmm-2/mmm-2.js');
    await module.default(document.querySelector('.mmm-2'));
    await waitFor(() => document.querySelector('.mmm2-page-item'));
    const lastBody = () => JSON.parse(window.fetch.lastCall.args[1].body);
    expect(lastBody().lastSeenManifest).to.equal('threeMonths');
    const lastSeen = document.querySelector('#mmm2-filter-lastseen');
    lastSeen.value = 'sixMonths';
    lastSeen.dispatchEvent(new Event('change', { bubbles: true }));
    await waitFor(() => lastBody().lastSeenManifest === 'sixMonths');
    const pages = document.querySelector('#mmm2-filter-pages');
    pages.value = '/,/creativecloud.html,/products/photoshop.html,/products/illustrator.html';
    pages.dispatchEvent(new Event('change', { bubbles: true }));
    await waitFor(() => lastBody().pages === pages.value);
    expect(lastBody()).to.include({
      lastSeenManifest: 'sixMonths',
      pages: '/,/creativecloud.html,/products/photoshop.html,/products/illustrator.html',
      pageNum: 1,
    });
  });

  it('keeps restored filters consistent with the current authored menus', async () => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.search, JSON.stringify({
      pageNum: 4,
      subdomain: 'removed',
      lastSeenManifest: 'removed',
      pages: '/removed',
      geos: 'removed',
    }));
    setRoutedFetch({ '/get-pages': jsonResponse(getPagesData) });
    const module = await import('../../../libs/blocks/mmm-2/mmm-2.js');
    await module.default(document.querySelector('.mmm-2'));
    await waitFor(() => document.querySelector('.mmm2-page-item'));
    const body = JSON.parse(window.fetch.lastCall.args[1].body);
    ['pages', 'geos', 'lastSeenManifest', 'subdomain'].forEach((key, index) => {
      const id = ['pages', 'geos', 'lastseen', 'subdomain'][index];
      expect(document.querySelector(`#mmm2-filter-${id}`).value).to.equal(body[key]);
    });
    expect(body).to.include({ subdomain: 'www', lastSeenManifest: 'threeMonths', pages: '', geos: '', pageNum: 1 });
    expect(document.querySelector('.mmm2-search-view [role="status"]').textContent)
      .to.include('Unavailable filter selections were reset');
    const geos = document.querySelector('#mmm2-filter-geos');
    geos.value = 'jp';
    geos.dispatchEvent(new Event('change', { bubbles: true }));
    await waitFor(() => JSON.parse(window.fetch.lastCall.args[1].body).geos === 'jp');
    expect(document.querySelector('.mmm2-search-view [role="status"]')).to.not.exist;
    expect(JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.search)))
      .to.include({ subdomain: 'www', lastSeenManifest: 'threeMonths', pages: '', geos: 'jp' });
  });

  it('uses bold CMS options as the initial defaults for all menus', async () => {
    const defaults = {
      geos: 'jp',
      pages: '/products/photoshop.html',
      lastseenmanifest: 'week',
      subdomain: 'business',
      manifestconsenttype: 'personalized offer',
    };
    const content = document.querySelector('.section > .manifest-manager:not(.mmm-2)');
    let menu;
    [...content.children].forEach((row) => {
      const [value, label] = row.children;
      if (value.textContent.startsWith('Menu:')) {
        menu = value.textContent.split(':')[1].trim().toLowerCase();
      } else if (menu) {
        label.replaceChildren(document.createTextNode(label.textContent));
        if (value.textContent.trim() === defaults[menu]) {
          const bold = document.createElement('strong');
          bold.textContent = label.textContent;
          label.replaceChildren(bold);
        }
      }
    });
    setRoutedFetch({ '/get-pages': jsonResponse(getPagesData) });
    const module = await import('../../../libs/blocks/mmm-2/mmm-2.js');
    await module.default(document.querySelector('.mmm-2'));
    await waitFor(() => document.querySelector('.mmm2-page-item'));
    expect(JSON.parse(window.fetch.lastCall.args[1].body))
      .to.include({ geos: 'jp', pages: '/products/photoshop.html', lastSeenManifest: 'week', subdomain: 'business', manifestConsentType: 'personalized offer' });
    expect(document.querySelector('#mmm2-filter-lastseen').value).to.equal('week');
    expect(document.querySelector('#mmm2-filter-subdomain').value).to.equal('business');
    expect(document.querySelector('#mmm2-filter-manifestconsenttype').value).to.equal('personalized offer');
  });

  it('does not synthesize blank options and uses the first option when none is bold', async () => {
    const content = document.querySelector('.section > .manifest-manager:not(.mmm-2)');
    let menu;
    [...content.children].forEach((row) => {
      const [value, label] = row.children;
      if (value.textContent.startsWith('Menu:')) menu = true;
      else if (menu) {
        if (!value.textContent.trim()) row.remove();
        else label.replaceChildren(document.createTextNode(label.textContent));
      }
    });
    setRoutedFetch({ '/get-pages': jsonResponse(getPagesData) });
    const module = await import('../../../libs/blocks/mmm-2/mmm-2.js');
    await module.default(document.querySelector('.mmm-2'));
    await waitFor(() => document.querySelector('.mmm2-page-item'));
    ['pages', 'geos', 'lastseen', 'subdomain', 'manifestconsenttype'].forEach((id) => {
      const select = document.querySelector(`#mmm2-filter-${id}`);
      expect(select.querySelector('option[value=""]')).to.not.exist;
      expect(select.value).to.equal(select.options[0].value);
    });
    expect(JSON.parse(window.fetch.lastCall.args[1].body))
      .to.include({ lastSeenManifest: 'day', subdomain: 'www', geos: 'us,ca,ca_fr', manifestConsentType: 'promo or no offer changes' });
  });

  it('preserves saved blank selections and passes an empty last-seen value to page details', async () => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.search, JSON.stringify({ lastSeenManifest: '', subdomain: '' }));
    setRoutedFetch({
      '/get-pages': jsonResponse(getPagesData),
      '/get-page': jsonResponse(getPageData),
    });
    const module = await import('../../../libs/blocks/mmm-2/mmm-2.js');
    await module.default(document.querySelector('.mmm-2'));
    await waitFor(() => document.querySelector('.mmm2-page-item'));
    expect(document.querySelector('#mmm2-filter-lastseen').value).to.equal('');
    expect(document.querySelector('#mmm2-filter-subdomain').value).to.equal('');
    expect(JSON.parse(window.fetch.lastCall.args[1].body))
      .to.include({ lastSeenManifest: '', subdomain: '' });
    document.querySelector('.mmm2-page-trigger').click();
    await waitFor(() => document.querySelector('.mep-popup'));
    const detailCall = window.fetch.getCalls().find(({ args }) => args[0].includes('/get-page?'));
    expect(new URL(detailCall.args[0]).searchParams.get('lastSeen')).to.equal('');
  });

  it('migrates saved all selections to the CMS-authored blank options', async () => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.search, JSON.stringify({ lastSeenManifest: 'all', subdomain: 'all' }));
    setRoutedFetch({ '/get-pages': jsonResponse(getPagesData) });
    const module = await import('../../../libs/blocks/mmm-2/mmm-2.js');
    await module.default(document.querySelector('.mmm-2'));
    await waitFor(() => document.querySelector('.mmm2-page-item'));
    expect(JSON.parse(window.fetch.lastCall.args[1].body))
      .to.include({ lastSeenManifest: '', subdomain: '' });
    expect(document.querySelector('.mmm2-search-view [role="status"]')).to.not.exist;
  });

  it('rejects multiple bold defaults in a single menu', async () => {
    const content = document.querySelector('.section > .manifest-manager:not(.mmm-2)');
    const business = [...content.children].find((row) => row.children[0].textContent === 'business');
    business.children[1].innerHTML = '<strong>Business</strong>';
    setRoutedFetch({});
    const module = await import('../../../libs/blocks/mmm-2/mmm-2.js');
    await module.default(document.querySelector('.mmm-2'));
    await delay();
    expect(document.querySelector('[role="alert"]').textContent)
      .to.include('Bold only one default option per menu: subdomain');
    expect(dataRequests()).to.have.length(0);
  });

  it('reports missing local configuration without fetching legacy config or API data', async () => {
    document.querySelector('.section > .manifest-manager:not(.mmm-2)').remove();
    setRoutedFetch({});
    const module = await import('../../../libs/blocks/mmm-2/mmm-2.js');
    await module.default(document.querySelector('.mmm-2'));
    await delay();
    expect(document.querySelector('[role="alert"]').textContent).to.include('Manifest Manager table');
    expect(dataRequests()).to.have.length(0);
  });

  it('reports incomplete local menus instead of displaying hardcoded substitutes', async () => {
    const content = document.querySelector('.section > .manifest-manager:not(.mmm-2)');
    let remove = false;
    [...content.children].forEach((row) => {
      if (row.children[0].textContent.includes('Menu: subdomain')) remove = true;
      if (remove) row.remove();
    });
    setRoutedFetch({});
    const module = await import('../../../libs/blocks/mmm-2/mmm-2.js');
    await module.default(document.querySelector('.mmm-2'));
    await delay();
    expect(document.querySelector('[role="alert"]').textContent).to.include('subdomain');
    expect(document.querySelector('#mmm2-filter-subdomain')).to.not.exist;
    expect(dataRequests()).to.have.length(0);
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

  it('groups matching consent activities first while keeping other manifests selectable', async () => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.search, JSON.stringify({ manifestConsentType: 'personalized offer' }));
    const activities = [
      ...Array.from({ length: 47 }, (_, index) => ({
        ...getPageData.activities[0],
        url: `https://www.adobe.com/unmatched-${index}.json`,
        pathname: `/unmatched-${index}.json`,
        manifestConsentType: index < 16 ? null : 'promo or no offer changes',
      })),
      ...[1, 2].map((id) => ({
        ...getPageData.activities[0],
        url: `https://www.adobe.com/matching-${id}.json`,
        pathname: `/matching-${id}.json`,
        manifestConsentType: 'personalized offer',
        selectedVariantName: 'all',
      })),
    ];
    const routes = {
      '/get-pages': jsonResponse({
        ...getPagesData,
        result: [{ ...getPagesData.result[0], numOfActivities: 2 }],
      }),
      '/get-page': jsonResponse({ ...getPageData, activities }),
    };
    setRoutedFetch(routes);
    const module = await import('../../../libs/blocks/mmm-2/mmm-2.js');
    await module.default(document.querySelector('.mmm-2'));
    await waitFor(() => document.querySelector('.mmm2-page-trigger'));
    expect(document.querySelector('.mmm2-page-subtext').textContent).to.equal('2 Manifest(s) matched');
    document.querySelector('.mmm2-page-trigger').click();
    await waitFor(() => document.querySelector('.mep-popup'));
    expect(document.querySelector('.mmm2-page-subtext').textContent)
      .to.equal('2 of 49 Manifest(s) matched');
    const matchingGroup = document.querySelector('[data-filter-match="true"]');
    const otherGroup = document.querySelector('[data-filter-match="false"]');
    expect(matchingGroup.querySelector('h6').textContent).to.equal('Matching filters (2)');
    expect(otherGroup.querySelector('h6').textContent).to.equal('Other manifests (47)');
    expect([...matchingGroup.querySelectorAll('.mep-edit-manifest')].map((link) => link.textContent))
      .to.deep.equal(['matching-1.json', 'matching-2.json']);
    expect(otherGroup.querySelectorAll('.mep-edit-manifest')).to.have.length(47);
    expect(otherGroup.querySelector('.mep-manifest-index').textContent).to.equal('3.');
    expect(document.querySelectorAll('.mep-edit-manifest')).to.have.length(49);
    const params = new URL(dataRequests().find(({ args }) => args[0].includes('/get-page?')).args[0])
      .searchParams;
    expect(params.has('manifestConsentType')).to.be.false;
    expect(params.get('manifestSrc')).to.equal('pzn, promo, target, ajo, placeholders');
    const preview = document.querySelector('.mep-popup a.con-button');
    expect(preview.href).to.not.include(getPageData.activities[2].pathname);
    expect(preview.href).to.include('matching-1.json');
    const otherSelect = otherGroup.querySelector('select');
    otherSelect.value = 'all';
    otherSelect.dispatchEvent(new Event('change', { bubbles: true }));
    expect(new URL(preview.href).searchParams.get('mep')).to.include('/unmatched-0.json--all');
    document.querySelectorAll('.mep-popup-tabs .mep-tab')[1].click();
    const summary = document.querySelector('.mep-summary-body');
    const values = [...summary.querySelector('.mep-section-data').children];
    expect(values[0].textContent).to.equal('Manifests Found');
    expect(values[1].textContent).to.equal('49');
    expect(summary.textContent).to.include('personalized offer');
    expect(summary.textContent).to.not.include('Not recorded');
    expect(summary.textContent).to.not.include('promo or no offer changes');
    document.querySelector('.mmm2-page-trigger').click();
    await waitFor(() => !document.querySelector('.mmm2-page-detail'));
    expect(document.querySelector('.mmm2-page-subtext').textContent)
      .to.equal('2 of 49 Manifest(s) matched');
    document.querySelector('.mmm2-page-trigger').click();
    await waitFor(() => document.querySelector('.mep-popup'));
    expect(document.querySelector('.mmm2-page-subtext').textContent)
      .to.equal('2 of 49 Manifest(s) matched');

    routes['/get-pages'] = jsonResponse({
      ...getPagesData,
      result: [{ ...getPagesData.result[0], numOfActivities: 49 }],
    });
    const select = document.querySelector('#mmm2-filter-manifestconsenttype');
    select.value = '';
    select.dispatchEvent(new Event('change', { bubbles: true }));
    await waitFor(() => document.querySelector('.mmm2-page-subtext')?.textContent === '49 Manifest(s) found');
    document.querySelector('.mmm2-page-trigger').click();
    await waitFor(() => document.querySelectorAll('.mep-edit-manifest').length === 49);
    expect(document.querySelector('.mmm2-page-subtext').textContent)
      .to.equal('49 Manifest(s) found');
    expect(document.querySelector('[data-filter-match="true"] h6').textContent)
      .to.equal('Matching filters (49)');
    expect(document.querySelector('[data-filter-match="false"]')).to.not.exist;
    const detailCalls = dataRequests().filter(({ args }) => args[0].includes('/get-page?'));
    expect(detailCalls).to.have.length(2);
  });

  it('applies country/search terms as OR within each filter and AND between filters', () => {
    const activities = [
      { url: '/match-a.json', manifestCountryRestriction: 'US, CA', targetActivityName: 'Spring Sale' },
      { url: '/match-b.json', manifestCountryRestriction: 'KR', variantNames: ['control', 'spring'] },
      { url: '/match-c.json', manifestCountryRestriction: 'GB', variantNames: 'spring' },
      { url: '/other.json', manifestCountryRestriction: 'US' },
      { url: '/missing.json' },
    ];
    const data = { page: getPageData.page, activities };
    const filtered = filterPageActivities(data, {
      manifestCountryRestriction: 'ca, kr',
      filter: 'SPRING, unmatched',
    });
    expect(filtered.activities).to.deep.equal(activities.slice(0, 2));
    expect(data.activities).to.have.length(5);
    const pageMatches = filterPageActivities(data, { filter: data.page.url });
    expect(pageMatches.activities).to.deep.equal(activities);
    expect(filterPageActivities(data, {}).activities).to.deep.equal(activities);
    expect(filterPageActivities(data, { filter: 'does-not-exist' }).activities).to.deep.equal([]);
  });

  it('distinguishes Show All, NOT SET and concrete consent types in page details', () => {
    const activities = [
      { url: '/missing.json' },
      { url: '/null.json', manifestConsentType: null },
      { url: '/empty.json', manifestConsentType: '' },
      { url: '/spaces.json', manifestConsentType: ' \t\n ' },
      { url: '/internal-empty.json', consentType: '' },
      { url: '/personalized.json', manifestConsentType: 'personalized offer' },
      { url: '/promo.json', consentType: 'promo or no offer changes' },
    ];
    const data = { page: getPageData.page, activities };
    expect(filterPageActivities(data, { manifestConsentType: '' }).activities).to.deep.equal(activities);
    expect(filterPageActivities(data, { manifestConsentType: 'not-set' }).activities)
      .to.deep.equal(activities.slice(0, 5));
    expect(filterPageActivities(data, { manifestConsentType: 'personalized offer' }).activities)
      .to.deep.equal([activities[5]]);
    expect(filterPageActivities(data, {
      manifestConsentType: 'not-set',
      filter: '/spaces.json',
    }).activities).to.deep.equal([activities[3]]);
    expect(data.activities).to.have.length(7);
  });

  it('keeps unmatched details available when country and text filters match no activities', async () => {
    const filterText = 'spring & summer\n/offer?variant=all';
    const manifestCountryRestriction = 'US, CA';
    localStorage.setItem(
      LOCAL_STORAGE_KEYS.search,
      JSON.stringify({ filterText, manifestCountryRestriction }),
    );
    setRoutedFetch({
      '/get-pages': jsonResponse(getPagesData),
      '/get-page': jsonResponse(getPageData),
    });
    const module = await import('../../../libs/blocks/mmm-2/mmm-2.js');
    await module.default(document.querySelector('.mmm-2'));
    await waitFor(() => document.querySelector('.mmm2-page-trigger'));
    document.querySelector('.mmm2-page-trigger').click();
    await waitFor(() => document.querySelector('.mep-popup'));
    const detail = dataRequests().find(({ args }) => args[0].includes('/get-page?'));
    const params = new URL(detail.args[0]).searchParams;
    expect([...params.keys()]).to.deep.equal(['id', 'lastSeen', 'manifestSrc']);
    expect(document.querySelectorAll('[data-filter-match="true"] .mep-edit-manifest')).to.have.length(0);
    expect(document.querySelectorAll('[data-filter-match="false"] .mep-edit-manifest'))
      .to.have.length(getPageData.activities.length);
    expect(document.querySelector('.mmm2-page-subtext').textContent)
      .to.equal(`0 of ${getPageData.activities.length} Manifest(s) matched`);
  });

  it('never paints an empty detail card when swapping the skeleton or reopening cached content', async () => {
    let resolveDetails;
    const detailsResponse = new Promise((resolve) => { resolveDetails = resolve; });
    setRoutedFetch({
      '/get-pages': jsonResponse(getPagesData),
      '/get-page': detailsResponse,
    });
    const module = await import('../../../libs/blocks/mmm-2/mmm-2.js');
    await module.default(document.querySelector('.mmm-2'));
    await waitFor(() => document.querySelector('button.mmm2-page-trigger'));
    const trigger = document.querySelector('.mmm2-page-trigger');
    trigger.click();
    await waitFor(() => document.querySelector('.mmm2-skeleton-card'));
    let frame;
    let emptyFrames = 0;
    const sample = () => {
      const detail = document.querySelector('.mmm2-page-detail');
      if (detail && !detail.querySelector('.mmm2-skeleton-card, .mep-popup')) emptyFrames += 1;
      frame = requestAnimationFrame(sample);
    };
    frame = requestAnimationFrame(sample);
    try {
      resolveDetails(jsonResponse(getPageData));
      await waitFor(() => document.querySelector('.mmm2-page-detail .mep-popup'));
      expect(document.querySelector('.mmm2-skeleton-card')).to.not.exist;
      trigger.click();
      await waitFor(() => !document.querySelector('.mmm2-page-detail'));
      trigger.click();
      await waitFor(() => document.querySelector('.mmm2-page-detail .mep-popup'));
      expect(emptyFrames).to.equal(0);
      expect(window.fetch.getCalls().filter(({ args }) => args[0].includes('/get-page?')))
        .to.have.length(1);
    } finally {
      cancelAnimationFrame(frame);
    }
  });

  it('shows complete activity metadata from get-page without invalid zero dates', async () => {
    const activity = {
      ...getPageData.activities[2],
      manifestConsentType: 'promo or no offer changes',
      manifestCountryRestriction: 'kr',
      analyticsTitle: 'Korean Promo',
      eventEnd: '0000-00-00 00:00:00',
    };
    setRoutedFetch({
      '/get-pages': jsonResponse(getPagesData),
      '/get-page': jsonResponse({ page: getPageData.page, activities: [activity] }),
    });
    const module = await import('../../../libs/blocks/mmm-2/mmm-2.js');
    await module.default(document.querySelector('.mmm-2'));
    await delay();
    document.querySelector('.mmm2-page-trigger').click();
    await delay();
    const detail = document.querySelector('.mmm2-page-detail .mep-manifest-info');
    const fields = [...detail.querySelector('.mep-section-data').children];
    const values = Object.fromEntries(fields.filter((_, index) => index % 2 === 0)
      .map((label, index) => [label.textContent, fields[index * 2 + 1].textContent.trim()]));
    expect(values).to.include({
      Source: activity.source,
      'Consent req': activity.manifestConsentType,
      'Allowed User Countries': 'KR',
      Off: 'Not scheduled',
      Variants: activity.variantNames,
      'Analytics Title': activity.analyticsTitle,
      'Manifest ID': `${activity.manifestId}`,
      'Manifest URL': activity.url,
      'Manifest Path': activity.pathname,
    });
    expect(values.On).to.include('Instant');
    expect(values['Last Seen']).to.not.be.empty;
    expect(detail.textContent).to.not.include('undefined');
    expect(detail.textContent).to.not.include('Invalid Date');
  });

  it('keeps manifest links, experience dropdowns and toggles on one row at each breakpoint', async () => {
    setRoutedFetch({
      '/get-pages': jsonResponse(getPagesData),
      '/get-page': jsonResponse(getPageData),
    });
    const style = document.createElement('style');
    style.textContent = (await Promise.all([
      readFile({ path: '../../../libs/features/mep/mep-next/mep-next.css' }),
      readFile({ path: '../../../libs/blocks/mmm-2/mmm-2.css' }),
    ])).join('\n');
    document.head.append(style);
    try {
      const block = document.querySelector('.mmm-2');
      Object.entries({
        '--spacing-xxs': '8px',
        '--spacing-xs': '16px',
        '--spacing-s': '24px',
        '--spacing-m': '32px',
        '--color-gray-100': '#f8f8f8',
        '--text-color': '#2c2c2c',
      }).forEach(([property, value]) => block.style.setProperty(property, value));
      const module = await import('../../../libs/blocks/mmm-2/mmm-2.js');
      await module.default(block);
      await delay();
      document.querySelector('.mmm2-page-trigger').click();
      await delay();
      expect(getComputedStyle(block.querySelector('.mmm2-page-item.is-expanded')).backgroundColor)
        .to.equal('rgb(248, 248, 248)');
      const sections = [...block.querySelectorAll('.mep-manifest-list > .mep-section')];
      expect(sections).to.have.length(getPageData.activities.length);
      const fileNames = getPageData.activities.map((activity) => activity.url.split('/').at(-1));
      for (const width of [1440, 768, 375]) {
        await setViewport({ width, height: 1000 });
        sections.forEach((section, index) => {
          const link = section.querySelector('.mep-edit-manifest');
          const number = section.querySelector('.mep-manifest-index');
          expect(number.textContent).to.equal(`${index + 1}.`);
          expect(number.closest('a')).to.be.null;
          expect(getComputedStyle(number).color).to.equal('rgb(44, 44, 44)');
          expect(link.textContent.trim()).to.equal(fileNames[index]);
          const select = section.querySelector('select');
          const toggle = section.querySelector('.mep-manifest-toggle');
          const info = section.querySelector('.mep-manifest-info');
          if (info.hasAttribute('active')) toggle.click();
          const linkRect = link.getBoundingClientRect();
          const selectRect = select.getBoundingClientRect();
          const toggleRect = toggle.getBoundingClientRect();
          const center = (rect) => rect.top + rect.height / 2;
          expect(center(linkRect), `link and select aligned at ${width}px`)
            .to.be.closeTo(center(selectRect), 1);
          expect(center(toggleRect), `toggle and select aligned at ${width}px`)
            .to.be.closeTo(center(selectRect), 1);
          expect(linkRect.right).to.be.at.most(selectRect.left);
          expect(selectRect.right).to.be.at.most(toggleRect.left);
          expect(toggleRect.right).to.be.at.most(section.getBoundingClientRect().right);
          toggle.click();
          expect(info.hasAttribute('active')).to.be.true;
          expect(info.getBoundingClientRect().top)
            .to.be.at.least(Math.max(linkRect.bottom, selectRect.bottom, toggleRect.bottom));
          expect(info.getBoundingClientRect().width)
            .to.be.closeTo(section.getBoundingClientRect().width, 1);
          expect(select.getBoundingClientRect().top).to.be.closeTo(selectRect.top, 1);
        });
      }
    } finally {
      style.remove();
      await setViewport({ width: 800, height: 600 });
    }
  });

  it('keeps fields above checkboxes and the textarea at the bottom across viewport sizes', async () => {
    setRoutedFetch({ '/get-pages': jsonResponse(getPagesData) });
    const style = document.createElement('style');
    style.textContent = await readFile({ path: '../../../libs/blocks/mmm-2/mmm-2.css' });
    document.head.append(style);
    try {
      const block = document.querySelector('.mmm-2');
      Object.entries({
        '--spacing-xxs': '8px',
        '--spacing-xs': '16px',
        '--type-body-m-size': '18px',
        '--type-body-m-lh': '1.5',
        '--type-body-s-size': '16px',
        '--color-gray-100': '#f8f8f8',
        '--color-gray-200': '#e8e8e8',
      }).forEach(([property, value]) => block.style.setProperty(property, value));
      const module = await import('../../../libs/blocks/mmm-2/mmm-2.js');
      await module.default(block);
      await delay();

      const panelStyle = getComputedStyle(block.querySelector('.mmm2-filters'));
      expect(panelStyle.backgroundColor).to.equal('rgb(248, 248, 248)');
      expect(panelStyle.borderTopColor).to.equal('rgb(232, 232, 232)');

      for (const [width, columnCount] of [[1440, 3], [768, 2], [375, 1]]) {
        await setViewport({ width, height: 1000 });
        const fieldsEl = document.querySelector('.mmm2-filter-fields');
        const checkboxEl = document.querySelector('.mmm2-filter-checkboxes');
        const fields = fieldsEl.getBoundingClientRect();
        const checkboxes = checkboxEl.getBoundingClientRect();
        const textarea = document.querySelector('.mmm2-search-field').getBoundingClientRect();
        expect(fields.bottom, `fields above checkboxes at ${width}px`).to.be.at.most(checkboxes.top);
        expect(checkboxes.bottom, `checkboxes above textarea at ${width}px`).to.be.at.most(textarea.top);
        expect(textarea.width, `full-width textarea at ${width}px`).to.be.closeTo(fields.width, 1);
        expect(getComputedStyle(fieldsEl).gridTemplateColumns.split(' ')).to.have.length(columnCount);
        const fieldRects = [...fieldsEl.children].map((field) => field.getBoundingClientRect());
        const checkboxRects = [...checkboxEl.children]
          .map((group) => group.getBoundingClientRect());
        fieldRects.forEach((rect, index) => {
          expect(rect.width, `equal field widths at ${width}px`)
            .to.be.closeTo(fieldRects[0].width, 1);
          expect(rect.left, `field column alignment at ${width}px`)
            .to.be.closeTo(fieldRects[index % columnCount].left, 1);
        });
        checkboxRects.forEach((rect, index) => {
          expect(rect.left, `checkbox column alignment at ${width}px`)
            .to.be.closeTo(fieldRects[index % columnCount].left, 1);
        });
        [...checkboxEl.children].forEach((group) => {
          const legend = group.querySelector('legend');
          const rows = [...group.querySelectorAll('.mmm2-checkbox-option')]
            .map((row) => row.getBoundingClientRect());
          expect(getComputedStyle(legend).fontSize).to.equal('18px');
          expect(rows[0].top - legend.getBoundingClientRect().bottom)
            .to.be.closeTo(16, 1);
          expect(rows[1].top - rows[0].bottom).to.be.closeTo(4, 1);
        });
        expect(getComputedStyle(fieldsEl).columnGap).to.equal('24px');
        const subdomain = document.querySelector('#mmm2-filter-subdomain').getBoundingClientRect();
        const country = document.querySelector('#mmm2-filter-manifestcountryrestriction').getBoundingClientRect();
        if (columnCount === 3) {
          expect(subdomain.top).to.be.closeTo(country.top, 1);
          expect(country.left).to.be.closeTo(fieldRects[2].left, 1);
        }
      }
    } finally {
      style.remove();
      await setViewport({ width: 800, height: 600 });
    }
  });

  it('filters by one authored consent type and defaults to Show All', async () => {
    setRoutedFetch({ '/get-pages': jsonResponse(getPagesData) });
    const module = await import('../../../libs/blocks/mmm-2/mmm-2.js');
    await module.default(document.querySelector('.mmm-2'));
    await delay();

    const select = document.querySelector('#mmm2-filter-manifestconsenttype');
    expect(select.tagName).to.equal('SELECT');
    expect(document.querySelectorAll('#mmm2-filter-manifestconsenttype')).to.have.length(1);
    expect([...document.querySelectorAll('.mmm2-filter-checkboxes legend')]
      .map((legend) => legend.textContent)).to.deep.equal(["Page's Target Setting", 'Manifest Source']);
    expect(select.closest('.mmm2-filter-fields')).to.exist;
    expect(select.multiple).to.be.false;
    expect(select.value).to.equal('');
    expect([...select.options].map((option) => [option.value, option.textContent])).to.deep.equal([
      ['', 'Show All'],
      ['promo or no offer changes', 'Promo Or No Offer Changes'],
      ['non-personalized offer test', 'Non-Personalized Offer Test'],
      ['personalized offer', 'Personalized Offer'],
    ]);
    expect(document.querySelector('label[for="mmm2-filter-manifestconsenttype"]').control)
      .to.equal(select);

    const pageRequests = () => window.fetch.getCalls()
      .filter((call) => call.args[0].includes('/get-pages'));
    const lastBody = () => JSON.parse(pageRequests().at(-1).args[1].body);
    expect(lastBody().manifestConsentType).to.equal('');
    expect(lastBody()).to.not.have.property('manifestconsenttype');

    for (const value of ['promo or no offer changes', 'non-personalized offer test', 'personalized offer', '']) {
      select.value = value;
      select.dispatchEvent(new Event('change', { bubbles: true }));
      await waitFor(() => lastBody().manifestConsentType === value);
      expect(lastBody()).to.include({ manifestConsentType: value, pageNum: 1 });
      expect(lastBody()).to.not.have.property('manifestconsenttype');
      expect(JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.search)).manifestConsentType)
        .to.equal(value);
    }
  });

  it('uses authored consent labels and options with lowercase, spaced API values', async () => {
    const content = document.querySelector('.manifest-manager');
    const header = [...content.children].find((row) => row.children[0].textContent.includes('Menu: manifestConsentType'));
    header.children[1].textContent = 'Consent policy';
    const showAll = header.nextElementSibling;
    const promo = showAll.nextElementSibling;
    promo.children[0].innerHTML = '<p>Promo Or</p><p>No Offer Changes</p>';
    promo.children[1].textContent = 'Promotion';
    promo.nextElementSibling.remove();
    promo.nextElementSibling.remove();
    setRoutedFetch({ '/get-pages': jsonResponse(getPagesData) });
    const module = await import('../../../libs/blocks/mmm-2/mmm-2.js');
    await module.default(document.querySelector('.mmm-2'));
    await waitFor(() => document.querySelector('.mmm2-page-item'));
    const select = document.querySelector('#mmm2-filter-manifestconsenttype');
    expect(document.querySelector(`label[for="${select.id}"]`).textContent).to.equal('Consent policy:');
    expect([...select.options].map((option) => [option.value, option.textContent]))
      .to.deep.equal([['', 'Show All'], ['promo or no offer changes', 'Promotion']]);
    select.value = 'promo or no offer changes';
    select.dispatchEvent(new Event('change', { bubbles: true }));
    await waitFor(() => (
      JSON.parse(window.fetch.lastCall.args[1].body).manifestConsentType === select.value
    ));
    expect(JSON.parse(window.fetch.lastCall.args[1].body))
      .to.not.have.property('manifestconsenttype');
  });

  it('sends and restores an authored NOT SET option without treating it as Show All', async () => {
    const header = [...document.querySelector('.manifest-manager').children]
      .find((row) => row.children[0].textContent.includes('Menu: manifestConsentType'));
    const option = document.createElement('div');
    option.innerHTML = '<div>not-set</div><div>NOT SET</div>';
    const lastOption = header.nextElementSibling.nextElementSibling
      .nextElementSibling.nextElementSibling;
    lastOption.after(option);
    localStorage.setItem(
      LOCAL_STORAGE_KEYS.search,
      JSON.stringify({ manifestConsentType: 'not-set' }),
    );
    setRoutedFetch({ '/get-pages': jsonResponse(getPagesData) });
    const module = await import('../../../libs/blocks/mmm-2/mmm-2.js');
    await module.default(document.querySelector('.mmm-2'));
    await waitFor(() => document.querySelector('.mmm2-page-item'));
    const select = document.querySelector('#mmm2-filter-manifestconsenttype');
    expect(select.value).to.equal('not-set');
    expect(select.selectedOptions[0].textContent).to.equal('NOT SET');
    const lastBody = () => JSON.parse(window.fetch.getCalls()
      .filter((call) => call.args[0].includes('/get-pages')).at(-1).args[1].body);
    expect(lastBody().manifestConsentType).to.equal('not-set');
    select.value = '';
    select.dispatchEvent(new Event('change', { bubbles: true }));
    await waitFor(() => lastBody().manifestConsentType === '');
    select.value = 'not-set';
    select.dispatchEvent(new Event('change', { bubbles: true }));
    await waitFor(() => lastBody().manifestConsentType === 'not-set');
    expect(JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.search)).manifestConsentType).to.equal('not-set');
  });

  [
    'promo or no offer changes, non-personalized offer test, personalized offer',
    'non-personalized offer test, personalized offer',
  ].forEach((manifestConsentType) => {
    it(`resets a previous multi-consent selection to Show All: ${manifestConsentType}`, async () => {
      localStorage.setItem(LOCAL_STORAGE_KEYS.search, JSON.stringify({
        manifestConsentType,
        pageNum: 4,
      }));
      setRoutedFetch({ '/get-pages': jsonResponse(getPagesData) });
      const module = await import('../../../libs/blocks/mmm-2/mmm-2.js');
      await module.default(document.querySelector('.mmm-2'));
      await waitFor(() => document.querySelector('.mmm2-page-item'));
      expect(document.querySelector('#mmm2-filter-manifestconsenttype').value).to.equal('');
      expect(JSON.parse(window.fetch.lastCall.args[1].body))
        .to.include({ manifestConsentType: '', pageNum: 1 });
      expect(document.querySelector('.mmm2-search-view [role="status"]').textContent)
        .to.include('Manifest Consent Type');
    });
  });

  it('requires an authored consent menu instead of injecting hardcoded options', async () => {
    const content = document.querySelector('.manifest-manager');
    const header = [...content.children].find((row) => row.children[0].textContent.includes('Menu: manifestConsentType'));
    while (header.nextElementSibling && !header.nextElementSibling.children[0].textContent.startsWith('Menu:')) {
      header.nextElementSibling.remove();
    }
    header.remove();
    setRoutedFetch({});
    const module = await import('../../../libs/blocks/mmm-2/mmm-2.js');
    await module.default(document.querySelector('.mmm-2'));
    await delay();
    expect(document.querySelector('[role="alert"]').textContent).to.include('manifestconsenttype');
    expect(dataRequests()).to.have.length(0);
  });

  [
    ['targetSetting', 'mmm2-filter-targetsetting'],
    ['manifestSrc', 'mmm2-filter-manifestsrc'],
  ].forEach(([property, id]) => {
    it(`sends ${property} as an empty string when its last checkbox is unchecked`, async () => {
      setRoutedFetch({ '/get-pages': jsonResponse(getPagesData) });
      const module = await import('../../../libs/blocks/mmm-2/mmm-2.js');
      await module.default(document.querySelector('.mmm-2'));
      await delay();
      const pageRequests = () => window.fetch.getCalls()
        .filter((call) => call.args[0].includes('/get-pages'));
      const initialBody = JSON.parse(pageRequests().at(-1).args[1].body);
      const group = document.getElementById(id);
      const checkboxes = [...group.querySelectorAll('input[type="checkbox"]')];
      for (const checkbox of checkboxes) {
        const count = pageRequests().length;
        checkbox.click();
        await delay();
        expect(pageRequests()).to.have.length(count + 1);
      }
      expect(checkboxes.every((checkbox) => !checkbox.checked)).to.be.true;
      expect(group.classList.contains('has-error')).to.be.false;
      expect(JSON.parse(pageRequests().at(-1).args[1].body))
        .to.deep.equal({ ...initialBody, [property]: '', pageNum: 1 });
      expect(JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.search))[property]).to.equal('');
    });
  });

  it('restores cleared groups and lets each group select a filter again', async () => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.search, JSON.stringify({
      pageNum: 4,
      perPage: 25,
      lastSeenManifest: 'threeMonths',
      subdomain: 'www',
      targetSetting: '',
      manifestSrc: '',
      manifestConsentType: '',
      manifestCountryRestriction: '',
      pages: '',
      geos: '',
      filterText: '',
    }));
    setRoutedFetch({ '/get-pages': jsonResponse(getPagesData) });
    const module = await import('../../../libs/blocks/mmm-2/mmm-2.js');
    await module.default(document.querySelector('.mmm-2'));
    await delay();
    expect([...document.querySelectorAll('.mmm2-checkbox-group input')]
      .every((checkbox) => !checkbox.checked)).to.be.true;
    const lastBody = () => JSON.parse(window.fetch.getCalls()
      .filter((call) => call.args[0].includes('/get-pages')).at(-1).args[1].body);
    expect(lastBody()).to.include({ targetSetting: '', manifestSrc: '', manifestConsentType: '' });
    expect(document.querySelector('#mmm2-filter-manifestconsenttype').value).to.equal('');
    for (const [property, id, value] of [
      ['targetSetting', 'mmm2-filter-targetsetting', 'on'],
      ['manifestSrc', 'mmm2-filter-manifestsrc', 'pzn'],
    ]) {
      const checkbox = document.querySelector(`#${id} input`);
      checkbox.click();
      await delay();
      expect(checkbox.checked).to.be.true;
      expect(lastBody()).to.include({ [property]: value, pageNum: 1 });
    }
  });

  it('restores a valid saved consent dropdown selection', async () => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.search, JSON.stringify({
      pageNum: 4,
      perPage: 25,
      lastSeenManifest: 'threeMonths',
      subdomain: 'www',
      targetSetting: 'on, off, postLCP',
      manifestSrc: 'pzn, promo, target, ajo, placeholders',
      manifestConsentType: 'non-personalized offer test',
      manifestCountryRestriction: '',
      pages: '',
      geos: '',
      filterText: '',
    }));
    setRoutedFetch({ '/get-pages': jsonResponse(getPagesData) });
    const module = await import('../../../libs/blocks/mmm-2/mmm-2.js');
    await module.default(document.querySelector('.mmm-2'));
    await delay();

    const select = document.querySelector('#mmm2-filter-manifestconsenttype');
    expect(select.value).to.equal('non-personalized offer test');
    expect(JSON.parse(window.fetch.lastCall.args[1].body))
      .to.include({ pageNum: 4, manifestConsentType: 'non-personalized offer test' });
    select.value = 'personalized offer';
    select.dispatchEvent(new Event('change', { bubbles: true }));
    await delay();
    const pageRequest = window.fetch.getCalls().filter((call) => call.args[0].includes('/get-pages')).at(-1);
    expect(JSON.parse(pageRequest.args[1].body)).to.include({
      pageNum: 1,
      manifestConsentType: 'personalized offer',
    });
  });

  it('displays search examples as separate lines without HTML entities', async () => {
    setRoutedFetch({ '/get-pages': jsonResponse(getPagesData) });
    const module = await import('../../../libs/blocks/mmm-2/mmm-2.js');
    await module.default(document.querySelector('.mmm-2'));
    await delay();

    const textarea = document.querySelector('#mmm2-filter-search');
    expect(textarea.placeholder).to.equal(
      'https://www.adobe.com/creativecloud.html\n/test_campaign4/test-campaign4-business.json\nDC1031',
    );
    expect(textarea.value).to.equal('');
    expect(textarea.placeholder).to.not.include('&#10;');
  });

  it('can be re-expanded after collapsing (regression: content must reappear)', async () => {
    setRoutedFetch({
      '/get-pages': jsonResponse(getPagesData),
      '/get-page': jsonResponse(getPageData),
    });
    const module = await import('../../../libs/blocks/mmm-2/mmm-2.js');
    await module.default(document.querySelector('.mmm-2'));
    await delay();

    const trigger = document.querySelector('.mmm2-page-trigger');
    trigger.click(); // expand
    await delay();
    expect(document.querySelector('.mmm2-page-detail .mep-popup')).to.exist;

    trigger.click(); // collapse
    await delay();
    expect(document.querySelector('.mmm2-page-detail')).to.not.exist;

    trigger.click(); // re-expand
    await delay();
    expect(document.querySelector('.mmm2-page-detail .mep-popup')).to.exist;
  });

  it('uses Milo-decorated report buttons without losing their handlers on rerender', async () => {
    window.history.replaceState({}, '', `${window.location.pathname}?tab=inactivity`);
    setRoutedFetch({
      '/get-report': jsonResponse(getReportData),
      '/get-target-history': jsonResponse({ breakdown: true, result: [] }),
    });
    const clipboard = stub(navigator.clipboard, 'writeText').resolves();
    try {
      const module = await import('../../../libs/blocks/mmm-2/mmm-2.js');
      await module.default(document.querySelector('.mmm-2'));
      await waitFor(() => document.querySelector('.mmm2-report-row input'));
      const [copy, slack] = document.querySelectorAll('.mmm2-action-area .con-button');
      expect(copy.className).to.equal('con-button blue button-l');
      expect(slack.className).to.equal('con-button outline button-l');
      expect(slack.href).to.equal('https://adobe.enterprise.slack.com/archives/C08SA7JUW3F');
      copy.click();
      await waitFor(() => document.querySelector('.mmm2-copy-message[role="alert"]'));
      expect(document.querySelector('.mmm2-copy-message').textContent)
        .to.equal('Select at least one page before copying.');
      expect(document.querySelector('.mmm2-copy-message').dataset.state).to.equal('error');
      expect(document.querySelector('.mmm2-copy-message').parentElement)
        .to.equal(document.querySelector('.mmm2-action-area'));
      expect(document.querySelector('.mmm2-action-area.has-error')).to.not.exist;
      expect(clipboard.called).to.be.false;
      document.querySelector('.mmm2-report-row input').click();
      await delay();
      expect(document.querySelector('.mmm2-report-row input').checked).to.be.true;
      expect(document.querySelector('.mmm2-copy-message')).to.not.exist;
      copy.click();
      await waitFor(() => document.querySelector('.mmm2-copy-message')?.textContent
        === 'Copied 1 selected page to the clipboard.');
      expect(document.querySelector('.mmm2-copy-message').getAttribute('role')).to.equal('status');
      expect(document.querySelector('.mmm2-copy-message').dataset.state).to.equal('success');
      expect(clipboard.calledOnce).to.be.true;
      expect(clipboard.firstCall.args[0]).to.include(getReportData.result[0].url);
      expect(copy.className).to.equal('con-button blue button-l');
    } finally {
      clipboard.restore();
    }
  });

  it('waits for clipboard success, reports failures and counts selected pages', async () => {
    window.history.replaceState({}, '', `${window.location.pathname}?tab=inactivity`);
    const first = getReportData.result[0];
    setRoutedFetch({
      '/get-report': jsonResponse({
        result: [first, { ...first, pageId: first.pageId + 1, url: `${first.url}?second-page` }],
        totalRecords: 2,
      }),
    });
    let finishCopy;
    const clipboard = stub(navigator.clipboard, 'writeText').returns(
      new Promise((resolve) => { finishCopy = resolve; }),
    );
    const errors = stub(console, 'error');
    try {
      const module = await import('../../../libs/blocks/mmm-2/mmm-2.js');
      await module.default(document.querySelector('.mmm-2'));
      await waitFor(() => document.querySelectorAll('.mmm2-report-row input').length === 2);
      document.querySelector('#mmm2-report-select-all').click();
      await delay();
      const copy = document.querySelector('.mmm2-action-area button');
      copy.click();
      await waitFor(() => copy.disabled);
      expect(document.querySelector('.mmm2-copy-message').textContent)
        .to.equal('Copying selected pages...');
      expect(document.querySelector('.mmm2-copy-message').textContent).to.not.include('Copied');
      copy.click();
      expect(clipboard.calledOnce).to.be.true;
      finishCopy();
      await waitFor(() => document.querySelector('.mmm2-copy-message')?.textContent
        === 'Copied 2 selected pages to the clipboard.');
      expect(copy.disabled).to.be.false;
      clipboard.rejects(new DOMException('Clipboard denied', 'NotAllowedError'));
      copy.click();
      await waitFor(() => document.querySelector('.mmm2-copy-message[role="alert"]'));
      expect(document.querySelector('.mmm2-copy-message').textContent)
        .to.equal('Unable to copy to the clipboard. Please try again.');
      expect(copy.disabled).to.be.false;
      expect(errors.calledOnce).to.be.true;
      clipboard.resolves();
      copy.click();
      await waitFor(() => document.querySelector('.mmm2-copy-message')?.textContent
        === 'Copied 2 selected pages to the clipboard.');
      expect(clipboard.callCount).to.equal(3);
    } finally {
      clipboard.restore();
      errors.restore();
    }
  });

  it('dismisses clipboard feedback after three seconds in both report tabs', async function dismissFeedback() {
    this.timeout(15000);
    const clipboard = stub(navigator.clipboard, 'writeText').resolves();
    try {
      const module = await import('../../../libs/blocks/mmm-2/mmm-2.js');
      window.history.replaceState({}, '', `${window.location.pathname}?tab=inactivity`);
      setRoutedFetch({ '/get-report': jsonResponse(getReportData) });
      const block = document.querySelector('.mmm-2');
      await module.default(block);
      await waitFor(() => document.querySelector('.mmm2-report-row input'));
      document.querySelector('.mmm2-action-area button').click();
      await waitFor(() => document.querySelector('.mmm2-copy-message[role="alert"]'));
      await delay(2700);
      expect(document.querySelector('.mmm2-copy-message')).to.exist;
      await delay(600);
      expect(document.querySelector('.mmm2-copy-message')).to.not.exist;

      localStorage.setItem(LOCAL_STORAGE_KEYS.metadataLookup, JSON.stringify({
        selectedRepo: 'cc',
        urlListText: 'https://www.adobe.com/products/photoshop',
      }));
      setRoutedFetch({ 'metadata-optimization.json': jsonResponse({ data: [] }) });
      document.querySelectorAll('.mmm2-tab-button')[2].click();
      await waitFor(() => document.querySelector('.mmm2-metadata-pod button'));
      const copy = document.querySelector('.mmm2-metadata-report-actions > button');
      copy.click();
      await waitFor(() => document.querySelector('.mmm2-copy-message[data-state="success"]'));
      await delay(2700);
      expect(document.querySelector('.mmm2-copy-message')).to.exist;
      expect(document.querySelector('.mmm2-copy-message').previousElementSibling).to.equal(copy);
      await delay(600);
      expect(document.querySelector('.mmm2-copy-message')).to.not.exist;
      expect(copy.classList.contains('has-success')).to.be.false;
    } finally {
      clipboard.restore();
    }
  });

  it('synchronizes top and bottom inactivity pagination without eagerly loading history', async () => {
    window.history.replaceState({}, '', `${window.location.pathname}?tab=inactivity`);
    setRoutedFetch({ '/get-report': jsonResponse({ ...getReportData, totalRecords: 225 }) });
    const module = await import('../../../libs/blocks/mmm-2/mmm-2.js');
    await module.default(document.querySelector('.mmm-2'));
    const bars = () => [...document.querySelectorAll('.mmm2-pagination')];
    await waitFor(() => bars().length === 2);
    const report = document.querySelector('.mmm2-report');
    expect(report.previousElementSibling).to.equal(bars()[0]);
    expect(report.nextElementSibling).to.equal(bars()[1]);
    const selects = bars().map((bar) => bar.querySelector('select'));
    expect(selects[0].id).to.not.equal(selects[1].id);
    bars().forEach((bar, index) => {
      expect(bar.querySelector('label').control).to.equal(selects[index]);
    });
    expect(document.querySelector('.mmm2-history-chart-summary-toggle').getAttribute('aria-expanded'))
      .to.equal('false');
    expect(dataRequests().every(({ args }) => args[0].includes('/get-report'))).to.be.true;
    bars()[0].querySelectorAll('.mmm2-arrow')[2].click();
    await waitFor(() => bars().length === 2 && bars().every((bar) => bar.dataset.currentPage === '2'));
    expect(JSON.parse(window.fetch.lastCall.args[1].body))
      .to.include({ pageNum: 2, orderBy: 'p.lastSeen', order: 'asc' });
    const topSelect = document.querySelector('#mmm2-report-pagination-dropdown-top');
    topSelect.value = '50';
    topSelect.dispatchEvent(new Event('change', { bubbles: true }));
    await waitFor(() => bars().length === 2 && bars().every((bar) => bar.querySelector('select').value === '50'));
    expect(JSON.parse(window.fetch.lastCall.args[1].body)).to.include({ pageNum: 2, perPage: 50 });
    bars()[1].querySelectorAll('.mmm2-arrow')[1].click();
    await waitFor(() => bars().length === 2 && bars().every((bar) => bar.dataset.currentPage === '1'));
    expect(JSON.parse(window.fetch.lastCall.args[1].body)).to.include({ pageNum: 1, perPage: 50 });
  });

  it('keeps the inactivity history chart above the filters and identifies the selected geo', async () => {
    window.history.replaceState({}, '', `${window.location.pathname}?tab=inactivity`);
    setRoutedFetch({
      '/get-report': jsonResponse(getReportData),
      '/get-target-history': jsonResponse({ breakdown: true, result: [] }),
    });
    const module = await import('../../../libs/blocks/mmm-2/mmm-2.js');
    await module.default(document.querySelector('.mmm-2'));
    await waitFor(() => document.querySelector('.mmm2-report-row input'));
    const view = document.querySelector('.mmm2-inactivity-view');
    const filters = view.querySelector('.mmm2-filters');
    const chart = view.querySelector('.mmm2-history-chart');
    expect(chart.nextElementSibling).to.equal(filters);
    expect(window.fetch.getCalls().some(({ args }) => args[0].includes('/get-target-history')))
      .to.be.false;
    chart.querySelector('.mmm2-history-chart-summary-toggle').click();
    await waitFor(() => chart.querySelector('.mmm2-history-chart-empty'));
    const geo = filters.querySelector('#mmm2-report-filter-geos');
    geo.value = 'us';
    geo.dispatchEvent(new Event('change', { bubbles: true }));
    await waitFor(() => chart.querySelector('.mmm2-history-chart-geo-label'));
    expect(chart.querySelector('.mmm2-history-chart-geo-label').textContent)
      .to.equal('Geo: US: United States');
    expect(window.fetch.getCalls().filter(({ args }) => args[0].includes('/get-target-history')))
      .to.have.length(1);
  });

  it('keeps report actions centered at the viewport bottom while scrolling within the report', async () => {
    window.history.replaceState({}, '', `${window.location.pathname}?tab=inactivity`);
    setRoutedFetch({ '/get-report': jsonResponse(getReportData) });
    const style = document.createElement('style');
    style.textContent = `
      ${await readFile({ path: '../../../libs/blocks/mmm-2/mmm-2.css' })}
      .mmm-2 { --spacing-xxs: 8px; --spacing-xs: 8px; --spacing-l: 24px; }
      .mmm-2 .mmm2-report { height: 2000px; }
    `;
    document.head.append(style);
    const tail = document.createElement('div');
    tail.style.height = '1200px';
    document.body.append(tail);
    const originalViewport = { width: window.innerWidth, height: window.innerHeight };
    try {
      await setViewport({ width: 800, height: 600 });
      const module = await import('../../../libs/blocks/mmm-2/mmm-2.js');
      await module.default(document.querySelector('.mmm-2'));
      await waitFor(() => document.querySelector('.mmm2-report-row input'));
      const actions = document.querySelector('.mmm2-report-actions');
      const area = actions.querySelector('.mmm2-action-area');
      const report = document.querySelector('.mmm2-report');
      expect(getComputedStyle(actions).position).to.equal('sticky');
      expect(getComputedStyle(actions).bottom).to.equal('0px');
      expect(getComputedStyle(area).justifyContent).to.equal('center');
      const reportTop = report.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: reportTop + 300, behavior: 'instant' });
      await waitFor(() => (
        Math.abs(actions.getBoundingClientRect().bottom - window.innerHeight) < 1
      ));
      const initialActions = actions.getBoundingClientRect().toJSON();
      const initialArea = area.getBoundingClientRect().toJSON();
      const buttons = [...area.querySelectorAll('.con-button')];
      const initialButtons = buttons.map((button) => button.getBoundingClientRect().toJSON());
      buttons[0].click();
      await waitFor(() => area.querySelector('.mmm2-copy-message'));
      const message = area.querySelector('.mmm2-copy-message');
      expect(getComputedStyle(message).position).to.equal('absolute');
      expect(getComputedStyle(message).whiteSpace).to.equal('nowrap');
      expect(getComputedStyle(message).maxWidth).to.equal('none');
      const messageText = document.createRange();
      messageText.selectNodeContents(message);
      expect(messageText.getClientRects()).to.have.length(1);
      expect(message.getBoundingClientRect().left)
        .to.be.at.least(area.getBoundingClientRect().right);
      expect(actions.getBoundingClientRect().toJSON()).to.deep.equal(initialActions);
      expect(area.getBoundingClientRect().toJSON()).to.deep.equal(initialArea);
      expect(buttons.map((button) => button.getBoundingClientRect().toJSON()))
        .to.deep.equal(initialButtons);
      window.scrollTo({ top: reportTop + 600, behavior: 'instant' });
      await waitFor(() => (
        Math.abs(actions.getBoundingClientRect().bottom - window.innerHeight) < 1
      ));
      const tabEnd = document.querySelector('.mmm2-inactivity-view').getBoundingClientRect().bottom
        + window.scrollY;
      window.scrollTo({ top: tabEnd + 100, behavior: 'instant' });
      await waitFor(() => actions.getBoundingClientRect().bottom <= 0);
    } finally {
      window.scrollTo({ top: 0, behavior: 'instant' });
      style.remove();
      tail.remove();
      await setViewport(originalViewport);
    }
  });

  it('shows only one no-results message for an empty inactivity report', async () => {
    window.history.replaceState({}, '', `${window.location.pathname}?tab=inactivity`);
    setRoutedFetch({ '/get-report': jsonResponse({ result: [], totalRecords: 0 }) });
    const module = await import('../../../libs/blocks/mmm-2/mmm-2.js');
    await module.default(document.querySelector('.mmm-2'));
    await waitFor(() => window.fetch.called && document.querySelector('.mmm2-pagination-no-results'));
    expect(document.querySelectorAll('.mmm2-pagination-no-results')).to.have.length(1);
    expect(document.querySelector('#mmm2-report-pagination-dropdown-top')).to.not.exist;
  });

  it('starts the inactivity report sorted by page last-seen and allows header sorting', async () => {
    const originalUrl = window.location.href;
    const url = new URL(originalUrl);
    url.searchParams.set('tab', 'inactivity');
    window.history.replaceState({}, '', url);
    localStorage.setItem(LOCAL_STORAGE_KEYS.inactivity, JSON.stringify({
      pageNum: 2,
      perPage: 50,
      lastSeenManifest: 'month',
      geos: 'us,ca,ca_fr',
      filterText: '/photoshop',
      orderBy: 'a.lastSeen',
      order: 'desc',
    }));
    setRoutedFetch({
      '/get-report': jsonResponse(getReportData),
      '/get-target-history': jsonResponse({ breakdown: true, result: [] }),
    });
    const reportBodies = () => window.fetch.getCalls()
      .filter(({ args }) => args[0].includes('/get-report'))
      .map(({ args }) => JSON.parse(args[1].body));
    const clickHeader = (label) => [...document.querySelectorAll('.mmm2-report-sortable')]
      .find((header) => header.textContent.includes(label)).click();
    try {
      const module = await import('../../../libs/blocks/mmm-2/mmm-2.js');
      await module.default(document.querySelector('.mmm-2'));
      await waitFor(() => reportBodies().length === 1);
      expect(reportBodies()[0]).to.include({ orderBy: 'p.lastSeen', order: 'asc', perPage: 50, lastSeenManifest: 'month', geos: 'us,ca,ca_fr' });
      clickHeader('Last Seen from Target');
      await waitFor(() => reportBodies().at(-1).orderBy === 'a.lastSeen');
      expect(reportBodies().at(-1)).to.include({ orderBy: 'a.lastSeen', order: 'desc', pageNum: 1 });
      clickHeader('Page Last Seen');
      await waitFor(() => reportBodies().at(-1).orderBy === 'p.lastSeen');
      expect(reportBodies().at(-1)).to.include({ orderBy: 'p.lastSeen', order: 'desc', pageNum: 1 });
      clickHeader('Page Last Seen');
      await waitFor(() => reportBodies().at(-1).order === 'asc');
      expect(reportBodies().at(-1)).to.include({ orderBy: 'p.lastSeen', order: 'asc', pageNum: 1 });
    } finally {
      window.history.replaceState({}, '', originalUrl);
    }
  });

  it('switches tabs and consumes local inactivity instructions and menus', async () => {
    window.history.pushState({}, '', window.location.pathname);
    setRoutedFetch({
      '/get-pages': jsonResponse(getPagesData),
      '/get-report': jsonResponse(getReportData),
      '/get-target-history': jsonResponse({ breakdown: true, result: [] }),
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
    expect(document.querySelectorAll('#mmm2-report-filter-geos option')).to.have.length(20);
    expect(document.querySelectorAll('.mmm2-howto-body li')).to.have.length(5);
    expect(document.querySelector('.mmm2-howto-body a').getAttribute('href'))
      .to.equal('/docs/authoring/features/mep/target-integration');
    expect(window.fetch.getCalls().some(({ args }) => args[0].includes('.plain.html'))).to.be.false;
    const rows = document.querySelectorAll('.mmm2-report-row');
    expect(rows.length).to.equal(getReportData.result.length);

    const [searchTab] = document.querySelectorAll('.mmm2-tab-button');
    searchTab.click();
    await delay();
    expect(window.location.search).to.equal('');
    expect(document.querySelector('.mmm2-search-view')).to.exist;
  });

  it('uses authored inactivity defaults and labels without adding menu options', async () => {
    window.history.replaceState({}, '', `${window.location.pathname}?tab=inactivity`);
    const content = document.querySelector('.inactivity-report');
    const rows = [...content.children];
    rows.find((row) => row.children[0].textContent === 'week').children[1].textContent = 'Week';
    rows.find((row) => row.children[0].textContent === 'threeMonths').children[1].innerHTML = '<b>Quarter</b>';
    rows.find((row) => row.children[0].textContent === 'Menu: lastSeenManifest')
      .children[1].textContent = 'Authored inactivity window';
    content.firstElementChild.children[0].textContent = 'Authored inactivity instructions';
    setRoutedFetch({
      '/get-report': jsonResponse(getReportData),
      '/get-target-history': jsonResponse({ breakdown: true, result: [] }),
    });
    const module = await import('../../../libs/blocks/mmm-2/mmm-2.js');
    await module.default(document.querySelector('.mmm-2'));
    await waitFor(() => document.querySelector('.mmm2-report-row'));
    const select = document.querySelector('#mmm2-report-filter-lastseen');
    expect(select.value).to.equal('threeMonths');
    expect([...select.options].map(({ value }) => value))
      .to.deep.equal(['day', 'week', 'month', 'threeMonths']);
    expect(select.labels[0].textContent).to.equal('Authored inactivity window:');
    expect(document.querySelector('.mmm2-howto-summary').textContent)
      .to.equal('Authored inactivity instructions');
    const request = window.fetch.getCalls().find(({ args }) => args[0].includes('/get-report'));
    expect(JSON.parse(request.args[1].body))
      .to.include({ lastSeenManifest: 'threeMonths', geos: '', orderBy: 'p.lastSeen' });
  });

  it('resets removed saved inactivity choices to authored defaults', async () => {
    window.history.replaceState({}, '', `${window.location.pathname}?tab=inactivity`);
    localStorage.setItem(LOCAL_STORAGE_KEYS.inactivity, JSON.stringify({ lastSeenManifest: 'year', geos: 'deleted', pageNum: 8, perPage: 50 }));
    setRoutedFetch({
      '/get-report': jsonResponse(getReportData),
      '/get-target-history': jsonResponse({ breakdown: true, result: [] }),
    });
    const module = await import('../../../libs/blocks/mmm-2/mmm-2.js');
    await module.default(document.querySelector('.mmm-2'));
    await waitFor(() => document.querySelector('.mmm2-report-row'));
    expect(document.querySelector('.mmm2-inactivity-view [role="status"]').textContent)
      .to.include('Unavailable filter selections were reset');
    const request = window.fetch.getCalls().find(({ args }) => args[0].includes('/get-report'));
    expect(JSON.parse(request.args[1].body))
      .to.include({ lastSeenManifest: 'week', geos: '', pageNum: 1, perPage: 50 });
  });

  it('consumes metadata instructions, menu labels, defaults and the inline spreadsheet button', async () => {
    window.history.replaceState({}, '', `${window.location.pathname}?tab=metadata-lookup`);
    const content = document.querySelector('.metadata-lookup');
    const rows = [...content.children];
    rows.find((row) => row.children[0].textContent === 'cc').children[1].textContent = 'CC';
    rows.find((row) => row.children[0].textContent === 'dc').children[1].innerHTML = '<strong>Document Cloud</strong>';
    setRoutedFetch({ 'metadata-optimization.json': jsonResponse({ data: [] }) });
    const module = await import('../../../libs/blocks/mmm-2/mmm-2.js');
    await module.default(document.querySelector('.mmm-2'));
    await waitFor(() => dataRequests().length);
    expect(dataRequests()[0].args[0]).to.include('main--dc--adobecom');
    expect(document.querySelector('#mmm2-metadata-repo').value).to.equal('dc');
    expect([...document.querySelector('#mmm2-metadata-repo').options].map(({ textContent }) => textContent))
      .to.deep.equal(['CC', 'Document Cloud', 'Express', 'BACOM']);
    expect(document.querySelector('.mmm2-howto-summary').textContent).to.equal('How to use this report');
    expect(document.querySelectorAll('.mmm2-howto-body li')).to.have.length(7);
    const link = document.querySelector('.mmm2-howto-body li:nth-child(2) a');
    expect(link.textContent).to.equal('Open DC Spreadsheet');
    expect(link.href).to.include('8F5A8CD0-7979-41CE-894A-CC465B293C1A');
    expect(link.target).to.equal('_blank');
    expect(link.classList.contains('con-button')).to.be.true;
    expect(document.querySelector('.mmm2-filters a')).to.not.exist;
    const select = document.querySelector('#mmm2-metadata-repo');
    select.value = 'express';
    select.dispatchEvent(new Event('change', { bubbles: true }));
    await waitFor(() => window.fetch.lastCall.args[0].includes('main--express-milo--adobecom'));
    expect(document.querySelector('.mmm2-howto-body li:nth-child(2) a').textContent)
      .to.equal('Open Express Spreadsheet');
  });

  it('uses Milo-decorated metadata copy and report buttons', async () => {
    window.history.replaceState({}, '', `${window.location.pathname}?tab=metadata-lookup`);
    localStorage.setItem(LOCAL_STORAGE_KEYS.metadataLookup, JSON.stringify({
      selectedRepo: 'cc',
      urlListText: 'https://www.adobe.com/products/photoshop',
    }));
    setRoutedFetch({
      'metadata-optimization.json': jsonResponse({ data: [{ URL: '/products/photoshop', target: 'on' }] }),
      '/save-mep-call': jsonResponse({}),
    });
    const module = await import('../../../libs/blocks/mmm-2/mmm-2.js');
    await module.default(document.querySelector('.mmm-2'));
    await waitFor(() => document.querySelector('.mmm2-metadata-pod button'));
    expect(document.querySelector('.mmm2-metadata-pod button').className)
      .to.equal('con-button outline');
    expect(document.querySelector('.mmm2-metadata-report-actions > button').className.trim())
      .to.equal('con-button blue button-l');
  });

  it('shows category copy feedback to the right and dismisses it after three seconds', async function categoryCopyFeedback() {
    this.timeout(10000);
    window.history.replaceState({}, '', `${window.location.pathname}?tab=metadata-lookup`);
    localStorage.setItem(LOCAL_STORAGE_KEYS.metadataLookup, JSON.stringify({
      selectedRepo: 'cc',
      urlListText: 'https://www.adobe.com/products/photoshop',
    }));
    setRoutedFetch({ 'metadata-optimization.json': jsonResponse({ data: [] }) });
    let finishCopy;
    const clipboard = stub(navigator.clipboard, 'writeText').returns(
      new Promise((resolve) => { finishCopy = resolve; }),
    );
    const errors = stub(console, 'error');
    const style = document.createElement('style');
    style.textContent = `
      ${await readFile({ path: '../../../libs/blocks/mmm-2/mmm-2.css' })}
      .mmm-2 { --spacing-xs: 8px; --spacing-s: 16px; }
      .mmm-2 .mmm2-metadata-pod { min-width: 500px; }
    `;
    document.head.append(style);
    try {
      const module = await import('../../../libs/blocks/mmm-2/mmm-2.js');
      await module.default(document.querySelector('.mmm-2'));
      await waitFor(() => document.querySelector('.mmm2-metadata-pod button'));
      const actions = document.querySelector('.mmm2-metadata-pod-actions');
      const copy = actions.querySelector('button');
      const initialButton = copy.getBoundingClientRect().toJSON();
      const initialCard = actions.closest('.mmm2-metadata-pod').getBoundingClientRect().toJSON();
      copy.click();
      await waitFor(() => copy.disabled);
      expect(actions.querySelector('.mmm2-copy-message').dataset.state).to.equal('copying');
      copy.click();
      expect(clipboard.calledOnceWithExactly('/products/photoshop')).to.be.true;
      finishCopy();
      await waitFor(() => actions.querySelector('[data-state="success"]'));
      const message = actions.querySelector('.mmm2-copy-message');
      expect(message.textContent.trim()).to.equal('Copied to clipboard.');
      expect(message.getAttribute('role')).to.equal('status');
      expect(message.previousElementSibling).to.equal(copy);
      expect(getComputedStyle(message).position).to.equal('absolute');
      expect(copy.getBoundingClientRect().toJSON()).to.deep.equal(initialButton);
      expect(actions.closest('.mmm2-metadata-pod').getBoundingClientRect().toJSON())
        .to.deep.equal(initialCard);
      expect(message.getBoundingClientRect().left)
        .to.be.at.least(copy.getBoundingClientRect().right);
      expect(getComputedStyle(message).backgroundColor).to.equal('rgb(228, 244, 232)');
      expect(copy.disabled).to.be.false;
      await delay(2700);
      expect(actions.querySelector('.mmm2-copy-message')).to.exist;
      await delay(600);
      expect(actions.querySelector('.mmm2-copy-message')).to.not.exist;
      clipboard.rejects(new DOMException('Clipboard denied', 'NotAllowedError'));
      copy.click();
      await waitFor(() => actions.querySelector('[role="alert"]'));
      expect(actions.querySelector('.mmm2-copy-message').dataset.state).to.equal('error');
      expect(errors.calledOnce).to.be.true;
      expect(copy.disabled).to.be.false;
    } finally {
      clipboard.restore();
      errors.restore();
      style.remove();
    }
  });

  it('confirms metadata report copying only after success and displays clipboard failures', async () => {
    window.history.replaceState({}, '', `${window.location.pathname}?tab=metadata-lookup`);
    localStorage.setItem(LOCAL_STORAGE_KEYS.metadataLookup, JSON.stringify({
      selectedRepo: 'cc',
      urlListText: 'https://www.adobe.com/products/photoshop',
    }));
    setRoutedFetch({ 'metadata-optimization.json': jsonResponse({ data: [] }) });
    let finishCopy;
    const clipboard = stub(navigator.clipboard, 'writeText').returns(
      new Promise((resolve) => { finishCopy = resolve; }),
    );
    const errors = stub(console, 'error');
    const style = document.createElement('style');
    style.textContent = `
      ${await readFile({ path: '../../../libs/blocks/mmm-2/mmm-2.css' })}
      .mmm-2 { --spacing-xs: 8px; }
    `;
    document.head.append(style);
    try {
      const module = await import('../../../libs/blocks/mmm-2/mmm-2.js');
      await module.default(document.querySelector('.mmm-2'));
      await waitFor(() => document.querySelector('.mmm2-metadata-pod button'));
      const copy = document.querySelector('.mmm2-metadata-report-actions > button');
      const initialButton = copy.getBoundingClientRect().toJSON();
      const initialView = copy.closest('.mmm2-metadata-view').getBoundingClientRect().toJSON();
      expect(getComputedStyle(copy).cursor).to.equal('pointer');
      copy.click();
      await waitFor(() => copy.disabled);
      expect(copy.classList.contains('has-success')).to.be.false;
      expect(document.querySelector('.mmm2-copy-message').textContent.trim())
        .to.equal('Copying report...');
      expect(document.querySelector('.mmm2-copy-message').dataset.state).to.equal('copying');
      copy.click();
      expect(clipboard.calledOnce).to.be.true;
      expect(clipboard.firstCall.args[0]).to.include('https://www.adobe.com/products/photoshop');
      finishCopy();
      await waitFor(() => document.querySelector('.mmm2-copy-message[data-state="success"]'));
      expect(copy.disabled).to.be.false;
      expect(getComputedStyle(copy, '::after').content).to.equal('none');
      expect(document.querySelector('.mmm2-copy-message').previousElementSibling).to.equal(copy);
      expect(document.querySelector('.mmm2-copy-message[role="status"]').textContent.trim())
        .to.equal('Report copied to clipboard.');
      const block = document.querySelector('.mmm-2');
      let message = document.querySelector('.mmm2-copy-message');
      expect(getComputedStyle(message).position).to.equal('absolute');
      expect(message.getBoundingClientRect().left)
        .to.be.at.least(copy.getBoundingClientRect().right);
      expect(copy.getBoundingClientRect().toJSON()).to.deep.equal(initialButton);
      expect(copy.closest('.mmm2-metadata-view').getBoundingClientRect().toJSON())
        .to.deep.equal(initialView);
      expect(getComputedStyle(message).backgroundColor).to.equal('rgb(228, 244, 232)');
      expect(getComputedStyle(message).color).to.equal('rgb(33, 110, 57)');
      block.classList.add('dark');
      expect(getComputedStyle(message).backgroundColor).to.equal('rgb(32, 59, 41)');
      expect(getComputedStyle(message).color).to.equal('rgb(160, 223, 176)');
      block.classList.remove('dark');
      clipboard.rejects(new DOMException('Clipboard denied', 'NotAllowedError'));
      copy.click();
      await waitFor(() => document.querySelector('.mmm2-copy-message[role="alert"]'));
      expect(copy.classList.contains('has-success')).to.be.false;
      expect(document.querySelector('.mmm2-copy-message').textContent.trim())
        .to.equal('Unable to copy to the clipboard. Please try again.');
      message = document.querySelector('.mmm2-copy-message');
      expect(getComputedStyle(message).backgroundColor).to.equal('rgb(253, 232, 231)');
      expect(getComputedStyle(message).color).to.equal('rgb(156, 37, 32)');
      block.classList.add('dark');
      expect(getComputedStyle(message).backgroundColor).to.equal('rgb(72, 39, 36)');
      expect(getComputedStyle(message).color).to.equal('rgb(255, 180, 173)');
      block.classList.remove('dark');
      expect(errors.calledOnce).to.be.true;
      clipboard.resolves();
      copy.click();
      await waitFor(() => document.querySelector('.mmm2-copy-message[data-state="success"]'));
      const input = document.querySelector('#mmm2-metadata-filter');
      input.value = 'https://www.adobe.com/new-page';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      await waitFor(() => !document.querySelector('.mmm2-copy-message'));
      expect(copy.classList.contains('has-success')).to.be.false;
    } finally {
      clipboard.restore();
      errors.restore();
      style.remove();
    }
  });

  it('preserves a valid saved metadata repo instead of the bold default', async () => {
    window.history.replaceState({}, '', `${window.location.pathname}?tab=metadata-lookup`);
    localStorage.setItem(LOCAL_STORAGE_KEYS.metadataLookup, JSON.stringify({ selectedRepo: 'bacom', urlListText: '' }));
    setRoutedFetch({ 'metadata-optimization.json': jsonResponse({ data: [] }) });
    const module = await import('../../../libs/blocks/mmm-2/mmm-2.js');
    await module.default(document.querySelector('.mmm-2'));
    await waitFor(() => dataRequests().length);
    expect(dataRequests()[0].args[0]).to.include('main--bacom--adobecom');
    expect(document.querySelector('#mmm2-metadata-repo').value).to.equal('bacom');
  });

  it('rejects unsupported metadata repos before fetching or syncing pages', async () => {
    window.history.replaceState({}, '', `${window.location.pathname}?tab=metadata-lookup`);
    const row = document.createElement('div');
    row.innerHTML = '<div>unknown</div><div>Unknown repo</div>';
    document.querySelector('.metadata-lookup').append(row);
    setRoutedFetch({});
    const module = await import('../../../libs/blocks/mmm-2/mmm-2.js');
    await module.default(document.querySelector('.mmm-2'));
    await delay();
    expect(document.querySelector('[role="alert"]').textContent)
      .to.include('Unsupported metadata repositories: unknown');
    expect(dataRequests()).to.have.length(0);
  });

  it('rejects incomplete inactivity content before report or chart requests', async () => {
    window.history.replaceState({}, '', `${window.location.pathname}?tab=inactivity`);
    document.querySelector('.inactivity-report').remove();
    setRoutedFetch({});
    const module = await import('../../../libs/blocks/mmm-2/mmm-2.js');
    await module.default(document.querySelector('.mmm-2'));
    await delay();
    expect(document.querySelector('[role="alert"]').textContent).to.include('Add an Inactivity Report table');
    expect(dataRequests()).to.have.length(0);
  });

  it('scopes dark controls and expanded cards without changing light defaults or the page', async () => {
    const style = document.createElement('style');
    style.textContent = `
      :root { --color-white: #fff; --text-color: #2c2c2c; }
      ${await readFile({ path: '../../../libs/blocks/mmm-2/mmm-2.css' })}
    `;
    document.head.append(style);
    setRoutedFetch({
      '/get-pages': jsonResponse(getPagesData),
      '/get-page': jsonResponse(getPageData),
    });
    try {
      const block = document.querySelector('.mmm-2');
      const outsideColor = getComputedStyle(document.body).color;
      const module = await import('../../../libs/blocks/mmm-2/mmm-2.js');
      await module.default(block);
      await waitFor(() => block.querySelector('.mmm2-page-item'));
      expect(getComputedStyle(block.querySelector('select')).backgroundColor).to.equal('rgb(255, 255, 255)');
      block.classList.add('dark');
      await waitFor(() => getComputedStyle(block).backgroundColor === 'rgb(24, 24, 24)');
      expect(getComputedStyle(block).backgroundColor).to.equal('rgb(24, 24, 24)');
      expect(getComputedStyle(block.querySelector('select')).backgroundColor).to.equal('rgb(32, 32, 32)');
      expect(getComputedStyle(block.querySelector('textarea')).color).to.equal('rgb(245, 245, 245)');
      expect(getComputedStyle(document.body).color).to.equal(outsideColor);
      block.querySelector('.mmm2-page-trigger').click();
      await waitFor(() => block.querySelector('.mep-popup'));
      expect(getComputedStyle(block.querySelector('.mep-popup-body')).backgroundColor).to.equal('rgb(32, 32, 32)');
      block.classList.remove('dark');
      expect(getComputedStyle(block.querySelector('.mep-popup-body')).backgroundColor).to.equal('rgb(255, 255, 255)');
    } finally {
      style.remove();
    }
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
