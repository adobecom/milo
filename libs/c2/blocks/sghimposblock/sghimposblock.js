import { decorateBlockText } from '../../../utils/decorate.js';

const VIEWPORT_KEYWORDS = ['mobile-viewport', 'tablet-viewport', 'desktop-viewport'];

function getRowText(row) {
  return row.querySelector(':scope > div')?.textContent?.trim().toLowerCase() ?? '';
}

function isViewportLabel(row) {
  return VIEWPORT_KEYWORDS.includes(getRowText(row));
}

function decorateCard(wrapper, inheritedCopy = null) {
  const [textColRaw, mediaCol] = [...wrapper.querySelectorAll(':scope > div')];
  const hasContent = textColRaw?.children.length > 0;

  const asset = document.createElement('div');
  asset.classList.add('sg-asset');
  if (mediaCol) {
    mediaCol.classList.add('sg-media');
    asset.append(mediaCol);
  }

  // Empty text col — inherit the previous viewport's copy (new bg image, same text)
  if (!hasContent && inheritedCopy) {
    wrapper.replaceChildren(asset, inheritedCopy.cloneNode(true));
    return inheritedCopy;
  }

  const textCol = textColRaw;

  // Mark plain CTAs before decorateBlockText so they are not styled as body text
  textCol?.querySelectorAll(':scope > p > a').forEach((a) => {
    if (!a.closest('em') && !a.closest('strong')) a.closest('p').classList.add('sg-cta');
  });

  if (textCol) decorateBlockText(textCol, { heading: '4', body: 'md' });

  // Extract icon (first p that contains only a picture element)
  const firstP = textCol?.querySelector(':scope > p:first-child');
  const icon = firstP?.childElementCount === 1 && firstP.querySelector('picture') ? firstP : null;
  if (icon) {
    icon.remove();
    const iconWrap = document.createElement('div');
    iconWrap.classList.add('sg-icon');
    iconWrap.append(icon);
    asset.append(iconWrap);
  }

  const ctaP = textCol?.querySelector('.sg-cta');
  if (ctaP) ctaP.remove();

  const copy = document.createElement('div');
  copy.classList.add('sg-copy');
  if (textCol) {
    textCol.classList.add('sg-foreground');
    copy.append(textCol);
  }
  if (ctaP) copy.append(ctaP);

  wrapper.replaceChildren(asset, copy);
  return copy;
}

function decorateViewportStructure(rows) {
  let lastCopy = null;
  for (let i = 0; i < rows.length; i += 2) {
    const labelRow = rows[i];
    const contentRow = rows[i + 1];
    if (!contentRow) break;
    contentRow.setAttribute('data-viewport', getRowText(labelRow).replace('-viewport', ''));
    labelRow.remove();
    lastCopy = decorateCard(contentRow, lastCopy);
  }
}

export default function init(el) {
  const rows = [...el.children];
  if (rows.length >= 2 && isViewportLabel(rows[0])) {
    decorateViewportStructure(rows);
  } else {
    decorateCard(rows[0]);
  }
}
