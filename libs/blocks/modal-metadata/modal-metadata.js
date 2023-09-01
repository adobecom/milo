import { getMetadata, handleStyle } from '../section-metadata/section-metadata.js';
import { createTag } from '../../utils/utils.js';

const setDimensions = (dimensions, mm, bp, m) => {
  const styleSheet = createTag('style');
  styleSheet.innerHTML = `@media (${mm}-width: ${bp}px) {.dialog-modal, .dialog-modal > .fragment { width: ${dimensions.text?.split(',')[0]}; height: ${dimensions.text?.split(',')[0]} }}`;
  m.append(styleSheet);
};

export default function init(el) {
  const modal = el.closest('.dialog-modal');
  if (!modal) return;
  const metadata = getMetadata(el);
  if (metadata.style) handleStyle(metadata.style.text, modal);
  if (metadata.curtain?.text === 'off') modal.classList.add('curtain-off');
  if (metadata['mobile dimensions']) setDimensions(metadata['mobile dimensions'], 'max', '600', modal);
  if (metadata['tablet dimensions']) setDimensions(metadata['tablet dimensions'], 'min', '600', modal);
  if (metadata['desktop dimensions']) setDimensions(metadata['desktop dimensions'], 'min', '1200', modal);
}
