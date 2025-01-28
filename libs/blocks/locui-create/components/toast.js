import { html, useEffect } from '../../../deps/htm-preact.js';

export default function Toast({
  message,
  children,
  type = 'info',
  duration = 10000,
  onClose = () => {},
}) {
  useEffect(() => {
    setTimeout(onClose, duration);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return html`
    <div class=${`toast-container type-${type}`}>
      <div>${children || message}</div>
      <div class="toast-close-btn" onclick=${onClose} />
    </div>
  `;
}
