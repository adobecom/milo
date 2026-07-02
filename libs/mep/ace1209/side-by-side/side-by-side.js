import { decorateBlockText, decorateViewportContent, syncPausePlayIcon, USER_PAUSED_ATTR } from '../../../utils/decorate.js';
import { createTag } from '../../../utils/utils.js';

const DEFAULT_TEXT_CONFIG = { heading: '6', body: 'md' };
let videoObserver = null;

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

function decorate(block) {
  const [mediaRow, textRow] = block.children;
  if (!mediaRow || !textRow) return;

  const cardType = getCardType(block);

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
    const card = createTag('div', { class: `card ${variant}` });
    card.append(media, foreground);
    cards.push(card);
  }

  block.replaceChildren(...cards);

  if (block.classList.contains('mobile-horizontal')) {
    const cardContainer = createTag('div');
    cardContainer.append(...cards);
    block.replaceChildren(cardContainer);
  }

  if (!block.classList.contains('dark')) {
    block.querySelector('.card-overlay')?.classList.add('dark');
  }
  replaceVideoIntersectionObserver(medias);
}

export default function init(el) {
  decorateViewportContent(el, decorate);
}
