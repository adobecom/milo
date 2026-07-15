import { decorateViewportContent } from '../../../utils/decorate.js';
import { createTag } from '../../../utils/utils.js';

function decorate(block) {
  const rows = [...block.children];
  block.textContent = '';
  const list = createTag('div', { class: 'jtc-entries' });
  rows.forEach((r) => {
    const cells = [...r.children];
    const entry = createTag('div', { class: 'jtc-entry' });
    entry.append(createTag('div', { class: 'jtc-when' }, cells[0]?.textContent.trim() || ''));
    const changes = createTag('div', { class: 'jtc-changes' });
    if (cells[1]) changes.append(...cells[1].childNodes);
    entry.append(changes);
    list.append(entry);
  });
  block.append(list);
}

export default function init(el) {
  decorateViewportContent(el, decorate);
}
