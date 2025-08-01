export default function init(el) {
  const rows = el.querySelectorAll(':scope > div');
  const isTable = el.classList.contains('table');

  if (isTable) {
    el.classList.add('columns-table');
    el.classList.remove('table');
    el.setAttribute('role', 'table');
  }

  rows.forEach((row, rdx) => {
    row.classList.add('row', `row-${rdx + 1}`);
    const cols = row.querySelectorAll(':scope > div');

    if (isTable && Array.from(cols).some((col) => col.hasChildNodes())) row.setAttribute('role', 'row');

    cols.forEach((col, cdx) => {
      col.classList.add('col', `col-${cdx + 1}`);
      if (!isTable) return;
      if (!rdx && !cdx && !col.innerText) {
        col.classList.add('empty-table-heading');
        return;
      }

      const meaningfulChildren = Array.from(col.childNodes).filter(
        (node) => node.nodeType !== Node.TEXT_NODE || node.textContent.trim() !== '',
      );
      const containsHTag = meaningfulChildren[0]?.tagName?.match(/^H[1-6]$/);
      if (containsHTag) meaningfulChildren[0].setAttribute('role', 'paragraph');

      if (rdx > 0) {
        const columnsWithStrongOrH = Array.from(cols).filter((rowCol) => {
          const rowColMeaningfulChildren = Array.from(rowCol.childNodes).filter(
            (node) => node.nodeType !== Node.TEXT_NODE || node.textContent.trim() !== '',
          );
          return rowColMeaningfulChildren.some((child) => child.tagName?.match(/^(H[1-6]|STRONG)$/))
            || (rowCol.childNodes.length === 1 && rowCol.childNodes[0].tagName === 'STRONG');
        });

        const firstRow = rows[0];
        const firstRowCols = firstRow.querySelectorAll(':scope > div');
        const correspondingFirstRowCol = firstRowCols[cdx];
        const hasColumnHeaderInFirstRow = correspondingFirstRowCol?.getAttribute('role') === 'columnheader';

        if (columnsWithStrongOrH.length === 1
            && columnsWithStrongOrH[0] === col
            && !hasColumnHeaderInFirstRow) {
          col.classList.add('row-title');
          col.setAttribute('role', 'rowheader');
          return;
        }
      }

      if ((!rdx && meaningfulChildren.length === 1
        && !meaningfulChildren.some((child) => child.classList?.contains('image-link'))) || containsHTag) {
        col.classList.add('column-title');
        col.setAttribute('role', 'columnheader');
        return;
      }

      if (col.innerText) col.setAttribute('role', 'cell');
    });
  });
}
