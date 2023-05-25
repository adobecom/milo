import { html, useState } from '../../deps/htm-preact.js';
import { getConfig, loadStyle } from '../../utils/utils.js';
const { miloLibs, codeRoot } = getConfig();

loadStyle(`${miloLibs || codeRoot}/ui/controls/copyBtn.css`);

const CopyBtn = ({ getUrl, configFormValidation }) => {
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
  <div class="copy-button">
    <textarea class=${`config-url ${status.showConfigUrl ? '' : 'hide'}`}>${configUrl}</textarea>
    <button
      class="copy-config"
      onClick=${copyConfig}>Copy</button>
    <div class="copy-message ${status.type}">
      <div class="message ${status.type}-message">${status.message}</div>
    </div>
  </div>`;
};

export default CopyBtn;
