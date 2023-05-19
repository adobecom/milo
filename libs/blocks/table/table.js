import {decorateBlockText, decorateButtons, getBlockSize} from '../../utils/decorate.js';

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
    });
  });

  handleSectionHead(el);
  handleHeading(el);
  handleHovering(el);
  handleHighlight(el);
  handleScrollEffect(el);

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
      col.classList.add('highlight');
      headingCols[i].classList.add('no-rounded');
    } else {
      col.classList.add('hidden');
    }
  });
}

function handleSectionHead(table) {
  const rows = table.querySelectorAll('.row');
  rows.forEach((row, i) => {
    if (i > 1) {
      const title = row.querySelector('.col-2');
      const infoIcon = title.querySelector('.icon-info');
      const firstElementChild = title.firstElementChild;
      const isSectionHead = firstElementChild && firstElementChild === row.getElementsByTagName('strong')[0];

      if (isSectionHead) {
        title.classList.add('sectionTitle');
        row.classList.add('sectionHead');
      } else {
        title.classList.add('subSectionTitle');
        row.classList.add('subSection');
      }
    }
  });
}


function applyStylesBasedOnScreenSize(table) {
  if (!(table instanceof Element)) {
    return;
  }

  const screenWidth = window.innerWidth;
  const subSectionRows = Array.from(table.getElementsByClassName('subSection'));

  const colsForTablet = subSectionRows[0].children.length - 2;
  const percentage = 100 / colsForTablet;
  const templateColumnsValue = `repeat(auto-fit, ${percentage}%)`;

  subSectionRows.forEach(row => {
    if (screenWidth > 859) {
      row.style.gridTemplateColumns = `repeat(auto-fit, minmax(100px, 1fr))`;
    } else if (screenWidth < 860) {
      row.style.gridTemplateColumns = templateColumnsValue;
    }
    // to do: for mobile, this is hardcoded just for test
    // if (screenWidth < 500) {
    //   let toRemove = table.querySelectorAll('.col-6, .col-5');
    //   toRemove.forEach(e => e.style.display = 'none');
    //   row.style.gridTemplateColumns = `repeat(auto-fit, 50%)`;
    // }
  });
}

function handleHeading(table) {
  const row1 = table.querySelector('.row-1');
  const row2 = table.querySelector('.row-2');
  const cols1 = row1.querySelectorAll('.col');
  const cols2 = row2.querySelectorAll('.col');
  const size = getBlockSize(table);

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

        decorateButtons(col, size === 'large' ? 'button-xl' : 'button-l');
      }
    }
  });
}

function handleHovering(table) {
  const row1 = table.querySelector('.row-1');
  const colsInRowNum = row1.childElementCount;

  for (let i = 3; i <= colsInRowNum; i++) {
    const elements = table.querySelectorAll(`.col-${i}`);
    elements.forEach(e => {
      e.addEventListener('mouseover', () => handleMouseOver(elements, table));
      e.addEventListener('mouseout', () => handleMouseOut(elements));
    })
  }
}

function handleMouseOver(elements, table) {
  handleMouseOut(elements);
  elements.forEach(e => {
    if (e.classList.contains('highlight')) {
      e.classList.forEach(classname => {
        if (classname.startsWith('col-')) {
          let secondRow = table.querySelector('.row-2');
          let noTopBorderCol = secondRow.querySelector('.' + classname);
          noTopBorderCol.classList.add('no-top-border');
        }
      })
    }
    e.classList.add('hover');
  })
}

function handleMouseOut(elements) {
  elements.forEach(e => {
    e.classList.remove('hover');
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

window.addEventListener('resize', applyStylesBasedOnScreenSize);
