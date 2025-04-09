import { createCheckboxArea} from './utils/checkboxes.js';

export const NO_LOCALE_ERROR = 'No locales selected from list';
const INPUT_LABEL_TEXT = 'Paste source and destination URLs here:';
const OUTPUT_LABEL_TEXT = 'Localized results appear here:';
const PROCESS_TEXT = 'Process redirects';
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

export function generateRedirectList(urls, locales) {
  const inputSection = document.querySelector('.redirects-text-area');
  const checkboxSection = document.querySelector('.checkbox-container');
  const errorMessage = 'Invalid URL. URLs must start with "https://" e.g: "https://business.adobe.com"';

  return urls.reduce((rdx, urlPair) => {
    if (!locales.length) handleError(NO_LOCALE_ERROR, checkboxSection);

    locales.forEach((locale) => {
      let from;
      let to;
      try {
        from = new URL(urlPair[0]);
      } catch (e) {
        handleError(errorMessage, inputSection);
        return;
      }
      try {
        to = new URL(urlPair[1]);
      } catch (e) {
        handleError(errorMessage, inputSection);
        return;
      }
      const fromPath = from.pathname.split('.html')[0];
      const toPath = () => {
        const excludeHTMLPaths = ['/blog', '.html'];
        if (!to.origin.endsWith('.adobe.com') || excludeHTMLPaths.some((p) => to.pathname.includes(p)) || to.pathname === '/') {
          return to.pathname;
        }
        return `${to.pathname}.html`;
      };
      rdx.push([`/${locale}${fromPath}`, `${to.origin}/${locale}${toPath()}`]);
    });
    return rdx;
  }, []);
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
  const inputAreaContainer = createTag('section', { class: 'input-container' });
  const textAreaInput = createTag('textarea', { class: 'redirects-text-area', id: 'redirects-input', name: 'redirects-input' });
  const taiLabel = createTag('label', { class: 'io-label', for: 'redirects-input' }, INPUT_LABEL_TEXT);
  const submitButton = createTag('button', { class: 'process-redirects' }, PROCESS_TEXT);
  inputAreaContainer.append(taiLabel, submitButton, textAreaInput);

  // Text output Area
  const outputAreaContainer = createTag('section', { class: 'output-container' });
  const textAreaOutput = createTag('textarea', { class: 'redirects-text-area', id: 'redirects-output', name: 'redirects-output', readonly: true });
  const taoLabel = createTag('label', { class: 'io-label', for: 'redirects-output' }, OUTPUT_LABEL_TEXT);
  const copyButton = createTag('button', { class: 'copy' }, COPY_TO_CLIPBOARD);
  outputAreaContainer.append(taoLabel, copyButton, textAreaOutput);

  submitButton.addEventListener('click', () => {
    const locales = [...document.querySelectorAll("[type='checkbox']")].reduce((rdx, cb) => {
      if (cb.checked) {
        rdx.push(cb.id);
      }
      return rdx;
    }, []);

    const parsedInput = parseUrlString(textAreaInput.value);
    const redirList = generateRedirectList(parsedInput, locales);
    const outputString = stringifyListForExcel(redirList);

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

  redirectsContainer.append(checkBoxes, inputAreaContainer, outputAreaContainer);
  el.append(header, instructions, errorSection, redirectsContainer);
}
