import { createTag, getFederatedUrl } from '../../../utils/utils.js';
import { decorateBlockText, decorateViewportContent, decorateBlockBg } from '../../../utils/decorate.js';

function hasContent(node) {
  return node.textContent?.trim() !== '' || node.querySelector('img, picture, svg, a[href]');
}

function getForegroundContent(foregroundRow, contentDiv, blockName) {
  if (foregroundRow) {
    if (hasContent(foregroundRow)) {
      [...foregroundRow.children].forEach((child) => child.classList.add(`${blockName}-foreground`));
      contentDiv?.append(...foregroundRow.childNodes);
    }
    foregroundRow.remove();
  }
}

function decorate(block, root) {
  const blockName = root.classList[0].toLowerCase();
  const rows = block.querySelectorAll(':scope > div');
  const firstRow = rows[0];
  const foregroundRow = rows[1];

  if (!firstRow) return;

  const contentDiv = firstRow.querySelector(':scope > div:first-child');
  const backgroundDiv = firstRow.querySelector(':scope > div:last-child');
  const isSvgUrl = (url) => /\.svg(\?.*)?$/i.test(url || '');
  const prodIcon = contentDiv?.querySelector('img');
  const isVideoHref = (href) => /\.(mp4|webm|ogg|mov|m4v)(\?[^#]*)?(#.*)?$/i.test(href);
  const link = [...(contentDiv?.querySelectorAll('a[href]:not([data-video-poster])') ?? [])]
    .find((a) => !isVideoHref(a.href)) ?? null;
  const heading = contentDiv?.querySelector(':is(h1, h2, h3, h4, h5, h6)');
  const contentAux = createTag('div', { class: 'content-aux' });

  if (prodIcon && isSvgUrl(prodIcon.src)) {
    prodIcon.src = getFederatedUrl(prodIcon.src);
    prodIcon.closest('p').classList.add('icon');
  }

  backgroundDiv?.classList.add(`${blockName}-background`);
  contentDiv?.classList.add(`${blockName}-content`);
  firstRow.classList.add(`${blockName}-container`);

  decorateBlockBg(block, backgroundDiv, { useHandleFocalpoint: true });

  if (block !== root && block.style.background) {
    const colorBg = createTag('div', {
      class: `${blockName}-background`,
      style: `background: ${block.style.background}`,
    });
    block.style.removeProperty('background');
    firstRow.append(colorBg);
  }

  getForegroundContent(foregroundRow, contentDiv, blockName);
  decorateBlockText(contentDiv, { heading: '5' });
  contentDiv?.append(contentAux);

  if (!link) return;
  const linkContainer = createTag('a', { class: `${blockName}-link-container`, href: link.href, 'data-tracking-label': heading?.textContent });
  link.remove();
  linkContainer.append(contentDiv);
  firstRow.prepend(linkContainer);
}

function handleBentoStack(el) {
  const section = el.closest('.section');
  // Check raw section-metadata text before JS processes it, so we can register
  // the load listener without waiting for section-metadata's init to finish.
  const metadata = section?.querySelector('.section-metadata');
  if (!metadata?.textContent.toLowerCase().includes('stack-mobile')) return;

  const setup = () => {
    if (section.hasAttribute('data-stack-initialized')) return;
    section.setAttribute('data-stack-initialized', '');

    const richContent = [...section.children].find((child) => (
      !child.classList.contains('section-background')
      && !child.classList.contains('section-metadata')
      && !child.querySelector('.explore-card')
    ));

    if (richContent) {
      richContent.classList.add('bento-stack-header');
    }

    const cards = [...section.querySelectorAll('.explore-card')];
    cards.forEach((card, i) => {
      const wrapper = card.parentElement === section ? card : card.parentElement;
      wrapper.style.setProperty('--stack-index', i + 1);
      wrapper.style.setProperty('--stack-total', cards.length);
      if (i === 0) wrapper.setAttribute('data-stack-first', '');
    });

    // Equalize wrapper heights so all cards hit the section bottom constraint at 
    // the same scroll position, producing a synchronized exit. Only active on
    // mobile where the stacking layout applies; resets on resize to desktop.
    const mq = window.matchMedia('(width < 768px)');
    const wrappers = cards.map((c) => (c.parentElement === section ? c : c.parentElement));
    const equalizeHeights = () => {
      // Clear first so getBoundingClientRect returns natural card heights, not minHeight values.
      wrappers.forEach((w) => { w.style.minHeight = ''; });
      if (!mq.matches) return;
      const maxHeight = Math.max(...cards.map((c) => c.getBoundingClientRect().height));
      if (maxHeight <= 0) return;
      wrappers.forEach((w) => { w.style.minHeight = `${maxHeight}px`; });
    };
    window.addEventListener('resize', equalizeHeights);
    requestAnimationFrame(() => requestAnimationFrame(equalizeHeights));
  };

  if (document.readyState === 'complete') {
    setup();
  } else {
    window.addEventListener('load', setup, { once: true });
  }
}

export default function init(el) {
  decorateViewportContent(el, decorate);
  handleBentoStack(el);
}
