const getMeaningfulChildren = (col) => Array.from(col.childNodes).filter(
  (node) => node.nodeType !== Node.TEXT_NODE || node.textContent.trim() !== '',
);

const isRowHeader = (cols, col, cdx, rows) => {
  const columnsWithStrongOrH = Array.from(cols)
    .filter((rowCol) => getMeaningfulChildren(rowCol)
      .some((child) => child.tagName?.match(/^(H[1-6]|STRONG)$/)));

  const firstRowCols = rows[0].querySelectorAll(':scope > div');
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

const setElsRole = (els) => {
  els.forEach(({ el, role }) => {
    if (el.getAttribute('role')) return;
    el.setAttribute('role', role);
  });
};

const applyCellIfRowColHasText = (cols, col) => {
  if (Array.from(cols).some((otherCol) => otherCol.innerText.trim())) col.setAttribute('role', 'cell');
};

const applyAccessibilityAttributes = ({
  col, rdx, cols, cdx, rows, row, el,
}) => {
  if (!rdx && !cdx && !col.innerText) {
    col.classList.add('empty-table-heading');
    applyCellIfRowColHasText(cols, col);
    return;
  }

  if (!col.innerText.trim()) applyCellIfRowColHasText(cols, col);

  const meaningfulChildren = getMeaningfulChildren(col);
  const containsHTag = meaningfulChildren[0]?.tagName?.match(/^H[1-6]$/);
  if (containsHTag) meaningfulChildren[0].setAttribute('role', 'paragraph');

  if (rdx > 0 && !cdx && isRowHeader(cols, col, cdx, rows)) {
    col.classList.add('row-title');
    setElsRole([{ el: col, role: 'rowheader' }, { el: row, role: 'row' }]);
    return;
  }

  if (isColumnHeader(rdx, containsHTag, meaningfulChildren)) {
    setElsRole([{ el: col, role: 'columnheader' }, { el: row, role: 'row' }]);
    return;
  }

  if (!col.innerText.trim()) return;
  setElsRole([{ el, role: 'table' }, { el: col, role: 'cell' }, { el: row, role: 'row' }]);
};

export default function init(el) {
  const rows = el.querySelectorAll(':scope > div');
  const isTable = el.classList.contains('table');

  if (isTable) el.classList.replace('table', 'columns-table');

  rows.forEach((row, rdx) => {
    row.classList.add('row', `row-${rdx + 1}`);
    const cols = row.querySelectorAll(':scope > div');

    cols.forEach((col, cdx) => {
      col.classList.add('col', `col-${cdx + 1}`);
      if (!isTable) return;

      applyAccessibilityAttributes({
        col, rdx, cols, cdx, rows, el, row,
      });
    });
  });
}
