import { createCheckboxArea } from './utils/checkboxes.js';
import { createRedirectsList, getLocalesFromUi, processRedirects } from './utils/process-redirects.js';
import { createRedirectsArea } from './utils/redirect-inputs.js';

export const NO_LOCALE_ERROR = 'No locales selected from list';
const OUTPUT_LABEL_TEXT = 'Localized results appear here:';
const COPY_TO_CLIPBOARD = 'Copy to clipboard';
const INSTRUCTIONS_TEXT = 'Select the locales you require by checking the checkboxes. Paste URLs copied from an excel sheet'
  + ' into the first input. Press "Process Redirects" to generate localized URLs to paste into redirects.xlsx. To copy your URLS,'
  + ' press "Copy to clipboard" or select them with the cursor manually.';

export function parseUrlString(input) {
  const pairs = input.split('\n');

  return pairs.reduce((rdx, pairString) => {
    const pair = pairString.split(/\t| /);
    rdx.push(pair);
    return rdx;
  }, []);
}

function handleError(e, eSection) {
  const errorElem = document.querySelector('.error');
  setTimeout(() => {
    errorElem.innerText = '';
    eSection.classList.remove('error-border');
  }, 2000);
  errorElem.innerText = e;
  eSection.classList.add('error-border');
}

export function stringifyListForExcel(urls) {
  return urls.reduce((rdx, url) => `${rdx}${url[0]}\t${url[1]}\n`, '');
}

export default async function init(el) {
  const { createTag } = await import('../../utils/utils.js');
  const xlPath = './locale-config.json';
  const resp = await fetch(xlPath);
  if (!resp.ok) return;
  const { data } = await resp.json();

  const redirectsContainer = createTag('section', { class: 'redirects-container' });
  const header = createTag('h1', null, 'Redirect Formatting Tool');
  const instructions = createTag('p', { class: 'instructions' }, INSTRUCTIONS_TEXT);
  const errorSection = createTag('p', { class: 'error' });

  // Checkboxes
  const checkBoxesHeader = createTag('p', { class: 'cb-label' });
  checkBoxesHeader.innerText = 'Select Locales';
  const checkBoxes = await createCheckboxArea(data);

  // Text input area
  const singleInputArea = createRedirectsArea();

  // Text output Area
  const textAreaOutput = createTag('textarea', { class: 'redirects-text-area', id: 'redirects-output', name: 'redirects-output', readonly: true });
  const taoLabel = createTag('label', { class: 'io-label', for: 'redirects-output' }, OUTPUT_LABEL_TEXT);
  const copyButton = createTag('button', { class: 'copy' }, COPY_TO_CLIPBOARD);
  const outputUiWrapper = createTag('div', {}, [taoLabel, copyButton]);
  const outputAreaContainer = createTag('section', { class: 'output-container' }, [outputUiWrapper, textAreaOutput]);

  // Create the DOM
  redirectsContainer.append(checkBoxes, singleInputArea, outputAreaContainer);
  el.append(header, instructions, errorSection, redirectsContainer);

  document.querySelector('.process-redirects').addEventListener('click', () => {
    const checkboxesList = checkBoxes.querySelectorAll('input[type="checkbox"]');
    const locales = getLocalesFromUi(checkboxesList);
    const activeInput = document.querySelector('.redirects-ui-area .selected');
    const redirectsList = createRedirectsList(activeInput);
    console.log(redirectsList);

    if (!locales.length) {
      handleError(NO_LOCALE_ERROR, checkBoxes);
      return;
    }

    if (redirectsList[0]?.source === '') {
      handleError('Input is empty', activeInput);
      return;
    }

    const processedList = processRedirects(redirectsList, locales, () => {
      const message = 'Please use full urls in the inputs: https://www.adobe.com/x/y/z';
      handleError(message, activeInput);
    });
    const outputString = stringifyListForExcel(processedList);

    textAreaOutput.value = outputString;
  });

  copyButton.addEventListener('click', () => {
    if (!navigator?.clipboard) return;
    const redirects = textAreaOutput.value;
    navigator.clipboard.writeText(redirects).then(
      () => {
        copyButton.innerText = 'Copied';
        setTimeout(() => {
          copyButton.innerText = COPY_TO_CLIPBOARD;
        }, 1500);
      },
      () => {
        copyButton.innerText = 'Error!';
        setTimeout(() => {
          copyButton.innerText = COPY_TO_CLIPBOARD;
        }, 1500);
      },
    );
  });
}
