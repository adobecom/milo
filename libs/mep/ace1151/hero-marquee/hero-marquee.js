import {
  decorateBlockBg,
  decorateBlockHrs,
  decorateBlockText,
  decorateTextOverrides,
  decorateButtons,
  handleObjectFit,
  loadCDT,
} from '../../../utils/decorate.js';
import { createTag, loadStyle, getConfig } from '../../../utils/utils.js';

const contentTypes = ['list', 'qrcode', 'lockup', 'text', 'bgcolor', 'supplemental'];
const rowTypeKeyword = 'con-block-row-';
const breakpointThemeClasses = ['dark-mobile', 'light-mobile', 'dark-tablet', 'light-tablet', 'dark-desktop', 'light-desktop'];
const textDefault = ['xxl', 'm', 'l']; // heading, body, detail

const { miloLibs, codeRoot } = getConfig();
const base = miloLibs || codeRoot;

function distillClasses(el, classes) {
  const taps = ['-heading', '-body', '-detail', '-button'];
  classes?.forEach((elClass) => {
    const elTaps = taps.filter((tap) => elClass.endsWith(tap));
    if (!elTaps.length) return;
    const parts = elClass.split('-');
    el.classList.add(`${parts[1]}-${parts[0]}`);
    el.classList.remove(elClass);
  });
}

function decorateList(el, classes) {
  el.classList.add('body-l');
  const listItems = el.querySelectorAll('li');
  if (listItems.length) {
    const firstDiv = el.querySelector(':scope > div');
    firstDiv.classList.add('foreground');
    [...listItems].forEach((item) => {
      const firstElemIsIcon = item.children[0]?.classList.contains('icon');
      const firstElemIsSvg = item.children[0]?.querySelector('img[src*=".svg"]');
      if (firstElemIsIcon || firstElemIsSvg) item.classList.add('icon-item');
      if (firstElemIsSvg) {
        firstElemIsSvg.parentElement.classList.add('list-icon');
        item.closest('ul, ol').classList.add('has-svg-bullet');
        const listText = createTag('div', { class: 'list-text' });
        [...item.childNodes].forEach((c) => {
          if (c !== item.children[0]) listText.append(c);
        });
        item.append(listText);
      }
      if (!item.parentElement.classList.contains('icon-list')) item.parentElement.classList.add('icon-list');
    });
  }
  distillClasses(el, classes);
}

function decorateQr(el) {
  const text = el.querySelector(':scope > div');
  /* c8 ignore next */
  if (!text) return;
  const classes = ['qr-code-img', 'google-play', 'app-store'];
  [...text.children].forEach((e, i) => {
    e.classList.add(classes[i]);
  });
}

async function loadIconography() {
  await new Promise((resolve) => { loadStyle(`${base}/styles/iconography.css`, resolve); });
}

async function decorateLockupFromContent(el) {
  const rows = el.querySelectorAll(':scope > p');
  const firstRowImg = rows[0]?.querySelector('img');
  if (!firstRowImg) return;
  await loadIconography();
  rows[0].classList.add('lockup-area');
  rows[0].childNodes.forEach((node) => {
    if (node.nodeType === 3 && node.nodeValue?.trim()) {
      const newSpan = createTag('span', { class: 'lockup-label' }, node.nodeValue);
      node.parentElement.replaceChild(newSpan, node);
    }
  });
}

async function decorateLockupRow(el, classes) {
  const child = el.querySelector(':scope > div');
  await loadIconography();
  child?.classList.add('lockup-area');
  const iconSizeClass = classes?.find((c) => c.endsWith('-icon'));
  const lockupSizeClass = classes?.find((c) => c.endsWith('-lockup'));
  const usedLockupClass = iconSizeClass || lockupSizeClass;
  if (usedLockupClass) {
    el.classList.remove(usedLockupClass);
  }
  el.classList.add(`${usedLockupClass?.split('-')[0] || 'l'}-lockup`);
  [...child.children].forEach((node) => {
    if (node.childElementCount || !node.textContent.trim()) return;
    const newSpan = createTag('span', { class: 'lockup-label' }, node.textContent.trim());
    node.parentElement.replaceChild(newSpan, node);
  });
}

function decorateBg(el) {
  const block = el.closest('.hero-marquee');
  block.style.background = el.textContent.trim();
  el.remove();
}

function wrapInnerHTMLInPTag(el) {
  const innerDiv = el.querySelector(':scope > div');
  const containsPTag = [...innerDiv.childNodes].some((node) => node.nodeName === 'P');
  if (!containsPTag) {
    const pTag = createTag('p');
    while (innerDiv.firstChild) pTag.appendChild(innerDiv.firstChild);
    innerDiv.appendChild(pTag);
  }
}

function decorateText(el, classes) {
  el.classList.add('norm');
  wrapInnerHTMLInPTag(el);
  const btnClass = classes?.find((c) => c.endsWith('-button'));
  if (btnClass) {
    const [theme, size] = btnClass.split('-').reverse();
    el.classList.remove(btnClass);
    decorateButtons(el, `${theme}-${size}`);
  } else {
    decorateButtons(el, 'button-xl');
  }
  decorateBlockText(el, textDefault);
  decorateTextOverrides(el, ['-heading', '-body', '-detail']);
}

function decorateSup(el, classes) {
  el.classList.add('norm');
  distillClasses(el, classes);
}

function extendButtonsClass(copy) {
  const buttons = copy.querySelectorAll('.con-button');
  if (buttons.length === 0) return;
  buttons.forEach((button) => {
    button.classList.add('button-xl', 'button-justified-mobile');
  });
}
function parseKeyString(str) {
  const regex = /^(\w+)\s*\((.*)\)$/;
  const match = str.match(regex);
  if (!match) return { key: str };
  const key = match[1];
  const classes = match[2].split(',').map((c) => c.trim());
  const result = { key, classes };
  return result;
}

async function loadContentType(el, key, classes) {
  if (classes !== undefined && classes.length) el.classList.add(...classes);
  switch (key) {
    case 'bgcolor':
      decorateBg(el);
      break;
    case 'lockup':
      await decorateLockupRow(el, classes);
      break;
    case 'qrcode':
      decorateQr(el);
      break;
    case 'list':
      decorateList(el, classes);
      break;
    case 'supplemental':
      decorateSup(el, classes);
      break;
    case 'text':
      decorateText(el, classes);
      break;
    default:
  }
}

function loadBreakpointThemes() {
  loadStyle(`${base}/styles/breakpoint-theme.css`);
}

export function getViewportOrder(viewport, content) {
  const els = [...content.children];
  const viewportObject = { 0: [] };
  els.forEach((el) => {
    const orderClass = {
      tablet: null,
      desktop: null,
    };
    el.classList.forEach((className) => {
      if (!className.startsWith('order-')
        || (!className.endsWith('desktop') && !className.endsWith('tablet'))) return;
      orderClass.tablet = orderClass.tablet || (className.endsWith('tablet') ? className : null);
      orderClass.desktop = orderClass.desktop || (className.endsWith('desktop') ? className : null);
    });
    const viewportClass = orderClass[viewport] || orderClass.tablet;
    const order = parseInt(viewportClass?.split('-')[1], 10);
    if (Number.isInteger(order)) {
      if (!viewportObject[order]) viewportObject[order] = [];
      viewportObject[order].push(el);
    } else {
      viewportObject[0].push(el);
    }
  });

  const viewportOrder = [];
  Object.keys(viewportObject).sort((a, b) => a - b).forEach((key) => {
    viewportOrder.push(...viewportObject[key]);
  });
  return viewportOrder;
}

function handleViewportOrder(content) {
  const hasOrder = content.querySelector(':scope > div[class*="order-"]');
  if (!hasOrder) return;

  const viewports = {
    mobile: {
      media: '(max-width: 599px)',
      elements: [...content.children],
    },
    tablet: {
      media: '(min-width: 600px) and (max-width: 1199px)',
      elements: getViewportOrder('tablet', content),
    },
    desktop: {
      media: '(min-width: 1200px)',
      elements: getViewportOrder('desktop', content),
    },
  };

  Object.entries(viewports).forEach(([viewport, { media, elements }]) => {
    const mediaQuery = window.matchMedia(media);
    if (mediaQuery.matches && viewport !== 'mobile') content.replaceChildren(...elements);
    mediaQuery.addEventListener('change', (e) => {
      if (!e.matches) return;
      content.replaceChildren(...elements);
    });
  });
}

export default async function init(el) {
  el.classList.add('con-block');
  let rows = el.querySelectorAll(':scope > div');
  if (rows.length > 1 && rows[0].textContent !== '') {
    el.classList.add('has-bg');
    const [head, ...tail] = rows;
    handleObjectFit(head);
    decorateBlockBg(el, head, { useHandleFocalpoint: true });
    rows = tail;
  }

  // get first row that's not a keyword key/value row
  const mainRowIndex = rows.findIndex((row) => {
    const firstColText = row.children[0].textContent.toLowerCase().trim();
    return !firstColText.includes(rowTypeKeyword);
  });
  const foreground = rows[mainRowIndex];
  const fRows = foreground.querySelectorAll(':scope > div');
  foreground.classList.add('foreground', `cols-${fRows.length}`);
  let copy = fRows[0];
  const anyTag = foreground.querySelector('p, h1, h2, h3, h4, h5, h6');
  const asset = foreground.querySelector('div > picture, :is(.video-container, .pause-play-wrapper), div > video, div > a[href*=".mp4"], div > a.image-link');
  const allRows = foreground.querySelectorAll('div > div');
  copy = anyTag.closest('div');
  copy.classList.add('copy');

  if (asset) {
    asset.parentElement.classList.add('asset');
    if (el.classList.contains('media-cover')) {
      el.appendChild(createTag('div', { class: 'foreground-media' }, asset));
    }
  } else {
    [...fRows].forEach((row) => {
      if (row.childElementCount === 0) {
        row.classList.add('empty-asset');
      }
    });
  }

  const assetUnknown = (allRows.length === 2
    && allRows[1].classList.length === 0)
    ? allRows[1]
    : null;
  if (assetUnknown) assetUnknown.classList.add('asset-unknown');

  decorateBlockText(copy, textDefault, 'hasDetailHeading');
  await decorateLockupFromContent(copy);
  extendButtonsClass(copy);

  /* c8 ignore next 2 */
  const containsClassFromArray = () => breakpointThemeClasses.some(
    (className) => el.classList.contains(className),
  );
  if (containsClassFromArray) loadBreakpointThemes();

  const assetRow = allRows[0].classList.contains('asset');
  if (assetRow) el.classList.add('asset-left');
  const lockupClass = [...el.classList].find((c) => c.endsWith('-lockup'));
  if (lockupClass) el.classList.remove(lockupClass);
  const buttonClass = [...el.classList].find((c) => c.endsWith('-button'));
  if (buttonClass) el.classList.remove(buttonClass);
  const classes = `main-copy ${lockupClass || 'l-lockup'} ${buttonClass || 'l-button'}`;
  const mainCopy = createTag('div', { class: classes });
  while (copy.childNodes.length > 0) {
    mainCopy.appendChild(copy.childNodes[0]);
  }
  rows.splice(mainRowIndex, 1);
  if (mainRowIndex > 0) {
    for (let i = 0; i < mainRowIndex; i += 1) {
      rows[i].classList.add('prepend');
    }
  }
  copy.append(mainCopy);
  [...rows].forEach((row) => {
    if (row.classList.contains('prepend')) {
      mainCopy.before(row);
    } else {
      copy.append(row);
    }
  });
  const promiseArr = [];
  [...rows].forEach(async (row) => {
    const cols = row.querySelectorAll(':scope > div');
    const firstCol = cols[0];
    const firstColText = firstCol.textContent.toLowerCase().trim();
    const isKeywordRow = firstColText.includes(rowTypeKeyword);
    if (isKeywordRow) {
      const keyValue = firstColText.replace(rowTypeKeyword, '').trim();
      const parsed = parseKeyString(keyValue);
      firstCol.parentElement.classList.add(`row-${parsed.key}`, 'con-block');
      firstCol.remove();
      cols[1].classList.add('row-wrapper');
      if (contentTypes.includes(parsed.key)) {
        promiseArr.push(loadContentType(row, parsed.key, parsed.classes));
      }
    } else {
      row.classList.add('norm');
      decorateBlockHrs(row);
      decorateButtons(row, 'button-xl');
    }
  });
  decorateTextOverrides(el, ['-heading', '-body', '-detail'], mainCopy);
  handleViewportOrder(copy);

  if (el.classList.contains('countdown-timer')) {
    promiseArr.push(loadCDT(copy, el.classList));
  }

  await Promise.all(promiseArr);

  const initFullscreenScroll = (heroElement) => {
    const section = heroElement.closest('.section');
    const nextSection = section?.nextElementSibling;
    if (!section || !nextSection) return;
    heroElement.setAttribute('aria-live', 'polite');

    const getOpacityElements = () => [
      ...heroElement.querySelectorAll('.main-copy h1 + p'),
      ...heroElement.querySelectorAll('.row-supplemental .ex-unity-wrap'),
      ...heroElement.querySelectorAll('.row-supplemental .ex-unity-wrap ~ *'),
    ];

    getOpacityElements().forEach((invisibleEl) => invisibleEl.setAttribute('aria-hidden', 'true'));

    let currentState = 0; // 0: initial, 1: content revealed, 2: section hidden
    let lastScrollY = window.scrollY;
    let scrollingEnabled = false;
    let isReady = false; // Prevent premature triggering
    let contentTransitionComplete = false; // Track opacity transition completion
    let section2Settled = false; // Track if section 2 has been settled/viewed
    let section2SettledTime = 0; // Track when section 2 was settled to prevent momentum
    let section2PreSettled = false; // Track if section 2 was auto-settled (not by user)
    let justRevealed = false; // Prevent immediate slide-up after content reveal
    let wheelStoppedTime = 0; // Track when wheel events stopped (for trackpad momentum)
    let wheelStopTimer = null; // Timer to detect end of wheel gesture

    setTimeout(() => {
      isReady = true;
    }, 300);

    const handleTransitionEnd = (e) => {
      if (e.propertyName === 'opacity' && (e.target.matches('.main-copy h1 + p')
        || e.target.matches('.row-supplemental .ex-unity-wrap') || e.target.matches('.row-supplemental .ex-unity-wrap ~ *')
      )) {
        contentTransitionComplete = true;
        heroElement.removeEventListener('transitionend', handleTransitionEnd);
        // Initialize wheelStoppedTime when transition completes
        wheelStoppedTime = Date.now();
        setTimeout(() => {
          justRevealed = false;
        }, 300);
      }
    };

    const handleUnifiedInteraction = (e) => {
      if (!isReady) {
        return;
      }
      // Prevent scroll events when needed
      if ((e.type === 'wheel' || e.type === 'touchmove') && ((!scrollingEnabled && currentState < 2) || (currentState === 2 && !scrollingEnabled))) {
        e.preventDefault();
        e.stopPropagation();
      }

      // STATE 0: Initial interaction - reveal content
      if (currentState === 0) {
        currentState = 1;
        justRevealed = true;
        heroElement.classList.add('content-revealed');
        getOpacityElements().forEach((invisibleEl) => invisibleEl.setAttribute('aria-hidden', 'false'));
        heroElement.addEventListener('transitionend', handleTransitionEnd);
        // eslint-disable-next-line chai-friendly/no-unused-expressions
        // window.getComputedStyle(heroElement).opacity; // Force layout recalculation
        if (e.type === 'wheel') {
          e.preventDefault();
          e.stopPropagation();
        }
        return;
      }

      if (currentState === 1 && e.type === 'wheel' && !contentTransitionComplete) {
        // Detect when wheel events stop (momentum ends) - important for trackpad
        if (wheelStopTimer) clearTimeout(wheelStopTimer);
        wheelStopTimer = setTimeout(() => {
          wheelStoppedTime = Date.now();
        }, 200); // 200ms of no wheel events = stopped (increased for trackpad)
        return;
      }

      // STATE 1: Content revealed - handle slide-up on wheel down
      if (currentState === 1 && e.type === 'wheel' && e.deltaY > 0 && contentTransitionComplete && !justRevealed) {
        e.preventDefault();
        e.stopPropagation();
        
        // Require 800ms of NO wheel activity before allowing slide-up (handles trackpad momentum)
        // If wheelStoppedTime hasn't been set yet (0), allow first gesture to proceed
        if (wheelStoppedTime > 0) {
          const timeSinceWheelStopped = Date.now() - wheelStoppedTime;
          if (timeSinceWheelStopped < 800) {
            return; // Block if still within momentum window
          }
        }
        
        currentState = 2;
        heroElement.classList.add('section-hidden');
        
        // Block ALL scroll events during transition (capture phase for highest priority)
        let lastBlockTime = Date.now();
        let lastDelta = 0;
        let consecutiveLowVelocity = 0;
        const blockScroll = (evt) => {
          evt.preventDefault();
          evt.stopPropagation();
          evt.stopImmediatePropagation();
          
          // Track velocity to distinguish momentum from new user input
          const currentDelta = Math.abs(evt.deltaY || 0);
          if (currentDelta < 5) {
            consecutiveLowVelocity++;
          } else if (currentDelta > lastDelta * 2) {
            // Large jump in velocity = new user gesture, stop blocking
            consecutiveLowVelocity = 999; // Force unlock
          } else {
            consecutiveLowVelocity = 0;
          }
          
          lastDelta = currentDelta;
          lastBlockTime = Date.now(); // Track when we last saw a wheel event
        };
        document.addEventListener('wheel', blockScroll, { passive: false, capture: true });
        document.addEventListener('touchmove', blockScroll, { passive: false, capture: true });
        
        const { innerWidth } = window;
        const { clientWidth } = document.documentElement;
        const scrollbarWidth = innerWidth - clientWidth;
        document.body.style.overflow = 'hidden';
        document.body.style.paddingRight = `${scrollbarWidth}px`; // Compensate for missing scrollbar
        window.scrollTo(0, 0);
        
        // Check repeatedly if momentum has stopped
        let listenersRemoved = false;
        const checkMomentumStopped = () => {
          const timeSinceLastBlock = Date.now() - lastBlockTime;
          // Unlock if: no events for 300ms OR many consecutive low-velocity events (user trying to scroll)
          if (timeSinceLastBlock < 300 && consecutiveLowVelocity < 10) {
            // Still getting momentum events, check again
            setTimeout(checkMomentumStopped, 100);
          } else {
            // Momentum stopped OR user is intentionally trying to scroll
            if (!listenersRemoved) {
              document.removeEventListener('wheel', blockScroll, { capture: true });
              document.removeEventListener('touchmove', blockScroll, { capture: true });
              listenersRemoved = true;
              console.log('✅ Scroll blocking removed, scrolling enabled');
            }
            
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
            window.scrollTo(0, 0);
            scrollingEnabled = true;
            section2Settled = true;
            section2SettledTime = Date.now();
            section2PreSettled = true;
          }
        };
        
        // Start checking after animation completes (600ms for CSS transition)
        setTimeout(checkMomentumStopped, 600);
        return;
      }

      // STATE 2: Section hidden - handle scroll-back
      if (currentState === 2 && e.type === 'wheel' && e.deltaY < 0) {
        const nextSectionRect = nextSection.getBoundingClientRect();
        const navHeight = document.querySelector('header')?.offsetHeight || 64;
        const timeSinceSettled = Date.now() - section2SettledTime;
        const minWaitTime = section2PreSettled ? 600 : 800;

        if (nextSectionRect.top >= (navHeight - 10)
          && section2Settled && timeSinceSettled > minWaitTime) {
          // Triggering hero return after sufficient delay
          currentState = 1;
          contentTransitionComplete = true;
          section2Settled = false;
          section2SettledTime = 0;
          section2PreSettled = false;
          heroElement.classList.remove('section-hidden');
          getOpacityElements().forEach((invisibleEl) => invisibleEl.setAttribute('aria-hidden', 'false'));
          scrollingEnabled = false;
          window.scrollTo(0, 0);
          e.preventDefault();
          e.stopPropagation();
        } else if (nextSectionRect.top >= (navHeight - 10)
          && section2Settled && timeSinceSettled <= minWaitTime) {
          // Scroll detected but too soon, ignoring momentum
          e.preventDefault();
          e.stopPropagation();
        }
      }
    };

    // Throttled scroll handler for state 2 return detection
    let scrollTimeout;
    const handleScroll = () => {
      if (scrollTimeout) return; // Throttle to max 60fps
      scrollTimeout = setTimeout(() => {
        scrollTimeout = null;
        if (currentState !== 2) return;
        const currentScrollY = window.scrollY;
        const scrollDirection = currentScrollY > lastScrollY ? 'down' : 'up';
        if (scrollDirection === 'up') {
          const nextSectionRect = nextSection.getBoundingClientRect();
          const navHeight = document.querySelector('header')?.offsetHeight || 64;
          const timeSinceSettled = Date.now() - section2SettledTime;
          const minWaitTime = section2PreSettled ? 600 : 800;
          if (nextSectionRect.top >= (navHeight - 5) && !section2Settled) {
            section2Settled = true;
            section2SettledTime = Date.now();
            window.scrollTo(0, 0);
          } else if (nextSectionRect.top >= (navHeight - 5)
            && section2Settled && timeSinceSettled > minWaitTime) {
            currentState = 1;
            contentTransitionComplete = true;
            section2Settled = false;
            section2SettledTime = 0;
            section2PreSettled = false;
            heroElement.classList.remove('section-hidden');
            getOpacityElements().forEach((invisibleEl) => invisibleEl.setAttribute('aria-hidden', 'false'));
            scrollingEnabled = false;
            window.scrollTo(0, 0);
          }
        }

        lastScrollY = currentScrollY;
      }, 16); // ~60fps throttling
    };

    document.addEventListener('wheel', handleUnifiedInteraction, { passive: false });
    document.addEventListener('click', handleUnifiedInteraction, true);
    document.addEventListener('touchstart', handleUnifiedInteraction, { passive: true });
    document.addEventListener('touchmove', handleUnifiedInteraction, { passive: false });
    document.addEventListener('keydown', handleUnifiedInteraction, true);
    window.addEventListener('scroll', handleScroll, { passive: true });
  };

  if (el.classList.contains('fullscreen-scroll')) {
    const isDesktop = window.matchMedia('(min-width: 1200px)').matches;
    if (isDesktop) {
      // Use setTimeout to ensure DOM is fully ready
      setTimeout(() => {
        initFullscreenScroll(el);
      }, 100);
    } else {
      el.classList.remove('fullscreen-scroll');
    }
  }
}
