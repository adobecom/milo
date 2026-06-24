import { decorateBlockText, decorateViewportContent, syncPausePlayIcon, USER_PAUSED_ATTR } from '../../../utils/decorate.js';
import { createTag } from '../../../utils/utils.js';

const SWIPE_THRESHOLD = 20;
const FLY_MS = 300;
const SNAP_MS = 300;
const FADE_IN_MS = 160;
const RIGHT_DRAG_DENOM = 160;

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const DESKTOP_MQ = '(width >= 768px)';
const CHEVRON_SVG = '<svg viewBox="0 0 12 12" aria-hidden="true" focusable="false"><path d="M4 1l5 5-5 5" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const ARROW_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
  <path d="M11.208 5.417L7.50781 1.7168C7.18554 1.39453 6.66406 1.39453 6.34179 1.7168C6.01953 2.03907 6.01953 2.56055 6.34179 2.88282L8.63281 5.17481H1.375C0.918955 5.17481 0.549805 5.54395 0.549805 6.00001C0.549805 6.45607 0.918945 6.82521 1.375 6.82521H8.63281L6.34179 9.1172C6.01953 9.43947 6.01953 9.96095 6.34179 10.2832C6.50292 10.4444 6.71386 10.5254 6.9248 10.5254C7.13574 10.5254 7.34668 10.4444 7.50781 10.2832L11.208 6.58302C11.5303 6.26075 11.5303 5.73927 11.208 5.417Z" fill="currentColor"/></svg>`;
const FOCUSABLE_SELECTOR = 'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])';
let videoObserver = null;
let resizeObserver = null;

function markStandaloneLinks(foreground) {
  foreground.querySelectorAll('a').forEach((a) => {
    const parent = a.parentElement;
    if (!parent) return;
    const parentText = parent.textContent?.trim() ?? '';
    const linkText = a.textContent?.trim() ?? '';
    parent?.classList.replace('body-md', 'link-container');
    if (parentText === linkText) a.classList.add('standalone-link', 'label');
  });
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
        const isActive = video.closest('.media')?.getAttribute('data-slot') === '0';

        if (!isIntersecting) {
          if (isPlaying && (!playedOnce && !isUserPaused)) syncPausePlayIcon(video);
          video.pause();
        } else if (!isUserPaused && (isHaveLoopAttr || !playedOnce) && !isPlaying && isActive) {
          video.play();
          syncPausePlayIcon(video, { type: 'playing' });
        }
      });
    }, { threshold: 0.4 });
    videoObserver.observe(videoEl);
  });
}

function updateAriaLive(ariaLive, items) {
  ariaLive.textContent = '';
  const activeText = items.find((item) => item.getAttribute('aria-hidden') === 'false');
  const index = parseInt(activeText.getAttribute('data-slide-index'), 10);
  let text = '';
  activeText.querySelectorAll(':scope > :not(.section-metadata)').forEach((el, i) => {
    text += `${i ? ' ' : ''}${el.textContent.trim()}`;
  });
  ariaLive.textContent = [`Slide ${index + 1} of ${items.length}`, text].filter(Boolean).join(', ');
}

function decorateItem(item, index) {
  item.classList.add('split-aside-grid-item');
  item.dataset.slideIndex = String(index);
  const [content, media] = item.children;
  if (content) {
    content.classList.add('foreground');
    decorateBlockText(content, { heading: '5', body: 'md', button: 'md' });
    markStandaloneLinks(content);
    const text = content.querySelectorAll('p');
    const container = createTag(
      'div',
      { class: 'content-container' },
      createTag('div', {}, [...text]),
    );
    content.appendChild(container);
  }
  if (media) {
    media.classList.add('media');
    media.dataset.slideIndex = String(index);
  }

  const headingText = content?.querySelector(':is(h1,h2,h3,h4,h5,h6)')?.textContent || `Slide ${index + 1}`;
  const toggle = createTag('button', {
    class: 'split-aside-grid-item-toggle',
    type: 'button',
    'aria-expanded': 'false',
    'aria-label': headingText,
  });
  toggle.innerHTML = CHEVRON_SVG;
  item.prepend(toggle);
  return { content, media, toggle };
}

function setupBlock(el) {
  let stack;
  let medias;
  let items;
  let dotEls;
  let ariaLive;
  let slideNum;
  let isCarousel;
  let itemsWrap;
  let controlsWrap;
  let nextBtn;
  let prevBtn;

  let rotation = 0;
  let flying = false;
  let drag = null;
  let target = null;

  const mod = (n) => ((n % slideNum) + slideNum) % slideNum;
  const slotOf = (idx) => mod(idx - rotation);
  const slideAt = (off) => medias[mod(rotation + off)];

  function setAriaHiddenAndTabIndex() {
    medias.forEach((media, idx) => {
      const isActive = slotOf(idx) === 0;
      media.setAttribute('aria-hidden', isActive ? 'false' : 'true');
      media.querySelectorAll(FOCUSABLE_SELECTOR).forEach((focusable) => {
        focusable.setAttribute('tabindex', isActive ? '0' : '-1');
      });
    });

    items.forEach((item, idx) => {
      const isActive = slotOf(idx) === 0;
      if (!isCarousel) {
        const toHide = item.querySelectorAll('p[class*="body"]');
        toHide.forEach((hide) => {
          hide.setAttribute('aria-hidden', isActive ? 'false' : 'true');
          hide.querySelectorAll(FOCUSABLE_SELECTOR).forEach((focusable) => {
            focusable.setAttribute('tabindex', isActive ? '0' : '-1');
          });
        });
        return;
      }
      item.setAttribute('aria-hidden', isActive ? 'false' : 'true');
      item.querySelectorAll(FOCUSABLE_SELECTOR).forEach((focusable) => {
        focusable.setAttribute('tabindex', isActive ? '0' : '-1');
      });
    });
  }

  function applyRotation(isSetup) {
    medias.forEach((m, idx) => {
      const slot = slotOf(idx);
      m.style.setProperty('--split-aside-grid-stack-index', slot);
      m.style.setProperty('--split-aside-grid-stack-slot', slot);
      m.dataset.slot = String(slot);
      const isActive = slot === 0;
      const video = m.querySelector('video');
      if (!video) return;
      const { playedOnce = false } = video.dataset;
      if (playedOnce) return;
      if (isActive) {
        video.play();
        syncPausePlayIcon(video, { type: 'playing' });
        return;
      }
      video.pause();
      syncPausePlayIcon(video);
    });

    items.forEach((item, idx) => {
      const isActive = slotOf(idx) === 0;
      item.classList.toggle('split-aside-grid-active', isActive);
      const toggle = item.querySelector(':scope > .split-aside-grid-item-toggle');
      if (toggle) toggle.setAttribute('aria-expanded', isActive ? 'true' : 'false');
    });
    dotEls.forEach((dot, idx) => {
      const isActive = slotOf(idx) === 0;
      dot.classList.toggle('is-active', isActive);
      if (isActive) dot.setAttribute('aria-current', 'location');
      else dot.removeAttribute('aria-current');
    });

    setAriaHiddenAndTabIndex();
    if (!isSetup && isCarousel) updateAriaLive(ariaLive, items);
  }

  function updateStack(dir, progress, ignore) {
    medias.forEach((slide) => {
      if (slide === ignore) return;
      const slot = parseInt(slide.getAttribute('data-slot'), 10);
      const indexUpdate = dir === 'right' ? slot + progress : slot - progress;
      slide.style.transition = 'none';
      slide.style.transform = '';
      slide.style.setProperty('--split-aside-grid-stack-index', indexUpdate);
      if (dir === 'left') return;
      slide.style.setProperty('--split-aside-grid-stack-slot', slot + 1);
    });
  }

  function clearInline(m) {
    if (!m) return;
    m.style.transition = '';
    m.style.transform = '';
    m.style.opacity = '';
  }

  function stackWidth() {
    return stack.getBoundingClientRect().width || 374;
  }

  function commitLeft(progress) {
    flying = true;
    const oldFront = slideAt(0);
    const width = stackWidth();

    const preSlots = medias.map((_, idx) => slotOf(idx));

    /* 1. Old front: fly off-screen left — no opacity change. */
    oldFront.style.transition = `transform ${FLY_MS}ms ease-out`;
    oldFront.style.transform = `translateX(${-width}px) rotate(-25deg)`;

    /* 2. Rotate state — new front + new mid transition smoothly into their new slots. */
    rotation += 1;

    applyRotation();
    /* Freeze z-index at pre-rotation values until the fly-off ends. */
    medias.forEach((slide, idx) => {
      slide.style.setProperty('--split-aside-grid-stack-slot', String(preSlots[idx]));
      if (slide === oldFront) return;
      clearInline(slide);
    });
    /* Keep old front at slot 0 size and visible during fly-off. */
    oldFront.style.setProperty('--split-aside-grid-stack-index', '0');
    oldFront.dataset.slot = '0';

    /* 3. After the fly-off ends, settle old front into its real slot,
          update z-indexes, and fade the new back card in at slot 2. */
    setTimeout(() => {
      oldFront.style.transition = 'none';
      oldFront.style.transform = '';
      const oldFrontSlot = slotOf(medias.indexOf(oldFront));
      oldFront.style.setProperty('--split-aside-grid-stack-index', String(oldFrontSlot));
      oldFront.dataset.slot = `${medias.length - 1}`;
      oldFront.style.opacity = '0';
      medias.forEach((m, idx) => {
        m.style.setProperty('--split-aside-grid-stack-slot', String(slotOf(idx)));
        m.classList.remove('show-image');
      });

      setTimeout(() => {
        oldFront.style.transition = `opacity ${FADE_IN_MS}ms ease-out`;
        oldFront.style.opacity = '';
        flying = false;
      }, 10);
    }, FLY_MS * (1 - progress) + 150);
  }

  function animateToRight(progress, incoming) {
    const width = stackWidth();
    const rot = -25 * (1 - progress);
    updateStack('right', progress, incoming);
    const front = slideAt(0);
    incoming.classList.add('show-image', 'incoming');
    front.classList.add('show-image');
    incoming.style.transition = 'none';
    incoming.style.setProperty('--split-aside-grid-stack-index', '0');
    incoming.style.setProperty('--split-aside-grid-stack-slot', '0');
    incoming.style.transform = `translateX(${-width * (1 - progress)}px) rotate(${rot}deg)`;
  }

  function commitRight(progress, isKeyboard) {
    flying = true;
    const incoming = slideAt(-1);

    rotation -= 1;

    applyRotation();

    if (isKeyboard) {
      animateToRight(progress, incoming);
      setTimeout(() => {
        incoming.style.transform = '';
        medias.forEach((slide) => {
          slide.classList.remove('show-image');
          slide.classList.remove('incoming');
          clearInline(slide);
          flying = false;
        });
      });
      return;
    }
    medias.forEach((slide) => {
      slide.style.transition = '';
    });
    incoming.style.transform = '';

    setTimeout(() => {
      medias.forEach((slide) => {
        slide.classList.remove('show-image');
        slide.classList.remove('incoming');
        clearInline(slide);
      });
      flying = false;
    }, FLY_MS * (1 - progress) + 20);
  }

  function snapBack(direction) {
    const incoming = slideAt(-1);
    medias.forEach((m) => {
      if (!m) return;
      m.style.transition = '';
      m.style.transform = '';
      m.classList.remove('show-image', 'incoming');
    });
    if (direction === 'right') incoming.style.display = 'none';
    applyRotation();
    setTimeout(() => {
      medias.forEach((m) => clearInline(m));
      if (direction === 'right') incoming.style.display = 'block';
    }, SNAP_MS + 40);
  }

  function onPointerDown(e) {
    if (!e.target.classList.contains('media')) return;
    target = e.target;
    if (flying) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    /* Prevent the browser's native image/text drag so the swipe owns the gesture
       when the user holds the mouse button (shrunk viewport, no device emulation). */
    if (e.pointerType === 'mouse' && e.cancelable) e.preventDefault();
    drag = { id: e.pointerId, x0: e.clientX, y0: e.clientY, dx: 0, dy: 0 };
    try { stack.setPointerCapture(e.pointerId); } catch (_) { /* noop */ }
  }

  function onPointerMove(e) {
    if (!drag || e.pointerId !== drag.id || !target) return;

    const xDrag = e.clientX - drag.x0;
    const yDrag = e.clientY - drag.y0;
    const isScroll = Math.abs(xDrag) - Math.abs(yDrag) < 5;
    if (isScroll && !drag.animation) return;

    drag.dx = xDrag;
    drag.dy = yDrag;
    drag.animation = true;

    let direction = null;
    if (drag.dx < 0) direction = 'left';
    else if (drag.dx > 0) direction = 'right';
    if (drag.direction && drag.direction !== direction) {
      /* Direction reversed — reset every drag-touched property back to the original slots */
      medias.forEach((m) => { m.style.transform = ''; });
      applyRotation();
    }
    drag.direction = direction;

    if (drag.dx < 0) {
      const front = slideAt(0);
      const next = slideAt(1);
      next.classList.add('show-image');
      const progress = Math.min(-drag.dx / RIGHT_DRAG_DENOM, 1);
      drag.progress = progress;
      const rot = drag.dx * 0.07;
      front.style.transition = 'none';
      front.style.transform = `translateX(${drag.dx}px) rotate(${rot}deg)`;
    } else if (drag.dx > 0) {
      const incoming = slideAt(-1);
      const progress = Math.min(drag.dx / RIGHT_DRAG_DENOM, 1);
      animateToRight(progress, incoming);
      drag.progress = progress;
    }
  }

  function onPointerUp(e) {
    if (!drag || e.pointerId !== drag.id || !target) return;
    const { dx, direction, progress } = drag;
    drag = null;
    target = null;
    try { stack.releasePointerCapture(e.pointerId); } catch (_) { /* noop */ }

    const commit = Math.abs(dx) >= SWIPE_THRESHOLD;

    if (!commit) { snapBack(direction); return; }
    if (reducedMotion()) {
      rotation += dx < 0 ? 1 : -1;
      applyRotation();
      medias.forEach(clearInline);
      return;
    }
    if (dx < 0) commitLeft(progress);
    else commitRight(progress);
  }

  function handleNavigation(e) {
    const { key, type, target: clickTarget } = e;
    if (type === 'click') {
      if (clickTarget.classList.contains('prev')) commitRight(0.25, true);
      else if (clickTarget.classList.contains('next')) commitLeft(0.25);
      return;
    }

    if (key === 'ArrowLeft') {
      commitRight(0.25, true);
      prevBtn?.focus();
    } else if (key === 'ArrowRight') {
      commitLeft(0.25);
      nextBtn?.focus();
    }
  }

  function selectByIndex(idx, item) {
    if (idx < 0 || idx >= slideNum) return;
    if (slotOf(idx) === 0) {
      const expanded = item.classList.toggle('split-aside-grid-active');
      const toggle = item.querySelector(':scope > .split-aside-grid-item-toggle');
      toggle?.setAttribute('aria-expanded', String(expanded));
      return;
    }
    rotation = idx;
    applyRotation();
  }

  function onItemClick(e) {
    /* Let internal links work normally */
    if (e.target.closest('a')) return;
    const item = e.currentTarget;
    const idx = items.indexOf(item);
    selectByIndex(idx, item);
  }

  function swapStackItems(mobile = true) {
    if (mobile) {
      controlsWrap.before(stack);
      controlsWrap.after(itemsWrap);
      return;
    }
    controlsWrap.before(itemsWrap);
    controlsWrap.after(stack);
  }

  const desktopMQ = window.matchMedia(DESKTOP_MQ);
  let mobileBound = false;
  let desktopBound = false;

  function enableMobileNavigation() {
    prevBtn.addEventListener('click', handleNavigation);
    nextBtn.addEventListener('click', handleNavigation);
    el.addEventListener('keydown', handleNavigation);
  }

  function disableMobileNavigation() {
    prevBtn.removeEventListener('click', handleNavigation);
    nextBtn.removeEventListener('click', handleNavigation);
    el.removeEventListener('keydown', handleNavigation);
  }

  function bindMobile() {
    if (mobileBound) return;
    mobileBound = true;
    stack.addEventListener('pointerdown', onPointerDown);
    stack.addEventListener('pointermove', onPointerMove);
    stack.addEventListener('pointerup', onPointerUp);
    stack.addEventListener('pointercancel', onPointerUp);
    enableMobileNavigation();
    swapStackItems();
  }

  function unbindMobile() {
    if (!mobileBound) return;
    mobileBound = false;
    stack.removeEventListener('pointerdown', onPointerDown);
    stack.removeEventListener('pointermove', onPointerMove);
    stack.removeEventListener('pointerup', onPointerUp);
    stack.removeEventListener('pointercancel', onPointerUp);
    disableMobileNavigation();
  }

  function addResizeObserver() {
    resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { scrollWidth } = el;
      const width = document.documentElement.clientWidth;
      stack.style.setProperty('--button-right', `${scrollWidth - width}px`);
    });
    resizeObserver.observe(el);
  }

  function removeResizeObserver() {
    if (!resizeObserver) return;
    resizeObserver.disconnect();
    resizeObserver = null;
  }

  function bindDesktop() {
    if (desktopBound) return;
    desktopBound = true;
    items.forEach((item) => item.addEventListener('click', onItemClick));
    addResizeObserver();
    swapStackItems(false);
  }

  function unbindDesktop() {
    if (!desktopBound) return;
    desktopBound = false;
    items.forEach((item) => item.removeEventListener('click', onItemClick));
    removeResizeObserver();
  }

  function syncBindings() {
    stack = el.querySelector('.split-aside-grid-stack');
    medias = [...el.querySelectorAll('.media')];
    itemsWrap = el.querySelector('.split-aside-grid-items');
    items = [...itemsWrap.children];
    dotEls = [...el.querySelector('.split-aside-grid-dots').children];
    ariaLive = el.querySelector('.aria-live-container');
    slideNum = medias.length;
    controlsWrap = el.querySelector('.split-aside-grid-controls');
    nextBtn = controlsWrap.querySelector('button.next');
    prevBtn = controlsWrap.querySelector('button.prev');

    if (desktopMQ.matches) {
      isCarousel = false;
      unbindMobile();
      bindDesktop();
    } else {
      isCarousel = true;
      unbindDesktop();
      bindMobile();
    }

    applyRotation(true);
  }

  desktopMQ.addEventListener('change', syncBindings);
  syncBindings();
}

function decorate(block) {
  const itemEls = [...block.children];
  const itemsData = itemEls.map((item, i) => decorateItem(item, i));
  const medias = itemsData.map((d) => d.media).filter(Boolean);
  if (!medias.length) return;

  const stack = createTag('div', { class: 'split-aside-grid-stack' });
  medias.forEach((m) => stack.appendChild(m));

  const dots = createTag('ul', { class: 'split-aside-grid-dots', role: 'tablist', 'aria-label': 'Slide indicators' });
  medias.forEach((_, i) => {
    dots.appendChild(createTag(
      'li',
      {
        class: 'split-aside-grid-dot',
        'aria-label': `Slide ${i + 1} of ${medias.length}`,
        ...(i === 0 ? { 'aria-current': 'location' } : {}),
      },
    ));
  });

  const controlsWrapper = createTag(
    'div',
    { class: 'split-aside-grid-controls' },
    [
      createTag('button', { class: 'prev', 'aria-label': 'Previous slide' }, ARROW_SVG),
      dots,
      createTag('button', { class: 'next', 'aria-label': 'Next slide' }, ARROW_SVG),
    ],
  );

  /* Wrap items in a grid container so every item occupies the same cell.
     The cell sizes to the tallest item, so the container's height stays stable
     regardless of which slide is active. */
  const itemsWrap = createTag('div', { class: 'split-aside-grid-items' });
  itemEls.forEach((item) => itemsWrap.appendChild(item));

  const ariaLive = createTag('div', {
    class: 'aria-live-container',
    'aria-live': 'polite',
    'aria-atomic': 'true',
  });
  block.append(itemsWrap, controlsWrapper, stack, ariaLive);
  replaceVideoIntersectionObserver(medias);
}

export default function init(el) {
  decorateViewportContent(el, decorate);
  setupBlock(el);
}
