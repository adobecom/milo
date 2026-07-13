import { createTag } from '../../../utils/utils.js';
import { decorateViewportContent } from '../../../utils/decorate.js';

const SCROLL_PER_APP = 200; // px of scroll travel allocated per app

function prepPic(picture) {
  if (!picture) return null;
  const clone = picture.cloneNode(true);
  clone.querySelectorAll('img').forEach((img) => img.removeAttribute('loading'));
  return clone;
}

function buildBg(apps) {
  const bg = createTag('div', { class: 'rcc-bg', 'aria-hidden': 'true' });
  apps.forEach((app, i) => {
    const slide = createTag('div', { class: `rcc-bg-slide${i === 0 ? ' rcc-bg-slide--active' : ''}` });
    const pic = prepPic(app.picture);
    if (pic) slide.append(pic);
    slide.append(createTag('div', { class: 'rcc-bg-overlay' }));
    bg.append(slide);
  });
  return bg;
}

function buildMedia(apps) {
  const wrapper = createTag('div', { class: 'rcc-media-wrapper' });
  apps.forEach((app, i) => {
    const slide = createTag('div', { class: `rcc-media-slide${i === 0 ? ' rcc-media-slide--active' : ''}` });
    const pic = prepPic(app.picture);
    if (pic) slide.append(pic);
    wrapper.append(slide);
  });
  return wrapper;
}

// Active item sits at the bottom border of the media image.
// activeY = media.bottom - listWrapper.top (both in viewport coords).
function shiftList(list, listWrapper, media, index, items) {
  const wrapRect = listWrapper.getBoundingClientRect();
  const mediaRect = media.getBoundingClientRect();
  if (!wrapRect.height) return;
  const itemH = items[0]?.offsetHeight || 32;
  const activeY = mediaRect.bottom - wrapRect.top;
  list.style.transform = `translateY(${activeY - index * itemH}px)`;
}

function decorate(block) {
  const rows = [...block.children];
  if (rows.length < 2) return;

  // --- Parse heading row (first row) ---
  const eyebrowText = rows[0].querySelector('p')?.textContent?.trim() ?? '';
  const headingText = rows[0].querySelector('h1,h2,h3,h4,h5')?.textContent?.trim() ?? '';

  // --- Parse app rows (all rows after first) ---
  // Authored structure: category rows have 1 col with <h6>; app rows have 2 cols:
  // col-0 = app name as plain text, col-1 = <picture>.
  const apps = [];
  let currentCategory = '';
  rows.slice(1).forEach((row) => {
    const cols = row.children;
    if (cols.length === 1) {
      // Category separator row
      currentCategory = cols[0].querySelector('h6')?.textContent?.trim()
        || cols[0].textContent?.trim()
        || currentCategory;
      return;
    }
    const name = cols[0]?.textContent?.trim() ?? '';
    const picture = cols[1]?.querySelector('picture') ?? null;
    if (name) apps.push({ category: currentCategory, name, picture });
  });

  if (!apps.length) return;

  // --- Scroll wrapper gives the sticky element room to scroll ---
  const scrollWrapper = createTag('div', { class: 'rcc-scroll-wrapper' });
  scrollWrapper.style.height = `calc(100dvh + ${apps.length * SCROLL_PER_APP}px)`;

  // --- Sticky visual container ---
  const sticky = createTag('div', { class: 'rcc-sticky' });

  // Background blur layer
  const bg = buildBg(apps);

  // Content layer
  const content = createTag('div', { class: 'rcc-content' });
  const left = createTag('div', { class: 'rcc-left' });

  // Header (eyebrow + heading)
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

  // Category label + divider
  const carousel = createTag('div', { class: 'rcc-carousel' });
  const categoryWrapper = createTag('div', { class: 'rcc-category-wrapper' });
  const categoryLabel = createTag('span', { class: 'rcc-category' });
  categoryLabel.textContent = apps[0].category;
  const divider = createTag('div', { class: 'rcc-divider', role: 'separator', 'aria-hidden': 'true' });
  categoryWrapper.append(categoryLabel, divider);

  // App name list
  const listWrapper = createTag('div', { class: 'rcc-list-wrapper' });
  const list = createTag('div', { class: 'rcc-list' });
  apps.forEach((app, i) => {
    const item = createTag('div', {
      class: `rcc-item${i === 0 ? ' rcc-item--active' : ''}`,
      'data-index': String(i),
    });
    item.textContent = app.name;
    list.append(item);
  });
  listWrapper.append(list);
  carousel.append(categoryWrapper, listWrapper);
  left.append(header, carousel);

  // Media slides (crossfade panel)
  const media = buildMedia(apps);
  content.append(left, media);
  sticky.append(bg, content);
  scrollWrapper.append(sticky);
  block.replaceChildren(scrollWrapper);

  // --- Scroll-driven active state ---
  // requestAnimationFrame ensures layout is computed before the first shiftList call
  const items = [...list.querySelectorAll('.rcc-item')];
  const mediaSlides = [...media.querySelectorAll('.rcc-media-slide')];
  const bgSlides = [...bg.querySelectorAll('.rcc-bg-slide')];
  let activeIdx = 0;

  const activate = (newIdx) => {
    if (newIdx === activeIdx) return;
    items[activeIdx].classList.remove('rcc-item--active');
    mediaSlides[activeIdx].classList.remove('rcc-media-slide--active');
    bgSlides[activeIdx].classList.remove('rcc-bg-slide--active');
    activeIdx = newIdx;
    items[activeIdx].classList.add('rcc-item--active');
    mediaSlides[activeIdx].classList.add('rcc-media-slide--active');
    bgSlides[activeIdx].classList.add('rcc-bg-slide--active');
    categoryLabel.textContent = apps[activeIdx].category;
    shiftList(list, listWrapper, media, activeIdx, items);
  };

  window.addEventListener('scroll', () => {
    const rect = scrollWrapper.getBoundingClientRect();
    const usable = rect.height - window.innerHeight;
    if (usable <= 0) return;
    const p = Math.max(0, Math.min(1, -rect.top / usable));
    activate(Math.min(Math.floor(p * apps.length), apps.length - 1));
  }, { passive: true });

  // Recompute list offset on layout and any resize
  window.requestAnimationFrame(() => shiftList(list, listWrapper, media, activeIdx, items));

  const ro = new ResizeObserver(() => shiftList(list, listWrapper, media, activeIdx, items));
  ro.observe(listWrapper);
}

export default function init(el) {
  decorateViewportContent(el, decorate);
}
