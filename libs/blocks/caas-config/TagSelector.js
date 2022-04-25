import { html, useEffect, useRef, useState } from '../../libs/deps/htm-preact.js';
import createPortal from '../../libs/deps/portal.js';
import useOnClickOutside from '../../libs/hooks/useOnClickOutside.js';
import useLockBodyScroll from '../../libs/hooks/useLockBodyScroll.js';
import useDebounce from '../../libs/hooks/useDebounce.js';

const TagSelectDropdown = ({
  close,
  displaySearch = true,
  onSelect,
  options = {},
  selectedOptions = [],
  tagSelectRef,
}) => {
  const [searchText, setSearchText] = useState('');
  const [hoverIndex, setHoverIndex] = useState(0);
  const [optionLength] = useState(Object.keys(options).length);
  const searchField = useRef(null);

  console.log('OPT:', options);

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

  const getItems = () =>
    Object.entries(options)
      .sort(([, a], [, b]) => {
        const labelA = a.toLowerCase();
        const labelB = b.toLowerCase();
        if (labelA < labelB) return -1;
        if (labelA > labelB) return 1;
        return 0;
      })
      .map(([value, label], index) => {
        const isDisabled = selectedOptions.includes(value);
        const searchFiltered =
          searchText && label.toLowerCase().indexOf(searchText.toLowerCase()) === -1;

        return html`<li key=${value}>
          <div
            class="tagselect-dropdown-item ${index === hoverIndex && 'hover'} ${(isDisabled ||
              searchFiltered) &&
            'hide'}"
            data-value=${value}
            onClick=${!isDisabled && onItemClick}
          >
            ${label}
          </div>
        </li>`;
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
  selectedOptions = [],
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

    const { key, parents: parentStr } = itemEl.dataset;

    const newColumns = () => {
      if (!parentStr) {
        return [getCols(options), getCols(options[key].children)];
      } else {
        const parents = parentStr.split(',');
        parents.push(key);

        let currentOption = options; // option root
        const firstColumn = [getCols(options)];
        return parents.reduce((cols, p) => {
          currentOption = currentOption[p].children;
          cols.push(getCols(currentOption));
          return cols;
        }, firstColumn);
      }
    };

    setColumns(newColumns);
  };

  const getCols = (root) => {
    const items = Object.entries(root).map(([id, option]) => {
      const isChecked = selectedOptions.includes(id);
      return html`<div
        class="tagselect-item"
        key=${id}
        data-key=${id}
        data-parents=${option.parents}
        onClick=${option.children ? onExpand : onCheck}
      >
        <input id=${id} type="checkbox" class="cb ${isChecked ? 'checked' : ''}" /><label
          class="title"
          >${option.title.replace('&amp;', '&')}</label
        ><span class=${option.children ? 'has-children' : ''}></span>
      </div>`;
    });
    return html`<div class="col">${items}</div>`;
  };

  const getSearchResults = () => {
    const lowerSearchTerm = debouncedSearchTerm.toLowerCase();
    return Object.entries(optionMap)
      .filter(([, { title }]) => {
        return title.toLowerCase().includes(lowerSearchTerm);
      })
      .map(([id, { title, path }]) => {
        const isChecked = selectedOptions.includes(id);

        return html`
          <div class="search-item" onClick=${onCheck}>
            <input id=${id} type="checkbox" class="cb ${isChecked ? 'checked' : ''}" />
            <label
              ><span class="title">${title}</span
              ><span class="path">${path.replace('/content/cq:tags/caas/', '')}</span></label
            >
          </div>
        `;
      });
  };
  return html` <div class="tagselect-modal-overlay">
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
  </div>`;
};

const initModalDiv = () => {
  const div = document.createElement('div');
  div.className = 'tagselect-modals';
  document.body.appendChild(div);
  return div;
};

const TagSelect = ({
  options = {},
  optionMap = {},
  isModal = false,
  label = '',
  selectedOptions = [],
  onSelectedChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalDiv, setModalDiv] = useState();
  const tagSelectRef = useRef(null);

  useEffect(() => {
    if (isModal) {
      setModalDiv(initModalDiv());
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

  const selectedItems = [...selectedOptions].map((option) => {
    if (!optionMap[option]) return null;
    const label = optionMap[option].path
      ? optionMap[option].path.replace('/content/cq:tags/caas/', '')
      : optionMap[option];
    return html`
      <div class="tagselect-tag">
        <span class="tagselect-tag-text">${label.replace('&amp;', '&')}</span>
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

  const removeOption = (val) => {
    const optionIndex = selectedOptions.indexOf(val);
    if (optionIndex === -1) return;
    selectedOptions.splice(optionIndex, 1);
    onSelectedChange([...selectedOptions]);
  };

  const onTagDelete = (ev, val) => {
    ev.preventDefault();
    ev.stopPropagation();
    removeOption(val);
  };

  const addOption = (val) => {
    if (!selectedOptions.includes(val)) {
      selectedOptions.push(val);
    }
    onSelectedChange([...selectedOptions]);
  };

  const onToggle = (val) => {
    if (selectedOptions.includes(val)) {
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
      ${!isModal &&
      isOpen &&
      html`<${TagSelectDropdown}
        options=${options}
        selectedOptions=${selectedOptions}
        close=${toggleOpen}
        onSelect=${addOption}
        tagSelectRef=${tagSelectRef}
      />`}
      ${isModal &&
      isOpen &&
      createPortal(
        html`<${TagSelectModal}
          isOpen=${isOpen}
          options=${options}
          optionMap=${optionMap}
          selectedOptions=${selectedOptions}
          close=${toggleOpen}
          onToggle=${onToggle}
        />`,
        modalDiv
      )}
    </div>
  `;
};

export default TagSelect;
