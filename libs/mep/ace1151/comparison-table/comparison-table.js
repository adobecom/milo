import { createTag, getConfig } from '../../../utils/utils.js';
import { decorateButtons } from '../../../utils/decorate.js';
import { replaceKeyArray } from '../../../features/placeholders.js';

const COLUMN_TYPES = { PRIMARY: 'primary' };

function equalHeight(el) {
  const calculateMaxHeight = (elements) => Math.max(...elements.map((p) => {
    const styles = window.getComputedStyle(p);
    return p.offsetHeight
      - parseFloat(styles.paddingTop) - parseFloat(styles.paddingBottom)
      - parseFloat(styles.borderTopWidth) - parseFloat(styles.borderBottomWidth);
  }));

  const setupHeightHandler = (handler) => {
    const resizeObserver = new ResizeObserver((entries) => {
      if (entries.some((entry) => entry.contentBoxSize || entry.borderBoxSize)) handler();
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

  const performEqualHeightForElements = (parentSelector, childSelector, targetSelector) => {
    el.querySelectorAll(parentSelector).forEach((parent) => {
      const children = parent.querySelectorAll(childSelector);
      if (!children.length) return;
      const elementsByPosition = [];

      children.forEach((child) => {
        const targets = child.querySelectorAll(targetSelector);
        targets.forEach((target, index) => {
          if (!elementsByPosition[index]) elementsByPosition[index] = [];
          target.style.minHeight = 'auto';
          elementsByPosition[index].push(target);
        });
      });

      elementsByPosition.forEach((elements) => {
        if (!elements.length) return;
        const maxHeight = calculateMaxHeight(elements);
        elements.forEach((element) => {
          element.style.minHeight = `${maxHeight}px`;
        });
      });
    });
  };

  const performEqualHeight = () => performEqualHeightForElements('.table-row', '.table-cell', 'div');
  const performHeaderEqualHeight = () => performEqualHeightForElements('.header-content-wrapper', '.header-item', '.sub-header-item-container:not(:last-of-type)');
  const performDescriptionEqualHeight = () => performEqualHeightForElements('.header-content-wrapper', '.header-item', '.description');

  const headerObserver = setupHeightHandler(performHeaderEqualHeight);
  const tableObserver = setupHeightHandler(performEqualHeight);
  const descriptionObserver = setupHeightHandler(performDescriptionEqualHeight);

  return () => {
    headerObserver?.disconnect();
    tableObserver?.disconnect();
    descriptionObserver?.disconnect();
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
    if (columnIndex !== '-1' && !visibleHeaderItems.some((item) => item.getAttribute('data-column-index') === columnIndex)) cell.classList.add('hidden');
  });
}

function updateVisibleSelects({ el, headerTitles }) {
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
}

function handleSelectChange(e, { headerItemIndex, el, headerTitles }) {
  const newValue = +e.target.value;
  const isFirstVisible = headerItemIndex === getFirstVisibleColumnIndex(el);
  el.querySelectorAll(`[data-column-index="${headerItemIndex}"]`).forEach((col) => col.classList.add('hidden'));
  el.querySelectorAll(`[data-column-index="${newValue}"]`).forEach((col) => {
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
  const selectElement = el.querySelector(`[data-column-index="${newValue}"] .mobile-filter-select`);
  if (selectElement) selectElement.value = newValue;
  updateVisibleSelects({ el, headerTitles });
  syncAccessibilityHeaders(el);
}

function createMobileFilterSelect({ headerTitles, headerItemIndex, el }) {
  const select = createTag('select', { class: 'mobile-filter-select', name: 'column-filter' });
  headerTitles.forEach((title, index) => {
    const shouldSkip = !title
      || (headerItemIndex === 1 && index === 2)
      || (headerItemIndex === 2 && index === 1);
    if (shouldSkip) return;
    const option = createTag('option', { value: index }, title);
    if (index === headerItemIndex) option.selected = true;
    select.appendChild(option);
  });
  select.addEventListener('change', (e) => handleSelectChange(e, { headerItemIndex, el, headerTitles }));
  return select;
}

function addLastContainerElements(container) {
  const actionAreaElements = container.querySelectorAll('.action-area');
  if (actionAreaElements.length > 0) {
    const btnContainer = createTag('div', { class: 'btn-container' });
    if (actionAreaElements.length > 1) btnContainer.classList.add('has-multiple');
    actionAreaElements.forEach((element) => btnContainer.appendChild(element));
    container.appendChild(btnContainer);
  }
  const description = container.querySelector('p:not(.action-area)');
  (description || container.prepend(createTag('p', { class: 'description' })) || container.firstChild).classList.add('description');
}

function createSubHeaderContainer({
  childrenArray,
  startIndex,
  endIndex,
  el,
  isLast = false,
  isFirst = false,
  headerTitles = [],
  headerItemIndex = 0,
  headerItemsCount = 0,
}) {
  const container = createTag('div', { class: 'sub-header-item-container' });
  for (let i = startIndex; i < endIndex; i += 1) {
    if (childrenArray[i] && childrenArray[i].textContent.trim() !== '-') {
      container.appendChild(childrenArray[i]);
      const em = childrenArray[i].querySelector('em');
      if (isLast
         && !(em && em.firstChild?.nodeType === Node.TEXT_NODE)) decorateButtons(childrenArray[i]);
    }
  }
  if (isFirst && headerItemsCount > 3) {
    const select = createMobileFilterSelect({ headerTitles, headerItemIndex, el });
    container.appendChild(select);
  }
  if (!isLast) return container;
  addLastContainerElements(container);
  return container;
}

function decorateHeaderItem({ headerItem, headerTitles, headerItemIndex, el, headerItemsCount }) {
  headerItem.classList.add('header-item');
  headerItem.setAttribute('data-column-index', headerItemIndex);
  const childrenArray = [...headerItem.children];
  let containerIndex = 0;
  let lastIndex = -1;

  childrenArray.forEach((child, index) => {
    if (child.textContent.trim() !== '-' && index !== childrenArray.length - 1) return;
    const separatorIndex = child.textContent.trim() === '-' ? index : childrenArray.length;
    const isLast = separatorIndex === childrenArray.length;
    const container = createSubHeaderContainer({
      childrenArray,
      startIndex: lastIndex + 1,
      endIndex: separatorIndex,
      el,
      isLast,
      isFirst: containerIndex === 0,
      headerTitles,
      headerItemIndex,
      headerItemsCount,
    });
    if (isLast) {
      headerItem.appendChild(container);
    } else {
      headerItem.insertBefore(container, childrenArray[separatorIndex]);
      childrenArray[separatorIndex].remove();
    }
    containerIndex += 1;
    lastIndex = separatorIndex;
  });
}

function decorateHeader(el, headerContent) {
  headerContent.classList.add('header-content');
  const headerContentWrapper = createTag('div', { class: 'header-content-wrapper' });
  [...headerContent.children].forEach((child) => headerContentWrapper.appendChild(child));
  headerContent.appendChild(headerContentWrapper);
  const headerItems = [...headerContentWrapper.children];
  const headerTitles = headerItems.map((item) => {
    const titleElement = item.querySelector('h1, h2, h3, h4, h5, h6');
    return titleElement ? titleElement.textContent.trim() : '';
  });
  headerItems.forEach((headerItem, headerItemIndex) => {
    if (!headerItem.innerHTML) {
      headerItem.remove();
      return;
    }
    decorateHeaderItem({
      headerItem,
      headerTitles,
      headerItemIndex,
      el,
      headerItemsCount: headerItems.length,
    });
  });
  headerContentWrapper.prepend(createTag('div', { class: 'header-item' }));
}

function createAccessibilityHeaderRow(el) {
  const headerRow = createTag('div', { class: 'table-row accessibility-header-row', role: 'row' });
  headerRow.appendChild(createTag('div', { class: 'accessibility-header-cell', role: 'cell', 'data-column-index': -1 }));
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

function decorateTableToggleButton({
  tableChild,
  arePrimaryColumns,
  tableElement,
  tableContainer,
}) {
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
    buttonElement.setAttribute('aria-expanded', buttonElement.getAttribute('aria-expanded') === 'true' ? 'false' : 'true');
  });
  tableChild.replaceChild(buttonElement, firstChild);
  tableContainer.appendChild(tableChild);
}

function setupCellAttributes(child, childIndex, arePrimaryColumns) {
  child.classList.add(childIndex === 0 ? 'table-row-header' : 'table-cell');
  if (childIndex === 0) {
    child.setAttribute('role', 'rowheader');
  } else {
    child.setAttribute('data-column-index', childIndex);
    child.setAttribute('role', 'cell');
  }
  if (arePrimaryColumns[childIndex]) child.classList.add('primary-cell');
}

function processCellWithSeparator(child, childElements, separatorIndex) {
  const cellDiv = createTag('div');
  const columnHeaderP = childElements[separatorIndex + 1];
  childElements.slice(0, separatorIndex).forEach((element) => cellDiv.appendChild(element));
  child.innerHTML = '';
  child.appendChild(cellDiv);
  if (columnHeaderP) child.appendChild(columnHeaderP);
  childElements.slice(separatorIndex + 2).forEach((element) => child.appendChild(element));
}

function processCellWithoutSeparator(child) {
  const cellDiv = createTag('div');
  if (child.children.length > 1 || !child.textContent.trim()) {
    [...child.children].forEach((element) => cellDiv.appendChild(element));
  } else {
    cellDiv.appendChild(createTag('p', {}, child.textContent));
  }
  child.innerHTML = '';
  child.appendChild(cellDiv);
}

function processCellContent(child) {
  const childElements = [...child.children];
  const separatorIndex = childElements.findIndex((element) => element.textContent.trim() === '-');
  if (separatorIndex !== -1) {
    processCellWithSeparator(child, childElements, separatorIndex);
    return;
  }
  processCellWithoutSeparator(child);
}

function decorateTableCells({ tableChild, arePrimaryColumns, tableElement }) {
  [...tableChild.children].forEach((child, childIndex) => {
    setupCellAttributes(child, childIndex, arePrimaryColumns);
    if (childIndex === 0) return;
    processCellContent(child);
  });

  tableChild.classList.add('table-row');
  tableChild.setAttribute('role', 'row');
  tableElement.appendChild(tableChild);
}

function addTableClassesAndAppend(el, tableContainer, tableChildren) {
  const tableElement = createTag('div', { class: 'table', role: 'table' });
  const arePrimaryColumns = [];

  tableChildren.forEach((tableChild, index) => {
    if (index === 0) {
      decorateTableToggleButton({ tableChild, arePrimaryColumns, tableElement, tableContainer });
      return;
    }
    decorateTableCells({ tableChild, arePrimaryColumns, tableElement });
  });
  tableElement.insertBefore(createAccessibilityHeaderRow(el), tableElement.firstChild);
  tableContainer.appendChild(tableElement);
  el.appendChild(tableContainer);
}

function decorateTables(el, children) {
  let currentTableContainer = createTag('div', { class: 'table-container' });
  let currentTableChildren = [];

  const processCurrentTable = () => {
    if (currentTableChildren.length === 0) return;
    addTableClassesAndAppend(el, currentTableContainer, currentTableChildren);
    currentTableContainer = createTag('div', { class: 'table-container' });
    currentTableChildren = [];
  };

  children.forEach((child) => {
    if (child.textContent.trim() === '+++') {
      processCurrentTable();
      child.remove();
      return;
    }
    currentTableChildren.push(child);
  });

  processCurrentTable();
}

function setupResponsiveHiding(el) {
  const mediaQuery = window.matchMedia('(max-width: 899px)');
  const hideElements = (elements, isMobile, header = false) => {
    const totalColumns = header ? elements.length - 1 : elements.length;
    if (totalColumns === 2) return;
    const visibleColumnsOnMobile = 2;
    const startIndexToHide = header ? visibleColumnsOnMobile + 1 : visibleColumnsOnMobile;

    elements.forEach((element, index) => {
      if (index < startIndexToHide) return;
      element.classList.toggle('hidden', isMobile);
    });
  };

  const reorderElementsByColumnIndex = (elements) => {
    const elementsArray = [...elements].filter((element) => element.hasAttribute('data-column-index'));
    const parent = elementsArray[0]?.parentNode;
    if (!parent) return;

    elementsArray.sort((a, b) => +a.getAttribute('data-column-index') - +b.getAttribute('data-column-index'));
    elementsArray.forEach((element) => {
      element.classList.remove('hidden');
      parent.appendChild(element);
    });
  };

  const handleResponsive = (e) => {
    const isMobile = e ? e.matches : mediaQuery.matches;

    if (!isMobile) {
      reorderElementsByColumnIndex(el.querySelectorAll('.header-item[data-column-index]'));
      el.querySelectorAll('.table-row').forEach((row) => {
        reorderElementsByColumnIndex(row.querySelectorAll('.table-cell'));
      });
    }

    hideElements(el.querySelectorAll('.header-item'), isMobile, true);
    el.querySelectorAll('.table-row').forEach((row) => hideElements(row.querySelectorAll('.table-cell'), isMobile));
    syncAccessibilityHeaders(el);
  };
  handleResponsive();
  mediaQuery.addEventListener('change', handleResponsive);
}

async function setAccessibilityLabels(el) {
  const [ariaLabel, emptyText] = await replaceKeyArray(['choose-table-column', 'empty-table-cell'], getConfig());
  [...el.querySelectorAll('.mobile-filter-select')].forEach((element) => element.setAttribute('aria-label', ariaLabel));

  [...el.querySelectorAll('.table-cell div')].forEach((cellDiv) => {
    const content = cellDiv.textContent.trim();
    const hasEmptyContent = /^-+$/.test(content);
    if (content && !hasEmptyContent) return;
    cellDiv.setAttribute('aria-label', emptyText);
    if (hasEmptyContent) cellDiv.children[0].setAttribute('aria-hidden', 'true');
  });
}

function setupStickyHeader(el) {
  if (el.classList.contains('sticky-cancel')) return;
  const headerContent = el.querySelector('.header-content');
  const firstTableContainer = el.querySelector('.table-container');
  let isSticky = false;

  const handleScroll = () => {
    const tableContainerOffset = firstTableContainer.getBoundingClientRect().top
     + (window.pageYOffset || document.documentElement.scrollTop);
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop >= tableContainerOffset && !isSticky) {
      headerContent.style.top = `${document.querySelector('header')?.offsetHeight || 0}px`;
      headerContent.classList.add('sticky');
      isSticky = true;
      if (headerContent.offsetHeight / window.innerHeight >= 0.45) headerContent.classList.remove('sticky');
    }

    if (scrollTop === 0 && isSticky) {
      headerContent.classList.remove('sticky');
      headerContent.style.top = '';
      isSticky = false;
    }
  };
  window.addEventListener('scroll', handleScroll);
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
  setAccessibilityLabels(el);
}
