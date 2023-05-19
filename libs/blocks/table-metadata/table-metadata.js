import { getMetadata, handleStyle } from '../section-metadata/section-metadata.js';

const getIndexedValues = (text) => text.split('\n').map((value) => value.split(/,(.*)/s).map((v) => v.trim()));

function handleHighlightMerch(text, table) {
  if (!text) return;
  const highLights = getIndexedValues(text);
  highLights.forEach((hl) => {
    const hlCol = hl[0];
    const hlText = hl[1];
    if (hlText) {
      const highLightDiv = document.createElement('div');
      highLightDiv.textContent = hlText;
      table.querySelector(`.col-${hlCol}`).classList.add('col-highlight');
      table.querySelector(`.col-${hlCol}`).prepend(highLightDiv);
    }
  });
}

function handleSectionHead(text, table) {
  if (!text) return;
  const sectionsHeads = text.split('\n');
  sectionsHeads.forEach(sh => {
    const sectionHead = table.querySelector(`.row-${sh.trim()}`);
    sectionHead.classList.add('sectionHead');
  });
}

const handleColumnColorMerch = (text, table, columnType) => {
  if (!text) return;
  const colors = getIndexedValues(text);
  colors.forEach((color) => {
    const colorIndex = color[0];
    const colorValue = color[1]?.replace('white', 'light');
    table.querySelector(`.col-${colorIndex}.col-${columnType}`)?.classList.add(colorValue);
  });
};

const handleColumnBgColorMerch = (text, table, columnType) => {
  if (!text) return;
  const bgColors = getIndexedValues(text);
  bgColors.forEach((color) => {
    const bgColorIndex = color[0];
    const bgColorValue = color[1];
    const col = table.querySelector(`.col-${bgColorIndex}.col-${columnType}`);
    if (col) col.style.background = bgColorValue;
  });
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
  if (collapsRows) {
    const collapseGroups = collapsRows.split('\n');
    collapseGroups.forEach((collapseGroup) => {
      const rowsGroup = collapseGroup.trim().split(' ');
      rowsGroup.forEach((group) => {
        if (group.includes('-')) {
          const [rowStartStr, rowEndStr] = group.trim().split('-');
          const rowStart = Number(rowStartStr) + 1;
          const rowEnd = Number(rowEndStr);
          if (rowStart && rowStart) {
            const range = Array.from({ length: rowEnd - rowStart + 1 }, (_, index) => index + rowStart);
            const collapsHeader = table.querySelector(`.row-${rowStart - 1}`);
            collapsHeader.classList.add('sectionHead');
            const iconTag = document.createElement('span');
            iconTag.classList.add('icon', 'expand');
            const collapsHeaderTitle = collapsHeader.querySelector('.col-2');
            collapsHeaderTitle.appendChild(iconTag);
            iconTag.setAttribute('aria-expanded', group === expandDefault ? 'true' : 'false');
            range.forEach((row) => {
              const rowElement = table.querySelector(`.row-${row}`);
              if (group !== expandDefault) {
                rowElement.setAttribute('hidden', '');
              }
            });
            iconTag.addEventListener('click', (e) => {
              handleExpand(e.target, range, table);
            });
          }
        }
      });
    });
  }
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

function handleHighlightColor(text, table) {
  const highlights = Array.from(table.getElementsByClassName('highlight'));
  highlights.forEach((element) => {
    element.style.color = text;
  });
}

function handleHighlightBackground(text, table) {
  const highlights = Array.from(table.getElementsByClassName('highlight'));
  highlights.forEach((element) => {
    element.style.backgroundColor = text;
    element.style.borderColor = text;
  });
}

export default function init(el) {
  const table = el.closest('.section').querySelector('.table');
  if (!table) return;

  const metadata = getMetadata(el);
  // if (metadata['highlight merch']) handleHighlightMerch(metadata['highlight merch'].text, table);
  // if (metadata.section) handleSectionHead(metadata.section.text, table);
  // if (metadata.compare) handleCompare(metadata.compare.text, table);
  // if (metadata['heading color merch']) handleColumnColorMerch(metadata['heading color merch'].text, table, 'heading');
  // if (metadata['heading background color merch']) handleColumnBgColorMerch(metadata['heading background color merch'].text, table, 'heading');
  // if (metadata['highlight color merch']) handleColumnColorMerch(metadata['heading color merch'].text, table, 'highlight');
  // if (metadata['highlight background color merch']) handleColumnBgColorMerch(metadata['highlight background color merch'].text, table, 'highlight');
  if (metadata['collapse rows']) handleCollapse(metadata['collapse rows'].text, metadata['expand default'].text, table);
  if (metadata['highlight color']) handleHighlightColor(metadata['highlight color'].text, table);
  if (metadata['highlight background color']) handleHighlightBackground(metadata['highlight background color'].text, table);
}