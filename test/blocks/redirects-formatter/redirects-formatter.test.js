import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';

const {
  default: init,
  NO_LOCALE_ERROR,
} = await import('../../../libs/blocks/redirects-formatter/redirects-formatter.js');
const COPY_TO_CLIPBOARD = 'Copied';

describe('Redirects Formatter', () => {
  const ogFetch = window.fetch;
  let clipboardWriteText;
  let originalClipboard;

  beforeEach(async () => {
    document.body.innerHTML = await readFile({ path: './mocks/redirects-formatter.html' });

    // Store original clipboard
    originalClipboard = Object.getOwnPropertyDescriptor(navigator, 'clipboard');

    // Mock clipboard using Object.defineProperty and return a Promise
    clipboardWriteText = sinon.stub().returns(Promise.resolve());
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: clipboardWriteText },
      configurable: true,
    });

    const block = document.querySelector('.redirects-formatter');

    sinon.stub(window, 'fetch');
    const fetchText = await readFile({ path: './mocks/locale-config.json' });
    const res = new window.Response(fetchText, { status: 200 });
    window.fetch.returns(Promise.resolve(res));

    await init(block);
  });

  afterEach(async () => {
    window.fetch = ogFetch;
    // Restore original clipboard
    if (originalClipboard) {
      Object.defineProperty(navigator, 'clipboard', originalClipboard);
    } else {
      delete navigator.clipboard;
    }
  });

  it('informs the user of an error if no locales are selected', async () => {
    const checkBoxes = document.querySelectorAll('.checkboxes .locale-checkbox');
    expect([...checkBoxes].every((cb) => !cb.checked)).to.be.true;

    const processButton = document.querySelector('.process-redirects');
    const errorMessage = document.querySelector('.error');
    const checkBoxContainer = document.querySelector('.checkboxes-container');
    processButton.click();
    expect(errorMessage.innerHTML).to.equal(NO_LOCALE_ERROR);
    expect(checkBoxContainer.classList.contains('error-border')).to.be.true;
  });

  it('informs the user of an error if an incorrect url is passed in to the input', async () => {
    const bulkTab = document.querySelector('.bulk-redirects-container');
    const bulkTextArea = bulkTab.querySelector('textarea');
    const bulkTabButton = document.querySelector('.bulk-tab');
    const processButton = document.querySelector('.process-redirects');
    const errorMessage = document.querySelector('.error');
    const selectAllCB = document.querySelector('.select-all-container .select');
    const correct = 'https://www.adobe.com/resource\thttps://www.adobe.com';
    const incorrect = '/resource\thttps://www.adobe.com';

    bulkTabButton.click();
    selectAllCB.click();
    bulkTextArea.value = correct;
    processButton.click();
    expect(bulkTab.classList.contains('selected')).to.be.true;
    expect(bulkTab.classList.contains('error-border')).to.be.false;

    bulkTextArea.value = incorrect;
    processButton.click();
    expect(errorMessage.innerHTML.length > 0).to.be.true;
    expect(document.querySelector('.redirects-ui-area .selected.error-border')).to.exist;
  });

  it('copies formatted redirects to clipboard when copy button is clicked', async () => {
    const bulkTab = document.querySelector('.bulk-redirects-container');
    const bulkTextArea = bulkTab.querySelector('textarea');
    const bulkTabButton = document.querySelector('.bulk-tab');
    const processButton = document.querySelector('.process-redirects');
    const selectAllCB = document.querySelector('.select-all-container .select');
    const copyButton = document.querySelector('.copy');
    const testInput = 'https://www.adobe.com/resource\thttps://www.adobe.com';

    bulkTabButton.click();
    selectAllCB.click();
    bulkTextArea.value = testInput;
    processButton.click();
    await copyButton.click();

    expect(clipboardWriteText.called).to.be.true;
    expect(copyButton.innerHTML).to.equal(COPY_TO_CLIPBOARD);
  });
});
