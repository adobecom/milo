import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';

const {
  default: init,
  parseUrlString,
  generateRedirectList,
  stringifyListForExcel,
  SELECT_ALL_REGIONS,
  DESELECT_ALL_REGIONS,
  NO_LOCALE_ERROR,
} = await import('../../../blocks/redirects-formatter/redirects-formatter.js');
const { htmlIncluded, htmlExcluded, externalUrls, mixedSpaceTabUrls } = await import('./mocks/textAreaValues.js');

describe('Redirects Formatter', () => {
  const ogFetch = window.fetch;

  beforeEach(async () => {
    document.body.innerHTML = await readFile({ path: './mocks/redirects-formatter.html' });

    const block = document.querySelector('.redirects-formatter');

    sinon.stub(window, 'fetch');
    const fetchText = await readFile({ path: './mocks/locale-config.json' });
    const res = new window.Response(fetchText, { status: 200 });
    window.fetch.returns(Promise.resolve(res));

    await init(block);
  });

  afterEach(async () => {
    window.fetch = ogFetch;
  });

  it('correctly parses values from the input', () => {
    const parsedInput = parseUrlString(htmlIncluded);
    const firstPair = parsedInput[0];
    const lastPair = parsedInput[2];
    expect(firstPair[0]).to.equal('https://business.adobe.com/products/experience-manager/sites/experience-fragments.html');
    expect(firstPair[1]).to.equal('https://business.adobe.com/products/experience-manager/sites/omnichannel-experiences.html');
    expect(lastPair[0]).to.equal('https://business.adobe.com/products/experience-manager/sites/out-of-the-box-components.html');
    expect(lastPair[1]).to.equal('https://business.adobe.com/products/experience-manager/sites/developer-tools.html');
  });

  it('correctly parses values from the input with a mix of tabs and spaces', () => {
    const parsedInput = parseUrlString(mixedSpaceTabUrls);
    const firstPair = parsedInput[0];
    const lastPair = parsedInput[2];
    expect(firstPair[0]).to.equal('https://business.adobe.com/products/experience-manager/sites/experience-fragments.html');
    expect(firstPair[1]).to.equal('https://business.adobe.com/products/experience-manager/sites/omnichannel-experiences.html');
    expect(lastPair[0]).to.equal('https://business.adobe.com/products/experience-manager/sites/out-of-the-box-components.html');
    expect(lastPair[1]).to.equal('https://business.adobe.com/products/experience-manager/sites/developer-tools.html');
  });

  it('outputs localized urls', () => {
    const parsedInput = parseUrlString(htmlIncluded);
    const locales = ['ar', 'au', 'uk'];

    const redir = generateRedirectList(parsedInput, locales);
    expect(redir[0][0]).to.equal('/ar/products/experience-manager/sites/experience-fragments');
    expect(redir.length).to.equal(9);
  });

  it('provides a string formatted for pasting into excel', () => {
    const parsedInput = parseUrlString(htmlIncluded);
    const locales = ['ar', 'au', 'uk'];
    const redir = generateRedirectList(parsedInput, locales);
    const stringList = stringifyListForExcel(redir);

    expect(typeof stringList).to.equal('string');
    expect(stringList.substring(0, 4)).to.equal('/ar/');
    expect(stringList.substring((stringList.length - 6), stringList.length)).to.equal('.html\n');
  });

  it('adds .html to the end of the string in output', () => {
    expect(htmlExcluded.substring((htmlExcluded.length - 5), htmlExcluded.length)).to.equal('tools');
    const parsedInput = parseUrlString(htmlExcluded);
    const locales = ['ar', 'au', 'uk'];
    const redir = generateRedirectList(parsedInput, locales);
    const stringList = stringifyListForExcel(redir);

    expect(typeof stringList).to.equal('string');
    expect(stringList.substring(0, 4)).to.equal('/ar/');
    expect(stringList.substring((stringList.length - 6), stringList.length)).to.equal('.html\n');
  });

  it('does not add .html to the end of the string in output for external or blog urls', () => {
    expect(externalUrls.substring((externalUrls.length - 5), externalUrls.length)).to.equal('blog\n');
    const parsedInput = parseUrlString(externalUrls);
    const locales = ['ar', 'au', 'uk'];
    const redir = generateRedirectList(parsedInput, locales);
    const stringList = stringifyListForExcel(redir);

    expect(typeof stringList).to.equal('string');
    expect(stringList.substring(0, 4)).to.equal('/ar/');
    expect(stringList.substring((stringList.length - 6), stringList.length)).to.not.equal('.html\n');
  });

  it('selects/deselects all the checkboxes on click', async () => {
    const checkBoxes = document.querySelectorAll('.locale-checkbox');
    expect([...checkBoxes].every((cb) => !cb.checked)).to.be.true;

    const selectAllButton = document.querySelector('button');
    selectAllButton.click();

    expect([...checkBoxes].every((cb) => cb.checked)).to.be.true;
    expect(selectAllButton.innerText).to.equal(DESELECT_ALL_REGIONS);

    selectAllButton.click();
    expect([...checkBoxes].every((cb) => !cb.checked)).to.be.true;
    expect(selectAllButton.innerText).to.equal(SELECT_ALL_REGIONS);
  });

  it('informs the user of an error if no locales are selected', async () => {
    const checkBoxes = document.querySelectorAll('.locale-checkbox');
    expect([...checkBoxes].every((cb) => !cb.checked)).to.be.true;

    const processButton = document.querySelector('.process-redirects');
    const errorMessage = document.querySelector('.error');
    const checkBoxContainer = document.querySelector('.checkbox-container');
    processButton.click();
    expect(errorMessage.innerHTML).to.equal(NO_LOCALE_ERROR);
    expect(checkBoxContainer.classList.contains('error-border')).to.be.true;
  });

  it('informs the user of an error if an incorrect url is passed in to the input', async () => {
    const input = document.querySelector('.redirects-text-area');
    const processButton = document.querySelector('.process-redirects');
    const errorMessage = document.querySelector('.error');
    const selectAllCB = document.querySelector('.select-all-cb');
    const correct = 'https://www.adobe.com/resource\thttps://www.adobe.com';
    const incorrect = '/resource\thttps://www.adobe.com';

    selectAllCB.click();
    input.value = correct;
    processButton.click();
    expect(input.classList.contains('error-border')).to.be.false;
    input.value = incorrect;
    processButton.click();
    expect(errorMessage.innerHTML.length > 0).to.be.true;
    expect(input.classList.contains('error-border')).to.be.true;
  });
});
