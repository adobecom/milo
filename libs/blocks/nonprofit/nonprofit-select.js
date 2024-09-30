/* eslint-disable chai-friendly/no-unused-expressions */
/* eslint-disable max-len */
import ReactiveStore from './reactiveStore.js';
import { getNonprofitIconTag, NONPRFIT_ICONS } from './icons.js';

export default function nonprofitSelect(props) {
  const {
    createTag,
    name,
    label,
    placeholder,
    noOptionsText = window.mph['nonprofit-no-search-result-found'],
    loadingText = window.mph['nonprofit-loading'],
    required = true,
    disabled = false,
    hideIcon = false,
    options = [],
    store,
    debounce,
    labelKey = 'label',
    valueKey = 'value',
    renderOption,
    footerTag,
  } = props;

  let onInput;
  let onSelect;

  const optionsStore = store || new ReactiveStore(options);
  let localOptions = [...options];
  let localSelection = null;

  const controlTag = createTag('div', { class: 'np-control' });
  const labelTag = createTag('label', { class: 'np-label', for: name }, label);
  const searchTag = createTag('input', {
    class: 'np-input np-select-search',
    type: 'text',
    placeholder,
    'data-for': name,
  });
  const valueTag = createTag('input', {
    class: `np-select-value${required ? ' np-required-field' : ''}`,
    name,
    type: 'hidden',
  });

  if (required) {
    searchTag.setAttribute('required', 'required');
    valueTag.setAttribute('required', 'required');
  }
  if (disabled) {
    searchTag.setAttribute('disabled', 'disabled');
    valueTag.setAttribute('disabled', 'disabled');
  }

  const listContainerTag = createTag('div', { class: 'np-select-list-container' });
  const listTag = createTag('ul', { class: 'np-select-list', 'data-for': name });

  let searchTimeout;
  let abortController;

  const showList = () => {
    listContainerTag.style.display = 'block';
  };

  const hideList = () => {
    abortController?.abort();
    listTag.scrollTop = 0;
    listContainerTag.style.display = 'none';

    // Handle loss of focus depending on whether there's a selection
    if (!localSelection) {
      searchTag.value = '';
      if (!store) {
        optionsStore.update(localOptions);
      }
    } else {
      searchTag.value = localSelection[labelKey];
      optionsStore.update([localSelection]);
    }
  };

  let hasNewInput = false;

  // Search onChange
  searchTag.addEventListener('input', () => {
    clearTimeout(searchTimeout);
    abortController?.abort();

    hasNewInput = true;

    abortController = new AbortController();
    searchTimeout = setTimeout(() => {
      onInput && onInput(searchTag.value, abortController);
      if (!store) {
        const filteredOptions = localOptions.filter((option) => option[labelKey].toLowerCase().includes(searchTag.value.toLowerCase()));
        optionsStore.update(filteredOptions);
      }
      showList();
    }, debounce);
  });

  let focusedFromList = false;
  searchTag.addEventListener('focus', () => {
    if (debounce && !searchTag.value) return;
    if (!focusedFromList) searchTag.select();
    else focusedFromList = false;
    showList();
  });

  searchTag.addEventListener('keydown', (ev) => {
    if (ev.code !== 'ArrowDown') return;
    ev.preventDefault();
    if (ev.code === 'ArrowDown') {
      const listItem = listContainerTag.querySelector('.np-select-item');
      if (listItem) listItem.focus();
    }
  });

  let rerendering = false;
  const focusOut = (ev) => {
    if (rerendering) return;
    if (!ev.relatedTarget) {
      hideList();
      return;
    }
    const selectTag = ev.relatedTarget.closest('.np-select-list-tag');
    // If the newly focused item is part of the select, don't hide list
    if (selectTag || ev.relatedTarget === searchTag) return;
    hideList();
  };

  searchTag.addEventListener('focusout', focusOut);

  let keyboardFocusedId;

  // Render select elements
  optionsStore.subscribe((storeOptions, loading) => {
    rerendering = true;

    // Empty the list
    listTag.replaceChildren();

    storeOptions.forEach((option) => {
      const itemTag = createTag('li', {
        class: 'np-select-list-tag np-select-item',
        tabindex: -1,
        'data-value': option[valueKey],
      });

      if (renderOption) {
        renderOption(option, itemTag);
      } else {
        itemTag.textContent = option[labelKey];
      }

      // Keyboard navigation and selection handing

      const selectItem = () => {
        onSelect && onSelect(option);
        searchTag.value = option[labelKey];
        valueTag.value = option[valueKey];
        valueTag.dispatchEvent(new Event('input'));
        localSelection = option;
        hasNewInput = false;
        hideList();
      };

      itemTag.addEventListener('keydown', (ev) => {
        if (!['ArrowDown', 'ArrowUp', 'Enter'].includes(ev.code)) {
          focusedFromList = true;
          searchTag.focus();
          return;
        }
        ev.preventDefault();

        // Select on Enter
        if (ev.code === 'Enter') {
          selectItem();
          return;
        }

        // Navigate on ArrowDown/Up
        let sibling;
        if (ev.code === 'ArrowDown') {
          sibling = ev.target.nextElementSibling;
        }
        if (ev.code === 'ArrowUp') {
          sibling = ev.target.previousElementSibling;
        }
        if (sibling && !sibling.classList.contains('np-select-loader')) {
          sibling.focus();
        }
      });

      itemTag.addEventListener('click', selectItem);

      itemTag.addEventListener('focus', (ev) => {
        keyboardFocusedId = ev.target.getAttribute('data-value');
      });

      itemTag.addEventListener('focusout', (ev) => {
        if (rerendering) return;
        keyboardFocusedId = null;
        focusOut(ev);
      });

      listTag.append(itemTag);
    });

    const infoTagKeydown = () => {
      focusedFromList = true;
      searchTag.focus();
    };

    if (!loading && storeOptions.length === 0) {
      const noOptionsTag = createTag(
        'div',
        { class: 'np-select-list-tag np-select-no-options', tabindex: -1 },
        noOptionsText,
      );
      noOptionsTag.addEventListener('keydown', infoTagKeydown);
      noOptionsTag.addEventListener('focusout', focusOut);
      listTag.append(noOptionsTag);
    }

    if (loading) {
      const loadingTag = createTag(
        'div',
        { class: 'np-select-list-tag np-select-loader', tabindex: -1 },
        `${loadingText}...`,
      );
      loadingTag.addEventListener('keydown', infoTagKeydown);
      loadingTag.addEventListener('focusout', focusOut);
      listTag.append(loadingTag);
    }

    if (keyboardFocusedId) {
      const itemToFocus = listTag.querySelector(`li[data-value='${keyboardFocusedId}']`);
      if (itemToFocus) itemToFocus.focus();
    }

    rerendering = false;
  });

  listContainerTag.append(listTag);
  if (footerTag) {
    listContainerTag.append(footerTag);
    footerTag.addEventListener('focusout', focusOut);
  }

  controlTag.append(labelTag, searchTag, valueTag, listContainerTag);

  if (!hideIcon) {
    const arrowIconTag = getNonprofitIconTag(NONPRFIT_ICONS.CHEVRON_DOWN);
    controlTag.append(arrowIconTag);
  }

  controlTag.onInput = (handler) => (onInput = handler);
  controlTag.onSelect = (handler) => (onSelect = handler);
  controlTag.onScroll = (handler) => {
    listTag.addEventListener('scroll', (ev) => {
      abortController = new AbortController();
      handler(ev.target, abortController, hasNewInput);
    });
  };

  controlTag.enable = () => {
    searchTag.removeAttribute('disabled');
    valueTag.removeAttribute('disabled');
  };

  controlTag.clear = (withFocus = true) => {
    searchTag.value = '';
    valueTag.value = '';
    valueTag.dispatchEvent(new Event('input'));
    localSelection = null;
    if (!store) {
      optionsStore.update(localOptions);
    }
    if (withFocus) {
      searchTag.focus();
    }
  };

  controlTag.updateOptions = (newOptions) => {
    optionsStore.update(newOptions);
    localOptions = newOptions;
  };

  controlTag.getValue = () => valueTag.value;

  return controlTag;
}
