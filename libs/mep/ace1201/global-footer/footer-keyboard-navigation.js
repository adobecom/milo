/* eslint-disable class-methods-use-this */
const FOOTER_DESKTOP_MEDIA = '(min-width: 1024px)';
export const KEYBOARD_DELAY = 8000;

const selectors = {
  globalFooterTag: 'footer',
  globalFooter: '.global-footer',
  link: 'a',
  menuContent: '.feds-menu-content',
  featuredProducts: '.feds-featuredProducts',
  languagePicker: '.language-dropdown',
  headline: '.feds-menu-headline',
  section: '.feds-menu-section',
  column: '.feds-menu-column:not(.feds-menu-column--group)',
  navItem: '.feds-navItem',
  navLink: '.feds-navLink',
  promoLink: '.feds-promo-link',
  imagePromo: 'a.feds-promo-image',
  cta: '.feds-cta',
  regionPicker: '.feds-regionPicker',
  socialLink: '.feds-social-link',
  privacyLink: '.feds-footer-privacyLink',
};

selectors.popupItems = `
  ${selectors.navLink}:not(.feds-navLink--header),
  ${selectors.promoLink},
  ${selectors.imagePromo},
  ${selectors.cta},
  ${selectors.regionPicker},
  ${selectors.socialLink},
  ${selectors.privacyLink}
`;

const firstFocusableInSection = '.feds-navLink, .feds-cta--button, .feds-cta--link';

const isElementVisible = (elem) => !!(
  elem
  && elem instanceof HTMLElement
  && (elem.offsetWidth && elem.offsetHeight)
  && window.getComputedStyle(elem).getPropertyValue('visibility') !== 'hidden'
);

const getNextVisibleItemPosition = (position, items) => {
  for (let i = position + 1; i < items.length; i += 1) {
    if (isElementVisible(items[i])) return i;
  }
  return -1;
};

const getPreviousVisibleItemPosition = (position, items) => {
  for (let i = position - 1; i >= 0; i -= 1) {
    if (isElementVisible(items[i])) return i;
  }
  return -1;
};

const setActiveDropdown = (elem) => {
  const activeClass = 'feds-dropdown--active';
  [...document.querySelectorAll(`${selectors.globalFooter} .${activeClass}`)]
    .forEach((activeDropdown) => activeDropdown.classList.remove(activeClass));

  if (!(elem instanceof HTMLElement)) return;
  [selectors.section, selectors.column, selectors.navItem].some((selector) => {
    const candidate = elem.closest(selector);
    if (candidate?.querySelector('[aria-expanded = "true"]')) {
      candidate.classList.add(activeClass);
      return true;
    }
    return false;
  });
};

const closeFooterHeadlines = () => {
  const open = [...document.querySelectorAll(`${selectors.globalFooter} ${selectors.headline}[aria-expanded="true"]`)];
  open.forEach((el) => el.setAttribute('aria-expanded', 'false'));
  if (open[0]) setActiveDropdown(open[0]);
};

const closeAllFooterDropdowns = () => {
  [...document.querySelectorAll(`${selectors.globalFooter} [aria-expanded = "true"]`)]
    .forEach((el) => el.setAttribute('aria-expanded', 'false'));
  setActiveDropdown(undefined);
};

const openHeadline = ({ headline, focus } = {}) => {
  closeFooterHeadlines();
  if (!headline || headline.getAttribute('aria-haspopup') !== 'true') return;

  headline.setAttribute('aria-expanded', 'true');
  setActiveDropdown(headline);
  const section = headline.closest(selectors.section)
    || headline.closest(selectors.column)
    || headline.closest(selectors.featuredProducts);
  const items = [...(section?.querySelectorAll(selectors.popupItems) || [])]
    .filter((el) => isElementVisible(el));
  if (focus === 'first' && items.length) items[0].focus();
  if (focus === 'last' && items.length) items[items.length - 1].focus();
};

const getPopupState = (element) => {
  if (!element) return { popupItems: [] };
  const popupItems = [...element.querySelectorAll(selectors.popupItems)];
  const allHeadlines = [...element.querySelectorAll(selectors.headline)]
    .filter((el) => isElementVisible(el));

  const section = document.activeElement.closest(selectors.section)
    || document.activeElement.closest(selectors.column);

  const currentHeadline = section?.querySelector(selectors.headline);
  const currentHeadlineIdx = allHeadlines.findIndex((node) => node.isEqualNode(currentHeadline));

  return {
    firstHeadline: allHeadlines[0],
    lastHeadline: allHeadlines[allHeadlines.length - 1],
    prevHeadline: allHeadlines[currentHeadlineIdx - 1],
    nextHeadline: allHeadlines[currentHeadlineIdx + 1],
    popupItems,
  };
};

const getSectionIndexWithin = (element) => {
  const section = document.activeElement.closest(selectors.section)
    || document.activeElement.closest(selectors.column);
  let allSections = [...element.querySelectorAll(selectors.section)];
  if (!allSections.length) allSections = [...element.querySelectorAll(selectors.column)];
  const visibleSections = allSections.filter((el) => isElementVisible(el));
  return visibleSections.findIndex((node) => node.isEqualNode(section));
};

const getDesktopState = ({ e, element } = {}) => {
  if (!element) return {};
  const popupItems = [...element.querySelectorAll(selectors.popupItems)];
  const curr = popupItems.findIndex((el) => el === e.target);
  const column = document.activeElement.closest(selectors.column);
  const visibleColumns = [...element.querySelectorAll(selectors.column)];
  const currentColumn = visibleColumns.findIndex((node) => node.isEqualNode(column));

  return {
    popupItems,
    curr,
    prev: getPreviousVisibleItemPosition(curr, popupItems),
    next: getNextVisibleItemPosition(curr, popupItems),
    prevColumn: visibleColumns[currentColumn - 1],
    nextColumn: visibleColumns[currentColumn + 1],
  };
};

class FooterKeyboardNavigation {
  constructor() {
    this.desktop = window.matchMedia(FOOTER_DESKTOP_MEDIA);
    this.addEventListeners();
  }

  isDesktopForFooter = () => {
    const footer = document.querySelector('footer.global-footer');
    if (!footer) return this.desktop.matches;
    if (footer.classList.contains('responsive-container')) {
      return !footer.classList.contains('mobile');
    }
    return this.desktop.matches;
  };

  handleDesktopKeyDown = (e, element) => {
    const state = getDesktopState({ e, element });
    const {
      popupItems, curr, prev, next, prevColumn, nextColumn,
    } = state;
    if (!popupItems?.length || curr === -1) return;

    const shiftTabOutOfFooter = e.code === 'Tab' && e.shiftKey && prev === -1;
    const tabOutOfFooter = e.code === 'Tab' && !e.shiftKey && next === -1;
    if (tabOutOfFooter || shiftTabOutOfFooter) return;

    e.preventDefault();
    e.stopPropagation();

    switch (e.code) {
      case 'Tab':
        popupItems[e.shiftKey ? prev : next]?.focus();
        break;
      case 'Escape':
        closeAllFooterDropdowns();
        break;
      case 'ArrowLeft': {
        const noPrev = document.dir !== 'rtl' && !prevColumn?.querySelector(selectors.popupItems);
        const noNext = document.dir === 'rtl' && !nextColumn?.querySelector(selectors.popupItems);
        if (noPrev || noNext) break;
        const target = document.dir !== 'rtl'
          ? prevColumn.querySelector(selectors.popupItems)
          : nextColumn.querySelector(selectors.popupItems);
        target?.focus();
        break;
      }
      case 'ArrowUp':
        if (prev !== -1) popupItems[prev].focus();
        break;
      case 'ArrowRight': {
        const noNext = document.dir !== 'rtl' && !nextColumn?.querySelector(selectors.popupItems);
        const noPrev = document.dir === 'rtl' && !prevColumn?.querySelector(selectors.popupItems);
        if (noNext || noPrev) break;
        const target = document.dir !== 'rtl'
          ? nextColumn.querySelector(selectors.popupItems)
          : prevColumn.querySelector(selectors.popupItems);
        target?.focus();
        break;
      }
      case 'ArrowDown':
        if (next !== -1) popupItems[next].focus();
        break;
      default:
        break;
    }
  };

  mobileArrowUp = ({ prev, curr, element }) => {
    if (element) {
      const section = document.activeElement.closest(selectors.section)
        || document.activeElement.closest(selectors.column);

      if (section) {
        const headline = section.querySelector(selectors.headline);
        const sectionItems = [...section.querySelectorAll(selectors.popupItems)]
          .filter((el) => isElementVisible(el));

        if (sectionItems.length > 0 && sectionItems[0] === document.activeElement) {
          if (headline) {
            headline.focus();
            return;
          }
        }
      } else if (curr === 0) {
        const headline = document.activeElement.closest(selectors.section)
          ?.querySelector(selectors.headline)
          || document.activeElement.closest(selectors.column)
            ?.querySelector(selectors.headline);
        if (headline) {
          headline.focus();
          return;
        }
      }
    }

    const state = getPopupState(element);
    const { popupItems } = state;
    const sectionIdxBefore = getSectionIndexWithin(element);
    if (prev !== -1 && curr - 1 === prev) {
      popupItems[prev].focus();
      if (sectionIdxBefore !== getSectionIndexWithin(element)) closeFooterHeadlines();
      return;
    }

    const { prevHeadline } = getPopupState(element);
    if (!prevHeadline) {
      const prevElement = element?.previousElementSibling;
      const allHeadlines = [...(prevElement?.querySelectorAll(selectors.headline) || [])];
      if (allHeadlines.length && allHeadlines[allHeadlines.length - 1]) {
        closeFooterHeadlines();
        openHeadline({ headline: allHeadlines[allHeadlines.length - 1], focus: 'last' });
      }
      return;
    }

    openHeadline({ headline: prevHeadline, focus: 'last' });
  };

  mobileArrowDown = ({ next, element }) => {
    if (element) {
      const { popupItems } = getPopupState(element);
      if (next === -1 || next >= popupItems.length) {
        const currentHeadline = document.activeElement.closest(selectors.section)
          ?.querySelector(selectors.headline)
          || document.activeElement.closest(selectors.column)
            ?.querySelector(selectors.headline);

        if (currentHeadline) {
          const footer = document.querySelector(selectors.globalFooter);
          const allHeadlines = [...footer.querySelectorAll(selectors.headline)]
            .filter((h) => isElementVisible(h));
          const idx = allHeadlines.indexOf(currentHeadline);
          if (idx !== -1 && idx < allHeadlines.length - 1) {
            const nextHeadline = allHeadlines[idx + 1];
            openHeadline({ headline: nextHeadline, focus: null });
            nextHeadline.focus();
            return;
          }
        }
      }
    }

    const state = getPopupState(element);
    const { popupItems } = state;
    const sectionIdxBefore = getSectionIndexWithin(element);
    if (next !== -1) {
      popupItems[next].focus();
      if (sectionIdxBefore !== getSectionIndexWithin(element)) closeFooterHeadlines();
      return;
    }

    const { nextHeadline } = getPopupState(element);
    if (!nextHeadline) {
      const nextElement = element?.nextElementSibling;
      const headline = nextElement?.querySelector(selectors.headline);
      closeFooterHeadlines();
      if (headline) {
        openHeadline({ headline, focus: 'first' });
      } else {
        nextElement?.querySelector('a')?.focus();
      }
      return;
    }

    openHeadline({ headline: nextHeadline, focus: 'first' });
  };

  handleMobileKeyDown = (e, element) => {
    const popupItems = [...element.querySelectorAll(selectors.popupItems)];
    const curr = popupItems.findIndex((el) => el === e.target);
    const prev = getPreviousVisibleItemPosition(curr, popupItems);
    const next = getNextVisibleItemPosition(curr, popupItems);

    if (e.code === 'Tab') return;

    e.preventDefault();
    e.stopPropagation();

    switch (e.code) {
      case 'Enter':
      case 'Space': {
        const headline = e.target.closest(selectors.headline);
        if (headline) {
          const isExpanded = headline.getAttribute('aria-expanded') === 'true';
          if (isExpanded) {
            closeFooterHeadlines();
          } else {
            openHeadline({ headline, focus: null });
          }
        }
        break;
      }
      case 'Escape':
        closeAllFooterDropdowns();
        break;
      case 'ArrowLeft': {
        const { prevHeadline, nextHeadline } = getPopupState(element);
        const headline = document.dir !== 'rtl' ? prevHeadline : nextHeadline;
        if (!headline) break;
        openHeadline({ headline, focus: 'first' });
        break;
      }
      case 'ArrowUp': {
        if (e.target.closest(selectors.headline)) {
          const headline = e.target.closest(selectors.headline);
          const expanded = headline.getAttribute('aria-expanded') === 'true';
          const footer = document.querySelector(selectors.globalFooter);
          const allHeadlines = [...footer.querySelectorAll(selectors.headline)]
            .filter((h) => isElementVisible(h));
          const idx = allHeadlines.indexOf(headline);
          if (expanded) {
            if (idx > 0) {
              const previousHeadline = allHeadlines[idx - 1];
              openHeadline({ headline: previousHeadline, focus: 'last' });
              break;
            }
          } else if (idx > 0) {
            const previousHeadline = allHeadlines[idx - 1];
            previousHeadline.focus();
            break;
          }
        }
        this.mobileArrowUp({ prev, curr, element });
        break;
      }
      case 'ArrowRight': {
        const { prevHeadline, nextHeadline } = getPopupState(element);
        const headline = document.dir !== 'rtl' ? nextHeadline : prevHeadline;
        if (!headline) break;
        openHeadline({ headline, focus: 'first' });
        break;
      }
      case 'ArrowDown': {
        if (e.target.closest(selectors.headline)) {
          const headline = e.target.closest(selectors.headline);
          const expanded = headline.getAttribute('aria-expanded') === 'true';

          if (expanded) {
            const section = headline.closest(selectors.section)
              || headline.closest(selectors.column);
            const firstLink = section?.querySelector(firstFocusableInSection);
            if (firstLink) {
              firstLink.focus();
              break;
            }
          }

          const { nextHeadline } = getPopupState(element);
          if (nextHeadline) {
            nextHeadline.focus();
            break;
          }
          const footer = document.querySelector(selectors.globalFooter);
          const allHeadlines = [...footer.querySelectorAll(selectors.headline)]
            .filter((h) => isElementVisible(h));
          const current = e.target.closest(selectors.headline);
          const idx = allHeadlines.indexOf(current);
          if (idx !== -1 && idx < allHeadlines.length - 1) {
            allHeadlines[idx + 1].focus();
            break;
          }
          break;
        }
        this.mobileArrowDown({ next, element });
        break;
      }
      default:
        break;
    }
  };

  onKeyDown = (e) => {
    if (!e.target.closest(selectors.globalFooter)) return;

    const linkTrigger = e.target.closest(selectors.link);
    if (linkTrigger && (e.code === 'Space' || e.code === 'Enter')) {
      e.preventDefault();
      linkTrigger.click();
      return;
    }

    if (this.isDesktopForFooter()) {
      if (e.target.closest(selectors.languagePicker)) return;
      const footerElement = e.target.closest(selectors.globalFooter);
      this.handleDesktopKeyDown(e, footerElement);
      return;
    }

    const element = e.target.closest(selectors.menuContent)
      || e.target.closest(selectors.featuredProducts);
    if (!element) return;

    const firstNavLink = element.querySelector(selectors.popupItems);
    const firstHeadline = element.querySelector(selectors.headline);
    const isFirstNavLink = e.target === firstNavLink;
    const isFirstHeadline = e.target === firstHeadline;
    const shiftTabOutOfFooter = e.shiftKey
      && (isFirstNavLink || isFirstHeadline)
      && !e.target.closest(selectors.featuredProducts);
    if (shiftTabOutOfFooter) return;

    this.handleMobileKeyDown(e, element);
  };

  addEventListeners = () => {
    document.querySelector(selectors.globalFooterTag)?.addEventListener('keydown', this.onKeyDown);
  };
}

let footerKeyboardNav;
export const setupFooterKeyboardNav = async () => {
  footerKeyboardNav = footerKeyboardNav || new FooterKeyboardNavigation();
  return footerKeyboardNav;
};
