import { createTag, getConfig, loadStyle } from '../../../utils/utils.js';

const WRAPPER_ID = 'bc-split-wrapper';
const PAGE_LOAD_OK_ID = 'page-load-ok-milo';
const SPLIT_MSG_READY = 'bc-split-page-ready';
const ACTIVE_LEFT_PADDING = 12;
const ACTIVE_RIGHT_PADDING = 0;
const RESIZER_WIDTH = 12;
const ACTIVE_TOTAL_GAPS_WIDTH = ACTIVE_LEFT_PADDING + RESIZER_WIDTH + ACTIVE_RIGHT_PADDING;
const ANIMATION_MS = 450;
const IFRAME_READY_TIMEOUT_MS = 30000;
const MIN_PANE_PERCENT = 20;
const MAX_PANE_PERCENT = 80;
const LEFT_PANE_RATIO = 2;
const RIGHT_PANE_RATIO = 1;
const LEFT_PANE_PERCENT = (LEFT_PANE_RATIO / (LEFT_PANE_RATIO + RIGHT_PANE_RATIO)) * 100;
const RIGHT_PANE_PERCENT = (RIGHT_PANE_RATIO / (LEFT_PANE_RATIO + RIGHT_PANE_RATIO)) * 100;

let styleLoaded = false;
let isDragging = false;
let onCloseCallback = null;
let mouseMoveHandler = null;
let mouseUpHandler = null;
let resizerBound = false;
let preloadScheduled = false;
let messageListenerBound = false;
let cachedPrimaryUrl = null;
let iframeLoadPromise = null;
let iframeReadyResolve = null;
let savedScrollY = 0;

function getInitialPaneWidths(totalGapsWidth = ACTIVE_TOTAL_GAPS_WIDTH) {
  const leftGap = totalGapsWidth * (LEFT_PANE_RATIO / (LEFT_PANE_RATIO + RIGHT_PANE_RATIO));
  const rightGap = totalGapsWidth * (RIGHT_PANE_RATIO / (LEFT_PANE_RATIO + RIGHT_PANE_RATIO));
  return {
    left: `calc(${LEFT_PANE_PERCENT}% - ${leftGap}px)`,
    right: `calc(${RIGHT_PANE_PERCENT}% - ${rightGap}px)`,
  };
}

function setPaneWidthsFromPercentage(
  leftPane,
  rightPane,
  percentage,
  totalGapsWidth = ACTIVE_TOTAL_GAPS_WIDTH,
) {
  const leftGap = totalGapsWidth * (LEFT_PANE_RATIO / (LEFT_PANE_RATIO + RIGHT_PANE_RATIO));
  const rightGap = totalGapsWidth * (RIGHT_PANE_RATIO / (LEFT_PANE_RATIO + RIGHT_PANE_RATIO));
  leftPane.style.width = `calc(${percentage}% - ${leftGap}px)`;
  rightPane.style.width = `calc(${100 - percentage}% - ${rightGap}px)`;
}

function lockBodyScroll() {
  savedScrollY = window.scrollY;
  document.documentElement.classList.add('bc-split-scroll-lock');
  document.body.classList.add('bc-split-scroll-lock');
  document.body.style.top = `-${savedScrollY}px`;
}

function unlockBodyScroll() {
  document.documentElement.classList.remove('bc-split-scroll-lock');
  document.body.classList.remove('bc-split-scroll-lock');
  document.body.style.top = '';
  window.scrollTo(0, savedScrollY);
}

export function isInSplitIframeContext() {
  if (window !== window.top) return true;
  return new URL(document.location).searchParams.get('bc-split-iframe') === '1';
}

export function isSplitActive() {
  return !!document.getElementById(WRAPPER_ID)?.classList.contains('bc-split-active');
}

export function isIframeMiloReady() {
  const iframe = document.getElementById('bc-split-primary-iframe');
  return iframe?.dataset.bcSplitLoaded === 'true';
}

function loadSplitStyles() {
  if (styleLoaded) return;
  const { miloLibs, codeRoot } = getConfig();
  loadStyle(`${miloLibs || codeRoot}/c2/blocks/brand-concierge/split-window.css`);
  styleLoaded = true;
}

export function buildSplitIframeUrl(primaryUrl) {
  const url = new URL(primaryUrl, window.location.href);
  url.searchParams.set('bc-split-iframe', '1');
  return url.toString();
}

function getElements() {
  const wrapper = document.getElementById(WRAPPER_ID);
  if (!wrapper) return null;
  return {
    wrapper,
    leftPane: wrapper.querySelector('#bc-split-left-pane'),
    rightPane: wrapper.querySelector('#bc-split-right-pane'),
    resizer: wrapper.querySelector('#bc-split-resizer'),
    rightContent: wrapper.querySelector('#bc-split-right-content'),
    closeBtn: wrapper.querySelector('.bc-split-close'),
    primaryIframe: wrapper.querySelector('#bc-split-primary-iframe'),
  };
}

function bindResizer(wrapper, leftPane, rightPane, resizer) {
  if (resizerBound) return;
  resizerBound = true;

  resizer.addEventListener('mousedown', (e) => {
    e.preventDefault();
    isDragging = true;
    wrapper.classList.add('is-dragging');
  });

  mouseMoveHandler = (e) => {
    if (!isDragging) return;

    const leftWidthPx = e.clientX - ACTIVE_LEFT_PADDING;
    const totalWidthPx = window.innerWidth - ACTIVE_TOTAL_GAPS_WIDTH;
    let percentage = (leftWidthPx / totalWidthPx) * 100;

    if (percentage < MIN_PANE_PERCENT) percentage = MIN_PANE_PERCENT;
    if (percentage > MAX_PANE_PERCENT) percentage = MAX_PANE_PERCENT;

    setPaneWidthsFromPercentage(leftPane, rightPane, percentage);
  };

  mouseUpHandler = () => {
    if (!isDragging) return;
    isDragging = false;
    wrapper.classList.remove('is-dragging');
  };

  document.addEventListener('mousemove', mouseMoveHandler);
  document.addEventListener('mouseup', mouseUpHandler);
}

function waitForParentPageLoadOk() {
  if (document.getElementById(PAGE_LOAD_OK_ID)) return Promise.resolve();

  return new Promise((resolve) => {
    const observer = new MutationObserver(() => {
      if (document.getElementById(PAGE_LOAD_OK_ID)) {
        observer.disconnect();
        resolve();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  });
}

function markIframeMiloReady(iframe) {
  if (!iframe || iframe.dataset.bcSplitLoaded === 'true') return;
  iframe.dataset.bcSplitLoaded = 'true';
  if (iframeReadyResolve) {
    iframeReadyResolve();
    iframeReadyResolve = null;
  }
}

function checkIframePageLoadOk(iframe) {
  try {
    return !!iframe?.contentDocument?.getElementById(PAGE_LOAD_OK_ID);
  } catch (e) {
    return false;
  }
}

function bindIframeReadyListener() {
  if (messageListenerBound) return;
  messageListenerBound = true;

  window.addEventListener('message', (event) => {
    if (event.origin !== window.location.origin) return;
    if (event.data?.type !== SPLIT_MSG_READY) return;

    const els = getElements();
    if (!els?.primaryIframe) return;
    if (event.source !== els.primaryIframe.contentWindow) return;

    markIframeMiloReady(els.primaryIframe);
  });
}

function waitForIframeMiloReady(iframe) {
  if (!iframe) return Promise.resolve();
  if (iframe.dataset.bcSplitLoaded === 'true') return Promise.resolve();

  bindIframeReadyListener();

  if (checkIframePageLoadOk(iframe)) {
    markIframeMiloReady(iframe);
    return Promise.resolve();
  }

  if (!iframeLoadPromise) {
    iframeLoadPromise = new Promise((resolve) => {
      iframeReadyResolve = resolve;
      setTimeout(() => markIframeMiloReady(iframe), IFRAME_READY_TIMEOUT_MS);
    });
  }

  return iframeLoadPromise;
}

function collapseSplit() {
  const els = getElements();
  if (!els) return;

  els.wrapper.classList.add('bc-split-preloading');
  els.wrapper.classList.remove('bc-split-active');
  els.rightContent.innerHTML = '';
  els.leftPane.style.transition = 'none';
  els.rightPane.style.transition = 'none';
  els.leftPane.style.width = '100%';
  els.rightPane.style.width = '0%';
  els.resizer.style.display = 'none';
  isDragging = false;
  els.wrapper.classList.remove('is-dragging');

  if (typeof onCloseCallback === 'function') {
    onCloseCallback();
    onCloseCallback = null;
  }

  unlockBodyScroll();
}

function handleClose() {
  collapseSplit();
}

export function showSplitLoader(rootEl) {
  if (!rootEl || rootEl.querySelector('.bc-split-loader')) return;
  const loader = createTag('div', {
    class: 'bc-split-loader',
    role: 'status',
    'aria-live': 'polite',
    'aria-label': 'Loading page preview',
  });
  rootEl.classList.add('bc-split-loading');
  rootEl.append(loader);
}

export function hideSplitLoader(rootEl) {
  rootEl?.querySelector('.bc-split-loader')?.remove();
  rootEl?.classList.remove('bc-split-loading');
}

export function ensureSplitShell({ primaryUrl = window.location.href } = {}) {
  if (isInSplitIframeContext()) return null;

  cachedPrimaryUrl = primaryUrl;
  const existing = document.getElementById(WRAPPER_ID);
  if (existing) return getElements();

  loadSplitStyles();
  bindIframeReadyListener();

  const wrapper = createTag('div', { id: WRAPPER_ID, class: 'bc-split-preloading' });
  const leftPane = createTag('div', { id: 'bc-split-left-pane', class: 'bc-split-pane-container' });
  const primaryIframe = createTag('iframe', {
    id: 'bc-split-primary-iframe',
    class: 'bc-split-iframe',
    title: 'Page preview',
  });
  const resizer = createTag('div', { id: 'bc-split-resizer', role: 'separator', 'aria-orientation': 'vertical', 'aria-label': 'Resize panels' });
  const rightPane = createTag('div', { id: 'bc-split-right-pane', class: 'bc-split-pane-container' });
  const header = createTag('div', { class: 'bc-split-pane-header bc-split-pane-header-close-only' });
  const closeBtn = createTag('button', {
    class: 'bc-split-close',
    type: 'button',
    'aria-label': 'Close split view',
  }, '×');
  const rightContent = createTag('div', { id: 'bc-split-right-content' });

  header.append(closeBtn);
  rightPane.append(header, rightContent);
  leftPane.append(primaryIframe);
  wrapper.append(leftPane, resizer, rightPane);
  document.body.append(wrapper);

  closeBtn.addEventListener('click', handleClose);
  bindResizer(wrapper, leftPane, rightPane, resizer);

  return getElements();
}

export function startIframePreload(primaryUrl = cachedPrimaryUrl) {
  if (isInSplitIframeContext()) return;

  const els = ensureSplitShell({ primaryUrl });
  if (!els?.primaryIframe) return;

  const { primaryIframe: iframe } = els;
  if (iframe.dataset.bcSplitPreloadStarted === 'true') return;

  iframe.dataset.bcSplitPreloadStarted = 'true';
  iframe.src = buildSplitIframeUrl(primaryUrl || window.location.href);

  iframe.addEventListener('load', () => {
    if (checkIframePageLoadOk(iframe)) {
      markIframeMiloReady(iframe);
    }
  }, { once: true });
}

export function schedulePreloadWhenPageReady({ primaryUrl = window.location.href } = {}) {
  if (isInSplitIframeContext() || preloadScheduled) return;
  preloadScheduled = true;

  waitForParentPageLoadOk().then(() => {
    ensureSplitShell({ primaryUrl });
    startIframePreload(primaryUrl);
  });
}

function prepareHiddenLayout(els, instant = false) {
  const { left, right } = getInitialPaneWidths();

  els.wrapper.classList.add('bc-split-preloading');
  els.wrapper.classList.remove('bc-split-active');

  if (instant) {
    els.leftPane.style.transition = 'none';
    els.rightPane.style.transition = 'none';
  } else {
    els.leftPane.style.transition = `width ${ANIMATION_MS}ms cubic-bezier(0.25, 1, 0.5, 1)`;
    els.rightPane.style.transition = `width ${ANIMATION_MS}ms cubic-bezier(0.25, 1, 0.5, 1)`;
  }

  els.leftPane.style.width = left;
  els.rightPane.style.width = right;
  els.resizer.style.display = 'block';
}

function revealSplit(els) {
  els.wrapper.classList.remove('bc-split-preloading');
  els.wrapper.classList.add('bc-split-active');
  els.leftPane.style.transition = 'none';
  els.rightPane.style.transition = 'none';
  lockBodyScroll();
}

export async function activateSplit({ renderRightPanel, onClose, loaderEl } = {}) {
  const els = getElements() || ensureSplitShell();
  if (!els) return false;

  onCloseCallback = onClose || null;
  startIframePreload();

  const iframeReady = els.primaryIframe?.dataset.bcSplitLoaded === 'true';
  const showLoader = !iframeReady && loaderEl;

  if (showLoader) showSplitLoader(loaderEl);

  try {
    prepareHiddenLayout(els, iframeReady);

    const panelRender = typeof renderRightPanel === 'function'
      ? renderRightPanel(els.rightContent)
      : Promise.resolve();

    const layoutReady = iframeReady
      ? Promise.resolve()
      : new Promise((resolve) => { setTimeout(resolve, ANIMATION_MS); });

    await Promise.all([
      waitForIframeMiloReady(els.primaryIframe),
      layoutReady,
      panelRender,
    ]);

    revealSplit(els);
  } finally {
    if (showLoader) hideSplitLoader(loaderEl);
  }

  return true;
}

export function destroySplit() {
  collapseSplit();
}
