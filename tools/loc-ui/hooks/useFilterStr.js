import { useState, html } from '../../../libs/deps/htm-preact.js';
import { debounce, escapeRegExp } from '../utils/utils.js';

// TODO: write comments
// TODO: maybe decouple ui elements from this hook
export default function useFilterStr() {
  const [searchStr, setSearchStr] = useState('');
  function searchOnInputHandler(e) {
    e.preventDefault();
    setSearchStr(e.target.value);
  }
  const debouncedSearchOnInputHandler = debounce(searchOnInputHandler, 400);
  const renderFilterInput = () => html`<input type="search" placeholder="Filter" value=${searchStr.value} onInput=${debouncedSearchOnInputHandler} />`;
  const regex = new RegExp(escapeRegExp(searchStr));
  return { regex, renderFilterInput };
}
