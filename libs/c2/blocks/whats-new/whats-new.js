import { decorateBlockText, decorateButtons } from '../../../utils/decorate.js';

const CARD_TEXT_CONFIG = { heading: '4', body: 'm', detail: 's' };

function decorateHeadingRow(row) {
  row.classList.add('whats-new-heading');
  const cell = row.children[0];
  if (!cell) return;
  cell.classList.add('heading-content');
  decorateBlockText(cell, { heading: '2', body: 'l', detail: 'm' });
  decorateButtons(cell, 'l-button');
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
  body.querySelectorAll('a').forEach((a) => {
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

  const grid = document.createElement('div');
  grid.className = 'whats-new-grid';
  cardRows.forEach((row) => {
    decorateCardRow(row);
    grid.append(row);
  });
  el.append(grid);
}
