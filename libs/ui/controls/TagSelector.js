import { html, useEffect, useRef, useState } from '../../deps/htm-preact.js';
import { getConfig, loadStyle } from '../../utils/utils.js';
import createPortal from '../../deps/portal.js'; // '../../deps/portal.js';
import useOnClickOutside from '../../hooks/useOnClickOutside.js';
import useLockBodyScroll from '../../hooks/useLockBodyScroll.js';
import useDebounce from '../../hooks/useDebounce.js';

const { miloLibs, codeRoot } = getConfig();
loadStyle(`${miloLibs || codeRoot}/ui/controls/tagSelector.css`);

const TagSelectDropdown = ({
  close,
  displaySearch = true,
  onSelect,
  options = {},
  value = [],
  tagSelectRef,
}) => {
  const [searchText, setSearchText] = useState('');
  const [hoverIndex, setHoverIndex] = useState(0);
  const [optionLength] = useState(Object.keys(options).length);
  const searchField = useRef(null);

  useEffect(() => {
    searchField.current.focus();
    setSearchText('');
  }, []);

  useOnClickOutside(tagSelectRef, close);

  const onKeyUp = (e) => {
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

  const Search = ({ placeholder = 'Search...' } = {}) => html`
    <div class="tagselect-dropdown-search">
      <input
        ref=${searchField}
        type="search"
        placeholder=${placeholder}
        value=${searchText}
        onKeyUp=${onKeyUp}
      />
    </div>
  `;

  const onItemClick = (e) => {
    if (onSelect) onSelect(e.target.dataset.value);
  };

  const getItems = () => Object.entries(options)
    .sort(([, a], [, b]) => {
      const labelA = a.toLowerCase();
      const labelB = b.toLowerCase();
      if (labelA < labelB) return -1;
      if (labelA > labelB) return 1;
      return 0;
    })
    .map(([labelVal, label], index) => {
      const isDisabled = value.includes(labelVal);
      const searchFiltered = searchText
        && label.toLowerCase().indexOf(searchText.toLowerCase()) === -1;

      return html`
          <li key=${labelVal}>
            <div
              class="tagselect-dropdown-item ${index === hoverIndex && 'hover'} ${(isDisabled
                || searchFiltered)
              && 'hide'}"
              data-value=${labelVal}
              onClick=${!isDisabled && onItemClick}
            >
              ${label}
            </div>
          </li>
        `;
    });

  return html`
    <div class="tagselect-dropdown is-open">
      ${displaySearch && Search()}
      <div class="tagselect-dropdown-options">
        <ul>
          ${getItems()}
        </ul>
      </div>
    </div>
  `;
};

const TagSelectModal = ({
  close,
  onToggle,
  options = {},
  optionMap = {},
  singleSelect = false,
  value = [],
}) => {
  const [columns, setColumns] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const modalRef = useRef(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useOnClickOutside(modalRef, close);
  useLockBodyScroll();

  useEffect(() => {
    setColumns([getCols(options)]);
  }, []);

  useEffect(() => {
    if (debouncedSearchTerm && debouncedSearchTerm.length > 2) {
      setIsSearching(true);
    } else {
      setIsSearching(false);
    }
  }, [debouncedSearchTerm]);

  const onCheck = (e) => {
    e.preventDefault();
    const inputEl = e.currentTarget.firstChild;

    if (singleSelect) {
      onToggle(inputEl.id);
      close();
      return;
    }

    if (inputEl.classList.contains('checked')) {
      inputEl.classList.remove('checked');
    } else {
      inputEl.classList.add('checked');
    }
    onToggle(inputEl.id);
  };

  const onExpand = (e) => {
    if (e.target.type === 'checkbox') {
      onCheck(e);
      return;
    }

    const itemEl = e.target.classList.contains('tagselect-item')
      ? e.target
      : e.target.parentElement;

    itemEl.parentElement.childNodes.forEach((node) => node.classList.remove('expanded'));
    itemEl.classList.add('expanded');

    const cols = [];
    const addColumn = (option) => {
      cols.unshift(getCols(option));
      if (option.parent) {
        addColumn(option.parent);
      }
    };

    const { key: selectedKey } = itemEl.dataset;
    addColumn(optionMap[selectedKey]);
    cols.unshift(getCols(options)); // add the root

    setColumns(cols);
  };

  const getCols = (root) => {
    const items = Object.entries(root.children || root).map(([id, option]) => {
      const isChecked = value.includes(id);
      return html`
        <div
          class="tagselect-item"
          key=${id}
          data-key=${id}
          onClick=${option.children ? onExpand : onCheck}
        >
          <input id=${id} type="checkbox" class="cb ${isChecked ? 'checked' : ''}" /><label
            class="label"
            >${option.label.replace('&amp;', '&')}</label
          ><span class=${option.children ? 'has-children' : ''}></span>
        </div>
      `;
    });
    return html`<div class="col">${items}</div>`;
  };

  const getSearchResults = () => {
    const lowerSearchTerm = debouncedSearchTerm.toLowerCase();
    return Object.entries(optionMap)
      .filter(([, { label }]) => label.toLowerCase().includes(lowerSearchTerm))
      .map(([id, { label, path }]) => {
        const isChecked = value.includes(id);

        return html`
          <div class="search-item" onClick=${onCheck}>
            <input id=${id} type="checkbox" class="cb ${isChecked ? 'checked' : ''}" />
            <label>
              <span class="label">${label}</span>
              <span class="path">${path}</span>
            </label>
          </div>
        `;
      });
  };

  return html`
    <div class="tagselect-modal-overlay">
      <div class="tagselect-modal" ref=${modalRef}>
        <input
          class="tagselect-modal-search"
          placeholder="Search..."
          onInput=${(e) => setSearchTerm(e.target.value)}
          type="search"
        />
        <button class="tagselect-modal-close" onClick=${close}></button>
        ${!isSearching && html`<div class="tagselect-modal-cols">${columns}</div>`}
        ${isSearching && html`<div class="tagselect-modal-table">${getSearchResults()}</div>`}
      </div>
    </div>
  `;
};

const createOptionMap = (root) => {
  const newOptionMap = {};
  const parseNode = (nodes, parent) => {
    Object.entries(nodes).forEach(([key, val]) => {
      newOptionMap[key] = val;
      if (parent) {
        newOptionMap[key].parent = parent;
      }
      if (val.children) {
        parseNode(val.children, val);
      }
    });
  };
  parseNode(root);
  return newOptionMap;
};

const getModalDiv = () => {
  let div = document.querySelector('#tagselect-modal-container');
  if (!div) {
    div = document.createElement('div');
    div.id = 'tagselect-modal-container';
    document.body.appendChild(div);
  }
  return div;
};

const TagSelect = ({
  label = '',
  onChange,
  options = {},
  value = [],
  singleSelect = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isModal, setIsModal] = useState(false);
  const [modalDiv, setModalDiv] = useState();
  const [optionMap, setOptionMap] = useState({});
  const tagSelectRef = useRef(null);

  useEffect(() => {
    const hasNestedData = Object.values(options).some((val) => typeof val !== 'string');
    setIsModal(hasNestedData);
    if (hasNestedData) {
      setOptionMap(createOptionMap(options));
      setModalDiv(getModalDiv());
    } else {
      setOptionMap(options);
    }

    if (!Array.isArray(value)) {
      onChange([]);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      const escClose = (e) => {
        if (e.key === 'Escape') {
          toggleOpen();
        }
      };
      document.addEventListener('keyup', escClose);
      return () => document.removeEventListener('keyup', escClose);
    }
  }, [isOpen]);

  const toggleOpen = () => setIsOpen(!isOpen);

  const selectedItems = [...value].map((option) => {
    if (!optionMap[option]) return null;
    const path = optionMap[option].path
      ? optionMap[option].path
      : optionMap[option];
    return html`
      <div class="tagselect-tag">
        <span class="tagselect-tag-text">${path.replace('&amp;', '&')}</span>
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
    `;
  });

  const addOption = (val) => {
    if (!value.includes(val)) {
      value.push(val);
    }
    onChange(singleSelect ? [val] : [...value]);
  };

  const removeOption = (val) => {
    const optionIndex = value.indexOf(val);
    if (optionIndex === -1) return;
    value.splice(optionIndex, 1);
    onChange([...value]);
  };

  const onTagDelete = (ev, val) => {
    ev.preventDefault();
    ev.stopPropagation();
    removeOption(val);
  };

  const onToggle = (val) => {
    if (value.includes(val)) {
      removeOption(val);
    } else {
      addOption(val);
    }
  };

  return html`
    <div class="tagselect" ref=${tagSelectRef}>
      <label>${label}</label>
      <div class="tagselect-input" onClick=${toggleOpen}>
        <div class="tagselect-values">${selectedItems}</div>
        <div class="tagselect-add">
          <span class=${`tagselect-plus ${isOpen && 'is-open'}`}></span>
        </div>
      </div>
      ${!isModal
        && isOpen
        && html`<${TagSelectDropdown}
          options=${options}
          value=${value}
          close=${toggleOpen}
          onSelect=${addOption}
          tagSelectRef=${tagSelectRef}
        />`}
      ${isModal
        && isOpen
        && createPortal(
          html`<${TagSelectModal}
            isOpen=${isOpen}
            options=${options}
            optionMap=${optionMap}
            value=${value}
            close=${toggleOpen}
            onToggle=${onToggle}
            singleSelect=${singleSelect}
          />`,
          modalDiv,
        )}
    </div>
  `;
};

export default TagSelect;
