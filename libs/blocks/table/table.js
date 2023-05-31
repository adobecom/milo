/* eslint-disable no-plusplus */
import { createTag } from '../../utils/utils.js';
import { decorateButtons } from '../../utils/decorate.js';

let originTable;

function handleHeading(headingCols, isHighlightTable, table) {
  let highlightRow; let
    highlightRowCols;

  if (isHighlightTable) {
    highlightRow = table.querySelector('.row-1');
    highlightRowCols = highlightRow.querySelectorAll('.col');
  }

  headingCols.forEach((col, i) => {
    const isEmpty = col.innerHTML === '';
    const nextCol = headingCols[i + 1];

    if (isEmpty) {
      if (isHighlightTable && !highlightRowCols[i + 1].innerText && nextCol) {
        nextCol.classList.add('left-top-rounded');
      }
      col.classList.add('hidden');
    } else {
      const elements = col.children;
      const hasElements = elements.length > 0;

      if (!hasElements) {
        const innerText = col.innerHTML;
        col.innerHTML = `<p class="heading-title">${innerText}</p>`;
      } else {
        elements[0].classList.add('heading-title');

        if (elements[1]) {
          elements[1].classList.add('pricing');
        }

        decorateButtons(col, 'button-l');
      }

      if (nextCol && !nextCol.innerText) {
        col.classList.add('top-right-rounded');
      }
    }
  });
}

function handleHighlight(table) {
  const isHighlightTable = table.classList.contains('highlight');
  const firstRow = table.querySelector('.row-1');
  const firstRowCols = firstRow.querySelectorAll('.col');
  const secondRow = table.querySelector('.row-2');
  const secondRowCols = secondRow.querySelectorAll('.col');
  let headingCols = null;

  if (isHighlightTable) {
    firstRow.classList.add('row-highlight');
    firstRowCols.forEach((e) => e.classList.add('col-highlight'));
    secondRow.classList.add('row-heading');
    secondRowCols.forEach((e) => e.classList.add('col-heading'));
    headingCols = secondRowCols;

    firstRowCols.forEach((col, i) => {
      const hasText = secondRowCols[i].innerText && col.innerText;
      if (hasText) {
        headingCols[i].classList.add('no-rounded');
      } else {
        col.classList.add('hidden');
      }
    });
  } else {
    firstRow.classList.add('row-heading');
    firstRowCols.forEach((e) => e.classList.add('col-heading'));
    headingCols = firstRowCols;
  }

  handleHeading(headingCols, isHighlightTable, table);
  const tableHighlightLoadedEvent = new Event('milo:table:highlight:loaded');
  window.dispatchEvent(tableHighlightLoadedEvent);
}

function handleExpand(e) {
  const sectionHead = e.closest('.row');
  let nextElement = sectionHead.nextElementSibling;
  const expanded = e.getAttribute('aria-expanded') === 'false';
  e.setAttribute('aria-expanded', expanded.toString());
  while (nextElement && !nextElement.classList.contains('devider')) {
    if (expanded) {
      nextElement.classList.remove('hidden');
    } else {
      nextElement.classList.add('hidden');
    }
    nextElement = nextElement.nextElementSibling;
  }
}

function handleSection(table) {
  const isCollapseTable = table.classList.contains('collapse');
  const isHighlightTable = table.classList.contains('highlight');
  const isMerchTable = table.classList.contains('merch');
  const allRows = Array.from(table.getElementsByClassName('row'));

  let defaultExpandRow = true;

  allRows.forEach((row, i) => {
    const previousRow = allRows[i - 1];
    const nextRow = allRows[i + 1];
    const rowCols = row.querySelectorAll('.col');
    const nextRowCols = nextRow?.querySelectorAll('.col');

    if (row.querySelector('hr') && nextRow) {
      row.classList.add('devider');
      nextRow.classList.add('section-head');
      const sectionHeadTitle = nextRow.querySelector('.col-1');

      if (isMerchTable && nextRowCols) {
        nextRowCols.forEach((merchCol) => merchCol.classList.add('section-head-title'));
      } else {
        sectionHeadTitle.classList.add('section-head-title');
      }

      if (isCollapseTable) {
        const iconTag = document.createElement('span');
        iconTag.classList.add('icon', 'expand');
        sectionHeadTitle.appendChild(iconTag);

        if (defaultExpandRow) {
          iconTag.setAttribute('aria-expanded', 'true');
          defaultExpandRow = false;
        } else {
          iconTag.setAttribute('aria-expanded', 'false');
          let nextElement = row.nextElementSibling;
          while (nextElement && !nextElement.classList.contains('devider')) {
            nextElement.classList.add('hidden');
            nextElement = nextElement.nextElementSibling;
          }
        }

        iconTag.addEventListener('click', (e) => {
          handleExpand(e.target);
        });
      }
    } else if (previousRow && previousRow.querySelector('hr') && nextRow) {
      nextRow.classList.add('section-row');
      if (!isMerchTable) {
        const sectionRowTitle = nextRow.querySelector('.col-1');
        sectionRowTitle.classList.add('section-row-title');
      }
    } else if (!row.classList.contains('row-1') && (!isHighlightTable || !row.classList.contains('row-2'))) {
      row.classList.add('section-row');
      if (isMerchTable && !row.classList.contains('devider')) {
        rowCols.forEach((merchCol) => merchCol.classList.add('col-merch'));
      } else {
        const sectionRowTitle = row.querySelector('.col-1');
        sectionRowTitle.classList.add('section-row-title');
      }
    }
  });
}

function formatMerchTable(table) {
  const rows = table.querySelectorAll('.row');
  const rowsNum = rows.length;

  const firstRow = rows[0];
  const colsInRow = firstRow.querySelectorAll('.col');
  const colsInRowNum = colsInRow.length;

  for (let i = colsInRowNum; i > 0; i--) {
    const cols = table.querySelectorAll(`.col-${i}`);
    for (let j = rowsNum - 1; j >= 0; j--) {
      const currentCol = cols[j];
      if (!currentCol.innerText && currentCol.children.length === 0) {
        currentCol.classList.add('no-borders');
      } else {
        currentCol.classList.add('border-bottom');
        break;
      }
    }
  }
}

function handleMouseOut(elements) {
  elements.forEach((e) => {
    e.classList.remove('hover');
    e.classList.remove('no-top-border');
  });
}

function handleMouseOver(elements, table, colNum) {
  handleMouseOut(elements);

  const secondRow = table.querySelector('.row-2');
  const colClass = `col-${colNum}`;

  elements.forEach((e) => {
    if (e.classList.contains('col-highlight') && e.innerText) {
      const matchingCols = Array.from(e.classList).filter(
        (className) => className.startsWith(colClass),
      );
      matchingCols.forEach((className) => {
        const noTopBorderCol = secondRow.querySelector(`.${className}`);
        noTopBorderCol.classList.add('no-top-border');
      });
    }

    e.classList.add('hover');
  });
}

function handleHovering(table) {
  const row1 = table.querySelector('.row-1');
  const colsInRowNum = row1.childElementCount;

  const isMerchTable = table.classList.contains('merch');
  const startValue = isMerchTable ? 1 : 2;

  for (let i = startValue; i <= colsInRowNum; i++) {
    const elements = table.querySelectorAll(`.col-${i}`);
    elements.forEach((e) => {
      e.addEventListener('mouseover', () => handleMouseOver(elements, table, i));
      e.addEventListener('mouseout', () => handleMouseOut(elements));
    });
  }
}

function handleScrollEffect(table, gnavHeight) {
  const highlightRow = table.querySelector('.row-highlight');
  const headingRow = table.querySelector('.row-heading');

  const intercept = document.createElement('div');
  intercept.setAttribute('data-observer-intercept', '');
  headingRow.insertAdjacentElement('beforebegin', intercept);

  const observer = new IntersectionObserver(([entry]) => {
    headingRow.classList.toggle('active', !entry.isIntersecting);
    if (highlightRow) highlightRow.style.top = `${gnavHeight}px`;
    headingRow.style.top = `${gnavHeight + (highlightRow ? highlightRow.offsetHeight : 0)}px`;
  });
  observer.observe(intercept);
}

function applyStylesBasedOnScreenSize(table) {
  if (!(table instanceof Element)) {
    return;
  }

  if (!originTable) {
    originTable = table.cloneNode(true);
  }

  const desktopSize = 900;
  const mobileSize = 768;
  const screenWidth = window.innerWidth;

  const reAssignEvents = (tableEl) => {
    tableEl.querySelectorAll('.icon.expand').forEach((icon) => icon.addEventListener('click', (e) => {
      handleExpand(e.target);
    }));
    handleHovering(tableEl);
  };

  const mobileRenderer = () => {
    const isMerch = table.classList.contains('merch');
    if (isMerch) {
      table.querySelectorAll('.col:not(.col-1, .col-2)').forEach((col) => col.remove());
    } else {
      table.querySelectorAll('.col:not(.col-1, .col-2, .col-3), .col.no-borders').forEach((col) => col.remove());
    }

    const filterChangeEvent = () => {
      table.innerHTML = originTable.innerHTML;
      reAssignEvents(table);
      const filters = Array.from(table.parentElement.querySelectorAll('.filter')).map((f) => parseInt(f.value, 10));
      if (isMerch) {
        table.querySelectorAll(`.col:not(.col-${filters[0]}, .col-${filters[1]})`).forEach((col) => col.remove());
      } else {
        table.querySelectorAll(`.col:not(.col-1, .col-${filters[0] + 1}, .col-${filters[1] + 1}), .col.no-borders`).forEach((col) => col.remove());
      }
      if (filters[0] > filters[1]) {
        table.querySelectorAll('.row').forEach((row) => {
          row.querySelector('.col:not(.section-row-title, .hidden)').style.order = 1;
        });
      } else if (filters[0] === filters[1]) {
        table.querySelectorAll('.row').forEach((row) => {
          row.append(row.querySelector('.col:last-child').cloneNode(true));
        });
      }
    };

    // filter
    if (!table.parentElement.querySelector('.filters')) {
      const filters = createTag('div', { class: 'filters' });
      const filter1 = createTag('div', { class: 'filter-wrapper' });
      const filter2 = createTag('div', { class: 'filter-wrapper' });
      const colSelect0 = createTag('select', { class: 'filter' });
      const headings = originTable.querySelectorAll('.col-heading');
      headings.forEach((heading, index) => {
        const title = heading.querySelector('.heading-title');
        if (!title) return;
        const option = createTag('option');
        option.value = index;
        option.innerHTML = title.innerText;
        colSelect0.append(option);
      });
      const colSelect1 = colSelect0.cloneNode(true);
      colSelect0.dataset.filterIndex = 0;
      colSelect1.dataset.filterIndex = 1;
      const visibleCols = table.querySelectorAll('.col-heading:not([style*="display: none"], .hidden)');
      colSelect0.querySelectorAll('option').item(visibleCols.item(0).dataset.colIndex - (isMerch ? 1 : 2)).selected = true;
      colSelect1.querySelectorAll('option').item(visibleCols.item(1).dataset.colIndex - (isMerch ? 1 : 2)).selected = true;
      filter1.append(colSelect0);
      filter2.append(colSelect1);
      filters.append(filter1, filter2);
      filter1.addEventListener('change', filterChangeEvent);
      filter2.addEventListener('change', filterChangeEvent);
      table.parentElement.prepend(filters);
    }
  };

  // For Mobile
  if (screenWidth <= mobileSize) {
    mobileRenderer();
  } else if (originTable) {
    table.innerHTML = originTable.innerHTML;
    reAssignEvents(table);
  }

  const sectionRow = Array.from(table.getElementsByClassName('section-row'));
  if (sectionRow.length > 0) {
    const colsForTablet = sectionRow[0].children.length - 1;
    const percentage = 100 / colsForTablet;
    const templateColumnsValue = `repeat(auto-fit, ${percentage}%)`;

    sectionRow.forEach((row) => {
      if (screenWidth < desktopSize && screenWidth > mobileSize) {
        row.style.gridTemplateColumns = templateColumnsValue;
      } else {
        row.style.gridTemplateColumns = '';
      }
    });
  }
}

export default function init(el) {
  // remove top row if empty
  const firstRow = el.querySelector(':scope > div:first-child');
  if (firstRow.innerText.trim() === '') firstRow.remove();

  const rows = Array.from(el.children);
  rows.forEach((row, rdx) => {
    row.classList.add('row', `row-${rdx + 1}`);
    const cols = Array.from(row.children);
    cols.forEach((col, cdx) => {
      col.dataset.colIndex = cdx + 1;
      col.classList.add('col', `col-${cdx + 1}`);
    });
  });

  const isMerchTable = el.classList.contains('merch');
  const gnav = document.querySelector('header');
  const gnavHeight = gnav ? gnav.offsetHeight + 1 : 0;

  handleHighlight(el);
  handleSection(el);
  if (isMerchTable) formatMerchTable(el);

  window.addEventListener('milo:icons:loaded', () => {
    applyStylesBasedOnScreenSize(el);
    handleScrollEffect(el, gnavHeight);
    window.addEventListener('resize', () => {
      handleScrollEffect(el, gnavHeight);
      applyStylesBasedOnScreenSize(el);
      handleScrollEffect(el, gnavHeight);
    });
  });
}
