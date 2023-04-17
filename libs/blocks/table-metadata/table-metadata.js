import { getMetadata, handleStyle } from '../section-metadata/section-metadata.js';

const getIndexedValues = (text) => text.split('\n').map((value) => value.split(/,(.*)/s).map((v) => v.trim()));

function handleHighlight(text, table) {
  if (!(text || table)) return;
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
  if (!(text || table)) return;
  const sectionsHeads = text.split('\n');
  sectionsHeads.forEach(sh => {
    const sectionHead = table.querySelector(`.row-${sh.trim()}`);
    sectionHead.classList.add('sectionHead');
  });
}

const handleColumnColor = (text, table, columnType) => {
  if (!(text || table)) return;
  const colors = getIndexedValues(text);
  colors.forEach((color) => {
    const colorIndex = color[0];
    const colorValue = color[1]?.replace('white', 'light');
    table.querySelector(`.col-${colorIndex}.col-${columnType}`)?.classList.add(colorValue);
  });
};

const handleColumnBgColor = (text, table, columnType) => {
  if (!(text || table)) return;
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

export default function init(el) {
  const table = el.closest('.section').querySelector('.table');
  const metadata = getMetadata(el);
  if (metadata.highlight) handleHighlight(metadata.highlight.text, table);
  if (metadata.section) handleSectionHead(metadata.section.text, table);
  if (metadata.compare) handleCompare(metadata.compare.text, table);
  if (metadata['heading color']) handleColumnColor(metadata['heading color'].text, table, 'heading');
  if (metadata['heading background color']) handleColumnBgColor(metadata['heading background color'].text, table, 'heading');
  if (metadata['highlight color']) handleColumnColor(metadata['heading color'].text, table, 'highlight');
  if (metadata['highlight background color']) handleColumnBgColor(metadata['highlight background color'].text, table, 'highlight');
}
