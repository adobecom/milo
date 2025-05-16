import { html } from '../../../deps/htm-preact.js';

export default function DateTimePicker({ value, onInput, error }) {
  const nowGMT = new Date().toISOString().slice(0, 16);
  return html`
    <div class='locui-date-picker-container'>
      <input
        class='form-field-input'
        type="datetime-local"
        id="due-date"
        name="due-date"
        value=${value}
        min=${nowGMT}
        onInput=${onInput}
      />
      <span class='form-field-desc'>
        (All times are in GMT timezone.)
      </span>
      ${error && html`<div class='form-field-error'>${error}</div>`}
    </div>
  `;
}
