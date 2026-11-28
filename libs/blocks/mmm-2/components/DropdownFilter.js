import { html } from '../../../deps/htm-preact.js';

/**
 * Labeled select rendering only authored options, including any blank-value option.
 */
function DropdownFilter({ id, label, options, value, onChange }) {
  return html`
    <div class="mmm2-form-field mmm2-dropdown-field">
      <label for=${id}>${label}:</label>
      <select id=${id} value=${value ?? ''} onChange=${(e) => onChange(e.target.value)}>
        ${options.map((option) => html`
          <option value=${option.value}>${option.label}</option>
        `)}
      </select>
    </div>
  `;
}

export default DropdownFilter;
