import { getSectionMetadata } from '../section-metadata/section-metadata.js';

export default function init(el) {
  const modal = el.closest('.dialog-modal');
  if (!modal) return;
  const metadata = getSectionMetadata(el);
  if (metadata.style) modal.classList.add(metadata.style);
  if (metadata.backdrop === 'off') modal.classList.add('backdrop-off');
}
