import { html, useState, useEffect } from '../../deps/htm-preact.js';
import { getConfig, loadStyle } from '../../utils/utils.js';

const CopyBtn = ({ getContent, configFormValidation }) => {
  const { miloLibs, codeRoot } = getConfig();
  const [statusType, setStatusType] = useState('hide');
  const [statusMessage, setStatusMessage] = useState('');
  const [showCopyContent, setShowCopyContent] = useState(false);
  const [copyContent, setCopyContent] = useState('');

  useEffect(() => {
    const hideMessage = setTimeout(() => {
      setStatusType('hide');
    }, 2000);

    return () => {
      clearTimeout(hideMessage);
    };
  }, [statusMessage]);

  const copyConfig = async () => {
    const { content, contentHtml } = getContent();
    setCopyContent(content);

    if (!navigator?.clipboard) {
      setStatusType('error');
      setStatusMessage('Clipboard not available.');
      setShowCopyContent(true);
      return;
    }

    if (!configFormValidation()) {
      setStatusType('error');
      setStatusMessage('Required fields must be filled.');
      setShowCopyContent(false);
      return;
    }

    const blob = new Blob([contentHtml], { type: 'text/html' });
    const data = [new ClipboardItem({ [blob.type]: blob })];

    try {
      await navigator.clipboard.write(data);
      setStatusType('success');
      setStatusMessage('Copied to clipboard!');
      setShowCopyContent(true);
    } catch {
      setStatusType('error');
      setStatusMessage('Failed to copy.');
      setShowCopyContent(true);
    }
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
