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
  const iconCell = tileRow.children[0];
  const labelCell = tileRow.children[1];
  const labelLink = labelCell?.querySelector('a');

  const tile = createTag('a', { class: 'quick-actions-tile', href: labelLink?.href || '#' });

  // milo's decorateSVG converts SVG links to <picture> before init() runs
  const iconPic = iconCell?.querySelector('picture');
  const iconImg = iconPic?.querySelector('img') ?? iconCell?.querySelector('img');
  if (iconImg) {
    iconImg.classList.add('quick-actions-icon');
    iconImg.alt = '';
    tile.append(iconPic ?? iconImg);
  }

  if (labelLink) {
    const footer = createTag('div', { class: 'quick-actions-tile-footer' });
    footer.append(createTag('span', { class: 'quick-actions-tile-label' }, labelLink.textContent.trim()));
    tile.append(footer);
  }

  return tile;
}

function decorate(block) {
  const header = decorateSectionHeader(block);
  const grid = createTag('div', { class: 'quick-actions-grid six-up' });

  [...block.children].forEach((row) => {
    if (row.children.length >= 2) grid.append(buildTile(row));
  });

  block.innerHTML = '';
  if (header) block.append(header);
  block.append(grid);
}

export default function init(el) {
  decorateViewportContent(el, decorate);
}
