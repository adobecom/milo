import { decorateBlockText, decorateViewportContent } from '../../../utils/decorate.js';
import { createTag } from '../../../utils/utils.js';

const COLUMN_LAYOUT = [2, 2, 1, 2, 2];

function collectPictures(rows) {
  const pictures = [];
  rows.forEach((row) => {
    row.querySelectorAll(':scope > div').forEach((cell) => {
      const pic = cell.querySelector('picture');
      if (pic) pictures.push(pic);
    });
  });
  return pictures;
}

function buildMosaic(pictures) {
  const mosaic = createTag('div', { class: 'bizpro-marquee-mosaic', 'aria-hidden': 'true' });
  let idx = 0;
  COLUMN_LAYOUT.forEach((count, colIdx) => {
    const col = createTag('div', { class: `bizpro-marquee-col bizpro-marquee-col-${colIdx + 1}` });
    for (let i = 0; i < count && idx < pictures.length; i += 1, idx += 1) {
      const media = createTag('div', { class: 'bizpro-marquee-media' });
      media.append(pictures[idx]);
      col.append(media);
    }
    mosaic.append(col);
  });
  return mosaic;
}

function decorate(block) {
  const rows = [...block.children];
  const firstRow = rows[0];
  const textCell = firstRow?.querySelector(':scope > div:first-child');
  if (!textCell) return;

  const pictures = collectPictures(rows);

  const content = createTag('div', { class: 'bizpro-marquee-content' });
  content.append(...textCell.childNodes);
  decorateBlockText(content, { heading: '1', body: 'lg', button: 'lg' });

  const mosaic = buildMosaic(pictures);

  block.replaceChildren(content, mosaic);
}

export default function init(el) {
  decorateViewportContent(el, decorate);
}
