import { getMetadata, handleStyle } from '../section-metadata/section-metadata.js';

function handleHighlight(text, table) {
  if (!(text || table)) return;
  const highLights = text.split('\n');
  highLights.forEach(hl => {
    const hlCol = hl.split(',')[0].trim();
    const hlText = hl.split(',')[1].trim();
    const highLightDiv = document.createElement('div');
    highLightDiv.classList.add('highlight');
    highLightDiv.textContent = hlText;
    table.querySelector(`.col-${hlCol}`).prepend(highLightDiv);
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
  console.log(metadata);
  if (metadata.highlight.text) handleHighlight(metadata.highlight.text, table);
  if (metadata.section.text) handleSectionHead(metadata.section.text, table);
  if (metadata.compare.text) handleCompare(metadata.compare.text, table);

}

