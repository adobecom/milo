import { createTag, loadBlock, getConfig } from '../../utils/utils.js';
import { initService, getOptions, loadMasComponent, MAS_MERCH_CARD } from '../merch/merch.js';

const AUTOBLOCK_TIMEOUT = 5000;

const VARIANT_TABLE = 'Table';
const VARIANT_COMPARISON = 'Comparison Table';

function fetchFragment(fragmentId) {
  return new Promise((resolve, reject) => {
    const aemFragment = createTag('aem-fragment', { fragment: fragmentId });
    const cleanup = () => aemFragment.remove();
    aemFragment.addEventListener('aem:load', (e) => {
      cleanup();
      resolve(e.detail);
    }, { once: true });
    aemFragment.addEventListener('aem:error', (e) => {
      cleanup();
      reject(new Error(e.detail?.message || 'Failed to fetch compare-chart fragment'));
    }, { once: true });
    document.body.appendChild(aemFragment);
  });
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
  const val = fields.valueType;
  if (val === 'true') return '<span class="icon icon-checkmark"></span>';
  if (val === 'false') return '<span class="icon icon-close"></span>';
  return val || '';
}

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

function renderFieldHtml(fieldName, fieldValue, titleTag = 'h2') {
  if (fieldName === 'mnemonicIcon') {
    const urls = Array.isArray(fieldValue) ? fieldValue : [fieldValue];
    const imgs = urls.filter(Boolean).map((url) => `<img src="${url}" alt="" />`).join('');
    return imgs ? `<p>${imgs}</p>` : null;
  }
  if (fieldName === 'cardTitle') return `<${titleTag}>${fieldValue}</${titleTag}>`;
  if (CTA_FIELDS.has(fieldName)) {
    return fieldValue?.value ? transformCtaHtml(fieldValue.value) : null;
  }
  if (fieldValue?.mimeType === 'text/html') return fieldValue.value || null;
  if (typeof fieldValue === 'string') return `<p>${fieldValue}</p>`;
  return null;
}

/**
 * Renders column header for comparison-table variant.
 * Inserts `-` separators between sub-sections (title, price, desc+CTAs).
 */
function renderColumnHeader(displayFields, cardFields) {
  const titleParts = [];
  const priceParts = [];
  const descParts = [];

  for (const fieldName of displayFields) {
    const fieldValue = cardFields[fieldName];
    if (fieldValue != null) {
      const html = renderFieldHtml(fieldName, fieldValue);
      if (html) {
        if (TITLE_FIELDS.has(fieldName)) titleParts.push(html);
        else if (PRICE_FIELDS.has(fieldName)) priceParts.push(html);
        else descParts.push(html);
      }
    }
  }

  const separator = '<p>-</p>';
  return [titleParts.join(''), separator, priceParts.join(''), separator, descParts.join('')].join('');
}

/**
 * Renders column header for table variant.
 * No `-` separators — all fields rendered sequentially.
 */
function renderColumnHeaderFlat(displayFields, cardFields) {
  const parts = [];
  const ctaParts = [];
  for (const fieldName of displayFields) {
    const fieldValue = cardFields[fieldName];
    if (fieldValue != null) {
      const html = renderFieldHtml(fieldName, fieldValue, 'p');
      if (html) {
        // CTAs must come last so table.js positional classification works correctly
        if (CTA_FIELDS.has(fieldName)) ctaParts.push(html);
        else parts.push(html);
      }
    }
  }
  return [...parts, ...ctaParts].join('');
}

function parseVariants(fields) {
  const raw = fields.selectedVariantNames || fields.variantName || [];
  return Array.isArray(raw) ? [...raw] : [raw].filter(Boolean);
}

/** Adds implicit variants that table.css expects for correct styling. */
function resolveVariants(isTable, variants, columns) {
  if (!isTable) return;
  // m-heading-icon: constrains SVG icons via --icon-size-m
  if (!variants.includes('m-heading-icon')) {
    const hasMnemonics = columns.some((col) => {
      const displayFields = col.fields?.fields || [];
      return displayFields.includes('mnemonicIcon');
    });
    if (hasMnemonics) variants.push('m-heading-icon');
  }
  // has-addon: applies smaller body font-size
  if (variants.includes('pricing-bottom') && !variants.includes('has-addon')) {
    variants.push('has-addon');
  }
}

function appendEmptyCells(row, count) {
  for (let c = 0; c < count; c += 1) row.appendChild(document.createElement('div'));
}

function buildSeparatorRow({ isTable, isMerch, colCount }, sIdx) {
  if (isTable) {
    const row = document.createElement('div');
    if (!isMerch) {
      const hrCell = document.createElement('div');
      hrCell.innerHTML = '<hr>';
      row.appendChild(hrCell);
    }
    appendEmptyCells(row, colCount);
    return row;
  }
  // comparison-table: +++ separator only between sections
  if (sIdx > 0) {
    const row = document.createElement('div');
    const cell = document.createElement('div');
    cell.textContent = '+++';
    row.appendChild(cell);
    return row;
  }
  return null;
}

function buildSectionTitleRow({ isTable, isMerch, colCount, columns }, text, sIdx) {
  const row = document.createElement('div');
  if (isMerch) {
    for (let c = 0; c < colCount; c += 1) {
      const cell = document.createElement('div');
      const strong = document.createElement('strong');
      strong.textContent = text;
      cell.appendChild(strong);
      row.appendChild(cell);
    }
  } else if (isTable) {
    const titleCell = document.createElement('div');
    const strong = document.createElement('strong');
    strong.textContent = text;
    titleCell.appendChild(strong);
    row.appendChild(titleCell);
    appendEmptyCells(row, colCount);
  } else {
    const titleCell = document.createElement('div');
    // '\u200B' (zero-width space, Unicode Cf — not stripped by trim()) prevents
    // a null reference crash in decorateTableToggleButton when sectionTitle is empty.
    titleCell.textContent = text || '\u200B';
    row.appendChild(titleCell);
    for (let c = 0; c < colCount; c += 1) {
      const cell = document.createElement('div');
      if (sIdx === 0 && columns[c]?.fields?.badge) cell.textContent = 'primary';
      row.appendChild(cell);
    }
  }
  return row;
}

function buildHeaderRow({ hasLabelCol, references }, columns, headerRenderer) {
  const row = document.createElement('div');
  if (hasLabelCol) row.appendChild(document.createElement('div'));
  for (const col of columns) {
    const colFields = col.fields;
    const cardIds = colFields.fragment || [];
    const displayFields = colFields.fields || [];
    const cell = document.createElement('div');
    if (cardIds.length > 0) {
      const card = resolveRef(cardIds[0], references);
      if (card) cell.innerHTML = headerRenderer(displayFields, card.fields);
    }
    row.appendChild(cell);
  }
  return row;
}

function buildFeatureRow({ isMerch, colCount, references }, rowData) {
  const row = document.createElement('div');
  if (!isMerch) {
    const nameCell = document.createElement('div');
    const { rowTitle } = rowData.fields;
    if (rowTitle?.mimeType === 'text/html') {
      nameCell.innerHTML = rowTitle.value || '';
    } else {
      nameCell.textContent = rowTitle || '';
    }
    row.appendChild(nameCell);
  }
  const valueIds = rowData.fields.rowValues || [];
  for (let c = 0; c < colCount; c += 1) {
    const cell = document.createElement('div');
    if (c < valueIds.length) {
      const val = resolveRef(valueIds[c], references);
      if (val) cell.innerHTML = renderCellValue(val.fields);
    }
    row.appendChild(cell);
  }
  return row;
}

function buildTable(data) {
  const { fields, references } = data;
  const blockName = fields.blockName || VARIANT_COMPARISON;
  const isTable = blockName === VARIANT_TABLE;
  const columnIds = fields.fragments || [];
  const sectionIds = fields.sections || [];

  const columns = columnIds.map((id) => resolveRef(id, references)).filter(Boolean);
  const colCount = columns.length;
  const headerRenderer = isTable ? renderColumnHeaderFlat : renderColumnHeader;

  const variants = parseVariants(fields);
  const isHighlight = isTable && variants.includes('highlight');
  const isMerch = isTable && variants.includes('merch');
  const hasLabelCol = isTable && !isMerch;

  resolveVariants(isTable, variants, columns);

  const ctx = {
    isTable, isMerch, colCount, columns, hasLabelCol, references,
  };
  const rows = [];

  // Highlight ribbon row
  if (isHighlight) {
    const ribbonRow = document.createElement('div');
    if (hasLabelCol) ribbonRow.appendChild(document.createElement('div'));
    for (const col of columns) {
      const cell = document.createElement('div');
      const badge = col.fields?.badge;
      if (badge) cell.textContent = badge;
      ribbonRow.appendChild(cell);
    }
    rows.push(ribbonRow);
  }

  rows.push(buildHeaderRow(ctx, columns, headerRenderer));

  // Section groups
  for (let sIdx = 0; sIdx < sectionIds.length; sIdx += 1) {
    const section = resolveRef(sectionIds[sIdx], references);
    if (section) {
      const sepRow = buildSeparatorRow(ctx, sIdx);
      if (sepRow) rows.push(sepRow);

      const titleText = section.fields.sectionTitle ?? '';
      rows.push(buildSectionTitleRow(ctx, titleText, sIdx));

      const rowIds = section.fields.rows || [];
      for (const rowId of rowIds) {
        const rowRef = resolveRef(rowId, references);
        if (rowRef) rows.push(buildFeatureRow(ctx, rowRef));
      }
    }
  }

  const blockClass = isTable ? 'table' : 'comparison-table';
  const variantClasses = variants.join(' ');
  const wrapperClass = variantClasses ? `${blockClass} ${variantClasses}` : blockClass;
  const wrapper = createTag('div', { class: wrapperClass });
  for (const row of rows) wrapper.appendChild(row);
  return wrapper;
}

export default async function init(el) {
  const options = getOptions(el);
  const { fragment } = options;
  if (!fragment) return;

  const servicePromise = initService();
  const success = await Promise.race([servicePromise, getTimeoutPromise()]);
  if (!success) throw new Error('Failed to initialize mas commerce service');

  await servicePromise;
  await loadMasComponent(MAS_MERCH_CARD);

  const data = await fetchFragment(fragment);
  const comparisonTable = buildTable(data);

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
  // Load table-metadata before the table block so its event listener
  // is registered before table.js dispatches milo:table:highlight:loaded.
  const section = comparisonTable.closest('.section');
  const tableMetadata = section?.querySelector('.table-metadata');
  if (tableMetadata) await loadBlock(tableMetadata);

  await loadBlock(comparisonTable);
}
