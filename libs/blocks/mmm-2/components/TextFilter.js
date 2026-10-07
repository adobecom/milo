import { html, useRef } from '../../../deps/htm-preact.js';
import { debounce } from '../utils.js';

/**
 * Single-line, debounced free-text filter input - the same debounced-text pattern as
 * SearchTextarea, but for a single value (comma-separated substring match, per the
 * `/get-pages` API's `manifestCountryRestriction` param) rather
 * than a multi-line/newline-joined list.
 */
function TextFilter({ id, label, placeholder, value, onChange }) {
  const debouncedOnChange = useRef(debounce((val) => onChange(val))).current;

  return html`
    <div class="mmm2-form-field">
      <label for=${id}>${label}:</label>
      <input
        type="text"
        id=${id}
        class="mmm2-text-input"
        placeholder=${placeholder}
        value=${value}
        onInput=${(e) => debouncedOnChange(e.target.value)}
      />
    </div>
  `;
}

export default TextFilter;
