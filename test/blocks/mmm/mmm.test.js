import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { stub } from 'sinon';
import { DEBOUNCE_TIME, getLocalStorageFilter } from '../../../libs/blocks/mmm/mmm.js';

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

describe('MMM - Targer Cleanup Report', () => {
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
  });
});

describe('MMM', () => {
  before(async () => {
    await loadJsonAndSetResponse('./mocks/get-pages.json');
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const module = await import('../../../libs/blocks/mmm/mmm.js');
    await module.default(document.querySelector('.mmm'));
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
    const infoColumnOne = mmmPopup.querySelector('.mep-popup-body .mep-columns > .mep-column:nth-child(1)');
    expect(infoColumnOne.querySelector('div:nth-child(1)').textContent).to.include('Target Integration');
    expect(infoColumnOne.querySelector('div:nth-child(2)').textContent).to.include('Personalization');
    expect(infoColumnOne.querySelector('div:nth-child(3)').textContent).to.include('Geo Folder');
    expect(infoColumnOne.querySelector('div:nth-child(4)').textContent).to.include('Locale');
    expect(infoColumnOne.querySelector('div:nth-child(5)').textContent).to.include('Last Seen');
    const infoColumnTwo = mmmPopup.querySelector('.mep-popup-body .mep-columns > .mep-column:nth-child(2)');
    expect(infoColumnTwo.querySelector('div:nth-child(1)').textContent).to.include('on');
    expect(infoColumnTwo.querySelector('div:nth-child(2)').textContent).to.include('on');
    expect(infoColumnTwo.querySelector('div:nth-child(3)').textContent).to.include('Nothing (US)');
    expect(infoColumnTwo.querySelector('div:nth-child(4)').textContent).to.include('en-us');
    const mepPopupBody = mmmPopup.querySelector('.mep-popup-body');
    expect(mepPopupBody).to.exist;
    const radios = mepPopupBody.querySelectorAll('select');
    expect(radios.length).to.equal(3);
    const checkboxes = mepPopupBody.querySelectorAll('input[type="checkbox"]');
    expect(checkboxes.length).to.equal(2);
    const inputs = mepPopupBody.querySelectorAll('input[type="text"]');
    expect(inputs.length).to.equal(1);
    const manifestColumnOne = mepPopupBody.querySelector('.mep-manifest-info .mep-columns > .mep-column:nth-child(1)');
    expect(manifestColumnOne.querySelector('div:nth-child(1)').textContent).to.include('Selected');
    expect(manifestColumnOne.querySelector('div:nth-child(2)').textContent).to.include('Source');
    expect(manifestColumnOne.querySelector('div:nth-child(3)').textContent).to.include('Last seen');
    const manifestColumnTwo = mepPopupBody.querySelector('.mep-manifest-info .mep-columns > .mep-column:nth-child(2)');
    expect(manifestColumnTwo.querySelector('div:nth-child(1)').textContent).to.include('Default (control)');
    expect(manifestColumnTwo.querySelector('div:nth-child(2)').textContent).to.include('target');
    const editButton = mepPopupBody.querySelector('.mep-edit-manifest');
    expect(editButton).to.exist;
    expect(editButton.href).to.equal('https://main--homepage--adobecom.hlx.page/homepage/fragments/mep/hp-11-15-black-friday.json');
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
    expect(previewButton.href).to.include('https%3A%2F%2Fmain--homepage--adobecom.hlx.page%2Fhomepage%2Ffragments%2Fmep%2Fhp-11-15-black-friday.json--default');
    const option = mmmPopup.querySelector('option[name="https://main--homepage--adobecom.hlx.page/homepage/fragments/mep/hp-11-15-black-friday.json4"][value="target-apro-twp-abdn"]');
    expect(option).to.exist;
    option.click();
    expect(previewButton.href).to.include('https://www.adobe.com/?mep=https%3A%2F%2Fmain--homepage--adobecom.hlx.page%2Fhomepage%2Ffragments%2Fmep%2Fhp-11-15-black-friday.json--default');
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

  it('Test filters', async () => {
    let filterData = getLocalStorageFilter();
    expect(filterData).to.be.null;

    const copyButton = document.querySelector('.copy-to-clipboard');
    expect(copyButton).to.exist;
    const event = new Event('change');
    expect(copyButton.dataset.destination).to.not.include('geos');
    expect(copyButton.dataset.destination).to.not.include('pages');
    expect(copyButton.dataset.destination).to.not.include('filter');

    const geoDropdown = document.querySelector('#mmm-dropdown-geos');
    expect(geoDropdown).to.exist;
    geoDropdown.options[1].selected = true;
    geoDropdown.dispatchEvent(event);
    expect(copyButton.dataset.destination).to.include('geos');
    expect(copyButton.dataset.destination).to.not.include('pages');
    expect(copyButton.dataset.destination).to.not.include('filter');

    const pageDropdown = document.querySelector('#mmm-dropdown-pages');
    expect(pageDropdown).to.exist;
    pageDropdown.options[2].selected = true;
    pageDropdown.dispatchEvent(event);
    expect(copyButton.dataset.destination).to.include('geos');
    expect(copyButton.dataset.destination).to.include('pages');
    expect(copyButton.dataset.destination).to.not.include('filter');

    geoDropdown.options[0].selected = true;
    geoDropdown.dispatchEvent(event);
    expect(copyButton.dataset.destination).to.not.include('geos');
    expect(copyButton.dataset.destination).to.include('pages');
    expect(copyButton.dataset.destination).to.not.include('filter');

    const lastSeenManifestDropdown = document.querySelector('#mmm-lastSeenManifest');
    lastSeenManifestDropdown.options[0].selected = true;
    lastSeenManifestDropdown.dispatchEvent(event);
    expect(copyButton.dataset.destination).to.include('lastSeenManifest');

    const mmmSearchQuery = document.querySelector('#mmm-search-filter');
    expect(mmmSearchQuery).to.exist;
    mmmSearchQuery.value = 'pricing';
    mmmSearchQuery.dispatchEvent(event);
    await delay(DEBOUNCE_TIME + 1); // await debounce time
    expect(copyButton.dataset.destination).to.not.include('geos');
    expect(copyButton.dataset.destination).to.include('pages');
    expect(copyButton.dataset.destination).to.include('filter');

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
