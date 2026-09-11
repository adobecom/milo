import { createTag, getFederatedUrl } from '../../../utils/utils.js';
import icons from '../../assets/icons.js';

const mobileQuery = window.matchMedia('(max-width: 767px)');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const clamp01 = (value) => Math.max(0, Math.min(1, value));
const lerp = (from, to, progress) => from + (to - from) * progress;
const easeInOutCubic = (value) => (
  value < 0.5 ? 4 * value * value * value : 1 - ((-2 * value + 2) ** 3) / 2
);

const spring = (value, stiffness = 100, damping = 20) => ({ value, target: value, velocity: 0, stiffness, damping, });

function setSpring(item, value) {
  item.value = value;
  item.target = value;
  item.velocity = 0;
}

function stepSpring(item, dt) {
  const acceleration = -item.stiffness * (item.value - item.target)
    - item.damping * item.velocity;
  item.velocity += acceleration * dt;
  item.value += item.velocity * dt;
  if (Math.abs(item.velocity) < 0.001 && Math.abs(item.target - item.value) < 0.001) {
    item.value = item.target;
    item.velocity = 0;
  }
}

function createFloatingCtaAnimation(pill) {
  const intro = pill.querySelector('.floating-cta__intro');
  const background = pill.querySelector('.floating-cta__background');
  const actions = pill.querySelector('.floating-cta__actions');
  const content = pill.querySelector('.floating-cta__lockup');
  let frame = 0;
  let fullWidth = 0;
  let actionCenterOffset = 0;

  const motion = {
    ctaY: spring(180, 100, 13),
    introX: spring(-19, 100, 13),
    introW: spring(38, 100, 13),
    introH: spring(96, 100, 13),
    introScale: spring(1.3, 160, 24),
    bgW: spring(52, 100, 20),
    bgH: spring(48, 100, 20),
    bgScale: spring(1.3, 160, 24),
    bgAlpha: spring(0, 100, 20),
    actionX: spring(0, 110, 20),
    actionScale: spring(0, 100, 20),
    contentScale: spring(0.5, 100, 20),
    contentAlpha: spring(0, 100, 20),
  };

  function measure() {
    pill.style.setProperty('--cta-ty', '0px');
    actions.style.transform = '';
    content.style.transform = '';
    const pillRect = pill.getBoundingClientRect();
    const actionRect = actions.getBoundingClientRect();
    fullWidth = pillRect.width;
    actionCenterOffset = pillRect.left + pillRect.width / 2
      - (actionRect.left + actionRect.width / 2);
  }

  function paintDesktop() {
    pill.style.setProperty('--cta-ty', `${motion.ctaY.value}px`);
    intro.style.width = `${motion.introW.value}px`;
    intro.style.height = `${motion.introH.value}px`;
    intro.style.transform = `translate(${motion.introX.value}px, -50%)`
      + ` scale(${motion.introScale.value})`;
    background.style.width = `${motion.bgW.value}px`;
    background.style.height = `${motion.bgH.value}px`;
    background.style.transform = `translate(-50%, -50%) scale(${motion.bgScale.value})`;
    background.style.setProperty('--spring-alpha', `${motion.bgAlpha.value}`);
    actions.style.transform = `translateX(${motion.actionX.value}px)`
      + ` scale(${motion.actionScale.value})`;
    content.style.opacity = `${motion.contentAlpha.value}`;
    content.style.transform = `scale(${motion.contentScale.value})`;
  }

  function setInitialDesktop() {
    cancelAnimationFrame(frame);
    pill.classList.remove('is-active');
    measure();
    setSpring(motion.ctaY, 180);
    setSpring(motion.introX, -19);
    setSpring(motion.introW, 38);
    setSpring(motion.introH, 96);
    setSpring(motion.introScale, 1.3);
    setSpring(motion.bgW, 52);
    setSpring(motion.bgH, 48);
    setSpring(motion.bgScale, 1.3);
    setSpring(motion.bgAlpha, 0);
    setSpring(motion.actionX, actionCenterOffset);
    setSpring(motion.actionScale, 0);
    setSpring(motion.contentScale, 0.5);
    setSpring(motion.contentAlpha, 0);
    intro.style.opacity = '0';
    paintDesktop();
  }

  function finishDesktop() {
    pill.classList.add('is-active');
    intro.style.opacity = '0';
    setSpring(motion.ctaY, 0);
    setSpring(motion.bgW, fullWidth);
    setSpring(motion.bgH, 72);
    setSpring(motion.bgScale, 1);
    setSpring(motion.bgAlpha, 1);
    setSpring(motion.actionX, 0);
    setSpring(motion.actionScale, 1);
    setSpring(motion.contentScale, 1);
    setSpring(motion.contentAlpha, 1);
    paintDesktop();
  }

  function springIn() {
    setInitialDesktop();
    pill.classList.add('is-active');
    intro.style.opacity = '1';
    if (reducedMotion.matches) {
      finishDesktop();
      return;
    }

    let elapsed = 0;
    let lastTime = performance.now();
    const tick = (now) => {
      const dt = Math.min((now - lastTime) / 1000, 0.032);
      lastTime = now;
      elapsed += dt;
      if (elapsed >= 0.02) motion.introScale.target = 0.8;
      if (elapsed >= 0.03) motion.ctaY.target = 0;
      if (elapsed >= 0.05) {
        motion.introX.target = -36;
        motion.introW.target = 72;
      }
      if (elapsed >= 0.15) motion.introH.target = 72;
      if (elapsed >= 0.20) motion.actionScale.target = 1;
      if (elapsed >= 0.30) motion.bgScale.target = 1;
      if (elapsed >= 0.40) {
        motion.bgW.target = fullWidth;
        motion.actionX.target = 0;
      }
      if (elapsed >= 0.43) {
        motion.bgAlpha.target = 1;
        intro.style.opacity = '0';
      }
      if (elapsed >= 0.50) {
        motion.contentScale.target = 1;
        motion.contentAlpha.target = 1;
      }
      if (elapsed >= 0.60) motion.bgH.target = 72;
      Object.values(motion).forEach((item) => stepSpring(item, dt));
      paintDesktop();
      if (elapsed < 2.2) frame = requestAnimationFrame(tick);
      else finishDesktop();
    };
    frame = requestAnimationFrame(tick);
  }

  function springOut() {
    cancelAnimationFrame(frame);
    finishDesktop();
    if (reducedMotion.matches) {
      setInitialDesktop();
      return;
    }

    const start = performance.now();
    const tick = (now) => {
      const progress = clamp01((now - start) / 620);
      const contentProgress = easeInOutCubic(clamp01((progress - 0.24) / 0.40));
      const actionProgress = easeInOutCubic(clamp01((progress - 0.06) / 0.46));
      const collapseProgress = easeInOutCubic(clamp01((progress - 0.08) / 0.62));
      const dropProgress = easeInOutCubic(clamp01((progress - 0.46) / 0.54));
      motion.contentAlpha.value = 1 - contentProgress;
      motion.contentScale.value = lerp(1, 0.5, contentProgress);
      motion.actionX.value = lerp(0, actionCenterOffset, actionProgress);
      motion.actionScale.value = 1 - actionProgress;
      motion.bgW.value = lerp(fullWidth, 52, collapseProgress);
      motion.bgH.value = lerp(72, 48, collapseProgress);
      motion.bgScale.value = lerp(1, 1.3, collapseProgress);
      motion.ctaY.value = lerp(0, 180, dropProgress);
      paintDesktop();
      if (progress < 1) frame = requestAnimationFrame(tick);
      else setInitialDesktop();
    };
    frame = requestAnimationFrame(tick);
  }

  function resetMobileContent() {
    cancelAnimationFrame(frame);
    pill.classList.add('is-active');
    actions.style.transform = '';
    content.style.opacity = '';
    content.style.transform = '';
  }

  function parkMobile() {
    resetMobileContent();
    pill.style.setProperty('--cta-ty', '160px');
    pill.classList.remove('is-active');
  }

  function slideMobile(to, duration, onDone) {
    resetMobileContent();
    if (reducedMotion.matches) {
      pill.style.setProperty('--cta-ty', `${to}px`);
      if (onDone) onDone();
      return;
    }
    const from = parseFloat(getComputedStyle(pill).getPropertyValue('--cta-ty')) || 0;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = to === 0 ? 1 - ((1 - progress) ** 3) : progress ** 3;
      pill.style.setProperty('--cta-ty', `${from + (to - from) * eased}px`);
      if (progress < 1) frame = requestAnimationFrame(tick);
      else if (onDone) onDone();
    };
    frame = requestAnimationFrame(tick);
  }

  function animateIn() {
    if (mobileQuery.matches) slideMobile(0, 420);
    else springIn();
  }

  function animateOut() {
    if (mobileQuery.matches) slideMobile(160, 360, parkMobile);
    else springOut();
  }

  function resetForViewport() {
    const isActive = pill.classList.contains('active');
    if (mobileQuery.matches) {
      resetMobileContent();
      pill.style.setProperty('--cta-ty', isActive ? '0px' : '160px');
      pill.classList.toggle('is-active', isActive);
    } else if (isActive) {
      measure();
      finishDesktop();
    } else {
      setInitialDesktop();
    }
  }

  mobileQuery.addEventListener('change', resetForViewport);
  if (mobileQuery.matches) parkMobile();
  else setInitialDesktop();
  return { animateIn, animateOut };
}

function decorateAnimatedCta(cta, img, text, trailing) {
  const intro = createTag('span', { class: 'floating-cta__intro', 'aria-hidden': 'true' });
  const background = createTag('span', {
    class: 'floating-cta__background',
    'aria-hidden': 'true',
  });
  const label = createTag('span', { class: 'floating-cta__label' });
  label.textContent = text;
  const lockup = createTag('span', { class: 'floating-cta__lockup' }, [...(img ? [img] : []), label]);
  const actions = createTag('span', { class: 'floating-cta__actions' }, trailing);
  const content = createTag('span', { class: 'floating-cta__content' }, [lockup, actions]);
  cta.replaceChildren(intro, background, content);
  return createFloatingCtaAnimation(cta);
}

function waitForCheckoutLink(linkPara, timeoutMs = 10000) {
  const existing = linkPara.querySelector('a');
  if (existing?.isCheckoutLink) return Promise.resolve(existing);

  return new Promise((resolve, reject) => {
    let timeoutId;
    const observer = new MutationObserver(() => {
      const link = linkPara.querySelector('a');
      if (link?.isCheckoutLink) {
        clearTimeout(timeoutId);
        observer.disconnect();
        resolve(link);
      }
    });
    observer.observe(linkPara, { childList: true, subtree: true });
    timeoutId = setTimeout(() => {
      observer.disconnect();
      reject(new Error('Timed out waiting for checkout link to upgrade'));
    }, timeoutMs);
  });
}

const MARQUEE_SELECTOR = [
  '.marquee',
  '.hero-marquee',
  '.product-marquee-grid',
  '.quiz-marquee',
  '.router-marquee',
  '.caas-marquee',
  '.hub-hero',
  '.offer-hero',
  '.plans-hero',
].join(', ');

const EXIT_SELECTOR = [
  '.merch',
  '.merch-card',
  'merch-card',
  '.merch-offers',
  '.merch-card-collection',
  '[class*="-merch-card"]',
  'footer',
  '.global-footer',
].join(', ');

function getBoundary(element) {
  return element?.closest('.section') || element;
}

function findPreviousSection(element) {
  let sibling = element?.previousElementSibling;
  while (sibling) {
    if (sibling.matches('.section')) return sibling;
    sibling = sibling.previousElementSibling;
  }
  return null;
}

function findVisibilityBoundaries(ctaEl) {
  const ctaBoundary = getBoundary(ctaEl);
  const marqueeCandidates = [...document.querySelectorAll(MARQUEE_SELECTOR)]
    .filter((candidate) => {
      if (candidate.closest('.floating-cta')) return false;
      // eslint-disable-next-line no-bitwise
      return candidate.compareDocumentPosition(ctaBoundary) & Node.DOCUMENT_POSITION_FOLLOWING;
    });
  const marquee = marqueeCandidates[marqueeCandidates.length - 1];
  const marqueeBoundary = getBoundary(marquee) || findPreviousSection(ctaBoundary);
  if (!marqueeBoundary) return {};

  const exit = [...document.querySelectorAll(EXIT_SELECTOR)].find((candidate) => {
    const candidateBoundary = getBoundary(candidate);
    // eslint-disable-next-line no-bitwise
    const followsCta = ctaBoundary.compareDocumentPosition(candidate)
      & Node.DOCUMENT_POSITION_FOLLOWING;
    return !candidate.closest('.floating-cta')
      && candidateBoundary !== ctaBoundary
      && followsCta;
  });
  return { marqueeBoundary, exitBoundary: getBoundary(exit) };
}

function showCta(ctaEl, animation) {
  ctaEl.classList.add('active');
  ctaEl.removeAttribute('tabindex');
  ctaEl.removeAttribute('aria-hidden');
  animation.animateIn();
}

function hideCta(ctaEl, animation) {
  ctaEl.classList.remove('active');
  ctaEl.setAttribute('tabindex', '-1');
  ctaEl.setAttribute('aria-hidden', 'true');
  animation.animateOut();
}

function applyPageVisibility(ctaEl, animation) {
  let visible = false;
  let hiddenEdge = 'start';
  let scheduledFrame = 0;

  function evaluateScroll() {
    scheduledFrame = 0;
    const { marqueeBoundary, exitBoundary } = findVisibilityBoundaries(ctaEl);
    if (!marqueeBoundary) {
      if (!visible) {
        visible = true;
        hiddenEdge = null;
        showCta(ctaEl, animation);
      }
      return;
    }

    const marqueeBottom = marqueeBoundary.getBoundingClientRect().bottom;
    const exitTop = exitBoundary?.getBoundingClientRect().top ?? Infinity;
    const revealAt = window.innerHeight * 0.25;
    const tuckAt = revealAt + 180;
    const bottomGap = mobileQuery.matches ? 0 : 22;
    const exitAt = window.innerHeight - ctaEl.offsetHeight - bottomGap + 36;
    const exitHysteresis = 120;

    if (visible) {
      if (exitTop <= exitAt) {
        visible = false;
        hiddenEdge = 'end';
        hideCta(ctaEl, animation);
      } else if (marqueeBottom >= tuckAt) {
        visible = false;
        hiddenEdge = 'start';
        hideCta(ctaEl, animation);
      }
      return;
    }

    if (marqueeBottom >= tuckAt) {
      hiddenEdge = 'start';
      return;
    }
    if (exitTop <= exitAt) {
      hiddenEdge = 'end';
      return;
    }

    const clearedExitHysteresis = hiddenEdge !== 'end'
      || exitTop >= exitAt + exitHysteresis;
    if (marqueeBottom <= revealAt && clearedExitHysteresis) {
      visible = true;
      hiddenEdge = null;
      showCta(ctaEl, animation);
    }
  }

  function scheduleEvaluation() {
    if (scheduledFrame) return;
    scheduledFrame = requestAnimationFrame(evaluateScroll);
  }

  window.addEventListener('scroll', scheduleEvaluation, { passive: true });
  window.addEventListener('resize', scheduleEvaluation);
  window.addEventListener('load', scheduleEvaluation);
  evaluateScroll();
}

export default async function init(el) {
  const contentDiv = el.querySelector('div > div');
  if (!contentDiv) return;

  const img = contentDiv.querySelector('img, svg');
  const links = [...contentDiv.querySelectorAll('a')];
  const isButtonLink = (a) => a.classList.contains('con-button') || a.parentElement?.classList.contains('con-button');
  const actionLink = !img ? (links.find(isButtonLink) ?? null) : null;
  const linkEl = links.find((a) => a !== actionLink) ?? null;
  const actionConBtn = actionLink.classList.contains('con-buton') ? actionLink : actionLink.parentElement;
  const actionEl = actionLink ? actionConBtn : null;
  let labelText;
  if (actionEl) {
    const labelSource = contentDiv.cloneNode(true);
    labelSource.querySelectorAll('a').forEach((a) => a.remove());
    labelText = labelSource.textContent.trim();
  } else {
    labelText = (linkEl ?? contentDiv).textContent.trim();
  }

  if (!labelText && !actionLink) return;
  if (img?.tagName === 'IMG') {
    const relativeSrc = img.getAttribute('src');
    if (relativeSrc?.startsWith('/')) {
      img.src = getFederatedUrl(relativeSrc);
    }
  }

  if (actionLink?.isCheckoutLink || actionLink?.classList.contains('merch')) {
    try {
      await actionLink.onceSettled();
    } catch (e) {
      window.lana?.log?.(
        `floating-cta: checkout button failed to settle: ${e?.message || e}`,
        { tags: 'floating-cta', severity: 'error' },
      );
    }
  }

  const trailing = actionEl ?? createTag('span', { class: 'icon-button', 'aria-hidden': 'true' }, icons.arrowRightWhite);
  const isMerchLink = !actionEl && (linkEl?.classList.contains('merch') || linkEl?.isCheckoutLink);
  if (isMerchLink) {
    try {
      const linkPara = linkEl.closest('p') ?? contentDiv;
      const checkoutLink = await waitForCheckoutLink(linkPara);
      await checkoutLink.onceSettled();
      const checkoutText = checkoutLink.textContent.trim();
      checkoutLink.classList.add('promo-cta');
      checkoutLink.classList.remove('con-button');
      checkoutLink.setAttribute('tabindex', '-1');
      checkoutLink.setAttribute('aria-hidden', 'true');
      el.replaceChildren(checkoutLink);
      const animation = decorateAnimatedCta(checkoutLink, img, checkoutText, trailing);
      applyPageVisibility(checkoutLink, animation);
    } catch (e) {
      window.lana?.log?.(
        `floating-cta: merch link failed: ${e?.message || e}`,
        { tags: 'floating-cta', severity: 'error' },
      );
      el.remove();
    }
    return;
  }

  const [ctaText, ariaLabel = ctaText] = labelText.split('|').map((s) => s.trim());
  const ctaHref = linkEl?.getAttribute('href') || '#';

  const cta = actionLink ? createTag('span', { class: 'promo-cta' }) : createTag('a', { href: ctaHref, class: 'promo-cta', 'aria-label': ariaLabel, tabindex: '-1' });
  el.replaceChildren(cta);
  const animation = decorateAnimatedCta(cta, img, ctaText, trailing);
  applyPageVisibility(cta, animation);
}
