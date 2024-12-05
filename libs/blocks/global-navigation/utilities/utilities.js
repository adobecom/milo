/* eslint import/no-relative-packages: 0 */
import {
  getConfig, getMetadata, loadStyle, loadLana, decorateLinks, localizeLink,
} from '../../../utils/utils.js';
import { getFederatedContentRoot, getFederatedUrl, getFedsPlaceholderConfig } from '../../../utils/federated.js';
import { processTrackingLabels } from '../../../martech/attributes.js';
import { replaceText } from '../../../features/placeholders.js';

loadLana();

const FEDERAL_PATH_KEY = 'federal';

export const selectors = {
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
  gnavPromo: '.gnav-promo',
  columnBreak: '.column-break',
  brandImageOnly: '.brand-image-only',
};

export const icons = {
  brand: '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" id="Layer_1" viewBox="0 0 64.57 35"><defs><style>.cls-1{fill: #eb1000;}</style></defs><path class="cls-1" d="M6.27,10.22h4.39l6.2,14.94h-4.64l-3.92-9.92-2.59,6.51h3.08l1.23,3.41H0l6.27-14.94ZM22.03,13.32c.45,0,.94.04,1.43.16v-3.7h3.88v14.72c-.89.4-2.81.89-4.73.89-3.48,0-6.47-1.98-6.47-5.93s2.88-6.13,5.89-6.13ZM22.52,22.19c.36,0,.65-.07.94-.16v-5.42c-.29-.11-.58-.16-.96-.16-1.27,0-2.45.94-2.45,2.92s1.2,2.81,2.47,2.81ZM34.25,13.32c3.23,0,5.98,2.18,5.98,6.02s-2.74,6.02-5.98,6.02-6-2.18-6-6.02,2.72-6.02,6-6.02ZM34.25,22.13c1.11,0,2.14-.89,2.14-2.79s-1.03-2.79-2.14-2.79-2.12.89-2.12,2.79.96,2.79,2.12,2.79ZM41.16,9.78h3.9v3.7c.47-.09.96-.16,1.45-.16,3.03,0,5.84,1.98,5.84,5.86,0,4.1-2.99,6.18-6.53,6.18-1.52,0-3.46-.31-4.66-.87v-14.72ZM45.91,22.17c1.34,0,2.56-.96,2.56-2.94,0-1.85-1.2-2.72-2.5-2.72-.36,0-.65.04-.91.16v5.35c.22.09.51.16.85.16ZM58.97,13.32c2.92,0,5.6,1.87,5.6,5.64,0,.51-.02,1-.09,1.49h-7.27c.4,1.32,1.56,1.94,3.01,1.94,1.18,0,2.27-.29,3.5-.82v2.97c-1.14.58-2.5.82-3.9.82-3.7,0-6.58-2.23-6.58-6.02s2.61-6.02,5.73-6.02ZM60.93,18.02c-.2-1.27-1.05-1.78-1.92-1.78s-1.58.54-1.87,1.78h3.79Z"/></svg>',
  company: '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 133.5 118.1"><defs><style>.cls-1 {fill: #eb1000;}</style></defs><g><g><polygon class="cls-1" points="84.1 0 133.5 0 133.5 118.1 84.1 0"/><polygon class="cls-1" points="49.4 0 0 0 0 118.1 49.4 0"/><polygon class="cls-1" points="66.7 43.5 98.2 118.1 77.6 118.1 68.2 94.4 45.2 94.4 66.7 43.5"/></g></g></svg>',
  search: '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" focusable="false"><path d="M14 2A8 8 0 0 0 7.4 14.5L2.4 19.4a1.5 1.5 0 0 0 2.1 2.1L9.5 16.6A8 8 0 1 0 14 2Zm0 14.1A6.1 6.1 0 1 1 20.1 10 6.1 6.1 0 0 1 14 16.1Z"></path></svg>',
  home: '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" height="25" viewBox="0 0 18 18" width="25"><path fill="#6E6E6E" d="M17.666,10.125,9.375,1.834a.53151.53151,0,0,0-.75,0L.334,10.125a.53051.53051,0,0,0,0,.75l.979.9785A.5.5,0,0,0,1.6665,12H2v4.5a.5.5,0,0,0,.5.5h4a.5.5,0,0,0,.5-.5v-5a.5.5,0,0,1,.5-.5h3a.5.5,0,0,1,.5.5v5a.5.5,0,0,0,.5.5h4a.5.5,0,0,0,.5-.5V12h.3335a.5.5,0,0,0,.3535-.1465l.979-.9785A.53051.53051,0,0,0,17.666,10.125Z"/></svg>',
};

export const darkIcons = {
  ...icons,
  brand: '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" id="Layer_1" viewBox="0 0 64.57 35"><defs><style>.cls-1{fill: #fff;}</style></defs><path class="cls-1" d="M6.27,10.22h4.39l6.2,14.94h-4.64l-3.92-9.92-2.59,6.51h3.08l1.23,3.41H0l6.27-14.94ZM22.03,13.32c.45,0,.94.04,1.43.16v-3.7h3.88v14.72c-.89.4-2.81.89-4.73.89-3.48,0-6.47-1.98-6.47-5.93s2.88-6.13,5.89-6.13h0ZM22.52,22.19c.36,0,.65-.07.94-.16v-5.42c-.29-.11-.58-.16-.96-.16-1.27,0-2.45.94-2.45,2.92s1.2,2.81,2.47,2.81h0ZM34.25,13.32c3.23,0,5.98,2.18,5.98,6.02s-2.74,6.02-5.98,6.02-6-2.18-6-6.02,2.72-6.02,6-6.02ZM34.25,22.13c1.11,0,2.14-.89,2.14-2.79s-1.03-2.79-2.14-2.79-2.12.89-2.12,2.79.96,2.79,2.12,2.79ZM41.16,9.78h3.9v3.7c.47-.09.96-.16,1.45-.16,3.03,0,5.84,1.98,5.84,5.86,0,4.1-2.99,6.18-6.53,6.18-1.52,0-3.46-.31-4.66-.87v-14.72h0ZM45.91,22.17c1.34,0,2.56-.96,2.56-2.94,0-1.85-1.2-2.72-2.5-2.72-.36,0-.65.04-.91.16v5.35c.22.09.51.16.85.16h0ZM58.97,13.32c2.92,0,5.6,1.87,5.6,5.64,0,.51-.02,1-.09,1.49h-7.27c.4,1.32,1.56,1.94,3.01,1.94,1.18,0,2.27-.29,3.5-.82v2.97c-1.14.58-2.5.82-3.9.82-3.7,0-6.58-2.23-6.58-6.02s2.61-6.02,5.73-6.02ZM60.93,18.02c-.2-1.27-1.05-1.78-1.92-1.78s-1.58.54-1.87,1.78c0,0,3.79,0,3.79,0Z"/></svg>',
  company: '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 133.5 118.1"><defs><style>.cls-1 {fill: currentColor;}</style></defs><g><g><polygon class="cls-1" points="84.1 0 133.5 0 133.5 118.1 84.1 0"/><polygon class="cls-1" points="49.4 0 0 0 0 118.1 49.4 0"/><polygon class="cls-1" points="66.7 43.5 98.2 118.1 77.6 118.1 68.2 94.4 45.2 94.4 66.7 43.5"/></g></g></svg>',
};

export const lanaLog = ({ message, e = '', tags = 'errorType=default' }) => {
  const url = getMetadata('gnav-source');
  window.lana.log(`${message} | gnav-source: ${url} | href: ${window.location.href} | ${e.reason || e.error || e.message || e}`, {
    clientId: 'feds-milo',
    sampleRate: 1,
    tags,
  });
};

export const logErrorFor = async (fn, message, tags) => {
  try {
    await fn();
  } catch (e) {
    lanaLog({ message, e, tags });
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

export function getAnalyticsValue(str, index) {
  if (typeof str !== 'string' || !str.length) return str;

  let analyticsValue = processTrackingLabels(str, getConfig(), 30);
  analyticsValue = typeof index === 'number' ? `${analyticsValue}-${index}` : analyticsValue;

  return analyticsValue;
}

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
  const url = `${miloLibs || codeRoot}/blocks/global-navigation/${path}`;
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
        tags: 'errorType=info,module=utilities',
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

export function decorateCta({ elem, type = 'primaryCta', index } = {}) {
  const modifier = type === 'secondaryCta' ? 'secondary' : 'primary';

  const clone = elem.cloneNode(true);
  clone.className = `feds-cta feds-cta--${modifier}`;
  clone.setAttribute('daa-ll', getAnalyticsValue(clone.textContent, index));

  return toFragment`
    <div class="feds-cta-wrapper">
      ${clone}
    </div>`;
}

let curtainElem;
export function setCurtainState(state) {
  if (typeof state !== 'boolean') return;

  curtainElem = curtainElem || document.querySelector(selectors.curtain);
  if (curtainElem) curtainElem.classList.toggle('feds-curtain--open', state);
}

export const isDesktop = window.matchMedia('(min-width: 900px)');
export const isTangentToViewport = window.matchMedia('(min-width: 900px) and (max-width: 1440px)');

export function setActiveDropdown(elem) {
  const activeClass = selectors.activeDropdown.replace('.', '');

  // We always need to reset all active dropdowns at first
  const resetActiveDropdown = () => {
    [...document.querySelectorAll(selectors.activeDropdown)]
      .forEach((activeDropdown) => activeDropdown.classList.remove(activeClass));
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
}

// Disable AED(Active Element Detection)
export const [setDisableAEDState, getDisableAEDState] = (() => {
  let disableAED = false;
  return [
    () => { disableAED = true; },
    () => disableAED,
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

export function closeAllDropdowns({ type } = {}) {
  const selector = type === 'headline'
    ? '.feds-menu-headline[aria-expanded="true"]'
    : `${selectors.globalNav} [aria-expanded='true']`;
  const openElements = document.querySelectorAll(selector);
  if (!openElements) return;
  [...openElements].forEach((el) => {
    if ('fedsPreventautoclose' in el.dataset) return;
    el.setAttribute('aria-expanded', 'false');
  });

  setActiveDropdown();

  if (isDesktop.matches) setCurtainState(false);
}

export function trigger({ element, event, type } = {}) {
  if (event) event.preventDefault();
  const isOpen = element?.getAttribute('aria-expanded') === 'true';
  closeAllDropdowns({ type });
  if (isOpen) return false;
  element.setAttribute('aria-expanded', 'true');
  return true;
}

export const yieldToMain = () => new Promise((resolve) => { setTimeout(resolve, 0); });

export async function fetchAndProcessPlainHtml({ url, shouldDecorateLinks = true } = {}) {
  let path = getFederatedUrl(url);
  const mepGnav = getConfig()?.mep?.inBlock?.['global-navigation'];
  const mepFragment = mepGnav?.fragments?.[path];
  if (mepFragment && mepFragment.action === 'replace') {
    path = mepFragment.content;
  }
  const res = await fetch(path.replace(/(\.html$|$)/, '.plain.html'));
  if (res.status !== 200) {
    lanaLog({
      message: 'Error in fetchAndProcessPlainHtml',
      e: `${res.statusText} url: ${res.url}`,
      tags: 'errorType=info,module=utilities',
    });
    return null;
  }
  const text = await res.text();
  const { body } = new DOMParser().parseFromString(text, 'text/html');
  if (mepFragment?.manifestId) body.dataset.manifestId = mepFragment.manifestId;
  if (mepFragment?.targetManifestId) body.dataset.adobeTargetTestid = mepFragment.targetManifestId;
  const commands = mepGnav?.commands;
  if (commands?.length) {
    /* c8 ignore next 3 */
    const { handleCommands } = await import('../../../features/personalization/personalization.js');
    handleCommands(commands, body, true, true);
  }
  const inlineFrags = [...body.querySelectorAll('a[href*="#_inline"]')];
  if (inlineFrags.length) {
    const { default: loadInlineFrags } = await import('../../fragment/fragment.js');
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
    import('../../martech-metadata/martech-metadata.js')
      .then(({ default: decorate }) => blocks.forEach((block) => decorate(block)))
      .catch((e) => {
        lanaLog({
          message: 'Error in fetchAndProcessPlainHtml',
          e,
          tags: 'errorType=info,module=utilities',
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
