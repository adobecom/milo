import {
  closeAllDropdowns,
  lanaLog,
  logErrorFor,
  selectors,
  setActiveDropdown,
  trigger
} from "./chunk-I4EBDGNP.js";
import "./chunk-Z64B4EXQ.js";
import "./chunk-LHF7GOQG.js";
import "./chunk-EI44K5W3.js";
import "./chunk-ZEVYWJU7.js";
import "./chunk-NE6SFPCS.js";

// ../blocks/global-navigation/utilities/keyboard/utils.js
var selectors2 = {
  ...selectors,
  globalFooter: ".global-footer",
  mainNavItems: ".feds-navItem > a, .feds-navItem > button, .feds-navItem > .feds-cta-wrapper > .feds-cta",
  brand: ".feds-brand",
  mainNavToggle: ".feds-toggle",
  searchTrigger: ".feds-search-trigger",
  searchField: ".feds-search-input",
  signIn: ".feds-signIn",
  signInDropdown: ".feds-signIn-dropdown",
  profileButton: ".feds-profile-button, .feds-signIn",
  logo: ".feds-logo",
  profileMenu: ".feds-profile-menu",
  profile: ".feds-profile",
  breadCrumbItems: ".feds-breadcrumbs li > a",
  expandedPopupTrigger: '.feds-navLink[aria-expanded = "true"]',
  promoLink: ".feds-promo-link",
  imagePromo: "a.feds-promo-image",
  fedsNav: ".feds-nav",
  popup: ".feds-popup",
  headline: ".feds-menu-headline",
  section: ".feds-menu-section",
  column: ".feds-menu-column:not(.feds-menu-column--group)",
  cta: ".feds-cta",
  openSearch: '.feds-search-trigger[aria-expanded = "true"]',
  regionPicker: ".feds-regionPicker",
  socialLink: ".feds-social-link",
  privacyLink: ".feds-footer-privacyLink",
  menuContent: ".feds-menu-content"
};
selectors2.profileDropdown = `
  ${selectors2.signInDropdown} a[href],
  ${selectors2.signInDropdown} button:not([disabled]),
  ${selectors2.profileMenu} a[href],
  ${selectors2.profileMenu} button:not([disabled])
`;
selectors2.popupItems = `
  ${selectors2.navLink},
  ${selectors2.promoLink},
  ${selectors2.imagePromo},
  ${selectors2.cta},
  ${selectors2.regionPicker},
  ${selectors2.socialLink},
  ${selectors2.privacyLink}
`;
var isElementVisible = (elem) => !!(elem && elem instanceof HTMLElement && (elem.offsetWidth && elem.offsetHeight) && window.getComputedStyle(elem).getPropertyValue("visibility") !== "hidden");
var getNextVisibleItemPosition = (position, items) => {
  for (let newPosition = position + 1; newPosition < items.length; newPosition += 1) {
    if (isElementVisible(items[newPosition])) return newPosition;
  }
  return -1;
};
var getPreviousVisibleItemPosition = (position, items) => {
  for (let newPosition = position - 1; newPosition >= 0; newPosition -= 1) {
    if (isElementVisible(items[newPosition])) return newPosition;
  }
  return -1;
};
var getOpenPopup = () => document.querySelector(selectors2.expandedPopupTrigger)?.parentElement.querySelector(selectors2.popup);

// ../blocks/global-navigation/utilities/keyboard/popup.js
var getState = ({ e, element } = {}) => {
  if (!element) return {};
  const popupItems = [...element.querySelectorAll(selectors2.popupItems)];
  const curr = popupItems.findIndex((el) => el === e.target);
  const column = document.activeElement.closest(selectors2.column);
  const visibleColumns = [...element.querySelectorAll(selectors2.column)];
  const currentColumn = visibleColumns.findIndex((node) => node.isEqualNode(column));
  return {
    popupItems,
    curr,
    prev: getPreviousVisibleItemPosition(curr, popupItems),
    next: getNextVisibleItemPosition(curr, popupItems),
    prevColumn: visibleColumns[currentColumn - 1],
    nextColumn: visibleColumns[currentColumn + 1]
  };
};
var Popup = class {
  constructor({ mainNav }) {
    this.mainNav = mainNav;
    this.addEventListeners();
    this.desktop = window.matchMedia("(min-width: 900px)");
  }
  open({ focus } = {}) {
    const popupItems = [...getOpenPopup()?.querySelectorAll(selectors2.popupItems) || []];
    if (!popupItems.length) return;
    const first = getNextVisibleItemPosition(-1, popupItems);
    const last = getPreviousVisibleItemPosition(popupItems.length, popupItems);
    if (focus === "first") popupItems[first].focus();
    if (focus === "last") popupItems[last].focus();
  }
  focusMainNav = (isFooter) => {
    if (isFooter) return;
    this.mainNav.focusCurr();
  };
  focusMainNavNext = (isFooter) => {
    if (isFooter) return;
    const { next } = this.mainNav.getState();
    if (next >= 0) {
      this.mainNav.focusNext();
      this.mainNav.open();
      return;
    }
    closeAllDropdowns();
    this.mainNav.focusCurr();
  };
  handleKeyDown = ({ e, element, isFooter }) => {
    const { popupItems, prev, next, prevColumn, nextColumn } = getState({ e, element });
    const shiftTabOutOfFooter = isFooter && e.code === "Tab" && e.shiftKey && prev === -1;
    const tabOutOfFooter = isFooter && e.code === "Tab" && !e.shiftKey && next === -1;
    if (tabOutOfFooter || shiftTabOutOfFooter) return;
    e.preventDefault();
    e.stopPropagation();
    switch (e.code) {
      case "Tab": {
        if (e.shiftKey) {
          if (prev === -1) {
            this.focusMainNav(isFooter);
            break;
          }
          popupItems[prev].focus();
        } else {
          if (next === -1) {
            this.focusMainNavNext(isFooter);
            break;
          }
          popupItems[next].focus();
        }
        break;
      }
      case "Escape": {
        closeAllDropdowns();
        this.focusMainNav(isFooter);
        break;
      }
      case "ArrowLeft": {
        const noPrev = document.dir !== "rtl" && !prevColumn?.querySelector(selectors2.popupItems);
        const noNext = document.dir === "rtl" && !nextColumn?.querySelector(selectors2.popupItems);
        if (noPrev || noNext) {
          this.focusMainNav(isFooter);
          break;
        }
        if (document.dir !== "rtl") {
          prevColumn.querySelector(selectors2.popupItems).focus();
        } else {
          nextColumn.querySelector(selectors2.popupItems).focus();
        }
        break;
      }
      case "ArrowUp": {
        if (prev === -1) {
          this.focusMainNav(isFooter);
          break;
        }
        popupItems[prev].focus();
        break;
      }
      case "ArrowRight": {
        const noNext = document.dir !== "rtl" && !nextColumn?.querySelector(selectors2.popupItems);
        const noPrev = document.dir === "rtl" && !prevColumn?.querySelector(selectors2.popupItems);
        if (noNext || noPrev) {
          this.focusMainNav(isFooter);
          break;
        }
        if (document.dir !== "rtl") {
          nextColumn.querySelector(selectors2.popupItems).focus();
        } else {
          prevColumn.querySelector(selectors2.popupItems).focus();
        }
        break;
      }
      case "ArrowDown": {
        if (next === -1) {
          this.focusMainNavNext(isFooter);
          break;
        }
        popupItems[next].focus();
        break;
      }
      default:
        break;
    }
  };
  addEventListeners = () => {
    document.querySelector(selectors2.globalNav)?.addEventListener("keydown", (e) => logErrorFor(() => {
      const element = getOpenPopup();
      if (!e.target.closest(selectors2.popup) || !element || !this.desktop.matches) return;
      this.handleKeyDown({ e, element, isFooter: false });
    }, `popup key failed ${e.code}`, "errorType=error,module=gnav-keyboard"));
    document.querySelector(selectors2.globalFooter)?.addEventListener("keydown", (e) => logErrorFor(() => {
      if (!this.desktop.matches) return;
      const element = e.target.closest(selectors2.globalFooter);
      this.handleKeyDown({ e, element, isFooter: true });
    }, `footer key failed ${e.code}`, "errorType=error,module=gnav-keyboard"));
  };
};
var popup_default = Popup;

// ../blocks/global-navigation/utilities/keyboard/mobilePopup.js
var closeHeadlines = () => {
  const open = [...document.querySelectorAll(`${selectors2.headline}[aria-expanded="true"]`)];
  open.forEach((el) => el.setAttribute("aria-expanded", "false"));
  setActiveDropdown(open[0]);
};
var openHeadline = ({ headline, focus } = {}) => {
  closeHeadlines();
  if (headline.getAttribute("aria-haspopup") === "true") {
    headline.setAttribute("aria-expanded", "true");
    setActiveDropdown(headline);
    const section = headline.closest(selectors2.section) || headline.closest(selectors2.column);
    const items = [...section.querySelectorAll(selectors2.popupItems)].filter((el) => isElementVisible(el));
    if (focus === "first") items[0].focus();
    if (focus === "last") items[items.length - 1].focus();
  }
};
var getState2 = (element = getOpenPopup()) => {
  if (!element) return { popupItems: [] };
  const popupItems = [...element.querySelectorAll(selectors2.popupItems)];
  const section = document.activeElement.closest(selectors2.section) || document.activeElement.closest(selectors2.column);
  let allSections = [...element.querySelectorAll(selectors2.section)];
  if (!allSections.length) allSections = [...element.querySelectorAll(selectors2.column)];
  const visibleSections = allSections.filter((el) => isElementVisible(el));
  const currentSection = visibleSections.findIndex((node) => node.isEqualNode(section));
  const firstHeadline = visibleSections[0]?.querySelector(selectors2.headline);
  const lastHeadline = visibleSections[visibleSections.length - 1]?.querySelector(selectors2.headline);
  const prevHeadline = visibleSections[currentSection - 1]?.querySelector(selectors2.headline);
  const nextHeadline = visibleSections[currentSection + 1]?.querySelector(selectors2.headline);
  return {
    visibleSections,
    currentSection,
    firstHeadline,
    lastHeadline,
    prevHeadline,
    nextHeadline,
    popupItems
  };
};
var Popup2 = class {
  constructor({ mainNav }) {
    this.mainNav = mainNav;
    this.addEventListeners();
    this.desktop = window.matchMedia("(min-width: 900px)");
  }
  open({ focus } = {}) {
    const { firstHeadline, lastHeadline, popupItems } = getState2();
    if (!popupItems.length) return;
    const headline = focus === "last" ? lastHeadline : firstHeadline;
    if (headline && headline.getAttribute("aria-haspopup") === "true") {
      closeHeadlines();
      headline.setAttribute("aria-expanded", "true");
    }
    const first = getNextVisibleItemPosition(-1, popupItems);
    const last = getPreviousVisibleItemPosition(popupItems.length, popupItems);
    if (focus === "first") popupItems[first].focus();
    if (focus === "last") popupItems[last].focus();
    setActiveDropdown(focus === "first" ? popupItems[first] : popupItems[last]);
  }
  mobileArrowUp = ({ prev, curr, element, isFooter }) => {
    if (prev !== -1 && curr - 1 === prev) {
      const { currentSection, popupItems } = getState2(element);
      popupItems[prev].focus();
      if (currentSection !== getState2(element).currentSection) closeHeadlines();
      return;
    }
    const { prevHeadline } = getState2(element);
    if (!prevHeadline) {
      this.focusMainNav(isFooter);
      return;
    }
    openHeadline({ headline: prevHeadline, focus: "last" });
  };
  mobileArrowDown = ({ next, element, isFooter }) => {
    if (next !== -1) {
      const { currentSection, popupItems } = getState2(element);
      popupItems[next].focus();
      if (currentSection !== getState2(element).currentSection) closeHeadlines();
      return;
    }
    const { nextHeadline } = getState2(element);
    if (!nextHeadline) {
      closeHeadlines();
      this.focusMainNavNext(isFooter);
      return;
    }
    openHeadline({ headline: nextHeadline, focus: "first" });
  };
  focusMainNav = (isFooter) => {
    if (isFooter) return;
    this.mainNav.focusCurr();
  };
  focusMainNavNext = (isFooter) => {
    if (isFooter) return;
    this.mainNav.focusNext();
    this.mainNav.open();
  };
  handleKeyDown = ({ e, element, isFooter }) => {
    const popupItems = [...element.querySelectorAll(selectors2.popupItems)];
    const curr = popupItems.findIndex((el) => el === e.target);
    const prev = getPreviousVisibleItemPosition(curr, popupItems);
    const next = getNextVisibleItemPosition(curr, popupItems);
    e.preventDefault();
    e.stopPropagation();
    switch (e.code) {
      case "Tab": {
        if (e.shiftKey) {
          this.mobileArrowUp({ prev, curr, element, isFooter });
        } else {
          this.mobileArrowDown({ curr, next, element, isFooter });
        }
        break;
      }
      case "Escape": {
        closeAllDropdowns();
        this.focusMainNav(isFooter);
        break;
      }
      case "ArrowLeft": {
        const { prevHeadline, nextHeadline } = getState2(element);
        const headline = document.dir !== "rtl" ? prevHeadline : nextHeadline;
        if (!headline) {
          if (!isFooter) closeHeadlines();
          if (document.dir !== "rtl") {
            this.focusMainNav(isFooter);
          } else {
            this.focusMainNavNext(isFooter);
          }
          break;
        }
        openHeadline({ headline, focus: "first" });
        break;
      }
      case "ArrowUp": {
        this.mobileArrowUp({ prev, curr, element, isFooter });
        break;
      }
      case "ArrowRight": {
        const { prevHeadline, nextHeadline } = getState2(element);
        const headline = document.dir !== "rtl" ? nextHeadline : prevHeadline;
        if (!headline) {
          if (!isFooter) closeHeadlines();
          if (document.dir !== "rtl") {
            this.focusMainNavNext(isFooter);
          } else {
            this.focusMainNav(isFooter);
          }
          break;
        }
        openHeadline({ headline, focus: "first" });
        break;
      }
      case "ArrowDown": {
        this.mobileArrowDown({ next, element, isFooter });
        break;
      }
      default:
        break;
    }
  };
  addEventListeners = () => {
    document.querySelector(selectors2.globalNav)?.addEventListener("keydown", (e) => logErrorFor(() => {
      const element = getOpenPopup();
      if (!e.target.closest(selectors2.popup) || !element || this.desktop.matches) return;
      this.handleKeyDown({ e, element, popupEl: element, isFooter: false });
    }, `popup key failed ${e.code}`, "errorType=error,module=gnav-keyboard"));
    document.querySelector(selectors2.globalFooter)?.addEventListener("keydown", (e) => logErrorFor(() => {
      const element = e.target.closest(selectors2.menuContent);
      if (!element || this.desktop.matches) return;
      const firstNavLink = element.querySelector(selectors2.popupItems);
      const firstHeadline = element.querySelector(selectors2.headline);
      const isFirstNavlink = e.target === firstNavLink;
      const isFirstHeadline = e.target === firstHeadline;
      const shiftTabOutOfFooter = e.shiftKey && (isFirstNavlink || isFirstHeadline);
      if (shiftTabOutOfFooter) return;
      if (e.target.closest(selectors2.headline)) {
        openHeadline({ headline: e.target.closest(selectors2.headline), focus: "first" });
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      this.handleKeyDown({
        e,
        element,
        isFooter: true
      });
    }, `footer key failed ${e.code}`, "errorType=error,module=gnav-keyboard"));
  };
};
var mobilePopup_default = Popup2;

// ../blocks/global-navigation/utilities/keyboard/mainNav.js
var MainNavItem = class {
  constructor() {
    this.desktop = window.matchMedia("(min-width: 900px)");
    this.popup = new popup_default({ mainNav: this });
    this.mobilePopup = new mobilePopup_default({ mainNav: this });
    this.addEventListeners();
  }
  addEventListeners() {
    document.querySelector(selectors2.globalNav).addEventListener("keydown", (e) => logErrorFor(() => {
      if (!e.target.closest(selectors2.fedsNav) || e.target.closest(selectors2.popup)) {
        return;
      }
      switch (e.code) {
        case "Tab": {
          if (e.shiftKey) {
            const { prev, openTrigger } = this.getState();
            if (openTrigger) {
              if (prev === -1) {
                closeAllDropdowns();
              } else {
                e.preventDefault();
                this.focusPrev({ focus: "last" });
              }
            }
          }
          break;
        }
        case "Escape": {
          closeAllDropdowns();
          break;
        }
        case "ArrowLeft": {
          const { next, prev } = this.getState();
          if (document.dir !== "rtl") {
            if (prev === -1) break;
            this.focusPrev({ focus: null });
          } else {
            if (next === -1) break;
            this.focusNext({ focus: null });
          }
          break;
        }
        case "ArrowUp": {
          e.preventDefault();
          e.stopPropagation();
          this.focusPrev({ focus: "last" });
          break;
        }
        case "ArrowRight": {
          const { next, prev, openTrigger } = this.getState();
          if (document.dir !== "rtl") {
            if (next === -1) break;
            this.focusNext();
          } else {
            if (prev === -1) break;
            this.focusPrev({ focus: null });
          }
          if (openTrigger) {
            this.open();
          }
          break;
        }
        case "ArrowDown": {
          e.stopPropagation();
          e.preventDefault();
          const { items, curr } = this.getState();
          if (items[curr] && items[curr].hasAttribute("aria-haspopup")) {
            this.open({ focus: "first" });
            return;
          }
          this.focusNext();
          break;
        }
        default:
          break;
      }
    }, `mainNav key failed ${e.code}`, "errorType=error,module=gnav-keyboard"));
  }
  getState = () => {
    const items = [...document.querySelectorAll(selectors2.mainNavItems)];
    const openTrigger = document.querySelector(selectors2.expandedPopupTrigger);
    const currentEl = document.activeElement.closest(selectors2.navItem)?.querySelector(selectors2.mainNavItems);
    const curr = items.findIndex((el) => el === currentEl);
    return {
      items,
      curr,
      prev: getPreviousVisibleItemPosition(curr, items),
      next: getNextVisibleItemPosition(curr, items),
      openTrigger
    };
  };
  focusCurr = () => {
    const { items, curr } = this.getState();
    items[curr].focus();
  };
  focusPrev = ({ focus } = {}) => {
    const { items, prev } = this.getState();
    const open = document.querySelector(selectors2.expandedPopupTrigger);
    closeAllDropdowns();
    if (prev === -1) return;
    items[prev].focus();
    if (open) {
      this.open({ focus });
    }
  };
  focusNext = () => {
    const { items, next } = this.getState();
    if (next === -1) return;
    closeAllDropdowns();
    items[next].focus();
  };
  open = ({ focus, triggerEl, e } = {}) => {
    const { items, curr } = this.getState();
    const triggerElement = triggerEl || items[curr];
    if (!triggerElement || !triggerElement.hasAttribute("aria-haspopup")) return;
    if (e) e.preventDefault();
    if (triggerElement.getAttribute("aria-expanded") === "false") {
      trigger({ element: triggerElement });
    }
    const navItem = triggerElement.parentElement;
    const popupEl = navItem.querySelector(selectors2.popup);
    if (popupEl) {
      if (this.desktop.matches) {
        this.popup.open({ focus });
      } else {
        this.mobilePopup.open({ focus });
      }
      return;
    }
    const observer = new MutationObserver(() => {
      observer.disconnect();
      if (this.desktop.matches) {
        this.popup.open({ focus });
      } else {
        this.mobilePopup.open({ focus });
      }
    });
    observer.observe(navItem, { childList: true });
  };
};
var mainNav_default = MainNavItem;

// ../blocks/global-navigation/utilities/keyboard/index.js
var cycleOnOpenSearch = ({ e, isDesktop }) => {
  const withoutBreadcrumbs = [
    ...document.querySelectorAll(`
      ${selectors2.brand},
      ${selectors2.mainNavToggle},
      ${selectors2.mainNavItems},
      ${selectors2.searchTrigger},
      ${selectors2.searchField},
      ${selectors2.signIn},
      ${selectors2.profileButton},
      ${selectors2.logo}
  `)
  ];
  const first = getNextVisibleItemPosition(-1, withoutBreadcrumbs);
  const last = getPreviousVisibleItemPosition(withoutBreadcrumbs.length, withoutBreadcrumbs);
  const openSearch = isDesktop && document.querySelector(selectors2.openSearch);
  if (openSearch && document.activeElement === withoutBreadcrumbs[e.shiftKey ? first : last]) {
    e.preventDefault();
    withoutBreadcrumbs[e.shiftKey ? last : first].focus();
  }
};
var openProfile = ({ e, el }) => {
  const button = e.target.closest(`${selectors2.signIn}, ${selectors2.profileButton}`);
  if (button?.getAttribute("aria-expanded") === "false") {
    e.target.click();
    el.querySelector(selectors2.profileDropdown)?.focus();
    return true;
  }
  return false;
};
var getProfileItems = ({ e }) => {
  const profileDropdownLinks = document.querySelectorAll(selectors2.profileDropdown);
  if (!profileDropdownLinks.length) return { next: -1, prev: -1, items: [] };
  const items = [...profileDropdownLinks];
  const curr = items.findIndex((element) => element === e.target);
  return { next: curr + 1, prev: curr - 1, curr, items };
};
var closeProfile = () => {
  closeAllDropdowns();
  document.querySelector(`${selectors2.profileButton}, ${selectors2.signIn}`)?.focus();
};
var focusNextProfileItem = ({ e }) => {
  const { items, next } = getProfileItems({ e });
  if (items[next]) {
    items[next].focus();
    return;
  }
  e.preventDefault();
  e.stopPropagation();
  closeProfile();
};
var focusPrevProfileItem = ({ e }) => {
  const { items, prev } = getProfileItems({ e });
  if (items[prev]) {
    items[prev].focus();
    return;
  }
  e.preventDefault();
  e.stopPropagation();
  closeProfile();
};
var KeyboardNavigation = class {
  constructor() {
    try {
      this.addEventListeners();
      this.mainNav = new mainNav_default();
      this.desktop = window.matchMedia("(min-width: 900px)");
    } catch (e) {
      lanaLog({ message: "Keyboard Navigation failed to load", e, tags: "errorType=error,module=gnav-keyboard" });
    }
  }
  addEventListeners = () => {
    [...document.querySelectorAll(`${selectors2.globalNav}, ${selectors2.globalFooter}`)].forEach((el) => {
      el.addEventListener("keydown", (e) => logErrorFor(() => {
        switch (e.code) {
          case "Tab": {
            cycleOnOpenSearch({ e, isDesktop: this.desktop.matches });
            const { items } = getProfileItems({ e });
            const profileBtn = e.target.closest(`${selectors2.signIn}, ${selectors2.profileButton}`);
            if (e.shiftKey && e.target === profileBtn) closeProfile();
            if (items[items.length - 1] === e.target) {
              e.preventDefault();
              e.stopPropagation();
              closeProfile();
            }
            break;
          }
          case "Enter":
          case "Space": {
            if (e.target.closest(selectors2.searchField) || e.target.closest(".feds-client-search")) return;
            e.stopPropagation();
            e.preventDefault();
            e.target.click();
            break;
          }
          case "ArrowDown": {
            if (e.target.closest(selectors2.profile)) {
              if (openProfile({ e, el })) break;
              focusNextProfileItem({ e });
            }
            break;
          }
          case "ArrowUp": {
            if (e.target.closest(selectors2.profile)) {
              focusPrevProfileItem({ e });
            }
            break;
          }
          default:
            break;
        }
      }, `KeyboardNavigation index failed. ${e.code}`, "errorType=error,module=gnav-keyboard"));
    });
  };
};
var keyboard_default = KeyboardNavigation;
export {
  keyboard_default as default
};
//# sourceMappingURL=keyboard-S6OXUVVP.js.map
