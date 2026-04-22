import { createTag } from '../../../utils/utils.js';

const CHEVRON = '<svg aria-hidden="true" width="8" height="5" viewBox="0 0 8 5" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.75 0.75L4 4L7.25 0.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

export default function decorate(block) {
  const [mediaRow, contentRow] = [...block.children];

  const picture = mediaRow?.querySelector('picture');
  if (picture) block.prepend(picture);
  mediaRow?.remove();

  if (!contentRow) return;
  const [textCol, navCol] = [...contentRow.children];
  const content = createTag('div', { class: 'sh-content' });

  if (textCol) {
    textCol.classList.add('sh-text');
    content.append(textCol);
  }

  if (navCol) {
    const nav = createTag('nav', { class: 'sh-nav', 'aria-label': 'Jump to section' });
    navCol.querySelectorAll('li').forEach((li, i) => {
      const a = li.querySelector('a');
      if (!a) return;
      const item = createTag('span', { class: 'sh-nav-item' });
      if (i > 0) item.insertAdjacentHTML('beforeend', CHEVRON);
      item.prepend(a);
      nav.append(item);
    });
    content.append(nav);
  }

  block.append(content);
  contentRow.remove();
}
