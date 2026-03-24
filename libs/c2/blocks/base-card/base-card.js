import { decorateBlockText, decorateTextOverrides } from '../../../utils/decorate.js';
import { getFederatedUrl } from '../../../utils/utils.js';

const VIEWPORT_LABELS = ['mobile', 'tablet', 'desktop'];

function getRowLabelText(row) {
  const cell = row.querySelector(':scope > div');
  return cell?.textContent?.trim().toLowerCase() ?? '';
}

function isViewportLabel(text) {
  return VIEWPORT_LABELS.includes(text);
}

function markStandaloneLinks(foreground) {
  foreground.querySelectorAll('a').forEach((a) => {
    const parent = a.parentElement;
    if (!parent) return;
    const parentText = parent.textContent?.trim() ?? '';
    const linkText = a.textContent?.trim() ?? '';
    if (parentText === linkText) a.classList.add('standalone-link', 'label');
  });
}

const isSvgUrl = (url) => /\.svg(\?.*)?$/i.test(url || '');

function decorateCard(wrapper) {
  const [foreground, media] = [...wrapper.children];
  if (!foreground || !media) return;
  media.classList.add('media');
  if (media.closest('.base-card.featured')) media.classList.add('parallax-featured-card-media');
  media.querySelector('picture').classList.add('parallax-scale-down');
  foreground.classList.add('foreground');
  decorateBlockText(foreground, { heading: '4' });
  markStandaloneLinks(foreground);
  const firstCell = foreground.children[0];
  if (firstCell?.childElementCount !== 1 || firstCell?.firstElementChild?.tagName !== 'PICTURE') return;

  const iconPicture = firstCell.firstElementChild;
  const iconImg = iconPicture.querySelector('img');
  if (iconImg?.hasAttribute('src') && isSvgUrl(iconImg?.src)) iconImg.src = getFederatedUrl(iconImg.getAttribute('src'));
  iconPicture.classList.add('icon');
  media.appendChild(iconPicture);
  firstCell.remove();
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
  el.closest('.section').classList.add('base-card-section');
  const rows = [...el.children];

  const hasViewportStructure = rows.length >= 2
    && rows.length % 2 === 0
    && isViewportLabel(getRowLabelText(rows[0]));

  if (hasViewportStructure) decorateViewportStructure(rows);
  else decorateCard(rows[0]);

  decorateTextOverrides(el);
}
