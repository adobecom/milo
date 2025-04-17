import { createCheckboxArea } from './utils/checkboxes.js';
import { createRedirectsList, getLocalesFromUi, processRedirects } from './utils/process-redirects.js';
import { createRedirectsArea } from './utils/redirect-inputs.js';

export const NO_LOCALE_ERROR = 'No locales selected from list';
const EMPTY_INPUT_ERROR = 'Please input a URl to process';
const CORRECT_URL_ERROR = 'Please use full urls in the inputs: https://www.adobe.com/x/y/z';
const OUTPUT_LABEL_TEXT = 'Localized results appear here:';
const COPY_TO_CLIPBOARD = 'Copy to clipboard';

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

  const localeConfigPath = './locale-config.json';
  const resp = await fetch(localeConfigPath);
  if (!resp.ok) return;
  const { data } = await resp.json();

  const redirectsContainer = createTag('section', { class: 'redirects-container' });
  const errorSection = createTag('p', { class: 'error' });

  // Checkboxes
  const checkBoxesHeader = createTag('p', { class: 'cb-label' });
  checkBoxesHeader.innerText = 'Select Locales';
  const checkBoxes = await createCheckboxArea(data);

  // Text input area
  const singleInputArea = createRedirectsArea();

  // Text output Area
  const textAreaOutput = createTag('textarea', { class: 'redirects-text-area', id: 'redirects-output', name: 'redirects-output', readonly: true });
  const taoLabel = createTag('label', { for: 'redirects-output' }, OUTPUT_LABEL_TEXT);
  const copyButton = createTag('button', { class: 'copy' }, COPY_TO_CLIPBOARD);
  const outputUiWrapper = createTag('div', {}, [taoLabel, copyButton]);
  const outputAreaContainer = createTag('section', { class: 'output-container' }, [outputUiWrapper, textAreaOutput]);

  // Create the DOM
  redirectsContainer.append(checkBoxes, singleInputArea, outputAreaContainer);
  el.append(errorSection, redirectsContainer);

  // Event Listeners
  document.querySelector('.process-redirects').addEventListener('click', () => {
    const checkboxesList = checkBoxes.querySelectorAll('input[type="checkbox"]');
    const locales = getLocalesFromUi(checkboxesList);
    const activeInput = document.querySelector('.redirects-ui-area .selected');
    const redirectsList = createRedirectsList(activeInput);

    if (!locales.length) {
      handleError(NO_LOCALE_ERROR, checkBoxes);
      return;
    }

    if (redirectsList[0]?.source === '') {
      handleError(EMPTY_INPUT_ERROR, activeInput);
      return;
    }

    const processedList = processRedirects(redirectsList, locales, () => {
      handleError(CORRECT_URL_ERROR, activeInput);
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
