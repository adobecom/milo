import { html } from '../../../deps/htm-preact.js';

/**
 * Generic labeled <select>. `options` is an array of { value, label }.
 * Renders a leading "Show all" option representing an empty/unset value,
 * unless `includeShowAll` is explicitly set to false.
 */
function DropdownFilter({
  id, label, options, value, onChange, includeShowAll = true,
}) {
  return html`
    <div class="mmm2-form-field mmm2-dropdown-field">
      <label for=${id}>${label}:</label>
      <select id=${id} value=${value ?? ''} onChange=${(e) => onChange(e.target.value)}>
        ${includeShowAll ? html`<option value="">Show all</option>` : null}
        ${options.map((option) => html`
          <option value=${option.value}>${option.label}</option>
        `)}
      </select>
    </div>
  `;
}

export default DropdownFilter;
