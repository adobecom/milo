import { html, useState, useEffect } from '../../deps/htm-preact.js';
import useDebounce from '../../hooks/useDebounce.js';

const Tag = ({
  id,
  label,
  hasChildren,
  isChecked,
  onCheck,
  onExpand,
}) => {
  return html`
    <div
      class="tagselect-item"
      key=${id}
      data-key=${id}
      onClick=${hasChildren ? onExpand : onCheck}
    >
      <input id=${id} type="checkbox" class="cb ${isChecked ? 'checked' : ''}" />
      <label class="label">${label?.replace('&amp;', '&')}</label>
      ${hasChildren ? html`<span class="has-children"></span>` : ''}
    </div>
  `;
};

const Picker = ({
  close,
  toggleTag,
  options = {},
  optionMap = {},
  singleSelect = false,
  selectedTags = [],
}) => {
  const [columns, setColumns] = useState();
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    setColumns([getCol(options)]);
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
      toggleTag(inputEl.id);
      close();
      return;
    }

    if (inputEl.classList.contains('checked')) {
      inputEl.classList.remove('checked');
    } else {
      inputEl.classList.add('checked');
    }
    toggleTag(inputEl.id);
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
      if (!option) return;
      cols.unshift(getCol(option));
      if (option.parent) {
        addColumn(option.parent);
      }
    };

    const { key: selectedKey } = itemEl.dataset;
    addColumn(optionMap[selectedKey]);
    cols.unshift(getCol(options)); // add the root

    setColumns(cols);
  };

  const getCol = (root) => {
    if (!root) return;

    const items = Object.entries(root.children || root).map(([id, option]) => {
      const isChecked = selectedTags.includes(id);
      return html`<${Tag}
        id=${id}
        label=${option.label}
        hasChildren=${option.children}
        isChecked=${isChecked}
        onCheck=${onCheck}
        onExpand=${onExpand}
      />`;
    });
    return html`<div class="col">${items}</div>`;
  };

  const getSearchResults = () => {
    const lowerSearchTerm = debouncedSearchTerm.toLowerCase();
    return Object.entries(optionMap)
      .filter(([, { label }]) => label.toLowerCase().includes(lowerSearchTerm))
      .map(([id, { label, path }]) => {
        const isChecked = selectedTags.includes(id);
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
    <section class="tagselect-picker">
      <input
        class="tagselect-modal-search"
        placeholder="Search..."
        onInput=${(e) => setSearchTerm(e.target.value)}
        type="search"
      />
      ${!isSearching && html`<div class="tagselect-modal-cols">${columns}</div>`}
      ${isSearching && html`<div class="tagselect-modal-table">${getSearchResults()}</div>`}
    </section>
  `;
};

export default Picker;
