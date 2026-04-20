import { createTag } from '../../../utils/utils.js';

function resolveIconSrc(href) {
  if (!href) return '';
  return /\.svg($|\?)/i.test(href) ? href : `${href}.svg`;
}

function decorateIcon(iconP) {
  const link = iconP?.querySelector('a');
  if (!link) return null;
  const src = resolveIconSrc(link.getAttribute('href'));
  return createTag('img', {
    class: 'pdp-hero-icon',
    src,
    alt: '',
    'aria-hidden': 'true',
    loading: 'eager',
  });
}

function decorateCtas(ctaP) {
  const primary = ctaP.querySelector('strong > a');
  const secondary = ctaP.querySelector('em > a');
  const buttons = [];
  if (secondary) {
    secondary.classList.add('con-button', 'outline', 'button-lg');
    buttons.push(secondary);
  }
  if (primary) {
    primary.classList.add('con-button', 'blue', 'fill', 'button-lg');
    buttons.push(primary);
  }
  ctaP.replaceChildren(...buttons);
  ctaP.classList.add('pdp-hero-ctas', 'action-area');
}

export default function init(el) {
  const rows = [...el.children];
  const contentRow = rows[0];
  const fgRow = rows[1];
  if (!contentRow) return;

  const [textCol, bgCol] = contentRow.children;
  if (!textCol) return;

  const heading = textCol.querySelector('h1, h2, h3, h4, h5, h6');
  const ps = [...textCol.querySelectorAll(':scope > p')];
  const iconP = ps.find((p) => p.querySelector('a') && !p.querySelector('em, strong'));
  const ctaP = ps.find((p) => p.querySelector('em a, strong a'));
  const rest = ps.filter((p) => p !== iconP && p !== ctaP);

  const priceSubtitleP = rest[rest.length - 1];
  const priceP = rest[rest.length - 2];
  const bodyPs = rest.slice(0, Math.max(0, rest.length - 2));

  const leftCol = createTag('div', { class: 'pdp-hero-content' });
  const headingRow = createTag('div', { class: 'pdp-hero-heading-row' });

  const iconImg = decorateIcon(iconP);
  if (iconImg) headingRow.append(iconImg);
  if (heading) {
    heading.classList.add('pdp-hero-heading');
    headingRow.append(heading);
  }
  if (iconImg || heading) leftCol.append(headingRow);

  bodyPs.forEach((p) => {
    p.classList.add('pdp-hero-body');
    leftCol.append(p);
  });

  const pricingCard = createTag('div', { class: 'pdp-hero-pricing' });
  if (priceP) {
    const priceInfo = createTag('div', { class: 'pdp-hero-price-info' });
    priceP.classList.add('pdp-hero-price');
    priceInfo.append(priceP);
    if (priceSubtitleP) {
      priceSubtitleP.classList.add('pdp-hero-price-subtitle');
      priceInfo.append(priceSubtitleP);
    }
    pricingCard.append(priceInfo);
  }
  if (ctaP) {
    decorateCtas(ctaP);
    pricingCard.append(ctaP);
  }

  const header = createTag('div', { class: 'pdp-hero-header' });
  header.append(leftCol);
  if (pricingCard.childElementCount) header.append(pricingCard);

  const media = createTag('div', { class: 'pdp-hero-media' });
  if (bgCol) {
    bgCol.classList.add('pdp-hero-background');
    media.append(bgCol);
  }
  if (fgRow) {
    const fgInner = fgRow.firstElementChild || fgRow;
    fgInner.className = '';
    fgInner.classList.add('pdp-hero-foreground');
    media.append(fgInner);
  }

  el.replaceChildren(header, media);
}
