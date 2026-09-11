import { createTag } from '../../../utils/utils.js';
import { decorateBlockText, decorateViewportContent } from '../../../utils/decorate.js';

const HEADING_LEVEL = '5';
const MOBILE_MQ = '(width < 768px)';
const mobileMQ = window.matchMedia(MOBILE_MQ);

function reversePillRows(block) {
  const container = block.querySelector('.pill-group-row-container');
  if (!container) return;
  const reversedRows = [...container.children].reverse();
  container.replaceChildren(...reversedRows);
}

function decorate(block) {
  decorateBlockText(block, { heading: HEADING_LEVEL });
  const rowsContainer = createTag('div', { class: 'pill-group-row-container' });
  const rows = block.querySelectorAll(`:scope > :not(:has(.heading-${HEADING_LEVEL}))`);
  rows.forEach((row) => {
    row.className = 'pill-group-row';
    const list = createTag('ul');
    row.querySelectorAll('a').forEach((cta) => {
      const li = createTag('li');
      li.append(cta);
      list.append(li);
      if (cta.classList.contains('con-button')) return;
      cta.classList.add('con-button', 'pill-group-cta');
    });
    row.replaceChildren(list);
    rowsContainer.appendChild(row);
  });

  block.appendChild(rowsContainer);

  const headingRow = block.querySelector(`:scope > :has(.heading-${HEADING_LEVEL})`);
  if (!headingRow) return;
  headingRow.className = 'pill-group-heading';
  const heading = headingRow.querySelector(`.heading-${HEADING_LEVEL}`);
  rowsContainer.setAttribute('role', 'group');
  rowsContainer.setAttribute('aria-labelledby', heading.id);
}

export default function init(el) {
  decorateViewportContent(el, decorate);
  if (!el.classList.contains('pill-reverse-mobile')) return;
  if (mobileMQ.matches) reversePillRows(el);
  mobileMQ.addEventListener('change', () => reversePillRows(el));
}
