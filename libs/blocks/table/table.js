export default function init(el) {
  const rows = Array.from(el.children);
  rows.forEach((row, rdx) => {
    row.classList.add(`row`, `row-${rdx + 1}`);
    const cols = Array.from(row.children);
    cols.forEach((col, cdx) => {
      col.classList.add(`col`, `col-${cdx + 1}`);
      if (rdx === 1) {
        col.classList.add('col-heading');
      }
      if (rdx === 0) {
        col.classList.add('col-highlight');
      }
    });
  });

  const isMerchTable = el.classList.contains('merch');

  handleSectionHead(el);
  handleHeading(el);
  handleHovering(el);
  handleHighlight(el);
  handleScrollEffect(el);
  if (isMerchTable) formatMerchTable(el);

  applyStylesBasedOnScreenSize(el);
  window.addEventListener('resize', () => applyStylesBasedOnScreenSize(el));
}

function handleHighlight(table) {
  const rows = table.querySelectorAll('.row');
  const highlightCols = rows[0].querySelectorAll('.col');
  const headingCols = rows[1].querySelectorAll('.col');

  highlightCols.forEach((col, i) => {
    const hasText = headingCols[i].innerText && col.innerText;

    if (hasText) {
      col.classList.add('col-highlight');
      headingCols[i].classList.add('no-rounded');
    } else {
      col.classList.add('hidden');
    }
  });
}

function handleSectionHead(table) {
  const isMerchTable = table.classList.contains('merch');

  if (isMerchTable) {
    const merchCols =  Array.from(table.querySelectorAll('.col'));
    const merhContentCols = merchCols.filter(col => !col.parentElement.classList.contains('row-1') && !col.parentElement.classList.contains('row-2'));

    merhContentCols.forEach(e => {
      if (e.firstElementChild && e.firstElementChild.tagName === 'STRONG') {
        e.classList.add('sectionTitle');
      } else {
        e.classList.add('col-merch');
      }
    });
  } else {
    const rows = table.querySelectorAll('.row');

    rows.forEach((row, i) => {
      if (i > 1) {
        const title = row.querySelector('.col-1');
        const firstElementChild = title.firstElementChild;

        if (firstElementChild && firstElementChild === row.getElementsByTagName('strong')[0]) {
          title.classList.add('sectionTitle');
          row.classList.add('sectionHead');
        } else {
          title.classList.add('subSectionTitle');
          row.classList.add('subSection');
        }
      }
    });
  }
}

function applyStylesBasedOnScreenSize(table) {
  if (!(table instanceof Element)) {
    return;
  }

  const screenWidth = window.innerWidth;
  const subSectionRows = Array.from(table.getElementsByClassName('subSection'));
  if (subSectionRows.length >0 ) {
    const colsForTablet = subSectionRows[0].children.length - 1;
    const percentage = 100 / colsForTablet;
    const templateColumnsValue = `repeat(auto-fit, ${percentage}%)`;

    subSectionRows.forEach(row => {
      if (screenWidth > 859) {
        row.style.gridTemplateColumns = `repeat(auto-fit, minmax(100px, 1fr))`;
      } else if (screenWidth < 860) {
        row.style.gridTemplateColumns = templateColumnsValue;
      }
    });
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

function handleHeading(table) {
  const row1 = table.querySelector('.row-1');
  const row2 = table.querySelector('.row-2');
  const cols1 = row1.querySelectorAll('.col');
  const cols2 = row2.querySelectorAll('.col');

  cols2.forEach((col, i) => {
    const isEmpty = col.innerHTML === "";

    if (isEmpty) {
      const nextCol = cols2[i + 1];
      nextCol.classList.add('left-top-rounded');
      col.classList.add('no-borders');
      cols1[i].classList.add('no-borders');
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
    }
  });
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

function handleScrollEffect(table) {
  const header = table.querySelector('.row-2');
  const intercept = document.createElement('div');
  intercept.setAttribute('data-observer-intercept', '');
  header.insertAdjacentElement('beforebegin', intercept);
  const observer = new IntersectionObserver(([entry]) => {
    header.classList.toggle('active', !entry.isIntersecting);
  });
  observer.observe(intercept);
}

export function decorateButtons(el, size) {
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

window.addEventListener('resize', applyStylesBasedOnScreenSize);
