import { getMetadata } from '../section-metadata/section-metadata.js';

const getIndexedValues = (text) => text.split('\n').map((value) => value.split(/,(.*)/s).map((v) => v.trim()));

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
      columnType === 'highlight' ? element.style.borderColor = color : null;
    });
  } else {
    bgColors.forEach((color) => {
      const [bgColorIndex, bgColorValue] = color;
      const col = table.querySelector(`.col-${bgColorIndex}.col-${columnType}`);
      if (col && col.innerText) {
        col.style.background = bgColorValue;

        if (columnType === 'highlight') col.style.borderColor = bgColorValue;
      }
    });
  }
};

function handleCompare(text, table) {
  if (!(text || table)) return;
  const comparisonGroup = text.split('\n');
  comparisonGroup.forEach((comp, i) => {
    const col = comp.trim().split(' ')[1];
    const comparable = table.querySelector(`.col-${col}`);
    comparable.classList.add(`comp_${i + 1}`);
  });
}

export default function init(el) {
  const table = el.closest('.section').querySelector('.table');
  if (!table) return;
  const metadata = getMetadata(el);
  if (metadata.compare) handleCompare(metadata.compare.text, table);
  if (metadata['heading color']) handleColumnColor(metadata['heading color'].text, table, 'heading');
  if (metadata['heading background color']) handleColumnBgColor(metadata['heading background color'].text, table, 'heading');
  if (metadata['highlight color']) handleColumnColor(metadata['highlight color'].text, table, 'highlight');
  if (metadata['highlight background color']) handleColumnBgColor(metadata['highlight background color'].text, table, 'highlight');
}
