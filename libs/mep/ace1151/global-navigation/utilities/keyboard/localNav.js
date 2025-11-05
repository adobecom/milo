import { selectors, getNextVisibleItemPosition, getPreviousVisibleItemPosition } from './utils.js';
import { trigger } from '../utilities.js';

const focusables = (root) => [...root.querySelectorAll('a[href],button:not([disabled])')];

const nestedFocusables = (root) => [...root.querySelectorAll('a, button, .feds-menu-headline')].filter((el) => {
  const items = el.closest('.feds-menu-items');
  const headline = items?.previousElementSibling;
  return !items || headline?.getAttribute('aria-expanded') === 'true';
});

function getNavList() {
  return [...document.querySelector('.feds-localnav-items').children].flatMap((item) => {
    const triggerBtn = item.querySelector('a, button, .feds-menu-headline');
    if (!triggerBtn || !triggerBtn.matches('[aria-haspopup="true"][aria-expanded="true"]')) return triggerBtn ? [triggerBtn] : [];

    const popup = item.querySelector('.feds-popup');
    if (!popup) return [triggerBtn];

    const hasHeadline = item.querySelector('.feds-menu-items');
    const dropdown = hasHeadline
      ? nestedFocusables(popup)
      : focusables(popup);

    return [triggerBtn, ...dropdown];
  });
}

function getState() {
  const items = [...document.querySelectorAll(selectors.localNavItems)];
  const openTrigger = document.querySelector(selectors.expandedPopupTrigger);
  const currentEl = document.activeElement
    .closest(selectors.localNavItem)?.querySelector(selectors.localNavItems);
  const curr = items.indexOf(currentEl);
  return {
    items,
    curr,
    prev: getPreviousVisibleItemPosition(curr, items),
    next: getNextVisibleItemPosition(curr, items),
    openTrigger,
  };
}

function open({ triggerEl, e } = {}) {
  const { items, curr } = getState();
  const el = triggerEl || items[curr];
  if (!el?.hasAttribute('aria-haspopup')) return;
  if (e) e.preventDefault();
  if (el.getAttribute('aria-expanded') === 'false') {
    const isHeader = el.classList.contains('feds-localnav-title') || el.classList.contains('feds-menu-headline');
    if (isHeader) document.querySelector(selectors.localNav).classList.add('feds-localnav--active');
    trigger({ element: el, type: isHeader ? 'headline' : 'localNavItem' });
  }
}

function navigate(current, dir) {
  const items = getNavList();
  const currIdx = items.indexOf(current);
  const isHeader = current.classList.contains('feds-localnav-title');
  const titleBtn = document.querySelector(`${selectors.localNav} > button`);
  if (currIdx === -1 && !isHeader) return;
  if (isHeader && dir === 1) open({ triggerEl: current });
  // If item is first or last move next focus to header
  if ((dir === 1 && current === items.at(-1)) || (dir === -1 && current === items.at(0))) {
    titleBtn?.focus();
    return;
  }
  // if Arrow up on header element focus to its last item
  if (dir === -1 && isHeader) {
    items.at(-1)?.focus();
    return;
  }
  const next = items[(currIdx + dir + items.length) % items.length];
  next.focus();

  if (next.matches('[aria-haspopup="true"]')) {
    const collapsed = next.matches('[aria-expanded="false"]');
    open({ triggerEl: next });
    // Focus on last item of the dropdown if arrow up
    if (dir === -1 && collapsed) {
      const hasHeadline = next.parentElement.querySelector('.feds-menu-items');
      const dropdownItems = hasHeadline ? nestedFocusables(next.parentElement) : focusables(next.parentElement.querySelector('.feds-popup'));
      dropdownItems.at(-1)?.focus();
    }
  }
}

class LocalNavItem {
  constructor() {
    this.localNav = document.querySelector(selectors.localNav);
    this.localNavTrigger = this.localNav?.querySelector(selectors.localNavTitle);
    this.exitLink = this.localNav?.querySelector(selectors.localNavExit);
    this.addEventListeners();
  }

  handleKeyDown = (e) => {
    const { code, target } = e;
    const isHeadline = target.classList.contains(selectors.headline.slice(1));
    switch (code) {
      case 'Space':
      case 'Enter':
        e.stopPropagation();
        e.preventDefault();
        if (isHeadline) {
          trigger({ element: target, event: e, type: 'headline' });
        } else {
          e.target.click();
        }
        break;
      case 'Escape': // close on escape
        e.preventDefault();
        if (this.localNav.classList.contains(selectors.localNavActive.slice(1))) {
          this.localNavTrigger?.click();
          this.localNavTrigger?.focus();
        }
        break;
      case 'ArrowDown':
      case 'ArrowUp': {
        e.stopPropagation();
        e.preventDefault();
        const dir = code === 'ArrowDown' ? +1 : -1;
        navigate(target, dir);
        break;
      }
      default:
        break;
    }
  };

  addEventListeners = () => {
    this.localNav?.addEventListener('keydown', this.handleKeyDown);
    this.exitLink?.addEventListener('focus', (e) => {
      e.preventDefault();
      this.localNavTrigger?.focus();
    });
  };
}

export default LocalNavItem;
