import { handleFocalpoint } from '../../../utils/decorate.js';
import { createTag } from '../../../utils/utils.js';

const mediaQueries = {
  mobile: window.matchMedia('(max-width: 767px)'),
  tablet: window.matchMedia('(min-width: 768px) and (max-width: 1023px)'),
};

export function handleBackground(div, section) {
  const items = div.background.content.map((el, i) => {
    const pic = el.querySelector('picture');
    const video = el.querySelector('.video-container');
    const text = div.background.text[i]?.trim();
    if (video) return { type: 'video', value: video, el };
    if (pic) return { type: 'image', value: pic, el };
    if (text) return { type: 'color', value: text };
    return null;
  }).filter(Boolean);

  if (items.length === 0) return;

  section.classList.add('has-background');

  const binaryVP = [['mobile-only'], ['tablet-only', 'desktop-only']];
  const allVP = [['mobile-only'], ['tablet-only'], ['desktop-only']];
  const viewports = items.length === 2 ? binaryVP : allVP;

  const bgContainer = createTag('div', { class: 'section-background' });

  items.forEach((item, i) => {
    if (item.type === 'video') {
      if (items.length > 1 && i < viewports.length) {
        item.value.classList.add(...viewports[i]);
      }
      bgContainer.append(item.value);
    } else if (item.type === 'image') {
      if (items.length > 1 && i < viewports.length) {
        item.value.classList.add(...viewports[i]);
      }
      handleFocalpoint(item.value, item.el);
      bgContainer.append(item.value);
    } else if (item.type === 'color') {
      const colorDiv = createTag('div');
      if (items.length > 1 && i < viewports.length) {
        colorDiv.classList.add(...viewports[i]);
      }
      colorDiv.style.background = item.value;
      bgContainer.append(colorDiv);
    }
  });

  section.insertAdjacentElement('afterbegin', bgContainer);
}

export async function handleStyle(text, section) {
  if (!text || !section) return;

  const styleSets = text.filter(Boolean).map((styleText) => (
    styleText.split(', ').map((style) => style.replaceAll(' ', '-'))
  ));

  if (styleSets.length === 0) return;

  // Single style set - apply statically (backward compatibility)
  if (styleSets.length === 1) {
    const styles = styleSets[0];
    section.classList.add(...styles);
    return;
  }

  // Multiple style sets - apply based on viewport
  const applyStyles = () => {
    let activeIndex = 0;

    if (styleSets.length === 2) {
      // Binary: mobile | tablet+desktop
      activeIndex = mediaQueries.mobile.matches ? 0 : 1;
    } else if (styleSets.length >= 3) {
      // Full: mobile | tablet | desktop
      if (mediaQueries.mobile.matches) {
        activeIndex = 0;
      } else if (mediaQueries.tablet.matches) {
        activeIndex = 1;
      } else {
        activeIndex = 2;
      }
    }

    // Remove all style classes from all sets
    styleSets.forEach((styleSet) => {
      section.classList.remove(...styleSet);
    });

    // Apply active style set
    const activeStyles = styleSets[activeIndex];
    section.classList.add(...activeStyles);
  };

  // Apply initial styles
  applyStyles();

  // Add listeners for viewport changes
  Object.keys(mediaQueries).forEach((key) => {
    mediaQueries[key].addEventListener('change', applyStyles);
  });
}

function handleMasonry(text, section) {
  const spanSets = text.filter(Boolean).map((entry) => {
    const spans = [];
    entry.split('\n').forEach((line) => spans.push(...line.trim().split(',')));
    return spans.map((s) => s.trim() || 'span 4');
  });

  if (spanSets.length === 0) return;

  section.classList.add('masonry-layout');
  if (spanSets.length > 1) section.classList.add('masonry-responsive');
  const divs = [...section.querySelectorAll(":scope > div:not([class*='metadata'])")];

  const applySpans = (spans) => {
    divs.forEach((div, i) => {
      const gridClasses = [...div.classList].filter((cls) => cls.startsWith('grid-'));
      if (gridClasses.length) div.classList.remove(...gridClasses);
      const spanWidth = spans[i] || 'span 4';
      div.classList.add(`grid-${spanWidth.replace(' ', '-')}`);
    });
  };

  // Single set — apply statically
  if (spanSets.length === 1) {
    applySpans(spanSets[0]);
    return;
  }

  // Multiple sets — apply based on viewport
  const applyForViewport = () => {
    let activeIndex = 0;

    if (spanSets.length === 2) {
      activeIndex = mediaQueries.mobile.matches ? 0 : 1;
    } else if (spanSets.length >= 3) {
      if (mediaQueries.mobile.matches) {
        activeIndex = 0;
      } else if (mediaQueries.tablet.matches) {
        activeIndex = 1;
      } else {
        activeIndex = 2;
      }
    }

    applySpans(spanSets[activeIndex]);
  };

  applyForViewport();

  Object.keys(mediaQueries).forEach((key) => {
    mediaQueries[key].addEventListener('change', applyForViewport);
  });
}

function handleAnchor(anchor, section) {
  if (!anchor || !section) return;
  section.id = anchor.toLowerCase().trim().replaceAll(/\s+/g, '-');
  section.classList.add('section-anchor');
}

export const getMetadata = (el) => [...el.childNodes].reduce((rdx, row) => {
  if (row.children) {
    const key = row.children[0].textContent.trim().toLowerCase();
    const content = [...row.children].slice(1);
    const text = content.map((bp) => bp.textContent?.trim().toLowerCase());
    if (key && content) rdx[key] = { content, text };
  }
  return rdx;
}, {});

export default async function init(el) {
  const section = el.closest('.section');
  const metadata = getMetadata(el);
  if (metadata.style) await handleStyle(metadata.style.text, section);
  if (metadata.background) handleBackground(metadata, section);
  if (metadata.masonry) handleMasonry(metadata.masonry.text, section);
  if (metadata.anchor) handleAnchor(metadata.anchor.text[0], section);
}
