/* eslint-disable no-async-promise-executor */
import {
  decorateAutoBlock,
  getConfig,
  getMetadata,
  loadBlock,
  decorateLinks,
} from '../../utils/utils.js';

import {
  toFragment,
  getExperienceName,
  loadDecorateMenu,
  getFedsPlaceholderConfig,
  getAnalyticsValue,
  loadBaseStyles,
  yieldToMain,
} from '../global-navigation/utilities/utilities.js';

import { replaceKey, replaceText } from '../../features/placeholders.js';

const { miloLibs, codeRoot, locale } = getConfig();
const base = miloLibs || codeRoot;

const CONFIG = {
  socialPlatforms: ['facebook', 'instagram', 'twitter', 'linkedin', 'pinterest', 'discord', 'behance', 'youtube', 'weibo', 'social-media'],
  delays: { decoration: 3000 },
};

class Footer {
  constructor(footerEl, contentUrl) {
    this.footerEl = footerEl;
    this.contentUrl = contentUrl;
    this.elements = {};

    this.init();
  }

  init = async () => {
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

    observer.observe(this.footerEl);

    // Set timeout after which we load the footer automatically
    decorationTimeout = setTimeout(() => {
      observer.disconnect();
      this.decorateContent();
    }, CONFIG.delays.decoration);
  };

  decorateContent = async () => {
    // Fetch footer content
    this.body = await this.fetchContent();

    // TODO: log to LANA if Footer content could not be found
    if (!this.body) return;
    // TODO: revisit region picker and social links decoration logic
    const regionAnchor = this.body.querySelector('.region-selector a');
    if (regionAnchor?.href) {
      regionAnchor.setAttribute('href', `${regionAnchor.getAttribute('href')}#_dnt#_dnb`);
    }
    const socialLinks = document.querySelectorAll('.social a');
    socialLinks.forEach((socialLink) => {
      socialLink.setAttribute('href', `${socialLink.getAttribute('href')}#_dnb`);
    });
    decorateLinks(this.body);

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

    this.footerEl.setAttribute('daa-lh', `gnav|${getExperienceName()}|footer|${document.body.dataset.mep}`);

    this.footerEl.append(this.elements.footer);
  };

  fetchContent = async () => {
    const resp = await fetch(`${this.contentUrl}.plain.html`);
    const html = await resp.text();

    if (!html) return null;

    const parsedHTML = await replaceText(html, getFedsPlaceholderConfig(), undefined, 'feds');

    try {
      return new DOMParser().parseFromString(parsedHTML, 'text/html').body;
    } catch (e) {
      // TODO: log to LANA if Footer could not be instantiated
      return null;
    }
  };

  loadMenuLogic = async () => {
    this.menuLogic = this.menuLogic || new Promise(async (resolve) => {
      const menuLogic = await loadDecorateMenu();
      this.decorateMenu = menuLogic.decorateMenu;
      this.decorateLinkGroup = menuLogic.decorateLinkGroup;
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
    const content = await file.text();
    const elem = toFragment`<div class="feds-footer-icons">${content}</div>`;
    this.footerEl.append(elem);
  };

  decorateProducts = async () => {
    this.elements.featuredProducts = '';

    // Get the featured products wrapper by looking for a link group's parent
    const featuredProductElem = this.body.querySelector('.link-group');
    if (!featuredProductElem) return this.elements.featuredProducts;

    const featuredProductsContent = featuredProductElem.parentElement;
    this.elements.featuredProducts = toFragment`<div class="feds-featuredProducts"></div>`;

    const [placeholder] = await Promise.all([
      replaceKey('featured-products', getFedsPlaceholderConfig(), 'feds'),
      this.loadMenuLogic(),
    ]);

    if (placeholder && placeholder.length) {
      this.elements.featuredProducts
        .append(toFragment`<span class="feds-featuredProducts-label">${placeholder}</span>`);
    }

    featuredProductsContent.querySelectorAll('.link-group').forEach((linkGroup) => {
      this.elements.featuredProducts.append(this.decorateLinkGroup(linkGroup));
    });

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
      // TODO: Log to Lana if URL could not be created
    }

    if (!url) return this.elements.regionPicker;

    const regionPickerClass = 'feds-regionPicker';
    const regionPickerTextElem = toFragment`<span class="feds-regionPicker-text">${regionSelector.textContent}</span>`;
    const regionPickerElem = toFragment`
      <a
        href="${regionSelector.href}"
        class="${regionPickerClass}"
        aria-expanded="false"
        aria-haspopup="true"
        role="button">
        <svg xmlns="http://www.w3.org/2000/svg" class="feds-regionPicker-globe" focusable="false">
          <use href="#footer-icon-globe" />
        </svg>
        ${regionPickerTextElem}
      </a>`;
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
      await loadBlock(regionPickerElem); // load modal logic and styles
      // 'decorateAutoBlock' logic replaces class name entirely, need to add it back
      regionPickerElem.classList.add(regionPickerClass);
      regionPickerElem.addEventListener('click', () => {
        if (!isRegionPickerExpanded()) {
          regionPickerElem.setAttribute('aria-expanded', 'true');
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
      regionPickerElem.href = '#'; // reset href value to not get treated as a fragment
      decorateAutoBlock(regionSelector); // add fragment-specific class(es)
      this.elements.regionPicker.append(regionSelector); // add fragment after regionPickerElem
      await loadBlock(regionSelector); // load fragment and replace original link
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

    return this.regionPicker;
  };

  decorateSocial = () => {
    this.elements.social = '';
    const socialBlock = this.body.querySelector('.social');
    if (!socialBlock) return this.elements.social;

    const socialElem = toFragment`<ul class="feds-social" daa-lh="Social"></ul>`;

    CONFIG.socialPlatforms.forEach((platform, index) => {
      const link = socialBlock.querySelector(`a[href*="${platform}"]`);
      if (!link) return;

      const iconElem = toFragment`<li class="feds-social-item">
          <a
            href="${link.href}"
            class="feds-social-link"
            aria-label="${platform}"
            daa-ll="${getAnalyticsValue(platform, index + 1)}"
            target="_blank">
            <svg xmlns="http://www.w3.org/2000/svg" class="feds-social-icon" alt="${platform} logo">
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
    copyrightElem.replaceWith(toFragment`<span class="feds-footer-copyright">
        Copyright © ${currentYear} ${copyrightElem.textContent}
      </span>`);

    // Add Ad Choices icon
    const adChoicesElem = privacyContent.querySelector('a[href*="#interest-based-ads"]');
    adChoicesElem?.prepend(toFragment`<svg xmlns="http://www.w3.org/2000/svg" class="feds-adChoices-icon" focusable="false">
        <use href="#footer-icon-adchoices" />
      </svg>`);

    this.elements.legal = toFragment`<div class="feds-footer-legalWrapper" daa-lh="Legal"></div>`;

    while (privacyContent.children.length) {
      const privacySection = privacyContent.firstElementChild;
      privacySection.classList.add('feds-footer-privacySection');
      privacySection.querySelectorAll('a').forEach((link, index) => {
        link.classList.add('feds-footer-privacyLink');
        link.setAttribute('daa-ll', getAnalyticsValue(link.textContent, index + 1));
      });
      this.elements.legal.append(privacySection);
    }

    return this.elements.legal;
  };

  decorateFooter = () => {
    this.elements.footer = toFragment`<div class="feds-footer-wrapper">
        ${this.elements.footerMenu}
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
  const url = getMetadata('footer-source') || `${locale.contentRoot}/footer`;
  const footer = new Footer(block, url);
  return footer;
}
