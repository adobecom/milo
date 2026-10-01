import { createTag } from '../../../utils/utils.js';
import { decorateBlockText, decorateViewportContent } from '../../../utils/decorate.js';

const HEADING_LEVEL = '5';

function decorate(block) {
  decorateBlockText(block, { heading: HEADING_LEVEL });
  const heading = block.querySelector(`.heading-${HEADING_LEVEL}`);
  const listRow = block.querySelector(`:scope > :not(:has(.heading-${HEADING_LEVEL}))`);
  const list = createTag('ul');
  listRow.querySelectorAll('a').forEach((cta) => {
    const li = createTag('li');
    li.append(cta);
    list.append(li);
    if (cta.classList.contains('con-button')) return;
    cta.classList.add('con-button', 'pill-group-cta');
  });

  block.replaceChildren(list);
  if (!heading) return;

  list.before(heading);
  if (!heading.id) return;
  list.setAttribute('aria-labelledby', heading.id);
}

export default function init(el) {
  decorateViewportContent(el, decorate);
}
