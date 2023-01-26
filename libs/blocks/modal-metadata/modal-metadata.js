import { getMetadata, handleStyle } from '../section-metadata/section-metadata.js';

export default function init(el) {
  const modal = el.closest('.dialog-modal');
  if (!modal) return;
  const metadata = getMetadata(el);
  if (metadata.style) handleStyle(metadata.style.text, modal);
  if (metadata.curtain?.text === 'off') modal.classList.add('curtain-off');
}
