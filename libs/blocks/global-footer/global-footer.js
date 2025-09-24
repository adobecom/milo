/* eslint-disable no-async-promise-executor */
import {
  loadBlock,
  decorateAutoBlock,
  decorateLinks,
  getMetadata,
  getConfig,
  localizeLink,
  loadStyle,
  loadScript,
  getFederatedUrl,
  getFedsPlaceholderConfig,
} from '../../utils/utils.js';

import {
  getExperienceName,
  loadDecorateMenu,
  fetchAndProcessPlainHtml,
  loadBaseStyles,
  yieldToMain,
  lanaLog,
  logErrorFor,
  toFragment,
  federatePictureSources,
  isDarkMode,
  setupKeyboardNav,
  KEYBOARD_DELAY,
} from '../global-navigation/utilities/utilities.js';

import { replaceKey } from '../../features/placeholders.js';
import { processTrackingLabels } from '../../martech/attributes.js';

const ADOBE_LOGO_DARK = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 179.35 46.86">
  <path fill="#AFAFAF" d="M76.93,30.93l-1.92,5.93c-0.08,0.2-0.2,0.32-0.44,0.32h-4.64c-0.28,0-0.36-0.16-0.32-0.4l8.01-23.1
    c0.16-0.44,0.32-0.92,0.4-2.44c0-0.16,0.12-0.28,0.24-0.28h6.41c0.2,0,0.28,0.04,0.32,0.24l9.09,25.62
    c0.08,0.2,0.04,0.36-0.2,0.36h-5.21c-0.24,0-0.36-0.08-0.44-0.28l-2.04-5.97H76.93z M84.7,25.92c-0.8-2.64-2.4-7.49-3.16-10.33
    H81.5c-0.64,2.68-2.08,7.09-3.12,10.33H84.7z
    M94.7,27.4c0-5.73,4.28-10.53,11.61-10.53c0.32,0,0.72,0.04,1.32,0.08V9.07c0-0.2,0.12-0.28,0.28-0.28h5.04
    c0.2,0,0.24,0.08,0.24,0.24v23.66c0,0.92,0.04,2.12,0.16,2.92c0,0.2-0.04,0.28-0.28,0.36c-2.76,1.16-5.41,1.6-7.89,1.6
    C99.27,37.57,94.7,34.21,94.7,27.4z M107.63,21.72c-0.4-0.16-0.92-0.2-1.48-0.2c-3.08,0-5.73,1.88-5.73,5.61
    c0,3.96,2.28,5.69,5.33,5.69c0.68,0,1.32-0.04,1.88-0.24V21.72z
    M136.13,27.12c0,6.29-4.08,10.45-9.85,10.45c-6.85,0-9.89-5.17-9.89-10.33c0-5.69,3.8-10.37,9.97-10.37
    C132.81,16.87,136.13,21.72,136.13,27.12z M122.04,27.16c0,3.52,1.64,5.77,4.32,5.77c2.32,0,4.08-2,4.08-5.69
    c0-3.12-1.28-5.73-4.32-5.73C123.8,21.52,122.04,23.6,122.04,27.16z
    M144.55,8.79c0.32,0,0.4,0.04,0.4,0.32v8.21c1.04-0.28,2.16-0.44,3.36-0.44c5.89,0,9.61,4.16,9.61,9.53
    c0,7.49-5.93,11.17-12.01,11.17c-2.12,0-4.24-0.28-6.29-0.92c-0.12-0.04-0.24-0.24-0.24-0.4V9.07c0-0.2,0.08-0.28,0.28-0.28
    H144.55z M147.31,21.6c-1.28,0-1.84,0.2-2.36,0.32v10.85c0.48,0.12,1,0.16,1.48,0.16c3.04,0,5.81-1.84,5.81-6.01
    C152.23,23.28,150.11,21.6,147.31,21.6z
    M165.75,28.68c0.2,2.28,1.8,4.16,5.73,4.16c1.8,0,3.4-0.28,4.92-0.92c0.12-0.08,0.24-0.04,0.24,0.2v3.8
    c0,0.28-0.08,0.4-0.28,0.48c-1.6,0.76-3.36,1.16-6.13,1.16c-7.53,0-10.17-5.17-10.17-10.13c0-5.53,3.4-10.57,9.69-10.57
    c6.05,0,8.45,4.68,8.45,8.65c0,1.24-0.08,2.24-0.2,2.68c-0.04,0.2-0.12,0.28-0.32,0.32c-0.52,0.08-2.04,0.16-4.12,0.16H165.75z
    M170.95,24.8c1.28,0,1.84-0.04,2-0.08c0-0.08,0-0.24,0-0.28c0-0.96-0.76-3.16-3.4-3.16c-2.52,0-3.6,1.88-3.84,3.52H170.95z
    M33.04,0 52.41,0 52.41,46.39
    M19.39,0 0,0 0,46.39
    M26.21,17.09 38.56,46.38 30.47,46.38 26.78,37.06 17.74,37.06"/>
</svg>`;

const ADOBE_LOGO_LIGHT = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 179.35 46.86">
  <path fill="#505050" d="M76.93,30.93l-1.92,5.93c-0.08,0.2-0.2,0.32-0.44,0.32h-4.64c-0.28,0-0.36-0.16-0.32-0.4l8.01-23.1
    c0.16-0.44,0.32-0.92,0.4-2.44c0-0.16,0.12-0.28,0.24-0.28h6.41c0.2,0,0.28,0.04,0.32,0.24l9.09,25.62
    c0.08,0.2,0.04,0.36-0.2,0.36h-5.21c-0.24,0-0.36-0.08-0.44-0.28l-2.04-5.97H76.93z M84.7,25.92c-0.8-2.64-2.4-7.49-3.16-10.33
    H81.5c-0.64,2.68-2.08,7.09-3.12,10.33H84.7z
    M94.7,27.4c0-5.73,4.28-10.53,11.61-10.53c0.32,0,0.72,0.04,1.32,0.08V9.07c0-0.2,0.12-0.28,0.28-0.28h5.04
    c0.2,0,0.24,0.08,0.24,0.24v23.66c0,0.92,0.04,2.12,0.16,2.92c0,0.2-0.04,0.28-0.28,0.36c-2.76,1.16-5.41,1.6-7.89,1.6
    C99.27,37.57,94.7,34.21,94.7,27.4z M107.63,21.72c-0.4-0.16-0.92-0.2-1.48-0.2c-3.08,0-5.73,1.88-5.73,5.61
    c0,3.96,2.28,5.69,5.33,5.69c0.68,0,1.32-0.04,1.88-0.24V21.72z
    M136.13,27.12c0,6.29-4.08,10.45-9.85,10.45c-6.85,0-9.89-5.17-9.89-10.33c0-5.69,3.8-10.37,9.97-10.37
    C132.81,16.87,136.13,21.72,136.13,27.12z M122.04,27.16c0,3.52,1.64,5.77,4.32,5.77c2.32,0,4.08-2,4.08-5.69
    c0-3.12-1.28-5.73-4.32-5.73C123.8,21.52,122.04,23.6,122.04,27.16z
    M144.55,8.79c0.32,0,0.4,0.04,0.4,0.32v8.21c1.04-0.28,2.16-0.44,3.36-0.44c5.89,0,9.61,4.16,9.61,9.53
    c0,7.49-5.93,11.17-12.01,11.17c-2.12,0-4.24-0.28-6.29-0.92c-0.12-0.04-0.24-0.24-0.24-0.4V9.07c0-0.2,0.08-0.28,0.28-0.28
    H144.55z M147.31,21.6c-1.28,0-1.84,0.2-2.36,0.32v10.85c0.48,0.12,1,0.16,1.48,0.16c3.04,0,5.81-1.84,5.81-6.01
    C152.23,23.28,150.11,21.6,147.31,21.6z
    M165.75,28.68c0.2,2.28,1.8,4.16,5.73,4.16c1.8,0,3.4-0.28,4.92-0.92c0.12-0.08,0.24-0.04,0.24,0.2v3.8
    c0,0.28-0.08,0.4-0.28,0.48c-1.6,0.76-3.36,1.16-6.13,1.16c-7.53,0-10.17-5.17-10.17-10.13c0-5.53,3.4-10.57,9.69-10.57
    c6.05,0,8.45,4.68,8.45,8.65c0,1.24-0.08,2.24-0.2,2.68c-0.04,0.2-0.12,0.28-0.32,0.32c-0.52,0.08-2.04,0.16-4.12,0.16H165.75z
    M170.95,24.8c1.28,0,1.84-0.04,2-0.08c0-0.08,0-0.24,0-0.28c0-0.96-0.76-3.16-3.4-3.16c-2.52,0-3.6,1.88-3.84,3.52H170.95z
    M33.04,0 52.41,0 52.41,46.39
    M19.39,0 0,0 0,46.39
    M26.21,17.09 38.56,46.38 30.47,46.38 26.78,37.06 17.74,37.06"/>
</svg>`;

export function getAnalyticsValue(str, index) {
  if (typeof str !== 'string' || !str.length) return str;

  let analyticsValue = processTrackingLabels(str, getConfig(), 30);
  analyticsValue = typeof index === 'number' ? `${analyticsValue}-${index}` : analyticsValue;

  return analyticsValue;
}

const { miloLibs, codeRoot, locale, mep } = getConfig();
const base = miloLibs || codeRoot;

const CONFIG = {
  socialPlatforms: ['facebook', 'instagram', 'twitter', 'linkedin', 'pinterest', 'discord', 'behance', 'youtube', 'weibo', 'social-media'],
  delays: { decoration: 3000 },
  containerBreakpoint: 900,
};
class Footer {
  constructor({ block } = {}) {
    this.block = block;
    this.elements = {};
    this.resizeObserver = null;
    this.resizeTimeout = null;
    this.lastContainerWidth = null;
    this.init();
  }

  init = () => logErrorFor(async () => {
    // We initialize the footer decoration logic when either 3s have passed
    // OR when the footer element is close to coming into view
    let decorationTimeout;

    // Set up intersection observer
    const intersectionOptions = { rootMargin: '300px 0px' };

    const observer = new window.IntersectionObserver((entries) => {
      const isIntersecting = entries.find((entry) => entry.isIntersecting === true);

      if (isIntersecting) {
        clearTimeout(decorationTimeout);
        observer.disconnect();
        this.decorateContent();
      }
    }, intersectionOptions);

    observer.observe(this.block);

    // Set timeout after which we load the footer automatically
    decorationTimeout = setTimeout(() => {
      observer.disconnect();
      this.decorateContent();
    }, CONFIG.delays.decoration);
    if (this.block.classList.contains('responsive-container')) {
      this.initContainerResponsiveness();
    }
  }, 'Error in global footer init', 'global-footer', 'e');

  initContainerResponsiveness = () => {
    this.destroy();
    const parent = this.block?.parentElement;
    if (!parent || !this.block.classList.contains('responsive-container')) return;

    const update = (w) => {
      const isMobile = w < CONFIG.containerBreakpoint;
      if (isMobile === this.isMobile) return;
      this.isMobile = isMobile;
      this.block.classList.toggle('mobile', isMobile);
    };
    this.resizeObserver = new ResizeObserver(([entry]) => requestAnimationFrame(
      () => update(Math.round(entry.contentRect.width)),
    ));
    this.resizeObserver.observe(parent);
    update(Math.round(parent.offsetWidth));
  };

  destroy = () => {
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
    this.isMobile = null;
  };

  decorateContent = () => logErrorFor(async () => {
    // Fetch footer content
    const url = getMetadata('footer-source') || `${locale.contentRoot}/footer`;
    this.body = await fetchAndProcessPlainHtml({
      url,
      shouldDecorateLinks: false,
    });

    if (!this.body) {
      const error = new Error('Could not create global footer. Content not found!');
      error.tags = 'global-footer';
      error.url = url;
      error.errorType = 'e';
      lanaLog({ message: error.message, ...error });
      const { onFooterError } = getConfig();
      onFooterError?.(error);
      return;
    }

    const [region, social] = ['.region-selector', '.social'].map((selector) => this.body.querySelector(selector));
    const [regionParent, socialParent] = [region?.parentElement, social?.parentElement];
    // We remove and add again the region and social elements from the body to make sure
    // they don't get decorated twice
    [regionParent, socialParent].forEach((parent) => parent?.replaceChildren());

    decorateLinks(this.body);

    regionParent?.appendChild(region);
    socialParent?.appendChild(social);

    // Support auto populated modal
    await Promise.all([...this.body.querySelectorAll('.modal')].map(loadBlock));

    // Process Jarvis chat footer link
    await this.processJarvisLink();

    const path = getFederatedUrl(url);
    federatePictureSources({ section: this.body, forceFederate: path.includes('/federal/') });

    // Order is important, decorateFooter makes use of elements
    // which have already been created in previous steps
    const tasks = [
      loadBaseStyles,
      this.decorateGrid,
      this.decorateProducts,
      this.loadIcons,
      this.decorateRegionPicker,
      this.decorateSocial,
      this.decoratePrivacy,
      this.decorateFooter,
    ];

    for await (const task of tasks) {
      await yieldToMain();
      await task();
    }
    const fetchKeyboardNav = () => {
      setupKeyboardNav(false);
    };
    const nav = document.querySelector('.global-navigation');
    if (!nav || nav.children.length < 1) {
      setTimeout(fetchKeyboardNav, KEYBOARD_DELAY);
    }
    const mepMartech = mep?.martech || '';
    this.block.setAttribute('daa-lh', `gnav|${getExperienceName()}|footer${mepMartech}`);
    this.block.append(this.elements.footer);
    const { onFooterReady } = getConfig();
    onFooterReady?.();
  }, 'Failed to decorate footer content', 'global-footer', 'e');

  loadMenuLogic = async () => {
    this.menuLogic = this.menuLogic || new Promise(async (resolve) => {
      const menuLogic = await loadDecorateMenu();
      this.decorateMenu = menuLogic.decorateMenu;
      this.decorateLinkGroup = menuLogic.decorateLinkGroup;
      this.decorateHeadline = menuLogic.decorateHeadline;
      resolve();
    });

    return this.menuLogic;
  };

  decorateGrid = async () => {
    this.elements.footerMenu = '';
    const columns = this.body.querySelectorAll(':scope > div > h2:first-child');

    if (!columns || !columns.length) return this.elements.footerMenu;

    this.elements.footerMenu = toFragment`<div class="feds-menu-content"></div>`;
    columns.forEach((column) => this.elements.footerMenu.appendChild(column.parentElement));

    await this.loadMenuLogic();

    await this.decorateMenu({
      item: this.elements.footerMenu,
      type: 'footerMenu',
    });

    this.elements.headlines = this.elements.footerMenu.querySelectorAll('.feds-menu-headline');

    return this.elements.footerMenu;
  };

  loadIcons = async () => {
    const file = await fetch(`${base}/blocks/global-footer/icons.svg`);
    if (!file.ok) {
      lanaLog({
        message: 'Issue with loadIcons',
        e: `${file.statusText} url: ${file.url}`,
        tags: 'global-footer',
        errorType: 'i',
      });
    }
    const content = await file.text();
    const elem = toFragment`<div class="feds-footer-icons">${content}</div>`;
    this.block.append(elem);
  };

  decorateProducts = async () => {
    this.elements.featuredProducts = '';

    // Get the featured products wrapper by looking for a link group's parent
    const featuredProductElem = this.body.querySelector('.link-group');
    if (!featuredProductElem) return this.elements.featuredProducts;

    const featuredProductsContent = featuredProductElem.parentElement;
    this.elements.featuredProducts = toFragment`<div class="feds-featuredProducts"></div>`;
    const featureProductsSection = toFragment`<div class="feds-menu-section"></div>`;
    this.elements.featuredProducts.append(featureProductsSection);

    const [placeholder] = await Promise.all([
      replaceKey('featured-products', getFedsPlaceholderConfig()),
      this.loadMenuLogic(),
    ]);

    if (placeholder && placeholder.length) {
      const headline = toFragment`<div class="feds-menu-headline">${placeholder}</div>`;
      featureProductsSection.append(this.decorateHeadline(headline, 0, 'footer'));
    }

    const featuredProductsList = toFragment`<ul></ul>`;
    featuredProductsContent.querySelectorAll('.link-group').forEach((linkGroup) => {
      featuredProductsList.append(toFragment`<li>${this.decorateLinkGroup(linkGroup)}</li>`);
    });
    const featuredProductsContainer = toFragment`<div class="feds-menu-items">${featuredProductsList}</div>`;
    featureProductsSection.append(featuredProductsContainer);
    return this.elements.featuredProducts;
  };

  decorateRegionPicker = async () => {
    this.elements.regionPicker = '';
    const regionSelector = this.body.querySelector('.region-selector a');
    if (!regionSelector) return this.elements.regionPicker;

    let url;

    try {
      url = new URL(regionSelector.href);
    } catch (e) {
      lanaLog({ message: `Could not create URL for region picker; href: ${regionSelector.href}`, tags: 'global-footer', errorType: 'e' });
      return this.elements.regionPicker;
    }

    const regionPickerClass = 'feds-regionPicker';
    const regionPickerTextElem = toFragment`<span class="feds-regionPicker-text">${regionSelector.textContent}</span>`;
    const regionPickerElem = toFragment`
      <a
        href="${regionSelector.href}"
        class="${regionPickerClass}"
        role="button">
        <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" class="feds-regionPicker-globe" focusable="false">
          <use href="#footer-icon-globe" />
        </svg>
        ${regionPickerTextElem}
      </a>`;
    regionPickerElem.dataset.modalPath = `${url.pathname}#_inline`;
    regionPickerElem.dataset.modalHash = url.hash;
    const regionPickerWrapperClass = 'feds-regionPicker-wrapper';
    this.elements.regionPicker = toFragment`<div class="${regionPickerWrapperClass}">
        ${regionPickerElem}
      </div>`;

    const isRegionPickerExpanded = () => regionPickerElem.getAttribute('aria-expanded') === 'true';

    // Note: the region picker currently works only with Milo modals/fragments;
    // in the future we'll need to update this for non-Milo consumers
    if (url.hash !== '' && url.hash !== '#_dnt') {
      // Hash -> region selector opens a modal
      decorateAutoBlock(regionPickerElem); // add modal-specific attributes
      regionPickerElem.href = url.hash;
      loadStyle(`${base}/blocks/modal/modal.css`);
      const { default: initModal } = await import('../modal/modal.js');
      const modal = await initModal(regionPickerElem);

      const loadRegionNav = async () => {
        const block = document.querySelector('.region-nav');
        if (block && getConfig().standaloneGnav) {
          // on standalone the region-nav will fail to load automatically through
          // the modal calling fragment.js. In that case we will have data-failed=true
          // and we should manually load region nav
          // If that's not the case then we're not a standalone gnav
          // and we mustn't load region-nav twice.
          if (block.getAttribute('data-failed') !== 'true') return;
          block.classList.add('hide');
          loadStyle(`${base}/blocks/region-nav/region-nav.css`);
          const { default: initRegionNav } = await import('../region-nav/region-nav.js');
          initRegionNav(block);
          // decoratePlaceholders(block, getConfig());
          block.classList.remove('hide');
        }
      };

      if (modal) await loadRegionNav(); // just in case the modal is already open

      regionPickerElem.addEventListener('click', () => {
        if (!isRegionPickerExpanded()) {
          regionPickerElem.setAttribute('aria-expanded', 'true');
          // wait for the modal to load before we load the region nav
          window.addEventListener('milo:modal:loaded', loadRegionNav, { once: true });
        }
      });
      // Set aria-expanded to false when region modal is closed
      window.addEventListener('milo:modal:closed', () => {
        if (isRegionPickerExpanded()) {
          regionPickerElem.setAttribute('aria-expanded', 'false');
        }
      });
    } else {
      // No hash -> region selector expands a dropdown
      regionPickerElem.setAttribute('aria-haspopup', 'true');
      regionPickerElem.href = '#'; // reset href value to not get treated as a fragment
      regionSelector.href = localizeLink(regionSelector.href);
      decorateAutoBlock(regionSelector); // add fragment-specific class(es)
      this.elements.regionPicker.append(regionSelector); // add fragment after regionPickerElem
      const { default: initFragment } = await import('../fragment/fragment.js');
      await initFragment(regionSelector); // load fragment and replace original link
      // Update aria-expanded on click
      regionPickerElem.addEventListener('click', (e) => {
        e.preventDefault();
        const isDialogActive = regionPickerElem.getAttribute('aria-expanded') === 'true';
        regionPickerElem.setAttribute('aria-expanded', !isDialogActive);
      });
      // Close region picker dropdown on outside click
      document.addEventListener('click', (e) => {
        if (isRegionPickerExpanded()
          && !e.target.closest(`.${regionPickerWrapperClass}`)) {
          regionPickerElem.setAttribute('aria-expanded', false);
        }
      });
    }

    return this.elements.regionPicker;
  };

  decorateSocial = () => {
    this.elements.social = '';
    const socialBlock = this.body.querySelector('.social');
    if (!socialBlock) return this.elements.social;

    const socialElem = toFragment`<ul class="feds-social" daa-lh="Social"></ul>`;

    const sanitizeLink = (link) => link.replace('#_blank', '').replace('#_dnb', '');

    CONFIG.socialPlatforms.forEach((platform, index) => {
      const link = socialBlock.querySelector(`a[href*="${platform}"]`);
      if (!link) return;

      const iconElem = toFragment`<li class="feds-social-item">
          <a
            href="${sanitizeLink(link.href)}"
            class="feds-social-link"
            aria-label="${platform}"
            daa-ll="${getAnalyticsValue(platform, index + 1)}"
            target="_blank">
            <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" class="feds-social-icon">
              <use href="#footer-icon-${platform}" />
            </svg>
          </a>
        </li>`;

      socialElem.append(iconElem);
    });

    this.elements.social = socialElem.childElementCount !== 0 ? socialElem : '';

    return this.elements.social;
  };

  decoratePrivacy = () => {
    this.elements.legal = '';
    // Get the legal links wrapper by looking for the copyright text's parent
    const copyrightElem = this.body.querySelector('div > p > em');
    if (!copyrightElem) return this.elements.legal;

    const privacyContent = copyrightElem.closest('div');

    // Decorate copyright element
    const currentYear = new Date().getFullYear();
    copyrightElem.remove();

    // Add Ad Choices icon
    const adChoicesElem = privacyContent.querySelector('a[href*="#interest-based-ads"]');
    adChoicesElem?.prepend(toFragment`<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" class="feds-adChoices-icon" focusable="false">
        <use href="#footer-icon-adchoices" />
      </svg>`);

    this.elements.legal = toFragment`<div class="feds-footer-legalWrapper" daa-lh="Legal"></div>`;
    const linkDivider = '<span class="feds-footer-privacyLink-divider" aria-hidden="true">/</span>';

    let privacyContentIndex = 0;
    while (privacyContent.children.length) {
      const privacySection = privacyContent.firstElementChild;
      privacySection.classList.add('feds-footer-privacySection');
      privacySection.querySelectorAll('a').forEach((link, index) => {
        link.classList.add('feds-footer-privacyLink');
        link.setAttribute('daa-ll', getAnalyticsValue(link.textContent, index + 1));
        const privacySectionListItem = document.createElement('li');
        privacySectionListItem.classList.add('feds-footer-privacy-listitem');
        link.parentNode.insertBefore(privacySectionListItem, link);
        privacySectionListItem.appendChild(link);
        if (index !== privacySection.querySelectorAll('a').length - 1) {
          privacySectionListItem.innerHTML += linkDivider;
        }
      });
      this.elements.legal.append(privacySection);

      if (privacyContentIndex === 0) {
        const privacySectionList = document.createElement('ul');
        [...privacySection.attributes].forEach((attr) => {
          privacySectionList.setAttribute(attr.name, attr.value);
        });
        const copyrightListItem = document.createElement('li');
        copyrightListItem.classList.add('feds-footer-privacy-listitem');
        copyrightListItem.innerHTML = linkDivider;
        copyrightListItem.prepend(copyrightElem);
        copyrightElem.replaceWith(toFragment`<span class="feds-footer-copyright">Copyright © ${currentYear} ${copyrightElem.textContent}</span>`);
        privacySectionList.prepend(copyrightListItem);
        privacySectionList.innerHTML += privacySection.innerHTML.replace(/( \/ )/g, '');
        privacySection.parentNode.replaceChild(privacySectionList, privacySection);
      }
      privacyContentIndex += 1;
    }

    return this.elements.legal;
  };

  // eslint-disable-next-line class-methods-use-this
  decorateLogo = () => {
    const logoSvg = isDarkMode() ? ADOBE_LOGO_DARK : ADOBE_LOGO_LIGHT;
    return toFragment`
      <span class="footer-logo" role="img" aria-label="Adobe">
        <span class="footer-logo-image">${logoSvg}</span>
      </span>`;
  };

  decorateFooter = () => {
    this.elements.footer = toFragment`<div class="feds-footer-wrapper">
        ${this.elements.footerMenu}
        ${this.elements.featuredProducts}
        <div class="feds-footer-options">
          <div class="feds-footer-miscLinks">
            ${this.elements.regionPicker}
            ${this.elements.social}
            ${this.decorateLogo()}
          </div>
          ${this.elements.legal}
        </div>
      </div>`;

    return this.elements.footer;
  };

  processJarvisLink = async () => {
    const sectionMeta = this.body.querySelector('.section-metadata');
    if (!sectionMeta) return;

    const jarvisLinks = this.body.querySelectorAll('[href*="#open-jarvis-chat"]');
    if (!jarvisLinks.length) return;

    const { getMetadata: sectionMetadata } = await import('../section-metadata/section-metadata.js');

    const jarvisMeta = {};
    Object.entries(sectionMetadata(sectionMeta)).forEach(([key, value]) => {
      if (['jarvis-surface-id', 'jarvis-surface-version'].includes(key)) jarvisMeta[key] = value.text;
    });

    if (Object.keys(jarvisMeta).length) {
      jarvisLinks.forEach((jarvisLink) => {
        jarvisLink.setAttribute('data-jarvis-config', JSON.stringify(jarvisMeta));
      });

      const { initJarvisChat } = await import('../../features/jarvis-chat.js');
      const config = { ...getConfig(), jarvis: { ...getConfig().jarvis, onDemand: true } };
      initJarvisChat(config, loadScript, loadStyle, getMetadata);
    }
  };
}

export default function init(block) {
  try {
    const footer = new Footer({ block });
    if (isDarkMode()) block.classList.add('feds--dark');
    return footer;
  } catch (e) {
    lanaLog({ message: 'Could not create footer', e });
    return null;
  }
}
