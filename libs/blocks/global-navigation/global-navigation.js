import {
  getConfig,
  getMetadata,
  loadScript,
  localizeLink,
  loadStyle,
} from '../../utils/utils.js';
import { analyticsGetLabel } from '../../martech/attributes.js';
import { toFragment } from './utilities.js';
import { replaceKey } from '../../features/placeholders.js';

const CONFIG = {
  icons: {
    company: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 133.46 118.11"><defs><style>.cls-1{fill:#fa0f00;}</style></defs><polygon class="cls-1" points="84.13 0 133.46 0 133.46 118.11 84.13 0"/><polygon class="cls-1" points="49.37 0 0 0 0 118.11 49.37 0"/><polygon class="cls-1" points="66.75 43.53 98.18 118.11 77.58 118.11 68.18 94.36 45.18 94.36 66.75 43.53"/></svg>',
    search: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" focusable="false"><path d="M14 2A8 8 0 0 0 7.4 14.5L2.4 19.4a1.5 1.5 0 0 0 2.1 2.1L9.5 16.6A8 8 0 1 0 14 2Zm0 14.1A6.1 6.1 0 1 1 20.1 10 6.1 6.1 0 0 1 14 16.1Z"></path></svg>',
  },
};

export const IS_OPEN = 'is-open';

function getBlockClasses(className) {
  const trimDashes = (str) => str.replace(/(^\s*-)|(-\s*$)/g, '');
  const blockWithVariants = className.split('--');
  const name = trimDashes(blockWithVariants.shift());
  const variants = blockWithVariants.map((v) => trimDashes(v));
  return { name, variants };
}

const loadStyles = (path) => {
  const { codeRoot } = getConfig();
  return new Promise((resolve) => {
    loadStyle(`${codeRoot}/blocks/global-navigation/blocks/${path}`, resolve);
  });
};

const loadBlock = (path) => import(path)
  .then((module) => module.default);

const setNavLinkAttributes = (id, navLink) => {
  navLink.setAttribute('role', 'button');
  navLink.setAttribute('aria-expanded', false);
  navLink.setAttribute('aria-controls', id);
  navLink.setAttribute('daa-ll', navLink.textContent);
  navLink.setAttribute('daa-lh', 'header|Open');
  navLink.setAttribute('aria-haspopup', true);
};

class Gnav {
  constructor(body, el) {
    this.blocks = {
      profile: {
        blockEl: body.querySelector('.profile'),
        decoratedEl: toFragment`<div class="feds-profile"></div>`,
      },
      search: {
        config: {
          icon: CONFIG.icons.search,
        },
      },
    };

    this.el = el;
    this.body = body;
    this.desktop = window.matchMedia('(min-width: 1200px)');
    body.querySelectorAll('[class$="-"]').forEach((block) => {
      const { name, variants } = getBlockClasses(block.className);
      block.classList.add(name, ...variants);
    });
  }

  init = () => {
    this.curtain = toFragment`<div class="feds-curtain"></div>`;

    this.navWrapper = toFragment`
      <div class="feds-nav-wrapper">
        ${this.decorateBreadcrumbs()}
        ${this.decorateMainNav()}
        ${this.decorateSearch()}
      </div>`;

    this.nav = toFragment`
      <div class="feds-topnav-wrapper">
        <nav class="feds-topnav" aria-label="Main">
          <div class="feds-brand-container">
            ${this.mobileToggle()}
            ${this.decorateBrand()}
          </div>
          ${this.navWrapper}
          ${this.blocks.profile.blockEl && this.blocks.profile.decoratedEl}
          ${this.decorateLogo()}
        </nav>
      </div>
    `;
    this.el.addEventListener('click', this.loadDelayed);
    setTimeout(() => this.loadDelayed(), 3000);
    this.loadIMS();
    this.el.append(this.curtain, this.nav);
  };

  loadDelayed = async () => {
    // eslint-disable-next-line no-async-promise-executor
    this.ready = this.ready || new Promise(async (resolve) => {
      this.el.removeEventListener('click', this.loadDelayed);
      const [
        { MenuControls },
        { decorateMenu, decorateLargeMenu },
        { appLauncher },
        Profile,
        { Search },
      ] = await Promise.all([
        loadBlock('./delayed-utilities.js'),
        loadBlock('./blocks/navMenu/menu.js'),
        loadBlock('./blocks/appLauncher/appLauncher.js'),
        loadBlock('./blocks/profile/profile.js'),
        loadBlock('./blocks/search/gnav-search.js'),
        loadStyles('profile/profile.css'),
        loadStyles('navMenu/menu.css'),
        loadStyles('search/gnav-search.css'),
      ]);
      this.menuControls = new MenuControls(this.curtain);
      this.decorateMenu = decorateMenu;
      this.decorateLargeMenu = decorateLargeMenu;
      this.appLauncher = appLauncher;
      this.Profile = Profile;
      this.search = Search;
      resolve();
    });
    return this.ready;
  };

  loadIMS = () => {
    const { locale, imsClientId, env } = getConfig();
    if (!imsClientId) return null;
    // TODO-1 scopes should be defineable by the consumers
    // We didn't have a use-case for that so far
    // TODO-2 we should emit an event after the onReady callback
    window.adobeid = {
      client_id: imsClientId,
      scope: 'AdobeID,openid,gnav',
      locale: locale || 'en-US',
      autoValidateToken: true,
      environment: env.ims,
      useLocalStorage: false,
      onReady: () => this.decorateProfile(),
    };
    const imsScript = document.querySelector('script[src$="/imslib.min.js"]') instanceof HTMLElement;
    if (!imsScript && !window.adobeIMS) {
      loadScript('https://auth.services.adobe.com/imslib/imslib.min.js');
    }
    return null;
  };

  decorateProfile = async () => {
    const { blockEl, decoratedEl } = this.blocks.profile;
    if (!blockEl) return null;

    const accessToken = window.adobeIMS.getAccessToken();
    const { env } = getConfig();
    const profileRes = accessToken
      ? await fetch(`https://${env.adobeIO}/profile`, { headers: new Headers({ Authorization: `Bearer ${accessToken.token}` }) })
      : {};
    if (profileRes.status !== 200) return this.decorateSignIn();

    if (blockEl.children.length > 1) decoratedEl.classList.add('has-menu');
    decoratedEl.closest('nav.gnav')?.classList.add('signed-in');
    const { sections, user: { avatar } } = await profileRes.json();
    const avatarImgEl = toFragment`<img class="feds-profile-img" src="${avatar}"></img>`;
    const profileButtonEl = toFragment`
        <button 
          class="feds-profile-button" 
          aria-expanded="false" 
          aria-controls="feds-profile-menu"
          aria-label="Profile button"
          daa-ll="Account"
          aria-haspopup="true"
        > 
          ${avatarImgEl}
        </button>
      `;
    this.decorateProfileMenu({ avatarImgEl, sections, profileRes, profileButtonEl });
    decoratedEl.append(profileButtonEl);
    return null;
  };

  decorateProfileMenu = ({ avatarImgEl, sections, profileRes, profileButtonEl }) => {
    const { blockEl, decoratedEl } = this.blocks.profile;
    let decorating;
    const decorate = async (event) => {
      if (decorating) return;
      decorating = true;
      await this.loadDelayed();

      // Forward click on the profile button it was clicked. Otherwise users need to click twice
      if (event) {
        decoratedEl.addEventListener('feds:events:profileReady', () => decoratedEl.click(), { once: true });
      }

      // TODO integrate placeholders here
      this.blocks.profile.instance = new this.Profile({
        accountLinkEl: blockEl.querySelector('div > div > p:nth-child(2) a'), // TODO placeholders
        manageTeamsEl: blockEl.querySelector('div > div > p:nth-child(3) a'), // TODO placeholders
        manageEnterpriseEl: blockEl.querySelector('div > div > p:nth-child(4) a'), // TODO placeholders
        signOutEl: blockEl.querySelector('div > div > p:nth-child(5) a'), // TODO placeholders
        localMenu: blockEl.querySelector('h5')?.parentElement,
        toggleMenu: this.menuControls.toggleMenu,
        decoratedEl,
        avatarImgEl,
        sections,
        profileRes,
        profileButtonEl,
      });

      const appLauncherBlock = this.body.querySelector('.app-launcher');
      if (appLauncherBlock) {
        this.appLauncher(
          decoratedEl,
          appLauncherBlock,
          this.menuControls.toggleMenu,
        );
      }
      decoratedEl.removeEventListener('click', decorate);
    };

    decoratedEl.addEventListener('click', decorate);
    setTimeout(decorate, 3000);
  };

  loadSearch = () => {
    if (this.blocks?.search?.instance) return this.loadDelayed();
    return this.loadDelayed().then(() => {
      // TODO: figure out if instance is actually needed for further use
      this.blocks.search.instance = new this.search(this.blocks.search.config);
    });
  };

  mobileToggle = () => {
    const toggle = toFragment`<button class="gnav-toggle" aria-label="Navigation menu" aria-expanded="false"></button>`;
    const onMediaChange = (e) => e.matches && this.el.classList.remove(IS_OPEN);

    // TODO: better bottom padding logic
    let eventTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(eventTimeout);

      eventTimeout = setTimeout(() => {
        if (document.documentElement.scrollWidth < 900) {
          const offset = this.nav.getBoundingClientRect().bottom;
          this.mainNav.style.setProperty('padding-bottom', `${offset}px`);
        } else {
          this.mainNav.style.removeProperty('padding-bottom');
        }
      }, 100);
    });

    toggle.addEventListener('click', async () => {
      if (this.el.classList.contains(IS_OPEN)) {
        this.el.classList.remove(IS_OPEN);
        this.desktop.removeEventListener('change', onMediaChange);

        this.mainNav.style.removeProperty('padding-bottom');
      } else {
        this.el.classList.add(IS_OPEN);
        this.desktop.addEventListener('change', onMediaChange);
        this.loadSearch();

        if (document.documentElement.scrollWidth < 900) {
          const offset = this.nav.getBoundingClientRect().bottom;
          this.mainNav.style.setProperty('padding-bottom', `${offset}px`);
        } else {
          this.mainNav.style.removeProperty('padding-bottom');
        }
      }
    });
    return toggle;
  };

  decorateBrand = () => {
    const brandBlock = this.body.querySelector('[class^="gnav-brand"]');
    if (!brandBlock) return null;
    const imgRegex = /(\.png|\.svg|\.jpg|\.jpeg)$/;
    const brandLinks = [...brandBlock.querySelectorAll('a')];
    const image = brandLinks.find((brandLink) => imgRegex.test(brandLink.href));
    const link = brandLinks.find((brandLink) => !imgRegex.test(brandLink.href));

    // TODO: add alt text if authored
    const imageEl = image ? toFragment`
      <span class="feds-brand-image"><img src="${image.textContent}"/></span>` : '';
    const labelEl = link ? toFragment`<span class="feds-brand-label">${link.textContent}</span>` : '';

    if (!imageEl && !labelEl) return '';

    return toFragment`
      <a href="${link.getAttribute('href')}" class="feds-brand" daa-ll="Brand">
        ${imageEl}
        ${labelEl}
      </a>`;
  };

  decorateLogo = () => {
    const logo = this.body.querySelector('.adobe-logo a');
    if (!logo) return null;
    return toFragment`
      <a
        href="https://www.adobe.com/"
        class="gnav-logo"
        aria-label="${logo.textContent}"
        daa-ll="Logo"
      >
        ${CONFIG.icons.company}
      </a>
    `;
  };

  decorateMainNav = () => {
    this.mainNav = toFragment`<div class="feds-nav"></div>`;
    const links = this.body.querySelectorAll('h2 > a');
    links.forEach((link, i) => this.mainNav.appendChild(this.navLink(link, i)));
    this.mainNav.appendChild(this.decorateCta());
    return this.mainNav;
  };

  navLink = (navLink, idx) => {
    navLink.href = localizeLink(navLink.href);
    const navBlock = navLink.closest('.large-menu');
    const menu = navLink.closest('div');
    menu.querySelector('h2').remove();

    const hasMenu = menu.childElementCount > 0 || navBlock ? ' has-menu' : '';
    const largeMenu = navBlock ? ' large-menu' : '';
    const sectionMenu = navBlock?.classList.contains('section')
      ? ' section-menu'
      : '';

    // All menu types
    if (hasMenu) {
      const id = `navmenu-${idx}`;
      menu.id = id;
      setNavLinkAttributes(id, navLink);
    }

    const navItem = toFragment`
      <div class="gnav-navitem${hasMenu}${largeMenu}${sectionMenu}">
        ${navLink}
      </div>
    `;

    let decorating;
    const decorate = async (event) => {
      if (event) event.preventDefault();
      if (decorating) return;
      decorating = true;
      await this.loadDelayed();
      // Small and medium menu types
      if (menu.childElementCount > 0) {
        navItem.appendChild(this.decorateMenu(navItem, navLink, menu, this.menuControls));
      }

      // Large Menus & Section Nav
      if (navBlock) await this.decorateLargeMenu(navLink, navItem, menu, this.menuControls);

      navLink.removeEventListener('click', decorate);
      if (event) navLink.click();
    };

    // Load the menu as fast as possible if it has been clicked
    if (menu.childElementCount > 0 || navBlock) {
      navLink.addEventListener('click', decorate);
      setTimeout(decorate, 3000);
    }

    return navItem;
  };

  decorateCta = () => {
    const cta = this.body.querySelector('strong a');
    const { origin } = new URL(cta.href);
    return toFragment`
      <strong class="gnav-cta">
        <a 
          href="${cta.getAttribute('href')}"
          class="con-button blue button-M" 
          daa-ll="${analyticsGetLabel(cta.textContent)}"
          target="${origin === window.location.origin ? '' : '_blank'}"
        >
          ${cta.textContent}
        </a>
      </strong>
    `;
  };

  decorateSearch = () => {
    const searchBlock = this.body.querySelector('.search');

    if (!searchBlock) return null;

    this.blocks.search.config.parent = this.navWrapper;

    this.blocks.search.config.trigger = toFragment`
      <button class="feds-search-trigger" aria-label="Search" aria-expanded="false" aria-controls="feds-search-bar" daa-ll="Search">
        ${this.blocks.search.config.icon}
        <span class="feds-search-close"></span>
      </button>`;

    const searchEl = toFragment`
      <div class="feds-search">
        ${this.blocks.search.config.trigger}
      </div>`;

    const config = getConfig();
    const sheet = 'feds';
    // Replace the aria-label value once placeholder is fetched
    replaceKey('search', config, sheet).then((placeholder) => {
      if (placeholder && placeholder.length) {
        this.blocks.search.config.trigger.setAttribute('aria-label', placeholder);
      }
    });

    this.blocks.search.config.trigger.addEventListener('click', async () => {
      await this.loadSearch();
      this.menuControls.toggleMenu(searchEl);
    });

    return searchEl;
  };

  decorateSignIn = () => {
    const { blockEl, decoratedEl } = this.blocks.profile;
    const dropDown = blockEl.querySelector(':scope > div:nth-child(2)');
    // TODO use placeholders
    const signIn = toFragment`<a href="#" daa-ll="Sign In" class="feds-signin">Sign in</a>`;
    const id = `navmenu-${blockEl.className}`;
    const signInEl = dropDown?.querySelector('li:last-of-type a') || decoratedEl;
    decoratedEl.append(signIn);
    if (!dropDown) {
      signInEl.addEventListener('click', (e) => {
        e.preventDefault();
        window.adobeIMS.signIn();
      });
      return;
    }
    dropDown.id = id;
    decoratedEl.classList.add('gnav-navitem');
    decoratedEl.classList.add('has-menu');
    let decorating;
    const decorate = async (event) => {
      if (event) event.preventDefault();
      if (decorating) return;
      decorating = true;
      await this.loadDelayed();
      setNavLinkAttributes(id, signIn);
      decoratedEl.insertAdjacentElement('beforeend', dropDown);

      // TODO we don't have a good way of adding attributes to links
      const dropDownSignIn = dropDown.querySelector('[href="https://adobe.com?sign-in=true"]');
      if (dropDownSignIn) {
        dropDownSignIn.addEventListener('click', (e) => {
          e.preventDefault();
          window.adobeIMS.signIn();
        });
      }
      this.decorateMenu(decoratedEl, signIn, dropDown, this.menuControls);
      if (event) signIn.click();
      signIn.removeEventListener('click', decorate);
    };

    // Load the menu as fast as possible if it has been clicked
    signIn.addEventListener('click', decorate);
    setTimeout(decorate, 3000);
  };

  setBreadcrumbSEO = () => {
    const seoEnabled = getMetadata('breadcrumb-seo') !== 'off';
    if (!seoEnabled) return;
    const breadcrumb = this.el.querySelector('.breadcrumbs');
    if (!breadcrumb) return;
    const breadcrumbSEO = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [] };
    const items = breadcrumb.querySelectorAll('ul > li');
    items.forEach((item, idx) => {
      const link = item.querySelector('a');
      breadcrumbSEO.itemListElement.push({
        '@type': 'ListItem',
        position: idx + 1,
        name: link ? link.innerHTML : item.innerHTML,
        item: link?.href,
      });
    });
    const script = toFragment`<script type="application/ld+json">${JSON.stringify(breadcrumbSEO)}</script>`;
    document.head.append(script);
  };

  decorateBreadcrumbs = () => {
    this.setBreadcrumbSEO();
    const parent = this.el.querySelector('.breadcrumbs');
    if (parent) {
      const ul = parent.querySelector('ul');
      if (ul) {
        ul.querySelector('li:last-of-type')?.setAttribute('aria-current', 'page');
        const nav = toFragment`<nav class="feds-breadcrumbs" aria-label="Breadcrumb">${ul}</nav>`;
        parent.remove();
        return nav;
      }
    }

    return null;
  };
  /* c8 ignore stop */
}

export default async function init(header) {
  const { locale, imsClientId } = getConfig();
  const url = getMetadata('gnav-source') || `${locale.contentRoot}/gnav`;
  const resp = await fetch(`${url}.plain.html`);
  const html = await resp.text();
  if (!html) return null;
  try {
    const gnav = new Gnav(new DOMParser().parseFromString(html, 'text/html').body, header);
    gnav.init();
    header.setAttribute('daa-im', 'true');
    header.setAttribute('daa-lh', `gnav${imsClientId ? `|${imsClientId}` : ''}`);
    return gnav;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('Could not create global navigation:', e);
    return null;
  }
}
