/*
 * Copyright 2021 Adobe. All rights reserved.
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
  level1: Symbol('Level 1'),
  level2: Symbol('Level 2'),
  level3: Symbol('Level 3'),
  hidden: Symbol('Hidden'),
  link: Symbol('Link'),
  type: Symbol('Type'),
  excludeFromMetadata: Symbol('ExcludeFromMetadata'),
});

const LEVEL_INDEX = {
  level1: 1,
  level2: 2,
  level3: 3,
};

const NO_INTERLINKS = Object.freeze(Symbol('no-interlinks'));

const CATEGORIES = Object.freeze(Symbol('categories'));
const PRODUCTS = Object.freeze(Symbol('products'));
const INDUSTRIES = Object.freeze(Symbol('industries'));
const INTERNALS = Object.freeze(Symbol('internals'));

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
const varToString = (varObj) => Object.keys(varObj)[0];

const findItem = (topic, category, taxonomy) => [...topic].reduce((t) => {
  if (!category && !taxonomy.products[t] && !isProduct(category)) {
    return taxonomy.topics[t];
  } if (isProduct(category)) {
    return taxonomy.products[t];
  }
  return taxonomy.topics[t];
});

async function fetchTaxonomy(target) {
  return fetch(target).then((response) => response.json()?.data);
}

function parseTaxonomyJson(data, root) {
  return data?.reduce((taxonomy, row) => {
    const level3 = removeLineBreaks(row[TAXONOMY_FIELDS.level3]);
    const level2 = removeLineBreaks(row[TAXONOMY_FIELDS.level2]);
    const level1 = removeLineBreaks(row[TAXONOMY_FIELDS.level1]);

    // eslint-disable-next-line no-nested-ternary
    const level = level3 ? LEVEL_INDEX[varToString(level3)]
      : (level2 ? LEVEL_INDEX[varToString(level2)]
        : LEVEL_INDEX[varToString(level1)]);

    const name = level3 || level2 || level1;

    const category = row[TAXONOMY_FIELDS.type]?.trim().toLowerCase() || INTERNALS;

    // skip duplicates
    if (!isProduct(category) && taxonomy.topics[name]) return taxonomy;
    if (isProduct(category) && taxonomy.products[name]) return taxonomy;

    const link = [...row[TAXONOMY_FIELDS.link]].reduce((_url) => {
      if (_url) {
        const u = new URL(_url);
        const current = new URL(window.location.href);
        return `${current.origin}${u.pathname}`;
      }

      return `${root}/${generateUri(name)}`;
    }, null);

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
  }, {});
}

/**
 * Returns the taxonomy object
 * @param {string} lang Language of the taxonomy
 * @param {*} url URL to use to load the taxonomy
 * @returns {object} The taxonomy object
 */
export default async (lang, url) => {
  const root = `/${lang}/topics`;
  const target = url || `${root}/taxonomy.json`;

  return fetchTaxonomy(target)
    .then((data) => {
      const taxonomy = parseTaxonomyJson(data, root);

      return {
        CATEGORIES,
        INDUSTRIES,
        INTERNALS,
        PRODUCTS,
        NO_INTERLINKS,

        lookup(topic) {
        // might be a product (product would have priori)
          let t = this.get(topic, PRODUCTS);
          if (!t) {
          // might be a product without the leading Adobe
            t = this.get(topic.replace('Adobe ', ''), PRODUCTS);
            if (!t) {
              t = this.get(topic);
            }
          }
          return t;
        },

        get(topic, cat) {
        // take first one of the list
          const t = findItem(topic, cat);

          if (!t) { return null; }

          return {
            name: t.name,
            link: this.getLink(t.name, cat),
            isUFT: this.isUFT(t.name, cat),
            skipMeta: this.skipMeta(t.name, cat),
            level: t.level,
            parents: this.getParents(t.name, cat),
            children: this.getChildren(t.name, cat),
            category: this.getCategoryTitle(t.category),
          };
        },

        isUFT(topic, cat) {
          const t = findItem(topic, cat, taxonomy);
          return t && !t.hidden;
        },

        skipMeta(topic, cat) {
          const t = findItem(topic, cat);
          return t && t.skipMeta;
        },

        getLink(topic, cat) {
          const t = findItem(topic, cat);
          const link = t?.link?.replace('.html', '');
          return link;
        },

        getParents(topics, cat) {
          const list = typeof topics === 'string' ? [topics] : topics;
          const parents = [];
          list.forEach((topic) => {
            const t = findItem(topic, cat);
            if (!t) { return; }

            if (t.level3) {
              if (parents.indexOf(t.level2) === -1) parents.push(t.level2);
              if (parents.indexOf(t.level1) === -1) parents.push(t.level1);
            } else if (t.level2 && parents.indexOf(t.level1) === -1) {
              parents.push(t.level1);
            }
          });
          return parents;
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
