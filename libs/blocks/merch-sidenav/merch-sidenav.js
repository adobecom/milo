/* eslint-disable import/no-relative-packages */
import { createTag, localizeLink } from '../../utils/utils.js';
import '../../deps/mas/merch-sidenav.js';
import '../../deps/lit-all.min.js';
import '../../features/spectrum-web-components/dist/theme.js';
import '../../features/spectrum-web-components/dist/base.js';
import '../../features/spectrum-web-components/dist/shared.js';
import '../../features/spectrum-web-components/dist/sidenav.js';
import '../../features/spectrum-web-components/dist/search.js';
import '../../features/spectrum-web-components/dist/checkbox.js';
import '../../features/spectrum-web-components/dist/dialog.js';
import '../../features/spectrum-web-components/dist/link.js';
import '../../features/spectrum-web-components/dist/overlay.js';

const CATEGORY_ID_PREFIX = 'categories/';
const TYPE_ID_PREFIX = 'types/';

// allows improve TBT by returning control to the main thread.
// eslint-disable-next-line no-promise-executor-return
const makePause = async (timeout = 0) => new Promise((resolve) => setTimeout(resolve, timeout));

const getIdLeaf = (id) => (id?.substring(id.lastIndexOf('/') + 1) || id).toLowerCase();

const computeDaaLLText = (text) => {
  const tokens = text.split('-');
  if (tokens.length === 1) {
    return text;
  }
  return tokens
    .filter((token) => token !== 'and')
    .map((token) => token.substring(0, 3))
    .join('-');
};

const generateDaaLL = (text, headline) => `${text}--${headline}`;

const getCategories = (items, isMultilevel, mapCategories) => {
  const configuration = { manageTabIndex: true };
  if (isMultilevel) {
    configuration.variant = 'multilevel';
  }
  const mapParents = [];
  const tag = createTag('sp-sidenav', configuration);
  const merchTag = createTag('merch-sidenav-list', { deeplink: 'filter', 'daa-lh': 'b2|filters' });
  merchTag.append(tag);
  items.forEach((item) => {
    if (item?.id) {
      let parent = tag;
      const value = getIdLeaf(item.id);
      // first token is type, second is parent category
      const isParent = item.id.split('/').length <= 2;
      const itemTag = createTag('sp-sidenav-item', {
        label: item.name,
        value,
        'daa-ll': generateDaaLL(computeDaaLLText(value), 'cat'),
      });
      if (item.icon) {
        item.icon.setAttribute('slot', 'icon');
        itemTag.append(item.icon);
      }
      if (isParent) {
        mapParents[value] = itemTag;
        tag.append(itemTag);
      } else {
        const parentId = getIdLeaf(item.id.substring(0, item.id.lastIndexOf('/')));
        if (isMultilevel) {
          if (!mapParents[parentId]) {
            const parentItem = mapCategories[parentId];
            if (parentItem) {
              mapParents[parentId] = createTag('sp-sidenav-item', {
                label: parentItem.name,
                value: parentId,
                'daa-ll': generateDaaLL(computeDaaLLText(value), 'cat'),
              });
              tag.append(mapParents[parentId]);
            }
          }
          parent = mapParents[parentId];
        }
        parent?.append(itemTag);
      }
    }
  });
  return merchTag;
};

const getTypes = (arrayTypes, typeText) => {
  const tag = createTag('merch-sidenav-checkbox-group', { sidenavCheckboxTitle: typeText, deeplink: 'types', 'daa-lh': 'b3|types' });
  arrayTypes.forEach((item) => {
    if (item.name?.length > 0) {
      const checkbox = createTag('sp-checkbox', {
        emphasized: '',
        name: getIdLeaf(item.id),
        'daa-ll': generateDaaLL(item.name, 'types'),
      });
      checkbox.append(item.name);
      tag.append(checkbox);
    }
  });
  return tag;
};

const appendFilters = async (root, link, explicitCategoriesElt, typeText) => {
  try {
    const resp = await fetch(link);
    if (resp.ok) {
      const json = await resp.json();
      const mapCategories = {};
      let categoryValues = [];
      const types = [];
      json.data.forEach((item) => {
        if (item.id?.startsWith(CATEGORY_ID_PREFIX)) {
          const value = getIdLeaf(item.id);
          mapCategories[value] = item;
          categoryValues.push({ value });
        } else if (item.id?.startsWith(TYPE_ID_PREFIX)) {
          types.push(item);
        }
      });
      if (explicitCategoriesElt) {
        categoryValues = Array.from(explicitCategoriesElt.querySelectorAll('li'))
          .map((item) => ({
            value: item.textContent.trim().toLowerCase(),
            icon: item.querySelector('picture'),
          }));
      }
      let shallowCategories = true;
      if (categoryValues.length > 0) {
        await makePause();
        const items = categoryValues.map(({ value, icon }) => ({ ...mapCategories[value], icon }));
        const parentValues = new Set(items.map(({ id }) => id?.split('/')[1]));
        // all parent will always be here without children,
        // so shallow is considered below 2 parents
        shallowCategories = parentValues.size <= 2;
        const categoryTags = getCategories(items, !shallowCategories, mapCategories);
        root.append(categoryTags);
      }
      if (typeText && types.length > 0) {
        await makePause();
        root.append(getTypes(types, typeText));
      }
    }
  } catch (e) {
    window.lana?.log(`unable to properly fetch sidenav data: ${e}`);
  }
};

function appendCollectionFilters(root, categories) {
  const configuration = { manageTabIndex: true };
  // if (isMultilevel) {
  //   configuration.variant = 'multilevel';
  // }
  const tag = createTag('sp-sidenav', configuration);
  const merchTag = createTag('merch-sidenav-list', { deeplink: 'filter', 'daa-lh': 'b2|filters' });
  merchTag.append(tag);
  for (const category of categories) {
    const value = category.label.toLowerCase();
    const itemTag = createTag('sp-sidenav-item', {
      label: category.label,
      value,
      'daa-ll': generateDaaLL(computeDaaLLText(value), 'cat'),
    });
    tag.append(itemTag);
  }
  root.append(merchTag);
}

function appendSearch(rootNav, searchText) {
  if (searchText) {
    const spectrumSearch = createTag('sp-search', { placeholder: searchText });
    const search = createTag('merch-search', { deeplink: 'search' });
    search.append(spectrumSearch);
    rootNav.append(search);
  }
}

function appendResources(rootNav, resourceLink) {
  const literals = resourceLink.textContent.split(':');
  const sidenavListTitle = literals[0].trim();
  const tag = createTag('sp-sidenav', { manageTabIndex: true, class: 'resources' });
  const merchTag = createTag('merch-sidenav-list', { sidenavListTitle, 'daa-ll': generateDaaLL(sidenavListTitle, 'resources') });
  merchTag.append(tag);
  const label = literals[1].trim();
  const ariaLabel = resourceLink.getAttribute('aria-label') || '';
  const link = createTag('sp-sidenav-item', { href: resourceLink.href, 'daa-ll': generateDaaLL(sidenavListTitle, 'special-offers'), target: '_blank', selected: false });
  if (resourceLink.href && resourceLink.href.startsWith('http')) {
    link.append(document.createTextNode(label));
    const icon = createTag('sp-icon-link-out-light', { class: 'right', slot: 'icon', label });
    link.append(icon);
    link.updateComplete.then(() => {
      link.shadowRoot?.querySelector('a')?.setAttribute('aria-label', ariaLabel);
    });
  }
  tag.append(link);
  rootNav.append(merchTag);
}

export default async function init(el) {
  const [mainRow, categoryRow] = Array.from(el.children);

  const sidenavTitle = mainRow?.querySelector('h2,h3')?.textContent.trim();
  const searchText = mainRow?.querySelector('p > strong')?.textContent.trim();
  const typeText = mainRow?.querySelector('p > em')?.textContent.trim();
  // eslint-disable-next-line prefer-const
  const resourcesLink = mainRow?.querySelector('a');
  const collection = categoryRow?.querySelector('merch-card-collection');
  let endpoint;
  if (!collection) endpoint = categoryRow?.querySelector('a');
  const rootNav = createTag('merch-sidenav', { sidenavTitle });
  rootNav.className = el.className;
  const elements = [rootNav];
  if (collection) elements.push(collection);
  el.replaceWith(...elements);
  appendSearch(rootNav, searchText);
  if (endpoint) {
    await makePause();
    endpoint = localizeLink(endpoint.textContent.trim(), null, true);
    const explicitCategories = categoryRow?.querySelector('ul');
    performance.mark('sidenav:appendFilters:start');
    await appendFilters(rootNav, endpoint, explicitCategories, typeText);
    performance.mark('sidenav:appendFilters:end');
    performance.measure('sidenav:appendFilters', 'sidenav:appendFilters:start', 'sidenav:appendFilters:end');
  } else if (collection) {
    await collection.checkReady();
    appendCollectionFilters(rootNav, collection.data.fields.categories);
  }
  if (resourcesLink) {
    await makePause();
    appendResources(rootNav, resourcesLink);
  }
  return rootNav;
}
