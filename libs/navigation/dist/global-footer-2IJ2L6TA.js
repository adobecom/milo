import {
  federatePictureSources,
  fetchAndProcessPlainHtml,
  getAnalyticsValue,
  getExperienceName,
  getFedsPlaceholderConfig,
  isDarkMode,
  lanaLog,
  loadBaseStyles,
  loadDecorateMenu,
  logErrorFor,
  toFragment,
  yieldToMain
} from "./chunk-Y7JSFOA5.js";
import {
  replaceKey
} from "./chunk-NKAFDWDX.js";
import "./chunk-4SAFJNKU.js";
import {
  getFederatedUrl
} from "./chunk-SMWBDXJA.js";
import {
  decorateAutoBlock,
  decorateLinks,
  decoratePlaceholders,
  getConfig,
  getMetadata,
  loadBlock,
  loadStyle,
  localizeLink
} from "./chunk-DIP3NAMX.js";
import "./chunk-NE6SFPCS.js";

// ../blocks/global-footer/global-footer.js
var { miloLibs, codeRoot, locale, mep } = getConfig();
var base = miloLibs || codeRoot;
var CONFIG = {
  socialPlatforms: ["facebook", "instagram", "twitter", "linkedin", "pinterest", "discord", "behance", "youtube", "weibo", "social-media"],
  delays: { decoration: 3e3 }
};
var Footer = class {
  constructor({ block } = {}) {
    this.block = block;
    this.elements = {};
    this.init();
  }
  init = () => logErrorFor(async () => {
    let decorationTimeout;
    const intersectionOptions = { rootMargin: "300px 0px" };
    const observer = new window.IntersectionObserver((entries) => {
      const isIntersecting = entries.find((entry) => entry.isIntersecting === true);
      if (isIntersecting) {
        clearTimeout(decorationTimeout);
        observer.disconnect();
        this.decorateContent();
      }
    }, intersectionOptions);
    observer.observe(this.block);
    decorationTimeout = setTimeout(() => {
      observer.disconnect();
      this.decorateContent();
    }, CONFIG.delays.decoration);
  }, "Error in global footer init", "errorType=error,module=global-footer");
  decorateContent = () => logErrorFor(async () => {
    const url = getMetadata("footer-source") || `${locale.contentRoot}/footer`;
    this.body = await fetchAndProcessPlainHtml({
      url,
      shouldDecorateLinks: false
    });
    if (!this.body) return;
    const [region, social] = [".region-selector", ".social"].map((selector) => this.body.querySelector(selector));
    const [regionParent, socialParent] = [region?.parentElement, social?.parentElement];
    [regionParent, socialParent].forEach((parent) => parent?.replaceChildren());
    decorateLinks(this.body);
    regionParent?.appendChild(region);
    socialParent?.appendChild(social);
    const path = getFederatedUrl(url);
    federatePictureSources({ section: this.body, forceFederate: path.includes("/federal/") });
    const tasks = [
      loadBaseStyles,
      this.decorateGrid,
      this.decorateProducts,
      this.loadIcons,
      this.decorateRegionPicker,
      this.decorateSocial,
      this.decoratePrivacy,
      this.decorateFooter
    ];
    for await (const task of tasks) {
      await yieldToMain();
      await task();
    }
    const mepMartech = mep?.martech || "";
    this.block.setAttribute("daa-lh", `gnav|${getExperienceName()}|footer${mepMartech}`);
    this.block.append(this.elements.footer);
  }, "Failed to decorate footer content", "errorType=error,module=global-footer");
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
    this.elements.footerMenu = "";
    const columns = this.body.querySelectorAll(":scope > div > h2:first-child");
    if (!columns || !columns.length) return this.elements.footerMenu;
    this.elements.footerMenu = toFragment`<div class="feds-menu-content"></div>`;
    columns.forEach((column) => this.elements.footerMenu.appendChild(column.parentElement));
    await this.loadMenuLogic();
    await this.decorateMenu({
      item: this.elements.footerMenu,
      type: "footerMenu"
    });
    this.elements.headlines = this.elements.footerMenu.querySelectorAll(".feds-menu-headline");
    return this.elements.footerMenu;
  };
  loadIcons = async () => {
    const file = await fetch(`${base}/blocks/global-footer/icons.svg`);
    if (!file.ok) {
      lanaLog({
        message: "Issue with loadIcons",
        e: `${file.statusText} url: ${file.url}`,
        tags: "errorType=info,module=global-footer"
      });
    }
    const content = await file.text();
    const elem = toFragment`<div class="feds-footer-icons">${content}</div>`;
    this.block.append(elem);
  };
  decorateProducts = async () => {
    this.elements.featuredProducts = "";
    const featuredProductElem = this.body.querySelector(".link-group");
    if (!featuredProductElem) return this.elements.featuredProducts;
    const featuredProductsContent = featuredProductElem.parentElement;
    this.elements.featuredProducts = toFragment`<div class="feds-featuredProducts"></div>`;
    const [placeholder] = await Promise.all([
      replaceKey("featured-products", getFedsPlaceholderConfig()),
      this.loadMenuLogic()
    ]);
    if (placeholder && placeholder.length) {
      this.elements.featuredProducts.append(toFragment`<span class="feds-featuredProducts-label">${placeholder}</span>`);
    }
    featuredProductsContent.querySelectorAll(".link-group").forEach((linkGroup) => {
      this.elements.featuredProducts.append(this.decorateLinkGroup(linkGroup));
    });
    return this.elements.featuredProducts;
  };
  decorateRegionPicker = async () => {
    this.elements.regionPicker = "";
    const regionSelector = this.body.querySelector(".region-selector a");
    if (!regionSelector) return this.elements.regionPicker;
    let url;
    try {
      url = new URL(regionSelector.href);
    } catch (e) {
      lanaLog({ message: `Could not create URL for region picker; href: ${regionSelector.href}`, tags: "errorType=error,module=global-footer" });
      return this.elements.regionPicker;
    }
    const regionPickerClass = "feds-regionPicker";
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
    regionPickerElem.classList.add("link-block");
    regionPickerElem.dataset.modalPath = `${url.pathname}#_inline`;
    regionPickerElem.dataset.modalHash = url.hash;
    const regionPickerWrapperClass = "feds-regionPicker-wrapper";
    this.elements.regionPicker = toFragment`<div class="${regionPickerWrapperClass}">
        ${regionPickerElem}
      </div>`;
    const isRegionPickerExpanded = () => regionPickerElem.getAttribute("aria-expanded") === "true";
    if (url.hash !== "") {
      regionPickerElem.classList.add("modal");
      regionPickerElem.href = url.hash;
      if (regionPickerElem.classList[0] !== "modal") {
        lanaLog({
          message: `Modal block class missing from region picker pre loading the block; locale: ${locale}; regionPickerElem: ${regionPickerElem.outerHTML}`,
          tags: "errorType=warn,module=global-footer"
        });
      }
      const { default: initModal } = await import("./modal-WBOTTJWV.js");
      await initModal(regionPickerElem);
      const loadRegionNav = async () => {
        const block = document.querySelector(".region-nav");
        if (block) {
          block.classList.add("hide");
          loadStyle(`${base}/blocks/region-nav/region-nav.css`);
          const { default: initRegionNav } = await import("./region-nav-6PIYNDK5.js");
          initRegionNav(block);
          decoratePlaceholders(block, getConfig());
          block.classList.remove("hide");
        }
      };
      await loadRegionNav();
      if (regionPickerElem.classList[0] !== "modal") {
        lanaLog({
          message: `Modal block class missing from region picker post loading the block; locale: ${locale}; regionPickerElem: ${regionPickerElem.outerHTML}`,
          tags: "errorType=warn,module=global-footer"
        });
      }
      regionPickerElem.addEventListener("click", () => {
        if (!isRegionPickerExpanded()) {
          regionPickerElem.setAttribute("aria-expanded", "true");
          window.addEventListener("milo:modal:loaded", loadRegionNav, { once: true });
        }
      });
      window.addEventListener("milo:modal:closed", () => {
        if (isRegionPickerExpanded()) {
          regionPickerElem.setAttribute("aria-expanded", "false");
        }
      });
    } else {
      regionPickerElem.href = "#";
      regionSelector.href = localizeLink(regionSelector.href);
      decorateAutoBlock(regionSelector);
      this.elements.regionPicker.append(regionSelector);
      console.log(regionSelector.innerHTML);
      await loadBlock(regionSelector);
      regionPickerElem.addEventListener("click", (e) => {
        e.preventDefault();
        const isDialogActive = regionPickerElem.getAttribute("aria-expanded") === "true";
        regionPickerElem.setAttribute("aria-expanded", !isDialogActive);
      });
      document.addEventListener("click", (e) => {
        e.preventDefault();
        if (isRegionPickerExpanded() && !e.target.closest(`.${regionPickerWrapperClass}`)) {
          regionPickerElem.setAttribute("aria-expanded", false);
        }
      });
    }
    return this.elements.regionPicker;
  };
  decorateSocial = () => {
    this.elements.social = "";
    const socialBlock = this.body.querySelector(".social");
    if (!socialBlock) return this.elements.social;
    const socialElem = toFragment`<ul class="feds-social" daa-lh="Social"></ul>`;
    const sanitizeLink = (link) => link.replace("#_blank", "").replace("#_dnb", "");
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
            <svg xmlns="http://www.w3.org/2000/svg" class="feds-social-icon" alt="${platform} logo">
              <use href="#footer-icon-${platform}" />
            </svg>
          </a>
        </li>`;
      socialElem.append(iconElem);
    });
    this.elements.social = socialElem.childElementCount !== 0 ? socialElem : "";
    return this.elements.social;
  };
  decoratePrivacy = () => {
    this.elements.legal = "";
    const copyrightElem = this.body.querySelector("div > p > em");
    if (!copyrightElem) return this.elements.legal;
    const privacyContent = copyrightElem.closest("div");
    const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
    copyrightElem.replaceWith(toFragment`<span class="feds-footer-copyright">
        Copyright © ${currentYear} ${copyrightElem.textContent}
      </span>`);
    const adChoicesElem = privacyContent.querySelector('a[href*="#interest-based-ads"]');
    adChoicesElem?.prepend(toFragment`<svg xmlns="http://www.w3.org/2000/svg" class="feds-adChoices-icon" focusable="false">
        <use href="#footer-icon-adchoices" />
      </svg>`);
    this.elements.legal = toFragment`<div class="feds-footer-legalWrapper" daa-lh="Legal"></div>`;
    while (privacyContent.children.length) {
      const privacySection = privacyContent.firstElementChild;
      privacySection.classList.add("feds-footer-privacySection");
      privacySection.querySelectorAll("a").forEach((link, index) => {
        link.classList.add("feds-footer-privacyLink");
        link.setAttribute("daa-ll", getAnalyticsValue(link.textContent, index + 1));
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
};
function init(block) {
  try {
    const footer = new Footer({ block });
    if (isDarkMode()) block.classList.add("feds--dark");
    return footer;
  } catch (e) {
    lanaLog({ message: "Could not create footer", e });
    return null;
  }
}
export {
  init as default
};
//# sourceMappingURL=global-footer-2IJ2L6TA.js.map
