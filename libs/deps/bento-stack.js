const MOBILE = '(max-width: 767px)';

export function getCards(section) {
  return [...section.querySelectorAll(':scope > .explore-card')];
}

// Natural-height element per card: the content box is not slot-height-locked
// so reading its offsetHeight is transform-agnostic and loop-free to observe.
function naturalEl(card) {
  return card.querySelector('.explore-card-content') || card;
}

export function maxCardHeight(cards) {
  return cards.reduce((max, card) => Math.max(max, naturalEl(card).offsetHeight), 0);
}

function setIndices(section, cards) {
  section.style.setProperty('--slides', cards.length);
  cards.forEach((card, i) => card.style.setProperty('--card-idx', i));
}

function measure(section, cards) {
  // Clear the imposed height first so offsetHeight reads each card's NATURAL height.
  // Without this, the slot-locked content would report the previously-set --card-height,
  // so the value could only grow and never shrink on widen/reflow. The offsetHeight read
  // below forces a synchronous reflow, so the natural value is current.
  section.style.removeProperty('--card-height');
  const max = maxCardHeight(cards);
  if (max) section.style.setProperty('--card-height', `${Math.round(max)}px`);

  const title = section.querySelector(':scope > .rich-content');
  if (title) section.style.setProperty('--title-height', `${Math.round(title.offsetHeight)}px`);

  const gnav = document.querySelector('header.global-navigation nav');
  const bottom = gnav?.getBoundingClientRect().bottom;
  if (bottom > 0) section.style.setProperty('--gnav-offset', `${Math.round(bottom)}px`);
}

function clearMeasurements(section) {
  section.style.removeProperty('--card-height');
  section.style.removeProperty('--title-height');
  section.style.removeProperty('--gnav-offset');
}

export default function initBentoStack(section) {
  const cards = getCards(section);
  if (!cards.length) return;
  setIndices(section, cards);
  // Gate the stacking CSS on JS readiness: if this module fails to load/run,
  // the class is never added and the bento degrades to its normal static layout
  section.classList.add('bento-stack-ready');

  const mq = window.matchMedia(MOBILE);
  let frame = 0;
  let measuring = false;
  const update = () => {
    // (clearing/setting --card-height resizes the observed content).
    if (measuring) return;
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      measuring = true;
      if (mq.matches) measure(section, cards);
      else clearMeasurements(section);
      requestAnimationFrame(() => { measuring = false; });
    });
  };

  update();

  const ro = new ResizeObserver(update);
  cards.forEach((card) => ro.observe(naturalEl(card)));
  const title = section.querySelector(':scope > .rich-content');
  if (title) ro.observe(title);
  mq.addEventListener('change', update);
}
