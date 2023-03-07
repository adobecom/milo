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

  // TODO: could it be something other than a 'picture'?
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

// Current limitations:
// * can't add link group in small dropdown
// * after an h5 is found in a dropdown column, no new sections can be without a heading
const decorateDropdown = async (config) => {
  if (config.type === 'syncDropdownTrigger') {
    const itemTopParent = config.item.closest('div');
    // The heading is already part of the item template,
    // it can be safely removed
    const headingElem = itemTopParent.querySelector('h2');
    itemTopParent.removeChild(headingElem);
    itemTopParent.classList.add('feds-popup');

    Array.prototype.forEach.call(itemTopParent.children, (section) => {
      // TODO: allow link groups in small dropdowns too?
      section.querySelectorAll('a').forEach((link, index) => {
        link.setAttribute('daa-ll', getAnalyticsValue(link.textContent, index + 1));
        link.classList.add('feds-navLink');
      });
    });

    config.template.append(itemTopParent);
  }

  if (config.type === 'asyncDropdownTrigger') {
    performance.mark('startAsyncDecoration');
    const pathElement = config.item.querySelector('a');
    if (!(pathElement instanceof HTMLElement)) return;
    const path = localizeLink(pathElement.href);

    const res = await fetch(`${path}.plain.html`);
    if (res.status !== 200) return;
    const content = await res.text();
    const popupTemplate = toFragment`<div class="feds-popup">${content}</div>`;

    // The resulting template structure should follow these rules:
    // * a popup can have multiple columns;
    // * a column can have multiple sections;
    // * a section can have a headline and a collection of item(s)
    Array.prototype.forEach.call(popupTemplate.children, (column) => {
      const columnTemplate = toFragment`<div class="feds-popup-column"></div>`;
      let columnSection = toFragment`<div class="feds-popup-section"></div>`;
      let sectionItems;
      let currIndex = 0;

      while (column.children.length) {
        const columnElem = column.firstElementChild;

        if (columnElem.tagName === 'H5') {
          // When encountering an h5, add the previous section to the column
          if (columnSection.childElementCount) {
            columnTemplate.append(columnSection);
            currIndex = 0;
          }

          // Analysts requested no headings in the dropdowns,
          // turning it into a simple div
          const sectionHeadline = decorateHeadline(columnElem);
          sectionItems = toFragment`<div class="feds-popup-items"></div>`;
          columnSection = toFragment`<div class="feds-popup-section">
              ${sectionHeadline}
              ${sectionItems}
            </div>`;
        } else {
          currIndex += 1;
          let decoratedElem;

          // Decorate link group
          if (columnElem.classList.contains('link-group')) {
            // TODO: check if links with just images also work
            decoratedElem = decorateLinkGroup(columnElem, currIndex);
          }

          // Decorate CTA
          if (columnElem.querySelector('strong > a')) {
            decoratedElem = decorateCta({ elem: columnElem, index: currIndex });
          }

          // If element has been decorated, remove it
          // from the initial list of column elements
          if (decoratedElem) {
            columnElem.remove();
          }

          // Leave lists and paragraphs intact, just add attributes to their links
          if (columnElem.tagName === 'UL' || columnElem.tagName === 'P') {
            columnElem.querySelectorAll('a').forEach((link, index) => {
              link.setAttribute('daa-ll', getAnalyticsValue(link.textContent, index + 1));
              link.classList.add('feds-navLink');
            });
          }

          // If an items template has been previously created,
          // add the current element to it;
          // otherwise append the element to the section
          const elemDestination = sectionItems || columnSection;
          elemDestination.append(decoratedElem || columnElem);
        }
      }

      // Append the last column section to the column
      columnTemplate.append(columnSection);
      // Replace column with parsed template
      column.replaceWith(columnTemplate);
    });

    config.template.classList.add('feds-navItem--megaMenu');
    config.template.append(popupTemplate);
    performance.mark('endAsyncDecoration');
  }
};

export default decorateDropdown;
