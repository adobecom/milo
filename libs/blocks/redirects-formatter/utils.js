const INPUT_LABEL_TEXT = 'Paste source and destination URLs here:';
const PROCESS_TEXT = 'Process redirects';
export const NO_LOCALE_ERROR = 'No locales selected from list';

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

export function createSingleInput(createTag, index) {
  const fromInput = createTag('input', { type: 'text', name: `from-input-${index}`, id: `from-input-${index}` });
  const fromLabel = createTag('label', { for: `from-input-${index}`});
  const toInput = createTag('input', { type: 'text', name: `to-input-${index}`, id: `to-input-${index}` });
  const toLabel = createTag('label', { for: `to-input-${index}`});
  return createTag('div', { class: 'single-input-container' }, [fromLabel, fromInput, toLabel, toInput]);
}

export function createSingleTabsUi(parentContainer, createTag) {
  const singleInput = createSingleInput(createTag, 0);
  const singleInputContainer = createTag('section', { class: 'single-input-container' }, singleInput);
  parentContainer.append(singleInputContainer);
  return parentContainer;
}

export function createMultiTabsUi(parentContainer, createTag, textOutput) {
  // Text input area
  const inputAreaContainer = createTag('section', { class: 'input-container' });
  const textAreaInput = createTag('textarea', { class: 'redirects-text-area', id: 'redirects-input', name: 'redirects-input' });
  const taiLabel = createTag('label', { class: 'io-label', for: 'redirects-input' }, INPUT_LABEL_TEXT);
  const submitButton = createTag('button', { class: 'process-redirects' }, PROCESS_TEXT);
  inputAreaContainer.append(taiLabel, submitButton, textAreaInput);

  parentContainer.append(inputAreaContainer);
  return parentContainer;
}
