import { createTag } from "../../utils/utils";

function createSingleInputRow(id) {
  const fromLabel = createTag('label', { class: 'redirect-from', for: `redirect-from-${id}` });
  const fromInput = createTag('input', { class: 'redirect-from', type: 'text', id: `redirect-from-${id}`, name: `redirect-from-${id}` });
  const toLabel = createTag('label', { class: 'redirect-to', for: `redirect-to-${id}` });
  const toInput = createTag('input', { class: 'redirect-to', type: 'text', id: `redirect-to-${id}`, name: `redirect-to-${id}` });
  const removeInputButton = createTag('button', { class: 'remove-input', 'data-input-id': id }, '-');

  const inputContainer = createTag('div', { class: 'input-container' }, [fromLabel, fromInput, toLabel, toInput]);

  return createTag('div', { class: 'redirect-input-row' }, [inputContainer, removeInputButton]);
}

function createSingleRedirectArea() {
  const singleInput = createSingleInputRow(0);
  const addInputButton = createTag('button', { class: 'add-input' }, '+');
  const singleInputUi = createTag('div', { class: 'single-input-ui' })

  return createTag('section', { class: 'single-redirect-container' }, singleInput);
}