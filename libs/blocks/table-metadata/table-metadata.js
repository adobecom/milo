import { getMetadata } from '../section-metadata/section-metadata.js';

const getIndexedValues = (text) => text.split('\n').map((value) => value.split(/,(.*)/s).map((v) => v.trim()));

function handleSectionHead(text, table) {
  if (!text) return;
  const sectionsHeads = text.split('\n');
  sectionsHeads.forEach(sh => {
    const sectionHead = table.querySelector(`.row-${sh.trim()}`);
    sectionHead.classList.add('sectionHead');
  });
}

const handleColumnColor = (text, table, columnType) => {
  if (!text) return;
  const colors = getIndexedValues(text);

  if (colors.length === 1 && colors[0].length === 1) {
    const color = colors[0][0]?.replace('white', 'light');
    const allClassCols = Array.from(table.getElementsByClassName(`col-${columnType}`));
    allClassCols.forEach(element => {
      element.classList.add(color);
    });
  } else {
    colors.forEach((color) => {
      const colorIndex = color[0];
      const colorValue = color[1]?.replace('white', 'light');
      table.querySelector(`.col-${colorIndex}.col-${columnType}`)?.classList.add(colorValue);
    });
  }
};

const handleColumnBgColor = (text, table, columnType) => {
  if (!text) return;
  const bgColors = getIndexedValues(text);

  if (bgColors.length === 1 && bgColors[0].length === 1) {
    const color = bgColors[0][0];
    const allClassCols = Array.from(table.getElementsByClassName(`col-${columnType}`));
    allClassCols.forEach(element => {
      element.style.backgroundColor = color;
    });
  } else {
    bgColors.forEach((color) => {
      const [bgColorIndex, bgColorValue] = color;
      const col = table.querySelector(`.col-${bgColorIndex}.col-${columnType}`);
      if (col) {
        col.style.background = bgColorValue;
      }
    });
  }
};

function handleCompare(text, table) {
  if (!(text || table)) return;
  const comparisonGroup  = text.split('\n');
  comparisonGroup.forEach((comp, i) => {
    const col = comp.trim().split(' ')[1];
    const comparable = table.querySelector(`.col-${col}`);
    comparable.classList.add(`comp_${i + 1}`);
  });
}

function handleCollapse(collapsRows, expandDefault, table) {
  if (!collapsRows) return;

  const rows = getIndexedValues(collapsRows);

  rows.forEach((group) => {
    const el = group[0];
    if (!el.includes('-')) return;

    const [rowStartStr, rowEndStr] = el.trim().split('-');
    const rowStart = Number(rowStartStr) + 1;
    const rowEnd = Number(rowEndStr);

    if (!rowStart || !rowEnd) return;

    const range = Array.from({ length: rowEnd - rowStart + 1 }, (_, index) => index + rowStart);

    const collapsHeader = table.querySelector(`.row-${rowStart - 1}`);
    collapsHeader.classList.add('sectionHead');

    const iconTag = document.createElement('span');
    iconTag.classList.add('icon', 'expand');

    const collapsHeaderTitle = collapsHeader.querySelector('.col-1');
    collapsHeaderTitle.appendChild(iconTag);
    iconTag.setAttribute('aria-expanded', el === expandDefault ? 'true' : 'false');

    range.forEach((row) => {
      const rowElement = table.querySelector(`.row-${row}`);
      if (el !== expandDefault) {
        rowElement.setAttribute('hidden', '');
      }
    });

    iconTag.addEventListener('click', (e) => {
      handleExpand(e.target, range, table);
    });
  });
}

function handleExpand(el, rows, table) {
  const expanded = el.getAttribute('aria-expanded') === 'false';
  el.setAttribute('aria-expanded', expanded.toString());
  rows.forEach((row) => {
    const rowElement = table.querySelector(`.row-${row}`);
    if (expanded) {
      rowElement.removeAttribute('hidden');
    } else {
      rowElement.setAttribute('hidden', '');
    }
  });
}

export default function init(el) {
  const table = el.closest('.section').querySelector('.table');
  if (!table) return;
  const metadata = getMetadata(el);
  if (metadata.section) handleSectionHead(metadata.section.text, table);
  if (metadata.compare) handleCompare(metadata.compare.text, table);
  if (metadata['heading color']) handleColumnColor(metadata['heading color'].text, table, 'heading');
  if (metadata['heading background color']) handleColumnBgColor(metadata['heading background color'].text, table, 'heading');
  if (metadata['highlight color']) handleColumnColor(metadata['highlight color'].text, table, 'highlight');
  if (metadata['highlight background color']) handleColumnBgColor(metadata['highlight background color'].text, table, 'highlight');
  if (metadata['collapse rows'] && metadata['expand default']) handleCollapse(metadata['collapse rows'].text, metadata['expand default'].text, table);
}
