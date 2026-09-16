import { createTag } from '../../../utils/utils.js';
import { decorateBlockText } from '../../../utils/decorate.js';

const HEADING_TEXT_CONFIG = { heading: '2', body: 'l', detail: 'm', button: 'l' };
const CARD_TEXT_CONFIG = { heading: '4', body: 'm', detail: 's', button: 'm' };

function decorateHeadingRow(row) {
  row.classList.add('whats-new-heading');
  const cell = row.children[0];
  if (!cell) return;
  cell.classList.add('heading-content');
  // decorateBlockText runs decorateButtons internally with `button-${size}`;
  // calling decorateButtons again here would be a no-op (the em/strong wrappers
  // it keys off are already consumed), so the size must ride the sizeMap.
  decorateBlockText(cell, HEADING_TEXT_CONFIG);
}

function decorateCardRow(row) {
  row.classList.add('whats-new-card');
  const [media, body] = row.children;
  if (media) {
    media.classList.add('card-media');
    const img = media.querySelector('img');
    if (img && !img.getAttribute('loading')) img.setAttribute('loading', 'lazy');
  }
  if (!body) return;
  body.classList.add('card-body');
  decorateBlockText(body, CARD_TEXT_CONFIG);
  body.querySelectorAll('a:not(.con-button)').forEach((a) => {
    const parent = a.parentElement;
    if (parent && parent.textContent.trim() === a.textContent.trim()) {
      a.classList.add('card-link');
      parent.classList.add('card-link-wrapper');
    }
  });
}

export default function init(el) {
  const rows = [...el.children];
  if (!rows.length) return;

  const [headingRow, ...cardRows] = rows;
  decorateHeadingRow(headingRow);

  if (!cardRows.length) return;

  const grid = createTag('div', { class: 'whats-new-grid' });
  cardRows.forEach((row) => {
    decorateCardRow(row);
    grid.append(row);
  });
  el.append(grid);
}
