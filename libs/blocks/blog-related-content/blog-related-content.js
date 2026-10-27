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
    await loadCaas(collection);
    block.hidden = false;
  } catch (error) {
    window.lana?.log(`Blog related content failed to load: ${error.message}`, {
      tags: 'blog-related-content',
      severity: 'error',
    });
  }
}
