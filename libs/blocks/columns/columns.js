const getMeaningfulChildren = (col) => Array.from(col.childNodes).filter(
  (node) => node.nodeType !== Node.TEXT_NODE || node.textContent.trim() !== '',
);

const isRowHeader = (cols, col, cdx, rows) => {
  const columnsWithStrongOrH = Array.from(cols)
    .filter((rowCol) => getMeaningfulChildren(rowCol)
      .some((child) => child.tagName?.match(/^(H[1-6]|STRONG)$/)));

  const firstRow = rows[0];
  const firstRowCols = firstRow.querySelectorAll(':scope > div');
  const correspondingFirstRowCol = firstRowCols[cdx];
  const hasColumnHeaderInFirstRow = correspondingFirstRowCol?.getAttribute('role') === 'columnheader';

  return columnsWithStrongOrH.length === 1
  && columnsWithStrongOrH[0] === col
  && !hasColumnHeaderInFirstRow;
};

const isColumnHeader = (rdx, containsHTag, meaningfulChildren) => (
  (!rdx && meaningfulChildren.length === 1
    && !meaningfulChildren.some((child) => child.classList?.contains('image-link'))) || containsHTag
);

const applyTableRow = (row) => { if (!row.getAttribute('role')) row.setAttribute('role', 'row'); };

const applyAccessibilityAttributes = ({
  col, rdx, cols, cdx, rows, el, row,
}) => {
  const meaningfulChildren = getMeaningfulChildren(col);
  const containsHTag = meaningfulChildren[0]?.tagName?.match(/^H[1-6]$/);
  if (containsHTag) meaningfulChildren[0].setAttribute('role', 'paragraph');

  if (rdx > 0 && !cdx && isRowHeader(cols, col, cdx, rows)) {
    col.classList.add('row-title');
    col.setAttribute('role', 'rowheader');
    applyTableRow(row);
    return;
  }

  if (isColumnHeader(rdx, containsHTag, meaningfulChildren)) {
    col.setAttribute('role', 'columnheader');
    applyTableRow(row);
    return;
  }

  if (!col.innerText.trim()) return;
  if (!el.getAttribute('role')) el.setAttribute('role', 'table');
  col.setAttribute('role', 'cell');
  applyTableRow(row);
};

const applyCellIfRowColHasText = (cols, col) => {
  if (Array.from(cols).some((otherCol) => otherCol.innerText.trim())) col.setAttribute('role', 'cell');
};

export default function init(el) {
  const rows = el.querySelectorAll(':scope > div');
  const isTable = el.classList.contains('table');

  if (isTable) {
    el.classList.add('columns-table');
    el.classList.remove('table');
  }

  rows.forEach((row, rdx) => {
    row.classList.add('row', `row-${rdx + 1}`);
    const cols = row.querySelectorAll(':scope > div');

    cols.forEach((col, cdx) => {
      col.classList.add('col', `col-${cdx + 1}`);
      if (!isTable) return;
      if (!rdx && !cdx && !col.innerText) {
        col.classList.add('empty-table-heading');
        applyCellIfRowColHasText(cols, col);
        return;
      }

      if (!col.innerText.trim()) applyCellIfRowColHasText(cols, col);

      applyAccessibilityAttributes({
        col, rdx, cols, cdx, rows, el, row,
      });
    });
  });
}
