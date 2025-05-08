import { createTag } from '../../../utils/utils.js';

const INPUT_LABEL_TEXT = 'Paste source and destination URLs here:';
const PROCESS_TEXT = 'Process redirects';
const startingRowId = 0;
const deleteIcon = `<svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 0 18 18" width="18">
  <title>S Delete 18 N</title>
  <path class="fill" d="M15.75,3H12V2a1,1,0,0,0-1-1H6A1,1,0,0,0,5,2V3H1.25A.25.25,0,0,0,1,3.25v.5A.25.25,0,0,0,1.25,4h1L3.4565,16.55a.5.5,0,0,0,.5.45H13.046a.5.5,0,0,0,.5-.45L14.75,4h1A.25.25,0,0,0,16,3.75v-.5A.25.25,0,0,0,15.75,3ZM5.5325,14.5a.5.5,0,0,1-.53245-.46529L5,14.034l-.5355-8a.50112.50112,0,0,1,1-.067l.5355,8a.5.5,0,0,1-.46486.53283ZM9,14a.5.5,0,0,1-1,0V6A.5.5,0,0,1,9,6ZM11,3H6V2h5Zm1,11.034a.50112.50112,0,0,1-1-.067l.5355-8a.50112.50112,0,1,1,1,.067Z" />
</svg>`;
const addIcon = `<svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 0 18 18" width="18">
  <title>S Add 18 N</title>
  <path class="fill" d="M14.5,8H10V3.5A.5.5,0,0,0,9.5,3h-1a.5.5,0,0,0-.5.5V8H3.5a.5.5,0,0,0-.5.5v1a.5.5,0,0,0,.5.5H8v4.5a.5.5,0,0,0,.5.5h1a.5.5,0,0,0,.5-.5V10h4.5a.5.5,0,0,0,.5-.5v-1A.5.5,0,0,0,14.5,8Z" />
</svg>`;

function createSingleInputRow(id) {
  const fromLabel = createTag('label', { for: `source-${id}` }, 'Source URL');
  const fromInput = createTag('input', { class: 'source', type: 'text', id: `source-${id}`, name: `source-${id}` });
  const toLabel = createTag('label', { for: `destination-${id}` }, 'Destination URL');
  const toInput = createTag('input', { class: 'destination', type: 'text', id: `destination-${id}`, name: `destination-${id}` });
  const removeInputButton = createTag('button', { class: 'remove-input', 'data-input-id': id }, deleteIcon);

  const inputContainer = createTag('div', { class: 'input-container' }, [fromLabel, fromInput, toLabel, toInput]);

  removeInputButton.addEventListener('click', () => {
    const removalId = removeInputButton.dataset.inputId;
    const inputsParent = document.querySelector('.single-redirects-container');
    const elementToRemove = inputsParent.querySelector(`.redirect-input-row[data-row-id="${removalId}"]`);
    elementToRemove.remove();
  });

  return createTag('div', { class: 'redirect-input-row', 'data-row-id': id }, [inputContainer, removeInputButton]);
}

export default function createSingleRedirectArea() {
  const singleInput = createSingleInputRow(startingRowId);
  const addInputButton = createTag('button', { class: 'add-input' }, addIcon);
  const addSingleInput = createTag('div', { class: 'single-input-ui' }, addInputButton);

  addSingleInput.addEventListener('click', () => {
    const inputParent = document.querySelector('.single-redirects-container');
    const newRowId = parseInt(inputParent.dataset.nextRowId, 10);

    const newRow = createSingleInputRow(newRowId);
    document.querySelector('.single-redirects-container').insertBefore(newRow, addSingleInput);
    inputParent.dataset.nextRowId = newRowId + 1;
  });

  const singleRedirectsContainer = createTag('section', { class: 'single-redirects-container selected' }, [singleInput, addSingleInput]);
  singleRedirectsContainer.dataset.nextRowId = 1;
  return singleRedirectsContainer;
}

function createBulkRedirectsArea() {
  const textAreaInput = createTag('textarea', { class: 'redirects-text-area', id: 'redirects-input', name: 'redirects-input' });
  const taiLabel = createTag('label', { for: 'redirects-input' }, INPUT_LABEL_TEXT);
  return createTag('section', { class: 'bulk-area bulk-redirects-container' }, [taiLabel, textAreaInput]);
}

export function createRedirectsArea() {
  const selectedClassName = 'selected';
  const singleTab = createTag('button', { class: `single-tab ${selectedClassName}`, 'data-toggles-content': 'single-redirects-container' }, 'Single Redirects');
  const bulkTab = createTag('button', { class: 'bulk-tab', 'data-toggles-content': 'bulk-redirects-container' }, 'Bulk Redirects');
  const htmlLabel = createTag('label', { for: 'add-html' }, 'Add .html to the end of urls');
  const htlmCheckbox = createTag('input', { type: 'checkbox', class: 'add-html', id: 'add-html', name: 'add-html', checked: true });
  const submitButton = createTag('button', { class: 'process-redirects' }, PROCESS_TEXT);
  const tabsHolder = createTag('div', { class: 'redirect-tabs' }, [singleTab, bulkTab, htmlLabel, htlmCheckbox, submitButton]);

  const singleInputArea = createSingleRedirectArea();
  const bulkRedirectArea = createBulkRedirectsArea();

  const uiArea = createTag('div', { class: 'redirects-ui-area' }, [singleInputArea, bulkRedirectArea]);

  tabsHolder.querySelectorAll('button:not(.process-redirects)').forEach((button) => {
    button.addEventListener('click', (e) => {
      const currentButton = e.currentTarget;
      tabsHolder.querySelector(`.${selectedClassName}`).classList.remove(selectedClassName);
      currentButton.classList.add(selectedClassName);
      const areaToShowClass = currentButton.dataset.togglesContent;

      uiArea.querySelector(`section.${selectedClassName}`).classList.remove(selectedClassName);
      uiArea.querySelector(`.${areaToShowClass}`).classList.add(selectedClassName);
    });
  });

  return createTag('section', { class: 'main-redirects-ui-wrapper' }, [tabsHolder, uiArea]);
}
