/* eslint-disable no-async-promise-executor */
import {
  getConfig,
  getMetadata,
  loadIms,
  decorateLinks,
} from '../../utils/utils.js';
import {
  toFragment,
  getFedsPlaceholderConfig,
  getAnalyticsValue,
  decorateCta,
  getExperienceName,
  loadDecorateMenu,
  loadBlock,
  loadStyles,
  trigger,
  setActiveDropdown,
  closeAllDropdowns,
  loadBaseStyles,
  yieldToMain,
  isDesktop,
  isTangentToViewport,
  setCurtainState,
  hasActiveLink,
  setActiveLink,
  getActiveLink,
  selectors,
  logErrorFor,
  lanaLog,
  processMartechAttributeMetadata,
} from './utilities/utilities.js';

import { replaceKey, replaceKeyArray, replaceText } from '../../features/placeholders.js';

const CONFIG = {
  icons: {
    company: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 133.46 118.11" alt="Adobe, Inc."><defs><style>.cls-1{fill:#fa0f00;}</style></defs><polygon class="cls-1" points="84.13 0 133.46 0 133.46 118.11 84.13 0"/><polygon class="cls-1" points="49.37 0 0 0 0 118.11 49.37 0"/><polygon class="cls-1" points="66.75 43.53 98.18 118.11 77.58 118.11 68.18 94.36 45.18 94.36 66.75 43.53"/></svg>',
    search: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" focusable="false"><path d="M14 2A8 8 0 0 0 7.4 14.5L2.4 19.4a1.5 1.5 0 0 0 2.1 2.1L9.5 16.6A8 8 0 1 0 14 2Zm0 14.1A6.1 6.1 0 1 1 20.1 10 6.1 6.1 0 0 1 14 16.1Z"></path></svg>',
  },
  delays: {
    mainNavDropdowns: 800,
    loadDelayed: 3000,
    keyboardNav: 8000,
  },
  features: [
    'gnav-brand',
    'gnav-promo',
    'search',
    'profile',
    'app-launcher',
    'adobe-logo',
  ],
};

// signIn, decorateSignIn and decorateProfileTrigger can be removed if IMS takes over the profile
const signIn = () => {
  if (typeof window.adobeIMS?.signIn !== 'function') return;

  window.adobeIMS.signIn();
};

const decorateSignIn = async ({ rawElem, decoratedElem }) => {
  const dropdownElem = rawElem.querySelector(':scope > div:nth-child(2)');
  const signInLabel = await replaceKey('sign-in', getFedsPlaceholderConfig(), 'feds');
  let signInElem;

  if (!dropdownElem) {
    signInElem = toFragment`<button daa-ll="${signInLabel}" class="feds-signIn">${signInLabel}</button>`;

    signInElem.addEventListener('click', (e) => {
      e.preventDefault();
      signIn();
    });
  } else {
    signInElem = toFragment`<button daa-ll="${signInLabel}" class="feds-signIn" aria-expanded="false" aria-haspopup="true">${signInLabel}</button>`;

    signInElem.addEventListener('click', (e) => trigger({ element: signInElem, event: e }));
    signInElem.addEventListener('keydown', (e) => e.code === 'Escape' && closeAllDropdowns());
    dropdownElem.addEventListener('keydown', (e) => e.code === 'Escape' && closeAllDropdowns());

    dropdownElem.classList.add('feds-signIn-dropdown');

    const dropdownSignInAnchor = dropdownElem.querySelector('[href$="?sign-in=true"]');
    if (dropdownSignInAnchor) {
      const dropdownSignInButton = toFragment`<button class="feds-signIn">${dropdownSignInAnchor.textContent}</button>`;
      dropdownSignInAnchor.replaceWith(dropdownSignInButton);
      dropdownSignInButton.addEventListener('click', (e) => {
        e.preventDefault();
        signIn();
      });
    } else {
      lanaLog({ message: 'Sign in link not found in dropdown.', tags: 'errorType=warn,module=gnav' });
    }

    decoratedElem.append(dropdownElem);
  }

  decoratedElem.prepend(signInElem);
};

const decorateProfileTrigger = async ({ avatar }) => {
  const [label, profileAvatar] = await replaceKeyArray(
    ['profile-button', 'profile-avatar'],
    getFedsPlaceholderConfig(),
    'feds',
  );

  const buttonElem = toFragment`
    <button
      class="feds-profile-button"
      aria-expanded="false"
      aria-controls="feds-profile-menu"
      aria-label="${label}"
      daa-ll="Account"
      aria-haspopup="true"
    >
      <img class="feds-profile-img" src="${avatar}" alt="${profileAvatar}"></img>
    </button>
  `;

  return buttonElem;
};

let keyboardNav;
const setupKeyboardNav = async () => {
  keyboardNav = keyboardNav || new Promise(async (resolve) => {
    const KeyboardNavigation = await loadBlock('./keyboard/index.js');
    const instance = new KeyboardNavigation();
    resolve(instance);
  });
};

const getBrandImage = (image) => {
  // Return the default Adobe logo if an image is not available
  if (!image) return CONFIG.icons.company;

  // Try to decorate image as PNG, JPG or JPEG
  const imgText = image?.textContent || '';
  const [source, alt] = imgText.split('|');
  if (source.trim().length) {
    const img = toFragment`<img src="${source.trim()}" />`;
    if (alt) img.alt = alt.trim();
    return img;
  }

  // Return the default Adobe logo if the image could not be decorated
  return CONFIG.icons.company;
};

const closeOnClickOutside = (e) => {
  if (!isDesktop.matches) return;

  const openElemSelector = `${selectors.globalNav} [aria-expanded = "true"]`;
  const isClickedElemOpen = [...document.querySelectorAll(openElemSelector)]
    .find((openItem) => openItem.parentElement.contains(e.target));

  if (!isClickedElemOpen) {
    closeAllDropdowns();
  }
};

class Gnav {
  constructor(body, el) {
    this.blocks = {
      profile: {
        rawElem: body.querySelector('.profile'),
        decoratedElem: toFragment`<div class="feds-profile"></div>`,
      },
      search: { config: { icon: CONFIG.icons.search } },
      breadcrumbs: { wrapper: '' },
    };

    this.el = el;
    this.body = body;
    decorateLinks(this.body);
    this.elements = {};
  }

  init = () => logErrorFor(async () => {
    this.elements.curtain = toFragment`<div class="feds-curtain"></div>`;

    // Order is important, decorateTopnavWrapper will render the nav
    // Ensure any critical task is executed before it
    const tasks = [
      loadBaseStyles,
      this.decorateMainNav,
      this.decorateTopNav,
      this.decorateAside,
      this.decorateTopnavWrapper,
      this.ims,
      this.addChangeEventListeners,
    ];
    this.el.addEventListener('click', this.loadDelayed);
    this.el.addEventListener('keydown', setupKeyboardNav);
    setTimeout(this.loadDelayed, CONFIG.delays.loadDelayed);
    setTimeout(setupKeyboardNav, CONFIG.delays.keyboardNav);
    for await (const task of tasks) {
      await yieldToMain();
      await task();
    }

    document.addEventListener('click', closeOnClickOutside);
    isDesktop.addEventListener('change', closeAllDropdowns);
  }, 'Error in global navigation init', 'errorType=error,module=gnav');

  ims = async () => loadIms()
    .then(() => this.imsReady())
    .catch((e) => {
      if (e?.message === 'IMS timeout') {
        window.addEventListener('onImsLibInstance', () => this.imsReady());
        return;
      }
      lanaLog({ message: 'GNAV: Error with IMS', e, tags: 'errorType=info,module=gnav' });
    });

  decorateTopNav = () => {
    this.elements.mobileToggle = this.decorateToggle();
    this.elements.topnav = toFragment`
      <nav class="feds-topnav" aria-label="Main">
        <div class="feds-brand-container">
          ${this.elements.mobileToggle}
          ${this.decorateBrand()}
        </div>
        ${this.elements.navWrapper}
        ${this.blocks.profile.rawElem ? this.blocks.profile.decoratedElem : ''}
        ${this.decorateLogo()}
      </nav>
    `;
  };

  decorateTopnavWrapper = async () => {
    const breadcrumbs = isDesktop.matches ? await this.decorateBreadcrumbs() : '';
    this.elements.topnavWrapper = toFragment`<div class="feds-topnav-wrapper">
        ${this.elements.topnav}
        ${breadcrumbs}
      </div>`;

    this.el.append(this.elements.curtain, this.elements.aside, this.elements.topnavWrapper);
  };

  addChangeEventListeners = () => {
    // Ensure correct DOM order for elements between mobile and desktop
    isDesktop.addEventListener('change', () => {
      if (isDesktop.matches) {
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

    // Add a modifier when the nav is tangent to the viewport and content is partly hidden
    const toggleContraction = () => {
      const isOverflowing = isTangentToViewport.matches
        && this.elements.topnav?.scrollWidth
        && this.elements.topnav.scrollWidth > document.body.clientWidth;

      this.elements.topnav.classList.toggle(selectors.overflowingTopNav.slice(1), isOverflowing);
      window.dispatchEvent(new CustomEvent('feds:navOverflow', { detail: { isOverflowing } }));
    };

    toggleContraction();
    isTangentToViewport.addEventListener('change', toggleContraction);
  };

  loadDelayed = async () => {
    this.ready = this.ready || new Promise(async (resolve) => {
      try {
        this.el.removeEventListener('click', this.loadDelayed);
        this.el.removeEventListener('keydown', this.loadDelayed);
        const [
          ProfileDropdown,
          Search,
        ] = await Promise.all([
          loadBlock('../features/profile/dropdown.js'),
          loadBlock('../features/search/gnav-search.js'),
          loadStyles('features/profile/dropdown.css'),
          loadStyles('features/search/gnav-search.css'),
        ]);
        this.ProfileDropdown = ProfileDropdown;
        this.Search = Search;
        resolve();
      } catch (e) {
        lanaLog({ message: 'GNAV: Error within loadDelayed', e, tags: 'errorType=warn,module=gnav' });
        resolve();
      }
    });

    return this.ready;
  };

  imsReady = async () => {
    const tasks = [
      this.decorateProfile,
    ];
    try {
      for await (const task of tasks) {
        await yieldToMain();
        await task();
      }
    } catch (e) {
      lanaLog({ message: 'GNAV: issues within onReady', e, tags: 'errorType=info,module=gnav' });
    }
  };

  decorateProfile = async () => {
    const { rawElem, decoratedElem } = this.blocks.profile;
    if (!rawElem) return;

    const isSignedInUser = window.adobeIMS.isSignedInUser();

    // If user is not signed in, decorate the 'Sign In' element
    if (!isSignedInUser) {
      await decorateSignIn({ rawElem, decoratedElem });
      return;
    }

    // If user is signed in, decorate the profile avatar
    const accessToken = window.adobeIMS.getAccessToken();
    const { env } = getConfig();
    const headers = new Headers({ Authorization: `Bearer ${accessToken.token}` });
    const profileData = await fetch(`https://${env.adobeIO}/profile`, { headers });

    if (profileData.status !== 200) {
      return;
    }

    const { sections, user: { avatar } } = await profileData.json();

    this.blocks.profile.buttonElem = await decorateProfileTrigger({ avatar });
    decoratedElem.append(this.blocks.profile.buttonElem);

    // Decorate the profile dropdown
    // after user interacts with button or after 3s have passed
    let decorationTimeout;

    const decorateDropdown = async (e) => {
      this.blocks.profile.buttonElem.removeEventListener('click', decorateDropdown);
      clearTimeout(decorationTimeout);
      await this.loadDelayed();
      this.blocks.profile.dropdownInstance = new this.ProfileDropdown({
        rawElem,
        decoratedElem,
        avatar,
        sections,
        buttonElem: this.blocks.profile.buttonElem,
        // If the dropdown has been decorated due to a click, open it
        openOnInit: e instanceof Event,
      });
    };

    this.blocks.profile.buttonElem.addEventListener('click', decorateDropdown);
    decorationTimeout = setTimeout(decorateDropdown, CONFIG.delays.loadDelayed);
  };

  loadSearch = () => {
    if (this.blocks?.search?.instance) return null;

    return this.loadDelayed().then(() => {
      this.blocks.search.instance = new this.Search(this.blocks.search.config);
    });
  };

  decorateToggle = () => {
    if (!this.mainNavItemCount) return '';

    const toggle = toFragment`<button
      class="feds-toggle"
      daa-ll="hamburgermenu|open"
      aria-expanded="false"
      aria-haspopup="true"
      aria-label="Navigation menu"
      aria-controls="feds-nav-wrapper"
      data-feds-preventAutoClose>
      </button>`;

    const setHamburgerPadding = () => {
      if (isDesktop.matches) {
        this.elements.mainNav.style.removeProperty('padding-bottom');
      } else {
        const offset = Math.ceil(this.elements.topnavWrapper.getBoundingClientRect().bottom);
        this.elements.mainNav.style.setProperty('padding-bottom', `${offset}px`);
      }
    };

    const onToggleClick = async () => {
      const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', !isExpanded);
      this.elements.navWrapper.classList.toggle('feds-nav-wrapper--expanded', !isExpanded);
      closeAllDropdowns();
      setCurtainState(!isExpanded);
      toggle.setAttribute('daa-ll', `hamburgermenu|${isExpanded ? 'open' : 'close'}`);

      if (this.blocks?.search?.instance) {
        this.blocks.search.instance.clearSearchForm();
      } else {
        await this.loadSearch();
      }

      if (isExpanded) setHamburgerPadding();
    };

    toggle.addEventListener('click', () => logErrorFor(onToggleClick, 'Toggle click failed', 'errorType=error,module=gnav'));

    const onDeviceChange = () => {
      if (isDesktop.matches) {
        toggle.setAttribute('aria-expanded', false);
        this.elements.navWrapper.classList.remove('feds-nav-wrapper--expanded');
        setCurtainState(false);
        closeAllDropdowns();
        this.blocks?.search?.instance?.clearSearchForm();
      }
    };

    isDesktop.addEventListener('change', () => logErrorFor(onDeviceChange, 'Toggle logic failed on device change', 'errorType=error,module=gnav'));

    return toggle;
  };

  decorateGenericLogo = ({ selector, classPrefix, includeLabel = true, analyticsValue } = {}) => {
    const rawBlock = this.body.querySelector(selector);
    if (!rawBlock) return '';

    // Get all non-image links
    const imgRegex = /(\.png|\.jpg|\.jpeg)/;
    const blockLinks = [...rawBlock.querySelectorAll('a')];
    const link = blockLinks.find((blockLink) => !imgRegex.test(blockLink.href)
      && !imgRegex.test(blockLink.textContent));

    if (!link) return '';

    // Check which elements should be rendered
    const renderImage = !rawBlock.matches('.no-logo');
    const renderLabel = includeLabel && !rawBlock.matches('.image-only');

    if (!renderImage && !renderLabel) return '';

    // Create image element
    const getImageEl = () => {
      const svgImg = rawBlock.querySelector('picture img[src$=".svg"]');
      if (svgImg) return svgImg;

      const image = blockLinks.find((blockLink) => imgRegex.test(blockLink.href)
        || imgRegex.test(blockLink.textContent));
      return getBrandImage(image);
    };

    const imageEl = renderImage
      ? toFragment`<span class="${classPrefix}-image">${getImageEl()}</span>`
      : '';

    // Create label element
    const labelEl = renderLabel
      ? toFragment`<span class="${classPrefix}-label">${link.textContent}</span>`
      : '';

    // Create final template
    const decoratedElem = toFragment`
      <a href="${link.href}" class="${classPrefix}" daa-ll="${analyticsValue}">
        ${imageEl}
        ${labelEl}
      </a>`;

    // Add accessibility attributes if just an image is rendered
    if (!renderLabel && link.textContent.length) decoratedElem.setAttribute('aria-label', link.textContent);

    return decoratedElem;
  };

  decorateAside = async () => {
    this.elements.aside = '';
    const promoPath = getMetadata('gnav-promo-source');
    if (!isDesktop.matches || !promoPath) {
      this.el.classList.remove('has-promo');
      return this.elements.aside;
    }

    const { default: decorate } = await import('./features/aside/aside.js');
    if (!decorate) return this.elements.aside;
    this.elements.aside = await decorate({ headerElem: this.el, promoPath });
    return this.elements.aside;
  };

  decorateBrand = () => this.decorateGenericLogo({
    selector: '.gnav-brand',
    classPrefix: 'feds-brand',
    analyticsValue: 'Brand',
  });

  decorateLogo = () => this.decorateGenericLogo({
    selector: '.adobe-logo',
    classPrefix: 'feds-logo',
    includeLabel: false,
    analyticsValue: 'Logo',
  });

  decorateMainNav = async () => {
    const breadcrumbs = isDesktop.matches ? '' : await this.decorateBreadcrumbs();
    this.elements.mainNav = toFragment`<div class="feds-nav"></div>`;
    this.elements.navWrapper = toFragment`
      <div class="feds-nav-wrapper" id="feds-nav-wrapper">
        ${breadcrumbs}
        ${isDesktop.matches ? '' : this.decorateSearch()}
        ${this.elements.mainNav}
        ${isDesktop.matches ? this.decorateSearch() : ''}
      </div>
    `;

    // Get all main menu items, but exclude any that are nested inside other features
    const items = [...this.body.querySelectorAll('h2, p:only-child > strong > a, p:only-child > em > a')]
      .filter((item) => CONFIG.features.every((feature) => !item.closest(`.${feature}`)));

    // Save number of items to decide whether a hamburger menu is required
    this.mainNavItemCount = items.length;

    for await (const [index, item] of items.entries()) {
      await yieldToMain();
      this.elements.mainNav.appendChild(this.decorateMainNavItem(item, index));
    }

    if (!hasActiveLink()) {
      const sections = this.elements.mainNav.querySelectorAll('.feds-navItem--section');

      if (sections.length === 1) {
        sections[0].classList.add(selectors.activeNavItem.slice(1));
        setActiveLink(true);
      }
    }

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

    const itemHasActiveLink = ['syncDropdownTrigger', 'link'].includes(itemType)
      && getActiveLink(item.closest('div')) instanceof HTMLElement;
    const activeModifier = itemHasActiveLink ? ` ${selectors.activeNavItem.slice(1)}` : '';

    // All dropdown decoration is delayed
    const delayDropdownDecoration = (template) => {
      let decorationTimeout;

      const decorateDropdown = () => logErrorFor(async () => {
        template.removeEventListener('click', decorateDropdown);
        clearTimeout(decorationTimeout);

        const menuLogic = await loadDecorateMenu();

        menuLogic.decorateMenu({
          item,
          template,
          type: itemType,
        });
      }, 'Decorate dropdown failed', 'errorType=info,module=gnav');

      template.addEventListener('click', decorateDropdown);
      decorationTimeout = setTimeout(decorateDropdown, CONFIG.delays.mainNavDropdowns);
    };

    // Decorate item based on its type
    switch (itemType) {
      case 'syncDropdownTrigger':
      case 'asyncDropdownTrigger': {
        const dropdownTrigger = toFragment`<button
          class="feds-navLink feds-navLink--hoverCaret"
          aria-expanded="false"
          aria-haspopup="true"
          daa-ll="${getAnalyticsValue(item.textContent, index + 1)}"
          daa-lh="header|Open">
            ${item.textContent.trim()}
          </button>`;

        const isSectionMenu = item.closest('.section') instanceof HTMLElement;
        const tag = isSectionMenu ? 'section' : 'div';
        const sectionModifier = isSectionMenu ? ' feds-navItem--section' : '';
        const triggerTemplate = toFragment`
          <${tag} class="feds-navItem${sectionModifier}${activeModifier}">
            ${dropdownTrigger}
          </${tag}>`;

        // Toggle trigger's dropdown on click
        dropdownTrigger.addEventListener('click', (e) => {
          trigger({ element: dropdownTrigger, event: e });
          setActiveDropdown(dropdownTrigger);
        });

        // Update analytics value when dropdown is expanded/collapsed
        const observer = new MutationObserver(() => {
          const isExpanded = dropdownTrigger.getAttribute('aria-expanded') === 'true';
          const analyticsValue = `header|${isExpanded ? 'Close' : 'Open'}`;
          dropdownTrigger.setAttribute('daa-lh', analyticsValue);
        });
        observer.observe(dropdownTrigger, { attributeFilter: ['aria-expanded'] });

        delayDropdownDecoration(triggerTemplate);
        return triggerTemplate;
      }
      case 'primaryCta':
      case 'secondaryCta':
        // Remove its 'em' or 'strong' wrapper
        item.parentElement.replaceWith(item);

        return toFragment`<div class="feds-navItem feds-navItem--centered">
            ${decorateCta({ elem: item, type: itemType, index: index + 1 })}
          </div>`;
      case 'link': {
        const linkElem = item.querySelector('a');
        linkElem.className = 'feds-navLink';
        linkElem.setAttribute('daa-ll', getAnalyticsValue(linkElem.textContent, index + 1));
        if (itemHasActiveLink) {
          linkElem.removeAttribute('href');
          linkElem.setAttribute('tabindex', 0);
        }

        const linkTemplate = toFragment`
          <div class="feds-navItem${activeModifier}">
            ${linkElem}
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

  decorateBreadcrumbs = async () => {
    if (!this.el.classList.contains('has-breadcrumbs')) return null;
    if (this.elements.breadcrumbsWrapper) return this.elements.breadcrumbsWrapper;
    const breadcrumbsElem = this.el.querySelector('.breadcrumbs');
    // Breadcrumbs are not initially part of the nav, need to decorate the links
    if (breadcrumbsElem) decorateLinks(breadcrumbsElem);
    const createBreadcrumbs = await loadBlock('../features/breadcrumbs/breadcrumbs.js');
    this.elements.breadcrumbsWrapper = await createBreadcrumbs(breadcrumbsElem);
    return this.elements.breadcrumbsWrapper;
  };

  decorateSearch = () => {
    const searchBlock = this.body.querySelector('.search');

    if (!searchBlock) return null;

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
    replaceKey('search', getFedsPlaceholderConfig(), 'feds').then((placeholder) => {
      if (placeholder && placeholder.length) {
        this.blocks.search.config.trigger.setAttribute('aria-label', placeholder);
      }
    });

    this.blocks.search.config.trigger.addEventListener('click', async () => {
      await this.loadSearch();
    });

    return this.elements.search;
  };
}

export default async function init(header) {
  const { locale, mep } = getConfig();
  // TODO locale.contentRoot is not the fallback we want if we implement centralized content
  const url = getMetadata('gnav-source') || `${locale.contentRoot}/gnav`;
  const resp = await fetch(`${url}.plain.html`);
  const html = await resp.text();
  if (!html) return null;
  const parsedHTML = await replaceText(html, getFedsPlaceholderConfig(), undefined, 'feds');
  processMartechAttributeMetadata(parsedHTML);

  try {
    const gnav = new Gnav(new DOMParser().parseFromString(parsedHTML, 'text/html').body, header);
    gnav.init();
    header.setAttribute('daa-im', 'true');
    const mepMartech = mep?.martech || '';
    header.setAttribute('daa-lh', `gnav|${getExperienceName()}${mepMartech}`);
    return gnav;
  } catch (e) {
    lanaLog({ message: 'Could not create global navigation.', e, tags: 'errorType=error,module=gnav' });
    return null;
  }
}
