const positionStickyRows = (table) => {
  const tableRec = table.getBoundingClientRect();
  const tableBottom = tableRec.top + tableRec.height;
  const gnav = document.querySelector('header');
  const gnavHeight = gnav ? gnav.getBoundingClientRect().height : 0;
  const highlightRow = table.querySelector('.row-highlight');
  const highlightHeight = highlightRow ? highlightRow.getBoundingClientRect().height : 0;
  const highlightCells = highlightRow ? highlightRow.querySelectorAll(':scope > div') : null;
  const headerRow = table.querySelector('.row-header');
  const headerRowHeight = headerRow.getBoundingClientRect().height;
  const headerRowBottom = gnavHeight + highlightHeight + headerRowHeight;
  const headerCells = headerRow.querySelectorAll(':scope > div');
  const nextRow = table.querySelector('.row-header + div');
  const nextCells = nextRow ? nextRow.querySelectorAll(':scope > div') : null;
  const lastRow = table.querySelector(':scope > div:last-child');
  const lastRowRec = lastRow.getBoundingClientRect();

  if (!nextRow) return;
  if (tableRec.top < gnavHeight && tableBottom > gnavHeight) {
    nextCells.forEach((cell, index) => {
      const cellWidth = getComputedStyle(cell).width;
      if (highlightCells && highlightCells[index]) highlightCells[index].style.width = `${cellWidth}px`;
      if (headerCells[index]) headerCells[index].style.width = `${cellWidth}px`;
    });
    table.classList.add('table-sticky-on');
    nextRow.style.marginTop = `${highlightHeight + headerRowHeight}px`;
    headerRow.style.width = `${tableRec.width}px`;
    if (highlightRow) {
      highlightRow.style.width = `${tableRec.width}px`;
    }
    if (headerRowBottom < lastRowRec.top) {
      // lock under gnav
      if (highlightRow) {
        highlightRow.style.top = `${gnavHeight}px`;
      }
      headerRow.style.top = `${gnavHeight + highlightHeight}px`;
    } else {
      // scroll off
      if (highlightRow) {
        highlightRow.style.top = `${lastRowRec.top - headerRowHeight - highlightHeight}px`;
      }
      headerRow.style.top = `${lastRowRec.top - headerRowHeight}px`;
    }
  } else {
    highlightCells?.forEach((cell) => {
      cell.style.width = null;
    });
    headerCells.forEach((cell) => {
      cell.style.width = null;
    });
    table.classList.remove('table-sticky-on');
    nextRow.style.marginTop = null;
    headerRow.style.width = null;
    headerRow.style.top = null;
    if (highlightRow) {
      highlightRow.style.width = null;
      highlightRow.style.top = null;
    }
  }
};

const addStickyListeners = (table, highlightOn) => {
  window.addEventListener('scroll', () => {
    positionStickyRows(table, highlightOn);
  });
  window.addEventListener('resize', () => {
    positionStickyRows(table, highlightOn);
  });
};

export default function init(el) {
  // remove top row if empty
  const firstRow = el.querySelector(':scope > div:first-child');
  if (firstRow.innerText.trim() === '') firstRow.remove();

  const highlightOn = el.classList.contains('highlight');
  const rows = el.querySelectorAll(':scope > div');
  let groupIndex = 0;
  rows.forEach((row, rdx) => {
    row.className = `row row-${rdx + 1}`;
    if (highlightOn && rdx === 0) {
      row.classList.add('row-highlight');
    } else if ((highlightOn && rdx === 1) || (!highlightOn && rdx === 0)) {
      row.classList.add('row-header');
    }

    if (groupIndex) {
      row.classList.add(`row-group-${groupIndex}`);
    }
    const cols = row.querySelectorAll(':scope > div');
    cols.forEach((col, cdx) => {
      col.className = `col col-${cdx + 1}`;
      if (row.classList.contains('row-header')) {
        col.classList.add('col-heading');
      } else if (
        row.classList.contains('row-highlight')
        && col.innerText !== ''
      ) {
        col.classList.add('col-highlight');
      }
      const colContents = col.querySelectorAll(':scope > *');
      if (colContents.length === 1 && (colContents.item(0).nodeName === 'H3' || colContents.item(0).nodeName === 'H4')) {
        if (!row.classList.contains('group-head')) {
          row.classList.add('group-head');
          row.classList.remove(`row-group-${groupIndex}`);
          groupIndex += 1;
          row.dataset.groupIndex = groupIndex;
        }
        col.classList.add('group-col');
      }
    });
  });
  if (el.classList.contains('sticky-top')) addStickyListeners(el, highlightOn);
}
