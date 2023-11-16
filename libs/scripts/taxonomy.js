/*
 * Copyright 2022 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

const TAXONOMY_FIELDS = Object.freeze({
  level1: 'Level 1',
  level2: 'Level 2',
  level3: 'Level 3',
  hidden: 'Hidden',
  link: 'Link',
  type: 'Type',
  excludeFromMetadata: 'ExcludeFromMetadata',
});

const LEVEL_INDEX = {
  level1: 1,
  level2: 2,
  level3: 3,
};

const NO_INTERLINKS = Object.freeze('no-interlinks');

const CATEGORIES = Object.freeze('categories');
const PRODUCTS = Object.freeze('products');
const INDUSTRIES = Object.freeze('industries');
const INTERNALS = Object.freeze('internals');

/**
 * Filters a string to become a filename of a url
  * @param {*} name The name of the target page
 * @returns {string} The generated uri
 */
const generateUri = (name) => name
  .toLowerCase()
  .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // remove diacritics
  .replace(/\s/gm, '-') // replace whitespace with -
  .replace(/&amp;/gm, '') // remove encoded ampersands
  .replace(/&/gm, '') // remove unencoded ampersands
  .replace(/\./gm, '') // remove dots
  .replace(/--+/g, '-'); // remove multiple dashes

const removeLineBreaks = (topic) => (topic?.replace(/\n/gm, ' ').trim());
const isProduct = (cat) => cat && cat.toLowerCase() === PRODUCTS;

const findItem = (topic, category, taxonomy) => [topic].map((t) => {
  if (!category && taxonomy.products[t]) {
    return taxonomy.products[t];
  }
  if (!category) {
    return taxonomy.topics[t];
  }
  if (isProduct(category)) {
    return taxonomy.products[t];
  }
  return taxonomy.topics[t];
})[0];

async function fetchTaxonomy(target) {
  return fetch(target).then((response) => response.json());
}

function parseTaxonomyJson(data, root, route) {
  let level1; let level2;
  return data?.reduce((taxonomy, row) => {
    const level3 = removeLineBreaks(row[TAXONOMY_FIELDS.level3]);
    if (!level3) {
      level2 = removeLineBreaks(row[TAXONOMY_FIELDS.level2]);
      if (!level2) {
        level1 = removeLineBreaks(row[TAXONOMY_FIELDS.level1]);
      }
    }

    // eslint-disable-next-line no-nested-ternary
    const level = level3 ? LEVEL_INDEX.level3
      : (level2 ? LEVEL_INDEX.level2
        : LEVEL_INDEX.level1);

    const name = (level3 || level2 || level1)?.toLowerCase();
    const category = row[TAXONOMY_FIELDS.type]?.trim().toLowerCase() || INTERNALS;

    // skip duplicates
    if (!isProduct(category) && taxonomy.topics[name]) return taxonomy;
    if (isProduct(category) && taxonomy.products[name]) return taxonomy;

    const taxLink = row[TAXONOMY_FIELDS.link]
      ? new URL([row[TAXONOMY_FIELDS.link]])
      : generateUri(name);
    const path = taxLink.pathname
      ? taxLink.pathname?.replace('.html', '').split(`${route}/`).pop()
      : taxLink;
    const link = `${root}/${path}`;
    const hidden = !!row[TAXONOMY_FIELDS.hidden]?.trim();
    const skipMeta = !!row[TAXONOMY_FIELDS.excludeFromMetadata]?.trim();

    const item = {
      name,
      level,
      link,
      category,
      hidden,
      skipMeta,
    };

    if (isProduct(category)) {
      taxonomy.products[name] = item;
    } else {
      taxonomy.topics[name] = item;
    }

    if (!taxonomy.categories[item.category]) {
      taxonomy.categories[item.category] = [];
    }

    if (taxonomy.categories[item.category].indexOf(name) === -1) {
      taxonomy.categories[item.category].push(item.name);
    }

    const children = isProduct(category) ? taxonomy.productChildren : taxonomy.topicChildren;

    if (level3 && !children[level2]) {
      children[level2] = [];
    } else if (level3 && children[level2].indexOf(level3) === -1) {
      children[level2].push(level3);
    }

    if (level2 && !children[level1]) {
      children[level1] = [];
    } else if (level2 && children[level1].indexOf(level2) === -1) {
      children[level1].push(level2);
    }

    return taxonomy;
  }, {
    topics: {},
    products: {},
    categories: {},
    topicChildren: {},
    productChildren: {},
  });
}

const formatPath = (str) => str?.replace(/^\/+/g, '').replace(/\/+$/, '');

/**
 * Returns the taxonomy object
 * @param {string} config Environment's configurations
 * @param {*} route path to display topics. Defaults to {contentRoot}
 * @param {*} target URL to use to load the taxonomy. Defaults to {contentRoot}/taxonomy.json
 * @returns {object} The taxonomy object
 */
export default async (config, route, target) => {
  const root = route
    ? `${config.locale.contentRoot}/${formatPath(route)}`
    : config.locale.contentRoot;
  const path = target || `${config.locale.contentRoot}/taxonomy.json`;

  return fetchTaxonomy(path)
    .then((json) => {
      const taxonomy = parseTaxonomyJson(json.data, root, route);

      return {
        CATEGORIES,
        INDUSTRIES,
        INTERNALS,
        PRODUCTS,
        NO_INTERLINKS,

        lookup(topic) {
          return this.get(topic, PRODUCTS)
            || this.get(topic.replace('Adobe ', ''), PRODUCTS)
            || this.get(topic);
        },

        get(topic, cat) {
          // take first one of the list
          const item = findItem(topic?.toLowerCase(), cat?.toLowerCase(), taxonomy);

          if (!item) { return null; }

          return {
            name: item.name,
            link: this.getLink(item.name, cat),
            isUFT: this.isUFT(item.name, cat),
            skipMeta: this.skipMeta(item.name, cat),
            level: item.level,
            parents: this.getParents(item.name, cat),
            children: this.getChildren(item.name, cat),
            category: this.getCategoryTitle(item.category),
          };
        },

        isUFT(topic, cat) {
          const t = findItem(topic, cat, taxonomy);
          return t && !t.hidden;
        },

        skipMeta(topic, cat) {
          const t = findItem(topic, cat, taxonomy);
          return t && t.skipMeta;
        },

        getLink(topic, cat) {
          const t = findItem(topic, cat, taxonomy);
          const link = t?.link?.replace('.html', '');
          return link;
        },

        getParents(topics, cat) {
          const list = typeof topics === 'string' ? [topics] : topics;
          return list.reduce((parents, topic) => {
            const t = findItem(topic, cat, taxonomy);
            if (t) {
              if (t.level3) {
                if (parents.indexOf(t.level2) === -1) parents.push(t.level2);
                if (parents.indexOf(t.level1) === -1) parents.push(t.level1);
              } else if (t.level2 && parents.indexOf(t.level1) === -1) {
                parents.push(t.level1);
              }
            }

            return parents;
          }, []);
        },

        getChildren(topic, cat) {
          const children = isProduct(cat) ? taxonomy.productChildren : taxonomy.topicChildren;
          return children[topic] ?? [];
        },

        getCategory(cat) {
          return taxonomy.categories[cat.toLowerCase()] ?? [];
        },

        getCategoryTitle(cat) {
          return cat.charAt(0).toUpperCase() + cat.substring(1);
        },
      };
    });
};
