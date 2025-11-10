/* eslint import/no-relative-packages: 0 */
import {
  getConfig,
  getMetadata,
  loadStyle,
  loadLana,
  isLocalNav,
  decorateLinks,
  localizeLink,
  getFederatedContentRoot,
  getFederatedUrl,
  getFedsPlaceholderConfig,
} from '../../../../utils/utils.js';
import { replaceText, fetchPlaceholders } from '../../../../features/placeholders.js';
import { PERSONALIZATION_TAGS, FLAGS, handleCommands } from '../../../../features/personalization/personalization.js';

loadLana();

const FEDERAL_PATH_KEY = 'federal';
// Set a default height for LocalNav,
// as sticky blocks position themselves before LocalNav loads into the document object model(DOM).
const DEFAULT_LOCALNAV_HEIGHT = 40;
const LANA_CLIENT_ID = 'feds-milo';
const FEDS_PROMO_HEIGHT = 72;
export const KEYBOARD_DELAY = 8000;

const selectorMap = {
  headline: '.feds-menu-headline[aria-expanded="true"]',
  localNavTitle: '.feds-navLink[aria-expanded="true"]',
};

export const selectors = {
  globalNavTag: 'header',
  globalNav: '.global-navigation',
  curtain: '.feds-curtain',
  navLink: '.feds-navLink',
  overflowingTopNav: '.feds-topnav--overflowing',
  navItem: '.feds-navItem',
  activeNavItem: '.feds-navItem--active',
  deferredActiveNavItem: '.feds-navItem--activeDeferred',
  activeDropdown: '.feds-dropdown--active',
  menuSection: '.feds-menu-section',
  menuColumn: '.feds-menu-column',
  gnavPromoWrapper: '.feds-promo-wrapper',
  gnavPromo: '.gnav-promo',
  crossCloudMenuLinks: '.feds-crossCloudMenu a',
  columnBreak: '.column-break',
  brandImageOnly: '.brand-image-only',
  localNav: '.feds-localnav',
  mainNavToggle: '.feds-toggle',
};

export const icons = {
  brand: '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" id="Layer_1" viewBox="0 0 64.57 35"><defs><style>.cls-1{fill: #eb1000;}</style></defs><path class="cls-1" d="M6.27,10.22h4.39l6.2,14.94h-4.64l-3.92-9.92-2.59,6.51h3.08l1.23,3.41H0l6.27-14.94ZM22.03,13.32c.45,0,.94.04,1.43.16v-3.7h3.88v14.72c-.89.4-2.81.89-4.73.89-3.48,0-6.47-1.98-6.47-5.93s2.88-6.13,5.89-6.13ZM22.52,22.19c.36,0,.65-.07.94-.16v-5.42c-.29-.11-.58-.16-.96-.16-1.27,0-2.45.94-2.45,2.92s1.2,2.81,2.47,2.81ZM34.25,13.32c3.23,0,5.98,2.18,5.98,6.02s-2.74,6.02-5.98,6.02-6-2.18-6-6.02,2.72-6.02,6-6.02ZM34.25,22.13c1.11,0,2.14-.89,2.14-2.79s-1.03-2.79-2.14-2.79-2.12.89-2.12,2.79.96,2.79,2.12,2.79ZM41.16,9.78h3.9v3.7c.47-.09.96-.16,1.45-.16,3.03,0,5.84,1.98,5.84,5.86,0,4.1-2.99,6.18-6.53,6.18-1.52,0-3.46-.31-4.66-.87v-14.72ZM45.91,22.17c1.34,0,2.56-.96,2.56-2.94,0-1.85-1.2-2.72-2.5-2.72-.36,0-.65.04-.91.16v5.35c.22.09.51.16.85.16ZM58.97,13.32c2.92,0,5.6,1.87,5.6,5.64,0,.51-.02,1-.09,1.49h-7.27c.4,1.32,1.56,1.94,3.01,1.94,1.18,0,2.27-.29,3.5-.82v2.97c-1.14.58-2.5.82-3.9.82-3.7,0-6.58-2.23-6.58-6.02s2.61-6.02,5.73-6.02ZM60.93,18.02c-.2-1.27-1.05-1.78-1.92-1.78s-1.58.54-1.87,1.78h3.79Z"/></svg>',
  company: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="22" viewBox="0 0 24 22" fill="none"><path d="M14.2353 21.6209L12.4925 16.7699H8.11657L11.7945 7.51237L17.3741 21.6209H24L15.1548 0.379395H8.90929L0 21.6209H14.2353Z" fill="#EB1000"/></svg>',
  search: '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" focusable="false"><path d="M14 2A8 8 0 0 0 7.4 14.5L2.4 19.4a1.5 1.5 0 0 0 2.1 2.1L9.5 16.6A8 8 0 1 0 14 2Zm0 14.1A6.1 6.1 0 1 1 20.1 10 6.1 6.1 0 0 1 14 16.1Z"></path></svg>',
  home: '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" height="25" viewBox="0 0 18 18" width="25"><path fill="#6E6E6E" d="M17.666,10.125,9.375,1.834a.53151.53151,0,0,0-.75,0L.334,10.125a.53051.53051,0,0,0,0,.75l.979.9785A.5.5,0,0,0,1.6665,12H2v4.5a.5.5,0,0,0,.5.5h4a.5.5,0,0,0,.5-.5v-5a.5.5,0,0,1,.5-.5h3a.5.5,0,0,1,.5.5v5a.5.5,0,0,0,.5.5h4a.5.5,0,0,0,.5-.5V12h.3335a.5.5,0,0,0,.3535-.1465l.979-.9785A.53051.53051,0,0,0,17.666,10.125Z"/></svg>',
  redirectIcon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M18 15.75V4.25C18 3.00928 16.9907 2 15.75 2H4.25C3.00928 2 2 3.00928 2 4.25V7.96777C2 8.38183 2.33594 8.71777 2.75 8.71777C3.16406 8.71777 3.5 8.38183 3.5 7.96777V4.25C3.5 3.83643 3.83643 3.5 4.25 3.5H15.75C16.1636 3.5 16.5 3.83643 16.5 4.25V15.75C16.5 16.1636 16.1636 16.5 15.75 16.5H11.939C11.5249 16.5 11.189 16.8359 11.189 17.25C11.189 17.6641 11.5249 18 11.939 18H15.75C16.9907 18 18 16.9907 18 15.75Z" fill="#9F9F9F" stroke="#9F9F9F" stroke-width="0.5"/><path d="M11 9.75V13.9927C11 14.4067 10.6641 14.7427 10.25 14.7427C9.83594 14.7427 9.5 14.4067 9.5 13.9927V11.5605L3.03027 18.0303C2.88379 18.1768 2.69189 18.25 2.5 18.25C2.30811 18.25 2.11621 18.1768 1.96973 18.0303C1.67676 17.7373 1.67676 17.2627 1.96973 16.9697L8.43946 10.5H6.00733C5.59327 10.5 5.25733 10.1641 5.25733 9.75C5.25733 9.33594 5.59327 9 6.00733 9H10.25C10.6641 9 11 9.33594 11 9.75Z" fill="#9F9F9F" stroke="#9F9F9F" stroke-width="0.5"/></svg>',
};

export const darkIcons = {
  ...icons,
  brand: '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" id="Layer_1" viewBox="0 0 64.57 35"><defs><style>.cls-1{fill: #fff;}</style></defs><path class="cls-1" d="M6.27,10.22h4.39l6.2,14.94h-4.64l-3.92-9.92-2.59,6.51h3.08l1.23,3.41H0l6.27-14.94ZM22.03,13.32c.45,0,.94.04,1.43.16v-3.7h3.88v14.72c-.89.4-2.81.89-4.73.89-3.48,0-6.47-1.98-6.47-5.93s2.88-6.13,5.89-6.13h0ZM22.52,22.19c.36,0,.65-.07.94-.16v-5.42c-.29-.11-.58-.16-.96-.16-1.27,0-2.45.94-2.45,2.92s1.2,2.81,2.47,2.81h0ZM34.25,13.32c3.23,0,5.98,2.18,5.98,6.02s-2.74,6.02-5.98,6.02-6-2.18-6-6.02,2.72-6.02,6-6.02ZM34.25,22.13c1.11,0,2.14-.89,2.14-2.79s-1.03-2.79-2.14-2.79-2.12.89-2.12,2.79.96,2.79,2.12,2.79ZM41.16,9.78h3.9v3.7c.47-.09.96-.16,1.45-.16,3.03,0,5.84,1.98,5.84,5.86,0,4.1-2.99,6.18-6.53,6.18-1.52,0-3.46-.31-4.66-.87v-14.72h0ZM45.91,22.17c1.34,0,2.56-.96,2.56-2.94,0-1.85-1.2-2.72-2.5-2.72-.36,0-.65.04-.91.16v5.35c.22.09.51.16.85.16h0ZM58.97,13.32c2.92,0,5.6,1.87,5.6,5.64,0,.51-.02,1-.09,1.49h-7.27c.4,1.32,1.56,1.94,3.01,1.94,1.18,0,2.27-.29,3.5-.82v2.97c-1.14.58-2.5.82-3.9.82-3.7,0-6.58-2.23-6.58-6.02s2.61-6.02,5.73-6.02ZM60.93,18.02c-.2-1.27-1.05-1.78-1.92-1.78s-1.58.54-1.87,1.78c0,0,3.79,0,3.79,0Z"/></svg>',
  company: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="22" viewBox="0 0 24 22" fill="none"><path d="M14.2353 21.6209L12.4925 16.7699H8.11657L11.7945 7.51237L17.3741 21.6209H24L15.1548 0.379395H8.90929L0 21.6209H14.2353Z" fill="#FFFFFF"/></svg>',
};

export const lanaLog = ({ message, e = '', tags = 'default', errorType }) => {
  const { locale = {} } = getConfig();
  const url = getMetadata('gnav-source') || `${locale.contentRoot}/gnav`;
  window.lana.log(`${message} | gnav-source: ${url} | href: ${window.location.href} | ${e.reason || e.error || e.message || e}`, {
    clientId: LANA_CLIENT_ID,
    sampleRate: 1,
    tags,
    errorType,
  });
};

let keyboardNav;
export const setupKeyboardNav = async (newMobileWithLnav, isFooter) => {
  keyboardNav = keyboardNav || new Promise((resolve) => {
    import('./keyboard/index.js')
      .then(({ default: Navigation }) => resolve(new Navigation(newMobileWithLnav, isFooter)));
  });
  return keyboardNav;
};

const usedMeasurementNames = new Set();
export const logPerformance = (
  measurementName,
  startMark,
  endMark,
) => {
  try {
    if (usedMeasurementNames.has(measurementName)) throw new Error(`${measurementName} has already been used`);
    const {
      name,
      startTime,
      duration,
    } = performance.measure(measurementName, startMark, endMark);
    usedMeasurementNames.add(measurementName);
    const measure = {
      name,
      startTime,
      duration,
      url: window.location.toString(),
      errorType: 'i',
    };
    const measureStr = Object.entries(measure)
      .map(([key, value]) => `${key}=${value}`)
      .join(',');
    window.lana.log(measureStr, {
      clientId: LANA_CLIENT_ID,
      sampleRate: 0.01,
    });
  } catch (e) {
    // eslint-disable-next-line no-empty
  }
};

export const logErrorFor = async (fn, message, tags, errorType) => {
  try {
    await fn();
  } catch (e) {
    lanaLog({ message, e, tags, errorType });
  }
};

export function addMepHighlightAndTargetId(el, source) {
  let { manifestId, targetManifestId } = source.dataset;
  manifestId ??= source?.closest('[data-manifest-id]')?.dataset?.manifestId;
  targetManifestId ??= source?.closest('[data-adobe-target-testid]')?.dataset?.adobeTargetTestid;
  if (manifestId) el.dataset.manifestId = manifestId;
  if (targetManifestId) el.dataset.adobeTargetTestid = targetManifestId;
  return el;
}

export function toFragment(htmlStrings, ...values) {
  const templateStr = htmlStrings.reduce((acc, htmlString, index) => {
    if (values[index] instanceof HTMLElement) {
      return `${acc + htmlString}<elem ref="${index}"></elem>`;
    }
    return acc + htmlString + (values[index] || '');
  }, '');

  const fragment = document.createRange().createContextualFragment(templateStr).children[0];

  Array.prototype.map.call(fragment.querySelectorAll('elem'), (replaceable) => {
    const ref = replaceable.getAttribute('ref');
    replaceable.replaceWith(values[ref]);
  });

  return fragment;
}

const getPath = (urlOrPath = '') => {
  try {
    const url = new URL(urlOrPath);
    return url.pathname;
  } catch (error) {
    return urlOrPath.replace(/^\.\//, '/');
  }
};

export const federatePictureSources = ({ section, forceFederate } = {}) => {
  const selector = forceFederate
    ? '[src], [srcset]'
    : `[src*="/${FEDERAL_PATH_KEY}/"], [srcset*="/${FEDERAL_PATH_KEY}/"]`;
  section?.querySelectorAll(selector)
    .forEach((source) => {
      const type = source.hasAttribute('src') ? 'src' : 'srcset';
      const path = getPath(source.getAttribute(type));
      const [, localeOrKeySegment, keyOrPathSegment] = path.split('/');
      if (forceFederate || [localeOrKeySegment, keyOrPathSegment].includes(FEDERAL_PATH_KEY)) {
        const federalPrefix = path.includes('/federal/') ? '' : '/federal';
        source.setAttribute(type, `${getFederatedContentRoot()}${federalPrefix}${path}`);
      }
    });
};

export function getExperienceName() {
  const experiencePath = getMetadata('gnav-source');
  const explicitExperience = experiencePath?.split('#')[0]?.split('/').pop();
  if (explicitExperience?.length
    && explicitExperience !== 'gnav') return explicitExperience;

  const { imsClientId } = getConfig();
  if (imsClientId?.length) return imsClientId;

  return '';
}

export function rootPath(path) {
  const { miloLibs, codeRoot } = getConfig();
  const url = `${miloLibs || codeRoot}/mep/ace1151/global-navigation/${path}`;
  return url;
}

export function loadStyles(url, override = false) {
  const { standaloneGnav } = getConfig();
  if (standaloneGnav && !override) return;
  loadStyle(url, (e) => {
    if (e === 'error') {
      lanaLog({
        message: 'GNAV: Error in loadStyles',
        e: `error loading style: ${url}`,
        tags: 'utilities',
        errorType: 'i',
      });
    }
  });
}

export function isDarkMode() {
  const { theme } = getConfig();
  return theme === 'dark';
}

// Base styles are shared between top navigation and footer,
// since they can be independent of each other.
// CSS imports were not used due to duplication of file include
export async function loadBaseStyles() {
  const { standaloneGnav } = getConfig();
  if (standaloneGnav) return;
  if (isDarkMode()) {
    new Promise((resolve) => { loadStyle(rootPath('base.css'), resolve); })
      .then(() => loadStyles(rootPath('dark-nav.css')));
  } else {
    const url = rootPath('base.css');
    await loadStyles(url);
  }
}

let cachedDecorateMenu;
export async function loadDecorateMenu() {
  if (cachedDecorateMenu) return cachedDecorateMenu;

  let resolve;
  cachedDecorateMenu = new Promise((_resolve) => {
    resolve = _resolve;
  });

  const [menu] = await Promise.all([
    import('./menu/menu.js'),
    loadStyles(rootPath('utilities/menu/menu.css')),
  ]);

  resolve(menu.default);
  return cachedDecorateMenu;
}

let curtainElem;
export function setCurtainState(state) {
  if (typeof state !== 'boolean') return;

  curtainElem = curtainElem || document.querySelector(selectors.curtain);
  if (curtainElem) curtainElem.classList.toggle('feds-curtain--open', state);
}

export const isDesktop = window.matchMedia('(min-width: 900px)');
export const isSmallScreen = window.matchMedia('(max-width: 320px)');
export const isDesktopForContext = (context = 'viewport') => {
  const isContainerResponsiveFooter = document.querySelector('.global-footer')?.classList.contains('responsive-container');
  if (context === 'footer' && isContainerResponsiveFooter) {
    const footerElement = document.querySelector('footer.global-footer');
    return footerElement && !footerElement.classList.contains('mobile');
  }

  // Default to viewport width for all other contexts
  return isDesktop.matches;
};
export const isTangentToViewport = window.matchMedia('(min-width: 900px) and (max-width: 1440px)');

export function setActiveDropdown(elem, type) {
  const activeClass = selectors.activeDropdown.replace('.', '');
  const activeLocalNav = '.feds-localnav--active';

  // We always need to reset all active dropdowns at first
  const resetActiveDropdown = () => {
    [...document.querySelectorAll(selectors.activeDropdown)]
      .forEach((activeDropdown) => activeDropdown.classList.remove(activeClass));
    // Close the localnav if clicked element is not localnav item
    if ((!type || type === 'localNav-curtain')) {
      // Remove disable-scroll set by localnav opening
      if (document.querySelector('.feds-localnav--active') && !document.querySelector('.feds-toggle[aria-expanded="true"]')) {
        document.body.classList.remove('disable-scroll');
      }
      [...document.querySelectorAll(activeLocalNav)]
        .forEach((activeDropdown) => activeDropdown.classList.remove('feds-localnav--active'));
    }
  };
  resetActiveDropdown();

  // If no elem is provided, de-activating all dropdowns is enough
  if (!(elem instanceof HTMLElement)) return;

  // Compose an array of parents that could be active dropdowns
  const selectorArr = [selectors.menuSection, selectors.menuColumn, selectors.navItem];

  // Look for the first parent that fits the active dropdown criteria
  selectorArr.some((selector) => {
    const closestSection = elem.closest(selector);

    if (closestSection && closestSection.querySelector('[aria-expanded = "true"]')) {
      closestSection.classList.add(activeClass);
      return true;
    }

    return false;
  });
  document.querySelector('.global-navigation').classList.add('dropdown-active');
  if (isDesktop.matches) window?.UniversalNav?.changeTheme?.('dark');
}

export const animateInSequence = (xs, gap) => {
  for (let i = 0; i < xs.length; i += 1) {
    xs[i].style = `animation-delay: ${(i + 1) * gap}s`;
  }
};

// Disable AED(Active Element Detection)
export const [setDisableAEDState, getDisableAEDState] = (() => {
  let disableAED = false;
  return [
    () => { disableAED = true; },
    () => disableAED,
  ];
})();

export const [setAsyncDropdownCount, getAsyncDropdownCount] = (() => {
  let asyncDropdownCount = 0;
  return [
    (val) => { asyncDropdownCount = val; },
    () => asyncDropdownCount,
  ];
})();

export const [hasActiveLink, setActiveLink, isActiveLink, getActiveLink] = (() => {
  let activeLinkFound;
  const { origin, pathname } = window.location;
  const url = `${origin}${pathname}`;

  return [
    () => activeLinkFound,
    (val) => { activeLinkFound = !!val; },
    (el) => (el.href === url || el.href.startsWith(`${url}?`) || el.href.startsWith(`${url}#`)),
    (area) => {
      const isCustomLinks = area.closest('.link-group')?.classList.contains('mobile-only');
      const disableAED = getDisableAEDState() || isCustomLinks;
      if (disableAED || hasActiveLink() || !(area instanceof HTMLElement)) return null;
      const activeLink = [
        ...area.querySelectorAll('a:not([data-modal-hash])'),
      ].find(isActiveLink);

      if (!activeLink) return null;

      setActiveLink(true);
      return activeLink;
    },
  ];
})();

export const setAriaAtributes = (dropdownTrigger) => {
  const popup = dropdownTrigger.nextElementSibling;
  if (isDesktop.matches) {
    dropdownTrigger.setAttribute('aria-haspopup', 'true');
    dropdownTrigger.removeAttribute('aria-controls');
    popup.removeAttribute('role');
    popup.removeAttribute('aria-modal');
    popup.removeAttribute('aria-labelledby');
  } else {
    dropdownTrigger.setAttribute('aria-haspopup', 'dialog');
    dropdownTrigger.setAttribute('aria-controls', popup.id);
    popup.setAttribute('role', 'dialog');
    popup.setAttribute('aria-modal', true);
    popup.setAttribute('aria-labelledby', `${popup.id}-title`);
  }
};

export const [addA11YMobileDropdowns, removeA11YMobileDropdowns] = (() => {
  const elementsToHidden = ['.feds-brand-container', '.feds-utilities', '.feds-nav-wrapper .feds-nav > *'];
  let topNav = null;
  return [
    (container, triggerElement) => {
      topNav = container;
      elementsToHidden.forEach((selector) => {
        const elements = topNav.querySelectorAll(selector);
        elements.forEach((el) => {
          el?.setAttribute('aria-hidden', 'true');
        });
      });
      triggerElement.closest('section')?.setAttribute('aria-hidden', 'false');
    },
    () => {
      if (!topNav) return;
      elementsToHidden.forEach((selector) => {
        const elements = topNav.querySelectorAll(selector);
        elements.forEach((el) => {
          el?.removeAttribute('aria-hidden');
        });
      });
    },
  ];
})();

export function closeAllDropdowns({
  type,
  animatedElement = undefined,
  animationType = undefined,
} = {}) {
  const selector = selectorMap[type] || `${selectors.globalNav} [aria-expanded = "true"], ${selectors.localNav} [aria-expanded = "true"]`;

  const closeAllOpenElements = () => {
    const openElements = document.querySelectorAll(selector);
    if (!openElements) return;
    [...openElements].forEach((el) => {
      const isUnavAppSwitcher = el.id === 'unav-app-switcher';
      if ('fedsPreventautoclose' in el.dataset || isUnavAppSwitcher || (type === 'localNavItem' && el.classList.contains('feds-localnav-title'))) return;
      el.setAttribute('aria-expanded', 'false');
    });
  };

  if (animatedElement && animationType) {
    animatedElement.addEventListener(`${animationType}end`, closeAllOpenElements, { once: true });
  } else {
    closeAllOpenElements();
  }

  setActiveDropdown(undefined, type);

  document.querySelector('.global-navigation').classList.remove('dropdown-active');
  if (isDesktop.matches) {
    setCurtainState(false);
    window?.UniversalNav?.changeTheme?.(isDarkMode() ? 'dark' : 'light');
  }
}

export const disableMobileScroll = () => {
  if (!PERSONALIZATION_TAGS.safari()) return;
  if (document.body.classList.contains('disable-ios-scroll')) return;
  if (document.body.style.top) return;
  document.body.style.top = `-${window.scrollY}px`;
  document.body.classList.add('disable-ios-scroll');
};

export const enableMobileScroll = () => {
  if (!PERSONALIZATION_TAGS.safari()) return;
  if (!document.body.style.top) return;
  const y = Math.abs(parseInt(document.body.style.top, 10));
  if (Number.isNaN(y)) return;
  document.body.classList.remove('disable-ios-scroll');
  document.body.style.removeProperty('top');
  window.scroll(0, y || 0, { behavior: 'instant' });
};

export function trigger({
  element,
  event,
  type,
  animatedElement = undefined,
  animationType = undefined,
} = {}) {
  if (event) event.preventDefault();
  const isOpen = element?.getAttribute('aria-expanded') === 'true';
  closeAllDropdowns({ type, animatedElement, animationType });
  if (isOpen) return false;
  element.setAttribute('aria-expanded', 'true');
  if (!isDesktop.matches && type === 'dropdown'
    && !!document.querySelector('header.new-nav')) disableMobileScroll();
  return true;
}

export const yieldToMain = () => new Promise((resolve) => { setTimeout(resolve, 0); });

export async function fetchAndProcessPlainHtml({
  url,
  plainHTMLPromise = null,
  shouldDecorateLinks = true,
} = {}) {
  let path = getFederatedUrl(url);
  const config = getConfig();
  const mepGnav = config?.mep?.inBlock?.['global-navigation'];
  const mepFragments = { ...mepGnav?.fragments, ...config?.mep?.fragments };
  const mepFragment = mepFragments[path];
  if (mepFragment && mepFragment.action === 'replace') {
    path = mepFragment.content;
  }
  const res = await (plainHTMLPromise ?? fetch(path.replace(/(\.html$|$)/, '.plain.html')));
  if (res.status !== 200) {
    lanaLog({
      message: 'Error in fetchAndProcessPlainHtml',
      e: `${res.statusText} url: ${res.url}`,
      tags: 'utilities',
      errorType: 'i',
    });
    return null;
  }
  const text = await (plainHTMLPromise ? res.clone().text() : res.text());
  const { body } = new DOMParser().parseFromString(text, 'text/html');
  if (mepFragment?.manifestId) body.dataset.manifestId = mepFragment.manifestId;
  if (mepFragment?.targetManifestId) body.dataset.adobeTargetTestid = mepFragment.targetManifestId;
  let commands = mepGnav?.commands || [];

  const gnavMepCommands = config?.mep?.commands?.filter(
    (command) => command?.modifiers?.find((modifier) => modifier === FLAGS?.includeGnav),
  ) || [];

  commands = commands.concat(gnavMepCommands);

  if (commands?.length) {
    /* c8 ignore next 3 */
    handleCommands(commands, body, true, true);
  }
  const inlineFrags = [...body.querySelectorAll('a[href*="#_inline"]')];
  if (inlineFrags.length) {
    const { default: loadInlineFrags } = await import('../../../../blocks/fragment/fragment.js');
    const fragPromises = inlineFrags.map((link) => {
      link.href = getFederatedUrl(localizeLink(link.href));
      return loadInlineFrags(link);
    });
    await Promise.all(fragPromises);
  }

  // federatePictureSources should only be called after decorating the links.
  if (shouldDecorateLinks) {
    decorateLinks(body);
    federatePictureSources({ section: body, forceFederate: path.includes('/federal/') });
  }

  const blocks = body.querySelectorAll('.martech-metadata');
  if (blocks.length) {
    import('../../../../blocks/martech-metadata/martech-metadata.js')
      .then(({ default: decorate }) => blocks.forEach((block) => decorate(block)))
      .catch((e) => {
        lanaLog({
          message: 'Error in fetchAndProcessPlainHtml',
          e,
          tags: 'utilities',
          errorType: 'i',
        });
      });
  }

  body.innerHTML = await replaceText(body.innerHTML, getFedsPlaceholderConfig());
  return body;
}

export const [setUserProfile, getUserProfile] = (() => {
  let profileData;
  let profileResolve;
  let profileTimeout;

  const profilePromise = new Promise((resolve) => {
    profileResolve = resolve;

    profileTimeout = setTimeout(() => {
      profileData = {};
      resolve(profileData);
    }, 5000);
  });

  return [
    (data) => {
      if (data && !profileData) {
        profileData = data;
        clearTimeout(profileTimeout);
        profileResolve(profileData);
      }
    },
    () => profilePromise,
  ];
})();

export const closeAllTabs = (tabs, tabpanels) => {
  tabpanels.forEach((t) => t.setAttribute('hidden', 'true'));
  tabs.forEach((t) => {
    t.setAttribute('aria-selected', 'false');
  });
};

let processTrackingLabels;
const getAnalyticsValue = async (str, index) => {
  processTrackingLabels = processTrackingLabels ?? (await import('../../../../martech/attributes.js')).processTrackingLabels;

  if (typeof str !== 'string' || !str.length) return str;

  return `${processTrackingLabels(str, getConfig(), 30)}-${index}`;
};

const parseTabsFromMenuSection = async (section, index) => {
  const headline = section.querySelector('.feds-menu-headline');
  const description = section.querySelector('.feds-menu-description');
  const name = headline?.textContent ?? 'Shop For';
  const stickyCta = section.querySelector('.feds-cta--secondary');
  const ctas = section.querySelectorAll('.feds-cta');

  let daallTab = headline?.getAttribute('daa-ll');

  // Handle desktop → mobile transition case
  if (!daallTab) {
    daallTab = await getAnalyticsValue(name, index + 1);
  }

  const daalhTabContent = section
    .querySelector('.feds-menu-items')
    ?.getAttribute('daa-lh');

  const content = section.querySelector('.feds-menu-items') ?? section;

  const columns = content.classList.contains('feds-menu-items')
    ? [...content.querySelectorAll('ul')]
    : [content];

  const links = columns
    .map((container) => [...container.querySelectorAll(
      isDesktop.matches ? 'a.feds-navLink, .feds-navLink.feds-navLink--header, .feds-cta--primary, .feds-cta--secondary' : 'a.feds-navLink, .feds-navLink.feds-navLink--header, .feds-cta--primary',
    )]
      .map((x) => x.outerHTML)
      .join(''))
    .map((l) => `<div class="tab-column">${l}</div>`)
    .join('');

  // Detect if headline itself is a redirection (contains an anchor)
  const headlineAnchor = headline?.querySelector('a');
  const isHeadingAsRedirection = !!headlineAnchor;

  return {
    name,
    links,
    ctas,
    daallTab,
    daalhTabContent,
    description: description?.textContent?.trim() ?? '',
    stickyCta,
    ...(isHeadingAsRedirection
      ? {
        isHeadingAsRedirection: true,
        headlineHref: headlineAnchor?.getAttribute('href') ?? '',
      }
      : {}),
  };
};

// const promoCrossCloudTab = async (popup) => {
//   const additionalLinks =
//   [...popup.querySelectorAll(`${selectors.gnavPromoWrapper}, ${selectors.crossCloudMenuLinks}`)];
//   if (!additionalLinks.length) return [];
//   const tabName = await replaceKey('more', getFedsPlaceholderConfig());
//   return [{
//     name: tabName,
//     links: additionalLinks.map((x) => x.outerHTML).join(''),
//     daallTab: tabName,
//     daalhTabContent: tabName,
//   }];
// };

export async function getMainMenuPlaceholder() {
  const config = getConfig();
  const cloudPlaceholders = await fetchPlaceholders({ config });
  let mainMenuLabel = cloudPlaceholders['main-menu'];
  if (!mainMenuLabel) {
    mainMenuLabel = (await fetchPlaceholders({ config: getFedsPlaceholderConfig() }))['main-menu'] || 'Main menu';
  }
  return `
    <button class="main-menu" daa-ll="Main menu_Gnav" aria-label='Main menu'>
      <svg xmlns="http://www.w3.org/2000/svg" width="7" height="12" viewBox="0 0 7 12" fill="none"><path d="M5.55579 1L1.09618 5.45961C1.05728 5.4985 1.0571 5.56151 1.09577 5.60062L5.51027 10.0661" stroke=${isDarkMode() ? '#f2f2f2' : 'black'} stroke-width="2" stroke-linecap="round"/></svg>
      ${mainMenuLabel}
    </button>
  `;
}

// returns a cleanup function
export const transformTemplateToMobile = async ({
  popup,
  item,
  localnav = false,
  toggleMenu,
  updatePopupPosition,
}) => {
  // const isLoading = popup.classList.contains('loading');
  const tabs = await (async () => {
    const selectMultiColumnSections = '.feds-menu-column--group .feds-menu-section';
    const selectSingleColumns = '.feds-menu-column > .feds-menu-section'; // includes multi-section single columns
    const selectMultiColumnSmallMenus = '.feds-menu-column:has(> .feds-menu-items)';
    const parsedSections = await Promise.all(
      [...popup.querySelectorAll(`:is(${selectMultiColumnSections}, ${selectSingleColumns}, ${selectMultiColumnSmallMenus})`)]
        .filter((section) => !section.querySelector('.feds-promo') && section.textContent)
        .map(parseTabsFromMenuSection),
    );
    const normalTabs = [];
    const headingLinkTabs = [];
    for (const tab of parsedSections) {
      if (tab.isHeadingAsRedirection) headingLinkTabs.push(tab);
      else normalTabs.push(tab);
    }
    // const promoTabs = isLoading ? [] : await promoCrossCloudTab(popup);
    return normalTabs.concat(headingLinkTabs);
  })();

  // Get the outerHTML of the .feds-brand element or use a default empty <span> if it doesn't exist
  const brand = document.querySelector('.feds-brand')?.outerHTML || '<span></span>';
  const breadCrumbs = document.querySelector('.feds-breadcrumbs')?.outerHTML;
  if (document.querySelector('.feds-promo-aside-wrapper')?.clientHeight > FEDS_PROMO_HEIGHT && updatePopupPosition) {
    updatePopupPosition();
  }

  popup.innerHTML = `
    <div class="top-bar">
      ${localnav ? brand : await getMainMenuPlaceholder()}
    </div>
    <div class="title">
      ${breadCrumbs || '<div class="breadcrumbs"></div>'}
      <h2 id="${popup.id}-title">${item.textContent.trim()}</h2>
    </div>
    <div class="tabs" role="tablist">
      ${tabs
    .map(
      (
        { name, daallTab, description, isHeadingAsRedirection, headlineHref },
        i,
      ) => {
        const label = name.trim() === ''
          ? '<div></div>'
          : `<span>${name}</span>`;

        const desc = description
          ? `<span class="feds-menu-description">${description}</span>`
          : '';

        // Determine role and extra data attributes
        const role = isHeadingAsRedirection ? 'link' : 'tab';
        const dataHrefAttr = isHeadingAsRedirection && headlineHref
          ? `data-href="${headlineHref}"`
          : '';

        const redirectIcon = isHeadingAsRedirection
          ? icons.redirectIcon
          : '';

        return `
          <button
            role="${role}"
            class="tab"
            aria-selected="false"
            aria-controls="${i}"
            ${daallTab ? `daa-ll="${daallTab}|click"` : ''}
            ${dataHrefAttr}
          >
            ${label}${desc}${redirectIcon}
          </button>
        `;
      },
    )
    .join('')}
    </div>
    <div class="tab-content">
      ${tabs
    .map(
      ({ links, daalhTabContent, description, stickyCta }, i) => `
    <div
      id="${i}"
      class="tab-panel"
      role="tabpanel"
      aria-labelledby="${i}"
      class="${
  links.match(/class\s*=\s*["'][^"']*\bfeds-navLink--header\b[^"']*["']/)
    ? 'has-subheader'
    : ''
}"
      ${daalhTabContent ? `daa-lh="${daalhTabContent}"` : ''}
      hidden
    >
      ${description ? `<div class="feds-content-description">${description}</div>` : ''}
      ${links}
      ${stickyCta ? `<div class="sticky-cta">${stickyCta.outerHTML}</div>` : ''}
    </div>`,
    )
    .join('')}
    </div>
    <button class="close-icon" daa-ll="Close button_SubNav" aria-label="Close">
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M1.5 1L13 12.5" stroke="${isDarkMode() ? '#f2f2f2' : 'black'}" stroke-width="1.7037" stroke-linecap="round"/>
        <path d="M13 1L1.5 12.5" stroke="${isDarkMode() ? '#f2f2f2' : 'black'}" stroke-width="1.7037" stroke-linecap="round"/>
      </svg>
    </button>
  `;

  const closeIcon = popup.querySelector('.close-icon');
  const main = popup.querySelector('.main-menu');
  const closeIconClickCallback = () => {
    removeA11YMobileDropdowns();
    document.querySelector(selectors.mainNavToggle).focus();
    closeAllDropdowns();
    toggleMenu();
    enableMobileScroll();
  };
  const mainMenuClickCallback = (e) => {
    removeA11YMobileDropdowns();
    e.target.closest(selectors.activeDropdown).querySelector('button').focus();
    enableMobileScroll();
    closeAllDropdowns();
  };

  closeIcon?.addEventListener('click', closeIconClickCallback);
  main?.addEventListener('click', mainMenuClickCallback);

  const tabbuttons = popup.querySelectorAll('.tabs button');
  const tabpanels = popup.querySelectorAll('.tab-content [role="tabpanel"]');
  const tabbuttonClickCallbacks = [...tabbuttons].map((tab, i) => (event) => {
    if (tab.getAttribute('role') === 'link' && tab.dataset.href && event?.type === 'click') {
      window.location.href = tab.dataset.href;
      return;
    }
    closeAllTabs(tabbuttons, tabpanels);
    tabpanels?.[i]?.removeAttribute('hidden');
    tab.setAttribute('aria-selected', 'true');
  });

  tabpanels.forEach((panel) => {
    animateInSequence([...panel.children], 0.02);
  });

  tabbuttons.forEach((tab, i) => {
    // pinterdown prevents the default action of the button, which is to scroll the window.
    // This is needed to prevent the page from jumping when the tab is clicked.
    tab.addEventListener('pointerdown', (event) => event.preventDefault());
    tab.addEventListener('click', (e) => tabbuttonClickCallbacks[i](e));
    tab.addEventListener('mouseover', (e) => {
      if (isDesktop.matches) tabbuttonClickCallbacks[i](e);
    });
    tab.addEventListener('focus', (e) => {
      if (isDesktop.matches) tabbuttonClickCallbacks[i](e);
    });
  });

  const cleanup = () => {
    closeIcon?.removeEventListener('click', closeIconClickCallback);
    main?.removeEventListener('click', mainMenuClickCallback);
    tabbuttons.forEach((tab, i) => tab.removeEventListener('click', tabbuttonClickCallbacks[i]));
  };

  // This is here to handle the case where we're treating a multicolumn small menu
  // as a mega menu. If it gets all the way to this point, it should probably have
  // this class
  if (!popup.parentElement?.classList.contains('feds-navItem--megaMenu')) {
    popup.parentElement.classList.add('feds-navItem--megaMenu');
  }
  return cleanup;
};

export const loaderMegaMenu = (title) => {
  const tab = () => ({ name: '' });
  const tabs = [0, 1, 2, 3].map(tab);
  return toFragment`
  <div class="feds-popup loading" aria-hidden="true">
    <div class="top-bar">
    </div>
    <div class="title">
      <h2>${title}</h2>
    </div>
    <div class="tabs" role="tablist">
      ${tabs.map(({ name, description }, i) => `
        <div class="tab-wrapper">
          <button
          role="tab"
          class="tab"
          aria-selected="false"
          aria-controls="${i}"
          >${name.trim() === '' ? '<div></div>' : name}</button>
          ${description ? `<div class="feds-menu-description">${description}</div>` : ''}
        </div>
      `).join('')}
    </div>
    <div class="tab-content">
    ${tabs.map((_, i) => `
        <div
          id="${i}"
          role="tabpanel"
          aria-labelledby="${i}"
          class="feds-navLink-content"
        >
      <div class="feds-navLink-title"></div>
      <div class="feds-navLink-description"></div>
      </div>`).join('')}
  </div>
  `;
};

export const takeWhile = (xs, f) => {
  const r = [];
  for (let i = 0; i < xs.length; i += 1) {
    if (!f(xs[i])) return r;
    r.push(xs[i]);
  }
  return r;
};

export const dropWhile = (xs, f) => {
  if (!xs.length) return xs;
  if (f(xs[0])) return dropWhile(xs.slice(1), f);
  return xs;
};

export function getGnavHeight() {
  let topHeight = document.querySelector('header')?.offsetHeight || 0;
  if (isLocalNav() && !isDesktop.matches) {
    const localNav = document.querySelector('.feds-localnav');
    topHeight = localNav.offsetHeight || DEFAULT_LOCALNAV_HEIGHT;
  }

  const fedsPromo = document.querySelector('.feds-promo-aside-wrapper');
  if (fedsPromo instanceof HTMLElement) {
    topHeight += fedsPromo.offsetHeight;
  }

  return topHeight;
}

const SIGNED_OUT_ICONS = ['appswitcher', 'help'];
export function getUnavWidthCSS(unavComponents, signedOut = false) {
  const iconWidth = 32; // px
  const flexGap = 0.25; // rem
  const sectionDivider = getConfig()?.unav?.showSectionDivider;
  const sectionDividerMargin = 4; // px (left and right margins)
  const cartEnabled = /uc_carts=/.test(document.cookie);
  const components = (!cartEnabled ? unavComponents?.filter((x) => x !== 'cart') : unavComponents) ?? [];
  const n = components.length ?? 3;
  if (signedOut) {
    const l = components.filter((c) => SIGNED_OUT_ICONS.includes(c)).length;
    const signInButton = 92; // px
    return `calc(${signInButton}px + ${l * iconWidth}px + ${l * flexGap}rem${sectionDivider ? ` + 2px + ${2 * sectionDividerMargin}px + ${flexGap}rem` : ''})`;
  }
  return `calc(${n * iconWidth}px + ${(n - 1) * flexGap}rem${sectionDivider ? ` + 2px + ${2 * sectionDividerMargin}px + ${flexGap}rem` : ''})`;
}

/**
 * Initializes a MutationObserver to monitor the body
  for the addition or removal of a branch banner iframe.
 * When the branch banner is added or removed, updates the branch banner
  information and adjusts the local navigation and popup position accordingly.
 * A callback function to update the popup position when the branch banner is added or removed.
 * @param {Function} updatePopupPosition
 */
export const [branchBannerLoadCheck, getBranchBannerInfo] = (() => {
  const branchBannerInfo = {
    isPresent: false,
    isSticky: false,
    height: 0,
  };
  return [
    (updatePopupPosition) => {
      // Create a MutationObserver instance to monitor the body for new child elements
      const observer = new MutationObserver((mutationsList) => {
        mutationsList.forEach((mutation) => {
          if (mutation.type === 'childList') {
            mutation.addedNodes.forEach((node) => {
              // Check if the added node has the ID 'branch-banner-iframe'
              setTimeout(() => {
                if (node.id === 'branch-banner-iframe') {
                  branchBannerInfo.isPresent = true;
                  // The element is added, now check its height and sticky status
                  // Check if the element has a sticky position
                  branchBannerInfo.isSticky = window.getComputedStyle(node).position === 'fixed';
                  branchBannerInfo.height = node.offsetHeight; // Get the height of the element
                  if (branchBannerInfo.isSticky) {
                    // Adjust the top position of the lnav to account for the branch banner height
                    const navElem = document.querySelector(isLocalNav() ? '.feds-localnav' : 'header');
                    navElem.style.top = `${branchBannerInfo.height}px`;
                  } else {
                    /* Add a class to the body to indicate the presence of a non-sticky
                    branch banner */
                    document.body.classList.add('branch-banner-inline');
                  }
                  // Update the popup position when the branch banner is added
                  updatePopupPosition();
                }
              }, 50);
              /* 50ms delay to ensure the node is fully rendered with styles before
              checking its properties */
            });

            mutation.removedNodes.forEach((node) => {
              // Check if the removed node has the ID 'branch-banner-iframe'
              if (node.id === 'branch-banner-iframe') {
                branchBannerInfo.isPresent = false;
                branchBannerInfo.isSticky = false;
                branchBannerInfo.height = 0;
                // Remove the top style attribute when the branch banner is removed
                const navElem = document.querySelector(isLocalNav() ? '.feds-localnav' : 'header');
                navElem?.removeAttribute('style');

                // Remove the class indicating the presence of a non-sticky branch banner
                document.body.classList.remove('branch-banner-inline');
                // Update the popup position when the branch banner is removed
                updatePopupPosition();
                // Optional: Disconnect the observer if you no longer need to track it
                observer.disconnect();
              }
            });
          }
        });
      });

      // Start observing the body element for added child nodes
      observer.observe(document.body, {
        childList: true, // Watch for added or removed child nodes
        subtree: false, // Only observe direct children of <body>
      });
    },
    /**
     * Retrieves the current status of the branch banner.
     * @returns {Object} An object containing the presence and sticky status of the branch banner.
     */
    () => branchBannerInfo,
  ];
})();
