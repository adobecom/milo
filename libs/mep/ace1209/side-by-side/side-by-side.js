import { decorateBlockText, decorateViewportContent, syncPausePlayIcon, USER_PAUSED_ATTR } from '../../../utils/decorate.js';
import { createTag, getFederatedUrl } from '../../../utils/utils.js';

const DEFAULT_TEXT_CONFIG = { heading: '6', body: 'md' };
let videoObserver = null;

function isSvgUrl(url) { return /\.svg(\?.*)?$/i.test(url || ''); }

function decorateCardText(foreground) {
  decorateBlockText(foreground, DEFAULT_TEXT_CONFIG);
  const headingP = foreground.querySelector('p:has(strong)');
  if (!headingP) return;
  headingP.classList.replace(`body-${DEFAULT_TEXT_CONFIG.body}`, `title-${DEFAULT_TEXT_CONFIG.heading}`);
}

function replaceVideoIntersectionObserver(medias) {
  medias.forEach((media) => {
    const videoEl = media.querySelector('video');
    if (!videoEl) return;
    const oldObserver = window?.videoIntersectionObs;
    if (oldObserver) oldObserver.unobserve(videoEl);

    if (videoObserver) {
      videoObserver.observe(videoEl);
      return;
    }

    videoObserver = new window.IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const { isIntersecting, target: video } = entry;
        const isHaveLoopAttr = video.getAttributeNames().includes('loop');
        const { playedOnce = false } = video.dataset;
        const isUserPaused = video.hasAttribute(USER_PAUSED_ATTR);
        const isPlaying = video.currentTime > 0 && !video.paused && !video.ended
          && video.readyState > video.HAVE_CURRENT_DATA;

        if (!isIntersecting) {
          if (isPlaying && (!playedOnce && !isUserPaused)) syncPausePlayIcon(video);
          video.pause();
        } else if (!isUserPaused && (isHaveLoopAttr || !playedOnce) && !isPlaying) {
          video.play();
          syncPausePlayIcon(video, { type: 'playing' });
        }
      });
    }, { threshold: 0.4 });
    videoObserver.observe(videoEl);
  });
}

function getCardType(block) {
  const CARD_TYPE = ['card-overlay', 'card-stacked'];
  if (block.classList.contains('reverse')) return CARD_TYPE.reverse();
  if (block.classList.contains('equal')) return [CARD_TYPE[1], CARD_TYPE[1]];
  if (block.classList.contains('featured')) return [CARD_TYPE[0]];

  return CARD_TYPE;
}

function decorateCardStackedIcon(mediaContainer) {
  const medias = mediaContainer.querySelectorAll('img, video');
  if (medias.length <= 1) return;
  const icon = medias[0];
  const iconContainer = icon.closest('p');
  iconContainer.classList.add('icon');
  if (isSvgUrl(icon.src)) icon.src = getFederatedUrl(icon.src);
  const imgVideoContainer = medias[1].closest('p');
  mediaContainer.append(...imgVideoContainer.children);
  imgVideoContainer.remove();
}

function decorate(block, el) {
  const [mediaRow, textRow] = block.children;
  if (!mediaRow || !textRow) return;

  const cardType = getCardType(el);

  const medias = [...mediaRow.children];
  const texts = [...textRow.children];

  const cards = [];
  for (let i = 0; i < medias.length; i += 1) {
    const media = medias[i];
    const foreground = texts[i];
    media.classList.add('media');
    foreground.classList.add('foreground');
    decorateCardText(foreground);

    const variant = cardType[i];
    if (variant === 'card-stacked') decorateCardStackedIcon(media);
    const card = createTag('div', { class: `card ${variant}` });
    if (variant === 'card-overlay') card.append(createTag('div', { class: 'content-aux' }));
    card.append(media, foreground);
    cards.push(card);
  }

  block.replaceChildren(...cards);

  if (!block.classList.contains('dark')) {
    block.querySelector('.card-overlay')?.classList.add('dark');
  }
  replaceVideoIntersectionObserver(medias);
}

const CARD_INDEX = { first: 0, second: 1 };
const CARD_CUSTOMIZATION_REGEX = /^(first|second)-card-(.+)$/;

function applyCardCustomization(container, classes) {
  classes.forEach((cls) => {
    const [, position, token] = cls.match(CARD_CUSTOMIZATION_REGEX) || [];
    const card = container.children[CARD_INDEX[position]];
    if (!token || !card) return;
    card.classList.add(token);
  });
}

function applyThemeCustomization({ container, customization, variants, blockDark }) {
  const hasThemeCustomization = customization.includes('dark') || customization.includes('light');
  if (!hasThemeCustomization) return;

  const isBlockDark = blockDark || variants?.includes('dark');
  container.classList.remove('dark');
  if (variants?.includes('dark')) variants?.splice(variants.indexOf('dark'), 1);
  [...container.children].forEach((card) => {
    if (isBlockDark) card.classList.add('dark');
    if (card.classList.contains('light')) card.classList.remove('dark');
    card.classList.remove('light');
  });
}

function decorateCardCustomization(el, viewports) {
  const allVariants = viewports?.allVariants || [];
  const blockClasses = [...el.classList].filter((cls) => !allVariants.includes(cls));
  const customization = [...blockClasses, ...allVariants]
    .map((cls) => (cls.match(CARD_CUSTOMIZATION_REGEX)?.[2] || null))
    .filter(Boolean);

  if (!customization.length) return;

  const blockDark = blockClasses.includes('dark');
  if (!viewports?.hasViewportVariations) {
    applyCardCustomization(el, blockClasses);
    applyThemeCustomization({ container: el, customization, blockDark });
    return;
  }

  Object.values(viewports.content).forEach(({ container, variants }) => {
    const containerEl = container.children.length
      ? container
      : el;
    applyCardCustomization(containerEl, [...blockClasses, ...variants]);
    applyThemeCustomization({ container: containerEl, customization, variants, blockDark });
  });
}

export default function init(el) {
  const viewports = decorateViewportContent(el, decorate);
  decorateCardCustomization(el, viewports);
}
