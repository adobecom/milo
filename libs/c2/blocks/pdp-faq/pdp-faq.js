import { decorateBlockText, decorateViewportContent } from '../../../utils/decorate.js';
import { createTag } from '../../../utils/utils.js';

const CHEVRON = '<svg class="pdp-faq-icon" viewBox="0 0 12 12" aria-hidden="true" focusable="false"><path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

let idCounter = 0;
const nextId = () => {
  idCounter += 1;
  return idCounter;
};

function buildItem(row, uid) {
  const cell = row.firstElementChild;
  const heading = cell?.querySelector('h1, h2, h3, h4, h5, h6');
  if (!heading) return null;

  const answerNodes = [...cell.children].filter((child) => child !== heading);
  const triggerId = `pdp-faq-${uid}-trigger`;
  const panelId = `pdp-faq-${uid}-panel`;

  const button = createTag('button', {
    type: 'button',
    id: triggerId,
    class: 'pdp-faq-trigger',
    'aria-expanded': 'false',
    'aria-controls': panelId,
  });
  button.textContent = heading.textContent;
  button.insertAdjacentHTML('beforeend', CHEVRON);

  const questionTag = createTag(heading.tagName, { class: 'pdp-faq-question' }, button);
  const panel = createTag('div', {
    id: panelId,
    class: 'pdp-faq-panel',
    role: 'region',
    'aria-labelledby': triggerId,
    hidden: '',
  }, answerNodes);

  row.replaceChildren(questionTag, panel);
  row.classList.add('pdp-faq-item');
  return { button, panel };
}

function toggle(button, panel) {
  const isOpen = button.getAttribute('aria-expanded') === 'true';
  button.setAttribute('aria-expanded', String(!isOpen));
  panel.toggleAttribute('hidden', isOpen);
}

function decorate(block) {
  decorateBlockText(block, { heading: '4', body: 'md' });
  const rows = [...block.children];
  const items = rows
    .map((row) => buildItem(row, nextId()))
    .filter(Boolean);

  block.addEventListener('click', (e) => {
    const trigger = e.target.closest('.pdp-faq-trigger');
    if (!trigger || !block.contains(trigger)) return;
    const item = items.find(({ button }) => button === trigger);
    if (item) toggle(item.button, item.panel);
  });
}

export default function init(el) {
  decorateViewportContent(el, decorate);
}
