/* global ClipboardItem */
import { html, useState, useEffect } from '../../deps/htm-preact.js';
import { getConfig, loadStyle } from '../../utils/utils.js';

const CopyBtn = ({ getContent, configFormValidation }) => {
  const { miloLibs, codeRoot } = getConfig();
  const [statusType, setStatusType] = useState('hide');
  const [statusMessage, setStatusMessage] = useState('');
  const [showCopyContent, setShowCopyContent] = useState(false);
  const [copyContent, setCopyContent] = useState('');

  const setMessage = (type, message) => {
    setStatusType(type);
    setStatusMessage(message);
    setTimeout(() => {
      setStatusType('hide');
      setStatusMessage('');
    }, 2000);
  };

  const copyConfig = async () => {
    const { content, contentHtml } = getContent();
    setCopyContent(content);

    if (!navigator?.clipboard) {
      setMessage('error', 'Clipboard not available.');
      setShowCopyContent(true);
      return;
    }

    if (!configFormValidation()) {
      setMessage('error', 'Required fields must be filled.');
      setShowCopyContent(false);
      return;
    }

    const blob = new Blob([contentHtml], { type: 'text/html' });
    const data = [new ClipboardItem({ [blob.type]: blob })];

    await navigator.clipboard.write(data)
      .then(() => {
        setMessage('success', 'Copied to clipboard!');
        setShowCopyContent(true);
      })
      .catch(() => {
        setMessage('error', 'Failed to copy.');
        setShowCopyContent(true);
      });
  };

  loadStyle(`${miloLibs || codeRoot}/ui/controls/copyBtn.css`);

  return html`
    <div class="copy-button">
      <textarea class=${`copy-content ${showCopyContent ? '' : 'hide'}`}>${copyContent}</textarea>
      <button class="copy-config" onClick=${copyConfig}>Copy</button>
      <div class=${`copy-message ${statusType !== 'hide' ? statusType : ''}`}>
        <div class=${`message ${statusType}-message`}>${statusMessage}</div>
      </div>
    </div>
  `;
};

export default CopyBtn;
