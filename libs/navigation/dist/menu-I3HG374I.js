import {
  addMepHighlightAndTargetId,
  decorateCta,
  fetchAndProcessPlainHtml,
  getActiveLink,
  getAnalyticsValue,
  icons,
  isDesktop,
  logErrorFor,
  selectors,
  setActiveDropdown,
  toFragment,
  trigger,
  yieldToMain
} from "./chunk-SEUC37NT.js";
import "./chunk-JSQDM4GY.js";
import "./chunk-JW7KOVAP.js";
import "./chunk-R5PLKX3Z.js";
import "./chunk-G4SXHKM5.js";
import "./chunk-NE6SFPCS.js";

// ../blocks/global-navigation/utilities/menu/menu.js
var decorateHeadline = (elem, index) => {
  if (!(elem instanceof HTMLElement)) return null;
  const headline = toFragment`<div class="feds-menu-headline">
      ${elem.textContent.trim()}
    </div>`;
  const setHeadlineAttributes = () => {
    if (isDesktop.matches) {
      headline.setAttribute("role", "heading");
      headline.removeAttribute("tabindex");
      headline.setAttribute("aria-level", 2);
      headline.removeAttribute("aria-haspopup", true);
      headline.removeAttribute("aria-expanded", false);
      headline.removeAttribute("daa-ll");
    } else {
      headline.setAttribute("role", "button");
      headline.setAttribute("tabindex", 0);
      headline.removeAttribute("aria-level");
      headline.setAttribute("aria-haspopup", true);
      headline.setAttribute("aria-expanded", false);
      headline.setAttribute("daa-ll", getAnalyticsValue(headline.textContent, index));
    }
  };
  setHeadlineAttributes();
  isDesktop.addEventListener("change", setHeadlineAttributes);
  headline.addEventListener("click", (e) => {
    if (isDesktop.matches) return;
    trigger({ element: headline, event: e, type: "headline" });
    setActiveDropdown(headline);
  });
  elem.remove();
  return headline;
};
var decorateLinkGroup = (elem, index) => {
  if (!(elem instanceof HTMLElement) || !elem.querySelector("a")) return "";
  const image = elem.querySelector("picture");
  const link = elem.querySelector("a");
  const description = elem.querySelector("p:nth-child(2)");
  const modifierClasses = [...elem.classList].filter((className) => className !== "link-group").map((className) => `feds-navLink--${className}`);
  const imageElem = image ? toFragment`<div class="feds-navLink-image">${image}</div>` : "";
  const descriptionElem = description ? toFragment`<div class="feds-navLink-description">${description.textContent}</div>` : "";
  const contentElem = link ? toFragment`<div class="feds-navLink-content">
      <div class="feds-navLink-title">${link.textContent}</div>
      ${descriptionElem}
    </div>` : "";
  const linkGroup = toFragment`<a
    href="${link.href}"
    class="feds-navLink${modifierClasses.length ? ` ${modifierClasses.join(" ")}` : ""}"
    daa-ll="${getAnalyticsValue(link.textContent, index)}">
      ${imageElem}
      ${contentElem}
    </a>`;
  if (link?.target) linkGroup.target = link.target;
  return linkGroup;
};
var decorateElements = ({ elem, className = "feds-navLink", itemIndex = { position: 0 } } = {}) => {
  const decorateLink = (link) => {
    itemIndex.position += 1;
    if (link.matches(".link-group")) {
      return decorateLinkGroup(link, itemIndex.position);
    }
    if (link.parentElement.tagName === "STRONG" || link.parentElement.tagName === "EM") {
      const type = link.parentElement.tagName === "EM" ? "secondaryCta" : "primaryCta";
      link.parentElement.replaceWith(link);
      return decorateCta({ elem: link, type, index: itemIndex.position });
    }
    link.setAttribute("daa-ll", getAnalyticsValue(link.textContent, itemIndex.position));
    link.classList.add(className);
    return link;
  };
  const linkSelector = "a, .link-group";
  if (elem.matches(linkSelector)) {
    return decorateLink(elem);
  }
  elem.querySelectorAll(linkSelector).forEach((link) => {
    link.replaceWith(decorateLink(link));
  });
  return elem;
};
var decoratePromo = (elem, index) => {
  const isDarkTheme = elem.matches(".dark");
  const isImageOnly = elem.matches(".image-only");
  const imageElem = elem.querySelector("picture");
  if (!isImageOnly) {
    const content = [...elem.querySelectorAll(":scope > div")].find((section) => !(section.querySelector("picture") instanceof HTMLElement));
    content?.classList.add("feds-promo-content");
  }
  decorateElements({ elem, className: "feds-promo-link", index });
  const decorateImage = () => {
    const linkElem = elem.querySelector("a");
    const imageWrapper = imageElem.closest(`${selectors.gnavPromo} > div`);
    let promoImageElem;
    if (linkElem instanceof HTMLElement) {
      promoImageElem = toFragment`<a class="feds-promo-image" href="${linkElem.href}">
          ${imageElem}
        </a>`;
    } else {
      promoImageElem = toFragment`<div class="feds-promo-image">
          ${imageElem}
        </div>`;
    }
    if (isImageOnly) {
      elem.replaceChildren(promoImageElem);
    } else {
      imageWrapper?.replaceWith(promoImageElem);
    }
  };
  if (imageElem instanceof HTMLElement) {
    decorateImage();
  }
  elem.classList = "feds-promo";
  if (isDarkTheme) {
    elem.classList.add("feds-promo--dark");
  }
  return toFragment`<div class="feds-promo-wrapper">
      ${elem}
    </div>`;
};
var decorateColumns = async ({ content, separatorTagName = "H5" } = {}) => {
  const hasMultipleColumns = content.children.length > 1;
  let headlineIndex = 0;
  for await (const column of [...content.children]) {
    await yieldToMain();
    const wrapperClass = hasMultipleColumns ? "feds-menu-column" : "feds-menu-content";
    const itemDestinationClass = hasMultipleColumns ? "feds-menu-section" : "feds-menu-column";
    const wrapper = toFragment`<div class="${wrapperClass}"></div>`;
    let itemDestination = toFragment`<div class="${itemDestinationClass}"></div>`;
    let menuItems;
    const itemIndex = { position: 0 };
    const resetDestination = () => {
      if (itemDestination.childElementCount) {
        wrapper.append(itemDestination);
      }
      itemDestination = toFragment`<div class="${itemDestinationClass}"></div>`;
    };
    while (column.children.length) {
      await yieldToMain();
      const columnElem = column.firstElementChild;
      if (columnElem.matches(selectors.columnBreak)) {
        resetDestination();
        columnElem.remove();
      } else if (columnElem.tagName === separatorTagName) {
        headlineIndex += 1;
        resetDestination();
        if (!hasMultipleColumns) itemIndex.position = 0;
        const sectionHeadline = decorateHeadline(columnElem, headlineIndex);
        menuItems = toFragment`<div class="feds-menu-items" daa-lh="${getAnalyticsValue(sectionHeadline.textContent.trim())}"></div>`;
        itemDestination.append(sectionHeadline, menuItems);
        if (column.querySelector(selectors.columnBreak)) {
          wrapper.classList.add(`${wrapperClass}--group`);
          if (column.querySelectorAll(selectors.columnBreak).length > 1) wrapper.classList.add(`${wrapperClass}--wide`);
          const wideColumn = document.createElement("div");
          wideColumn.append(...column.childNodes);
          menuItems.append(wideColumn);
          await decorateColumns({ content: menuItems });
        }
      } else if (columnElem.matches(selectors.gnavPromo)) {
        resetDestination();
        itemIndex.position = 0;
        const promoElem = decoratePromo(columnElem, itemIndex);
        itemDestination.append(promoElem);
      } else {
        const decoratedElem = decorateElements({ elem: columnElem, itemIndex });
        columnElem.remove();
        const elemDestination = menuItems || itemDestination;
        elemDestination.append(decoratedElem);
      }
    }
    wrapper.append(itemDestination);
    column.replaceWith(wrapper);
  }
};
var decorateCrossCloudMenu = (content) => {
  const crossCloudMenuEl = content.querySelector(".cross-cloud-menu");
  if (!crossCloudMenuEl) return;
  decorateElements({ elem: crossCloudMenuEl });
  crossCloudMenuEl.className = "feds-crossCloudMenu-wrapper";
  crossCloudMenuEl.querySelector("div").className = "feds-crossCloudMenu";
  crossCloudMenuEl.querySelectorAll("ul li").forEach((el, index) => {
    if (index === 0) el.querySelector("a")?.prepend(toFragment`${icons.home}`);
    el.className = "feds-crossCloudMenu-item";
  });
  content.append(crossCloudMenuEl);
};
var decorateMenu = (config) => logErrorFor(async () => {
  let menuTemplate;
  if (config.type === "syncDropdownTrigger") {
    const itemTopParent = config.item.closest("div");
    const initialHeadingElem = itemTopParent.querySelector("h2");
    itemTopParent.removeChild(initialHeadingElem);
    menuTemplate = toFragment`<div class="feds-popup">
        ${itemTopParent}
      </div>`;
    await decorateColumns({ content: menuTemplate });
  }
  if (config.type === "asyncDropdownTrigger") {
    const pathElement = config.item.querySelector("a");
    if (!(pathElement instanceof HTMLElement)) return;
    const content = await fetchAndProcessPlainHtml({ url: pathElement.href });
    if (!content) return;
    const menuContent = toFragment`<div class="feds-menu-content">${content.innerHTML}</div>`;
    menuTemplate = toFragment`<div class="feds-popup">
        <div class="feds-menu-container">
          ${menuContent}
        </div>
      </div>`;
    addMepHighlightAndTargetId(menuTemplate, content);
    decorateCrossCloudMenu(menuTemplate);
    await decorateColumns({ content: menuContent });
    if (getActiveLink(menuTemplate) instanceof HTMLElement) {
      const resetActiveState = () => {
        config.template.style.width = "";
        config.template.classList.remove(selectors.deferredActiveNavItem.slice(1));
      };
      if (isDesktop.matches) {
        config.template.style.width = `${config.template.offsetWidth}px`;
        config.template.classList.add(selectors.deferredActiveNavItem.slice(1));
        isDesktop.addEventListener("change", resetActiveState, { once: true });
        window.addEventListener("feds:navOverflow", resetActiveState, { once: true });
      }
      config.template.classList.add(selectors.activeNavItem.slice(1));
    }
    config.template.classList.add("feds-navItem--megaMenu");
  }
  if (config.type === "footerMenu") {
    await decorateColumns({ content: config.item, separatorTagName: "H2" });
  }
  config.template?.append(menuTemplate);
}, "Decorate menu failed", "errorType=info,module=gnav-menu");
var menu_default = { decorateMenu, decorateLinkGroup };
export {
  menu_default as default
};
//# sourceMappingURL=menu-I3HG374I.js.map
