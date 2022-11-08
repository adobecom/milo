import { getConfig, getMetadata } from '../../utils/utils.js';
import * as taxonomyLibrary from '../../scripts/taxonomy.js';

/*
 *
 * Taxonomy Utils
 *
*/

let taxonomyModule;

export function getTaxonomyModule() {
  return taxonomyModule;
}

/**
 * For the given list of topics, returns the corresponding computed taxonomy:
 * - category: main topic
 * - topics: tags as an array
 * - visibleTopics: list of visible topics, including parents
 * - allTopics: list of all topics, including parents
 * @param {Array} topics List of topics
 * @returns {Object} Taxonomy object
 */
function computeTaxonomyFromTopics(taxonomy, topics, path) {
  // no topics: default to a randomly choosen category
  const category = topics?.length > 0 ? topics[0] : 'news';

  if (taxonomy) {
    const allTopics = [];
    const visibleTopics = [];
    // if taxonomy loaded, we can compute more
    topics?.forEach((tag) => {
      const tax = taxonomy.get(tag);
      if (tax) {
        if (!allTopics.includes(tag) && !tax.skipMeta) {
          allTopics.push(tag);
          if (tax.isUFT) visibleTopics.push(tag);
          const parents = taxonomy.getParents(tag);
          if (parents) {
            parents.forEach((parent) => {
              const ptax = taxonomy.get(parent);
              if (!allTopics.includes(parent)) {
                allTopics.push(parent);
                if (ptax.isUFT) visibleTopics.push(parent);
              }
            });
          }
        }
      } else {
        // eslint-disable-next-line no-console
        console.warn(`Unknown topic in tags list: ${tag} ${path ? `on page ${path}` : '(current page)'}`);
      }
    });
    return { category, topics, visibleTopics, allTopics };
  }
  return { category, topics };
}

export async function loadTaxonomy() {
  taxonomyModule = await taxonomyLibrary.default(getConfig().locale?.prefix);
  if (taxonomyModule) {
    // taxonomy loaded, post loading adjustments
    // fix the links which have been created before the taxonomy has been loaded
    // (pre lcp or in lcp block).
    document.querySelectorAll('[data-topic-link]').forEach((a) => {
      const topic = a.dataset.topicLink;
      const tax = taxonomyModule.get(topic);
      if (tax) {
        a.href = tax.link;
      } else {
        // eslint-disable-next-line no-console
        console.warn(`Trying to get a link for an unknown topic: ${topic} (current page)`);
        a.href = '#';
      }
      delete a.dataset.topicLink;
    });

    // adjust meta article:tag

    const currentTags = getMetadata('article:tag', true) || [];
    const articleTax = computeTaxonomyFromTopics(taxonomyModule, currentTags);

    const allTopics = articleTax.allTopics || [];
    allTopics.forEach((topic) => {
      if (!currentTags.includes(topic)) {
        // computed topic (parent...) is not in meta -> add it
        const newMetaTag = document.createElement('meta');
        newMetaTag.setAttribute('property', 'article:tag');
        newMetaTag.setAttribute('content', topic);
        document.head.append(newMetaTag);
      }
    });

    currentTags.forEach((tag) => {
      const tax = taxonomyModule.get(tag);
      if (tax && tax.skipMeta) {
        // if skipMeta, remove from meta "article:tag"
        const meta = document.querySelector(`[property="article:tag"][content="${tag}"]`);
        if (meta) {
          meta.remove();
        }
        // but add as meta with name
        const newMetaTag = document.createElement('meta');
        newMetaTag.setAttribute('name', tag);
        newMetaTag.setAttribute('content', 'true');
        document.head.append(newMetaTag);
      }
    });
  }
}

export const getLocaleIetf = () => getConfig().locale?.ietf;

/**
 * Returns the language dependent root path
 * @returns {string} The computed root path
 */
export const getPrefix = () => (getConfig().locale?.prefix ? `/${getConfig().locale?.prefix}` : '');

/**
 * fetches the string variables.
 * @returns {object} localized variables
 */

export async function fetchPlaceholders() {
  if (!window.placeholders) {
    const resp = await fetch(`${getPrefix()}/placeholders.json`);
    const json = await resp.json();
    window.placeholders = {};
    json.data.forEach((placeholder) => {
      window.placeholders[placeholder.Key] = placeholder.Text;
    });
  }
  return window.placeholders;
}

export function stamp(message) {
  if (window.name.includes('performance')) {
    // eslint-disable-next-line no-console
    console.warn(`${new Date() - performance.timeOrigin}:${message}`);
  }
}
