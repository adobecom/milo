import { html, useRef, useEffect } from '../../../deps/htm-preact.js';
import { debounce } from '../utils.js';

/**
 * Auto-growing, debounced free-text search field. Newline-separated entries are
 * converted to a comma-separated list for the API call by the caller (see
 * `toFilterParam` usage in the views) - this component just tracks raw display text.
 */
function SearchTextarea({ id, label, placeholder, value, onChange }) {
  const textareaRef = useRef(null);
  const debouncedOnChange = useRef(debounce((val) => onChange(val))).current;

  const resize = (el) => {
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  };

  useEffect(() => {
    if (textareaRef.current) resize(textareaRef.current);
  }, []);

  return html`
    <div class="mmm2-form-field mmm2-search-field">
      <label for=${id}>${label}</label>
      <textarea
        id=${id}
        ref=${textareaRef}
        class="mmm2-search-input"
        placeholder=${placeholder}
        value=${value}
        onInput=${(e) => {
    resize(e.target);
    debouncedOnChange(e.target.value);
  }}
      ></textarea>
    </div>
  `;
}

export default SearchTextarea;
