import { html, useState } from '../../deps/htm-preact.js';

export const Select = ({ label, options, prop, onChange, sort, description, value }) => {
  const onSelectChange = (e) => {
    if (typeof onChange === 'function') {
      onChange(prop, e.target.value);
    }
  };
  const optionsArray = sort ? sortObjects(options) : Object.entries(options);
  return html`
      <div class="field">
      <label for=${prop}>${label}<i class="tooltip"><span class="tooltip-text">${description}</span></i></label>
        <select id=${prop} value=${value} onChange=${onSelectChange}>
          ${optionsArray.map(([v, l]) => html`<option value="${v}">${l} (${v})</option>`)}
        </select>
      </div>
    `;
};

export const Input = ({ label = '', type = 'text', prop, onChange, placeholder, description, value }) => {
  const onInputChange = (e) => {
    if (typeof onChange === 'function') {
      onChange(prop, type === 'checkbox' ? e.target.checked : e.target.value);
    }
  };

  const defaultValue = type === 'checkbox' ? false : '';
  const valueProp = { [type === 'checkbox' ? 'checked' : 'value']: value || defaultValue };
  return html` <div class="field">
      <label for=${prop}>${label}<i class="tooltip"><span class="tooltip-text">${description}</span></i></label>
      <input type=${type} id=${prop} name=${prop}...${valueProp} placeholder=${placeholder} onChange=${onInputChange} />
    </div>`;
};


export const CopyBtn = ({ getUrl, configFormValidation }) => {
  const [status, setStatus] = useState({ type: 'hide', message: '', showConfigUrl: false });
  const [configUrl, setConfigUrl] = useState('');

  const copyConfig = async () => {
    setConfigUrl(getUrl());

    if (!navigator?.clipboard) {
      setStatus({ type: 'error', message: 'Clipboard not available.', showConfigUrl: true });
      return;
    }

    if (!configFormValidation()) {
      setStatus({ type: 'error', message: 'Required fields must be filled.', showConfigUrl: false });
      return;
    }

    const link = document.createElement('a');
    link.href = getUrl();
    link.textContent = document.querySelector('.tool-title').textContent;

    const blob = new Blob([link.outerHTML], { type: 'text/html' });
    const data = [new ClipboardItem({ [blob.type]: blob })];

    try {
      await navigator.clipboard.write(data);
      setStatus({ type: 'success', message: 'Copied to clipboard!', showConfigUrl: true });
    } catch {
      setStatus({ type: 'error', message: 'Failed to copy.', showConfigUrl: true });
    }

    setTimeout(() => {
      setStatus(prevStatus => ({ type: 'hide', message: '', showConfigUrl: prevStatus.showConfigUrl }));
    }, 2000);
  };

  return html`
  <textarea class=${`config-url ${status.showConfigUrl ? '' : 'hide'}`}>${configUrl}</textarea>
  <button
    class="copy-config"
    onClick=${copyConfig}>Copy</button>
  <div class="copy-message ${status.type}">
    <div class="message ${status.type}-message">${status.message}</div>
  </div>`;
};
