import { createTag, getMetadata, MILO_EVENTS } from '../../utils/utils.js';
import { getModal, closeModal } from '../modal/modal.js';
import { iphoneFrame, ipadFrame } from './mobileFrames.js';

const OPTION = {
  CHANGED: 'changed',
  NO_CLICK: 'no-click',
};

const CLASS = {
  CHANGED: 'gb-changed',
  NO_CHANGE: 'gb-no-change',
  NO_CLICK: 'gb-no-click',
  NO_OVERLAY: 'gb-no-overlay',
  OVERLAY: 'gb-overlay',
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

const isMobileDevice = () => /Android|webOS|iPhone|iPad|iPod/i.test(navigator.userAgent);

const getTableValues = (el) => [...el.childNodes].reduce((rdx, row) => {
  if (row.children) {
    const key = row.children[0].textContent?.trim().toLowerCase();
    const content = row.children[1];
    let text = content?.textContent.trim();
    if (key !== 'title' && key !== 'desc') {
      text = text.toLowerCase();
    }
    if (key && content) {
      rdx.keys.push(key);
      rdx[key] = { content, text };
    }
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
    footer.classList.add(CLASS.OVERLAY);
  }
  if (footerOptions?.includes(OPTION.NO_CLICK)) {
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
    gnav.style.zIndex = '1002';
    const gnavOptions = getOptions(options.gnav?.text, METADATA.GNAV);
    if (!(gnavOptions?.includes(OPTION.CHANGED))) {
      gnav.classList.add(CLASS.OVERLAY);
      if (globalNoClick) {
        gnav.classList.add(CLASS.NO_CLICK);
      }
    }
    if (gnavOptions?.includes(OPTION.NO_CLICK)) {
      gnav.classList.add(CLASS.NO_CLICK);
    }
  }
};
/* c8 ignore stop */

const checkNoClick = (grayboxEl, noClickOnGray) => {
  if (!noClickOnGray) {
    return;
  }
  if (document.body.classList.contains(CLASS.OVERLAY)) {
    document.body.classList.add(CLASS.NO_CLICK);
  } else {
    document.querySelectorAll(`.${CLASS.NO_CHANGE}`)
      .forEach((el) => el.classList.add(CLASS.NO_CLICK));
  }
};

const capitalizeFirstLetter = (str) => str.charAt(0).toUpperCase() + str.slice(1);

function setUserAgent(window, userAgent) {
  if (window.navigator.userAgent === userAgent) {
    return;
  }

  const userAgentProp = { get: () => userAgent };
  try {
    Object.defineProperty(window.navigator, 'userAgent', userAgentProp);
  } catch (e) {
    window.navigator = Object.create(navigator, { userAgent: userAgentProp });
  }
}

const openDeviceModal = async (e) => {
  if (deviceModal) {
    closeModal(deviceModal);
    deviceModal = null;
  }

  if (e.target.classList.contains('graybox-desktop')) {
    return;
  }

  const isMobile = e.target.classList.contains('graybox-mobile');
  const isTablet = e.target.classList.contains('graybox-tablet');
  const docFrag = new DocumentFragment();
  const iFrameSrc = `${window.location.href + (window.location.href.includes('?') ? '&' : '?')}graybox=menu-off`;
  const deviceBorder = createTag('img', { class: 'graybox-device-border', src: isMobile ? iphoneFrame : ipadFrame });
  const iFrame = createTag('iframe', { src: iFrameSrc, width: '100%', height: '100%' });

  const modal = createTag('div', null, [deviceBorder, iFrame]);
  docFrag.append(modal);

  deviceModal = await getModal(null, { class: 'graybox-modal', id: 'graybox-modal', content: docFrag, closeEvent: 'closeGrayboxModal' });
  if (isMobile) {
    deviceModal.classList.add('mobile');
    setUserAgent(iFrame.contentWindow, USER_AGENT.iPhone);
  } else if (isTablet) {
    deviceModal.classList.add('tablet');
    setUserAgent(iFrame.contentWindow, USER_AGENT.iPad);
  }

  const curtain = deviceModal.nextElementSibling;
  curtain.classList.add('graybox-curtain');
};

const createGrayboxMenu = (options, { isOpen = false } = {}) => {
  const grayboxContainer = createTag('div', { class: 'graybox-container' });
  const grayboxMenu = createTag('div', { class: 'graybox-menu' }, null, { parent: grayboxContainer });
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

export default function init(grayboxEl) {
  const url = new URL(window.location.href);
  // if (!url.pathname.includes('-graybox') || url.searchParams.get('graybox') !== 'on') {
  //   return;
  // }

  if (url.searchParams.get('graybox') === 'off') {
    return;
  }

  const options = getTableValues(grayboxEl);
  const grayboxThePage = () => {
    const hasGrayboxChanged = !!document.querySelector(`.${CLASS.CHANGED}`);
    if (hasGrayboxChanged) {
      document.body.classList.add(CLASS.OVERLAY);

      document.querySelectorAll(`.${CLASS.CHANGED}`).forEach((el) => {
        el.classList.add(CLASS.NO_OVERLAY);
        if (!el.style.backgroundColor) el.style.backgroundColor = 'white';
      });
    }
    const globalNoClick = grayboxEl.classList.contains(OPTION.NO_CLICK);
    checkGnav(options, globalNoClick);
    checkFooter(options);
    checkNoClick(grayboxEl, globalNoClick);
    if (url.searchParams.get('graybox') !== 'menu-off') {
      createGrayboxMenu(options, { isOpen: true });
    }
  };

  document.addEventListener(MILO_EVENTS.DEFERRED, grayboxThePage);
}
