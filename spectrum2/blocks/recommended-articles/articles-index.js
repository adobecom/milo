const DEFAULT_PAGE_SIZE = 500;
const TAXONOMY_ROUTE_DEFAULT = '/topics';
const BASE_PATH = /^\/[A-Za-z0-9._~%/-]*$/;

export const PLACEHOLDER_DEFAULTS = Object.freeze({
  'recommended-for-you': 'Recommended for you',
  'load-more': 'Load more articles',
  'no-results': 'No results found',
  'no-matches': 'No matches found',
  'user-help': 'Try checking your spelling or using more general terms',
  'articles-unavailable': 'Articles could not be loaded',
  loading: 'Loading articles',
  filters: 'Filters',
  search: 'Search',
  reset: 'Reset',
  apply: 'Apply',
  'clear-all': 'Clear all',
  'showing-articles-for': 'Showing articles for',
});

export const blogIndex = {
  data: [],
  byPath: {},
  offset: 0,
  complete: false,
  config: {},
  offsetData: [],
};

const jsonCache = new Map();

export function resetArticleState() {
  blogIndex.data = [];
  blogIndex.byPath = {};
  blogIndex.offset = 0;
  blogIndex.complete = false;
  blogIndex.config = {};
  blogIndex.offsetData = [];
  jsonCache.clear();
}

export function fetchOf(win) {
  const host = win && typeof win.fetch === 'function' ? win : globalThis;
  return (...args) => host.fetch(...args);
}

export function metaContent(doc, name) {
  if (!doc || !name) return null;
  const attr = name.includes(':') ? 'property' : 'name';
  const head = doc.head || doc.querySelector?.('head');
  const meta = head?.querySelector(`meta[${attr}="${name}"]`);
  return meta ? meta.getAttribute('content') : null;
}

export function siteRoot(doc, url) {
  let u;
  try {
    u = new URL(url);
  } catch (e) {
    return null;
  }
  const raw = String(metaContent(doc, 'base-site-path') || '').trim().replace(/\/+$/, '');
  if (!raw || !BASE_PATH.test(raw)) return u.origin;
  const at = `${u.pathname}/`.indexOf(`${raw}/`);
  return `${u.origin}${at > 0 ? u.pathname.slice(0, at) : ''}${raw}`;
}

export function withLangRoot(link, doc) {
  const langRoot = metaContent(doc, 'lang-root');
  if (!langRoot) return link;
  try {
    const url = new URL(link);
    url.pathname = `${langRoot}${url.pathname}`;
    return url.href;
  } catch (e) {
    return link;
  }
}

export function fetchJson(url, win) {
  if (!jsonCache.has(url)) {
    const p = fetchOf(win)(url).then((resp) => {
      if (!resp || !resp.ok) throw new Error(`spectrum2: ${url} answered ${resp ? resp.status : 'nothing'}`);
      return resp.json();
    });
    p.catch(() => jsonCache.delete(url));
    jsonCache.set(url, p);
  }
  return jsonCache.get(url);
}

function defaultIndexPath(doc) {
  const root = doc ? siteRoot(doc, doc.baseURI) : null;
  return withLangRoot(`${root || ''}/query-index.json`, doc);
}

export async function loadIndexPage(config, limit, { win, doc } = {}) {
  if (blogIndex.complete) return (blogIndex);
  const pageSize = limit || DEFAULT_PAGE_SIZE;
  const { feed } = config || blogIndex.config;
  const queryParams = `?limit=${pageSize}&offset=${blogIndex.offset}`;
  blogIndex.offset += pageSize;
  const indexPath = feed ? `${feed}${queryParams}` : `${defaultIndexPath(doc)}${queryParams}`;

  return fetchOf(win)(indexPath)
    .then((response) => response.json())
    .then((json) => {
      const complete = (json.limit + json.offset) >= json.total;
      json.data.forEach((post) => {
        blogIndex.data.push(post);
        blogIndex.byPath[post.path.split('.')[0]] = post;
      });
      blogIndex.offsetData = json.data;
      blogIndex.complete = complete;

      return blogIndex;
    });
}

export async function fetchBlogArticleIndex(config, limit) {
  return loadIndexPage(config, limit, { win: globalThis, doc: globalThis.document });
}

const FIELDS = Object.freeze({
  level1: 'Level 1',
  level2: 'Level 2',
  level3: 'Level 3',
  hidden: 'Hidden',
  link: 'Link',
  type: 'Type',
  excludeFromMetadata: 'ExcludeFromMetadata',
});
const PRODUCTS = 'products';
const INDUSTRIES = 'industries';
const CATEGORIES = 'categories';
const INTERNALS = 'internals';

export const generateUri = (name) => name
  .toLowerCase()
  .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .replace(/\s/gm, '-')
  .replace(/&amp;/gm, '')
  .replace(/&/gm, '')
  .replace(/\./gm, '')
  .replace(/--+/g, '-');

const removeLineBreaks = (topic) => (topic?.replace(/\n/gm, ' ').trim());
const isProduct = (cat) => !!cat && cat.toLowerCase() === PRODUCTS;

function linkPath(link, route) {
  try {
    return new URL(link).pathname.replace('.html', '').split(`${route}/`).pop();
  } catch (e) {
    return null;
  }
}

function parseTaxonomyJson(data, root, route) {
  let level1;
  let level2;
  const taxonomy = {
    topics: {},
    products: {},
    categories: {},
    topicChildren: {},
    productChildren: {},
  };
  (Array.isArray(data) ? data : []).forEach((row) => {
    const level3 = removeLineBreaks(row[FIELDS.level3]);
    if (!level3) {
      level2 = removeLineBreaks(row[FIELDS.level2]);
      if (!level2) level1 = removeLineBreaks(row[FIELDS.level1]);
    }
    // eslint-disable-next-line no-nested-ternary
    const level = level3 ? 3 : (level2 ? 2 : 1);
    const name = (level3 || level2 || level1)?.toLowerCase();
    if (!name) return;
    const category = row[FIELDS.type]?.trim().toLowerCase() || INTERNALS;
    if (!isProduct(category) && taxonomy.topics[name]) return;
    if (isProduct(category) && taxonomy.products[name]) return;

    const path = (row[FIELDS.link] && linkPath(row[FIELDS.link], route)) || generateUri(name);
    const item = {
      name,
      level,
      link: `${root}/${path}`,
      category,
      hidden: !!row[FIELDS.hidden]?.trim(),
      skipMeta: !!row[FIELDS.excludeFromMetadata]?.trim(),
    };
    if (isProduct(category)) taxonomy.products[name] = item;
    else taxonomy.topics[name] = item;

    if (!taxonomy.categories[item.category]) taxonomy.categories[item.category] = [];
    const inCategory = taxonomy.categories[item.category];
    if (inCategory.indexOf(name) === -1) inCategory.push(item.name);

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
  });
  return taxonomy;
}

const findItem = (topic, category, taxonomy) => {
  if (!category && taxonomy.products[topic]) return taxonomy.products[topic];
  if (!category) return taxonomy.topics[topic];
  if (isProduct(category)) return taxonomy.products[topic];
  return taxonomy.topics[topic];
};

export function inferTaxonomyRoute(data, contentRoot) {
  let base = '';
  try {
    base = new URL(contentRoot).pathname.replace(/\/+$/, '');
  } catch (e) {
    return TAXONOMY_ROUTE_DEFAULT;
  }
  const counts = new Map();
  (Array.isArray(data) ? data : []).forEach((row) => {
    let path;
    try {
      path = new URL(row?.[FIELDS.link]).pathname;
    } catch (e) {
      return;
    }
    if (!path.startsWith(`${base}/`)) return;
    const rest = path.slice(base.length + 1).split('/');
    if (rest.length < 2 || !rest[0]) return;
    counts.set(rest[0], (counts.get(rest[0]) || 0) + 1);
  });
  const [top] = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  return top ? `/${top[0]}` : TAXONOMY_ROUTE_DEFAULT;
}

export function parseTaxonomy(data, contentRoot, route = inferTaxonomyRoute(data, contentRoot)) {
  const formatted = String(route).replace(/^\/+/g, '').replace(/\/+$/, '');
  const root = formatted ? `${contentRoot}/${formatted}` : contentRoot;
  const taxonomy = parseTaxonomyJson(data, root, route);
  return {
    CATEGORIES,
    INDUSTRIES,
    INTERNALS,
    PRODUCTS,
    route,
    lookup(topic) {
      return this.get(topic, PRODUCTS) || this.get(topic.replace('Adobe ', ''), PRODUCTS) || this.get(topic);
    },
    get(topic, cat) {
      const item = findItem(topic?.toLowerCase(), cat?.toLowerCase(), taxonomy);
      if (!item) return null;
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
      return !!t && !t.hidden;
    },
    skipMeta(topic, cat) {
      const t = findItem(topic, cat, taxonomy);
      return !!t && t.skipMeta;
    },
    getLink(topic, cat) {
      const t = findItem(topic, cat, taxonomy);
      return t?.link?.replace('.html', '');
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
}

export async function loadTaxonomy(contentRoot, win) {
  if (!contentRoot) return null;
  try {
    const json = await fetchJson(`${contentRoot}/taxonomy.json`, win);
    return parseTaxonomy(json?.data, contentRoot);
  } catch (e) {
    return null;
  }
}

export function articleTaxonomy(article, taxonomy) {
  if (article.allTopics) {
    const { category, topics, visibleTopics, allTopics } = article;
    return { category, topics, visibleTopics, allTopics };
  }
  const { tags } = article;
  if (!tags) return { category: 'News', topics: [], visibleTopics: [], allTopics: [] };
  const topics = (Array.isArray(tags) ? tags : String(tags).replace(/[["\]]/gm, '').split(','))
    .map((t) => String(t).trim())
    .filter((t) => t && t !== '');
  const computed = topics.length > 0 ? topics[0] : 'news';
  const category = article.category ?? computed;
  if (!taxonomy) return { category, topics, visibleTopics: undefined, allTopics: undefined };
  const allTopics = [];
  const visibleTopics = [];
  topics.forEach((tag) => {
    const tax = taxonomy.get(tag);
    if (!tax || allTopics.includes(tag) || tax.skipMeta) return;
    allTopics.push(tag);
    if (tax.isUFT) visibleTopics.push(tag);
    const parents = taxonomy.getParents(tag);
    parents.forEach((parent) => {
      const ptax = taxonomy.get(parent);
      if (allTopics.includes(parent)) return;
      allTopics.push(parent);
      if (ptax?.isUFT) visibleTopics.push(parent);
    });
  });
  return { category, topics, visibleTopics, allTopics };
}

export function calculateExcelDate(date) {
  return new Date(Math.round((date - (1 + 25567 + 1)) * 86400 * 1000));
}

function toDate(date) {
  if (date === null || date === undefined || date === '') return null;
  const s = String(date).trim();
  let d;
  if (!s.includes('-')) {
    const n = Number(s);
    if (!Number.isFinite(n) || n <= 0) return null;
    d = calculateExcelDate(n);
  } else {
    const m = s.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
    d = m ? new Date(Date.UTC(Number(m[3]), Number(m[1]) - 1, Number(m[2]))) : new Date(s.replace(/-/g, '/'));
  }
  return Number.isNaN(d.getTime()) ? null : d;
}

export function isoDate(date) {
  const d = toDate(date);
  return d ? d.toISOString().slice(0, 10) : null;
}

export function formatCardLocaleDate(date, ietf = 'en-US') {
  const d = toDate(date);
  if (!d) return '';
  const opts = { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' };
  let dateString;
  try {
    dateString = d.toLocaleDateString(ietf || 'en-US', opts);
  } catch (e) {
    dateString = d.toLocaleDateString('en-US', opts);
  }
  if ((ietf || 'en-US') === 'en-US') dateString = dateString.replace(/\//g, '-');
  return dateString;
}

export function byDateDesc(a, b) {
  const t = (x) => {
    const d = toDate(x.date);
    return d ? d.getTime() : 0;
  };
  return t(b) - t(a);
}

const keyToStr = (key) => key.replaceAll('-', ' ');

export async function loadPlaceholders(doc, win) {
  const values = { ...PLACEHOLDER_DEFAULTS };
  const root = doc ? siteRoot(doc, doc.baseURI) : null;
  if (!root) return values;
  try {
    const json = await fetchJson(`${root}/placeholders.json`, win);
    const rows = json?.data ?? json?.default?.data ?? [];
    rows.forEach((row) => {
      const key = row?.key ?? row?.Key;
      const value = row?.value ?? row?.Value;
      if (typeof key === 'string' && typeof value === 'string' && value.trim()) values[key] = value.trim();
    });
  } catch (e) { /* storage unavailable */ }
  return values;
}

export function placeholder(values, key) {
  return values?.[key] ?? PLACEHOLDER_DEFAULTS[key] ?? keyToStr(key);
}
