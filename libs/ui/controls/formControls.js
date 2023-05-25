import { html, useEffect, useState } from '../../deps/htm-preact.js';

let checkboxIdx = 0;

const Select = ({ label, name, onChange, options, isRequired, value, sort = false, description }) => {
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    validateInput(value);
  }, []);

  const validateInput = (val) => {
    if (isRequired && val === '') {
      setIsValid(false);
    } else {
      setIsValid(true);
    }
  };

  const onSelectChange = (e) => {
    validateInput(e.target.value);
    onChange(e.target.value, e);
  };

  const entries = sort
    ? Object.entries(options).sort((a, b) => a[1].localeCompare(b[1]))
    : Object.entries(options);

  return html`
    <div class="field ${isRequired ? 'required' : ''}">
      <label for=${name}>${label}</label>
      ${description && html`<i class="tooltip"></i>`}
      <select id=${name} class=${!isValid && 'input-invalid'} value=${value} onChange=${onSelectChange}>
        ${entries.map(
          ([val, optionLabel]) => html`<option value="${val}">${optionLabel}</option>`
        )}
      </select>
      ${description && html`<span class="tooltip-text">${description}</span>`}
    </div>
  `;
};

const Input = ({ label, name, onChange, onValidate, isRequired, type = 'text', value, title, description }) => {
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    validateInput(value);
  }, []);

  const validateInput = (val) => {
    if (typeof onValidate === 'function' && val !== '' && !onValidate(val)) {
      setIsValid(false);
    } else if (isRequired && val === '') {
      setIsValid(false);
    } else {
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
    <div class="field ${isCheckbox ? 'checkbox' : ''} ${isRequired ? 'required' : ''}">
      <label for=${id}>${label}</label>
      ${description && html`<i class="tooltip"></i>`}
      <input
        class=${!isValid && 'input-invalid'}
        type=${type}
        id=${id}
        name=${name}
        title=${title}
        ...${computedValue}
        onChange=${onInputChange}
      />
      ${description && html`<span class="tooltip-text">${description}</span>`}
    </div>
  `;
};

export { Input, Select };
