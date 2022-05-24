import { html, useEffect, useState } from '../../deps/htm-preact.js';

const Select = ({ label, name, onChange, options, value }) => {
  const onSelectChange = (e) => {
    onChange(e.target.value, e);
  };

  return html`
    <div class="field">
      <label for=${name}>${label}</label>
      <select id=${name} value=${value} onChange=${onSelectChange}>
        ${Object.entries(options).map(
          ([val, optionLabel]) => html`<option value="${val}">${optionLabel}</option>`
        )}
      </select>
    </div>
  `;
};

const Input = ({ label, name, onChange, onValidate, type = 'text', value }) => {
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
    const inputVal = e.target.value;
    validateInput(inputVal);
    onChange(inputVal, e);
  };

  const computedValue = { [type === 'checkbox' ? 'checked' : 'value']: value };

  return html`
    <div class="field ${type === 'checkbox' ? 'checkbox' : ''}">
      <label for=${name}>${label}</label>
      <input
        class=${!isValid && 'input-invalid'}
        type=${type}
        id=${name}
        name=${name}
        ...${computedValue}
        onChange=${onInputChange}
      />
    </div>
  `;
};

export { Input, Select };
