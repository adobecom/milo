import { createTag, decorateLinks, getConfig, loadBlock, loadStyle } from '../../utils/utils.js';
import { replaceText } from '../../features/placeholders.js';

const DIGITS_ONLY = /^\d+$/;

const LITERAL_SLOTS = [
  'searchText',
  'filtersText',
  'sortText',
  'popularityText',
  'alphabeticallyText',
  'noResultText',
  'resultText',
  'resultsText',
  'searchResultText',
  'searchResultsText',
  'searchResultMobileText',
  'searchResultsMobileText',
  'noSearchResultsText',
  'noSearchResultsMobileText',
  'showMoreText',
];

// allows improve TBT by returning control to the main thread.
// eslint-disable-next-line no-promise-executor-return
const makePause = async (timeout = 0) => new Promise((resolve) => setTimeout(resolve, timeout));

const localizedPath = (path, config) => `${config?.locale?.prefix
    && path.indexOf(config.locale.prefix) !== 0 ? config.locale.prefix : ''}${path}`;

const fail = (el, err = '') => {
  window.lana?.log(`Failed to initialize merch cards: ${err}`);
  el.innerHTML = '';
  return el;
};

/** Parse andd prepare cards */
async function getCardsRoot(config, html) {
  const cards = `<div>${html}</div>`;
  const fragment = document.createRange().createContextualFragment(
    await replaceText(cards, config),
  );
  const cardsRoot = fragment.firstElementChild;
  const allBlockEls = [...cardsRoot.querySelectorAll(':scope > div')];
  const batchSize = 12;
  for (let i = 0; i < allBlockEls.length; i += batchSize) {
    const blockEls = allBlockEls.slice(i, i + batchSize);
    await Promise.all(blockEls.map((cardEl) => Promise.all(
      decorateLinks(cardEl).map(loadBlock),
    ).then(() => loadBlock(cardEl))));
    await makePause();
  }
  return cardsRoot;
}

const fetchOverrideCard = (path, config) => new Promise((resolve, reject) => {
  try {
    fetch(`${localizedPath(path, config)}.plain.html`).then((res) => {
      if (res.ok) {
        res.text().then((cardContent) => {
          resolve({ path, cardContent: /^<div>(.*)<\/div>$/.exec(cardContent.replaceAll('\n', ''))[1] });
        });
      } else {
        reject(res.statusText || res.status);
      }
    });
  } catch (error) {
    reject(error);
  }
});

async function overrideCards(root, overridePromises, config) {
  try {
    if (overridePromises?.length > 0) {
      // Wait for all override cards to be fetched
      const overrideData = await Promise.all(overridePromises);

      if (overrideData?.length > 0) {
        const overrideRoot = await getCardsRoot(config, overrideData?.map(({ cardContent }) => cardContent).join('\n'));
        const overrideMap = {};
        overrideRoot.querySelectorAll('merch-card').forEach((card) => { if (card.name) { overrideMap[card.name] = card; } });
        root.querySelectorAll('merch-card').forEach((card) => {
          if (card.name && overrideMap[card.name]) {
            card.replaceWith(overrideMap[card.name]);
          }
        });
      }
    }
  } catch (error) {
    window?.lana.error('Failed to override cards', error);
  }
}

/**
 * Removes merch cards from the DOM if they are not meant to be displayed in this merch cards block.
 * @param {*} merchCardCollection merch-card-collection element
 */
export function filterMerchCards(merchCardCollection, filtered) {
  [...merchCardCollection.children].filter((child) => child.tagName === 'MERCH-CARD')
    .forEach((card) => {
      if (!Object.prototype.hasOwnProperty.call(card.filters, filtered)) {
        card.remove();
      }
    });
}

/** parse card preferences for each category filter */
export function parsePreferences(elements) {
  return [...elements].map((el) => {
    let size;
    if (el?.firstElementChild?.tagName === 'STRONG') {
      size = 'wide';
      if (el.firstElementChild.firstElementChild?.tagName === 'U') {
        size = 'super-wide';
      }
    }
    return [el.textContent?.trim(), size];
  });
}

/** Retrieve cards from query-index  */
async function fetchCardsData(config, type, el) {
  let cardsData;
  let err;
  const endpointElement = el.querySelector('a[href*="query-index-cards.json"]');
  if (!endpointElement) {
    return fail(el, 'Missing query-index-cards configuration');
  }
  endpointElement.remove();
  let queryIndexCardPath = localizedPath(endpointElement.getAttribute('href'), config);
  if (!queryIndexCardPath) {
    return fail(el, 'Missing query-index-cards configuration');
  }
  if (/\.json$/.test(queryIndexCardPath)) {
    queryIndexCardPath = `${queryIndexCardPath}?sheet=${type}`;
  }
  try {
    const res = await fetch(queryIndexCardPath);
    if (res.ok) {
      cardsData = await res.json();
    } else {
      err = res.statusText || res.status;
    }
  } catch (error) {
    err = error.message;
  }
  if (!cardsData) {
    fail(el, err);
  }
  return cardsData;
}

async function initMerchCards(filtered, preferences, cardsRoot) {
  if (filtered) {
    filterMerchCards(cardsRoot, filtered);
  }
  // re-order cards, update card filters
  [...cardsRoot.children].filter((card) => card.tagName === 'MERCH-CARD').forEach((merchCard) => {
    merchCard.style.display = 'none';
    const filters = { ...merchCard.filters };
    Object.keys(filters).forEach((key) => {
      const preference = preferences[key];
      if (!preference) return;
      preference
        .forEach(([sortKey, cardSize], index) => {
          if (merchCard.name === sortKey || merchCard.title === sortKey) {
            filters[key] = { order: index + 1, size: cardSize };
          }
        });
    });
    merchCard.filters = filters;
  });
  return cardsRoot;
}

export default async function init(el) {
  if (el.classList.length < 2) {
    return fail(el, 'Missing collection type');
  }
  const config = getConfig();
  const type = el.classList[1];
  const cardsDataPromise = fetchCardsData(config, type, el);

  const merchCardCollectionDep = import('../../deps/merch-card-collection.js');
  const personalizationDep = import('../../features/personalization/personalization.js');
  let deps = [
    merchCardCollectionDep,
    personalizationDep,
    import('../merch-card/merch-card.js'),
    import('../../deps/merch-card.js'),
  ];

  const { miloLibs } = getConfig();
  const merchStyles = new Promise((resolve) => {
    loadStyle(`${miloLibs}/blocks/merch/merch.css`, resolve);
  });
  const merchCardStyles = new Promise((resolve) => {
    loadStyle(`${miloLibs}/blocks/merch-card/merch-card.css`, resolve);
  });

  const cardsData = await cardsDataPromise;

  const cardsRootPromise = getCardsRoot(config, cardsData.data.map(({ cardContent }) => cardContent).join('\n'));

  const attributes = { filter: 'all', class: `${el.className}` };
  const settingsEl = el.firstElementChild?.firstElementChild;

  const filtered = settingsEl.querySelector('p > strong') !== null;

  if (!el.matches('[class*="-merch-card"]') && !el.closest('main > .section[class*="-merch-card"]')) {
    el.closest('main > .section').classList.add('four-merch-cards', type);
  }

  deps = !filtered
    ? [
      ...deps,
      import(`${miloLibs}/features/spectrum-web-components/dist/theme.js`),
      import(`${miloLibs}/features/spectrum-web-components/dist/button.js`),
      import(`${miloLibs}/features/spectrum-web-components/dist/search.js`),
      import(`${miloLibs}/features/spectrum-web-components/dist/overlay.js`),
      import(`${miloLibs}/features/spectrum-web-components/dist/menu.js`),
      import(`${miloLibs}/features/spectrum-web-components/dist/popover.js`),
    ] : [];

  const preferences = {};

  if (settingsEl) {
    const [filter, limit = 24] = settingsEl
      .textContent.split(',').map((s) => s.trim());

    settingsEl.parentElement.remove();

    if (filtered) {
      attributes.filtered = filter;
      preferences[filter] = parsePreferences(el.querySelectorAll('p'));
    } else {
      if (filter) {
        attributes.filter = filter;
      }
      [...el.children].forEach((filterElement) => {
        const filterName = filterElement.firstElementChild.textContent?.trim();
        const elements = [...filterElement.lastElementChild.querySelectorAll('p')];
        preferences[filterName] = parsePreferences(elements);
      });
    }

    if (limit) {
      attributes.limit = limit;
    }
  }

  const literalsEl = el.lastElementChild?.firstElementChild;
  // parse literals
  const literalSlots = [];
  if (literalsEl && /filter/.test(literalsEl.querySelector('u')?.innerText)) {
    literalsEl.querySelectorAll('u').forEach((u) => {
      const text = u.innerText.trim();
      if (DIGITS_ONLY.test(text)) {
        u.outerHTML = '<span data-placeholder="resultCount"></span>';
      } else if (text === 'search') {
        u.outerHTML = '<span data-placeholder="searchTerm"></span>';
      } else if (text === 'filter') {
        u.outerHTML = '<span data-placeholder="filter"></span>';
      }
    });
    let index = 0;
    while (literalsEl.firstElementChild) {
      const literalEl = literalsEl.firstElementChild;
      let slot;
      if (literalEl.tagName === 'P') {
        slot = literalEl;
      } else if (literalEl.tagName === 'HR') {
        slot = createTag('div');
        while (literalEl.nextElementSibling && literalEl.nextElementSibling?.tagName !== 'HR') {
          slot.appendChild(literalEl.nextElementSibling);
        }
        literalEl.nextElementSibling?.remove?.();
      }
      literalEl.remove();
      if (slot) {
        slot.setAttribute('slot', LITERAL_SLOTS[index]);
        index += 1;
      }
      literalSlots.push(slot);
    }
  }

  await merchCardCollectionDep;
  performance.mark('merch-card-collection-render:start');
  const merchCardCollection = createTag('merch-card-collection', attributes);
  el.replaceWith(merchCardCollection);
  if (literalSlots.length > 0) {
    merchCardCollection.append(...literalSlots);
  } else if (!merchCardCollection.filtered) {
    merchCardCollection.filtered = 'all';
  }

  const cardsRoot = await cardsRootPromise;
  const { OVERRIDE_PATHS } = await personalizationDep;
  const overrides = el.dataset[OVERRIDE_PATHS];
  const overridePromises = overrides?.split(',').map(fetchOverrideCard);
  await overrideCards(cardsRoot, overridePromises, config);
  await initMerchCards(attributes.filtered, preferences, cardsRoot);
  await Promise.all([merchStyles, merchCardStyles, ...deps]);

  merchCardCollection.append(...cardsRoot.children);
  merchCardCollection.displayResult = true;
  await merchCardCollection.updateComplete;
  performance.measure(
    'merch-card-collection-render',
    'merch-card-collection-render:start',
  );
  return merchCardCollection;
}
