import { html, useEffect, useRef, useState } from '../../libs/deps/htm-preact.js';

// const TagSelectModal = () => {};

const TagSelectDropdown = ({
  displaySearch = true,
  isOpen = false,
  options = {},
  selectedOptions = [],
  onClose,
  onSelect,
}) => {
  const [searchText, setSearchText] = useState('');
  const [hoverIndex, setHoverIndex] = useState(0);
  const [optionLength] = useState(Object.keys(options).length);
  const searchField = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('click', onDocumentClick, { once: true });
      searchField.current.focus();
    }
    setSearchText('');
  }, [isOpen]);

  const onKeyUp = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
    if (e.key === 'ArrowDown') {
      if (hoverIndex < optionLength - 1) {
        setHoverIndex(hoverIndex + 1);
      }
    }

    if (e.key === 'ArrowUp') {
      if (hoverIndex > 0) {
        setHoverIndex(hoverIndex - 1);
      }
    }

    setSearchText(e.target.value);
  };

  const onSearchChange = (e) => {
    console.log(e);
  };

  const Search = ({ placeholder = 'Search...' } = {}) => html`
      <div class="tagselect-dropdown-search">
        <input
          ref=${searchField}
          type="search"
          placeholder=${placeholder}
          value=${searchText}
          onKeyUp=${onKeyUp}
          onSearchChange=${onSearchChange}
        />
      </div>
    `;

  const onItemClick = (e) => {
    console.log(e.target.dataset.value);
    if (onSelect) {
      onSelect(e.target.dataset.value);
    }
  };

  const onDocumentClick = (e) => {
    if (isOpen && onClose && e.target.closest('.tagselect') === null) {
      onClose();
    } else {
      document.addEventListener('click', onDocumentClick, { once: true });
    }
  };

  const getItems = () => Object.entries(options).map(([value, label], index) => {
    const isDisabled = selectedOptions.indexOf(value) !== -1;
    const searchFiltered = searchText && label.toLowerCase().indexOf(searchText.toLowerCase()) === -1;

    return html`<li key=${value}>
        <div
          class="tagselect-dropdown-item ${index === hoverIndex
          && 'hover'} ${(isDisabled || searchFiltered) && 'hide'}"
          data-value=${value}
          onClick=${!isDisabled && onItemClick}
        >
          ${label}
        </div>
      </li>`;
  });

  return html`
    <div class="tagselect-dropdown ${isOpen && 'is-open'}">
      ${displaySearch && Search()}
      <div class="tagselect-dropdown-options">
        <ul>
          ${getItems()}
        </ul>
      </div>
    </div>
  `;
};

const TagSelectModal = ({ isOpen = false }) => html`<div class="tagselect-modal ${isOpen && 'is-open'}"><div>I'm a modal</div></div>`;

const TagSelect = ({
  options = {},
  modal = false,
  label = '',
  selectedOptions = [],
  onSelectedChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const onTagDelete = (ev, val) => {
    ev.preventDefault();
    ev.stopPropagation();
    const optionIndex = selectedOptions.indexOf(val);
    if (optionIndex === -1) return;
    selectedOptions.splice(optionIndex, 1);
    onSelectedChange([...selectedOptions]);
  };

  const selectedItems = [...selectedOptions].map(
    (option) => html`
      <div class="tagselect-tag">
        <span class="tagselect-tag-text">${options[option]}</span>
        <div class="tagselect-tag-delete" role="button" onClick=${(e) => onTagDelete(e, option)}>
          <svg
            height="14"
            width="14"
            viewBox="0 0 20 20"
            aria-hidden="true"
            focusable="false"
            class="tagselect-tag-closeX"
          >
            <path
              d="M14.348 14.849c-0.469 0.469-1.229 0.469-1.697 0l-2.651-3.030-2.651 3.029c-0.469 0.469-1.229 0.469-1.697 0-0.469-0.469-0.469-1.229 0-1.697l2.758-3.15-2.759-3.152c-0.469-0.469-0.469-1.228 0-1.697s1.228-0.469 1.697 0l2.652 3.031 2.651-3.031c0.469-0.469 1.228-0.469 1.697 0s0.469 1.229 0 1.697l-2.758 3.152 2.758 3.15c0.469 0.469 0.469 1.229 0 1.698z"
            ></path>
          </svg>
        </div>
      </div>
    `,
  );

  const onDropdownSelect = (val) => {
    if (selectedOptions.indexOf(val) === -1) {
      selectedOptions.push(val);
    }
    onSelectedChange([...selectedOptions]);
  };

  const onClose = () => {
    setIsOpen(false);
  };

  return html`
    <div class="tagselect">
      <label>${label}</label>
      <div class="tagselect-input" onClick=${toggleOpen}>
        <div class="tagselect-values">${selectedItems}</div>
        <div class="tagselect-add">
          <span class=${`tagselect-plus ${isOpen && 'is-open'}`}></span>
        </div>
      </div>
      ${!modal
      && html`<${TagSelectDropdown}
        isOpen=${isOpen}
        options=${options}
        selectedOptions=${selectedOptions}
        onClose=${onClose}
        onSelect=${onDropdownSelect}
      />`}
      ${modal
      && html`<${TagSelectModal}
        isOpen=${isOpen}
        options=${options}
        selectedOptions=${selectedOptions}
        onClose=${onClose}
        onSelect=${onModalSelect}
      />`}
    </div>
  `;
};

export default TagSelect;
