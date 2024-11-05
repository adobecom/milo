import {
  replaceText
} from "./chunk-JSQDM4GY.js";
import {
  processTrackingLabels
} from "./chunk-JW7KOVAP.js";
import {
  getFederatedContentRoot,
  getFederatedUrl
} from "./chunk-R5PLKX3Z.js";
import {
  decorateLinks,
  getConfig,
  getMetadata,
  loadLana,
  loadStyle,
  localizeLink
} from "./chunk-G4SXHKM5.js";

// ../blocks/global-navigation/utilities/utilities.js
loadLana();
var FEDERAL_PATH_KEY = "federal";
var selectors = {
  globalNav: ".global-navigation",
  curtain: ".feds-curtain",
  navLink: ".feds-navLink",
  overflowingTopNav: ".feds-topnav--overflowing",
  navItem: ".feds-navItem",
  activeNavItem: ".feds-navItem--active",
  deferredActiveNavItem: ".feds-navItem--activeDeferred",
  activeDropdown: ".feds-dropdown--active",
  menuSection: ".feds-menu-section",
  menuColumn: ".feds-menu-column",
  gnavPromo: ".gnav-promo",
  columnBreak: ".column-break"
};
var icons = {
  company: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 133.5 118.1"><defs><style>.cls-1 {fill: #eb1000;}</style></defs><g><g><polygon class="cls-1" points="84.1 0 133.5 0 133.5 118.1 84.1 0"/><polygon class="cls-1" points="49.4 0 0 0 0 118.1 49.4 0"/><polygon class="cls-1" points="66.7 43.5 98.2 118.1 77.6 118.1 68.2 94.4 45.2 94.4 66.7 43.5"/></g></g></svg>',
  search: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" focusable="false"><path d="M14 2A8 8 0 0 0 7.4 14.5L2.4 19.4a1.5 1.5 0 0 0 2.1 2.1L9.5 16.6A8 8 0 1 0 14 2Zm0 14.1A6.1 6.1 0 1 1 20.1 10 6.1 6.1 0 0 1 14 16.1Z"></path></svg>',
  home: '<svg xmlns="http://www.w3.org/2000/svg" height="25" viewBox="0 0 18 18" width="25"><path fill="#6E6E6E" d="M17.666,10.125,9.375,1.834a.53151.53151,0,0,0-.75,0L.334,10.125a.53051.53051,0,0,0,0,.75l.979.9785A.5.5,0,0,0,1.6665,12H2v4.5a.5.5,0,0,0,.5.5h4a.5.5,0,0,0,.5-.5v-5a.5.5,0,0,1,.5-.5h3a.5.5,0,0,1,.5.5v5a.5.5,0,0,0,.5.5h4a.5.5,0,0,0,.5-.5V12h.3335a.5.5,0,0,0,.3535-.1465l.979-.9785A.53051.53051,0,0,0,17.666,10.125Z"/></svg>'
};
var darkIcons = {
  ...icons,
  company: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 133.5 118.1"><defs><style>.cls-1 {fill: currentColor;}</style></defs><g><g><polygon class="cls-1" points="84.1 0 133.5 0 133.5 118.1 84.1 0"/><polygon class="cls-1" points="49.4 0 0 0 0 118.1 49.4 0"/><polygon class="cls-1" points="66.7 43.5 98.2 118.1 77.6 118.1 68.2 94.4 45.2 94.4 66.7 43.5"/></g></g></svg>'
};
var lanaLog = ({ message, e = "", tags = "errorType=default" }) => {
  const url = getMetadata("gnav-source");
  window.lana.log(`${message} | gnav-source: ${url} | href: ${window.location.href} | ${e.reason || e.error || e.message || e}`, {
    clientId: "feds-milo",
    sampleRate: 1,
    tags
  });
};
var logErrorFor = async (fn, message, tags) => {
  try {
    await fn();
  } catch (e) {
    lanaLog({ message, e, tags });
  }
};
function addMepHighlightAndTargetId(el, source) {
  let { manifestId, targetManifestId } = source.dataset;
  manifestId ??= source?.closest("[data-manifest-id]")?.dataset?.manifestId;
  targetManifestId ??= source?.closest("[data-adobe-target-testid]")?.dataset?.adobeTargetTestid;
  if (manifestId) el.dataset.manifestId = manifestId;
  if (targetManifestId) el.dataset.adobeTargetTestid = targetManifestId;
  return el;
}
function toFragment(htmlStrings, ...values) {
  const templateStr = htmlStrings.reduce((acc, htmlString, index) => {
    if (values[index] instanceof HTMLElement) {
      return `${acc + htmlString}<elem ref="${index}"></elem>`;
    }
    return acc + htmlString + (values[index] || "");
  }, "");
  const fragment = document.createRange().createContextualFragment(templateStr).children[0];
  Array.prototype.map.call(fragment.querySelectorAll("elem"), (replaceable) => {
    const ref = replaceable.getAttribute("ref");
    replaceable.replaceWith(values[ref]);
  });
  return fragment;
}
var getPath = (urlOrPath = "") => {
  try {
    const url = new URL(urlOrPath);
    return url.pathname;
  } catch (error) {
    return urlOrPath.replace(/^\.\//, "/");
  }
};
var federatePictureSources = ({ section, forceFederate } = {}) => {
  const selector = forceFederate ? "[src], [srcset]" : `[src*="/${FEDERAL_PATH_KEY}/"], [srcset*="/${FEDERAL_PATH_KEY}/"]`;
  section?.querySelectorAll(selector).forEach((source) => {
    const type = source.hasAttribute("src") ? "src" : "srcset";
    const path = getPath(source.getAttribute(type));
    const [, localeOrKeySegment, keyOrPathSegment] = path.split("/");
    if (forceFederate || [localeOrKeySegment, keyOrPathSegment].includes(FEDERAL_PATH_KEY)) {
      const federalPrefix = path.includes("/federal/") ? "" : "/federal";
      source.setAttribute(type, `${getFederatedContentRoot()}${federalPrefix}${path}`);
    }
  });
};
var fedsPlaceholderConfig;
var getFedsPlaceholderConfig = ({ useCache = true } = {}) => {
  if (useCache && fedsPlaceholderConfig) return fedsPlaceholderConfig;
  const { locale, placeholders } = getConfig();
  const libOrigin = getFederatedContentRoot();
  fedsPlaceholderConfig = {
    locale: {
      ...locale,
      contentRoot: `${libOrigin}${locale.prefix}/federal/globalnav`
    },
    placeholders
  };
  return fedsPlaceholderConfig;
};
function getAnalyticsValue(str, index) {
  if (typeof str !== "string" || !str.length) return str;
  let analyticsValue = processTrackingLabels(str, getConfig(), 30);
  analyticsValue = typeof index === "number" ? `${analyticsValue}-${index}` : analyticsValue;
  return analyticsValue;
}
function getExperienceName() {
  const experiencePath = getMetadata("gnav-source");
  const explicitExperience = experiencePath?.split("#")[0]?.split("/").pop();
  if (explicitExperience?.length && explicitExperience !== "gnav") return explicitExperience;
  const { imsClientId } = getConfig();
  if (imsClientId?.length) return imsClientId;
  return "";
}
function rootPath(path) {
  const { miloLibs, codeRoot } = getConfig();
  const url = `${miloLibs || codeRoot}/blocks/global-navigation/${path}`;
  return url;
}
function loadStyles(url, override = false) {
  const { standaloneGnav } = getConfig();
  if (standaloneGnav && !override) return;
  loadStyle(url, (e) => {
    if (e === "error") {
      lanaLog({
        message: "GNAV: Error in loadStyles",
        e: `error loading style: ${url}`,
        tags: "errorType=info,module=utilities"
      });
    }
  });
}
function isDarkMode() {
  const { theme } = getConfig();
  return theme === "dark";
}
async function loadBaseStyles() {
  const { standaloneGnav } = getConfig();
  if (standaloneGnav) return;
  if (isDarkMode()) {
    new Promise((resolve) => {
      loadStyle(rootPath("base.css"), resolve);
    }).then(() => loadStyles(rootPath("dark-nav.css")));
  } else {
    const url = rootPath("base.css");
    await loadStyles(url);
  }
}
var cachedDecorateMenu;
async function loadDecorateMenu() {
  if (cachedDecorateMenu) return cachedDecorateMenu;
  let resolve;
  cachedDecorateMenu = new Promise((_resolve) => {
    resolve = _resolve;
  });
  const [menu] = await Promise.all([
    import("./menu-I3HG374I.js"),
    loadStyles(rootPath("utilities/menu/menu.css"))
  ]);
  resolve(menu.default);
  return cachedDecorateMenu;
}
function decorateCta({ elem, type = "primaryCta", index } = {}) {
  const modifier = type === "secondaryCta" ? "secondary" : "primary";
  const clone = elem.cloneNode(true);
  clone.className = `feds-cta feds-cta--${modifier}`;
  clone.setAttribute("daa-ll", getAnalyticsValue(clone.textContent, index));
  return toFragment`
    <div class="feds-cta-wrapper">
      ${clone}
    </div>`;
}
var curtainElem;
function setCurtainState(state) {
  if (typeof state !== "boolean") return;
  curtainElem = curtainElem || document.querySelector(selectors.curtain);
  if (curtainElem) curtainElem.classList.toggle("feds-curtain--open", state);
}
var isDesktop = window.matchMedia("(min-width: 900px)");
var isTangentToViewport = window.matchMedia("(min-width: 900px) and (max-width: 1440px)");
function setActiveDropdown(elem) {
  const activeClass = selectors.activeDropdown.replace(".", "");
  const resetActiveDropdown = () => {
    [...document.querySelectorAll(selectors.activeDropdown)].forEach((activeDropdown) => activeDropdown.classList.remove(activeClass));
  };
  resetActiveDropdown();
  if (!(elem instanceof HTMLElement)) return;
  const selectorArr = [selectors.menuSection, selectors.menuColumn, selectors.navItem];
  selectorArr.some((selector) => {
    const closestSection = elem.closest(selector);
    if (closestSection && closestSection.querySelector('[aria-expanded = "true"]')) {
      closestSection.classList.add(activeClass);
      return true;
    }
    return false;
  });
}
var [setDisableAEDState, getDisableAEDState] = /* @__PURE__ */ (() => {
  let disableAED = false;
  return [
    () => {
      disableAED = true;
    },
    () => disableAED
  ];
})();
var [hasActiveLink, setActiveLink, isActiveLink, getActiveLink] = (() => {
  let activeLinkFound;
  const { origin, pathname } = window.location;
  const url = `${origin}${pathname}`;
  return [
    () => activeLinkFound,
    (val) => {
      activeLinkFound = !!val;
    },
    (el) => el.href === url || el.href.startsWith(`${url}?`) || el.href.startsWith(`${url}#`),
    (area) => {
      const isCustomLinks = area.closest(".link-group")?.classList.contains("mobile-only");
      const disableAED = getDisableAEDState() || isCustomLinks;
      if (disableAED || hasActiveLink() || !(area instanceof HTMLElement)) return null;
      const activeLink = [
        ...area.querySelectorAll("a:not([data-modal-hash])")
      ].find(isActiveLink);
      if (!activeLink) return null;
      setActiveLink(true);
      return activeLink;
    }
  ];
})();
function closeAllDropdowns({ type } = {}) {
  const selector = type === "headline" ? '.feds-menu-headline[aria-expanded="true"]' : `${selectors.globalNav} [aria-expanded='true']`;
  const openElements = document.querySelectorAll(selector);
  if (!openElements) return;
  [...openElements].forEach((el) => {
    if ("fedsPreventautoclose" in el.dataset) return;
    el.setAttribute("aria-expanded", "false");
  });
  setActiveDropdown();
  if (isDesktop.matches) setCurtainState(false);
}
function trigger({ element, event, type } = {}) {
  if (event) event.preventDefault();
  const isOpen = element?.getAttribute("aria-expanded") === "true";
  closeAllDropdowns({ type });
  if (isOpen) return false;
  element.setAttribute("aria-expanded", "true");
  return true;
}
var yieldToMain = () => new Promise((resolve) => {
  setTimeout(resolve, 0);
});
async function fetchAndProcessPlainHtml({ url, shouldDecorateLinks = true } = {}) {
  let path = getFederatedUrl(url);
  const mepGnav = getConfig()?.mep?.inBlock?.["global-navigation"];
  const mepFragment = mepGnav?.fragments?.[path];
  if (mepFragment && mepFragment.action === "replace") {
    path = mepFragment.content;
  }
  const res = await fetch(path.replace(/(\.html$|$)/, ".plain.html"));
  if (res.status !== 200) {
    lanaLog({
      message: "Error in fetchAndProcessPlainHtml",
      e: `${res.statusText} url: ${res.url}`,
      tags: "errorType=info,module=utilities"
    });
    return null;
  }
  const text = await res.text();
  const { body } = new DOMParser().parseFromString(text, "text/html");
  if (mepFragment?.manifestId) body.dataset.manifestId = mepFragment.manifestId;
  if (mepFragment?.targetManifestId) body.dataset.adobeTargetTestid = mepFragment.targetManifestId;
  const commands = mepGnav?.commands;
  if (commands?.length) {
    const { handleCommands } = await import("./personalization-ON6N7TPG.js");
    handleCommands(commands, body, true, true);
  }
  const inlineFrags = [...body.querySelectorAll('a[href*="#_inline"]')];
  if (inlineFrags.length) {
    const { default: loadInlineFrags } = await import("./fragment-UV2Y4BOL.js");
    const fragPromises = inlineFrags.map((link) => {
      link.href = getFederatedUrl(localizeLink(link.href));
      return loadInlineFrags(link);
    });
    await Promise.all(fragPromises);
  }
  if (shouldDecorateLinks) {
    decorateLinks(body);
    federatePictureSources({ section: body, forceFederate: path.includes("/federal/") });
  }
  const blocks = body.querySelectorAll(".martech-metadata");
  if (blocks.length) {
    import("./martech-metadata-6ZESHJKI.js").then(({ default: decorate }) => blocks.forEach((block) => decorate(block))).catch((e) => {
      lanaLog({
        message: "Error in fetchAndProcessPlainHtml",
        e,
        tags: "errorType=info,module=utilities"
      });
    });
  }
  body.innerHTML = await replaceText(body.innerHTML, getFedsPlaceholderConfig());
  return body;
}
var [setUserProfile, getUserProfile] = (() => {
  let profileData;
  let profileResolve;
  let profileTimeout;
  const profilePromise = new Promise((resolve) => {
    profileResolve = resolve;
    profileTimeout = setTimeout(() => {
      profileData = {};
      resolve(profileData);
    }, 5e3);
  });
  return [
    (data) => {
      if (data && !profileData) {
        profileData = data;
        clearTimeout(profileTimeout);
        profileResolve(profileData);
      }
    },
    () => profilePromise
  ];
})();

export {
  selectors,
  icons,
  darkIcons,
  lanaLog,
  logErrorFor,
  addMepHighlightAndTargetId,
  toFragment,
  federatePictureSources,
  getFedsPlaceholderConfig,
  getAnalyticsValue,
  getExperienceName,
  rootPath,
  loadStyles,
  isDarkMode,
  loadBaseStyles,
  loadDecorateMenu,
  decorateCta,
  setCurtainState,
  isDesktop,
  isTangentToViewport,
  setActiveDropdown,
  setDisableAEDState,
  getDisableAEDState,
  hasActiveLink,
  setActiveLink,
  isActiveLink,
  getActiveLink,
  closeAllDropdowns,
  trigger,
  yieldToMain,
  fetchAndProcessPlainHtml,
  setUserProfile,
  getUserProfile
};
//# sourceMappingURL=chunk-SEUC37NT.js.map
