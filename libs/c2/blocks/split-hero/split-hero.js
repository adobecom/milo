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
  block.querySelectorAll('video:not([controls])').forEach((video) => video.setAttribute('tabindex', '-1'));
}

function initParallax(el) {
  if (!el.classList.contains('parallax-reveal')) return;
  const section = el.closest('.section');
  const next = section?.nextElementSibling;
  if (!next?.matches('.section') || !el.querySelector('.split-hero-media-frame')) return;
  section.classList.add('split-hero-reveal');
  if (!CSS.supports('timeline-scope: --split-hero')) return;

  const motion = window.matchMedia('(prefers-reduced-motion: no-preference)');
  const desktop = window.matchMedia('(width >= 900px)');
  const measure = () => {
    if (!motion.matches) return;
    const style = getComputedStyle(section);
    const read = (name) => parseFloat(style.getPropertyValue(name)) || 0;
    const headerHeight = read('--sh-header-h');
    if (!desktop.matches) {
      const driftEnd = Math.max(200, el.offsetHeight - headerHeight);
      section.style.setProperty('--sh-drift-end', `${driftEnd}px`);
      return;
    }

    const tune = (name) => read(`--sh-d-${name}`);
    const frame = [...el.querySelectorAll('.split-hero-media-frame')]
      .find((item) => item.offsetWidth);
    if (!frame) return;
    const content = frame.closest('.split-hero-content');
    const topGap = parseFloat(getComputedStyle(content).paddingBlockStart) - headerHeight;
    const width = document.documentElement.clientWidth;
    const frameHeight = Math.max(1, frame.offsetHeight);
    const frameWidth = Math.max(1, frame.offsetWidth);
    const { left, right } = frame.getBoundingClientRect();
    const frameStart = getComputedStyle(frame).direction === 'rtl' ? width - right : left;
    const fitWidth = Math.max(width, tune('fit-width'));
    const widthScale = (fitWidth - frameStart - tune('margin')) / frameWidth;
    const frameEndScale = Math.max(tune('scale-min'), Math.min(1, widthScale));
    const mediaStartDrop = Math.max(0, el.offsetHeight - headerHeight - topGap - frameHeight);
    const values = {
      '--sh-drop': `${mediaStartDrop}px`,
      '--sh-scale': frameEndScale,
    };
    Object.entries(values).forEach(([name, value]) => section.style.setProperty(name, value));
  };
  let scheduled = 0;
  const schedule = () => {
    if (scheduled) return;
    scheduled = requestAnimationFrame(() => {
      scheduled = 0;
      measure();
    });
  };
  const observer = new ResizeObserver(measure);
  el.querySelectorAll('.split-hero-foreground, .split-hero-media-frame')
    .forEach((item) => observer.observe(item));
  el.addEventListener('load', schedule, true);
  el.addEventListener('loadedmetadata', schedule, true);
  window.addEventListener('resize', schedule);
  motion.addEventListener('change', schedule);
  measure();
}

export default function init(el) {
  decorateViewportContent(el, decorate);
  initParallax(el);
}
