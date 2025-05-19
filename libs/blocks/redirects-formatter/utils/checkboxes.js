import { createTag } from '../../../utils/utils.js';

const selectedClassName = 'selected';

export function createGroupings(sheetData) {
  return sheetData.reduce((rdx, row) => {
    Object.entries(row).forEach(([groupName, locale]) => {
      if (!rdx[groupName]) {
        rdx[groupName] = [];
      }
      if (locale && !rdx[groupName].includes(locale)) {
        rdx[groupName].push(locale);
      }
    });
    return rdx;
  }, {});
}

export function createAllRegionGroup(sheetData) {
  return [...new Set(
    sheetData.flatMap((row) => Object.values(row))
      .filter((locale) => locale),
  )];
}

function createTabs(tabNames) {
  return tabNames.map((tabKey, idx) => {
    const tabClass = tabKey.replaceAll(' ', '-').toLocaleLowerCase().trim();
    return createTag('button', { class: `${tabClass} checkbox-tab ${idx === 0 ? selectedClassName : ''}`, 'data-group-name': tabClass }, tabKey);
  });
}

function createCheckboxGroupNodes(checkboxGroupings) {
  return Object.keys(checkboxGroupings).map((groupKey, idx) => {
    const groupClass = groupKey.replaceAll(' ', '-').toLocaleLowerCase().trim();
    const group = createTag('div', { class: `${groupClass} checkbox-grouping ${idx === 0 ? selectedClassName : ''}` });

    const checkboxes = checkboxGroupings[groupKey].map((locale) => {
      const checkbox = createTag('input', {
        class: 'locale-checkbox',
        type: 'checkbox',
        id: `${groupKey}-${locale}`,
        name: `${groupKey}-${locale}`,
        value: `${locale}`,
      });
      const label = createTag('label', { class: 'locale-label', for: `${groupKey}-${locale}` }, locale);

      return createTag('div', { class: 'checkbox-wrapper' }, [checkbox, label]);
    });

    group.append(...checkboxes);
    return group;
  });
}

export function createCheckboxArea(data) {
  const checkboxComponent = createTag('section', { class: 'checkboxes-container' });
  const checkboxSelectSection = createTag('div', { class: 'checkboxes' });
  const groupings = createGroupings(data);
  const allGroup = createAllRegionGroup(data);
  groupings.All = allGroup;
  const tabKeys = Object.keys(groupings);

  // Create tabs and select UI
  const tabs = createTabs(tabKeys);
  const tabHolder = createTag('div', { class: 'tabs' }, [...tabs]);
  const SELECT_ALL_REGIONS = 'select all';
  const DESELECT_ALL_REGIONS = 'remove all';
  const selectButton = createTag('button', { class: 'select' }, SELECT_ALL_REGIONS);
  const selectAllContainer = createTag('div', { class: 'select-all-container' }, selectButton);
  const checkboxUi = createTag('div', { class: 'checkbox-ui' }, [tabHolder, selectAllContainer]);

  // Create group nodes and populate with checkboxes
  const groupNodes = createCheckboxGroupNodes(groupings);
  checkboxSelectSection.append(...groupNodes);
  checkboxComponent.append(checkboxUi, checkboxSelectSection);

  // Event Listeners
  checkboxUi.querySelectorAll('.checkbox-tab').forEach((clickedTab) => {
    clickedTab.addEventListener('click', () => {
      checkboxUi.querySelector(`.${selectedClassName}`).classList.remove(selectedClassName);
      clickedTab.classList.add(selectedClassName);
      const associatedClass = clickedTab.dataset.groupName;
      const selectedArea = checkboxSelectSection.querySelector(`.${selectedClassName}`);
      selectedArea.querySelectorAll('input').forEach((checkbox) => {
        checkbox.checked = false;
      });
      selectButton.innerText = SELECT_ALL_REGIONS;
      selectedArea.classList.remove(selectedClassName);
      checkboxSelectSection.querySelector(`.${associatedClass}`).classList.add(selectedClassName);
    });
  });

  selectButton.addEventListener('click', () => {
    const selectedCheckboxArea = checkboxSelectSection.querySelector(`.${selectedClassName}`);
    const currentIsSelectAll = selectButton.innerText === SELECT_ALL_REGIONS;

    selectedCheckboxArea.querySelectorAll('input').forEach((checkbox) => {
      checkbox.checked = currentIsSelectAll;
    });

    selectButton.innerText = currentIsSelectAll ? DESELECT_ALL_REGIONS : SELECT_ALL_REGIONS;
  });

  return checkboxComponent;
}
