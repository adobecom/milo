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
    if (el.firstChildElement?.tagName === 'STRONG') {
      size = 'wide';
      if (el.firstChildElement.firstChildElement?.tagName === 'U') {
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
  const type = el.classList[1];

  const attributes = { filter: 'all' };
  const settingsEl = el.querySelector(':scope > div > div');

  const filtered = settingsEl?.firstChild?.tagName === 'STRONG';

  const preferences = {};

  if (filtered) {
    attributes.filtered = true;
    preferences[filtered] = parsePreferences(el.querySelectorAll(':scope > div > div:nth-child(2) > p'));
  }

  if (settingsEl) {
    const [filter, showMoreText, limit = 24] = settingsEl
      .textContent.split(',').map((s) => s.trim());
    if (filter) {
      attributes.filter = filter;
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
    const resp = await fetch(`/query-index-cards.json?sheet=${type}`); // TODO locale
    if (!resp?.ok) {
      log(`Failed to initialize merch cards: ${resp.status}`);
    }
    const cardsData = await resp.json();

    // TODO add aditional parameters.
    const cards = cardsData.data.map(({ cardContent }) => cardContent).join('\n');
    const config = getConfig();
    // Replace placeholders
    merchCards.innerHTML = await replaceText(cards, config);
    const autoBlocks = await decorateLinks(merchCards);
    const blocks = [...merchCards.querySelectorAll(':scope > div'), ...autoBlocks];
    const loadingBlocks = Promise.all(blocks.map(loadBlock));
    await loadingBlocks;

    filterMerchCards(merchCards);
    [...merchCards.children].filter((card) => card.tagName === 'MERCH-CARD').forEach((merchCard) => {
      const filters = { ...merchCard.filters };
      Object.keys(filters).forEach((key) => {
        preferences[key]
          .forEach(([cardTitle, cardType], index) => {
            if (merchCard.title === cardTitle) {
              filters[key] = index;
              merchCard.type = cardType;
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
