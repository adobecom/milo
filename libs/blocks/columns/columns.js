function isTableRowTitle(el, index) {
  return !index
  && el.childNodes.length === 1
  && el.childNodes[0].tagName === 'STRONG';
}

function isTableHeadingAndEmpty(el, rdx, cdx) {
  return !rdx && !cdx && !el.innerText;
}

function isTable(el) {
  return el.classList.contains('table');
}

export default function init(el) {
  const rows = el.querySelectorAll(':scope > div');
  rows.forEach((row, rdx) => {
    row.classList.add('row', `row-${rdx + 1}`);
    const cols = row.querySelectorAll(':scope > div');
    cols.forEach((col, cdx) => {
      col.classList.add('col', `col-${cdx + 1}`);
      if (!isTable(el)) return;
      if (isTableHeadingAndEmpty(col, rdx, cdx)) col.classList.add('empty-table-heading');
      if (isTableRowTitle(col, cdx)) col.classList.add('row-title');
    });
  });
  if (isTable(el)) {
    el.classList.add('columns-table');
    el.classList.remove('table');
  }
}
