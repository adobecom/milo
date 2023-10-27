import { html, useState, useEffect } from '../../deps/htm-preact.js';
import useDebounce from '../../hooks/useDebounce.js';

const Tag = ({
  id,
  label,
  hasChildren,
  isChecked,
  isExpanded,
  onCheck,
  onExpand,
}) => html`
    <div
      class="tagselect-item${isExpanded ? ' expanded' : ''}"
      key=${id}
      data-key=${id}
      onClick=${hasChildren ? onExpand : onCheck}
    >
      <input id=${id} type="checkbox" class="cb ${isChecked ? 'checked' : ''}" />
      <label class="label">${label?.replace('&amp;', '&')}</label>
      ${hasChildren ? html`<span class="has-children"></span>` : ''}
    </div>
  `;

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
  const [selectedCol, setSelectedCol] = useState();
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    setIsSearching(debouncedSearchTerm?.length > 2);
  }, [debouncedSearchTerm]);

  const onCheck = (e) => {
    e.preventDefault();
    const inputEl = e.currentTarget.firstChild;

    if (singleSelect) {
      toggleTag(inputEl.id);
      close();
      return;
    }

    inputEl.classList.toggle('checked');
    toggleTag(inputEl.id);
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
              <span class="label">${label?.replace('&amp;', '&')}</span>
              <span class="path">${path}</span>
            </label>
          </div>
        `;
      });
  };

  const onExpand = (e) => {
    if (e.target.type === 'checkbox') {
      onCheck(e);
      return;
    }

    const itemEl = e.target.classList.contains('tagselect-item')
      ? e.target
      : e.target.parentElement;

    setSelectedCol(itemEl.dataset.key);
  };

  const getCol = (root, expandedId) => {
    if (!root) return '';

    const items = Object.entries(root.children || root).map(([id, option]) => {
      const isChecked = selectedTags.includes(id);
      return html`<${Tag}
        id=${id}
        label=${option.label}
        hasChildren=${!!option.children}
        isChecked=${isChecked}
        isExpanded=${expandedId === id || `caas:${expandedId}` === id}
        onCheck=${onCheck}
        onExpand=${onExpand}
      />`;
    });
    return html`<div class="col">${items}</div>`;
  };

  useEffect(() => {
    const cols = [];
    const addColumn = (option, expandedPath = null) => {
      if (!option) {
        cols.unshift(getCol(options, expandedPath));
      } else {
        cols.unshift(getCol(option, expandedPath));
        addColumn(option.parent, option.path);
      }
    };

    addColumn(optionMap[selectedCol]);
    setColumns(cols);
  // eslint-disable-next-line
  }, [selectedCol, isSearching, options]);

  return html`
    <section class="tagselect-picker">
      <input
        class="tagselect-picker-search"
        placeholder="Search..."
        onInput=${(e) => setSearchTerm(e.target.value)}
        type="search"
      />
      ${!isSearching && html`<div class="tagselect-picker-cols">${columns}</div>`}
      ${isSearching && html`<div class="tagselect-picker-table">${getSearchResults()}</div>`}
    </section>
  `;
};

export default Picker;
