import { html } from '../../../deps/htm-preact.js';

/**
 * A fieldset of checkboxes whose checked values are tracked as a single
 * comma-separated string (matching the API's multi-value filter param
 * shape). An empty selection clears the filter.
 */
function CheckboxFilterGroup({ id, legend, options, value, onChange }) {
  const checked = new Set((value ?? '').split(',').map((v) => v.trim()).filter(Boolean));

  const toggle = (optionValue) => {
    const next = new Set(checked);
    if (next.has(optionValue)) next.delete(optionValue);
    else next.add(optionValue);

    onChange(options.map((o) => o.value).filter((v) => next.has(v)).join(', '));
  };

  return html`
    <fieldset id=${id} class="mmm2-checkbox-group">
      <legend>${legend}</legend>
      ${options.map((option) => {
    const optionId = `${id}-${option.value.replace(/\s+/g, '-')}`;
    return html`
        <div class="mmm2-checkbox-option" key=${option.value}>
          <input
            type="checkbox"
            id=${optionId}
            checked=${checked.has(option.value)}
            onClick=${() => toggle(option.value)}
          />
          <label for=${optionId}>${option.label}</label>
        </div>
      `;
  })}
    </fieldset>
  `;
}

export default CheckboxFilterGroup;
