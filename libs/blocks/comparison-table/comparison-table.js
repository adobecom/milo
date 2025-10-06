import { createTag, getConfig } from '../../utils/utils.js';
import { decorateButtons } from '../../utils/decorate.js';

function equalHeight(el) {
  const calculateMaxHeight = (elements) => Math.max(...elements.map((p) => p.offsetHeight
      - p.computedStyleMap().get('padding-top').value - p.computedStyleMap().get('padding-bottom').value
      - p.computedStyleMap().get('border-top-width').value - p.computedStyleMap().get('border-bottom-width').value));

  const setupHeightHandler = (handler) => {
    setTimeout(handler, 0);
    window.addEventListener('resize', handler);
  };

  const performEqualHeight = () => {
    const tableRows = el.querySelectorAll('.table-row');

    tableRows.forEach((row) => {
      const tableCells = row.querySelectorAll('.table-cell');
      if (tableCells.length === 0) return;

      const firstPTags = [];
      const secondPTags = [];

      tableCells.forEach((cell) => {
        const pTags = cell.querySelectorAll('p');
        if (pTags[0]) {
          pTags[0].style.minHeight = 'auto';
          firstPTags.push(pTags[0]);
        }

        if (!pTags[1]) return;

        pTags[1].style.minHeight = 'auto';
        secondPTags.push(pTags[1]);
      });

      if (firstPTags.length > 0) {
        const maxFirstHeight = calculateMaxHeight(firstPTags);
        firstPTags.forEach((p) => {
          p.style.minHeight = `${maxFirstHeight}px`;
        });
      }

      if (secondPTags.length === 0) return;

      const maxSecondHeight = calculateMaxHeight(secondPTags);
      secondPTags.forEach((p) => {
        p.style.minHeight = `${maxSecondHeight}px`;
      });
    });
  };

  const performHeaderEqualHeight = () => {
    const headerContentWrapper = el.querySelector('.header-content-wrapper');
    if (!headerContentWrapper) return;

    const headerItems = headerContentWrapper.querySelectorAll('.header-item');
    if (headerItems.length === 0) return;

    const firstContainers = [];
    const secondContainers = [];
    const thirdContainers = [];

    headerItems.forEach((headerItem) => {
      const subHeaderContainers = headerItem.querySelectorAll('.sub-header-item-container');

      if (subHeaderContainers[0]) {
        subHeaderContainers[0].style.minHeight = 'auto';
        firstContainers.push(subHeaderContainers[0]);
      }

      if (subHeaderContainers[1]) {
        subHeaderContainers[1].style.minHeight = 'auto';
        secondContainers.push(subHeaderContainers[1]);
      }

      if (!subHeaderContainers[2]) return;

      subHeaderContainers[2].style.minHeight = 'auto';
      thirdContainers.push(subHeaderContainers[2]);
    });

    if (firstContainers.length > 0) {
      const maxFirstHeight = calculateMaxHeight(firstContainers);
      firstContainers.forEach((container) => {
        container.style.minHeight = `${maxFirstHeight}px`;
      });
    }

    if (secondContainers.length > 0) {
      const maxSecondHeight = calculateMaxHeight(secondContainers);
      secondContainers.forEach((container) => {
        container.style.minHeight = `${maxSecondHeight}px`;
      });
    }

    if (thirdContainers.length === 0) return;

    const maxThirdHeight = calculateMaxHeight(thirdContainers);
    thirdContainers.forEach((container) => {
      container.style.minHeight = `${maxThirdHeight}px`;
    });
  };

  setupHeightHandler(performHeaderEqualHeight);
  setupHeightHandler(performEqualHeight);
}

function createSubHeaderContainer(childrenArray, startIndex, endIndex, isLast = false) {
  const container = createTag('div', { class: 'sub-header-item-container' });

  for (let i = startIndex; i < endIndex; i += 1) {
    if (childrenArray[i] && childrenArray[i].textContent.trim() !== '-') {
      container.appendChild(childrenArray[i]);
      if (isLast) decorateButtons(childrenArray[i]);
    }
  }

  if (!isLast) return container;

  const actionAreaElements = container.querySelectorAll('.action-area');
  if (actionAreaElements.length > 0) {
    const btnContainer = createTag('div', { class: 'btn-container' });
    actionAreaElements.forEach((element) => {
      btnContainer.appendChild(element);
    });
    container.appendChild(btnContainer);
  }

  const description = container.querySelector('p:not(:has(a))');
  if (!description) container.prepend(createTag('p', { class: 'description' }));
  else description.classList.add('description');

  return container;
}

function decorateHeader(headerContent) {
  headerContent.classList.add('header-content');
  const headerContentWrapper = createTag('div', { class: 'header-content-wrapper' });

  Array.from(headerContent.children).forEach((child) => headerContentWrapper.appendChild(child));
  headerContent.appendChild(headerContentWrapper);

  Array.from(headerContentWrapper.children).forEach((headerItem) => {
    if (!headerItem.innerHTML) {
      headerItem.remove();
      return;
    }

    headerItem.classList.add('header-item');
    let lastContainedIndex = -1;
    const childrenArray = Array.from(headerItem.children);

    childrenArray.forEach((headerItemChild, index) => {
      if (headerItemChild.textContent.trim() !== '-') return;

      headerItem.insertBefore(createSubHeaderContainer(
        childrenArray,
        lastContainedIndex + 1,
        index,
      ), headerItemChild);
      headerItemChild.remove();
      lastContainedIndex = index;
    });

    const finalSubHeaderItemContainer = createSubHeaderContainer(
      childrenArray,
      lastContainedIndex + 1,
      childrenArray.length,
      true,
    );

    if (lastContainedIndex >= childrenArray.length - 1
      || finalSubHeaderItemContainer.children.length <= 0) return;

    headerItem.appendChild(finalSubHeaderItemContainer);
  });

  headerContentWrapper.prepend(createTag('div', { class: 'header-item' }));
}

function addTableClassesAndAppend(el, tableContainer, tableChildren) {
  const tableElement = createTag('div', { class: 'table', role: 'table' });

  tableChildren.forEach((tableChild, index) => {
    if (index === 0) {
      Array.from(tableChild.children).forEach((child) => {
        if (child.textContent.trim()) return;

        child.remove();
      });
      tableChild.classList.add('table-column-header');

      const firstChild = tableChild.children[0];
      const buttonElement = createTag('button');
      const { miloLibs, codeRoot } = getConfig();
      buttonElement.innerHTML = `${firstChild.innerHTML}<img src="${miloLibs || codeRoot}/blocks/comparison-table/img/black-bg-minus.svg" alt="Toggle" width="28" height="28">`;
      buttonElement.addEventListener('click', () => {
        tableElement.classList.toggle('hide');
      });
      tableChild.replaceChild(buttonElement, firstChild);
      tableContainer.appendChild(tableChild);
      return;
    }

    Array.from(tableChild.children).forEach((child, childIndex) => {
      child.classList.add(childIndex === 0 ? 'table-row-header' : 'table-cell');
      child.setAttribute('role', childIndex === 0 ? 'columnheader' : 'cell');

      const hasEmptyPTag = childIndex !== 0 && child.children.length <= 1;
      if (hasEmptyPTag) child.appendChild(createTag('p'));
      if (childIndex === 0 || child.children.length > 1 || !child.textContent.trim()) return;

      const existingEmptyP = hasEmptyPTag ? child.querySelector('p:empty') : null;
      const pTag = createTag('p', {}, child.textContent);
      child.innerHTML = '';
      child.appendChild(pTag);
      if (existingEmptyP) child.appendChild(existingEmptyP);
    });
    tableChild.classList.add('table-row');
    tableChild.setAttribute('role', 'row');
    tableElement.appendChild(tableChild);
  });

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

export default function init(el) {
  const children = Array.from(el.children);

  decorateHeader(children[0]);
  decorateTables(el, children.slice(1));
  equalHeight(el);
}
