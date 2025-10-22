import { createTag, getConfig } from '../../utils/utils.js';
import { decorateButtons } from '../../utils/decorate.js';
import { replaceKeyArray } from '../../features/placeholders.js';

const COLUMN_TYPES = { PRIMARY: 'primary' };

function equalHeight(el) {
  const calculateMaxHeight = (elements) => Math.max(...elements.map((p) => p.offsetHeight
      - p.computedStyleMap().get('padding-top').value - p.computedStyleMap().get('padding-bottom').value
      - p.computedStyleMap().get('border-top-width').value - p.computedStyleMap().get('border-bottom-width').value));

  const setupHeightHandler = (handler) => {
    const resizeObserver = new ResizeObserver((entries) => {
      let shouldRecalculate = false;

      entries.forEach((entry) => {
        if (entry.contentBoxSize || entry.borderBoxSize) shouldRecalculate = true;
      });

      if (shouldRecalculate) handler();
    });

    const observeElements = () => {
      const elementsToObserve = [
        ...el.querySelectorAll('.table-cell div'),
        ...el.querySelectorAll('.sub-header-item-container'),
      ];

      elementsToObserve.forEach((element) => resizeObserver.observe(element));
    };

    observeElements();

    return resizeObserver;
  };

  const performEqualHeight = () => {
    const tableRows = el.querySelectorAll('.table-row');

    tableRows.forEach((row) => {
      const tableCells = row.querySelectorAll('.table-cell');
      if (tableCells.length === 0) return;

      const divsByPosition = [];

      tableCells.forEach((cell) => {
        const divs = cell.querySelectorAll('div');

        divs.forEach((div, index) => {
          if (!divsByPosition[index]) divsByPosition[index] = [];
          div.style.minHeight = 'auto';
          divsByPosition[index].push(div);
        });
      });

      divsByPosition.forEach((divs) => {
        if (divs.length === 0) return;

        const maxHeight = calculateMaxHeight(divs);
        divs.forEach((div) => {
          div.style.minHeight = `${maxHeight}px`;
        });
      });
    });
  };

  const performHeaderEqualHeight = () => {
    const headerItems = el.querySelector('.header-content-wrapper')?.querySelectorAll('.header-item');
    if (!headerItems.length) return;

    const containersByPosition = [];

    headerItems.forEach((headerItem) => {
      const subHeaderContainers = headerItem.querySelectorAll('.sub-header-item-container');

      subHeaderContainers.forEach((container, index) => {
        if (!containersByPosition[index]) containersByPosition[index] = [];
        container.style.minHeight = 'auto';
        containersByPosition[index].push(container);
      });
    });

    containersByPosition.forEach((containers) => {
      if (containers.length === 0) return;

      const maxHeight = calculateMaxHeight(containers);
      containers.forEach((container) => {
        container.style.minHeight = `${maxHeight}px`;
      });
    });
  };

  const headerObserver = setupHeightHandler(performHeaderEqualHeight);
  const tableObserver = setupHeightHandler(performEqualHeight);

  return () => {
    headerObserver?.disconnect();
    tableObserver?.disconnect();
  };
}

const getFirstVisibleColumnIndex = (el) => {
  const headerItems = el.querySelectorAll('.header-item[data-column-index]');
  for (let i = 0; i < headerItems.length; i += 1) {
    const item = headerItems[i];
    if (!item.classList.contains('hidden')) return +item.getAttribute('data-column-index');
  }
  return -1;
};

function syncAccessibilityHeaders(el) {
  const accessibilityHeaderRow = el.querySelector('.accessibility-header-row');
  const visibleHeaderItems = [...el.querySelectorAll('.header-item:not(.hidden)')];

  visibleHeaderItems.forEach((headerItem) => {
    const columnIndex = headerItem.getAttribute('data-column-index');
    const cell = accessibilityHeaderRow.querySelector(`[data-column-index="${columnIndex}"]`);

    if (!cell) return;

    cell.classList.remove('hidden');
    accessibilityHeaderRow.appendChild(cell);
  });

  [...accessibilityHeaderRow.querySelectorAll('.accessibility-header-cell')].forEach((cell) => {
    const columnIndex = cell.getAttribute('data-column-index');
    if (!visibleHeaderItems.some((item) => item.getAttribute('data-column-index') === columnIndex)) {
      cell.classList.add('hidden');
    }
  });
}

function createSubHeaderContainer(
  childrenArray,
  startIndex,
  endIndex,
  el,
  isLast = false,
  isFirst = false,
  headerTitles = [],
  headerItemIndex = 0,
) {
  const container = createTag('div', { class: 'sub-header-item-container' });

  for (let i = startIndex; i < endIndex; i += 1) {
    if (childrenArray[i] && childrenArray[i].textContent.trim() !== '-') {
      container.appendChild(childrenArray[i]);
      if (isLast) decorateButtons(childrenArray[i]);
    }
  }

  if (isFirst) {
    const select = createTag('select', {
      class: 'mobile-filter-select',
      name: 'column-filter',
    });

    headerTitles.forEach((title, index) => {
      if (!title
        || (headerItemIndex === 1 && index === 2)
         || (headerItemIndex === 2 && index === 1)
      ) return;

      const option = createTag('option', { value: index }, title);
      if (index === headerItemIndex) option.selected = true;
      select.appendChild(option);
    });

    select.addEventListener('change', (e) => {
      const isFirstVisible = headerItemIndex === getFirstVisibleColumnIndex(el);

      el.querySelectorAll(`[data-column-index="${headerItemIndex}"]`).forEach((col) => {
        col.classList.add('hidden');
      });
      el.querySelectorAll(`[data-column-index="${+e.target.value}"]`).forEach((col) => {
        col.classList.remove('hidden');
        const parent = col.parentNode;

        if (!isFirstVisible || !parent) return;

        const firstHeaderItem = parent.querySelector('.header-item:first-child');

        if (col.classList.contains('header-item') && firstHeaderItem !== col) {
          parent.insertBefore(col, firstHeaderItem.nextSibling);
          return;
        }

        const rowHeader = parent.querySelector('.table-row-header');
        if (rowHeader) parent.insertBefore(col, rowHeader.nextSibling);
      });

      const selectElement = el.querySelector(`[data-column-index="${+e.target.value}"] .mobile-filter-select`);
      if (selectElement) selectElement.value = +e.target.value;

      const visibleSelects = [...el.querySelectorAll('.header-item:not(.hidden) .mobile-filter-select')];

      visibleSelects.forEach((selectItem) => {
        const currentValue = +selectItem.value;

        selectItem.innerHTML = '';
        headerTitles.forEach((title, index) => {
          if (!title || visibleSelects.some((s) => s !== selectItem && +s.value === index)) return;

          const option = createTag('option', { value: index }, title);
          if (index === currentValue) option.selected = true;
          selectItem.appendChild(option);
        });
      });

      syncAccessibilityHeaders(el);
    });

    container.appendChild(select);
  }

  if (!isLast) return container;

  const actionAreaElements = container.querySelectorAll('.action-area');
  if (actionAreaElements.length > 0) {
    const btnContainer = createTag('div', { class: 'btn-container' });
    actionAreaElements.forEach((element) => btnContainer.appendChild(element));
    container.appendChild(btnContainer);
  }

  const description = container.querySelector('p:not(:has(a))');
  if (!description) container.prepend(createTag('p', { class: 'description' }));
  else description.classList.add('description');

  return container;
}

function decorateHeader(el, headerContent) {
  headerContent.classList.add('header-content');
  const headerContentWrapper = createTag('div', { class: 'header-content-wrapper' });

  [...headerContent.children].forEach((child) => headerContentWrapper.appendChild(child));
  headerContent.appendChild(headerContentWrapper);

  const headerTitles = [];
  [...headerContentWrapper.children].forEach((headerItem) => {
    const titleElement = headerItem.querySelector('h1, h2, h3, h4, h5, h6');
    headerTitles.push(titleElement ? titleElement.textContent.trim() : '');
  });

  [...headerContentWrapper.children].forEach((headerItem, headerItemIndex) => {
    if (!headerItem.innerHTML) {
      headerItem.remove();
      return;
    }

    headerItem.classList.add('header-item');
    headerItem.setAttribute('data-column-index', headerItemIndex);
    let lastContainedIndex = -1;
    const childrenArray = [...headerItem.children];
    let containerIndex = 0;

    childrenArray.forEach((headerItemChild, index) => {
      if (headerItemChild.textContent.trim() !== '-') return;

      headerItem.insertBefore(createSubHeaderContainer(
        childrenArray,
        lastContainedIndex + 1,
        index,
        el,
        false,
        containerIndex === 0,
        headerTitles,
        headerItemIndex,
      ), headerItemChild);
      headerItemChild.remove();
      lastContainedIndex = index;
      containerIndex += 1;
    });

    const finalSubHeaderItemContainer = createSubHeaderContainer(
      childrenArray,
      lastContainedIndex + 1,
      childrenArray.length,
      el,
      true,
      false,
      headerTitles,
      headerItemIndex,
    );

    if (lastContainedIndex >= childrenArray.length - 1
      || finalSubHeaderItemContainer.children.length <= 0) return;

    headerItem.appendChild(finalSubHeaderItemContainer);
  });

  headerContentWrapper.prepend(createTag('div', { class: 'header-item' }));
}

function createAccessibilityHeaderRow(el) {
  const headerRow = createTag('div', { class: 'table-row accessibility-header-row', role: 'row' });

  [...el.querySelectorAll('.header-item[data-column-index]')].forEach((headerItem) => {
    const titleElement = headerItem.querySelector('h1, h2, h3, h4, h5, h6');

    const headerCell = createTag('div', { role: 'columnheader' });
    headerCell.setAttribute('data-column-index', headerItem.getAttribute('data-column-index'));
    headerCell.classList.add('accessibility-header-cell');
    headerCell.textContent = titleElement ? titleElement.textContent.trim() : '';
    headerRow.appendChild(headerCell);
  });

  return headerRow;
}

function addTableClassesAndAppend(el, tableContainer, tableChildren) {
  const tableElement = createTag('div', { class: 'table', role: 'table' });
  const arePrimaryColumns = [];

  tableChildren.forEach((tableChild, index) => {
    if (index === 0) {
      [...tableChild.children].forEach((child, childIndex) => {
        const isPrimary = childIndex !== 0 && child.textContent.trim() === COLUMN_TYPES.PRIMARY;
        if (childIndex !== 0 && isPrimary) arePrimaryColumns[childIndex] = true;
        if (!child.textContent.trim() || isPrimary) child.remove();
      });
      tableChild.classList.add('table-column-header');

      const firstChild = tableChild.children[0];
      const buttonElement = createTag('button', { 'aria-expanded': true });
      buttonElement.innerHTML = firstChild.innerHTML;
      buttonElement.appendChild(createTag('span', { class: 'toggle-icon' }));
      buttonElement.addEventListener('click', () => {
        tableElement.classList.toggle('hide');
        buttonElement.setAttribute(
          'aria-expanded',
          buttonElement.getAttribute('aria-expanded') === 'true' ? 'false' : 'true',
        );
      });
      tableChild.replaceChild(buttonElement, firstChild);
      tableContainer.appendChild(tableChild);
      return;
    }

    [...tableChild.children].forEach((child, childIndex) => {
      child.classList.add(childIndex === 0 ? 'table-row-header' : 'table-cell');
      if (childIndex === 0) child.setAttribute('role', 'rowheader');
      if (childIndex > 0) {
        child.setAttribute('data-column-index', childIndex);
        child.setAttribute('role', 'cell');
      }
      if (arePrimaryColumns[childIndex]) child.classList.add('primary-cell');
      if (childIndex === 0) return;

      const childElements = [...child.children];
      const separatorIndex = childElements.findIndex((element) => element.textContent.trim() === '-');
      const cellDiv = createTag('div');

      if (separatorIndex !== -1) {
        const columnHeaderP = childElements[separatorIndex + 1];

        childElements.slice(0, separatorIndex).forEach((element) => cellDiv.appendChild(element));

        child.innerHTML = '';
        child.appendChild(cellDiv);

        if (columnHeaderP) child.appendChild(columnHeaderP);

        childElements.slice(separatorIndex + 2).forEach((element) => child.appendChild(element));
        return;
      }

      if (child.children.length > 1 || !child.textContent.trim()) {
        [...child.children].forEach((element) => cellDiv.appendChild(element));
      } else {
        cellDiv.appendChild(createTag('p', {}, child.textContent));
      }

      child.innerHTML = '';
      child.appendChild(cellDiv);
    });
    tableChild.classList.add('table-row');
    tableChild.setAttribute('role', 'row');
    tableElement.appendChild(tableChild);
  });

  tableElement.insertBefore(createAccessibilityHeaderRow(el), tableElement.firstChild);

  tableContainer.appendChild(tableElement);
  el.appendChild(tableContainer);
}

function decorateTables(el, children) {
  let currentTableContainer = createTag('div', { class: 'table-container' });
  let currentTableChildren = [];

  children.forEach((child) => {
    if (child.textContent.trim() === '+++' && currentTableChildren.length > 0) {
      addTableClassesAndAppend(el, currentTableContainer, currentTableChildren);
      currentTableContainer = createTag('div', { class: 'table-container' });
      currentTableChildren = [];
    }

    if (child.textContent.trim() === '+++') {
      child.remove();
      return;
    }

    currentTableChildren.push(child);
  });

  if (currentTableChildren.length === 0) return;

  addTableClassesAndAppend(el, currentTableContainer, currentTableChildren);
}

function setupResponsiveHiding(el) {
  const mediaQuery = window.matchMedia('(max-width: 899px)');

  const handleResponsive = (e) => {
    const isMobile = e ? e.matches : mediaQuery.matches;
    const headerItems = el.querySelectorAll('.header-item');

    headerItems.forEach((item, index) => {
      if (index < headerItems.length - 2) return;

      item.classList.toggle('hidden', isMobile);
    });

    const tableRows = el.querySelectorAll('.table-row');

    tableRows.forEach((row) => {
      const tableCells = row.querySelectorAll('.table-cell');

      tableCells.forEach((cell, index) => {
        if (index < tableCells.length - 2) return;

        cell.classList.toggle('hidden', isMobile);
      });
    });

    syncAccessibilityHeaders(el);
  };

  handleResponsive();
  mediaQuery.addEventListener('change', handleResponsive);
}

async function setAriaLabelForIcons(el) {
  const config = getConfig();
  const expendableIcons = el.querySelectorAll('.table-column-header button');
  const selectFilters = el.querySelectorAll('.mobile-filter-select');
  const ariaLabelElements = [...selectFilters, ...expendableIcons];

  if (!ariaLabelElements.length) {
    return;
  }

  const ariaLabels = await replaceKeyArray(['toggle-table', 'choose-table-column'], config);

  ariaLabelElements.forEach((element) => {
    const labelIndex = element.classList.contains('mobile-filter-select') ? 1 : 0;
    element.setAttribute('aria-label', ariaLabels[labelIndex]);
  });
}

function setupStickyHeader(el) {
  const headerContent = el.querySelector('.header-content');
  const firstTableContainer = el.querySelector('.table-container');

  let tableContainerOffset = 0;
  let isSticky = false;

  const calculateTableContainerOffset = () => {
    tableContainerOffset = firstTableContainer.getBoundingClientRect().top
     + (window.pageYOffset || document.documentElement.scrollTop);
  };

  const getHeaderHeight = () => {
    const header = document.querySelector('header');
    return header ? header.offsetHeight : 0;
  };

  const handleScroll = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop >= tableContainerOffset && !isSticky) {
      const headerHeight = getHeaderHeight();
      headerContent.style.top = `${headerHeight}px`;
      headerContent.classList.add('sticky');
      isSticky = true;
    }

    if (scrollTop === 0 && isSticky) {
      headerContent.classList.remove('sticky');
      headerContent.style.top = '';
      isSticky = false;
    }
  };

  const handleResize = () => {
    headerContent.style.top = `${getHeaderHeight()}px`;
  };

  setTimeout(calculateTableContainerOffset, 100);
  window.addEventListener('scroll', handleScroll);
  window.addEventListener('resize', handleResize);
}

function decorate(el) {
  const [headerChild, ...tableChildren] = [...el.children];
  decorateHeader(el, headerChild);
  decorateTables(el, tableChildren);
}

export default function init(el) {
  decorate(el);
  equalHeight(el);
  setupStickyHeader(el);
  setupResponsiveHiding(el);
  setAriaLabelForIcons(el);
}
