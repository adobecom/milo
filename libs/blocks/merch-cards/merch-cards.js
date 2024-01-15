import '../../deps/merch-cards.js';
import '../../deps/merch-card.js';
import '../../deps/commerce.js';
import '../merch/merch.js';
import '../merch-card/merch-card.js';
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
const makePause = async () => new Promise((resolve) => setTimeout(resolve, 0));

const fail = (el, err = '') => {
  window.lana?.log(`Failed to initialize merch cards: ${err}`);
  el.innerHTML = '';
  return el;
};

/**
 * Removes merch cards from the DOM if they are not meant to be displayed in this merch cards block.
 * @param {*} merchCards merch-cards element
 */
export function filterMerchCards(merchCards, filtered) {
  [...merchCards.children].filter((child) => child.tagName === 'MERCH-CARD')
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

async function initMerchCards(config, type, filtered, el, preferences) {
  let cardsData;
  let err;

  try {
    const res = await fetch(`${config?.locale?.prefix ?? ''}${config.queryIndexCardPath}.json?sheet=${type}`);
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

  const cards = `<div>${cardsData.data.map(({ cardContent }) => cardContent).join('\n')}</div>`;
  const fragment = document.createRange().createContextualFragment(cards);
  const cardsRoot = fragment.firstElementChild;
  await makePause();
  // Replace placeholders
  cardsRoot.innerHTML = await replaceText(cardsRoot.innerHTML, config);
  await makePause();
  const autoBlocks = await decorateLinks(cardsRoot).map(loadBlock);
  await Promise.all(autoBlocks);
  await makePause();
  const blocks = [...cardsRoot.querySelectorAll(':scope > div')].map(loadBlock);

  // process merch card blocks in batches of 3.
  const batchSize = 3;
  for (let i = 0; i < blocks.length; i += batchSize) {
    const batch = blocks.slice(i, i + batchSize);
    await Promise.all(batch);
    await makePause();
  }

  if (filtered) {
    filterMerchCards(cardsRoot, filtered);
  }
  // re-order cards, update card filters
  [...cardsRoot.children].filter((card) => card.tagName === 'MERCH-CARD').forEach((merchCard) => {
    const filters = { ...merchCard.filters };
    Object.keys(filters).forEach((key) => {
      const preference = preferences[key];
      if (!preference) return;
      preference
        .forEach(([cardTitle, cardSize], index) => {
          if (merchCard.title === cardTitle) {
            filters[key] = { order: index, size: cardSize };
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
  if (!config.queryIndexCardPath) {
    return fail(el, 'Missing queryIndexCardPath config');
  }

  const { miloLibs } = getConfig();
  loadStyle(`${miloLibs}/blocks/merch/merch.css`);
  loadStyle(`${miloLibs}/blocks/merch-card/merch-card.css`);

  const attributes = { filter: 'all' };
  const settingsEl = el.firstElementChild?.firstElementChild;

  const filtered = settingsEl?.firstElementChild?.tagName === 'STRONG';

  if (!filtered) {
    await Promise.all([
      import(`${miloLibs}/features/spectrum-web-components/dist/theme.js`),
      import(`${miloLibs}/features/spectrum-web-components/dist/button.js`),
      import(`${miloLibs}/features/spectrum-web-components/dist/search.js`),
      import(`${miloLibs}/features/spectrum-web-components/dist/overlay.js`),
      import(`${miloLibs}/features/spectrum-web-components/dist/menu.js`),
      import(`${miloLibs}/features/spectrum-web-components/dist/popover.js`),
    ]);
  }

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

  const type = el.classList[1];
  const merchCards = createTag('merch-cards', attributes);
  if (literalSlots.length > 0) {
    merchCards.append(...literalSlots);
  } else if (!merchCards.filtered) {
    merchCards.filtered = 'all';
  }
  initMerchCards(config, type, attributes.filtered, el, preferences)
    .then((async (cardsRoot) => {
      const cards = [...cardsRoot.children];
      const batchSize = 3;
      for (let i = 0; i < cards.length; i += batchSize) {
        const batch = cards.slice(i, i + batchSize);
        merchCards.append(...batch);
        if (i === batchSize) {
          // avoid layout shift due to size of first cards.
          merchCards.requestUpdate();
        }
        await makePause();
      }
      merchCards.displayResult = true;
    }
    ));

  const appContainer = document.querySelector('.merch.app');

  if (appContainer) {
    merchCards.classList.add('four-merch-cards', type);
    appContainer.appendChild(merchCards);
    el.remove();
  } else {
    if (!el.closest('main > .section[class*="-merch-card"]')) {
      el.closest('main > .section').classList.add('four-merch-cards', type);
    }
    el.replaceWith(merchCards);
  }

  return merchCards;
}
