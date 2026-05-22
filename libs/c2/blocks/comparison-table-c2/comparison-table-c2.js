import { createTag, getConfig, loadStyle } from '../../../utils/utils.js';
import { getMetadata as getSectionMetadata } from '../section-metadata/section-metadata.js';

const COLUMN_TYPES = { PRIMARY: 'primary' };

const hasTextNode = (...nodeLists) => nodeLists.some(
  (nodes) => nodes && [...nodes].some(
    (node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim(),
  ),
);

const getFirstVisibleColumnIndex = (el) => {
  const firstVisible = [...el.querySelectorAll('.header-item[data-column-index]')]
    .find((item) => !item.classList.contains('hidden'));
  return firstVisible ? parseInt(firstVisible.getAttribute('data-column-index'), 10) : -1;
};

function syncAccessibilityHeaders(el) {
  const accessibilityHeaderRow = el.querySelector('.accessibility-header-row');
  if (!accessibilityHeaderRow) return;

  const visibleHeaderItems = [...el.querySelectorAll('.header-item:not(.hidden)')];
  if (!visibleHeaderItems.length) return;

  const visibleColumnIndices = new Set(visibleHeaderItems.map((item) => item.getAttribute('data-column-index')));

  visibleHeaderItems.forEach((headerItem) => {
    const cell = accessibilityHeaderRow.querySelector(`[data-column-index="${headerItem.getAttribute('data-column-index')}"]`);
    if (!cell) return;
    cell.classList.remove('hidden');
    accessibilityHeaderRow.appendChild(cell);
  });

  [...accessibilityHeaderRow.querySelectorAll('.accessibility-header-cell')].forEach((cell) => {
    const columnIndex = cell.getAttribute('data-column-index');
    if (columnIndex !== '-1' && !visibleColumnIndices.has(columnIndex)) cell.classList.add('hidden');
  });
}

function updateVisibleSelects({ el, headerTitles }) {
  const visibleSelects = [...el.querySelectorAll('.header-item:not(.hidden) .mobile-filter-select')];
  const selectedIndices = new Set(visibleSelects.map((s) => parseInt(s.value, 10)));

  visibleSelects.forEach((selectItem) => {
    const currentValue = parseInt(selectItem.value, 10);
    selectItem.innerHTML = '';

    headerTitles.forEach((title, index) => {
      if (!title || (selectedIndices.has(index) && index !== currentValue)) return;
      const option = createTag('option', { value: index }, title);
      if (index === currentValue) option.selected = true;
      selectItem.appendChild(option);
    });
  });
}

function handleSelectChange(e, { headerItemIndex, el, headerTitles }) {
  const newValue = parseInt(e.target.value, 10);
  const isFirstVisible = headerItemIndex === getFirstVisibleColumnIndex(el);

  el.querySelectorAll(`[data-column-index="${headerItemIndex}"]`).forEach((col) => col.classList.add('hidden'));
  el.querySelectorAll(`[data-column-index="${newValue}"]`).forEach((col) => {
    col.classList.remove('hidden');
    const parent = col.parentNode;
    if (!isFirstVisible || !parent) return;
    const firstHeaderItem = parent.querySelector('.header-item:first-child');
    if (col.classList.contains('header-item') && firstHeaderItem !== col) {
      parent.prepend(col);
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
    if (!title
      || (headerItemIndex === 1 && index === 2)
      || (headerItemIndex === 2 && index === 1)) return;
    const option = createTag('option', { value: index }, title);
    if (index === headerItemIndex) option.selected = true;
    select.appendChild(option);
  });
  select.addEventListener('change', (e) => handleSelectChange(e, { headerItemIndex, el, headerTitles }));
  return select;
}

function addLastContainerElements(container) {
  const actionAreaElements = container.querySelectorAll('.action-area');
  if (actionAreaElements.length) {
    const btnContainer = createTag('div', { class: 'btn-container' });
    if (actionAreaElements.length > 1) btnContainer.classList.add('has-multiple');
    btnContainer.append(...actionAreaElements);
    container.appendChild(btnContainer);
  }
  let description = container.querySelector('p:not(.action-area)');
  if (!description) {
    description = createTag('p', { class: 'description' });
    container.prepend(description);
    return;
  }
  description.classList.add('description');
}

function createSubHeaderContainer({
  containerIndex,
  childrenArray,
  startIndex,
  endIndex,
  el,
  headerTitles = [],
  headerItemIndex = 0,
  headerItemsCount = 0,
}) {
  const container = createTag('div', { class: 'sub-header-item-container' });
  const isLast = containerIndex === 2;
  const elementsToDecorate = [];

  for (let i = startIndex; i < endIndex; i += 1) {
    if (childrenArray[i] && childrenArray[i].textContent.trim() !== '-') {
      container.appendChild(childrenArray[i]);
      const strongOrEm = childrenArray[i].querySelector('strong, em');
      if (isLast && !hasTextNode(strongOrEm?.parentElement?.childNodes, strongOrEm?.childNodes)) {
        elementsToDecorate.push(childrenArray[i]);
      }
    }
  }

  if (containerIndex === 0 && headerItemsCount > 3) {
    const select = createMobileFilterSelect({ headerTitles, headerItemIndex, el });
    const heading = container.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) {
      const headingId = `ct-col-title-${headerItemIndex}`;
      heading.id = headingId;
      select.setAttribute('aria-labelledby', headingId);
      const titleRow = createTag('div', { class: 'mobile-title-row' });
      heading.replaceWith(titleRow);
      titleRow.appendChild(heading);
    }
    container.classList.add('has-filter-select');
    container.appendChild(select);
  }
  if (!isLast) return container;

  if (!elementsToDecorate.length) {
    addLastContainerElements(container);
    return container;
  }

  import('../../../utils/decorate.js').then(({ decorateButtons }) => {
    elementsToDecorate.forEach((element) => decorateButtons(element, 'button-lg'));
    addLastContainerElements(container);
  });

  return container;
}

function decorateHeaderItem({ headerItem, headerTitles, headerItemIndex, el, headerItemsCount }) {
  headerItem.classList.add('header-item', 'header-item-card');
  headerItem.setAttribute('data-column-index', headerItemIndex);
  const childrenArray = [...headerItem.children];
  let containerIndex = 0;
  let lastIndex = -1;

  childrenArray.forEach((child, index) => {
    if (child.textContent.trim() !== '-' && index !== childrenArray.length - 1) return;
    const separatorIndex = child.textContent.trim() === '-' ? index : childrenArray.length;
    const container = createSubHeaderContainer({
      childrenArray,
      startIndex: lastIndex + 1,
      endIndex: separatorIndex,
      el,
      containerIndex,
      headerTitles,
      headerItemIndex,
      headerItemsCount,
    });
    headerItem.appendChild(container);
    childrenArray[separatorIndex]?.remove();
    containerIndex += 1;
    lastIndex = separatorIndex;
  });

  const collapsible = createTag('div', { class: 'header-item-collapsible' });
  const collapsibleInner = createTag('div');
  const subContainers = [...headerItem.querySelectorAll('.sub-header-item-container')].slice(1);
  subContainers.slice(0, -1).forEach((c) => collapsibleInner.appendChild(c));
  if (collapsibleInner.children.length) {
    collapsible.appendChild(collapsibleInner);
    headerItem.appendChild(collapsible);
  }
  const btnSection = subContainers[subContainers.length - 1];
  if (btnSection) {
    btnSection.classList.add('btn-section');
    const btnWrap = createTag('div', { class: 'btn-section-wrap' });
    const btnInner = createTag('div');
    btnInner.appendChild(btnSection);
    btnWrap.appendChild(btnInner);
    headerItem.appendChild(btnWrap);
  }
}

function decorateHeader(el, headerContent) {
  headerContent.classList.add('header-content');
  const headerContentWrapper = createTag('div', { class: 'header-content-wrapper' });
  headerContentWrapper.append(...headerContent.children);
  headerContent.append(headerContentWrapper);
  const headerItems = [...headerContentWrapper.children];
  const headerTitles = headerItems.map((item) => {
    const titleElement = item.querySelector('h1, h2, h3, h4, h5, h6');
    return titleElement ? titleElement.textContent.trim() : '';
  });
  headerItems.forEach((headerItem, headerItemIndex) => {
    if (!headerItem.innerHTML?.trim()) {
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
  const headerItemHeader = createTag('div', { class: 'header-item header-item-header' });
  headerItemHeader.appendChild(createTag('h2', { class: 'title-4' }, 'Compare plans'));
  headerContentWrapper.prepend(headerItemHeader);
  const headerCardsContainer = createTag('div', { class: 'header-cards-container' });
  const cardItems = [...headerContentWrapper.querySelectorAll('.header-item.header-item-card')];
  cardItems.forEach((card) => headerCardsContainer.appendChild(card));
  el.style.setProperty('--ct-card-count', cardItems.length);
  headerContent.after(headerCardsContainer);
}

function createAccessibilityHeaderRow(el) {
  const headerRow = createTag('div', { class: 'table-row accessibility-header-row', role: 'row' });
  headerRow.appendChild(createTag('div', { class: 'accessibility-header-cell', role: 'cell', 'data-column-index': -1 }));
  [...el.querySelectorAll('.header-item[data-column-index]')].forEach((headerItem) => {
    const titleElement = headerItem.querySelector('h1, h2, h3, h4, h5, h6');
    const headerCell = createTag('div', { role: 'columnheader' });
    headerCell.setAttribute('data-column-index', headerItem.getAttribute('data-column-index'));
    headerCell.classList.add('accessibility-header-cell');
    headerCell.textContent = titleElement?.textContent.trim() ?? '';
    headerRow.appendChild(headerCell);
  });
  return headerRow;
}

function isExpandedSection(expandMetadata, tableIndex) {
  if (!expandMetadata) return tableIndex === 0;
  if (expandMetadata === 'all') return true;
  return expandMetadata.split(',').map(
    (item) => parseInt(item.trim(), 10),
  ).includes(tableIndex + 1);
}

function decorateTableToggleButton({
  tableChild,
  arePrimaryColumns,
  tableElement,
  tableIndex,
  expandMetadata,
}) {
  [...tableChild.children].forEach((child, childIndex) => {
    const isPrimary = childIndex !== 0 && child.textContent.trim() === COLUMN_TYPES.PRIMARY;
    if (isPrimary) arePrimaryColumns[childIndex] = true;
    if (!child.textContent.trim() || isPrimary) child.remove();
  });
  tableChild.classList.add('table-column-header');
  const firstChild = tableChild.children[0];
  const isExpanded = isExpandedSection(expandMetadata, tableIndex);
  tableElement.classList.toggle('hide', !isExpanded);
  const buttonElement = createTag('button', { 'aria-expanded': !!isExpanded });

  buttonElement.innerHTML = firstChild.innerHTML;
  buttonElement.appendChild(createTag('span', { class: 'toggle-icon' }));
  buttonElement.addEventListener('click', () => {
    tableElement.classList.toggle('hide');
    buttonElement.setAttribute('aria-expanded', buttonElement.getAttribute('aria-expanded') !== 'true');
  });
  tableChild.replaceChild(buttonElement, firstChild);
  return tableChild;
}

function hasMinimalContent(el) {
  return el.querySelector('.icon') || [...el.children].every((c) => c.tagName === 'WBR');
}

function hasOnlyParagraphs(el) {
  const children = [...el.children];
  return children.length > 0
    && children.every((c) => c.tagName === 'P')
    && !el.querySelector('.icon');
}

let tooltipTriggerCount = 0;
let tooltipListenersAdded = false;

function decorateUnderlineTooltipTriggers(el) {
  el.querySelectorAll('u').forEach((u) => {
    const parts = u.textContent.split('|').map((p) => p.trim());
    const [label, position, tooltipText] = parts;

    if (!tooltipText) {
      const span = createTag('span', { class: 'dotted-underline', tabindex: '0' }, label);
      u.replaceWith(span);
      return;
    }

    tooltipTriggerCount += 1;
    const id = `ct-tooltip-${tooltipTriggerCount}`;

    const tooltipSpan = createTag('span', {
      id,
      role: 'tooltip',
      class: 'ct-tooltip-content',
    });
    tooltipSpan.append(
      createTag('span', { 'aria-label': 'Tooltip :', role: 'tooltip' }),
      tooltipText,
    );

    const trigger = createTag('a', {
      href: '#',
      class: 'dotted-underline milo-tooltip',
      'data-tooltip': tooltipText,
      'data-tooltip-position': position,
      'aria-describedby': id,
    }, label);
    trigger.addEventListener('click', (e) => e.preventDefault());

    u.replaceWith(trigger, tooltipSpan);
  });
}

function setupCellAttributes(child, childIndex, arePrimaryColumns) {
  child.classList.add(childIndex === 0 ? 'table-row-header' : 'table-cell');
  if (childIndex === 0) {
    child.setAttribute('role', 'rowheader');
    decorateUnderlineTooltipTriggers(child);
    if (hasMinimalContent(child)) child.classList.add('minimal-content');
    if (hasOnlyParagraphs(child)) child.classList.add('text-only');
  } else {
    child.setAttribute('data-column-index', childIndex);
    child.setAttribute('role', 'cell');
  }
  if (arePrimaryColumns[childIndex]) child.classList.add('primary-cell');
}

function processCellWithSeparator(child, separatorIndex) {
  const cellDiv = createTag('div');
  const columnHeaderP = [...child.children][separatorIndex + 1];
  [...child.children].slice(0, separatorIndex).forEach((element) => cellDiv.appendChild(element));
  child.innerHTML = '';
  child.appendChild(cellDiv);
  if (columnHeaderP) child.appendChild(columnHeaderP);
  [...child.children].slice(separatorIndex + 2).forEach((element) => child.appendChild(element));
}

function processCellWithoutSeparator(child) {
  const cellDiv = createTag('div');
  if (child.children.length > 1 || !child.textContent.trim()) {
    cellDiv.append(...child.childNodes);
  } else {
    cellDiv.appendChild(createTag('p', {}, child.innerHTML));
  }
  child.innerHTML = '';
  child.appendChild(cellDiv);
}

function processCellContent(child) {
  const separatorIndex = [...child.children].findIndex((element) => element.textContent.trim() === '-');
  const processFn = separatorIndex !== -1 ? processCellWithSeparator : processCellWithoutSeparator;
  processFn(child, separatorIndex);
}

function decorateTableCells({ tableChild, arePrimaryColumns, el }) {
  [...tableChild.children].forEach((child, childIndex) => {
    setupCellAttributes(child, childIndex, arePrimaryColumns);
    if (childIndex === 0) return;
    processCellContent(child);
  });

  tableChild.classList.add('table-row');
  el.dataset.childCount = tableChild.children.length;
  tableChild.setAttribute('role', 'row');
  return tableChild;
}

function decorateTable({ el, tableChildren, expandMetadata, tableIndex }) {
  const tableContainer = createTag('div', { class: 'table-container' });
  const tableElement = createTag('div', { class: 'table-body', role: 'table' });
  const arePrimaryColumns = [];

  tableChildren.forEach((tableChild, index) => {
    if (index === 0) {
      tableContainer.appendChild(decorateTableToggleButton({
        tableChild,
        arePrimaryColumns,
        tableElement,
        expandMetadata,
        tableIndex,
      }));
      return;
    }
    tableElement.appendChild(decorateTableCells({ tableChild, arePrimaryColumns, el }));
  });
  tableElement.insertBefore(createAccessibilityHeaderRow(el), tableElement.firstChild);
  arePrimaryColumns.forEach((isPrimary, colIndex) => {
    if (isPrimary) el.querySelector(`.header-item-card[data-column-index="${colIndex}"]`)?.classList.add(COLUMN_TYPES.PRIMARY);
  });
  tableContainer.appendChild(tableElement);
  return tableContainer;
}

function decorateTables(el, children) {
  const sectionMetadata = el.closest('.section')?.querySelector('.section-metadata');
  const expandMetadata = sectionMetadata ? getSectionMetadata(sectionMetadata)?.expand?.text : null;

  const tableGroups = [];
  let currentGroup = [];

  children.forEach((child) => {
    if (child.textContent.trim() === '+++') {
      if (currentGroup.length) tableGroups.push(currentGroup);
      currentGroup = [];
      child.remove();
      return;
    }
    currentGroup.push(child);
  });

  if (currentGroup.length) tableGroups.push(currentGroup);

  tableGroups.forEach((tableChildren, tableIndex) => {
    el.appendChild(decorateTable({ el, tableChildren, expandMetadata, tableIndex }));
  });
}

function setupResponsiveHiding(el) {
  const compactLayoutQuery = window.matchMedia('(max-width: 899px)');
  const hideElements = (elements, isMobile) => {
    const arr = [...elements];
    if (arr.length <= 2) return;
    arr.forEach((element, index) => {
      element.classList.toggle('hidden', isMobile && index >= 2);
    });
  };

  const reorderElementsByColumnIndex = (elements) => {
    const elementsArray = [...elements].filter((element) => element.hasAttribute('data-column-index'));
    const parent = elementsArray[0]?.parentNode;
    if (!parent) return;

    elementsArray.sort((a, b) => parseInt(a.getAttribute('data-column-index'), 10) - parseInt(b.getAttribute('data-column-index'), 10));
    elementsArray.forEach((element) => {
      element.classList.remove('hidden');
      parent.appendChild(element);
    });
  };

  const handleResponsive = (e) => {
    const isMobile = e ? e.matches : compactLayoutQuery.matches;

    if (!isMobile) {
      reorderElementsByColumnIndex(el.querySelectorAll('.header-item[data-column-index]'));
      el.querySelectorAll('.table-row').forEach((row) => {
        reorderElementsByColumnIndex(row.querySelectorAll('.table-cell'));
      });
      [...el.querySelectorAll('.header-item[data-column-index] .mobile-filter-select')].forEach((select) => {
        select.value = select?.closest('.header-item')?.getAttribute('data-column-index');
      });
    }

    el.querySelector('.header-item-header')?.classList.remove('hidden');
    hideElements(el.querySelectorAll('.header-item:not(.header-item-header)'), isMobile);
    el.querySelectorAll('.table-row').forEach((row) => hideElements(row.querySelectorAll('.table-cell'), isMobile));
    syncAccessibilityHeaders(el);
  };
  handleResponsive();
  compactLayoutQuery.addEventListener('change', handleResponsive);
}

function setAccessibilityLabels(el) {
  import('../../../features/placeholders.js').then(({ replaceKeyArray }) => {
    replaceKeyArray(['choose-table-column', 'empty-table-cell'], getConfig()).then(([ariaLabel, emptyText]) => {
      [...el.querySelectorAll('.mobile-filter-select')].forEach((element) => element.setAttribute('aria-label', ariaLabel));

      [...el.querySelectorAll('.table-cell div')].forEach((cellDiv) => {
        const content = cellDiv.textContent.trim();
        const hasEmptyContent = /^-+$/.test(content);
        if (content && !hasEmptyContent) return;
        const srOnly = createTag('span', { class: 'sr-only' }, emptyText);
        cellDiv.appendChild(srOnly);
        if (hasEmptyContent) cellDiv.children[0].setAttribute('aria-hidden', 'true');
      });
    });
  });
}

function setupCollapsingHeader(el) {
  if (el.classList.contains('static-header')) return;
  const headerContent = el.querySelector('.header-content');
  if (!headerContent) return;
  const cardsContainer = el.querySelector('.header-cards-container');
  if (!cardsContainer) return;

  let wasCollapsed = false;
  let threshold = Infinity;
  let lastScrollY = window.scrollY;
  let resizeTimer;

  const isMobile = () => window.matchMedia('(max-width: 899px)').matches;

  const getNavHeight = () => {
    const nav = document.querySelector('header > nav') ?? document.querySelector('header');
    if (!nav) return 0;
    const pos = getComputedStyle(nav).position;
    const bottom = (pos === 'fixed' || pos === 'sticky')
      ? Math.max(0, Math.round(nav.getBoundingClientRect().bottom)) : 0;
    return bottom + (document.querySelector('.feds-localnav')?.offsetHeight ?? 0);
  };

  const syncTop = () => cardsContainer.style.setProperty('--ct-nav-height', `${getNavHeight()}px`);

  const getFlowTop = () => {
    let top = 0;
    let node = cardsContainer;
    while (node && node !== document.documentElement) {
      top += node.offsetTop;
      node = node.offsetParent;
    }
    return top;
  };

  const updateMinHeight = () => {
    if (wasCollapsed) return;
    const h = isMobile() ? 0 : (cardsContainer.offsetHeight ?? 0);
    headerContent.style.minHeight = h > 0 ? `${h}px` : '';
  };

  const getStickyTop = () => parseFloat(getComputedStyle(cardsContainer).top) || 0;

  const updateThreshold = () => {
    if (wasCollapsed) return;
    threshold = getFlowTop() - getStickyTop();
  };

  const applyCollapsed = () => {
    if (wasCollapsed) return;
    wasCollapsed = true;
    if (!isMobile()) { cardsContainer.classList.add('is-collapsed'); return; }
    const firstCard = cardsContainer.querySelector('.header-item-card:not(.hidden)');
    const delta = [...(firstCard?.querySelectorAll('.header-item-collapsible, .btn-section-wrap') ?? [])]
      .reduce((sum, colEl) => sum + colEl.offsetHeight, 0);
    cardsContainer.classList.add('is-collapsed');
    const tableContainer = cardsContainer.nextElementSibling;
    if (delta > 0 && tableContainer) tableContainer.style.marginTop = `${delta}px`;
  };

  const removeCollapsed = () => {
    if (!wasCollapsed) return;
    wasCollapsed = false;
    cardsContainer.classList.remove('is-collapsed');
    const tableContainer = cardsContainer.nextElementSibling;
    if (tableContainer) tableContainer.style.marginTop = '';
  };

  window.matchMedia('(max-width: 899px)').addEventListener('change', () => {
    if (wasCollapsed) removeCollapsed();
    threshold = Infinity;
    updateMinHeight();
    syncTop();
    setTimeout(() => { threshold = getFlowTop() - getStickyTop(); }, 0);
  });

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    const goingDown = y > lastScrollY;
    lastScrollY = y;
    if (y < threshold) { if (wasCollapsed) removeCollapsed(); return; }
    if (goingDown && !wasCollapsed) applyCollapsed();
    else if (!goingDown && wasCollapsed) removeCollapsed();
  }, { passive: true });

  new ResizeObserver(() => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { updateMinHeight(); syncTop(); updateThreshold(); }, 350);
  }).observe(cardsContainer);
}

function setupTooltips(el) {
  const tooltips = el.querySelectorAll('.milo-tooltip');
  if (!tooltips.length) return;

  const mq = window.matchMedia('(max-width: 899px)');
  const applyPositions = (isMobile) => {
    tooltips.forEach((tooltip) => {
      const authoredPos = tooltip.dataset.tooltipPosition;
      tooltip.classList.remove('top', 'bottom', 'right', 'left');
      tooltip.classList.add(authoredPos || (isMobile ? 'bottom' : 'right'));
    });
  };
  applyPositions(mq.matches);
  mq.addEventListener('change', (e) => applyPositions(e.matches));

  if (!tooltipListenersAdded) {
    tooltipListenersAdded = true;
    const { base } = getConfig();
    loadStyle(`${base}/features/icons/icons.css`);
    import('../../../scripts/tooltip.js').then(({ default: addTooltipListeners }) => {
      addTooltipListeners();
    });
  }
}

function decorate(el) {
  el.classList.add('con-block');
  const [headerChild, ...tableChildren] = [...el.children];
  decorateHeader(el, headerChild);
  decorateTables(el, tableChildren);
}

export default function init(el) {
  decorate(el);
  setupCollapsingHeader(el);
  setupResponsiveHiding(el);
  setupTooltips(el);
  setAccessibilityLabels(el);
}
