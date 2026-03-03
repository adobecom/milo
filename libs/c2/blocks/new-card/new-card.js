import { decorateBlockText } from '../../../utils/decorate.js';

const VIEWPORT_LABELS = ['mobile', 'tablet', 'desktop'];

function getRowLabelText(row) {
  const cell = row.querySelector(':scope > div');
  return cell?.textContent?.trim().toLowerCase() ?? '';
}

function isViewportLabel(text) {
  return VIEWPORT_LABELS.includes(text);
}

function decorateCard(wrapper) {
  const [foreground, media] = [...wrapper.children];
  if (!foreground || !media) return;
  media.classList.add('media');
  foreground.classList.add('foreground');
  decorateBlockText(foreground, ['xxs', 's', 'm']);
  const firstCell = foreground.children[0];
  if (firstCell?.childElementCount === 1
    && firstCell?.firstElementChild?.tagName === 'PICTURE') {
    const iconPicture = firstCell.firstElementChild;
    iconPicture.classList.add('icon');
    media.appendChild(iconPicture);
  }
}

function decorateViewportStructure(rows) {
  for (let i = 0; i < rows.length; i += 2) {
    const labelRow = rows[i];
    const contentRow = rows[i + 1];
    contentRow.setAttribute('data-viewport', getRowLabelText(labelRow));
    labelRow.remove();
    decorateCard(contentRow);
  }
}

export default function init(el) {
  el.closest('.section').classList.add('new-card-section');
  const rows = [...el.children];

  const hasViewportStructure = rows.length >= 2
    && rows.length % 2 === 0
    && isViewportLabel(getRowLabelText(rows[0]));

  if (hasViewportStructure) {
    decorateViewportStructure(rows);
    return;
  }

  decorateCard(rows[0]);
}
