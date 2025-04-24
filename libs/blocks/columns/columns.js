export default function init(el) {
  const rows = el.querySelectorAll(':scope > div');
  const isTable = el.classList.contains('table');
  rows.forEach((row, rdx) => {
    row.classList.add('row', `row-${rdx + 1}`);
    const cols = row.querySelectorAll(':scope > div');
    cols.forEach((col, cdx) => {
      col.classList.add('col', `col-${cdx + 1}`);
      if (!isTable) return;
      if (!rdx && !cdx && !col.innerText) col.classList.add('empty-table-heading');
      const isTableRowTitle = !cdx && col.childNodes.length === 1 && col.childNodes[0].tagName === 'STRONG';
      if (isTableRowTitle) col.classList.add('row-title');
    });
  });
  if (isTable) {
    el.classList.add('columns-table');
    el.classList.remove('table');
  }
}
