import { html, useEffect, useState } from '../../deps/htm-preact.js';

let checkboxIdx = 0;

const Select = ({
  label, name, onChange, options, isRequired, value, sort = false, tooltip,
}) => {
  const [isValid, setIsValid] = useState(true);

  const validateInput = (val) => {
    setIsValid(!(isRequired && val === ''));
  };

  useEffect(() => {
    validateInput(value);
  }, []);

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
      ${tooltip && html`<i class="tooltip"></i>`}
      <select id=${name} class=${!isValid && 'input-invalid'} value=${value} onChange=${onSelectChange}>
        ${entries.map(
    ([val, optionLabel]) => html`<option value="${val}">${optionLabel}</option>`,
  )}
      </select>
      ${tooltip && html`<span class="tooltip-text">${tooltip}</span>`}
    </div>
  `;
};

const Input = ({
  label, name, onChange, onValidate, isRequired, type = 'text', value, title, tooltip, placeholder,
}) => {
  const [isValid, setIsValid] = useState(true);

  const validateInput = (val) => {
    if (typeof onValidate === 'function' && val !== '' && !onValidate(val)) {
      setIsValid(false);
    } else if (isRequired && val === '') {
      setIsValid(false);
    } else {
      setIsValid(true);
    }
  };

  useEffect(() => {
    validateInput(value);
  }, []);

  const onInputChange = (e) => {
    const inputVal = type === 'checkbox' ? e.target.checked : e.target.value;
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
      ${tooltip && html`<i class="tooltip"></i>`}
      <input
        class=${!isValid && 'input-invalid'}
        type=${type}
        id=${id}
        name=${name}
        title=${title}
        ...${computedValue}
        placeholder=${placeholder}
        onChange=${onInputChange}
      />
      ${tooltip && html`<span class="tooltip-text">${tooltip}</span>`}
    </div>
  `;
};

export { Input, Select };
