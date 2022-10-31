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

const HEADERS = Object.freeze({
  level1: Symbol('Level 1'),
  level2: Symbol('Level 2'),
  level3: Symbol('Level 3'),
  hidden: Symbol('Hidden'),
  link: Symbol('Link'),
  type: Symbol('Type'),
  excludeFromMetadata: Symbol('ExcludeFromMetadata'),
});

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

/**
 * Returns the taxonomy object
 * @param {string} lang Language of the taxonomy
 * @param {*} url URL to use to load the taxonomy
 * @returns {object} The taxonomy object
 */
export default async (lang, url) => {
  const root = `/${lang}/topics`;

  const escapeTopic = (topic) => (topic ? topic.replace(/\n/gm, ' ').trim() : null);
  const isProduct = (cat) => cat && cat.toLowerCase() === PRODUCTS;

  const target = url ?? `${root}/taxonomy.json`;

  return fetch(target)
    .then((response) => response.json())
    .then((json) => {
      const data = {
        topics: {},
        products: {},
        categories: {},
        topicChildren: {},
        productChildren: {},
      };

      if (json?.data?.length > 0) {
        let level; let level1; let level2; let
          level3;

        json.data.forEach((row) => {
          level = 3;
          level3 = escapeTopic(row[HEADERS.level3] !== '' ? row[HEADERS.level3] : null);
          if (!level3) {
            level = 2;
            level2 = escapeTopic(row[HEADERS.level2] !== '' ? row[HEADERS.level2] : null);
            if (!level2) {
              level = 1;
              level1 = escapeTopic(row[HEADERS.level1]);
            }
          }

          const name = level3 ?? level2 ?? level1;

          const category = row[HEADERS.type] ? row[HEADERS.type].trim().toLowerCase() : INTERNALS;

          // skip duplicates
          if (!isProduct(category) && data.topics[name]) return;
          if (isProduct(category) && data.products[name]) return;

          let link = row[HEADERS.link] !== '' ? row[HEADERS.link] : null;
          if (link) {
            const u = new URL(link);
            const current = new URL(window.location.href);
            link = `${current.origin}${u.pathname}`;
          } else {
            link = `${root}/${generateUri(name)}`;
          }

          const item = {
            name,
            level,
            level1,
            level2,
            level3,
            link,
            category,
            hidden: row[HEADERS.hidden] ? row[HEADERS.hidden].trim() !== '' : false,
            skipMeta: row[HEADERS.excludeFromMetadata] ? row[HEADERS.excludeFromMetadata].trim() !== '' : false,
          };

          if (!isProduct(category)) {
            data.topics[name] = item;
          } else {
            data.products[name] = item;
          }

          if (!data.categories[item.category]) {
            data.categories[item.category] = [];
          }

          if (data.categories[item.category].indexOf(name) === -1) {
            data.categories[item.category].push(item.name);
          }

          const children = isProduct(category) ? data.productChildren : data.topicChildren;
          if (level3) {
            if (!children[level2]) {
              children[level2] = [];
            }
            if (children[level2].indexOf(level3) === -1) {
              children[level2].push(level3);
            }
          }

          if (level2) {
            if (!children[level1]) {
              children[level1] = [];
            }
            if (children[level1].indexOf(level2) === -1) {
              children[level1].push(level2);
            }
          }
        });
      }

      const findItem = (topic, cat) => {
        let t;
        if (!cat) {
          t = data.products[topic];
          if (!isProduct(cat) && !t) {
            t = data.topics[topic];
          }
        } else if (isProduct(cat)) {
          t = data.products[topic];
        } else {
          t = data.topics[topic];
        }
        return t;
      };

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
          const t = findItem(topic, cat);
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
          const children = isProduct(cat) ? data.productChildren : data.topicChildren;
          return children[topic] ?? [];
        },

        getCategory(cat) {
          return data.categories[cat.toLowerCase()] ?? [];
        },

        getCategoryTitle(cat) {
          return cat.charAt(0).toUpperCase() + cat.substring(1);
        },
      };
    });
};
