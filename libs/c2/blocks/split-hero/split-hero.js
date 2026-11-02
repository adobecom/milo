import { createTag, getFederatedUrl } from '../../../utils/utils.js';
import { decorateBlockBg, decorateBlockText, decorateButtons, decorateViewportContent, normalizeMasFieldText } from '../../../utils/decorate.js';

const MAS_BODY_FIELDS = 'mas-field:is([field="description"], [field="shortDescription"])';

const hasContent = (cell) => !!cell
  && (!!cell.textContent.trim() || !!cell.querySelector(':not(p, br)'));

const MAS_FIELD_CLASSES = {
  description: ['mas-description'],
  prices: ['mas-price', 'heading-5'],
  shortDescription: ['mas-short-description'],
  subtitle: ['mas-subtitle'],
  badge: ['mas-badge'],
  cardTitle: ['mas-card-title', 'heading-5'],
};

function decorateMasField(cardContent) {
  cardContent.querySelectorAll('mas-field[field]').forEach((masField) => {
    const classes = MAS_FIELD_CLASSES[masField.getAttribute('field')];
    if (classes) masField.classList.add(...classes);
  });
  const priceParent = cardContent.querySelector('.mas-price')?.parentElement;
  const commitmentEl = priceParent?.nextElementSibling;
  if (!commitmentEl?.matches('p') || commitmentEl.children.length || !commitmentEl.textContent.trim()) return;
  priceParent.append(commitmentEl);
  commitmentEl.classList.add('mas-price-commitment');
}

function buildMerchCard(col, { pillCtas = false } = {}) {
  [...col.children]
    .filter((el) => !el.matches(MAS_BODY_FIELDS) && !el.querySelector(MAS_BODY_FIELDS))
    .forEach((el) => decorateButtons(el));
  col.querySelectorAll(`:scope > p:has(> ${MAS_BODY_FIELDS})`)
    .forEach((p) => p.classList.add('body-md'));
  normalizeMasFieldText(col, 'md', MAS_BODY_FIELDS);

  let allParas = [...col.querySelectorAll(':scope > :is(p, h1, h2, h3, h4, h5, h6, mas-field, div)')]
    .filter((el) => el.textContent.trim() || el.matches('mas-field')
      || el.querySelector('mas-field, [is="inline-price"], .con-button, a[data-wcs-osi]'));
  if (!allParas.length && col.textContent.trim()) {
    const para = createTag('p');
    para.append(...col.childNodes);
    allParas = [para];
  }

  const cardContent = createTag('div', { class: 'split-hero-merch-content' });
  // Keep the mas-field wrapper: its tooltip CSS is scoped to `mas-field .icon-button`.
  allParas.forEach((el) => cardContent.append(el.closest('mas-field') || el));
  decorateMasField(cardContent);

  const merchCard = createTag('div', { class: 'split-hero-merch-card' });
  merchCard.append(cardContent);
  const ctaSelector = '.con-button, a[data-wcs-osi], mas-field[field^="ctas"]';
  const isCtaPara = (el) => {
    const cta = el.matches(ctaSelector) ? el : el.querySelector(ctaSelector);
    return !!cta && !cta.closest(MAS_BODY_FIELDS);
  };
  const ctaParas = [...cardContent.children].filter(isCtaPara);
  if (ctaParas.length) {
    const ctaWrapper = createTag('div', { class: 'split-hero-merch-ctas' });
    if (pillCtas) merchCard.append(ctaWrapper);
    else ctaParas[0].replaceWith(ctaWrapper);
    ctaParas.forEach((para) => ctaWrapper.append(para));
  }

  return merchCard;
}

function decorateCopy(copy) {
  const heading = copy.querySelector('h1, h2, h3, h4, h5, h6');
  const eyebrow = heading?.previousElementSibling;
  if (eyebrow?.matches('p')) {
    eyebrow.querySelectorAll('img[src*=".svg"]').forEach((img) => {
      img.src = getFederatedUrl(img.getAttribute('src'));
    });
    eyebrow.classList.add('eyebrow');
    eyebrow.before(heading);
  }
  decorateBlockText(copy, { heading: '2', body: 'md', button: 'md' });
  const [, ...otherHeadings] = copy.querySelectorAll('h1, h2, h3, h4, h5, h6');
  otherHeadings.forEach((other) => other.classList.remove('heading-2'));
  normalizeMasFieldText(copy, 'md');
  copy.classList.add('split-hero-text');
}

function decorateBackground(block, bg) {
  if (!hasContent(bg)) return null;
  decorateBlockBg(block, bg, { className: 'split-hero-background' });
  if (bg.classList.contains('split-hero-background')) return bg;
  if (!block.style.background) return null;
  const colorBg = createTag('div', { class: 'split-hero-background', style: `background: ${block.style.background}` });
  block.style.removeProperty('background');
  return colorBg;
}

function decorate(block, root) {
  const [mainRow, offerRow, supportingRow] = block.children;
  const [copy, media] = mainRow?.children || [];
  const [merch, bg] = offerRow?.children || [];
  const [supporting] = supportingRow?.children || [];
  if (!copy) return;

  decorateCopy(copy);
  const copyGroup = createTag('div', { class: 'split-hero-copy' }, copy);
  const foreground = createTag('div', { class: 'split-hero-foreground' }, copyGroup);
  if (hasContent(merch)) {
    const card = buildMerchCard(merch, { pillCtas: root.classList.contains('cta-pill') });
    if (root.classList.contains('special-promo')) {
      card.classList.add(root.classList.contains('dark') ? 'light' : 'dark');
    }
    copyGroup.append(card);
  }
  if (hasContent(supporting)) {
    supporting.classList.add('split-hero-supporting', 'caption');
    foreground.append(supporting);
  }

  const content = createTag('div', { class: 'split-hero-content container' }, foreground);
  if (hasContent(media)) {
    const frame = createTag('div', { class: 'split-hero-media-frame' });
    frame.append(...media.childNodes);
    media.append(frame);
    media.classList.add('split-hero-media');
    content.append(media);
  }
  const background = decorateBackground(block, bg);
  block.replaceChildren(...[background, content].filter(Boolean));
}

function initParallax(el) {
  if (!el.classList.contains('parallax-reveal')) return;
  const section = el.closest('.section');
  const next = section?.nextElementSibling;
  if (!next?.matches('.section') || !el.querySelector('.split-hero-media-frame')) return;
  section.classList.add('split-hero-reveal');
  if (!CSS.supports('timeline-scope: --split-hero')) return;

  const motion = window.matchMedia('(prefers-reduced-motion: no-preference)');
  const measure = () => {
    if (!motion.matches) return;
    const headers = document.querySelectorAll('header, header nav, header .feds-breadcrumbs, header .feds-localnav-bar');
    const head = Math.max(0, ...[...headers].map((item) => item.getBoundingClientRect().bottom));
    section.style.setProperty('--sh-head', `${head}px`);
    if (window.innerWidth < 900) {
      section.style.setProperty('--sh-mobile-span', `${Math.max(200, el.offsetHeight - head)}px`);
      return;
    }

    section.style.setProperty('--sh-height', `${window.innerHeight}px`);
    const frame = [...el.querySelectorAll('.split-hero-media-frame')]
      .find((item) => item.offsetWidth);
    if (!frame) return;
    const top = parseFloat(getComputedStyle(frame.closest('.split-hero-content')).paddingBlockStart)
      - head;
    const width = document.documentElement.clientWidth;
    const fit = Math.max(360, Math.min(800, (width * 27) / 64));
    const lip = el.offsetHeight - 32;
    const frameHeight = Math.max(1, frame.offsetHeight);
    const frameWidth = Math.max(1, frame.offsetWidth);
    const { left, right } = frame.getBoundingClientRect();
    const start = getComputedStyle(frame).direction === 'rtl' ? width - right : left;
    const widthScale = (width - start - 24) / frameWidth;
    const heightScale = (Math.min(lip, window.innerHeight) - head - 64) / frameHeight;
    const scale = Math.max(0.01, Math.min(0.98, widthScale, heightScale));
    const drop = Math.max(0, lip + 32 - head - top - frameHeight);
    const lift = top - 16;
    const horizontalFit = (start + frameWidth - width) / (frameWidth * (1 - scale));
    const verticalFit = (head + top + drop + frameHeight - lip)
      / (drop + lift + frameHeight * (1 - scale));
    // Pace the sheet against both media edges, not just its bottom edge.
    const revealed = fit * Math.max(0, Math.min(1, Math.max(horizontalFit, verticalFit)));
    const release = Math.max(80, revealed - Math.min(80, fit * 0.12));
    // Small frames must remain visible long enough for the sheet to return.
    const returnDistance = lip + release * 1.25 - fit - head;
    const mediaRate = Math.min(0.22, Math.max(0, (frameHeight * scale - 32) / returnDistance));
    const values = {
      '--sh-fit': `${fit}px`,
      '--sh-release': `${release}px`,
      '--sh-media-drop': `${drop}px`,
      '--sh-media-lift': `${lift}px`,
      '--sh-media-rate': mediaRate,
      '--sh-scale': scale,
    };
    Object.entries(values).forEach(([name, value]) => section.style.setProperty(name, value));
    next.style.setProperty('--sh-release', `${release}px`);
  };
  const observer = new ResizeObserver(measure);
  el.querySelectorAll('.split-hero-foreground, .split-hero-media-frame')
    .forEach((item) => observer.observe(item));
  const header = document.querySelector('header');
  if (header) {
    observer.observe(header);
    new MutationObserver(measure).observe(header, { childList: true, subtree: true });
  }
  el.addEventListener('load', measure, true);
  el.addEventListener('loadedmetadata', measure, true);
  window.addEventListener('resize', measure);
  motion.addEventListener('change', measure);
  measure();
}

export default function init(el) {
  decorateViewportContent(el, decorate);
  initParallax(el);
}
