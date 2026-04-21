import { decorateBlockText, decorateViewportContent } from '../../../utils/decorate.js';
import { createTag } from '../../../utils/utils.js';

const COLUMN_LAYOUT = [2, 2, 1, 2, 2];

const ICON_ACROBAT = '<svg viewBox="0 0 32 32" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg"><path d="M5.657 0h20.686A5.664 5.664 0 0 1 32 5.867v20.266A5.664 5.664 0 0 1 26.343 32H5.657A5.664 5.664 0 0 1 0 26.133V5.867A5.664 5.664 0 0 1 5.657 0Z" fill="#B30B00"/><path d="M25.714 18.489c-1.486-1.6-5.543-.948-6.515-.83-1.428-1.422-2.4-3.14-2.743-3.733.515-1.6.857-3.2.915-4.919 0-1.482-.572-3.082-2.172-3.082-.571 0-1.085.356-1.371.83-.686 1.245-.4 3.734.685 6.282-.628 1.837-1.2 3.614-2.8 6.755-1.657.711-5.142 2.37-5.428 4.148-.114.533.057 1.067.457 1.481.4.356.914.534 1.428.534 2.115 0 4.172-3.022 5.6-5.57 1.2-.415 3.086-1.008 4.972-1.363 2.228 2.014 4.171 2.31 5.2 2.31 1.371 0 1.885-.592 2.057-1.126.285-.592.114-1.244-.286-1.717Zm-1.429 1.007c-.057.415-.571.83-1.485.593-1.086-.296-2.058-.83-2.915-1.541.743-.119 2.4-.296 3.6-.06.457.12.914.416.8 1.008ZM14.742 7.29c.115-.178.286-.297.458-.297.514 0 .628.652.628 1.185-.057 1.245-.286 2.489-.686 3.674-.857-2.37-.686-4.03-.4-4.563ZM14.628 18.785c.457-.948 1.086-2.608 1.314-3.319.514.89 1.372 1.956 1.829 2.43 0 .06-1.771.415-3.143.89ZM11.257 21.155c-1.314 2.252-2.686 3.674-3.429 3.674-.114 0-.228-.06-.343-.119-.171-.118-.228-.296-.171-.533.171-.83 1.657-1.955 3.943-3.022Z" fill="#fff"/></svg>';

const ICON_PLUS = '<svg viewBox="0 0 32 32" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg"><rect width="32" height="32" rx="8" fill="#fff" fill-opacity=".18"/><path d="M16.982 8.945v6.128h6.072v1.824h-6.072v6.156h-1.936v-6.156H8.946v-1.824h6.1V8.945h1.936Z" fill="#fff"/></svg>';

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

function decorateCta(content) {
  const link = content.querySelector('.action-area a');
  if (!link) return;
  link.classList.remove('con-button', 'blue', 'button-lg', 'button-l', 'button-m', 'button-s');
  link.classList.add('bizpro-marquee-cta');
  const label = createTag('span', { class: 'bizpro-marquee-cta-label' }, link.textContent.trim());
  const icon = createTag('span', { class: 'bizpro-marquee-cta-icon' });
  icon.innerHTML = ICON_ACROBAT;
  const plus = createTag('span', { class: 'bizpro-marquee-cta-plus' });
  plus.innerHTML = ICON_PLUS;
  link.replaceChildren(icon, label, plus);
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
  decorateCta(content);

  const mosaic = buildMosaic(pictures);

  block.replaceChildren(content, mosaic);
}

export default function init(el) {
  decorateViewportContent(el, decorate);
}
