import { createTag, getConfig } from '../../utils/utils.js';
import { replaceKey } from '../../features/placeholders.js';
import { loadCaas } from '../caas/caas.js';

export default async function init(block) {
  if (!block.closest('.blog-side-navigation')) {
    block.hidden = true;
    return;
  }
  if (block.dataset.relatedContentInitialized) return;
  block.hidden = true;

  const rows = [...block.children].map((row) => [...row.children]);
  const collection = rows.find(([key]) => key?.textContent.trim().toLowerCase() === 'collection')
    ?.[1]?.querySelector('a');
  if (!collection?.hash) {
    window.lana?.log('Blog related content requires a CaaS collection link.', {
      tags: 'blog-related-content',
      severity: 'error',
    });
    return;
  }
  const title = rows.find(([key]) => key?.textContent.trim().toLowerCase() === 'heading')
    ?.[1]?.textContent.trim() || await replaceKey('related-content', getConfig());
  const heading = createTag('h3', null, title);
  const content = createTag('div', { class: 'blog-related-content-collection' }, collection);
  block.replaceChildren(heading, content);
  block.dataset.relatedContentInitialized = 'true';
  try {
    await loadCaas(collection, {
      cardStyle: 'horizontal-card',
      layoutType: '1up',
      theme: 'lightest',
      totalCardsToShow: 3,
      collectionSize: 3,
      resultsPerPage: 3,
      collectionTitle: '',
      cardTitleAccessibilityLevel: 4,
      partialLoadEnabled: false,
      showSearch: false,
      showFilters: false,
      sortEnablePopup: false,
      paginationEnabled: false,
      paginationQuantityShown: false,
      showTotalResults: false,
      showBookmarksOnCards: false,
      onlyShowBookmarkedCards: false,
      hideDateInterval: true,
      disableBanners: true,
      useOverlayLinks: true,
    });
    block.hidden = false;
  } catch (error) {
    window.lana?.log(`Blog related content failed to load: ${error.message}`, {
      tags: 'blog-related-content',
      severity: 'error',
    });
  }
}
