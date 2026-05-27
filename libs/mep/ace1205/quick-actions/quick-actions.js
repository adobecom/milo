import { decorateViewportContent, decorateBlockText } from '../../../utils/decorate.js';
import { createTag } from '../../../utils/utils.js';

function decorateSectionHeader(block) {
  const firstRow = block.children[0];
  if (!firstRow) return null;
  const headerCell = firstRow.children[0];
  if (!headerCell?.querySelector('h1, h2, h3, h4, h5, h6')) return null;

  const header = createTag('div', { class: 'quick-actions-header' });
  [...headerCell.children].forEach((child) => header.append(child));
  firstRow.remove();
  decorateBlockText(header, { heading: '4', body: 'md', button: 'lg' });
  return header;
}

function buildTile(tileRow) {
  const labelCell = tileRow.children[0];
  const mediaCell = tileRow.children[1];
  const labelLink = labelCell?.querySelector('a');

  const tile = createTag('a', { class: 'quick-actions-tile', href: labelLink?.href || '#' });

  const mediaPic = mediaCell?.querySelector('picture');
  const mediaImg = mediaPic?.querySelector('img') ?? mediaCell?.querySelector('img');
  if (mediaImg) {
    mediaImg.alt = '';
    (mediaPic ?? mediaImg).classList.add('quick-actions-media');
    tile.append(mediaPic ?? mediaImg);
  }

  if (labelLink) {
    const footer = createTag('div', { class: 'quick-actions-tile-footer' });
    footer.append(createTag('span', { class: 'quick-actions-tile-label' }, labelLink.textContent.trim()));
    tile.append(footer);
  }

  return tile;
}

const N_UP_MAP = { 2: 'two-up', 3: 'three-up', 4: 'four-up' };

function decorate(block) {
  const header = decorateSectionHeader(block);
  const tileRows = [...block.children].filter((row) => row.children.length >= 2);
  const nUp = N_UP_MAP[tileRows.length] || 'six-up';
  const grid = createTag('div', { class: `quick-actions-grid ${nUp}` });

  tileRows.forEach((row) => grid.append(buildTile(row)));

  block.innerHTML = '';
  if (header) block.append(header);
  block.append(grid);
}

export default function init(el) {
  decorateViewportContent(el, decorate);
}
