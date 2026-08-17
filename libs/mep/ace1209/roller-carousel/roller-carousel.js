import { createTag } from '../../../utils/utils.js';
import { decorateViewportContent } from '../../../utils/decorate.js';

const SCROLL_PER_APP = 200;
const M_BREAKPOINT = 1024;
const L_BREAKPOINT = 1280;
const S_BREAKPOINT = 768;
const MIN_ROLLER_ROOM = 120;

function prepPic(picture) {
  if (!picture) return null;
  const clone = picture.cloneNode(true);
  clone.querySelectorAll('img').forEach((img) => img.removeAttribute('loading'));
  return clone;
}

function eagerLoad(scope, highPriority) {
  scope.querySelectorAll('img').forEach((img) => {
    img.setAttribute('loading', 'eager');
    if (highPriority) img.setAttribute('fetchpriority', 'high');
  });
}

function optimizeImageLoading(block, bg, media) {
  const firstBg = bg.querySelector('.rcc-bg-slide');
  const firstMedia = media.querySelector('.rcc-media-slide');
  if (firstBg) eagerLoad(firstBg, true);
  if (firstMedia) eagerLoad(firstMedia, false);

  const eagerScopes = [firstBg, firstMedia].filter(Boolean);
  [...block.querySelectorAll('img')]
    .filter((img) => !eagerScopes.some((scope) => scope.contains(img)))
    .forEach((img) => img.setAttribute('fetchpriority', 'low'));
}

function buildBgSlide(app, active) {
  const slide = createTag('div', { class: `rcc-bg-slide${active ? ' is-active' : ''}` });
  const pic = prepPic(app.picture);
  if (pic) slide.append(pic);
  slide.append(createTag('div', { class: 'rcc-bg-overlay' }));
  return slide;
}

function buildBg(apps) {
  const bg = createTag('div', { class: 'rcc-bg', 'aria-hidden': 'true' });
  apps.forEach((app, i) => bg.append(buildBgSlide(app, i === 0)));
  return bg;
}

function buildMedia(apps) {
  const wrapper = createTag('div', { class: 'rcc-media-wrapper' });
  apps.forEach((app, i) => {
    const slide = createTag('div', { class: `rcc-media-slide${i === 0 ? ' is-active' : ''}` });
    const pic = prepPic(app.picture);
    if (pic) slide.append(pic);
    const iconPic = prepPic(app.icon);
    if (iconPic) {
      const iconWrap = createTag('div', { class: 'rcc-media-icon' });
      iconWrap.append(iconPic);
      slide.append(iconWrap);
    }
    wrapper.append(slide);
  });
  return wrapper;
}

function buildHeader(eyebrowEl, headingEl) {
  const header = createTag('div', { class: 'rcc-header' });
  if (eyebrowEl) {
    eyebrowEl.classList.add('rcc-eyebrow', 'eyebrow');
    header.append(eyebrowEl);
  }
  if (headingEl) {
    headingEl.classList.add('rcc-heading', 'heading-2');
    header.append(headingEl);
  }
  return header;
}

function parseContent(rows) {
  const eyebrowEl = rows[0].querySelector('p');
  const headingEl = rows[0].querySelector('h1,h2,h3,h4,h5,h6');

  const apps = [];
  let currentCategory = '';
  rows.slice(1).forEach((row) => {
    const cols = row.children;
    if (cols.length === 1) {
      currentCategory = cols[0].textContent?.trim() || currentCategory;
      return;
    }
    const name = cols[0]?.textContent?.trim() ?? '';
    const pics = [...row.querySelectorAll('picture')];
    const icon = pics.length > 1 ? pics[0] : null;
    const picture = pics.length > 1 ? pics[1] : (pics[0] ?? null);
    if (name) apps.push({ category: currentCategory, name, picture, icon });
  });

  return { eyebrowEl, headingEl, apps };
}

function buildReducedMotion(block, eyebrowEl, headingEl, apps) {
  block.classList.add('rcc-reduced-motion');

  const bg = createTag('div', { class: 'rcc-bg', 'aria-hidden': 'true' });
  const bgSlide = buildBgSlide(apps[0], true);
  eagerLoad(bgSlide, true);
  bg.append(bgSlide);

  const content = createTag('div', { class: 'rcc-rm-content' });
  content.append(buildHeader(eyebrowEl, headingEl));

  const list = createTag('div', { class: 'rcc-rm-list' });
  let currentCategory = null;
  let group = null;
  apps.forEach((app) => {
    if (app.category && app.category !== currentCategory) {
      currentCategory = app.category;
      const catWrap = createTag('div', { class: 'rcc-category-wrapper rcc-rm-category' });
      const catLabel = createTag('h3', { class: 'rcc-category heading-6' });
      catLabel.textContent = currentCategory;
      catWrap.append(catLabel, createTag('div', { class: 'rcc-divider', 'aria-hidden': 'true' }));
      list.append(catWrap);
      group = createTag('ul', { class: 'rcc-rm-group', 'aria-label': currentCategory });
      list.append(group);
    }
    const li = createTag('li', { class: 'rcc-rm-item' });
    li.textContent = app.name;
    if (!group) {
      group = createTag('ul', { class: 'rcc-rm-group' });
      list.append(group);
    }
    group.append(li);
  });
  content.append(list);

  block.replaceChildren(bg, content);
}

function buildRoller(block, eyebrowEl, headingEl, apps) {
  const scrollWrapper = createTag('div', { class: 'rcc-scroll-wrapper' });
  scrollWrapper.style.height = `calc(100dvh + ${apps.length * SCROLL_PER_APP}px)`;

  const sticky = createTag('div', { class: 'rcc-sticky' });
  const bg = buildBg(apps);
  const content = createTag('div', { class: 'rcc-content' });
  const left = createTag('div', { class: 'rcc-left' });
  const header = buildHeader(eyebrowEl, headingEl);

  const carousel = createTag('div', { class: 'rcc-carousel' });
  const categoryWrapper = createTag('div', { class: 'rcc-category-wrapper' });
  const categoryLabel = createTag('span', { class: 'rcc-category heading-6' });
  categoryLabel.textContent = apps[0].category;
  const divider = createTag('div', { class: 'rcc-divider', 'aria-hidden': 'true' });
  categoryWrapper.append(categoryLabel, divider);

  const listWrapper = createTag('div', { class: 'rcc-list-wrapper' });
  const list = createTag('ul', { class: 'rcc-list' });
  apps.forEach((app, i) => {
    const item = createTag('li', { class: `rcc-item heading-2${i === 0 ? ' is-active' : ''}` });
    item.textContent = app.name;
    list.append(item);
  });
  listWrapper.append(list);
  carousel.append(categoryWrapper, listWrapper);
  left.append(header, carousel);

  const media = buildMedia(apps);
  content.append(left, media);
  sticky.append(content);
  scrollWrapper.append(sticky);
  block.replaceChildren(bg, scrollWrapper);

  return {
    bg,
    scrollWrapper,
    content,
    left,
    header,
    carousel,
    sticky,
    categoryWrapper,
    categoryLabel,
    divider,
    listWrapper,
    list,
    media,
  };
}

function createActivate({ items, mediaSlides, bgSlides, categoryLabel, apps }) {
  let activeIdx = 0;
  return (newIdx) => {
    if (newIdx === activeIdx) return;
    items[activeIdx].classList.remove('is-active');
    mediaSlides[activeIdx].classList.remove('is-active');
    bgSlides[activeIdx].classList.remove('is-active');
    activeIdx = newIdx;
    items[activeIdx].classList.add('is-active');
    mediaSlides[activeIdx].classList.add('is-active');
    bgSlides[activeIdx].classList.add('is-active');
    categoryLabel.textContent = apps[activeIdx].category;
  };
}

function createUpdatePosition({
  block, media, divider, scrollWrapper, listWrapper, list, items, apps, activate,
}) {
  return () => {
    const w = window.innerWidth;
    const mediaRect = media.getBoundingClientRect();

    let mediaHidden = false;
    if (w < L_BREAKPOINT) {
      const dividerBottom = divider.getBoundingClientRect().bottom;
      mediaHidden = mediaRect.top < dividerBottom;
      media.style.visibility = mediaHidden ? 'hidden' : '';
    } else {
      media.style.visibility = '';
    }

    const rect = scrollWrapper.getBoundingClientRect();
    const usable = rect.height - window.innerHeight;
    if (usable <= 0) return;

    const wrapRect = listWrapper.getBoundingClientRect();
    if (!wrapRect.height) return;

    const itemH = items[0]?.offsetHeight || 32;
    let lineY;
    let bottomAlign;
    if (block.classList.contains('rcc-reflow') || mediaHidden) {
      lineY = itemH * 0.5;
      bottomAlign = false;
    } else if (w >= L_BREAKPOINT) {
      lineY = mediaRect.bottom - wrapRect.top;
      bottomAlign = true;
    } else if (w >= M_BREAKPOINT) {
      lineY = mediaRect.top - wrapRect.top + itemH * 0.75;
      bottomAlign = false;
    } else {
      const keyLine = divider.getBoundingClientRect().bottom - wrapRect.top;
      const imageTop = mediaRect.top - wrapRect.top;
      lineY = (keyLine + imageTop) / 2 + itemH / 2;
      bottomAlign = true;
    }
    const scrolled = Math.max(0, Math.min(usable, -rect.top));
    const progress = scrolled / SCROLL_PER_APP;
    const offset = bottomAlign ? progress + 1 : progress;

    list.style.transform = `translateY(${lineY - offset * itemH}px)`;
    activate(Math.min(Math.floor(progress), apps.length - 1));
  };
}

function createReflow({
  block, content, divider, left, header, carousel, scrollWrapper,
}) {
  let reflowVpThreshold = 0;
  const setReflow = (on) => {
    if (on === block.classList.contains('rcc-reflow')) return;
    if (on) {
      block.insertBefore(header, scrollWrapper);
      block.classList.add('rcc-reflow');
    } else {
      left.insertBefore(header, carousel);
      block.classList.remove('rcc-reflow');
    }
  };
  return () => {
    const vh = window.innerHeight;
    const w = window.innerWidth;
    if (w < S_BREAKPOINT) {
      setReflow(true);
      return;
    }
    if (!block.classList.contains('rcc-reflow')) {
      const dividerOffset = divider.getBoundingClientRect().bottom
        - content.getBoundingClientRect().top;
      const roomBelow = vh - dividerOffset;
      if (roomBelow < MIN_ROLLER_ROOM) {
        reflowVpThreshold = vh + (MIN_ROLLER_ROOM - roomBelow);
        setReflow(true);
      }
    } else if (vh > reflowVpThreshold + 40) {
      setReflow(false);
    }
  };
}

function initScroll(block, refs, apps) {
  const {
    bg, scrollWrapper, content, left, header, carousel, sticky, categoryWrapper,
    categoryLabel, divider, listWrapper, list, media,
  } = refs;

  const items = [...list.querySelectorAll('.rcc-item')];
  const mediaSlides = [...media.querySelectorAll('.rcc-media-slide')];
  const bgSlides = [...bg.querySelectorAll('.rcc-bg-slide')];

  const activate = createActivate({ items, mediaSlides, bgSlides, categoryLabel, apps });
  const updatePosition = createUpdatePosition({
    block, media, divider, scrollWrapper, listWrapper, list, items, apps, activate,
  });
  const evaluateReflow = createReflow({
    block, content, divider, left, header, carousel, scrollWrapper,
  });

  window.requestAnimationFrame(updatePosition);
  new ResizeObserver(updatePosition).observe(listWrapper);

  evaluateReflow();
  window.addEventListener('resize', () => {
    evaluateReflow();
    window.requestAnimationFrame(updatePosition);
  }, { passive: true });
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(() => {
      updatePosition();
      evaluateReflow();
      ticking = false;
    });
  }, { passive: true });
}

function decorate(block) {
  const rows = [...block.children];
  if (rows.length < 2) return;

  const { eyebrowEl, headingEl, apps } = parseContent(rows);
  if (!apps.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    buildReducedMotion(block, eyebrowEl, headingEl, apps);
    return;
  }

  const refs = buildRoller(block, eyebrowEl, headingEl, apps);
  optimizeImageLoading(block, refs.bg, refs.media);
  initScroll(block, refs, apps);
}

export default function init(el) {
  decorateViewportContent(el, decorate);
}
