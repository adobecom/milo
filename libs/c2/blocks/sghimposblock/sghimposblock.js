import { decorateBlockText } from '../../../utils/decorate.js';

const VIEWPORT_KEYWORDS = ['mobile-viewport', 'tablet-viewport', 'desktop-viewport'];

function getRowText(row) {
  return row.querySelector(':scope > div')?.textContent?.trim().toLowerCase() ?? '';
}

function isViewportLabel(row) {
  return VIEWPORT_KEYWORDS.includes(getRowText(row));
}

function decorateCard(wrapper, inheritedTextEl = null) {
  const cols = [...wrapper.querySelectorAll(':scope > div')];
  const [textColRaw, mediaCol] = cols;

  const hasContent = textColRaw?.children.length > 0;
  let textCol = hasContent ? textColRaw : null;

  if (!textCol && inheritedTextEl) {
    const cloned = inheritedTextEl.cloneNode(true);
    textColRaw?.replaceWith(cloned);
    textCol = cloned;
  } else if (!textCol) {
    textCol = textColRaw;
  }

  // Mark plain CTAs before decorateBlockText so they don't get body-md
  textCol?.querySelectorAll(':scope > p > a').forEach((a) => {
    if (!a.closest('em') && !a.closest('strong')) {
      a.closest('p').classList.add('sg-cta');
    }
  });

  if (textCol) decorateBlockText(textCol, { heading: '4', body: 'md' });

  // Extract icon (first p containing only a picture)
  const iconP = textCol?.querySelector(':scope > p:first-child');
  const isIconOnly = iconP && iconP.childElementCount === 1 && iconP.querySelector('picture');
  const icon = isIconOnly ? iconP : null;
  if (icon) icon.remove();

  const ctaP = textCol?.querySelector('.sg-cta');
  if (ctaP) ctaP.remove();

  // Build asset container
  const asset = document.createElement('div');
  asset.classList.add('sg-asset');
  if (mediaCol) {
    mediaCol.classList.add('sg-media');
    asset.append(mediaCol);
  }
  if (icon) {
    const iconWrap = document.createElement('div');
    iconWrap.classList.add('sg-icon');
    iconWrap.append(icon);
    asset.append(iconWrap);
  }

  // Build copy container
  const copy = document.createElement('div');
  copy.classList.add('sg-copy');
  if (textCol) {
    textCol.classList.add('sg-foreground');
    copy.append(textCol);
  }
  if (ctaP) copy.append(ctaP);

  wrapper.replaceChildren(asset, copy);
  return hasContent ? textCol : inheritedTextEl;
}

function decorateViewportStructure(rows) {
  let lastTextEl = null;
  for (let i = 0; i < rows.length; i += 2) {
    const labelRow = rows[i];
    const contentRow = rows[i + 1];
    if (!contentRow) break;
    contentRow.setAttribute('data-viewport', getRowText(labelRow).replace('-viewport', ''));
    labelRow.remove();
    lastTextEl = decorateCard(contentRow, lastTextEl);
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
