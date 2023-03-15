import {
  getConfig,
  getMetadata,
  loadScript,
  localizeLink,
  loadStyle,
} from '../../utils/utils.js';
import { toFragment, getFedsPlaceholderConfig, getAnalyticsValue, decorateCta } from './utilities/utilities.js';
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
  const { miloLibs, codeRoot } = getConfig();
  return new Promise((resolve) => {
    loadStyle(`${miloLibs || codeRoot}/blocks/global-navigation/${path}`, resolve);
  });
};

const loadBlock = (path) => import(path)
  .then((module) => module.default);

class Gnav {
  constructor(body, el) {
    this.blocks = {
      profile: {
        blockEl: body.querySelector('.profile'),
        decoratedEl: toFragment`<div class="feds-profile"></div>`,
        config: {},
      },
      search: { config: { icon: CONFIG.icons.search } },
    };

    this.el = el;
    this.body = body;
    this.isDesktop = window.matchMedia('(min-width: 900px)');
    this.elements = {};
    body.querySelectorAll('[class$="-"]').forEach((block) => {
      const { name, variants } = getBlockClasses(block.className);
      block.classList.add(name, ...variants);
    });
  }

  init = () => {
    this.elements.curtain = toFragment`<div class="feds-curtain"></div>`;

    this.elements.navWrapper = toFragment`
      <div class="feds-nav-wrapper">
        ${this.isDesktop.matches ? '' : this.decorateBreadcrumbs()}
        ${this.isDesktop.matches ? '' : this.decorateSearch()}
        ${this.decorateMainNav()}
        ${this.isDesktop.matches ? this.decorateSearch() : ''}
      </div>`;

    this.elements.topnav = toFragment`
      <nav class="feds-topnav" aria-label="Main">
        <div class="feds-brand-container">
          ${this.mobileToggle()}
          ${this.decorateBrand()}
        </div>
        ${this.elements.navWrapper}
        ${this.blocks.profile.blockEl && this.blocks.profile.decoratedEl}
        ${this.decorateLogo()}
      </nav>
    `;

    this.elements.topnavWrapper = toFragment`<div class="feds-topnav-wrapper">
        ${this.elements.topnav}
        ${this.isDesktop.matches ? this.decorateBreadcrumbs() : ''}
      </div>`;

    this.el.addEventListener('click', this.loadDelayed);
    setTimeout(() => this.loadDelayed(), 3000);
    this.loadIMS();
    this.el.append(this.elements.curtain, this.elements.topnavWrapper);

    // Ensure correct DOM order for elements between mobile and desktop
    this.isDesktop.addEventListener('change', () => {
      if (this.isDesktop.matches) {
        // On desktop, search is after nav
        if (this.elements.mainNav instanceof HTMLElement
          && this.elements.search instanceof HTMLElement) {
          this.elements.mainNav.after(this.elements.search);
        }

        // On desktop, breadcrumbs are below the whole nav
        if (this.elements.topnav instanceof HTMLElement
          && this.elements.breadcrumbsWrapper instanceof HTMLElement) {
          this.elements.topnav.after(this.elements.breadcrumbsWrapper);
        }
      } else {
        // On mobile, nav is after search
        if (this.elements.mainNav instanceof HTMLElement
          && this.elements.search instanceof HTMLElement) {
          this.elements.mainNav.before(this.elements.search);
        }

        // On mobile, breadcrumbs are before the search and nav
        if (this.elements.navWrapper instanceof HTMLElement
          && this.elements.breadcrumbsWrapper instanceof HTMLElement) {
          this.elements.navWrapper.prepend(this.elements.breadcrumbsWrapper);
        }
      }
    });
  };

  loadDelayed = async () => {
    // eslint-disable-next-line no-async-promise-executor
    this.ready = this.ready || new Promise(async (resolve) => {
      this.el.removeEventListener('click', this.loadDelayed);
      const [
        { MenuControls },
        decorateDropdown,
        { appLauncher },
        Profile,
        { Search },
      ] = await Promise.all([
        loadBlock('./utilities/delayed-utilities.js'),
        loadBlock('./blocks/navDropdown/dropdown.js'),
        loadBlock('./blocks/appLauncher/appLauncher.js'),
        loadBlock('./blocks/profile/profile.js'),
        loadBlock('./blocks/search/gnav-search.js'),
        loadStyles('./blocks/profile/profile.css'),
        loadStyles('./blocks/navDropdown/dropdown.css'),
        loadStyles('./blocks/search/gnav-search.css'),
      ]);
      this.menuControls = new MenuControls(this.curtain);
      this.decorateDropdown = decorateDropdown;
      this.appLauncher = appLauncher;
      this.blocks.profile.ProfileClass = Profile;
      this.Search = Search;
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
    if (!blockEl) return;

    const accessToken = window.adobeIMS.getAccessToken();
    const { env } = getConfig();
    this.blocks.profile.profileRes = accessToken
      ? await fetch(`https://${env.adobeIO}/profile`, { headers: new Headers({ Authorization: `Bearer ${accessToken.token}` }) })
      : {};

    if (this.blocks.profile.profileRes.status !== 200) {
      const [decorateSignIn] = await Promise.all([
        loadBlock('./blocks/profile/signIn.js'),
        loadStyles('./blocks/profile/signIn.css'),
      ]);
      const signInEl = await decorateSignIn({ blockEl, decoratedEl });
      decoratedEl.append(signInEl);
      window.addEventListener('feds:profileSignIn:clicked', async () => {
        await this.loadDelayed();
        this.menuControls.toggleMenu(decoratedEl);
      });
      return;
    }

    const [
      { sections, user: { avatar } },
      { initProfileButton, initProfileMenu },
    ] = await Promise.all([
      this.blocks.profile.profileRes.json(),
      loadBlock('./blocks/profile/milo-wrapper.js'),
      loadStyles('./blocks/profile/milo-wrapper.css'),
    ]);
    this.blocks.profile.sections = sections;
    this.blocks.profile.avatar = avatar;

    const profileButtonEl = await initProfileButton(this.blocks.profile);
    decoratedEl.append(profileButtonEl);
    window.addEventListener('feds:profileButton:clicked', async () => {
      if (!this.blocks.profile.menu) {
        await this.loadDelayed();
        this.blocks.profile.menu = initProfileMenu(this.blocks.profile);
        const appLauncherBlock = this.body.querySelector('.app-launcher');
        if (appLauncherBlock) {
          this.appLauncher(
            decoratedEl,
            appLauncherBlock,
            this.menuControls.toggleMenu,
          );
        }
      }
      this.menuControls.toggleMenu(decoratedEl);
    });
  };

  loadSearch = () => {
    if (this.blocks?.search?.instance) return null;

    return this.loadDelayed().then(() => {
      this.blocks.search.instance = new this.Search(this.blocks.search.config);
    });
  };

  mobileToggle = () => {
    const toggle = toFragment`<button class="gnav-toggle" aria-label="Navigation menu" aria-expanded="false"></button>`;
    const onMediaChange = (e) => {
      if (e.matches) {
        this.el.classList.remove(IS_OPEN);
        this.elements.curtain.classList.remove(IS_OPEN);

        if (this.blocks?.search?.instance) {
          this.blocks.search.instance.clearSearchForm();
        }
      }
    };

    const setHamburgerPadding = () => {
      if (this.isDesktop.matches) {
        this.elements.mainNav.style.removeProperty('padding-bottom');
      } else {
        const offset = Math.ceil(this.elements.topnavWrapper.getBoundingClientRect().bottom);
        this.elements.mainNav.style.setProperty('padding-bottom', `${offset}px`);
      }
    };

    this.isDesktop.addEventListener('change', () => {
      setHamburgerPadding();
    });

    toggle.addEventListener('click', async () => {
      if (this.el.classList.contains(IS_OPEN)) {
        this.el.classList.remove(IS_OPEN);
        this.elements.curtain.classList.remove(IS_OPEN);
        if (this.blocks?.search?.instance) {
          this.blocks.search.instance.clearSearchForm();
        }
        this.isDesktop.removeEventListener('change', onMediaChange);

        this.elements.mainNav.style.removeProperty('padding-bottom');
      } else {
        this.el.classList.add(IS_OPEN);
        this.elements.curtain.classList.add(IS_OPEN);
        this.isDesktop.addEventListener('change', onMediaChange);
        this.loadSearch();

        setHamburgerPadding();
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
    this.elements.mainNav = toFragment`<div class="feds-nav"></div>`;

    const items = this.body.querySelectorAll('h2, p:only-child > strong > a, p:only-child > em > a');
    items.forEach((item, index) => this.elements.mainNav
      .appendChild(this.decorateMainNavItem(item, index)));

    return this.elements.mainNav;
  };

  // eslint-disable-next-line class-methods-use-this
  getMainNavItemType = (item) => {
    const itemTopParent = item.closest('div');
    const hasSyncDropdown = itemTopParent instanceof HTMLElement
      && itemTopParent.childElementCount > 1;
    if (hasSyncDropdown) return 'syncDropdownTrigger';
    const hasAsyncDropdown = itemTopParent instanceof HTMLElement
      && itemTopParent.closest('.large-menu') instanceof HTMLElement;
    if (hasAsyncDropdown) return 'asyncDropdownTrigger';
    const isPrimaryCta = item.closest('strong') instanceof HTMLElement;
    if (isPrimaryCta) return 'primaryCta';
    const isSecondaryCta = item.closest('em') instanceof HTMLElement;
    if (isSecondaryCta) return 'secondaryCta';
    const isText = !(item.querySelector('a') instanceof HTMLElement);
    if (isText) return 'text';
    return 'link';
  };

  decorateMainNavItem = (item, index) => {
    const itemType = this.getMainNavItemType(item);

    // All dropdown decoration is delayed
    const delayDropdownDecoration = (template) => {
      let decorationTimeout;

      const decorateDropdown = async () => {
        template.removeEventListener('click', decorateDropdown);
        clearTimeout(decorationTimeout);
        await this.loadDelayed();
        this.decorateDropdown({
          item,
          template,
          type: itemType,
        });
      };

      template.addEventListener('click', decorateDropdown);
      decorationTimeout = setTimeout(decorateDropdown, 3000);
    };

    // Decorate item based on its type
    switch (itemType) {
      case 'syncDropdownTrigger':
      case 'asyncDropdownTrigger': {
        const dropdownTrigger = toFragment`<a
          href="#"
          class="feds-navLink feds-navLink--hoverCaret"
          role="button"
          aria-expanded="false"
          aria-haspopup="true"
          daa-ll="${getAnalyticsValue(item.textContent, index + 1)}"
          daa-lh="header|Open">
            ${item.textContent.trim()}
          </a>`;

        const isSectionMenu = item.closest('.section') instanceof HTMLElement;
        const triggerTemplate = toFragment`
          <div class="feds-navItem${isSectionMenu ? ' feds-navItem--section' : ''}">
            ${dropdownTrigger}
          </div>`;
        // TODO: move proper logic to accessibility,
        // this is just for demo functionality purposes
        dropdownTrigger.addEventListener('click', (e) => {
          e.preventDefault();

          const openPopup = document.querySelector('.feds-navLink[aria-expanded = "true"]');

          if (openPopup && openPopup !== dropdownTrigger) {
            openPopup.setAttribute('aria-expanded', 'false');
            openPopup.setAttribute('daa-lh', 'header|Open');
          }

          const currentState = dropdownTrigger.getAttribute('aria-expanded');

          if (currentState === 'false') {
            dropdownTrigger.setAttribute('aria-expanded', 'true');
            dropdownTrigger.setAttribute('daa-lh', 'header|Close');
          } else {
            dropdownTrigger.setAttribute('aria-expanded', 'false');
            dropdownTrigger.setAttribute('daa-lh', 'header|Open');
          }
        });
        delayDropdownDecoration(triggerTemplate);
        return triggerTemplate;
      }
      case 'primaryCta':
      case 'secondaryCta':
        return toFragment`<div class="feds-navItem feds-navItem--centered">
            ${decorateCta({ elem: item, type: itemType, index: index + 1 })}
          </div>`;
      case 'link': {
        const linkElem = item.querySelector('a');
        const navLink = toFragment`<a
          href="${localizeLink(linkElem.href)}"
          class="feds-navLink"
          daa-ll="${getAnalyticsValue(linkElem.textContent, index + 1)}">
            ${linkElem.textContent.trim()}
          </a>`;

        const linkTemplate = toFragment`
          <div class="feds-navItem">
            ${navLink}
          </div>`;
        return linkTemplate;
      }
      case 'text':
        return toFragment`<div class="feds-navItem feds-navItem--centered">
            ${item.textContent}
          </div>`;
      default:
        return toFragment`<div class="feds-navItem feds-navItem--centered">
            ${item}
          </div>`;
    }
  };

  decorateSearch = () => {
    const searchBlock = this.body.querySelector('.search');

    if (!searchBlock) return null;

    this.blocks.search.config.curtain = this.elements.curtain;

    this.blocks.search.config.trigger = toFragment`
      <button class="feds-search-trigger" aria-label="Search" aria-expanded="false" aria-controls="feds-search-bar" daa-ll="Search">
        ${this.blocks.search.config.icon}
        <span class="feds-search-close"></span>
      </button>`;

    this.elements.search = toFragment`
      <div class="feds-search">
        ${this.blocks.search.config.trigger}
      </div>`;

    // Replace the aria-label value once placeholder is fetched
    replaceKey('search', getFedsPlaceholderConfig()).then((placeholder) => {
      if (placeholder && placeholder.length) {
        this.blocks.search.config.trigger.setAttribute('aria-label', placeholder);
      }
    });

    this.blocks.search.config.trigger.addEventListener('click', async () => {
      await this.loadSearch();
    });

    return this.elements.search;
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
        this.elements.breadcrumbsWrapper = toFragment`<div class="feds-breadcrumbs-wrapper">
            <nav class="feds-breadcrumbs" aria-label="Breadcrumb">${ul}</nav>
          </div>`;
        parent.remove();
        return this.elements.breadcrumbsWrapper;
      }
    }

    return null;
  };
  /* c8 ignore stop */
}

export default async function init(header) {
  const { locale, imsClientId } = getConfig();
  // TODO locale.contentRoot is not the fallback we want
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
