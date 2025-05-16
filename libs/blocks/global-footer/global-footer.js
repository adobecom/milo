/* eslint-disable no-async-promise-executor */
import {
  loadBlock,
  decorateAutoBlock,
  decorateLinks,
  getMetadata,
  getConfig,
  localizeLink,
  loadStyle,
  getFederatedUrl,
  getFedsPlaceholderConfig,
} from '../../utils/utils.js';

import {
  getExperienceName,
  getAnalyticsValue,
  loadDecorateMenu,
  fetchAndProcessPlainHtml,
  loadBaseStyles,
  yieldToMain,
  lanaLog,
  logErrorFor,
  toFragment,
  federatePictureSources,
  isDarkMode,
} from '../global-navigation/utilities/utilities.js';

import { replaceKey } from '../../features/placeholders.js';

const { miloLibs, codeRoot, locale, mep } = getConfig();
const base = miloLibs || codeRoot;

const CONFIG = {
  socialPlatforms: ['facebook', 'instagram', 'twitter', 'linkedin', 'pinterest', 'discord', 'behance', 'youtube', 'weibo', 'social-media'],
  delays: { decoration: 3000 },
};

class Footer {
  constructor({ block } = {}) {
    this.block = block;
    this.elements = {};
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
  }, 'Error in global footer init', 'global-footer', 'e');

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
      featureProductsSection.append(this.decorateHeadline(headline, 0));
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
    if (url.hash !== '') {
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

  decorateLogo = () => {
    const logoContainer = this.body.querySelector('.adobe-logo');
    if (!logoContainer) return '';

    const imageEl = logoContainer.querySelector('picture img[src$=".svg"]');
    if (!imageEl) return '';

    return toFragment`
      <a class="footer-logo">
        <span class="footer-logo-image">${imageEl}</span>
      </a>`;
  };

  decorateFooter = () => {
    this.elements.footer = toFragment`<div class="feds-footer-wrapper">
        ${this.elements.footerMenu}
        ${this.decorateLogo()}
        ${this.elements.featuredProducts}
        <div class="feds-footer-options">
          <div class="feds-footer-miscLinks">
            ${this.elements.regionPicker}
            ${this.elements.social}
          </div>
          ${this.elements.legal}
        </div>
      </div>`;

    return this.elements.footer;
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
