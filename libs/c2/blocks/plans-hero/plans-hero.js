import { decorateBlockText, decorateViewportContent, handleFocalpoint } from '../../../utils/decorate.js';
import { createTag } from '../../../utils/utils.js';

function decorate(block) {
  const row = block.children[0];
  if (!row) return;

  const [textCell, mediaCell] = row.children;

  const media = createTag('div', { class: 'plans-hero-media' });
  const picture = mediaCell?.querySelector('picture');
  if (picture) {
    picture.querySelector('img')?.setAttribute('loading', 'eager');
    handleFocalpoint(picture, mediaCell, true);
    media.append(picture);
  }

  if (textCell) {
    decorateBlockText(textCell, { heading: '2', body: 'md' });
    textCell.classList.add('plans-hero-content');
  }

  block.replaceChildren(media, textCell ?? createTag('div', { class: 'plans-hero-content' }));
}

// Perf-check validation only: main-thread work before the hero renders (LCP regression).
// Never merge.
function busyWait(ms) {
  const end = performance.now() + ms;
  while (performance.now() < end) { /* block the main thread */ }
}

export default function init(el) {
  busyWait(400);
  el.classList.add('container');
  decorateViewportContent(el, decorate);
}
