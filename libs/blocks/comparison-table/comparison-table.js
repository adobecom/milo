import { createTag } from '../../utils/utils.js';
import { decorateButtons } from '../../utils/decorate.js';

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
      buttonElement.innerHTML = firstChild.innerHTML;
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
}
