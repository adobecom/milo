import { html, useEffect, useState } from '../../deps/htm-preact.js';

let checkboxIdx = 0;

const Select = ({ label, name, onChange, options, value, sort = false, description }) => {
  const onSelectChange = (e) => {
    onChange(e.target.value, e);
  };

  const entries = sort
    ? Object.entries(options).sort((a, b) => a[1].localeCompare(b[1]))
    : Object.entries(options);

  return html`
    <div class="field">
      <label for=${name}>
        ${label}
        ${description && html`<i class="tooltip"></i><span class="tooltip-text">${description}</span>`}
      </label>
      <select id=${name} value=${value} onChange=${onSelectChange}>
        ${entries.map(
          ([val, optionLabel]) => html`<option value="${val}">${optionLabel}</option>`
        )}
      </select>
    </div>
  `;
};

const Input = ({ label, name, onChange, onValidate, type = 'text', value, title, description }) => {
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    if (value) validateInput(value);
  }, []);

  const validateInput = (val) => {
    if (typeof onValidate === 'function' && val !== '' && !onValidate(val)) {
      setIsValid(false);
    } else if (!isValid) {
      setIsValid(true);
    }
  };

  const onInputChange = (e) => {
    const inputVal = type === 'checkbox' ? e.target.checked : e.target.value
    validateInput(inputVal);
    onChange(inputVal, e);
  };

  const isCheckbox = type === 'checkbox';

  const computedValue = { [isCheckbox ? 'checked' : 'value']: value };

  const id = isCheckbox
    ? `${name}${checkboxIdx++}`
    : name;

  return html`
    <div class="field ${isCheckbox ? 'checkbox' : ''}">
      <label for=${id}>
        ${label}
        ${description && html`<i class="tooltip"></i><span class="tooltip-text">${description}</span>`}
      </label>
      <input
        class=${!isValid && 'input-invalid'}
        type=${type}
        id=${id}
        name=${name}
        title=${title}
        ...${computedValue}
        onChange=${onInputChange}
      />
    </div>
  `;
};

export { Input, Select };
