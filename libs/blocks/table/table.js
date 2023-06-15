/* eslint-disable no-plusplus */
import { createTag } from '../../utils/utils.js';
import { decorateButtons } from '../../utils/decorate.js';

const DESKTOP_SIZE = 900;
const MOBILE_SIZE = 768;
const tableHighlightLoadedEvent = new Event('milo:table:highlight:loaded');

function defineDeviceByScreenSize() {
  const screenWidth = window.innerWidth;
  if (screenWidth >= DESKTOP_SIZE) {
    return 'DESKTOP';
  }
  if (screenWidth <= MOBILE_SIZE) {
    return 'MOBILE';
  }
  return 'TABLET';
}

function handleHeading(headingCols) {
  headingCols.forEach((col) => {
    if (!col.innerHTML) return;

    const elements = col.children;
    if (!elements.length) {
      col.innerHTML = `<p class="heading-title">${col.innerHTML}</p>`;
    } else {
      let textStartIndex = 0;
      if (elements[0]?.querySelector('img')) {
        textStartIndex += 1;
      }
      elements[textStartIndex]?.classList.add('heading-title');

      if (elements[textStartIndex + 1]) {
        elements[textStartIndex + 1].classList.add('pricing');
      }

      decorateButtons(col, 'button-l');

      const buttonsWrapper = createTag('div', { class: 'buttons-wrapper' });
      col.append(buttonsWrapper);
      const buttons = col.querySelectorAll('.con-button');

      buttons.forEach((btn) => {
        const btnWrapper = btn.closest('P');
        buttonsWrapper.append(btnWrapper);
      });
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
      const hasText = headingCols[i]?.innerText && col.innerText;
      if (hasText) {
        headingCols[i].classList.add('no-rounded');
      } else if (!headingCols[i]?.innerText) {
        col.classList.add('hidden');
        headingCols[i]?.classList.add('hidden');
      } else {
        col.classList.add('hidden');
        if (headingCols[i - 1] && !headingCols[i - 1]?.innerText) {
          headingCols[i]?.classList.add('top-left-rounded');
        }
      }
    });
  } else {
    headingCols = firstRowCols;
    firstRow.classList.add('row-heading');

    headingCols.forEach((e, i) => {
      e.classList.add('col-heading');

      if (e.innerText) {
        if (headingCols[i - 1] && !headingCols[i - 1].innerText) {
          e.classList.add('top-left-rounded');
        }
      } else {
        e.classList.add('hidden');
      }
    });
  }

  handleHeading(headingCols);
  table.dispatchEvent(tableHighlightLoadedEvent);
}

function handleExpand(e) {
  const sectionHead = e.closest('.row');
  let nextElement = sectionHead.nextElementSibling;
  const expanded = e.getAttribute('aria-expanded') === 'false';
  e.setAttribute('aria-expanded', expanded.toString());
  while (nextElement && !nextElement.classList.contains('divider')) {
    if (expanded) {
      nextElement.classList.remove('hidden');
    } else {
      nextElement.classList.add('hidden');
    }
    nextElement = nextElement.nextElementSibling;
  }
}

function handleSection(table) {
  const isCollapseTable = table.classList.contains('collapse') && !table.classList.contains('merch');
  const isHighlightTable = table.classList.contains('highlight');
  const isMerch = table.classList.contains('merch');
  const allRows = Array.from(table.getElementsByClassName('row'));

  let defaultExpandRow = true;

  allRows.forEach((row, i) => {
    const previousRow = allRows[i - 1];
    const nextRow = allRows[i + 1];
    const rowCols = row.querySelectorAll('.col');
    const nextRowCols = nextRow?.querySelectorAll('.col');

    if (row.querySelector('hr') && nextRow) {
      row.classList.add('divider');
      nextRow.classList.add('section-head');
      const sectionHeadTitle = nextRow.querySelector('.col-1');

      if (isMerch && nextRowCols) {
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
          while (nextElement && !nextElement.classList.contains('divider')) {
            nextElement.classList.add('hidden');
            nextElement = nextElement.nextElementSibling;
          }
        }
      }
    } else if (previousRow && previousRow.querySelector('hr') && nextRow) {
      nextRow.classList.add('section-row');
      if (!isMerch) {
        const sectionRowTitle = nextRow.querySelector('.col-1');
        sectionRowTitle.classList.add('section-row-title');
      }
    } else if (!row.classList.contains('row-1') && (!isHighlightTable || !row.classList.contains('row-2'))) {
      row.classList.add('section-row');
      if (isMerch && !row.classList.contains('divider')) {
        rowCols.forEach((merchCol) => {
          merchCol.classList.add('col-merch');
          const children = Array.from(merchCol.children);
          const merchContent = createTag('div', { class: 'col-merch-content' });

          if (children.length) {
            children.forEach((child) => {
              if (!child.querySelector('.icon')) {
                merchContent.append(child);
              }
            });
            merchCol.insertBefore(merchContent, merchCol.firstChild);
          } else if (merchCol.innerText) {
            const pTag = createTag('p', { class: 'merch-col-text' });
            pTag.append(merchCol.innerText);
            merchCol.innerText = '';
            merchContent.append(pTag);
            merchCol.append(merchContent);
          }
        });
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
      if (!currentCol?.innerText && currentCol?.children.length === 0) {
        currentCol.classList.add('no-borders');
      } else {
        currentCol?.classList.add('border-bottom');
        break;
      }
    }
  }
}

function handleMouseOut(cols) {
  cols.forEach((e) => {
    e.classList.remove('hover');
    e.classList.remove('no-top-border');
    e.classList.remove('hover-border-bottom');
  });
}

function handleMouseOver(cols, table, colNum, isCollapseTable, lastSectionHead, lastExpandIcon) {
  handleMouseOut(cols);

  const headingRow = table.querySelector('.row-heading');
  const colClass = `col-${colNum}`;
  const isLastRowCollapsed = lastExpandIcon?.getAttribute('aria-expanded') === 'false';

  cols.forEach((e) => {
    if (e.classList.contains('col-highlight') && e.innerText) {
      const matchingCols = Array.from(e.classList).filter(
        (className) => className.startsWith(colClass),
      );
      matchingCols.forEach((className) => {
        const noTopBorderCol = headingRow.querySelector(`.${className}`);
        noTopBorderCol.classList.add('no-top-border');
      });
    }

    if (isCollapseTable && isLastRowCollapsed) {
      const lastSectionHeadCol = lastSectionHead.querySelector(`.col-${colNum}`);
      lastSectionHeadCol.classList.add('hover-border-bottom');
    }

    e.classList.add('hover');
  });
}

function handleHovering(table) {
  const row1 = table.querySelector('.row-1');
  const colsInRowNum = row1.childElementCount;
  const isMerch = table.classList.contains('merch');
  const startValue = isMerch ? 1 : 2;
  const isCollapseTable = table.classList.contains('collapse');
  const sectionHeads = table.querySelectorAll('.section-head');
  const lastSectionHead = sectionHeads[sectionHeads.length - 1];
  const lastExpandIcon = lastSectionHead.querySelector('.icon.expand');

  for (let i = startValue; i <= colsInRowNum; i++) {
    const cols = table.querySelectorAll(`.col-${i}`);
    cols.forEach((e) => {
      e.addEventListener('mouseover', () => handleMouseOver(cols, table, i, isCollapseTable, lastSectionHead, lastExpandIcon));
      e.addEventListener('mouseout', () => handleMouseOut(cols));
    });
  }
}

function handleScrollEffect(table, gnavHeight) {
  const highlightRow = table.querySelector('.row-highlight');
  const headingRow = table.querySelector('.row-heading');

  if (highlightRow) {
    highlightRow.style.top = `${gnavHeight}px`;
    highlightRow.style.borderTop = '1px solid transparent';
  } else {
    headingRow.style.borderTop = '1px solid transparent';
  }
  headingRow.style.top = `${gnavHeight + (highlightRow ? highlightRow.offsetHeight : 0)}px`;

  const intercept = table.querySelector('.intercept') || document.createElement('div');
  intercept.className = 'intercept';
  intercept.setAttribute('data-observer-intercept', '');
  table.append(intercept);
  headingRow.insertAdjacentElement('beforebegin', intercept);

  const observer = new IntersectionObserver(([entry]) => {
    headingRow.classList.toggle('active', !entry.isIntersecting);
  });
  observer.observe(intercept);
}

function applyStylesBasedOnScreenSize(table, originTable) {
  const isMerch = table.classList.contains('merch');
  const deviceBySize = defineDeviceByScreenSize();

  const reAssignEvents = (tableEl) => {
    tableEl.dispatchEvent(tableHighlightLoadedEvent);
    tableEl.querySelectorAll('.icon.expand').forEach((icon) => icon.addEventListener('click', (e) => {
      handleExpand(e.target);
    }));
    handleHovering(tableEl);
  };

  const mobileRenderer = () => {
    if (isMerch && table.querySelectorAll('.row-heading .col').length > 2) {
      table.querySelectorAll('.col:not(.col-1, .col-2)').forEach((col) => col.remove());
    } else if (table.querySelectorAll('.row-heading .col').length > 3) {
      table.querySelectorAll('.col:not(.col-1, .col-2, .col-3), .col.no-borders').forEach((col) => col.remove());
    }

    const filterChangeEvent = () => {
      table.innerHTML = originTable.innerHTML;
      reAssignEvents(table);
      const filters = Array.from(table.parentElement.querySelectorAll('.filter')).map((f) => parseInt(f.value, 10));
      const headings = table.querySelectorAll('.row-heading .col');
      const highlights = table.querySelectorAll('.row-highlight .col');

      if (isMerch) {
        table.querySelectorAll(`.col:not(.col-${filters[0] + 1}, .col-${filters[1] + 1})`).forEach((col) => col.remove());
      } else {
        table.querySelectorAll(`.col:not(.col-1, .col-${filters[0] + 1}, .col-${filters[1] + 1}), .col.no-borders`).forEach((col) => col.remove());
      }
      if (filters[0] > filters[1]) {
        if (isMerch) {
          table.querySelectorAll('.row').forEach((row) => {
            row.querySelector('.col:not(.section-row-title)').style.order = 1;
          });
        } else {
          table.querySelectorAll('.row').forEach((row) => {
            row.querySelector('.col:not(.section-row-title, .col-1)').style.order = 1;
          });
        }
      } else if (filters[0] === filters[1]) {
        table.querySelectorAll('.row').forEach((row) => {
          row.append(row.querySelector('.col:last-child').cloneNode(true));
        });
      }

      highlights.forEach((highlight, index) => {
        if (!highlight.innerHTML && !headings[index + 1]?.classList.contains('hidden')) {
          table.querySelector('.row-heading').querySelectorAll(`.col-${index + 1}`).forEach((heading) => {
            heading.classList.add('top-left-rounded', 'top-right-rounded');
          });
        }
      });
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
        if (!title || (!isMerch && title.closest('.col-1'))) return;

        const option = createTag('option');
        option.value = index;
        option.innerHTML = title.innerText;
        colSelect0.append(option);
      });
      const colSelect1 = colSelect0.cloneNode(true);
      colSelect0.dataset.filterIndex = 0;
      colSelect1.dataset.filterIndex = 1;
      const visibleCols = table.querySelectorAll(`.col-heading:not([style*="display: none"], .hidden${isMerch ? '' : ', .col-1'})`);
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

  // For Mobile (else: tablet / desktop)
  if (deviceBySize === 'MOBILE' || (isMerch && deviceBySize === 'TABLET')) {
    mobileRenderer();
  } else {
    table.innerHTML = originTable.innerHTML;
    reAssignEvents(table);
    table.parentElement.querySelectorAll('.filters select').forEach((select, index) => {
      select.querySelectorAll('option').item(index).selected = true;
    });
  }

  const sectionRow = Array.from(table.getElementsByClassName('section-row'));
  if (sectionRow.length > 0) {
    const colsForTablet = sectionRow[0].children.length - 1;
    const percentage = 100 / colsForTablet;
    const templateColumnsValue = `repeat(auto-fit, ${percentage}%)`;
    sectionRow.forEach((row) => {
      if (isMerch) {
        row.style.gridTemplateColumns = '';
      } else if (deviceBySize === 'TABLET') {
        row.style.gridTemplateColumns = templateColumnsValue;
      } else {
        row.style.gridTemplateColumns = '';
      }
    });
  }
}

export default function init(el) {
  const rows = Array.from(el.children);
  rows.forEach((row, rdx) => {
    row.classList.add('row', `row-${rdx + 1}`);
    const cols = Array.from(row.children);
    cols.forEach((col, cdx) => {
      col.dataset.colIndex = cdx + 1;
      col.classList.add('col', `col-${cdx + 1}`);
    });
  });

  const isMerch = el.classList.contains('merch');
  const isStickyHeader = el.classList.contains('sticky');
  const gnav = document.querySelector('header');
  const gnavHeight = gnav ? gnav.offsetHeight : 0;

  handleHighlight(el);
  handleSection(el);
  if (isMerch) formatMerchTable(el);

  window.addEventListener('milo:icons:loaded', () => {
    let originTable;
    if (el.querySelectorAll(`.col-heading:not(.hidden${isMerch ? '' : ', .col-1'})`).length > 2) {
      originTable = el.cloneNode(true);
    } else {
      originTable = el;
    }

    const windowResized = () => {
      applyStylesBasedOnScreenSize(el, originTable);
      if (isStickyHeader) handleScrollEffect(el, gnavHeight);
    };
    windowResized();

    let deviceBySize = defineDeviceByScreenSize();
    window.addEventListener('resize', () => {
      if (deviceBySize === defineDeviceByScreenSize()) return;
      deviceBySize = defineDeviceByScreenSize();
      windowResized();
    });
  });
}
