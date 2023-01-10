import {
  getConfig,
  getMetadata,
  loadScript,
  localizeLink,
  loadStyle,
} from '../../utils/utils.js';
import { analyticsGetLabel } from '../../martech/attributes.js';
import { toFragment } from './utilities.js';

const CONFIG = {
 search: {
  icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" focusable="false"><path d="M14 2A8 8 0 0 0 7.4 14.5L2.4 19.4a1.5 1.5 0 0 0 2.1 2.1L9.5 16.6A8 8 0 1 0 14 2Zm0 14.1A6.1 6.1 0 1 1 20.1 10 6.1 6.1 0 0 1 14 16.1Z"></path></svg>',
 },
};

const COMPANY_IMG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 133.46 118.11"><defs><style>.cls-1{fill:#fa0f00;}</style></defs><polygon class="cls-1" points="84.13 0 133.46 0 133.46 118.11 84.13 0"/><polygon class="cls-1" points="49.37 0 0 0 0 118.11 49.37 0"/><polygon class="cls-1" points="66.75 43.53 98.18 118.11 77.58 118.11 68.18 94.36 45.18 94.36 66.75 43.53"/></svg>';
const BRAND_IMG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 234"><defs><style>.cls-1{fill:#fa0f00;}.cls-2{fill:#fff;}</style></defs><rect class="cls-1" width="240" height="234" rx="42.5"/><path id="_256" data-name="256" class="cls-2" d="M186.617,175.95037H158.11058a6.24325,6.24325,0,0,1-5.84652-3.76911L121.31715,99.82211a1.36371,1.36371,0,0,0-2.61145-.034l-19.286,45.94252A1.63479,1.63479,0,0,0,100.92626,148h21.1992a3.26957,3.26957,0,0,1,3.01052,1.99409l9.2814,20.65452a3.81249,3.81249,0,0,1-3.5078,5.30176H53.734a3.51828,3.51828,0,0,1-3.2129-4.90437L99.61068,54.14376A6.639,6.639,0,0,1,105.843,50h28.31354a6.6281,6.6281,0,0,1,6.23289,4.14376L189.81885,171.046A3.51717,3.51717,0,0,1,186.617,175.95037Z"/></svg>';
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
};

class Gnav {
  constructor(body, el) {
    this.imsReady = new Promise((resolve) => { this.resolveIms = resolve; });
    this.blocks = {};
    this.el = el;
    this.body = body;
    this.desktop = window.matchMedia('(min-width: 1200px)');
    body.querySelectorAll('[class$="-"]').forEach((block) => {
      const { name, variants } = getBlockClasses(block.className);
      block.classList.add(name, ...variants);
    });
  }

  init = () => {
    this.curtain = toFragment`<div class="gnav-curtain"></div>`;
    const nav = toFragment`
      <div class="gnav-wrapper">
        <nav class="gnav" aria-label="Main">
          ${this.mobileToggle()}
          ${this.decorateBrand()}
          <div class="mainnav-wrapper">
            ${this.decorateMainNav()}
            ${this.decorateSearch()}
          </div>
          ${this.decorateProfile()}
          ${this.decorateLogo()}
        </nav>
        ${this.decorateBreadcrumbs()}
      </div>
    `;
    this.el.addEventListener('click', this.loadDelayed);
    setTimeout(() => this.loadDelayed(), 3000);
    this.el.append(this.curtain, nav);
  };

  loadDelayed = async () => {
    this.ready = this.ready || new Promise(async (resolve) => {
      this.el.removeEventListener('click', this.loadDelayed);
      const [
        { MenuControls },
        { decorateMenu, decorateLargeMenu },
        { appLauncher },
        { profile },
        { Search },
      ] = await Promise.all([
        loadBlock('./delayed-utilities.js'),
        loadBlock('./blocks/navMenu/menu.js'),
        loadBlock('./blocks/appLauncher/appLauncher.js'),
        loadBlock('./blocks/profile/profile.js'),
        loadBlock('./blocks/search/gnav-search.js'),
        loadStyles('navMenu/menu.css'),
        loadStyles('search/gnav-search.css'),
      ]);
      this.menuControls = new MenuControls();
      this.decorateMenu = decorateMenu;
      this.decorateLargeMenu = decorateLargeMenu;
      this.appLauncher = appLauncher;
      this.profile = profile;
      this.search = Search;

      this.imsReady
        .then(({ blockEl, profileEl }) => {
          this.decorateProfileMenu(blockEl, profileEl);
        });
      resolve();
    });
    return this.ready;
  };

  decorateProfileMenu = async (blockEl, profileEl) => {
    const accessToken = window.adobeIMS.getAccessToken();
    if (accessToken) {
      const { env } = getConfig();
      const ioResp = await fetch(`https://${env.adobeIO}/profile`, { headers: new Headers({ Authorization: `Bearer ${accessToken.token}` }) });

      if (ioResp.status === 200) {
        this.profile(blockEl, profileEl, this.menuControls.toggleMenu, ioResp);
        const appLauncherBlock = this.body.querySelector('.app-launcher');
        if (appLauncherBlock) {
          this.appLauncher(profileEl, appLauncherBlock, this.menuControls.toggleMenu);
        }
      } else {
        this.decorateSignIn(blockEl, profileEl);
      }
    } else {
      this.decorateSignIn(blockEl, profileEl);
    }
  };

  loadSearch = () => {
    if (this.blocks?.search?.instance) return this.loadDelayed();
    return this.loadDelayed().then(() => {
      this.blocks.search.instance = new this.search(this.blocks.search.config);
    });
  };

  mobileToggle = () => {
    const toggle = toFragment`<button class="gnav-toggle" aria-label="Navigation menu" aria-expanded="false"></button>`;
    const onMediaChange = (e) => e.matches && this.el.classList.remove(IS_OPEN);
    toggle.addEventListener('click', async () => {
      if (this.el.classList.contains(IS_OPEN)) {
        this.el.classList.remove(IS_OPEN);
        this.desktop.removeEventListener('change', onMediaChange);
      } else {
        this.el.classList.add(IS_OPEN);
        this.desktop.addEventListener('change', onMediaChange);
        this.loadSearch();
      }
    });
    return toggle;
  };

  decorateBrand = () => {
    const brandBlock = this.body.querySelector('[class^="gnav-brand"]');
    if (!brandBlock) return null;
    const brandLinks = [...brandBlock.querySelectorAll('a')];
    const brand = brandLinks.pop();
    return toFragment`
      <a
        href="${brand.getAttribute('href')}"
        class="${brandBlock.className}"
        aria-label="${brand.textContent}"
        daa-ll="Brand"
      >
        ${BRAND_IMG}
        <span class="gnav-brand-title"> ${brand.textContent} </span>
      </a>
    `;
  };

  decorateLogo = () => {
    const logo = this.body.querySelector('.adobe-logo a');
    return toFragment`
      <a
        href="https://www.adobe.com/"
        class="gnav-logo"
        aria-label="${logo.textContent}"
        daa-ll="Logo"
      >
        ${COMPANY_IMG}
      </a>
    `;
  };

  decorateMainNav = () => {
    const mainNav = toFragment`<div class="gnav-mainnav"></div>`;
    const links = this.body.querySelectorAll('h2 > a');
    links.forEach((link, i) => mainNav.appendChild(this.navLink(link, i)));
    mainNav.appendChild(this.decorateCta());
    return mainNav;
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

    this.blocks = this.blocks || {};
    this.blocks.search = {
      config: {},
    };

    // TODO: Retrieve all types of labels through placeholders
    this.blocks.search.config.label = searchBlock.querySelector('p').textContent;
    this.blocks.search.config.icon = CONFIG.search.icon;

    this.blocks.search.config.trigger = toFragment`
      <button class="feds-search-trigger" aria-label="${this.blocks.search.config.label}" aria-expanded="false" aria-controls="feds-search-bar" daa-ll="Search">
        ${this.blocks.search.config.icon}
        <span class="feds-search-close"></span>
      </button>`;

    const searchEl = toFragment`
      <div class="feds-search">
        ${this.blocks.search.config.trigger}
      </div>`;

    this.blocks.search.config.trigger.addEventListener('click', async () => {
      await this.loadSearch();
      this.menuControls.toggleMenu(searchEl);
    });

    return searchEl;
  };

  decorateProfile = () => {
    const blockEl = this.body.querySelector('.profile');
    if (!blockEl) return null;
    const profileEl = toFragment`<div class="gnav-profile"></div>`;
    if (blockEl.children.length > 1) profileEl.classList.add('has-menu');

    const { locale, imsClientId, env } = getConfig();
    if (!imsClientId) return null;
    window.adobeid = {
      client_id: imsClientId,
      scope: 'AdobeID,openid,gnav',
      locale: locale || 'en-US',
      autoValidateToken: true,
      environment: env.ims,
      useLocalStorage: false,
      onReady: () => this.resolveIms({ blockEl, profileEl }),
    };
    loadScript('https://auth.services.adobe.com/imslib/imslib.min.js');
    return profileEl;
  };

  decorateSignIn = (blockEl, profileEl) => {
    const dropDown = blockEl.querySelector(':scope > div:nth-child(2)');
    const signIn = blockEl.querySelector('a');

    signIn.classList.add('gnav-signin');
    signIn.setAttribute('daa-ll', 'Sign In');

    const signInEl = dropDown?.querySelector('li:last-of-type a') || profileEl;

    if (dropDown) {
      const id = `navmenu-${blockEl.className}`;
      dropDown.id = id;
      profileEl.classList.add('gnav-navitem');
      profileEl.insertAdjacentElement('beforeend', dropDown);

      this.decorateMenu(profileEl, signIn, dropDown);
      setNavLinkAttributes(id, signIn);
    }
    signInEl.addEventListener('click', (e) => {
      e.preventDefault();
      window.adobeIMS.signIn();
    });
    profileEl.append(signIn);
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
        const nav = toFragment`<nav class="breadcrumbs" aria-label="Breadcrumb">${ul}</nav>`;
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
    // TODO remove header.classList.add('gnav') as global-navigation gets renamed to gnav
    // or rename the classes to global-navigation
    header.classList.add('gnav');
    gnav.init();
    header.setAttribute('daa-im', 'true');
    header.setAttribute('daa-lh', `gnav${imsClientId ? `|${imsClientId}` : ''}`);
    return gnav;
  } catch (e) {
    console.log('Could not create global navigation:', e);
    return null;
  }
}
