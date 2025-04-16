import { createTag } from '../../../utils/utils.js';

const INPUT_LABEL_TEXT = 'Paste source and destination URLs here:';
const PROCESS_TEXT = 'Process redirects';

function createSingleInputRow(id) {
  const fromLabel = createTag('label', { for: `source-${id}` }, 'Source URL');
  const fromInput = createTag('input', { class: 'source', type: 'text', id: `source-${id}`, name: `source-${id}` });
  const toLabel = createTag('label', { for: `destination-${id}` }, 'Destination URL');
  const toInput = createTag('input', { class: 'destination', type: 'text', id: `destination-${id}`, name: `destination-${id}` });
  const removeInputButton = createTag('button', { class: 'remove-input', 'data-input-id': id }, '-');

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
  const singleInput = createSingleInputRow(0);
  const addInputButton = createTag('button', { class: 'add-input' }, '+');
  const singleInputUi = createTag('div', { class: 'single-input-ui' }, addInputButton);

  singleInputUi.addEventListener('click', () => {
    const currentRows = document.querySelectorAll('.redirect-input-row');
    const numRows = currentRows.length;
    const lastRowId = currentRows[numRows - 1].dataset.rowId;
    const newRowId = parseInt(lastRowId, 10) + 1;
    const newRow = createSingleInputRow(newRowId);
    document.querySelector('.single-redirects-container').insertBefore(newRow, singleInputUi);
  });

  return createTag('section', { class: 'single-redirects-container selected' }, [singleInput, singleInputUi]);
}

function createBulkRedirectsArea() {
  const textAreaInput = createTag('textarea', { class: 'redirects-text-area', id: 'redirects-input', name: 'redirects-input' });
  const taiLabel = createTag('label', { class: 'io-label', for: 'redirects-input' }, INPUT_LABEL_TEXT);
  return createTag('section', { class: 'bulk-area bulk-redirects-container' }, [taiLabel, textAreaInput]);
}

export function createRedirectsArea() {
  const selectedClassName = 'selected';
  const singleTab = createTag('button', { class: `single-tab ${selectedClassName}`, 'data-toggles-content': 'single-redirects-container' }, 'Single Redirects');
  const bulkTab = createTag('button', { class: 'bulk-tab', 'data-toggles-content': 'bulk-redirects-container' }, 'Bulk Redirects');
  const submitButton = createTag('button', { class: 'process-redirects' }, PROCESS_TEXT);
  const tabsHolder = createTag('div', { class: 'redirect-tabs' }, [singleTab, bulkTab, submitButton]);

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
