import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { stub } from 'sinon';
import { DEBOUNCE_TIME, MMM_METADATA_LOCAL_STORAGE_KEY, getLocalStorageFilter } from '../../../libs/blocks/mmm/mmm.js';
import { getConfig } from '../../../libs/utils/utils.js';

const config = getConfig();
config.mep = {
  akamaiCode: 'us',
  consentState: { performance: true, advertising: true },
};

const delay = (ms = 0) => new Promise((resolve) => {
  setTimeout(() => resolve(), ms);
});

document.body.innerHTML = await readFile({ path: './mocks/body.html' });
const getFetchPromise = (data, type = 'json') => new Promise((resolve) => {
  resolve({
    ok: true,
    [type]: () => data,
  });
});

const setFetchResponse = (data, type = 'json') => {
  window.fetch = stub().returns(getFetchPromise(data, type));
};

async function loadJsonAndSetResponse(jsonPath) {
  let json = await readFile({ path: jsonPath });
  json = JSON.parse(json);
  setFetchResponse(json);
}

describe('MMM - Target Cleanup Report', () => {
  before(async () => {
    await loadJsonAndSetResponse('./mocks/get-report.json');
    document.body.innerHTML = await readFile({ path: './mocks/bodyReport.html' });
    const module = await import('../../../libs/blocks/mmm/mmm.js');
    await module.default(document.querySelector('.mmm'));
  });

  it('should load report page', async () => {
    expect(document.querySelector('.mmm-report')).to.exist;
    expect(document.querySelector('#mmm-pagination')).to.exist;
    expect(document.querySelector('#mmm-search-filter')).to.exist;
    expect(document.querySelector('#mmm-lastSeenManifest')).to.exist;
    expect(document.querySelector('.mmm-pagination-summary span').textContent).to.equal('1 - 25 of 356');
  });
});

describe('MMM', () => {
  before(async () => {
    await loadJsonAndSetResponse('./mocks/get-pages.json');
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const module = await import('../../../libs/blocks/mmm/mmm.js');
    await module.default(document.querySelector('.mmm'));
    localStorage.clear();
  });

  it('Renders with mmm class', async () => {
    const mmmDl = document.querySelector('dl.mmm');
    expect(mmmDl).to.exist;
    const mmmDt = mmmDl.querySelectorAll('dt');
    expect(mmmDt.length).to.equal(5);
    expect(mmmDt[0].textContent).to.equal('https://www.adobe.com/1 Manifest(s) found');
    const mmmDd = mmmDl.querySelectorAll('dd');
    expect(mmmDd.length).to.equal(5);
    const loading = mmmDd[0].querySelector('.loading');
    expect(loading).to.exist;
  });

  it('Expand collapse', async () => {
    await loadJsonAndSetResponse('./mocks/get-page.json');
    const [firstMmmButton, secondMmmButton] = document.body.querySelectorAll('dt button');
    expect(firstMmmButton.getAttribute('aria-expanded')).to.equal('false');
    expect(secondMmmButton.getAttribute('aria-expanded')).to.equal('false');

    // open 1st
    firstMmmButton.click();
    expect(firstMmmButton.getAttribute('aria-expanded')).to.equal('true');
    expect(secondMmmButton.getAttribute('aria-expanded')).to.equal('false');

    // open 2nd
    secondMmmButton.click();
    expect(firstMmmButton.getAttribute('aria-expanded')).to.equal('false');
    expect(secondMmmButton.getAttribute('aria-expanded')).to.equal('true');

    // close 2nd
    secondMmmButton.click();
    expect(firstMmmButton.getAttribute('aria-expanded')).to.equal('false');
    expect(secondMmmButton.getAttribute('aria-expanded')).to.equal('false');

    // re-open 1st
    firstMmmButton.click();
    expect(firstMmmButton.getAttribute('aria-expanded')).to.equal('true');
    expect(secondMmmButton.getAttribute('aria-expanded')).to.equal('false');
  });

  it('Loads page details', async () => {
    const firstMmmButton = document.body.querySelector('dt button');
    await loadJsonAndSetResponse('./mocks/get-page.json');
    firstMmmButton.click();
    const firstMmmDd = document.body.querySelector('dd');
    const loading = firstMmmDd.querySelector('.loading');
    expect(loading).to.not.exist;
    const mmmPopup = firstMmmDd.querySelector('.mep-popup');
    expect(mmmPopup).to.exist;
    const infoColumnOne = mmmPopup.querySelector('.mep-popup-body .mep-section-data');
    expect(infoColumnOne.querySelector('span:nth-child(1)').textContent).to.include('Experience');
    expect(infoColumnOne.querySelector('span:nth-child(2)').textContent).to.include('default (control)');
    expect(infoColumnOne.querySelector('span:nth-child(3)').textContent).to.include('Source');
    expect(infoColumnOne.querySelector('span:nth-child(4)').textContent).to.include('target');
    expect(infoColumnOne.querySelector('span:nth-child(5)').textContent).to.include('Consent req');
    expect(infoColumnOne.querySelector('span:nth-child(6)').textContent).to.include('undefined');
    const mepPopupBody = mmmPopup.querySelector('.mep-popup-body');
    expect(mepPopupBody).to.exist;
    const radios = mepPopupBody.querySelectorAll('select');
    // 3 = Lingo region + 2 variant selects. M@S market select is gated on
    // hasMasSurfaces() and this fixture has no M@S content.
    expect(radios.length).to.equal(3);
    const checkboxes = mepPopupBody.querySelectorAll('input[type="checkbox"]');
    // 5 = mepHighlight + mepFragments + mepCaasHighlight + mepMasHighlight +
    // mepPreviewButton. mepMasMarketCheckbox is gated on (hasMas && lingoOk);
    // showManifestsCheckbox is gated on !isMmm.
    expect(checkboxes.length).to.equal(5);
    const inputs = mepPopupBody.querySelectorAll('input[type="text"]');
    expect(inputs.length).to.equal(1);
    const editButton = mepPopupBody.querySelector('.mep-edit-manifest');
    expect(editButton).to.exist;
    expect(editButton.href).to.equal('https://main--homepage--adobecom.aem.page/homepage/fragments/mep/hp-11-15-black-friday.json');
    const previewButton = mmmPopup.querySelector('a[data-id="preview-button"]');
    expect(previewButton).to.exist;
  });

  it('Test preview button', async () => {
    const firstMmmButton = document.body.querySelector('dt button');
    await loadJsonAndSetResponse('./mocks/get-page.json');
    firstMmmButton.click();
    const firstMmmDd = document.body.querySelector('dd');
    const mmmPopup = firstMmmDd.querySelector('.mep-popup');
    const previewButton = mmmPopup.querySelector('a[data-id="preview-button"]');
    expect(previewButton).to.exist;
    expect(previewButton.href).to.include('https://www.adobe.com/?mep=');
    const option = mmmPopup.querySelector('option[name="https://main--homepage--adobecom.aem.page/homepage/fragments/mep/hp-11-15-black-friday.json4"][value="target-apro-twp-abdn"]');
    expect(option).to.exist;
    option.click();
    expect(previewButton.href).to.include('https://www.adobe.com/?mep=');
    const addHighlight = mmmPopup.querySelector('#mepHighlightCheckbox-4');
    expect(addHighlight).to.exist;
    addHighlight.click();
    expect(previewButton.href).to.include('mepHighlight=true');
    const addButtonOff = document.querySelector('#mepPreviewButtonCheckbox-4');
    expect(addButtonOff).to.exist;
    addButtonOff.click();
    expect(previewButton.href).to.include('mepButton=off');
    const newManifest = mmmPopup.querySelector('.new-manifest');
    expect(newManifest).to.exist;
    newManifest.value = '/added-manifest.json';
    const event = new Event('change');
    newManifest.dispatchEvent(event);
    expect(previewButton.href).to.include('%2Fadded-manifest.json');
  });

  it('does not crash and preserves loading state when fetchData returns null', async () => {
    const [,, thirdButton] = document.body.querySelectorAll('dt button');
    const thirdDd = document.body.querySelectorAll('dd')[2];
    expect(thirdDd.querySelector('.loading')).to.exist;

    window.fetch = stub().returns(Promise.resolve({ ok: false }));
    thirdButton.click();
    await delay(50);

    expect(thirdDd.classList.contains('placeholder-resolved')).to.be.false;
    expect(thirdDd.querySelector('.loading')).to.exist;
  });

  it('Test filters', async () => {
    let filterData = getLocalStorageFilter();
    expect(filterData).to.be.null;

    const event = new Event('change');

    const geoDropdown = document.querySelector('#mmm-dropdown-geos');
    expect(geoDropdown).to.exist;
    geoDropdown.options[1].selected = true;
    geoDropdown.dispatchEvent(event);

    const pageDropdown = document.querySelector('#mmm-dropdown-pages');
    expect(pageDropdown).to.exist;
    pageDropdown.options[2].selected = true;
    pageDropdown.dispatchEvent(event);

    geoDropdown.options[0].selected = true;
    geoDropdown.dispatchEvent(event);

    const lastSeenManifestDropdown = document.querySelector('#mmm-lastSeenManifest');
    lastSeenManifestDropdown.options[0].selected = true;
    lastSeenManifestDropdown.dispatchEvent(event);

    const mmmSearchQuery = document.querySelector('#mmm-search-filter');
    expect(mmmSearchQuery).to.exist;
    mmmSearchQuery.value = 'pricing';
    mmmSearchQuery.dispatchEvent(event);
    await delay(DEBOUNCE_TIME + 1); // await debounce time

    filterData = getLocalStorageFilter();
    expect(filterData).to.not.be.null;
    expect(filterData.filter).to.not.be.null;
    expect(filterData.geos).to.not.be.null;
    expect(filterData.pages).to.not.be.null;
    expect(filterData.pageNum).to.not.be.null;
    expect(filterData.subdomain).to.not.be.null;
    expect(filterData.lastSeenManifest).to.not.be.null;
  });
});

describe('MMM - stored data is rendered as text', () => {
  const PAYLOAD = '<img class="xss" src="x" onerror="window.mmmXss=true">';

  async function initMmm(bodyPath, jsonPath) {
    await loadJsonAndSetResponse(jsonPath);
    document.body.innerHTML = await readFile({ path: bodyPath });
    const module = await import('../../../libs/blocks/mmm/mmm.js');
    await module.default(document.querySelector('.mmm'));
  }

  beforeEach(() => {
    delete window.mmmXss;
    localStorage.clear();
  });

  after(() => {
    delete window.mmmXss;
    localStorage.clear();
  });

  it('escapes report rows and drops unsafe hrefs', async () => {
    await initMmm('./mocks/bodyReport.html', './mocks/get-report-xss.json');
    await delay(50);
    const report = document.querySelector('.mmm-report');
    expect(report.querySelectorAll('.xss').length).to.equal(0);
    expect(window.mmmXss).to.be.undefined;

    const [first, second] = report.querySelectorAll('.mmm-report-row');
    expect(first.querySelector('a').getAttribute('href')).to.equal('https://www.adobe.com/products/photoshop.html?mep');
    expect(first.children[2].textContent).to.equal(PAYLOAD);
    const manifestLink = first.querySelector('a.small');
    expect(manifestLink.textContent).to.equal(PAYLOAD);
    expect(manifestLink.hasAttribute('href')).to.be.false;
    expect(second.querySelector('a').hasAttribute('href')).to.be.false;
    report.querySelectorAll('.mmm-report-header .sortable').forEach((header) => {
      expect(header.dataset.order).to.be.oneOf(['asc', 'desc']);
    });
  });

  it('copies only rows with a safe page URL', async () => {
    await initMmm('./mocks/bodyReport.html', './mocks/get-report-xss.json');
    await delay(50);
    const writeText = stub(navigator.clipboard, 'writeText').resolves();
    try {
      document.querySelectorAll('.mmm-report-add').forEach((checkbox) => { checkbox.checked = true; });
      document.querySelector('.mmm-report-copy').click();
      expect(writeText.calledOnce).to.be.true;
      expect(writeText.firstCall.args[0]).to.equal('Please turn off Target integration from the following page:\nhttps://www.adobe.com/products/photoshop.html');
    } finally {
      writeText.restore();
    }
  });

  it('escapes the page list', async () => {
    await initMmm('./mocks/body.html', './mocks/get-pages-xss.json');
    await delay(50);
    const dt = document.querySelector('dl.mmm dt');
    expect(dt.querySelectorAll('.xss').length).to.equal(0);
    expect(window.mmmXss).to.be.undefined;
    const anchor = dt.querySelector('h5 a');
    expect(anchor.hasAttribute('href')).to.be.false;
    expect(anchor.textContent).to.include(PAYLOAD);
    expect(dt.querySelector('.mmm-page_item-subtext').textContent).to.equal(`${PAYLOAD} Manifest(s) found`);
    const pagination = document.querySelector('#mmm-pagination');
    expect(pagination.querySelectorAll('.xss').length).to.equal(0);
    expect(pagination.querySelector('#mmm-pagination-no-results')).to.exist;
  });

  it('escapes metadata lookup results', async () => {
    const match = `https://www.adobe.com/${PAYLOAD}.html`;
    const notFound = `https://www.adobe.com/${PAYLOAD}-missing.html`;
    localStorage.setItem(MMM_METADATA_LOCAL_STORAGE_KEY, JSON.stringify({
      selectedRepo: 'cc',
      metadataFilter: `${match}\n${notFound}`,
    }));
    await initMmm('./mocks/bodyMetadataLookup.html', './mocks/get-metadata-xss.json');
    await delay(DEBOUNCE_TIME + 50);
    const results = document.querySelector('.mmm-metadata-lookup__results');
    expect(results.querySelectorAll('.xss').length).to.equal(0);
    expect(window.mmmXss).to.be.undefined;
    const items = [...results.querySelectorAll('.mmm-metadata-url-pod__item span')];
    expect(items.map((item) => item.textContent)).to.have.members([
      `/${PAYLOAD}`,
      `/${PAYLOAD}-missing`,
    ]);
    const copyButtons = results.querySelectorAll('button.mmm-metadata-lookup__button');
    expect(copyButtons.length).to.equal(2);
    copyButtons.forEach((button) => expect(() => JSON.parse(button.dataset.result)).to.not.throw());
  });
});
