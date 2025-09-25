import { createTag } from '../../utils/utils.js';
import { decorateButtons } from '../../utils/decorate.js';

function createSubHeaderContainer(childrenArray, startIndex, endIndex) {
  const container = createTag('div', { class: 'sub-header-item-container' });

  for (let i = startIndex; i < endIndex; i += 1) {
    if (childrenArray[i] && childrenArray[i].textContent.trim() !== '-') {
      container.appendChild(childrenArray[i]);
    }
  }

  return container;
}

function decorateHeader(headerContent) {
  headerContent.classList.add('header-content');
  const headerContentWrapper = createTag('div', { class: 'header-content-wrapper' });

  const existingChildren = Array.from(headerContent.children);
  existingChildren.forEach((child) => headerContentWrapper.appendChild(child));
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
      if (headerItemChild.textContent.trim() === '-') {
        const subHeaderItemContainer = createSubHeaderContainer(
          childrenArray,
          lastContainedIndex + 1,
          index,
        );

        headerItem.insertBefore(subHeaderItemContainer, headerItemChild);
        headerItemChild.remove();
        lastContainedIndex = index;
      }
    });

    if (lastContainedIndex < childrenArray.length - 1) {
      const finalSubHeaderItemContainer = createSubHeaderContainer(
        childrenArray,
        lastContainedIndex + 1,
        childrenArray.length,
      );

      if (finalSubHeaderItemContainer.children.length > 0) {
        headerItem.appendChild(finalSubHeaderItemContainer);
      }
    }
  });
}

export default function init(el) {
  const children = Array.from(el.children);

  decorateHeader(children[0]);
}
