import { getAnalyticsValue, toFragment, decorateCta } from '../../utilities/utilities.js';
import { localizeLink } from '../../../../utils/utils.js';

const decorateHeadline = (elem) => {
  if (!(elem instanceof HTMLElement)) return null;

  // TODO: proper handling of aria-expanded across devices
  const headline = toFragment`<div
    class="feds-popup-headline"
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

    const openPopup = document.querySelector('.feds-popup-headline[aria-expanded = "true"]');

    if (openPopup && openPopup !== headline) {
      openPopup.setAttribute('aria-expanded', 'false');
    }

    const currentState = headline.getAttribute('aria-expanded');

    if (currentState === 'false') {
      headline.setAttribute('aria-expanded', 'true');
    } else {
      headline.setAttribute('aria-expanded', 'false');
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
    href="${localizeLink(link.href)}"
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
      promoImageElem = toFragment`<a class="feds-promo-image" href="${localizeLink(linkElem.href)}">
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
      imageWrapper.replaceWith(promoImageElem);
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

// Decorate special elements from a popup
const decoratePopupElement = (elem, index) => {
  let decoratedElem;

  // Decorate link group
  if (elem.classList.contains('link-group')) {
    decoratedElem = decorateLinkGroup(elem, index);
  }

  // Decorate Primary CTA
  if (!elem.classList.contains('gnav-promo')
   && elem.querySelector('strong > a')) {
    decoratedElem = decorateCta({ elem, index });
  }

  // Decorate Secondary CTA
  if (!elem.classList.contains('gnav-promo')
   && elem.querySelector('em > a')) {
    decoratedElem = decorateCta({ elem, type: 'secondaryCta', index });
  }

  return decoratedElem;
};

const decorateColumns = (content) => {
  const hasMultipleColumns = content.children.length > 1;

  // The resulting template structure should follow these rules:
  // * a popup can have multiple columns;
  // * a column can have multiple sections;
  // * a section can have a headline and a collection of item(s)
  Array.prototype.forEach.call(content.children, (column) => {
    const wrapperClass = hasMultipleColumns ? 'feds-popup-column' : 'feds-popup-content';
    const itemDestinationClass = hasMultipleColumns ? 'feds-popup-section' : 'feds-popup-column';
    const wrapper = toFragment`<div class="${wrapperClass}"></div>`;
    let itemDestination = toFragment`<div class="${itemDestinationClass}"></div>`;
    let popupItems;
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
      const columnElem = column.firstElementChild;

      if (columnElem.tagName === 'H5') {
        // When encountering an h5, add the previous section to the column
        resetDestination();

        // Analysts requested no headings in the dropdowns,
        // turning it into a simple div
        const sectionHeadline = decorateHeadline(columnElem);
        popupItems = toFragment`<div class="feds-popup-items"></div>`;
        itemDestination.append(sectionHeadline, popupItems);
      } else if (columnElem.classList.contains('gnav-promo')) {
        // When encountering a promo, add the previous section to the column
        resetDestination();

        const promoElem = decoratePromo(columnElem);

        itemDestination.append(promoElem);
      } else {
        currIndex += 1;
        // Check whether the current element needs special decoration
        const decoratedElem = decoratePopupElement(columnElem, currIndex);

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
        const elemDestination = popupItems || itemDestination;
        elemDestination.append(decoratedElem || columnElem);
      }
    }

    // Append the last column section to the column
    wrapper.append(itemDestination);
    // Replace column with parsed template
    column.replaceWith(wrapper);
  });
};

// Current limitation: after an h5 is found in a dropdown column,
// no new sections can be created without a heading
const decorateDropdown = async (config) => {
  let popupTemplate;

  if (config.type === 'syncDropdownTrigger') {
    const itemTopParent = config.item.closest('div');
    // The initial heading is already part of the item template,
    // it can be safely removed
    const initialHeadingElem = itemTopParent.querySelector('h2');
    itemTopParent.removeChild(initialHeadingElem);

    popupTemplate = toFragment`<div class="feds-popup">
        ${itemTopParent}
      </div>`;

    decorateColumns(popupTemplate);
  }

  if (config.type === 'asyncDropdownTrigger') {
    const pathElement = config.item.querySelector('a');
    if (!(pathElement instanceof HTMLElement)) return;
    const path = localizeLink(pathElement.href);

    const res = await fetch(`${path}.plain.html`);
    if (res.status !== 200) return;
    const content = await res.text();
    popupTemplate = toFragment`<div class="feds-popup">
        <div class="feds-popup-content">
          ${content}
        </div>
      </div>`;

    decorateColumns(popupTemplate.firstElementChild);
    config.template.classList.add('feds-navItem--megaMenu');
  }

  config.template.append(popupTemplate);
};

export default decorateDropdown;
