/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { delay, waitForElement, waitForUpdate } from './waitfor.js';

const asyncSome = async (arr, predicate) => {
  for (const e of arr) {
    if (await predicate(e)) return true;
  }
  return false;
};

/**
 * Find the first field with the given label
 * @param {string} labelStr
 */
export const findByLabel = (labelStr, rootEl = document) => {
  const labelEl = [...rootEl.querySelectorAll('label')].find((el) => el.textContent === labelStr);
  return labelEl ? labelEl.nextElementSibling : null;
};

/**
 * Find the first field with the given heading
 * @param {string} headStr
 */
export const findByHeading = (headStr, rootEl = document) => {
  const labelEl = [...rootEl.querySelectorAll('h1, h2, h3, h4, h5, h6')].find((el) => el.textContent === headStr);
  return labelEl.nextElementSibling;
};

/**
 * Open a single select tag dropdown and select the choice
 * @param {string} label - Field Label to select
 * @param {string} choice - Value to choose
 * @returns
 */
export const tagSelectorDropdownChoose = async (label, choice) => {
  const selectEl = findByLabel(label);
  if (!selectEl) return;

  selectEl.click();
  await waitForElement('.tagselect-dropdown', { rootEl: selectEl.parentElement });

  const dropdownEl = selectEl.nextElementSibling;
  if (!dropdownEl) return;

  const options = [...dropdownEl.querySelectorAll('.tagselect-dropdown-item:not(.hide)')];
  const optionEl = options.find((option) => option.textContent === choice);
  if (!optionEl) return;

  // select the tag
  optionEl.click();

  // close the dropdown
  selectEl.click();

  await waitForElement('.tagselect-tag-text', {
    rootEl: selectEl.parentElement,
    textContent: choice,
  });

  // need to wait for preact to finish updating
  await delay(50);
};

const tagSelectorModalSelectItem = async (label, choices = []) => {
  const selectEl = findByLabel(label);
  if (!selectEl) return;

  selectEl.click();
  const modalEl = await waitForElement('.tagselect-modal-overlay');

  const columnsEl = modalEl.querySelector('.tagselect-modal-cols');
  await waitForUpdate(columnsEl);

  const selectItem = async (choice, idx, selectCheckbox = false) => {
    await waitForElement(`.tagselect-modal-cols .col:nth-child(${idx + 1})`, {
      rootEl: modalEl,
      options: { subtree: true, characterData: true, childList: true },
    });
    const columns = [...columnsEl.querySelectorAll('.col')];

    const choiceFound = await asyncSome(
      [...columns[idx].querySelectorAll('.tagselect-item')],
      async (itemEl) => {
        if (itemEl.textContent === choice) {
          if (selectCheckbox) {
            itemEl.querySelector('input[type="checkbox"]').click();
          } else {
            itemEl.click();
            await waitForUpdate(columnsEl);
          }
          return true;
        }
        return false;
      },
    );

    return choiceFound;
  };

  choices.forEach(async (choice, i) => {
    const selectCheckbox = i === choices.length - 1;
    const choiceFound = await selectItem(choices[i], i, selectCheckbox);
    if (!choiceFound) {
      console.warn('tagSelectorModalChoose: Unable to find label:', choices[i]);
    }
  });
  modalEl.querySelector('.tagselect-modal-close').click();
  await delay(50);
};

export const tagSelectorModalChoose = async (label, choices = []) => {
  for (const choiceArr of choices) {
    await tagSelectorModalSelectItem(label, choiceArr);
  }
};
