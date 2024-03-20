import { createTag } from '../../../utils/utils.js';
  
function isColor(str) {
  const hexRegex = /^#(?:[0-9a-fA-F]{3}){1,2}$/;
  const rgbRegex = /^rgb\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)$/;
  if (hexRegex.test(str) || rgbRegex.test(str)) {
    return true;
  } 
  return false;
}
function isGradient(str) {  
  return str.startsWith('linear-gradient');
}
function isColorOrGradient(str) {
  return isColor(str) || isGradient(str);
}

function getColWidth(text, colWidths) {
  const numRegex = /\b\d{1,3}\b/;
  colWidths.push((text.match(numRegex) || [])[0]);
}
function createRow() {
  return [createTag('div', { class: 'row' }),
  createTag('div', { class: 'left' }),
  createTag('div', { class: 'right' })
  ];
}
function createBars(index) {
  return index === 0 ?
    [createTag('div', { class: 'bar' })] :
    [createTag('div', { class: 'bar' }), createTag('div', { class: 'bar' })];
}
function addBarRow() {
  const [barRow, left, right] = createRow();
  const sides= [left, right];
  sides.forEach((text, index) => {
      sides[index].append(...createBars(index));
      barRow.append(sides[index]);
  });
  return barRow;
}
function addBottomRow(periodText) {
  const [periodRow, left, right] = createRow();
  const sides= [left, right];
  periodText.forEach((text, index) => {
      sides[index].append(createTag('p', { class: 'period body-s' }, text));
      periodRow.append(sides[index]);
  });
  return periodRow;
}

function setBG(el,color) {
  el.style.background = color;
}

function setColors(colors, fragment) {
  const barEls = fragment.querySelectorAll('.bar');
  const periodEls = fragment.querySelectorAll('.period');
  if (colors?.length === 2 && isColorOrGradient(colors[0]) && isColorOrGradient(colors[1])) {
    if (barEls.length === 3 || periodEls.length === 2) {
      const leftColor = colors[0];
      const rightColor = colors[1];
      let firstBar, secondBar, thirdBar;
      if (isGradient(leftColor)) {
        leftColor.split(' ').forEach((color) => {
          if (isColor(color) && !firstBar) {
            firstBar = color;
            setBG(barEls[0], firstBar);
          } else if (isColor(color)) {
            secondBar = color;
            setBG(barEls[1], secondBar);
          }
        })
      } else {
        setBG(barEls[0], leftColor);
        setBG(barEls[1], leftColor);
      }
      if (isGradient(rightColor)) {
        leftColor.split(' ').forEach((color) => {
          if (isColor(color) && !thirdBar) {
            thirdBar = color;
            setBG(barEls[2], thirdBar);
          }
        })
      } else {
        setBG(barEls[2], rightColor);
      }
      setBG(periodEls[0], leftColor);
      setBG(periodEls[1], rightColor);
    }
  }
}
function colWidthsNotValid(colWidths) {
  return (colWidths.length !== 2 || colWidths.some((value) => isNaN(value)));
}
function updateColWidths(colWidths, fragment) {
  if (colWidthsNotValid(colWidths) || colWidthsMatchDefault(colWidths)) return;
  const total = Number(colWidths[0]) + Number(colWidths[1]);
  const left = Math.floor((Number(colWidths[0]) / total)* 10000)/100;
  const right = Math.floor((Number(colWidths[1]) / total)* 10000)/100;
  fragment.querySelectorAll('.row').forEach((row) => row.style.gridTemplateColumns = `${String(left)}% ${String(right)}%`);
}
function colWidthsMatchDefault(widths) {
  const defWidths = ['7', '14'];
  return widths.every((value, index) => value === defWidths[index]);
}

function isModalSibling(el) {
  const dialog = el.closest('.dialog-modal');
  if (!dialog || !dialog.querySelector('.fragment > div .text-block')) return false;
  return true;
}

export default function init(el) {
  const fragment = document.createDocumentFragment();
  const [textRow, left, right] = createRow();
  const rows = el.querySelectorAll(':scope > div > div');
  const colors = [], periodText = [], colWidths = [];
  rows.forEach((row, index) => {
    const  side = index === 0 ? left : right;
    const color = row.firstElementChild?.textContent?.trim();
    const p = row.querySelector(':scope > p:last-child');
    if (p) {
      const [text, period] = p.textContent?.trim().split('|');
      if (period) {
        periodText.push(period);
        getColWidth(period, colWidths);
      }
      p.textContent = text.trim();
    }
    
    if (isColorOrGradient(color)) {
      colors.push(color);
      row.firstElementChild.remove();
    }
    row.removeAttribute('data-valign');
    row.parentElement.remove();
    side.append(row);
  });
  
  textRow.append(left,right);
  [textRow, addBarRow(), addBottomRow(periodText)].forEach((row) => fragment.append(row));
  updateColWidths(colWidths ,fragment);
  setColors(colors, fragment);
  el.append(fragment);
}
