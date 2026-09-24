import { createTag, getFederatedUrl } from '../../../utils/utils.js';
import icons from '../../../c2/assets/icons.js';
import { decorateButtons } from '../../../utils/decorate.js';

const mobileQuery = window.matchMedia('(max-width: 767px)');

function createFloatingCtaAnimation(pill) {
<<<<<<< HEAD
  const actions = pill.querySelector('.floating-cta-actions');
  let scheduled = 0;

  function measure() {
    if (mobileQuery.matches || !actions) return;
    const fullWidth = pill.oddsetWidth;
    if (fullWidth) pill.style.setProperty('--cta-full-width', `${fullWidth}px`);
    const actionOffset = pill.clientWidth / 2
      - (actions.offsetLeft + actions.offsetWidth / 2);
    pill.style.setProperty('--cta-action-offset', `${actionOffset}px`);
  }

  function scheduleMeasure() {
    if (scheduled) return;
    scheduled = requestAnimationFrame(() => {
      scheduled = 0;
=======
  const intro = pill.querySelector('.floating-cta-intro');
  const background = pill.querySelector('.floating-cta-background');
  const actions = pill.querySelector('.floating-cta-actions');
  const content = pill.querySelector('.floating-cta-lockup');
  let frame = 0;
  let fullWidth = 0;
  let actionCenterOffset = 0;
  const motion = {
    ctaY: spring(180, 100, 13),
    introW: spring(38, 100, 13),
    introH: spring(96, 100, 13),
    introScale: spring(1.3, 160, 24),
    bgW: spring(52),
    bgH: spring(48),
    bgScale: spring(1.3, 160, 24),
    bgAlpha: spring(0),
    actionX: spring(0, 110, 20),
    content: spring(0),
  };

  function measure() {
    pill.style.setProperty('--cta-ty', '0px');
    actions.style.transform = '';
    content.style.transform = '';
    const pillRect = pill.getBoundingClientRect();
    const actionRect = actions.getBoundingClientRect();
    if (pillRect.width) fullWidth = pillRect.width;
    actionCenterOffset = pillRect.left + pillRect.width / 2
      - (actionRect.left + actionRect.width / 2);
  }

  function paintDesktop() {
    pill.style.setProperty('--cta-ty', `${motion.ctaY.value}px`);
    intro.style.width = `${motion.introW.value}px`;
    intro.style.height = `${motion.introH.value}px`;
    intro.style.transform = `translate(${-motion.introW.value / 2}px, -50%)`
      + ` scale(${motion.introScale.value})`;
    background.style.width = `${motion.bgW.value}px`;
    background.style.height = `${motion.bgH.value}px`;
    background.style.transform = `translate(-50%, -50%) scale(${motion.bgScale.value})`;
    background.style.setProperty('--spring-alpha', `${motion.bgAlpha.value}`);
    actions.style.transform = `translateX(${motion.actionX.value}px)`;
    content.style.setProperty('--lockup-in', `${motion.content.value}`);
  }

  function setInitialDesktop() {
    cancelAnimationFrame(frame);
    pill.classList.remove('is-active');
    measure();
    setSpring(motion.ctaY, 180);
    setSpring(motion.introW, 38);
    setSpring(motion.introH, 96);
    setSpring(motion.introScale, 1.3);
    setSpring(motion.bgW, 52);
    setSpring(motion.bgH, 48);
    setSpring(motion.bgScale, 1.3);
    setSpring(motion.bgAlpha, 0);
    setSpring(motion.actionX, actionCenterOffset);
    setSpring(motion.content, 0);
    pill.classList.remove('is-action-in');
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
    setSpring(motion.content, 1);
    pill.classList.add('is-action-in');
    paintDesktop();
  }

  function springIn() {
    setInitialDesktop();
    measure();
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
      if (elapsed >= 0.05) motion.introW.target = 72;
      if (elapsed >= 0.15) motion.introH.target = 72;
      if (elapsed >= 0.20) pill.classList.add('is-action-in');
      if (elapsed >= 0.30) motion.bgScale.target = 1;
      if (elapsed >= 0.40) {
        motion.bgW.target = fullWidth;
        motion.actionX.target = 0;
      }
      if (elapsed >= 0.43) {
        motion.bgAlpha.target = 1;
        intro.style.opacity = '0';
      }
      if (elapsed >= 0.50) motion.content.target = 1;
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
      motion.content.value = 1 - contentProgress;
      motion.actionX.value = lerp(0, actionCenterOffset, actionProgress);
      if (actionProgress > 0) pill.classList.remove('is-action-in');
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

  function resetForViewport() {
    if (mobileQuery.matches) {
      cancelAnimationFrame(frame);
      return;
    }
    if (pill.classList.contains('active')) {
>>>>>>> 8cfa53693 (Addressed issues with cta not loading and pr comments)
      measure();
    });
  }

<<<<<<< HEAD
  const controller = new AbortController();
  const { signal } = controller;
  mobileQuery.addEventListener('change', scheduleMeasure, { signal });
  window.addEventListener('resize', scheduleMeasure, { passive: true, signal });
  measure();
  return {
    animateIn: measure,
    animateOut: () => {},
    destroy() {
      cancelAnimationFrame(scheduled);
      controller.abort();
=======
  mobileQuery.addEventListener('change', resetForViewport);
  if (!mobileQuery.matches) setInitialDesktop();
  return {
    animateIn() {
      if (!mobileQuery.matches) springIn();
    },
    animateOut() {
      if (!mobileQuery.matches) springOut();
>>>>>>> 8cfa53693 (Addressed issues with cta not loading and pr comments)
    },
  };
}

function decorateAnimatedCta(cta, img, text, trailing) {
  const intro = createTag('span', { class: 'floating-cta-intro', 'aria-hidden': 'true' });
  const background = createTag('span', {
    class: 'floating-cta-background',
    'aria-hidden': 'true',
  });
  const label = createTag('span', { class: 'floating-cta-label' });
  label.textContent = text;
  const lockup = createTag('span', { class: 'floating-cta-lockup' }, [...(img ? [img] : []), label]);
  const actions = createTag('span', { class: 'floating-cta-actions' }, trailing);
  const content = createTag('span', { class: 'floating-cta-content' }, [lockup, actions]);
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

function applyCustomHide(el, ctaEl, animation) {
  const marqueeSelector = [
    '.hub-hero',
    '.offer-hero',
    '.plans-hero',
    '.product-marquee-grid',
    '.router-marquee',
  ].join(', ');
  const exitSelector = [
    '.global-footer',
    'merch-card',
  ].join(', ');
  const getBoundary = (element) => element?.closest('.section') || element;
  const ctaBoundary = getBoundary(el);
  let visible = false;
  let hiddenEdge = 'start';
  let scheduledFrame = 0;

  function getMarqueeBoundary() {
    const allCandidates = [...document.querySelectorAll(marqueeSelector)]
      .filter((candidate) => !candidate.closest('.floating-cta'));
<<<<<<< HEAD
<<<<<<< HEAD
    const precedingCandidates = allCandidates.filter((candidate) => (
      // eslint-disable-next-line no-bitwise
      candidate.compareDocumentPosition(ctaBoundary) & Node.DOCUMENT_POSITION_FOLLOWING
    ));
=======
    const precedingCandidates = allCandidates.filter((candidate) =>
      // eslint-disable-next-line no-bitwise
      candidate.compareDocumentPosition(ctaBoundary) & Node.DOCUMENT_POSITION_FOLLOWING);
>>>>>>> ead98c970 (Fixed minor issues)
=======
    const precedingCandidates = allCandidates.filter((candidate) => (
      // eslint-disable-next-line no-bitwise
      candidate.compareDocumentPosition(ctaBoundary) & Node.DOCUMENT_POSITION_FOLLOWING
    ));
>>>>>>> 8cfa53693 (Addressed issues with cta not loading and pr comments)
    const marquee = precedingCandidates[precedingCandidates.length - 1] || allCandidates[0];
    if (marquee) return getBoundary(marquee);
    let sibling = ctaBoundary?.previousElementSibling;
    while (sibling) {
      if (sibling.matches('.section')) return sibling;
      sibling = sibling.previousElementSibling;
    }
    return null;
  }

  function getExitBoundary(marqueeBoundary) {
    const exit = [...document.querySelectorAll(exitSelector)].find((candidate) => {
      const boundary = getBoundary(candidate);
      // eslint-disable-next-line no-bitwise
      const followsMarquee = marqueeBoundary.compareDocumentPosition(boundary)
        & Node.DOCUMENT_POSITION_FOLLOWING;
      return !candidate.closest('.floating-cta')
        && boundary !== marqueeBoundary
        && followsMarquee;
    });
    return getBoundary(exit);
  }

  function show() {
    visible = true;
    ctaEl.classList.add('active');
    ctaEl.removeAttribute('tabindex');
    ctaEl.removeAttribute('aria-hidden');
    animation.animateIn();
  }

  function hide(edge) {
    visible = false;
    hiddenEdge = edge;
    ctaEl.classList.remove('active');
    ctaEl.setAttribute('tabindex', '-1');
    ctaEl.setAttribute('aria-hidden', 'true');
    animation.animateOut();
  }

  function evaluateScroll() {
    scheduledFrame = 0;
    const marqueeBoundary = getMarqueeBoundary();
    if (!marqueeBoundary) {
      const scrolledIn = window.scrollY > window.innerHeight * 0.25;
      if (scrolledIn && !visible) show();
      else if (!scrolledIn && visible) hide('start');
      return;
    }
    const exitBoundary = getExitBoundary(marqueeBoundary);
    const marqueeBottom = marqueeBoundary.getBoundingClientRect().bottom;
    const exitTop = exitBoundary?.getBoundingClientRect().top ?? Infinity;
    const revealAt = window.innerHeight * 0.25;
    const tuckAt = revealAt + 180;
    const exitAt = window.innerHeight - ctaEl.offsetHeight
      - (mobileQuery.matches ? 0 : 22) + 36;

    if (visible) {
      if (exitTop <= exitAt) hide('end');
      else if (marqueeBottom >= tuckAt) hide('start');
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
    const clearedExit = hiddenEdge !== 'end' || exitTop >= exitAt + 120;
    if (marqueeBottom <= revealAt && clearedExit) show();
  }

  function scheduleEvaluation() {
    if (scheduledFrame) return;
    scheduledFrame = requestAnimationFrame(evaluateScroll);
  }

  const controller = new AbortController();
  const { signal } = controller;
  window.addEventListener('scroll', scheduleEvaluation, { passive: true, signal });
  window.addEventListener('resize', scheduleEvaluation, { signal });
  window.addEventListener('load', scheduleEvaluation, { signal });
  new MutationObserver((_, observer) => {
    if (document.contains(ctaEl)) return;
    cancelAnimationFrame(scheduledFrame);
    controller.abort();
    animation.destroy?.();
    observer.disconnect();
  }).observe(document.body, { childList: true, subtree: true });
  evaluateScroll();
}

export default async function init(el) {
  const contentDiv = el.querySelector('div > div');
  if (!contentDiv) return;

  decorateButtons(contentDiv);
  const img = contentDiv.querySelector('img, svg');
  const links = [...contentDiv.querySelectorAll('a')];
  const isButtonLink = (a) => a.classList.contains('con-button')
    || a.parentElement?.classList.contains('con-button');
<<<<<<< HEAD
  const actionLink = !img ? (links.find(isButtonLink) ?? links[links.length - 1] ?? null) : null;
  const linkEl = links.find((a) => a !== actionLink) ?? null;
  let actionEl = null;
  if (actionLink) {
    if (actionLink.classList.contains('con-button')) actionEl = actionLink;
    else if (actionLink.parentElement?.classList.contains('con-button')) actionEl = actionLink.parentElement;
    else {
      actionEl = actionLink;
      actionEl.classList.add('con-button', 'blue');
    }
=======
  const actionLink = !img ? (links.find(isButtonLink) ?? null) : null;
  const linkEl = links.find((a) => a !== actionLink) ?? null;
  let actionEl = null;
  if (actionLink) {
    actionEl = actionLink.classList.contains('con-button')
      ? actionLink : actionLink.parentElement;
>>>>>>> 8cfa53693 (Addressed issues with cta not loading and pr comments)
  }
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
      applyCustomHide(el, checkoutLink, animation);
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
  applyCustomHide(el, cta, animation);
}
