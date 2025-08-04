export default function init(el) {
  const rows = el.querySelectorAll(':scope > div');
  const isTable = el.classList.contains('table');

  if (isTable) {
    el.classList.add('columns-table');
    el.classList.remove('table');
    el.setAttribute('role', 'table');
  }

  const hasMeaningfulChildren = (col) => Array.from(col.childNodes).filter(
    (node) => node.nodeType !== Node.TEXT_NODE || node.textContent.trim() !== '',
  );

  const isRowHeader = (cols, col, cdx) => {
    const columnsWithStrongOrH = Array.from(cols).filter((rowCol) => {
      const rowColMeaningfulChildren = hasMeaningfulChildren(rowCol);
      return rowColMeaningfulChildren.some((child) => child.tagName?.match(/^(H[1-6]|STRONG)$/));
    });

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

  const isRow = (cols) => isTable && Array.from(cols).some((col) => col.hasChildNodes());

  const applyAccessibilityAttributes = (col, rdx, cols, cdx) => {
    const meaningfulChildren = hasMeaningfulChildren(col);
    const containsHTag = meaningfulChildren[0]?.tagName?.match(/^H[1-6]$/);
    if (containsHTag) meaningfulChildren[0].setAttribute('role', 'paragraph');

    if (rdx > 0 && !cdx && isRowHeader(cols, col, cdx)) {
      col.classList.add('row-title');
      col.setAttribute('role', 'rowheader');
      return;
    }

    if (isColumnHeader(rdx, containsHTag, meaningfulChildren)) {
      col.setAttribute('role', 'columnheader');
      return;
    }

    if (col.innerText) col.setAttribute('role', 'cell');
  };

  rows.forEach((row, rdx) => {
    row.classList.add('row', `row-${rdx + 1}`);
    const cols = row.querySelectorAll(':scope > div');

    if (isRow(cols)) row.setAttribute('role', 'row');

    cols.forEach((col, cdx) => {
      col.classList.add('col', `col-${cdx + 1}`);
      if (!isTable) return;
      if (!rdx && !cdx && !col.innerText) {
        col.classList.add('empty-table-heading');
        return;
      }

      applyAccessibilityAttributes(col, rdx, cols, cdx);
    });
  });
}
