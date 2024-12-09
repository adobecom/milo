import { selectors } from './utils.js';
import { trigger, setActiveDropdown } from '../utilities.js';

class LocalNavItem {
  constructor() {
    this.localNav = document.querySelector(selectors.localNav);
    this.localNavTrigger = this.localNav?.querySelector(selectors.localNavTitle);
    this.exitLink = this.localNav?.querySelector(selectors.localNavExit);
    this.addEventListeners();
  }

  static handleKeyDown = (e) => {
    const isHeadline = e.target.classList.contains(selectors.headline.slice(1));
    switch (e.code) {
      case 'Space':
      case 'Enter':
        if (isHeadline) {
          e.preventDefault(); // Prevent default scrolling behavior for Space key
          trigger({ element: e.target, event: e, type: 'headline' });
          setActiveDropdown(e.target);
        }
        break;
      default:
        break;
    }
  };

  addEventListeners = () => {
    this.localNav?.addEventListener('keydown', LocalNavItem.handleKeyDown);
    this.exitLink?.addEventListener('focus', (e) => {
      e.preventDefault();
      this.localNavTrigger?.click();
      this.localNavTrigger?.focus();
    });
  };
}

export default LocalNavItem;
