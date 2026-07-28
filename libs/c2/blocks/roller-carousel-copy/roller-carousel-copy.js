import { createTag } from '../../../utils/utils.js';
import { decorateViewportContent } from '../../../utils/decorate.js';

const SCROLL_PER_APP = 200;
const L_BREAKPOINT = 1280;

function prepPic(picture) {
  if (!picture) return null;
  const clone = picture.cloneNode(true);
  clone.querySelectorAll('img').forEach((img) => img.removeAttribute('loading'));
  return clone;
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

function buildHeader(eyebrowText, headingText) {
  const header = createTag('div', { class: 'rcc-header' });
  if (eyebrowText) {
    const eyebrow = createTag('p', { class: 'rcc-eyebrow' });
    eyebrow.textContent = eyebrowText;
    header.append(eyebrow);
  }
  if (headingText) {
    const h = createTag('h2', { class: 'rcc-heading' });
    h.textContent = headingText;
    header.append(h);
  }
  return header;
}

function buildReducedMotion(block, eyebrowText, headingText, apps) {
  block.classList.add('rcc-reduced-motion');

  const bg = createTag('div', { class: 'rcc-bg', 'aria-hidden': 'true' });
  bg.append(buildBgSlide(apps[0], true));

  const content = createTag('div', { class: 'rcc-rm-content' });
  content.append(buildHeader(eyebrowText, headingText));

  const list = createTag('div', { class: 'rcc-rm-list' });
  let currentCategory = null;
  let group = null;
  apps.forEach((app) => {
    if (app.category && app.category !== currentCategory) {
      currentCategory = app.category;
      const catWrap = createTag('div', { class: 'rcc-category-wrapper rcc-rm-category' });
      const catLabel = createTag('h3', { class: 'rcc-category' });
      catLabel.textContent = currentCategory;
      catWrap.append(catLabel, createTag('div', { class: 'rcc-divider', 'aria-hidden': 'true' }));
      list.append(catWrap);
      group = createTag('ul', { class: 'rcc-rm-group', 'aria-label': currentCategory });
      list.append(group);
    }
    const li = createTag('li');
    const btn = createTag('button', { class: 'rcc-rm-item', type: 'button' });
    btn.textContent = app.name;
    li.append(btn);
    group.append(li);
  });
  content.append(list);

  block.replaceChildren(bg, content);
}

function decorate(block) {
  const rows = [...block.children];
  if (rows.length < 2) return;

  const eyebrowText = rows[0].querySelector('p')?.textContent?.trim() ?? '';
  const headingText = rows[0].querySelector('h1,h2,h3,h4,h5')?.textContent?.trim() ?? '';

  const apps = [];
  let currentCategory = '';
  rows.slice(1).forEach((row) => {
    const cols = row.children;
    if (cols.length === 1) {
      currentCategory = cols[0].querySelector('h6')?.textContent?.trim()
        || cols[0].textContent?.trim()
        || currentCategory;
      return;
    }
    const name = cols[0]?.textContent?.trim() ?? '';
    const pics = [...row.querySelectorAll('picture')];
    const icon = pics.length > 1 ? pics[0] : null;
    const picture = pics.length > 1 ? pics[1] : (pics[0] ?? null);
    if (name) apps.push({ category: currentCategory, name, picture, icon });
  });

  if (!apps.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    buildReducedMotion(block, eyebrowText, headingText, apps);
    return;
  }

  const scrollWrapper = createTag('div', { class: 'rcc-scroll-wrapper' });
  scrollWrapper.style.height = `calc(100dvh + ${apps.length * SCROLL_PER_APP}px)`;

  const sticky = createTag('div', { class: 'rcc-sticky' });

  const bg = buildBg(apps);

  const content = createTag('div', { class: 'rcc-content' });
  const left = createTag('div', { class: 'rcc-left' });

  const header = buildHeader(eyebrowText, headingText);

  const carousel = createTag('div', { class: 'rcc-carousel' });
  const categoryWrapper = createTag('div', { class: 'rcc-category-wrapper' });
  const categoryLabel = createTag('span', { class: 'rcc-category' });
  categoryLabel.textContent = apps[0].category;
  const divider = createTag('div', { class: 'rcc-divider', role: 'separator', 'aria-hidden': 'true' });
  categoryWrapper.append(categoryLabel, divider);

  const listWrapper = createTag('div', { class: 'rcc-list-wrapper' });
  const list = createTag('ul', { class: 'rcc-list', 'aria-label': 'Included apps' });
  apps.forEach((app, i) => {
    const item = createTag('li', { class: `rcc-item${i === 0 ? ' is-active' : ''}` });
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

  const items = [...list.querySelectorAll('.rcc-item')];
  const mediaSlides = [...media.querySelectorAll('.rcc-media-slide')];
  const bgSlides = [...bg.querySelectorAll('.rcc-bg-slide')];
  let activeIdx = 0;

  const activate = (newIdx) => {
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

  const updatePosition = () => {
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
    } else {
      lineY = mediaRect.top - wrapRect.top - itemH;
      bottomAlign = true;
    }
    const scrolled = Math.max(0, Math.min(usable, -rect.top));
    const progress = scrolled / SCROLL_PER_APP;
    const offset = bottomAlign ? progress + 1 : progress;

    list.style.transform = `translateY(${lineY - offset * itemH}px)`;
    activate(Math.min(Math.floor(progress), apps.length - 1));
  };

  window.requestAnimationFrame(updatePosition);

  const ro = new ResizeObserver(updatePosition);
  ro.observe(listWrapper);

  const MIN_ROLLER_ROOM = 120;
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
  const evaluateReflow = () => {
    const vh = window.innerHeight;
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
  evaluateReflow();
  window.addEventListener('resize', () => {
    evaluateReflow();
    window.requestAnimationFrame(updatePosition);
  }, { passive: true });
  window.addEventListener('scroll', () => {
    updatePosition();
    evaluateReflow();
  }, { passive: true });
}

export default function init(el) {
  decorateViewportContent(el, decorate);
}
