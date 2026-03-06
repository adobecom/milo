import { createTag, loadBlock, getConfig } from '../../utils/utils.js';
import { initService, getOptions, getMasBase } from '../merch/merch.js';

const AUTOBLOCK_TIMEOUT = 5000;

function kebabToCamel(str) {
  return str.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

function normalizeFields(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  return Object.entries(obj).reduce((acc, [key, val]) => {
    acc[kebabToCamel(key)] = val;
    return acc;
  }, {});
}

function normalizeData(data) {
  if (data.fields) data.fields = normalizeFields(data.fields);
  if (data.references) {
    for (const [id, ref] of Object.entries(data.references)) {
      if (ref?.value?.fields) {
        ref.value.fields = normalizeFields(ref.value.fields);
      }
    }
  }
  return data;
}

function getTimeoutPromise() {
  return new Promise((resolve) => {
    setTimeout(() => resolve('timeout'), AUTOBLOCK_TIMEOUT);
  });
}

function resolveRef(id, references) {
  return references[id]?.value;
}

function renderCellValue(fields) {
  const { type } = fields;
  if (type === 'boolean') {
    return fields.booleanValue
      ? '<span class="icon icon-checkmark"></span>'
      : '';
  }
  if (type === 'number') return String(fields.numberValue ?? '');
  if (type === 'text') return fields.textValue || '';
  return '';
}

/**
 * Renders a card field into a column header cell.
 * Inserts `-` separator paragraphs between header sub-sections
 * so comparison-table.js can split into sub-header-item-containers.
 *
 * Sub-sections: [title+icon] - [price] - [description+CTAs]
 */
const PRICE_FIELDS = new Set(['prices']);
const TITLE_FIELDS = new Set(['cardTitle', 'subtitle', 'mnemonicIcon']);
const CTA_FIELDS = new Set(['ctas']);

/**
 * Transforms card CTA HTML into comparison-table button format.
 * Card CTAs use class="accent" / class="primary-outline" but
 * comparison-table expects <strong><a> for accent, <em><a> for secondary.
 */
function transformCtaHtml(html) {
  const temp = document.createElement('div');
  temp.innerHTML = html;
  const links = temp.querySelectorAll('a');
  const parts = [];
  links.forEach((a) => {
    const isAccent = a.classList.contains('accent');
    const wrapper = isAccent ? 'strong' : 'em';
    a.removeAttribute('class');
    parts.push(`<p><${wrapper}>${a.outerHTML}</${wrapper}></p>`);
  });
  return parts.join('');
}

function renderColumnHeader(displayFields, cardFields) {
  const titleParts = [];
  const priceParts = [];
  const descParts = [];

  for (const fieldName of displayFields) {
    const fieldValue = cardFields[fieldName];
    if (fieldValue === undefined || fieldValue === null) continue;

    let html;
    if (fieldName === 'mnemonicIcon') {
      const urls = Array.isArray(fieldValue) ? fieldValue : [fieldValue];
      html = urls.filter(Boolean).map((url) => `<img src="${url}" alt="" />`).join('');
    } else if (fieldName === 'cardTitle') {
      html = `<h2>${fieldValue}</h2>`;
    } else if (CTA_FIELDS.has(fieldName)) {
      if (!fieldValue?.value) continue;
      html = transformCtaHtml(fieldValue.value);
    } else if (fieldValue?.mimeType === 'text/html') {
      if (!fieldValue.value) continue;
      html = fieldValue.value;
    } else if (typeof fieldValue === 'string') {
      html = `<p>${fieldValue}</p>`;
    } else continue;

    if (TITLE_FIELDS.has(fieldName)) titleParts.push(html);
    else if (PRICE_FIELDS.has(fieldName)) priceParts.push(html);
    else descParts.push(html);
  }

  const separator = '<p>-</p>';
  const parts = [titleParts.join(''), separator, priceParts.join(''), separator, descParts.join('')];
  return parts.join('');
}

function buildComparisonTable(data) {
  const { fields, references } = data;
  const columnIds = fields.fragments || [];
  const sectionIds = fields.sections || [];

  const columns = columnIds.map((id) => resolveRef(id, references)).filter(Boolean);
  const colCount = columns.length;

  const rows = [];

  // Row 1: column headers with `-` separators for sub-sections
  const headerRow = document.createElement('div');
  for (const col of columns) {
    const colFields = col.fields;
    const cardIds = colFields.fragments || [];
    const displayFields = colFields.columnFields || [];
    const cell = document.createElement('div');

    if (cardIds.length > 0) {
      const card = resolveRef(cardIds[0], references);
      if (card) {
        cell.innerHTML = renderColumnHeader(displayFields, card.fields);
      }
    }
    headerRow.appendChild(cell);
  }
  rows.push(headerRow);

  // Section groups separated by +++
  for (let sIdx = 0; sIdx < sectionIds.length; sIdx++) {
    const section = resolveRef(sectionIds[sIdx], references);
    if (!section) continue;

    // +++ separator before every section except the first
    if (sIdx > 0) {
      const sepRow = document.createElement('div');
      const sepCell = document.createElement('div');
      sepCell.textContent = '+++';
      sepRow.appendChild(sepCell);
      rows.push(sepRow);
    }

    // Section title row — becomes the toggle button in comparison-table
    const sectionTitleRow = document.createElement('div');
    const sectionTitleCell = document.createElement('div');
    sectionTitleCell.textContent = section.fields.sectionTitle || section.title || `Section ${sIdx + 1}`;
    sectionTitleRow.appendChild(sectionTitleCell);
    for (let c = 0; c < colCount; c++) {
      const cell = document.createElement('div');
      // Mark primary column on first section only
      if (sIdx === 0 && columns[c]?.fields?.badge) {
        cell.textContent = 'primary';
      }
      sectionTitleRow.appendChild(cell);
    }
    rows.push(sectionTitleRow);

    // Feature rows
    const rowIds = section.fields.rows || [];
    for (const rowId of rowIds) {
      const row = resolveRef(rowId, references);
      if (!row) continue;

      const featureRow = document.createElement('div');
      const featureNameCell = document.createElement('div');
      const rowTitle = row.fields.rowTitle;
      if (rowTitle?.mimeType === 'text/html') {
        featureNameCell.innerHTML = rowTitle.value || '';
      } else {
        featureNameCell.textContent = rowTitle || '';
      }
      featureRow.appendChild(featureNameCell);

      const valueIds = row.fields.values || [];
      for (let c = 0; c < colCount; c++) {
        const cell = document.createElement('div');
        if (c < valueIds.length) {
          const val = resolveRef(valueIds[c], references);
          if (val) {
            cell.innerHTML = renderCellValue(val.fields);
          }
        }
        featureRow.appendChild(cell);
      }
      rows.push(featureRow);
    }
  }

  const wrapper = createTag('div', { class: 'comparison-table merch' });
  for (const row of rows) {
    wrapper.appendChild(row);
  }
  return wrapper;
}

export default async function init(el) {
  const options = getOptions(el);
  const { fragment } = options;
  if (!fragment) return;

  const servicePromise = initService();
  const success = await Promise.race([servicePromise, getTimeoutPromise()]);
  if (!success) throw new Error('Failed to initialize mas commerce service');

  const service = await servicePromise;
  const locale = service.getAttribute('locale');
  const country = service.getAttribute('country');
  const urlParams = new URLSearchParams(window.location.search);
  const masBase = getMasBase(window.location.hostname, urlParams.get('maslibs'));

  let endpoint = `${masBase}/io/fragment?id=${encodeURIComponent(fragment)}&locale=${locale}`;
  if (country && !locale.endsWith(`_${country}`)) {
    endpoint += `&country=${country}`;
  }

  const response = await fetch(endpoint);
  if (!response.ok) throw new Error(`Failed to fetch compare-chart fragment: ${response.status}`);

  const data = normalizeData(await response.json());
  const comparisonTable = buildComparisonTable(data);

  const parent = el.parentElement;
  if (parent?.tagName === 'P' && parent.children.length === 1) {
    parent.replaceWith(comparisonTable);
  } else {
    el.replaceWith(comparisonTable);
  }

  // Decorate icon spans into inline SVGs before the block decorator runs
  const icons = comparisonTable.querySelectorAll('span.icon');
  if (icons.length) {
    const { base } = getConfig();
    const { default: loadIcons } = await import('../../features/icons/icons.js');
    await loadIcons(icons, { base });
  }
  await loadBlock(comparisonTable);
}
