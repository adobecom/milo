export default function init(el) {
  // remove top row if empty
  const firstRow = el.querySelector(':scope > div:first-child');
  if (firstRow.innerText.trim() === '') firstRow.remove();

  const rows = Array.from(el.children);
  rows.forEach((row, rdx) => {
    row.classList.add(`row`, `row-${rdx + 1}`);
    const cols = Array.from(row.children);
    cols.forEach((col, cdx) => {
      col.classList.add(`col`, `col-${cdx + 1}`);
    });
  });

  const isMerchTable = el.classList.contains('merch');
  const gnav = document.querySelector('header');
  const gnavHeight = gnav.offsetHeight + 1;

  handleHighlight(el);
  handleSection(el);
  if (isMerchTable) formatMerchTable(el);
  handleHovering(el);
  handleScrollEffect(el, gnavHeight);

  window.addEventListener('resize', () => handleScrollEffect(el, gnavHeight));
  if (!isMerchTable) applyStylesBasedOnScreenSize(el);
  if (!isMerchTable) window.addEventListener('resize', () => applyStylesBasedOnScreenSize(el));
}

function handleHighlight(table) {
  const isHighlightTable = table.classList.contains('highlight');
  const firstRow = table.querySelector('.row-1');
  const firstRowCols = firstRow.querySelectorAll('.col');
  const secondRow = table.querySelector('.row-2')
  const secondRowCols = secondRow.querySelectorAll('.col');
  let headingCols = null;

  if (isHighlightTable) {
    firstRow.classList.add('row-highlight');
    firstRowCols.forEach(e => e.classList.add('col-highlight'));
    secondRow.classList.add('row-heading');
    secondRowCols.forEach(e => e.classList.add('col-heading'));
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
    firstRowCols.forEach(e => e.classList.add('col-heading'));
    headingCols = firstRowCols;
  }

  handleHeading(headingCols, isHighlightTable, table);
}

function handleHeading(headingCols, isHighlightTable, table) {
  let highlightRow, highlightRowCols;

  if (isHighlightTable) {
    highlightRow = table.querySelector('.row-1');
    highlightRowCols = highlightRow.querySelectorAll('.col');
  }

  headingCols.forEach((col, i) => {
    const isEmpty = col.innerHTML === "";
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
      nextRow.classList.add('sectionHead');
      const sectionHeadTitle = nextRow.querySelector('.col-1');

      if (isMerchTable && nextRowCols) {
        nextRowCols.forEach(merchCol => merchCol.classList.add('sectionHeadTitle'));
      } else {
        sectionHeadTitle.classList.add('sectionHeadTitle');
      }

      if (isCollapseTable) {
        const iconTag = document.createElement('span');
        iconTag.classList.add('icon', 'expand');
        sectionHeadTitle.appendChild(iconTag);

        if (defaultExpandRow) {
          iconTag.setAttribute('aria-expanded', 'true');
          defaultExpandRow =  false;
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
      nextRow.classList.add('sectionRow');
      if (!isMerchTable) {
        const sectionRowTitle = nextRow.querySelector('.col-1');
        sectionRowTitle.classList.add('sectionRowTitle');
      }
    } else {
      if (!row.classList.contains('row-1') && (!isHighlightTable || !row.classList.contains('row-2'))) {
        row.classList.add('sectionRow');
        if (isMerchTable && !row.classList.contains('devider')) {
          rowCols.forEach(merchCol => merchCol.classList.add('col-merch'));
        } else {
          const sectionRowTitle = row.querySelector('.col-1');
          sectionRowTitle.classList.add('sectionRowTitle');
        }
      }
    }
  })
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

function formatMerchTable(table) {
  const rows = table.querySelectorAll('.row');
  const rowsNum = rows.length;

  const firstRow = rows[0];
  const colsInRow = firstRow.querySelectorAll('.col');
  const colsInRowNum = colsInRow.length;

  for (let i = colsInRowNum; i > 0; i--) {
    const cols = table.querySelectorAll(`.col-${i}`);
    for (let j = rowsNum - 1; j >= 0; j--) {
      let currentCol = cols[j];
      if (!currentCol.innerText && currentCol.children.length === 0) {
        currentCol.classList.add('no-borders');
      } else {
        currentCol.classList.add('border-bottom');
        break;
      }
    }
  }
}

function handleHovering(table) {
  const row1 = table.querySelector('.row-1');
  const colsInRowNum = row1.childElementCount;

  const isMerchTable = table.classList.contains('merch');
  const startValue = isMerchTable ? 1 : 2;

  for (let i = startValue; i <= colsInRowNum; i++) {
    const elements = table.querySelectorAll(`.col-${i}`);
    elements.forEach(e => {
      e.addEventListener('mouseover', () => handleMouseOver(elements, table, i));
      e.addEventListener('mouseout', () => handleMouseOut(elements));
    })
  }
}

function handleMouseOver(elements, table, colNum) {
  handleMouseOut(elements);

  const secondRow = table.querySelector('.row-2');
  const colClass = 'col-' + colNum;

  elements.forEach(e => {
    if (e.classList.contains('col-highlight') && e.innerText) {
      const matchingCols = Array.from(e.classList).filter(className => className.startsWith(colClass));

      matchingCols.forEach(className => {
        const noTopBorderCol = secondRow.querySelector('.' + className);
        noTopBorderCol.classList.add('no-top-border');
      });
    }

    e.classList.add('hover');
  });
}

function handleMouseOut(elements) {
  elements.forEach(e => {
    e.classList.remove('hover');
    e.classList.remove('no-top-border');
  })
}

function handleScrollEffect(table, gnavHeight) {
  const highlightRow = table.querySelector('.row-highlight');
  const headingRow = table.querySelector('.row-heading');

  const intercept = document.createElement('div');
  intercept.setAttribute('data-observer-intercept', '');
  headingRow.insertAdjacentElement('beforebegin', intercept);

  const observer = new IntersectionObserver(([entry]) => {
    headingRow.classList.toggle('active', !entry.isIntersecting);
    highlightRow.style.top = gnavHeight + 'px';
    headingRow.style.top = (gnavHeight + highlightRow.offsetHeight) + 'px';
  });
  observer.observe(intercept);
}

function applyStylesBasedOnScreenSize(table) {
  if (!(table instanceof Element)) {
    return;
  }

  const screenWidth = window.innerWidth;
  const sectionRows = Array.from(table.getElementsByClassName('sectionRow'));
  if (sectionRows.length > 0 ) {
    const colsForTablet = sectionRows[0].children.length - 1;
    const percentage = 100 / colsForTablet;
    const templateColumnsValue = `repeat(auto-fit, ${percentage}%)`;

    sectionRows.forEach(row => {
      if (screenWidth > 859) {
        row.style.gridTemplateColumns = `repeat(auto-fit, minmax(100px, 1fr))`;
      } else if (screenWidth < 860) {
        row.style.gridTemplateColumns = templateColumnsValue;
      }
    });
  }
}

function decorateButtons(el, size) {
  const buttons = el.querySelectorAll('em a, strong a');
  if (buttons.length === 0) return;
  buttons.forEach((button) => {
    const parent = button.parentElement;
    const buttonType = parent.nodeName === 'STRONG' ? 'blue' : 'outline';
    button.classList.add('con-button', buttonType);
    if (size) button.classList.add(size); /* button-l, button-xl */
    parent.insertAdjacentElement('afterend', button);
    parent.remove();
  });
  const actionArea = buttons[0].closest('p, div');
  if (actionArea) {
    actionArea.classList.add('action-area');
    actionArea.nextElementSibling?.classList.add('supplemental-text', 'body-xl');
  }
}

