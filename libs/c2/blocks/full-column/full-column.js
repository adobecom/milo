import { decorateBlockText, decorateViewportContent } from '../../../utils/decorate.js';
import { createTag } from '../../../utils/utils.js';

function markStandaloneLinks(el) {
  el.querySelectorAll('a').forEach((a) => {
    const parent = a.parentElement;
    if (!parent) return;
    if (parent.textContent?.trim() === a.textContent?.trim()) {
      a.classList.add('standalone-link', 'label');
      parent.classList.add('cta-container');
    }
  });
}

function decorateFullColumn(block) {
  const row = block.children[0];
  const foreground = row?.children[0];
  const media = row?.children[1];
  if (!foreground) return;

  foreground.classList.add('foreground');
  decorateBlockText(foreground, { heading: '4' });
  markStandaloneLinks(foreground);

  const firstCell = foreground.children[0];
  if (firstCell?.childElementCount === 1 && firstCell?.firstElementChild?.tagName === 'PICTURE') {
    const iconPicture = firstCell.firstElementChild;
    iconPicture.classList.add('icon');
    if (media) {
      media.appendChild(iconPicture);
    } else {
      foreground.prepend(iconPicture);
    }
    firstCell.remove();
  }

  const textEls = [...foreground.children].filter((c) => !c.classList.contains('cta-container'));
  if (textEls.length) {
    const textWrap = createTag('div', { class: 'text-content' });
    textEls[0].before(textWrap);
    textEls.forEach((el) => textWrap.appendChild(el));
  }

  if (media) {
    media.classList.add('media');
  }
}

export default function init(el) {
  decorateViewportContent(el, decorateFullColumn);
}
