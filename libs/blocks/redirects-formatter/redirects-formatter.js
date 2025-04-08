import { createSingleInput,
  createSingleTabsUi,
  createMultiTabsUi,
  parseUrlString,
  generateRedirectList,
} from './utils.js';

export const SELECT_ALL_REGIONS = 'Select All Regions';
export const DESELECT_ALL_REGIONS = 'De-select All Regions';
const OUTPUT_LABEL_TEXT = 'Localized results appear here:';
const COPY_TO_CLIPBOARD = 'Copy to clipboard';
const INSTRUCTIONS_TEXT = 'Select the locales you require by checking the checkboxes. Paste URLs copied from an excel sheet'
  + ' into the first input. Press "Process Redirects" to generate localized URLs to paste into redirects.xlsx. To copy your URLS,'
  + ' press "Copy to clipboard" or select them with the cursor manually.';

async function createLocaleCheckboxes(prefixGroup) {
  const { createTag } = await import('../../utils/utils.js');

  return Object.keys(prefixGroup).map((key) => {
    const { prefix } = prefixGroup[key];
    const currLocale = prefix === '' ? 'en' : prefix;
    if (currLocale === 'langstore') return undefined;
    const checkbox = createTag('input', { class: 'locale-checkbox', type: 'checkbox', id: `${currLocale}`, name: `${currLocale}` });
    const label = createTag('label', { class: 'locale-label', for: `${currLocale}` }, currLocale);

    return createTag('div', { class: 'checkbox-wrapper' }, [checkbox, label]);
  });
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

  // Tabs 
  const singleTab = createTag('p', { class: 'single-tab' }, 'Single redirects');
  const multiTab = createTag('p', { class: 'multi-tab' }, 'Multiple redirects');
  const singleTabContent = createTag('section', { class: 'single-tab-content' });
  const multiTabContent = createTag('section', { class: 'multi-tab-content' });

  // Checkboxes
  const checkBoxesHeader = createTag('p', { class: 'cb-label' });
  checkBoxesHeader.innerText = 'Select Locales';
  const checkBoxes = await createLocaleCheckboxes(data);
  const checkBoxesContainer = createTag('div', { class: 'checkbox-container' }, checkBoxes);
  const selectAllCB = createTag('button', { class: 'select-all-cb' }, SELECT_ALL_REGIONS);
  const checkBoxesArea = createTag('section', { class: 'cb-area' }, [checkBoxesHeader, selectAllCB, checkBoxesContainer]);

  // Text output Area
  const outputAreaContainer = createTag('section', { class: 'output-container' });
  const textAreaOutput = createTag('textarea', { class: 'redirects-text-area', id: 'redirects-output', name: 'redirects-output', readonly: true });
  const taoLabel = createTag('label', { class: 'io-label', for: 'redirects-output' }, OUTPUT_LABEL_TEXT);
  const copyButton = createTag('button', { class: 'copy' }, COPY_TO_CLIPBOARD);
  outputAreaContainer.append(taoLabel, copyButton, textAreaOutput);

  // Areas
  const multiTabsUi = createMultiTabsUi(multiTabContent, createTag, textAreaOutput);
  const singleTabsUi = createSingleTabsUi(singleTabContent, createTag);

  redirectsContainer.append(checkBoxesArea, singleTab, singleTabsUi, multiTab, multiTabsUi, outputAreaContainer);
  el.append(header, instructions, errorSection, redirectsContainer);

  // Event listeners
  selectAllCB.addEventListener('click', () => {
    const allNotSelected = selectAllCB.innerText === SELECT_ALL_REGIONS;

    document.querySelectorAll('.locale-checkbox').forEach((cb) => {
      cb.checked = allNotSelected;
    });

    selectAllCB.innerText = allNotSelected ? DESELECT_ALL_REGIONS : SELECT_ALL_REGIONS;
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

  document.querySelector('.process-redirects').addEventListener('click', () => {
    const locales = [...document.querySelectorAll("[type='checkbox']")].reduce((rdx, cb) => {
      if (cb.checked) {
        rdx.push(cb.id);
      }
      return rdx;
    }, []);

    const textAreaInput = document.querySelector('.redirects-text-area');
    const parsedInput = parseUrlString(textAreaInput.value);
    const redirList = generateRedirectList(parsedInput, locales);
    const outputString = stringifyListForExcel(redirList);

    textAreaOutput.value = outputString;
  });
}
