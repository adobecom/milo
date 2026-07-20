import { createTag } from '../../../utils/utils.js';
import { decorateViewportContent } from '../../../utils/decorate.js';

const SCROLL_PER_APP = 200; // px of scroll travel allocated per app
const M_BREAKPOINT = 768; // media grows / absolute-positioned panel
const L_BREAKPOINT = 1280; // two-column layout kicks in here
const M_TOP_INSET = 48; // M: image top margin (app-icon area) the names start below

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
  sticky.append(content);
  scrollWrapper.append(sticky);
  // Blur sits at block level, behind everything, so a detached (reflow) header
  // still has the blur behind it instead of the block's solid background.
  block.replaceChildren(bg, scrollWrapper);

  // --- Scroll-driven state ---
  const items = [...list.querySelectorAll('.rcc-item')];
  const mediaSlides = [...media.querySelectorAll('.rcc-media-slide')];
  const bgSlides = [...bg.querySelectorAll('.rcc-bg-slide')];
  let activeIdx = 0;

  // Swap active classes + category label — no position logic here
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
  };

  // Single update function: moves list continuously with scroll,
  // then activates whichever item is at the media's bottom border.
  const updatePosition = () => {
    const w = window.innerWidth;
    const mediaRect = media.getBoundingClientRect();

    // S/M: the image is bottom-anchored and, once at its min-height, rises as the
    // viewport shortens. When its top reaches the divider line above, hide it.
    if (w < L_BREAKPOINT) {
      const dividerBottom = divider.getBoundingClientRect().bottom;
      media.style.visibility = mediaRect.top < dividerBottom ? 'hidden' : '';
    } else {
      media.style.visibility = '';
    }

    const rect = scrollWrapper.getBoundingClientRect();
    const usable = rect.height - window.innerHeight;
    if (usable <= 0) return;

    const wrapRect = listWrapper.getBoundingClientRect();
    if (!wrapRect.height) return;

    const itemH = items[0]?.offsetHeight || 32;
    // The highlight lock line — where the active app name sits — differs by grid:
    //  - L/XL: line at the image BOTTOM; active name is bottom-aligned to it, so
    //    it sits just above the image bottom and the list scrolls up through it.
    //  - M:    line just below the image's TOP margin (app-icon area); active
    //    name is top-aligned there and the list flows downward.
    //  - S:    line at the image TOP; active name is bottom-aligned so it sits a
    //    little above the image top, and the list flows downward.
    let lineY;
    let bottomAlign;
    if (w >= L_BREAKPOINT) {
      lineY = mediaRect.bottom - wrapRect.top;
      bottomAlign = true;
    } else if (w >= M_BREAKPOINT) {
      lineY = mediaRect.top - wrapRect.top + M_TOP_INSET;
      bottomAlign = false;
    } else {
      lineY = mediaRect.top - wrapRect.top;
      bottomAlign = true;
    }
    // Continuous scroll progress: each SCROLL_PER_APP px moves list by one itemH
    const scrolled = Math.max(0, Math.min(usable, -rect.top));
    const progress = scrolled / SCROLL_PER_APP;
    // bottom-aligned lines add one itemH so the active name's BOTTOM lands on the
    // line; top-aligned lines put the active name's TOP directly on the line.
    const offset = bottomAlign ? progress + 1 : progress;

    list.style.transform = `translateY(${lineY - offset * itemH}px)`;
    activate(Math.min(Math.floor(progress), apps.length - 1));
  };

  window.addEventListener('scroll', updatePosition, { passive: true });
  window.requestAnimationFrame(updatePosition);

  const ro = new ResizeObserver(updatePosition);
  ro.observe(listWrapper);

  // --- Reflow: content-aware, based on the room below the divider ---
  // When the divider/category sits too close to the viewport bottom (little room
  // left for the roller — e.g. a tall header at high zoom), detach the hero
  // header (into block level, in front of the blur) so it scrolls away and the
  // sticky pins from the section title (category) down. Placing the header before
  // the scroll-wrapper means the roller only starts once the sticky engages.
  const MIN_ROLLER_ROOM = 220; // px needed below the divider for the roller
  let reflowVpThreshold = 0; // viewport height below which reflow stays on
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
      // Header is in flow — measure the divider's offset within the content
      // (scroll-independent) and the room that leaves below it when pinned.
      const dividerOffset = divider.getBoundingClientRect().bottom
        - content.getBoundingClientRect().top;
      const roomBelow = vh - dividerOffset;
      if (roomBelow < MIN_ROLLER_ROOM) {
        // Remember the viewport height at which the room would meet the minimum,
        // so we can turn reflow back off once it grows past that.
        reflowVpThreshold = vh + (MIN_ROLLER_ROOM - roomBelow);
        setReflow(true);
      }
    } else if (vh > reflowVpThreshold + 40) {
      // Hysteresis so we don't flip-flop right at the threshold.
      setReflow(false);
    }
  };
  evaluateReflow();
  window.addEventListener('resize', () => {
    evaluateReflow();
    window.requestAnimationFrame(updatePosition);
  }, { passive: true });
}

export default function init(el) {
  decorateViewportContent(el, decorate);
}
