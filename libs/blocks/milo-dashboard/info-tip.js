import { createTag } from '../../utils/utils.js';

// Small accessible "?" affordance. Real button => keyboard-operable for free;
// the explanation is both the aria-label (screen readers) and a visible bubble
// shown on hover/focus via CSS.
export default function infoTip(text) {
  const bubble = createTag('span', { class: 'info-tip-bubble', role: 'tooltip' }, text);
  return createTag(
    'button',
    { type: 'button', class: 'info-tip', 'aria-label': text },
    [createTag('span', { 'aria-hidden': 'true', class: 'info-tip-glyph' }, '?'), bubble],
  );
}
