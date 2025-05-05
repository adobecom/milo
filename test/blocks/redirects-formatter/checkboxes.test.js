import { expect } from '@esm-bundle/chai';
import { createGroupings, createAllRegionGroup, createCheckboxArea } from '../../../libs/blocks/redirects-formatter/utils/checkboxes.js';

describe('Checkbox Formatting', () => {
  it('should format sheet data correctly', () => {
    const sheetData = [
      { Key1: 'Value1', Key2: 'Value2' },
      { Key1: 'Value3', Key2: 'Value4' },
      { Key1: 'Value1', Key2: 'Value2' },
    ];

    const formattedData = createGroupings(sheetData);

    expect(formattedData).to.deep.equal({
      Key1: ['Value1', 'Value3'],
      Key2: ['Value2', 'Value4'],
    });
  });

  it('should create all region group correctly', () => {
    const sheetData = [
      { Key1: 'Value1', Key2: 'Value2' },
      { Key1: 'Value3', Key2: 'Value4' },
      { Key1: 'Value1', Key2: 'Value2' },
    ];

    const allRegionGroup = createAllRegionGroup(sheetData);

    expect(allRegionGroup).to.deep.equal(['Value1', 'Value2', 'Value3', 'Value4']);
  });
});

const testData = [
  {
    English: 'ae_en',
    Translated: 'ae_ar',
    'Tier 1': 'jp',
    'Tier 2': 'es',
    'Tier 3': 'au',
    'Tier 4': 'ae_ar',
  },
  {
    English: 'africa_en',
    Translated: 'ar_es',
    'Tier 1': 'de',
    'Tier 2': 'fi',
    'Tier 3': 'br',
    'Tier 4': 'ae_en',
  },
  {
    English: 'au_en',
    Translated: 'at_de',
    'Tier 1': 'fr',
    'Tier 2': 'dk',
    'Tier 3': 'cn',
    'Tier 4': 'africa_en',
  },
  {
    English: 'be_en',
    Translated: 'be_fr',
    'Tier 1': 'uk',
    'Tier 2': 'it',
    'Tier 3': 'kr',
    'Tier 4': 'ar_es',
  },
  {
    English: 'ca_en',
    Translated: 'be_nl',
    'Tier 1': '',
    'Tier 2': 'nl',
    'Tier 3': 'la',
    'Tier 4': 'at_de',
  },
  {
    English: 'cis_en',
    Translated: 'bg_bg',
    'Tier 1': '',
    'Tier 2': 'se',
    'Tier 3': 'mx',
    'Tier 4': 'be_en',
  },
];

describe('Checkbox Area Component', () => {
  let checkboxComponent;

  beforeEach(() => {
    checkboxComponent = createCheckboxArea(testData);
    document.body.appendChild(checkboxComponent);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('creates the correct DOM structure', async () => {
    // Main container checks
    expect(checkboxComponent.tagName.toLowerCase()).to.equal('section');
    expect(checkboxComponent.classList.contains('checkboxes-container')).to.be.true;

    // UI section checks
    const checkboxUi = checkboxComponent.querySelector('.checkbox-ui');
    expect(checkboxUi).to.exist;

    // Tab checks
    const tabs = [...checkboxUi.querySelectorAll('.checkbox-tab')];
    const expectedTabs = ['English', 'Translated', 'Tier 1', 'Tier 2', 'Tier 3', 'Tier 4', 'All'];
    expect(tabs).to.have.length(expectedTabs.length);

    tabs.forEach((tab, index) => {
      expect(tab.textContent).to.equal(expectedTabs[index]);
      if (index === 0) {
        expect(tab.classList.contains('selected')).to.be.true;
      }
    });

    // Select all button checks
    const selectButton = checkboxUi.querySelector('.select');
    expect(selectButton).to.exist;
    expect(selectButton.textContent).to.equal('select all');

    // Checkbox groups checks
    const checkboxGroups = checkboxComponent.querySelectorAll('.checkbox-grouping');
    expect(checkboxGroups).to.have.length(expectedTabs.length);

    // English group content checks
    const englishGroup = checkboxGroups[0];
    expect(englishGroup.classList.contains('selected')).to.be.true;

    const englishCheckboxes = englishGroup.querySelectorAll('.locale-checkbox');
    const expectedEnglishValues = ['English-ae_en', 'English-africa_en', 'English-au_en', 'English-be_en', 'English-ca_en', 'English-cis_en'];
    expect(englishCheckboxes).to.have.length(expectedEnglishValues.length);

    englishCheckboxes.forEach((checkbox, index) => {
      expect(checkbox.id).to.equal(expectedEnglishValues[index]);
    });
  });

  it('handles tab switching correctly', async () => {
    const tabs = checkboxComponent.querySelectorAll('.checkbox-tab');
    const secondTab = tabs[1]; // Translated tab

    // Click second tab
    secondTab.click();

    // Check tab selection
    expect(secondTab.classList.contains('selected')).to.be.true;
    expect(tabs[0].classList.contains('selected')).to.be.false;

    // Check group visibility
    const groups = checkboxComponent.querySelectorAll('.checkbox-grouping');
    expect(groups[1].classList.contains('selected')).to.be.true;
    expect(groups[0].classList.contains('selected')).to.be.false;
  });

  it('handles tab switching correctly', async () => {
    const tabs = checkboxComponent.querySelectorAll('.checkbox-tab');
    const secondTab = tabs[1]; // Translated tab

    // Click second tab
    secondTab.click();

    // Check tab selection
    expect(secondTab.classList.contains('selected')).to.be.true;
    expect(tabs[0].classList.contains('selected')).to.be.false;

    // Check group visibility
    const groups = checkboxComponent.querySelectorAll('.checkbox-grouping');
    expect(groups[1].classList.contains('selected')).to.be.true;
    expect(groups[0].classList.contains('selected')).to.be.false;
  });

  it('handles select all functionality correctly', async () => {
    const selectButton = checkboxComponent.querySelector('.select');
    const firstGroup = checkboxComponent.querySelector('.checkbox-grouping.selected');
    const checkboxes = firstGroup.querySelectorAll('input[type="checkbox"]');

    // Test select all
    selectButton.click();

    checkboxes.forEach((checkbox) => {
      expect(checkbox.checked).to.be.true;
    });
    expect(selectButton.textContent).to.equal('remove all');

    // Test deselect all
    selectButton.click();

    checkboxes.forEach((checkbox) => {
      expect(checkbox.checked).to.be.false;
    });
    expect(selectButton.textContent).to.equal('select all');
  });

  it('unchecks all checkboxes when switching tabs', async () => {
    const selectButton = checkboxComponent.querySelector('.select');
    const tabs = checkboxComponent.querySelectorAll('.checkbox-tab');
    const firstTab = tabs[0]; // English tab
    const secondTab = tabs[1]; // Translated tab

    // Select all checkboxes in first tab
    selectButton.click();
    const firstGroupCheckboxes = checkboxComponent.querySelector('.checkbox-grouping.selected')
      .querySelectorAll('input[type="checkbox"]');
    firstGroupCheckboxes.forEach((checkbox) => {
      expect(checkbox.checked).to.be.true;
    });

    // Switch to second tab
    secondTab.click();

    // Verify tab selection
    expect(secondTab.classList.contains('selected')).to.be.true;
    expect(firstTab.classList.contains('selected')).to.be.false;

    // Verify group visibility
    const groups = checkboxComponent.querySelectorAll('.checkbox-grouping');
    expect(groups[1].classList.contains('selected')).to.be.true;
    expect(groups[0].classList.contains('selected')).to.be.false;

    // Verify all checkboxes in first tab are now unchecked
    firstGroupCheckboxes.forEach((checkbox) => {
      expect(checkbox.checked).to.be.false;
    });

    // Verify all checkboxes in second tab are unchecked
    const secondGroupCheckboxes = groups[1].querySelectorAll('input[type="checkbox"]');
    secondGroupCheckboxes.forEach((checkbox) => {
      expect(checkbox.checked).to.be.false;
    });

    // Verify select button text is reset
    expect(selectButton.textContent).to.equal('select all');
  });
});
