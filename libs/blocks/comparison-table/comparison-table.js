import { createTag } from '../../utils/utils.js';

function decorateHeader(headerContent) {
  headerContent.classList.add('header-content');
  console.log('headerContent', headerContent);

  Array.from(headerContent.children).forEach((headerItem) => {
    if (!headerItem.innerHTML) headerItem.remove();
    headerItem.classList.add('header-item');

    let lastContainedIndex = -1;
    const childrenArray = Array.from(headerItem.children);

    childrenArray.forEach((headerItemChild, index) => {
      if (headerItemChild.textContent.trim() === '-') {
        const subHeaderItemContainer = createTag('div', { class: 'sub-header-item-container' });

        for (let i = lastContainedIndex + 1; i < index; i += 1) {
          if (childrenArray[i] && childrenArray[i].textContent.trim() !== '-') {
            subHeaderItemContainer.appendChild(childrenArray[i]);
          }
        }

        headerItem.insertBefore(subHeaderItemContainer, headerItemChild);
        headerItemChild.remove();
        lastContainedIndex = index;
      }
    });

    if (lastContainedIndex < childrenArray.length - 1) {
      const finalSubHeaderItemContainer = createTag('div', { class: 'sub-header-item-container' });

      for (let i = lastContainedIndex + 1; i < childrenArray.length; i += 1) {
        if (childrenArray[i] && childrenArray[i].textContent.trim() !== '-') {
          finalSubHeaderItemContainer.appendChild(childrenArray[i]);
        }
      }

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
