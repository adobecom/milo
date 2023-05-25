/* eslint-disable no-restricted-syntax */
import {
  getAnalyticsValue,
  toFragment,
  decorateCta,
  yieldToMain,
  getFedsPlaceholderConfig,
  logErrorFor,
  selectors,
} from '../utilities.js';
import { decorateLinks } from '../../../../utils/utils.js';
import { replaceText } from '../../../../features/placeholders.js';

const decorateHeadline = (elem) => {
  if (!(elem instanceof HTMLElement)) return null;

  // TODO: proper handling of aria-expanded across devices
  const headline = toFragment`<div
    class="feds-menu-headline"
    role="heading"
    aria-level="2"
    aria-haspopup="true"
    aria-expanded="false">
    ${elem.textContent.trim()}
  </div>`;

  // TODO: move proper logic to accessibility,
  // this is just for demo functionality purposes
  headline.addEventListener('click', (e) => {
    e.preventDefault();

    const openMenu = document.querySelector('.feds-menu-headline[aria-expanded = "true"]');

    if (openMenu && openMenu !== headline) {
      openMenu.setAttribute('aria-expanded', 'false');
    }

    const currentState = headline.getAttribute('aria-expanded');
    headline.setAttribute('aria-expanded', currentState === 'false');

    const activeClass = selectors.activeDropdown.replace('.', '');
    if (currentState === 'true') {
      headline.closest(selectors.navItem)?.classList.add(activeClass);
    } else {
      document.querySelectorAll(selectors.activeDropdown)
        .forEach((section) => section.classList.remove(activeClass));
      headline.closest(`${selectors.menuSection}, ${selectors.menuColumn}`)?.classList
        .toggle(activeClass, currentState === 'false');
    }
  });

  // Since heading is turned into a div, it can be safely removed
  elem.remove();

  return headline;
};

const decorateLinkGroup = (elem, index) => {
  if (!(elem instanceof HTMLElement) || !elem.querySelector('a')) return null;

  // TODO: allow links with image and no label
  const image = elem.querySelector('picture');
  const link = elem.querySelector('a');
  const description = elem.querySelector('p:nth-child(2)');

  const imageElem = image ? toFragment`<div class="feds-navLink-image">${image}</div>` : '';
  const descriptionElem = description ? toFragment`<div class="feds-navLink-description">${description.textContent}</div>` : '';
  const contentElem = link ? toFragment`<div class="feds-navLink-content">
      <div class="feds-navLink-title">${link.textContent}</div>
      ${descriptionElem}
    </div>` : '';
  const linkGroup = toFragment`<a 
    href="${link.href}"
    class="feds-navLink"
    daa-ll="${getAnalyticsValue(link.textContent, index)}">
      ${imageElem}
      ${contentElem}
    </a>`;

  return linkGroup;
};

// Decorate a list of simple links
const decorateLinkList = ({ list, className = 'feds-navLink', includeCta = true } = {}) => {
  list.querySelectorAll('a').forEach((link, index) => {
    // If the link is wrapped in a 'strong' or 'em' tag, make it a CTA
    if (includeCta
      && (link.parentElement.tagName === 'STRONG' || link.parentElement.tagName === 'EM')) {
      const type = link.parentElement.tagName === 'EM' ? 'secondaryCta' : 'primaryCta';
      decorateCta({ elem: link, type, index: index + 1 });
    // Otherwise add analytics attributes and proper class
    } else {
      link.setAttribute('daa-ll', getAnalyticsValue(link.textContent, index + 1));
      link.classList.add(className);
    }
  });
};

// Current limitation: we can only add one link
const decoratePromo = (elem) => {
  const isDarkTheme = elem.classList.contains('dark');
  const isImageOnly = elem.classList.contains('image-only');
  const imageElem = elem.querySelector('picture');

  decorateLinkList({ list: elem, className: 'feds-promo-link', includeCta: false });

  const decorateImage = () => {
    const linkElem = elem.querySelector('a');
    const imageWrapper = imageElem.closest('.gnav-promo > div');
    let promoImageElem;

    if (linkElem instanceof HTMLElement) {
      promoImageElem = toFragment`<a class="feds-promo-image" href="${linkElem.href}">
          ${imageElem}
        </a>`;
    } else {
      // TODO: is there really any use-case where a promo doesn't have a link?
      promoImageElem = toFragment`<div class="feds-promo-image">
          ${imageElem}
        </div>`;
    }

    // If the promo is set to 'image-only',
    // replace the whole promo content with the decorated image
    if (isImageOnly) {
      elem.replaceChildren(promoImageElem);
    } else {
    // Otherwise, just replace the image container with the decorated image
      imageWrapper?.replaceWith(promoImageElem);
    }
  };

  // Wrap the image in an anchor tag
  if (imageElem instanceof HTMLElement) {
    decorateImage();
  }

  elem.classList = 'feds-promo';

  if (isDarkTheme) {
    elem.classList.add('feds-promo--dark');
  }

  return toFragment`<div class="feds-promo-wrapper">
      ${elem}
    </div>`;
};

// Decorate special elements from a menu
const decorateMenuElement = (elem, index) => {
  let decoratedElem;

  // Decorate link group
  if (elem.classList.contains('link-group')) {
    decoratedElem = decorateLinkGroup(elem, index);
  }

  if (!elem.classList.contains('gnav-promo')) {
    // Decorate Primary CTA
    const primaryCta = elem.querySelector('strong > a');

    if (primaryCta) {
      decoratedElem = decorateCta({ elem: primaryCta, index });
    }

    // Decorate Secondary CTA
    const secondaryCta = elem.querySelector('em > a');

    if (secondaryCta) {
      decoratedElem = decorateCta({ elem: secondaryCta, type: 'secondaryCta', index });
    }
  }

  return decoratedElem;
};

const decorateColumns = async ({ content, separatorTagName = 'H5' } = {}) => {
  decorateLinks(content);
  const hasMultipleColumns = content.children.length > 1;

  // The resulting template structure should follow these rules:
  // * a menu can have multiple columns;
  // * a column can have multiple sections;
  // * a section can have a headline and a collection of item(s)
  for await (const column of [...content.children]) {
    await yieldToMain();
    const wrapperClass = hasMultipleColumns ? 'feds-menu-column' : 'feds-menu-content';
    const itemDestinationClass = hasMultipleColumns ? 'feds-menu-section' : 'feds-menu-column';
    const wrapper = toFragment`<div class="${wrapperClass}"></div>`;
    let itemDestination = toFragment`<div class="${itemDestinationClass}"></div>`;
    let menuItems;
    let currIndex = 0;

    const resetDestination = () => {
      // First, if the previous destination has children,
      // append it to the wrapper
      if (itemDestination.childElementCount) {
        wrapper.append(itemDestination);
        currIndex = 0;
      }

      // Create a new destination
      itemDestination = toFragment`<div class="${itemDestinationClass}"></div>`;
    };

    while (column.children.length) {
      // eslint-disable-next-line no-await-in-loop
      await yieldToMain();
      const columnElem = column.firstElementChild;

      if (columnElem.tagName === separatorTagName) {
        // When encountering a separator (h5 for header, h2 for footer),
        // add the previous section to the column
        resetDestination();

        // Analysts requested no headings in the dropdowns,
        // turning it into a simple div
        const sectionHeadline = decorateHeadline(columnElem);
        menuItems = toFragment`<div class="feds-menu-items" daa-lh="${sectionHeadline.textContent.trim()}"></div>`;
        itemDestination.append(sectionHeadline, menuItems);
      } else if (columnElem.classList.contains('gnav-promo')) {
        // When encountering a promo, add the previous section to the column
        resetDestination();

        const promoElem = decoratePromo(columnElem);

        itemDestination.append(promoElem);
      } else {
        currIndex += 1;
        // Check whether the current element needs special decoration
        const decoratedElem = decorateMenuElement(columnElem, currIndex);

        // If element has been decorated, remove it
        // from the initial list of column elements
        if (decoratedElem) {
          columnElem.remove();
        }

        // Leave lists and paragraphs intact, just add attributes to their links
        if (columnElem && (columnElem.tagName === 'UL' || columnElem.tagName === 'P')) {
          decorateLinkList({ list: columnElem });
        }

        // If an items template has been previously created,
        // add the current element to it;
        // otherwise append the element to the section
        const elemDestination = menuItems || itemDestination;
        elemDestination.append(decoratedElem || columnElem);
      }
    }

    // Append the last column section to the column
    wrapper.append(itemDestination);
    // Replace column with parsed template
    column.replaceWith(wrapper);
  }
};

// Current limitation: after an h5 (or h2 in the case of the footer)
// is found in a menu column, no new sections can be created without a heading
const decorateMenu = (config) => logErrorFor(async () => {
  let menuTemplate;

  if (config.type === 'syncDropdownTrigger') {
    const itemTopParent = config.item.closest('div');
    // The initial heading is already part of the item template,
    // it can be safely removed
    const initialHeadingElem = itemTopParent.querySelector('h2');
    itemTopParent.removeChild(initialHeadingElem);

    menuTemplate = toFragment`<div class="feds-popup">
        ${itemTopParent}
      </div>`;

    await decorateColumns({ content: menuTemplate });
  }

  if (config.type === 'asyncDropdownTrigger') {
    const pathElement = config.item.querySelector('a');
    if (!(pathElement instanceof HTMLElement)) return;
    const path = pathElement.href;

    const res = await fetch(`${path}.plain.html`);
    if (res.status !== 200) return;
    const content = await res.text();
    const parsedContent = await replaceText(content, getFedsPlaceholderConfig(), /{{(.*?)}}/g, 'feds');
    menuTemplate = toFragment`<div class="feds-popup">
        <div class="feds-menu-content">
          ${parsedContent}
        </div>
      </div>`;

    await decorateColumns({ content: menuTemplate.firstElementChild });
    config.template.classList.add('feds-navItem--megaMenu');
  }

  if (config.type === 'footerMenu') {
    await decorateColumns({ content: config.item, separatorTagName: 'H2' });
  }

  config.template?.append(menuTemplate);
}, 'Decorate menu failed');

export default { decorateMenu, decorateLinkGroup };
