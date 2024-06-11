import { createTag, getMetadata, MILO_EVENTS } from '../../utils/utils.js';
import { getModal, closeModal } from '../modal/modal.js';
import { iphoneFrame, ipadFrame } from './mobileFrames.js';

const OPTION = {
  CHANGED: 'changed',
  NO_CLICK: 'no-click',
};

const CLASS = {
  CHANGED: 'gb-changed',
  GRAYBOX_BODY: 'gb-graybox-body',
  NO_BORDER: 'gb-no-border',
  NO_CHANGE: 'gb-no-change',
  NO_CLICK: 'gb-no-click',
  PAGE_OVERLAY: 'gb-page-overlay',
  PHONE_PREVIEW: 'gb-phone-preview',
  TABLET_PREVIEW: 'gb-tablet-preview',
};

const METADATA = {
  DESC: 'gb-desc',
  FOOTER: 'gb-footer',
  GNAV: 'gb-gnav',
  TITLE: 'gb-title',
};

const USER_AGENT = {
  iPhone: 'Mozilla/5.0 (iPhone13,2; U; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) Version/10.0 Mobile/15E148 Safari/602.1',
  iPad: 'Mozilla/5.0 (iPad; CPU OS 13_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1',
};

let deviceModal;

const setMetadata = (metadata) => {
  const { selector, val } = metadata;
  if (!selector || !val) return;
  const propName = selector.startsWith('og:') ? 'property' : 'name';
  let metaEl = document.querySelector(`meta[${propName}="${selector}"]`);
  if (!metaEl) {
    metaEl = document.createElement('meta');
    metaEl.setAttribute(propName, selector);
    document.head.append(metaEl);
  }
  metaEl.setAttribute('content', val);
};

const isMobileDevice = () => /Android|webOS|iPhone|iPad|iPod/i.test(navigator.userAgent);

const getTableValues = (el) => [...el.childNodes].reduce((rdx, row) => {
  if (!row.children) return rdx;

  const key = row.children[0]?.textContent?.trim().toLowerCase();
  const content = row.children[1];
  let text = content?.textContent.trim();
  /* c8 ignore next 3 */
  if (key !== 'title' && key !== 'desc' && text) {
    text = text.toLowerCase();
  }
  if (key && content) {
    rdx.keys.push(key);
    rdx[key] = { content, text };
  }
  return rdx;
}, { keys: [] });

/* c8 ignore start */
const getOptions = (text, metadata) => {
  const options = text || getMetadata(metadata);
  return options?.toLowerCase().split(',').map((opt) => opt.trim());
};

const decorateFooter = (footer, options) => {
  const footerOptions = getOptions(options.footer?.text, METADATA.FOOTER);
  if (footerOptions?.includes(OPTION.CHANGED)) {
    footer.classList.add(CLASS.CHANGED);
  } else {
    footer.classList.add(CLASS.NO_CHANGE);
  }
  if (footerOptions?.includes(OPTION.NO_CLICK) || footerOptions?.includes(CLASS.NO_CLICK)) {
    footer.classList.add(CLASS.NO_CLICK);
  }
};

const footerMutationObserver = (footerEl, callback, options) => {
  const footerObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.target.classList.contains('global-footer')) {
        footerObserver.disconnect();
        decorateFooter(footerEl, options);
      }
    });
  });

  footerObserver.observe(footerEl, { attributes: true });
};

const checkFooter = (options) => {
  const footerEl = document.querySelector('footer');
  if (footerEl?.classList.contains('global-footer')) {
    decorateFooter(footerEl, options);
  } else if (footerEl) {
    footerMutationObserver(footerEl, decorateFooter, options);
  }
};

const checkGnav = (options, globalNoClick) => {
  const gnav = document.querySelector('.global-navigation');
  if (gnav) {
    gnav.style.zIndex = '9000';
    const gnavOptions = getOptions(options.gnav?.text, METADATA.GNAV);
    if (!(gnavOptions?.includes(OPTION.CHANGED))) {
      gnav.classList.add(CLASS.NO_CHANGE);
      if (globalNoClick) {
        gnav.classList.add(CLASS.NO_CLICK);
      }
    }
    if (gnavOptions?.includes(OPTION.NO_CLICK) || gnavOptions?.includes(CLASS.NO_CLICK)) {
      gnav.classList.add(CLASS.NO_CLICK);
    }
  }
};
/* c8 ignore stop */

const checkNoClick = (grayboxEl, noClickOnGray) => {
  if (!noClickOnGray) {
    return;
  }
  /* c8 ignore next 6 */
  if (document.body.classList.contains(CLASS.NO_CHANGE)) {
    document.body.classList.add(CLASS.NO_CLICK);
  } else {
    document.querySelectorAll(`.${CLASS.NO_CHANGE}`)
      .forEach((el) => el.classList.add(CLASS.NO_CLICK));
  }
};

const capitalizeFirstLetter = (str) => str.charAt(0).toUpperCase() + str.slice(1);

function setUserAgent(window, userAgent) {
  /* c8 ignore next 3 */
  if (window.navigator.userAgent === userAgent) {
    return;
  }

  const userAgentProp = { get: () => userAgent };
  try {
    Object.defineProperty(window.navigator, 'userAgent', userAgentProp);
    /* c8 ignore next 3 */
  } catch (e) {
    window.navigator = Object.create(navigator, { userAgent: userAgentProp });
  }
}

// eslint-disable-next-line no-promise-executor-return
const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

const openDeviceModal = async (e) => {
  if (deviceModal) {
    closeModal(deviceModal);
    await sleep(300);
    deviceModal = null;
  }

  if (e.target.classList.contains('graybox-desktop')) {
    return;
  }

  const isMobile = e.target.classList.contains('graybox-mobile');
  const isTablet = e.target.classList.contains('graybox-tablet');
  const docFrag = new DocumentFragment();
  const iFrameUrl = new URL(window.location.href);
  iFrameUrl.searchParams.set('graybox', 'menu-off');
  const deviceBorder = createTag('img', { class: 'graybox-device-border', src: isMobile ? iphoneFrame : ipadFrame });
  const iFrame = createTag('iframe', { src: iFrameUrl.href, width: '100%', height: '100%' });

  const modal = createTag('div', null, [deviceBorder, iFrame]);
  docFrag.append(modal);

  deviceModal = await getModal(null, { class: 'graybox-modal', id: 'graybox-modal', content: docFrag, closeEvent: 'closeGrayboxModal' });

  // Disable modal.js forcing 100% height
  iFrame.style.height = '';

  if (isMobile) {
    document.body.classList.add(CLASS.PHONE_PREVIEW);
    deviceModal.classList.add('mobile');
    setUserAgent(iFrame.contentWindow, USER_AGENT.iPhone);
  } else if (isTablet) {
    document.body.classList.add(CLASS.TABLET_PREVIEW);
    deviceModal.classList.add('tablet');
    setUserAgent(iFrame.contentWindow, USER_AGENT.iPad);
  }

  const removeBodyPreviewClasses = () => document.body.classList.remove(
    CLASS.PHONE_PREVIEW,
    CLASS.TABLET_PREVIEW,
  );

  window.addEventListener('milo:modal:closed', removeBodyPreviewClasses, { once: true });

  const curtain = deviceModal.nextElementSibling;
  curtain.classList.add('graybox-curtain');
};

const createGrayboxMenu = (options, { isOpen = false } = {}) => {
  const grayboxContainer = createTag('div', { class: 'graybox-container' });
  const grayboxMenu = createTag('div', { class: 'graybox-menu' }, null, { parent: grayboxContainer });
  /* c8 ignore next 3 */
  if (window.innerWidth < 600 || isMobileDevice()) {
    grayboxMenu.classList.add('hide-devices');
  }

  const grayboxText = createTag('div', { class: 'graybox-text' }, null, { parent: grayboxMenu });
  const title = options.title?.text || getMetadata(METADATA.TITLE) || 'Review Update';
  const desc = options.desc?.text || getMetadata(METADATA.DESC) || '';
  grayboxText.innerHTML = `<p>${title}</p>${desc && `<p>${desc}</p>`}`;

  const grayboxDevices = createTag('div', { class: 'graybox-devices' }, null, { parent: grayboxMenu });

  ['mobile', 'tablet', 'desktop'].forEach((device) => {
    const button = createTag(
      'a',
      { class: `graybox-${device} con-button` },
      capitalizeFirstLetter(device),
      { parent: grayboxDevices },
    );
    button.addEventListener('click', openDeviceModal);
  });

  const toggleBtn = document.createElement('button');
  toggleBtn.className = 'gb-toggle';
  toggleBtn.addEventListener('click', () => {
    grayboxContainer.classList.toggle('open');
  });

  grayboxContainer.appendChild(toggleBtn);
  document.body.appendChild(grayboxContainer);

  if (isOpen) {
    grayboxContainer.classList.add('open');
  }
};

const addPageOverlayDiv = () => {
  const overlayDiv = createTag('div', { class: CLASS.PAGE_OVERLAY });
  document.body.insertBefore(overlayDiv, document.body.firstChild);
};

const setupChangedEls = (globalNoClick) => {
  const changedElSel = `.${CLASS.CHANGED}:not(main > div), main > div.${CLASS.CHANGED} > div:not(.${CLASS.NO_CHANGE})`;
  const changedSectionSel = `main > div.${CLASS.CHANGED}`;
  const gbChangedEls = [...document.querySelectorAll(changedElSel)];
  [...gbChangedEls, ...document.querySelectorAll(changedSectionSel)].forEach((el) => {
    if (!el.style.backgroundColor) el.style.backgroundColor = 'white';
  });
  if (globalNoClick) {
    const blockEls = document.querySelectorAll('main > div > div');
    blockEls.forEach((el) => {
      if (!gbChangedEls.includes(el)) {
        el.classList.add(CLASS.NO_CLICK);
      }
    });
  }
};

const grayboxThePage = (grayboxEl, grayboxMenuOff) => () => {
  document.body.classList.add(CLASS.GRAYBOX_BODY);
  const globalNoClick = grayboxEl.classList.contains(CLASS.NO_CLICK)
  || grayboxEl.classList.contains(OPTION.NO_CLICK);

  const hasGrayboxChangedEl = !!document.querySelector(`.${CLASS.CHANGED}`);
  if (hasGrayboxChangedEl) {
    // If there is at least one element with the 'gb-changed' class
    // a whole page overlay is set on all elements without the 'gb-changed' class
    addPageOverlayDiv();
    setupChangedEls(globalNoClick);
  } else if (globalNoClick) {
    document.querySelectorAll(`.${CLASS.NO_CHANGE}`)
      .forEach((el) => el.classList.add(CLASS.NO_CLICK));
  }

  const options = getTableValues(grayboxEl);
  checkGnav(options, globalNoClick);
  checkFooter(options);
  checkNoClick(grayboxEl, globalNoClick);

  /* c8 ignore next 3 */
  if (grayboxMenuOff) {
    document.body.classList.add(CLASS.NO_BORDER);
  } else {
    createGrayboxMenu(options, { isOpen: true });
  }
};

export default function init(grayboxEl) {
  const url = new URL(window.location.href);

  const grayboxParam = url.searchParams.get('graybox');

  /* c8 ignore next 9 */
  const enableGraybox = grayboxParam === 'on'
    || url.hostname.includes('graybox.adobe.com')
    || url.hostname.includes('localhost')
    || url.hostname.includes('-graybox--')
    || getMetadata('project') === 'graybox';

  if (grayboxParam === 'off' || !enableGraybox) {
    return;
  }

  setMetadata({ selector: 'georouting', val: 'off' });
  const grayboxMenuOff = url.searchParams.get('graybox') === 'menu-off';

  document.addEventListener(
    MILO_EVENTS.DEFERRED,
    grayboxThePage(grayboxEl, grayboxMenuOff),
    { once: true },
  );
}
