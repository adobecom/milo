import { html, useState } from '../../../deps/htm-preact.js';

/**
 * A fieldset of checkboxes whose checked values are tracked as a single
 * comma-separated string (matching the API's `targetSetting`/`manifestSrc` param
 * shape). Refuses to let the last checked box be unchecked (flashes an error state
 * instead), matching the original mmm.js behavior.
 */
function CheckboxFilterGroup({ id, legend, options, value, onChange }) {
  const [hasError, setHasError] = useState(false);
  const checked = new Set((value ?? '').split(',').map((v) => v.trim()).filter(Boolean));

  const toggle = (optionValue) => {
    const next = new Set(checked);
    if (next.has(optionValue)) next.delete(optionValue);
    else next.add(optionValue);

    if (next.size === 0) {
      setHasError(true);
      setTimeout(() => setHasError(false), 5000);
      return;
    }
    onChange(options.map((o) => o.value).filter((v) => next.has(v)).join(', '));
  };

  return html`
    <fieldset id=${id} class="mmm2-checkbox-group ${hasError ? 'has-error' : ''}">
      <legend>${legend}</legend>
      ${options.map((option) => html`
        <div class="mmm2-checkbox-option" key=${option.value}>
          <input
            type="checkbox"
            id="${id}-${option.value}"
            checked=${checked.has(option.value)}
            onClick=${() => toggle(option.value)}
          />
          <label for="${id}-${option.value}">${option.label}</label>
        </div>
      `)}
    </fieldset>
  `;
}

export default CheckboxFilterGroup;
