import { getSectionMetadata, handleStyle } from '../section-metadata/section-metadata.js';

export default function init(el) {
  const modal = el.closest('.dialog-modal');
  if (!modal) return;
  const metadata = getSectionMetadata(el);
  if (!metadata) return;
  if (metadata.style) handleStyle(metadata.style, modal);
  if (metadata.backdrop === 'off') modal.classList.add('backdrop-off');
}
