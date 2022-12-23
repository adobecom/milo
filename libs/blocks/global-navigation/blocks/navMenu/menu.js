import {
  analyticsDecorateList,
  analyticsGetLabel,
} from '../../../../martech/attributes.js';
import {
  createTag,
  decorateSVG,
  makeRelative,
} from '../../../../utils/utils.js';

const IS_OPEN = 'is-open';
const state = {}
const curtain = document.querySelector('.gnav-curtain')
const isHeading = (el) => el?.nodeName.startsWith('H');

const childIndexOf = (el) =>
  [...el.parentElement.children]
    .filter((e) => e.nodeName === 'DIV' || e.nodeName === 'P')
    .indexOf(el);

const decorateButtons = (menu) => {
  const buttons = menu.querySelectorAll('strong a');
  buttons.forEach((btn) => {
    btn.classList.add('con-button', 'filled', 'blue', 'button-M');
  });
};

const closeOnEscape = (e) => {
  if (e.code === 'Escape') {
    toggleMenu(state.openMenu);
  }
};

const closeOnDocClick = (e) => {
  const closest = e.target.closest(`.${IS_OPEN}`);
  const isCurtain = e.target === curtain;
  if ((state.openMenu && !closest) || isCurtain) {
    toggleMenu(state.openMenu);
  }
  if (isCurtain) {
    curtain.classList.remove('is-open');
  }
};

/**
 * Toggles menus when clicked directly
 * @param {HTMLElement} el the element to check
 */
const toggleMenu = (el) => {
  const isSearch = el.classList.contains('gnav-search');
  const sameMenu = el === state.openMenu;
  if (state.openMenu) {
    closeMenu();
  }
  if (!sameMenu) {
    openMenu(el, isSearch);
  }
};

const closeMenu = () => {
  state.openMenu.classList.remove(IS_OPEN);
  curtain.classList.remove('is-open');
  curtain.classList.remove('is-quiet');
  document.removeEventListener('click', closeOnDocClick);
  window.removeEventListener('keydown', closeOnEscape);
  const menuToggle = state.openMenu.querySelector('[aria-expanded]');
  menuToggle.setAttribute('aria-expanded', false);
  menuToggle.setAttribute('daa-lh', 'header|Open');
  state.openMenu = null;
};

const closeOnScroll = () => {
  let scrolled;
  if (!scrolled) {
    if (state.openMenu) {
      toggleMenu(state.openMenu);
    }
    scrolled = true;
    document.removeEventListener('scroll', closeOnScroll);
  }
};

const openMenu = (el, isSearch) => {
  el.classList.add(IS_OPEN);

  const menuToggle = el.querySelector('[aria-expanded]');
  menuToggle.setAttribute('aria-expanded', true);
  menuToggle.setAttribute('daa-lh', 'header|Close');

  document.addEventListener('click', closeOnDocClick);
  window.addEventListener('keydown', closeOnEscape);
  if (!isSearch) {
    const desktop = window.matchMedia('(min-width: 900px)');
    if (desktop.matches) {
      document.addEventListener('scroll', closeOnScroll, {
        passive: true,
      });
      if (el.classList.contains('large-menu')) {
        curtain.classList.add('is-open', 'is-quiet');
      }
    }
  } else {
    curtain.classList.add('is-open');
    el.querySelector('.gnav-search-input').focus();
  }
  state.openMenu = el;
};

const toggleOnSpace = (e) => {
  if (e.code === 'Space') {
    e.preventDefault();
    const parentEl = e.target.closest('.has-menu');
    toggleMenu(parentEl);
  }
};

const decorateLinkGroups = (menu) => {
  const linkGroups = menu.querySelectorAll('.link-group');
  linkGroups.forEach((linkGroup) => {
    const image = linkGroup.querySelector('picture');
    const anchor = linkGroup.querySelector('a');
    const title = anchor?.textContent;
    const subtitle = linkGroup.querySelector('p:last-of-type') || '';
    const titleWrapper = createTag('div');
    titleWrapper.className = 'link-group-title';
    anchor.href = makeRelative(anchor.href, true);
    const link = createTag('a', { class: 'link-block', href: anchor.href });

    linkGroup.replaceChildren();
    titleWrapper.append(title, subtitle);
    const contents = image ? [image, titleWrapper] : [titleWrapper];
    link.append(...contents);
    linkGroup.appendChild(link);
  });
};

const setMenuAnalytics = (el) => {
  switch (el.nodeName) {
    case 'DIV':
      if (el.classList.contains('link-group')) {
        const title =
          el.querySelector('.link-group-title')?.childNodes?.[0]?.textContent;
        if (title) {
          el.firstChild.setAttribute(
            'daa-lh',
            `${analyticsGetLabel(title)}-${childIndexOf(el) + 1}`
          );
        }
      } else {
        [...el.children].forEach((childEl) => setMenuAnalytics(childEl));
      }
      break;
    case 'UL':
      if (isHeading(el.previousElementSibling)) {
        el.setAttribute('daa-lh', el.previousElementSibling.textContent);
      }
      [...el.children].forEach(analyticsDecorateList);
      break;
    default: {
      const a = el.querySelector('a');
      if (a) {
        a.setAttribute(
          'daa-ll',
          `${analyticsGetLabel(a.textContent)}-${childIndexOf(el) + 1}`
        );
      }
    }
  }
};

const decorateAnalytics = (menu) =>
  [...menu.children].forEach((child) => setMenuAnalytics(child));

const decorateMenu = (navItem, navLink, menu) => {
  menu.className = 'gnav-navitem-menu';
  menu.setAttribute('daa-lh', `header|${navLink.textContent}`);
  const childCount = menu.childElementCount;
  if (childCount === 1) {
    menu.classList.add('small-Variant');
  } else if (childCount === 2) {
    menu.classList.add('medium-Variant');
  } else if (childCount >= 3) {
    menu.classList.add('large-Variant');
    const container = createTag('div', { class: 'gnav-menu-container' });
    container.append(...Array.from(menu.children));
    menu.append(container);
  }
  decorateLinkGroups(menu);
  decorateAnalytics(menu);
  navLink.addEventListener('focus', () => {
    window.addEventListener('keydown', toggleOnSpace);
  });
  navLink.addEventListener('blur', () => {
    window.removeEventListener('keydown', toggleOnSpace);
  });
  navLink.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleMenu(navItem);
  });
  decorateButtons(menu);
  return menu;
};

const decorateLargeMenu = (navLink, navItem, menu) => {
  let path = navLink.href;
  path = makeRelative(path, true);
  const promise = fetch(`${path}.plain.html`);
  promise.then(async (resp) => {
    if (resp.status === 200) {
      const text = await resp.text();
      menu.insertAdjacentHTML('beforeend', text);
      const links = menu.querySelectorAll('a');
      links.forEach((link) => {
        decorateSVG(link);
      });
      const decoratedMenu = decorateMenu(navItem, navLink, menu);
      const menuSections = decoratedMenu.querySelectorAll(
        '.gnav-menu-container > div'
      );
      menuSections.forEach((sec) => {
        sec.classList.add('section');
      });
      const sectionMetas = decoratedMenu.querySelectorAll('.section-metadata');
      sectionMetas.forEach(async (meta) => {
        const { default: sectionMetadata } = await import(
          '../../../section-metadata/section-metadata.js'
        );
        sectionMetadata(meta);
      });
      navItem.appendChild(decoratedMenu);
    }
  });
};

export default { decorateMenu, decorateLargeMenu };
