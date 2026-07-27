/**
 * lockup variant — a centered text/CTA lockup. The authored cell holds a
 * heading, body copy and (optionally) one or more links rebuilt as buttons.
 */
export default function render(block, { decorateBlockText } = {}) {
  const cell = block.querySelector(':scope > div > div') || block;
  const root = document.createElement('div');
  root.className = 'lockup';
  while (cell.firstChild) root.appendChild(cell.firstChild);
  // Promote any authored anchor into a styled CTA button-ish anchor.
  root.querySelectorAll('a').forEach((a) => a.classList.add('lockup-cta'));
  if (typeof decorateBlockText === 'function') decorateBlockText(root);
  block.replaceChildren(root);
}
