import '../../deps/merch-cards.js';
import { createTag, decorateLinks, getConfig, loadBlock } from '../../utils/utils.js';
import { replaceText } from '../../features/placeholders.js';

const { log } = window.lana;

/**
 * Removes merch cards from the DOM if they are not meant to be displayed in this merch cards block.
 * @param {*} merchCards merch-cards element
 */
export function filterMerchCards(merchCards) {
  if (!merchCards.filtered) return;
  [...merchCards.children].filter((card) => card.tagName === 'MERCH-CARD')
    .forEach((card) => {
      if (!Object.prototype.hasOwnProperty.call(card.filters, merchCards.filtered)) {
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

// eslint-disable-next-line consistent-return
export default async function main(el) {
  if (el.classList.length < 2) {
    log('Missing collection type');
    return null; // return silently.
  }
  if (!el.closest('main > .section[class*="-merch-card"]')) {
    el.closest('main > .section').classList.add('four-merch-cards');
  }
  const type = el.classList[1];

  const attributes = { filter: 'all' };
  const settingsEl = el.firstElementChild?.firstElementChild;

  const filtered = settingsEl?.firstElementChild?.tagName === 'STRONG';

  const preferences = {};

  if (settingsEl) {
    const [filter, showMoreText, limit = 24] = settingsEl
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
    if (showMoreText) {
      attributes['show-more-text'] = showMoreText;
    }
    if (limit) {
      attributes.limit = limit;
    }
  }
  const merchCards = createTag('merch-cards', attributes);
  try {
    const config = getConfig();
    const resp = await fetch(`${config?.locale?.prefix ?? ''}/cc-shared/assets/query-index-cards.json?sheet=${type}`);
    if (!resp?.ok) {
      log(`Failed to initialize merch cards: ${resp.status}`);
    }
    const cardsData = await resp.json();

    // TODO add aditional parameters.
    const cards = cardsData.data.map(({ cardContent }) => cardContent).join('\n');
    // Replace placeholders
    merchCards.innerHTML = await replaceText(cards, config);
    const autoBlocks = await decorateLinks(merchCards).map(loadBlock);
    await Promise.all(autoBlocks);
    const blocks = [...merchCards.querySelectorAll(':scope > div')].map(loadBlock);
    await Promise.all(blocks);

    filterMerchCards(merchCards);

    // re-order cards, update card filters
    [...merchCards.children].filter((card) => card.tagName === 'MERCH-CARD').forEach((merchCard) => {
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

    el.replaceWith(merchCards);
    return merchCards;
  } catch (err) {
    log(`Failed to initialize merch cards: ${err?.message}`);
  }
}
