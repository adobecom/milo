import { createTag } from '../../../utils/utils.js';

export function createGroupings(sheetData) {
  return sheetData.reduce((acc, row) => {
    Object.entries(row).forEach(([key, value]) => {
      if (!acc[key]) {
        acc[key] = [];
      }
      if (value && !acc[key].includes(value)) {
        acc[key].push(value);
      }
    });
    return acc;
  }, {});
}

export function createAllRegionGroup(data) {
  return [...new Set(
    data.flatMap((row) => Object.values(row))
      .filter((value) => value),
  )];
}

function createTabs(tabNames) {
  return tabNames.map((tabKey, idx) => {
    const tabClass = tabKey.replaceAll(' ', '-').toLocaleLowerCase().trim();
    return createTag('button', { class: `${tabClass} checkbox-tab ${idx === 0 ? 'selected' : ''}`, 'data-group-name': tabClass }, tabKey);
  });
}

function createCheckboxGroupNodes(checkboxGroupings) {
  return Object.keys(checkboxGroupings).map((groupKey, idx) => {
    const groupClass = groupKey.replaceAll(' ', '-').toLocaleLowerCase().trim();
    const group = createTag('div', { class: `${groupClass} checkbox-grouping ${idx === 0 ? 'selected' : ''}` });

    const checkboxes = checkboxGroupings[groupKey].map((locale) => {
      const checkbox = createTag('input', { class: 'locale-checkbox', type: 'checkbox', id: `${locale}`, name: `${locale}` });
      const label = createTag('label', { class: 'locale-label', for: `${locale}` }, locale);

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
      checkboxUi.querySelector('.selected').classList.remove('selected');
      clickedTab.classList.add('selected');
      const associatedClass = clickedTab.dataset.groupName;
      const selectedArea = checkboxSelectSection.querySelector('.selected');
      selectedArea.querySelectorAll('input').forEach((checkbox) => {
        checkbox.checked = false;
      });
      selectButton.innerText = SELECT_ALL_REGIONS;
      selectedArea.classList.remove('selected');
      checkboxSelectSection.querySelector(`.${associatedClass}`).classList.add('selected');
    });
  });

  selectButton.addEventListener('click', () => {
    const selectedCheckboxArea = checkboxSelectSection.querySelector('.selected');
    const currentIsSelectAll = selectButton.innerText === SELECT_ALL_REGIONS;

    selectedCheckboxArea.querySelectorAll('input').forEach((checkbox) => {
      checkbox.checked = currentIsSelectAll;
    });

    selectButton.innerText = currentIsSelectAll ? DESELECT_ALL_REGIONS : SELECT_ALL_REGIONS;
  });

  return checkboxComponent;
}
