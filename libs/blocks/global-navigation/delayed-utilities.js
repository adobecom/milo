const IS_OPEN = 'is-open';
const curtain = document.querySelector('.gnav-curtain');

class MenuControls {
  constructor() {
    this.state = {};
  }

  toggleOnSpace = (e) => {
    if (e.code === 'Space') {
      e.preventDefault();
      const parentEl = e.target.closest('.has-menu');
      this.toggleMenu(parentEl);
    }
  };

  closeOnScroll = () => {
    let scrolled;
    if (!scrolled) {
      if (this.state.openMenu) {
        this.toggleMenu(this.state.openMenu);
      }
      scrolled = true;
      document.removeEventListener('scroll', this.closeOnScroll);
    }
  };

  toggleMenu = (el) => {
    const isSearch = el.classList.contains('feds-search');
    const sameMenu = el === this.state.openMenu;
    if (this.state.openMenu) {
      this.closeMenu();
    }
    if (!sameMenu) {
      this.openMenu(el, isSearch);
    }
  };

  closeOnEscape = (e) => {
    // TODO: Search has different ESC logic, this should be adapted
    if (e.code === 'Escape') {
      this.toggleMenu(this.state.openMenu);
    }
  };

  closeOnDocClick = (e) => {
    const closest = e.target.closest(`.${IS_OPEN}`);
    const isCurtain = e.target === curtain;
    if ((this.state.openMenu && !closest) || isCurtain) {
      this.toggleMenu(this.state.openMenu);
    }
    if (isCurtain) {
      curtain.classList.remove('is-open');
    }
  };

  openMenu = (el, isSearch) => {
    el.classList.add(IS_OPEN);

    const menuToggle = el.querySelector('[aria-expanded]');
    menuToggle.setAttribute('aria-expanded', true);
    menuToggle.setAttribute('daa-lh', 'header|Close');

    document.addEventListener('click', this.closeOnDocClick);
    window.addEventListener('keydown', this.closeOnEscape);
    if (!isSearch) {
      const desktop = window.matchMedia('(min-width: 900px)');
      if (desktop.matches) {
        document.addEventListener('scroll', this.closeOnScroll, { passive: true });
        if (el.classList.contains('large-menu')) {
          curtain.classList.add('is-open', 'is-quiet');
        }
      }
    } else {
      curtain.classList.add('is-open');
      // Search template is not available yet
      // TODO: better logic to focus elements that have not been added yet
      if (el.querySelector('.feds-search-input')) {
        el.querySelector('.feds-search-input').focus();
      }
    }
    this.state.openMenu = el;
  };

  closeMenu = () => {
    this.state.openMenu.classList.remove(IS_OPEN);
    curtain.classList.remove('is-open');
    curtain.classList.remove('is-quiet');
    document.removeEventListener('click', this.closeOnDocClick);
    window.removeEventListener('keydown', this.closeOnEscape);
    const menuToggle = this.state.openMenu.querySelector('[aria-expanded]');
    menuToggle.setAttribute('aria-expanded', false);
    menuToggle.setAttribute('daa-lh', 'header|Open');
    this.state.openMenu = null;
  };
}

export default { MenuControls };
export { MenuControls };
