import { rowsOf, cellsOf } from '../_shared/dom.js';
import { CARD, buildCard, buildList, indexPicture, cleanText } from './articles-card.js';
import {
  blogIndex,
  loadIndexPage,
  loadTaxonomy,
  articleTaxonomy,
  siteRoot,
  withLangRoot,
  formatCardLocaleDate,
  isoDate, byDateDesc, loadPlaceholders, placeholder,
} from './articles-index.js';

const BLOCK = 'recommended-articles';
const PAGE_SIZE = 12;
const ROOT_MARGIN = '50px';
const FILTER_NAMES = ['tags', 'topics', 'selectedProducts', 'selectedIndustries', 'author', 'category', 'exclude'];
const KEYWORDS = ['exclude', 'tags', 'topics'];
const SELECTED = ['selectedProducts', 'selectedIndustries'];
const FILTER_TYPES = ['products', 'industries'];
const TITLE_SUBS = Object.freeze({ 'Transformation digitale': 'Transformation numérique' });

export const FEED = Object.freeze({
  status: `${BLOCK}-status`,
  empty: `${BLOCK}-empty`,
  emptyHelp: `${BLOCK}-empty-help`,
  more: `${BLOCK}-load-more`,
  actions: `${BLOCK}-actions`,
  filters: `${BLOCK}-filters`,
  filtersLabel: `${BLOCK}-filters-label`,
  filter: `${BLOCK}-filter`,
  filterButton: `${BLOCK}-filter-button`,
  panel: `${BLOCK}-filter-panel`,
  search: `${BLOCK}-filter-search`,
  options: `${BLOCK}-filter-options`,
  option: `${BLOCK}-filter-option`,
  nested: `${BLOCK}-filter-option-nested`,
  panelActions: `${BLOCK}-filter-actions`,
  selected: `${BLOCK}-selected`,
  selectedLabel: `${BLOCK}-selected-label`,
  chips: `${BLOCK}-chips`,
  chip: `${BLOCK}-chip`,
  button: 's2-button',
  outline: 's2-button-outline',
  accent: 's2-button-accent',
});

let uid = 0;
const runs = new WeakMap();

export function whenFeedSettled(el) {
  return runs.get(el) || Promise.resolve();
}

function toClassName(name) {
  return name && typeof name === 'string' ? name.toLowerCase().replace(/[^0-9a-z]/gi, '-') : '';
}

function resolveUrl(href, base) {
  try {
    return new URL(href, base).href;
  } catch (e) {
    return href;
  }
}

export function readBlockConfig(el) {
  const base = el.ownerDocument.baseURI;
  return rowsOf(el).reduce((config, row) => {
    const cols = cellsOf(row);
    if (!cols[1]) return config;
    const valueEl = cols[1];
    const name = toClassName(cols[0].textContent);
    const links = [...valueEl.querySelectorAll('a')];
    if (links.length) {
      const hrefs = links.map((a) => resolveUrl(a.getAttribute('href') || '', base));
      config[name] = hrefs.length === 1 ? hrefs[0] : hrefs;
    } else if (valueEl.querySelector('p')) {
      const ps = [...valueEl.querySelectorAll('p')].map((p) => p.textContent);
      config[name] = ps.length === 1 ? ps[0] : ps;
    } else {
      config[name] = valueEl.textContent;
    }
    return config;
  }, {});
}

const listOf = (value) => (Array.isArray(value) ? value.join(',') : String(value ?? ''))
  .split(',').map((e) => e.toLowerCase().trim()).filter(Boolean);

export function filtersOf(config, selected = {}) {
  const filters = {};
  FILTER_NAMES.forEach((key) => {
    if (SELECTED.includes(key)) return;
    if (config[key] === undefined || config[key] === null) return;
    const values = listOf(config[key]);
    if (values.length) filters[key] = values;
  });
  const clean = (list) => list.map((v) => v.toLowerCase().trim());
  if (selected.products?.length) filters.selectedProducts = clean(selected.products);
  if (selected.industries?.length) filters.selectedIndustries = clean(selected.industries);
  return filters;
}

const isInList = (list, val) => !!list && list.map((t) => String(t ?? '').toLowerCase()).includes(val);

export function matches(article, filters, taxonomy) {
  const tax = articleTaxonomy(article, taxonomy);
  return Object.keys(filters).every((key) => {
    if (KEYWORDS.includes(key)) {
      const matched = filters[key].some((val) => isInList(tax.allTopics, val));
      return key === 'exclude' ? !matched : matched;
    }
    if (SELECTED.includes(key)) {
      if (filters.selectedProducts && filters.selectedIndustries) {
        return filters.selectedProducts.some((val) => isInList(tax.allTopics, val))
          && filters.selectedIndustries.some((val) => isInList(tax.allTopics, val));
      }
      return filters[key].some((val) => isInList(tax.allTopics, val));
    }
    return filters[key].some((val) => isInList([article[key]], val));
  });
}

function cardsOnPage(doc) {
  const paths = new Set();
  doc.querySelectorAll('.featured-article a.featured-article-card[href], .recommended-articles a.article-card[href]')
    .forEach((a) => paths.add(a.getAttribute('href')));
  doc.querySelectorAll(`[data-spectrum2-member="${BLOCK}"] a.${CARD.link}[href]`).forEach((a) => {
    try {
      paths.add(new URL(a.getAttribute('href'), doc.baseURI).pathname);
    } catch (e) { /* not a URL */ }
  });
  return paths;
}

function hrefFor(path, indexUrl, pageOrigin) {
  try {
    const u = new URL(path, indexUrl);
    return u.origin === pageOrigin ? `${u.pathname}${u.search}` : u.href;
  } catch (e) {
    return path;
  }
}

function feedCard(article, env) {
  const path = String(article.path || '').split('.')[0];
  const tax = articleTaxonomy(article, env.taxonomy);
  const topic = typeof tax.category === 'string' ? tax.category.trim() : '';
  const known = topic && env.taxonomy ? env.taxonomy.get(topic)?.link : null;
  const text = TITLE_SUBS[topic] ?? topic;
  const title = cleanText(article.h1 || article.title || path);
  return {
    href: hrefFor(path, env.indexUrl, env.pageOrigin),
    title,
    category: text ? { text, href: known ? withLangRoot(known, env.doc) : null } : null,
    description: article.description && article.description !== '0' ? String(article.description) : '',
    date: { text: formatCardLocaleDate(article.date, env.ietf), iso: isoDate(article.date) },
    picture: article.image ? indexPicture(env.make, article.image, env.indexUrl) : null,
    well: !article.image,
  };
}

function ietfOf(doc) {
  const lang = (doc.documentElement.getAttribute('lang') || '').trim();
  if (!lang || lang.toLowerCase() === 'en') return 'en-US';
  return lang;
}

function whenNear(el, win) {
  if (!win || typeof win.IntersectionObserver !== 'function') return Promise.resolve();
  return new Promise((resolve) => {
    const io = new win.IntersectionObserver((entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      io.disconnect();
      resolve();
    }, { rootMargin: ROOT_MARGIN });
    io.observe(el);
  });
}

function filterPanel(type, taxonomy, env, feed) {
  const { make, texts, id } = env;
  const title = taxonomy.getCategoryTitle(type);
  const buttonId = `${id}-${type}-button`;
  const panelId = `${id}-${type}-panel`;
  const button = make('button', { type: 'button', class: FEED.filterButton, id: buttonId, 'aria-expanded': 'false', 'aria-controls': panelId }, title);
  const search = make('input', {
    type: 'search',
    class: FEED.search,
    'aria-label': `${placeholder(texts, 'search')} ${title}`,
    placeholder: placeholder(texts, 'search'),
  });
  const options = make('ul', { class: FEED.options, 'aria-label': `${title} ${placeholder(texts, 'filters')}` });
  let n = 0;
  const option = (itemName, nested) => {
    const name = String(itemName).replace(/\*/gm, '');
    n += 1;
    const boxId = `${id}-${type}-${n}`;
    const box = make('input', { type: 'checkbox', id: boxId, name, 'data-filter-type': type });
    const label = make('label', { for: boxId }, name);
    return make('li', { class: nested ? `${FEED.option} ${FEED.nested}` : FEED.option }, [box, label]);
  };
  taxonomy.getCategory(taxonomy[type.toUpperCase()]).forEach((topic) => {
    const item = taxonomy.get(topic, taxonomy[type.toUpperCase()]);
    if (!item || item.level !== 1) return;
    options.append(option(item.name, false));
    item.children.forEach((child) => options.append(option(child, true)));
  });
  const reset = make('button', { type: 'button', class: `${FEED.button} ${FEED.outline}` }, placeholder(texts, 'reset'));
  const apply = make('button', { type: 'button', class: `${FEED.button} ${FEED.accent}` }, placeholder(texts, 'apply'));
  const panel = make('div', { class: FEED.panel, id: panelId, role: 'group', 'aria-labelledby': buttonId, hidden: true }, [search, options, make('div', { class: FEED.panelActions }, [reset, apply])]);
  const wrap = make('div', { class: FEED.filter }, [button, panel]);

  search.addEventListener('input', () => {
    const value = search.value.toLowerCase();
    options.querySelectorAll(`.${FEED.option}`).forEach((li) => {
      li.hidden = !!value.length && !li.textContent.toLowerCase().includes(value);
    });
  });
  button.addEventListener('click', () => feed.toggle(wrap));
  wrap.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape' || button.getAttribute('aria-expanded') !== 'true') return;
    e.preventDefault();
    feed.close(wrap, true);
  });
  reset.addEventListener('click', () => {
    options.querySelectorAll('input[type=checkbox]').forEach((box) => { box.checked = false; });
    feed.announce(`${placeholder(texts, 'reset')} ${title}`);
    feed.apply({ focus: reset });
  });
  apply.addEventListener('click', () => {
    feed.close(wrap, true);
    feed.apply({ focus: button });
  });
  return wrap;
}

function clearSearch(wrap) {
  const search = wrap.querySelector(`.${FEED.search}`);
  if (!search) return;
  search.value = '';
  wrap.querySelectorAll(`.${FEED.option}`).forEach((li) => { li.hidden = false; });
}

export function decorateFeed(el, ctx) {
  const { make } = ctx;
  const doc = el.ownerDocument;
  const win = doc.defaultView;
  el.classList.add(BLOCK);
  const config = readBlockConfig(el);
  el.replaceChildren();
  uid += 1;
  const pageUrl = doc.baseURI;
  let pageOrigin = null;
  try {
    pageOrigin = new URL(pageUrl).origin;
  } catch (e) {
    pageOrigin = null;
  }
  const root = siteRoot(doc, pageUrl);
  const feedUrl = typeof config.feed === 'string' && config.feed ? config.feed : null;
  const env = {
    make,
    doc,
    win,
    id: `${BLOCK}-${uid}`,
    pageOrigin,
    indexUrl: feedUrl || withLangRoot(`${root || ''}/query-index.json`, doc),
    ietf: ietfOf(doc),
    taxonomy: null,
    texts: null,
  };

  const list = buildList(make);
  const status = make('div', { class: FEED.status, role: 'status', 'aria-live': 'polite' });
  const more = make('button', { type: 'button', class: `${FEED.more} ${FEED.button} ${FEED.outline}`, hidden: true });
  const actions = make('div', { class: FEED.actions }, more);
  el.append(list, status, actions);
  el.dataset.feedStatus = 'loading';
  status.append(make('p', null, placeholder(null, 'loading')));

  const state = {
    all: [],
    articles: [],
    shown: 0,
    onPage: new Set(),
    filterWraps: [],
    chips: null,
    selectedBox: null,
  };

  const setStatus = (nodes) => {
    status.replaceChildren(...(Array.isArray(nodes) ? nodes : [nodes]).filter(Boolean));
  };

  const renderMore = () => {
    const next = state.articles.slice(state.shown, state.shown + PAGE_SIZE);
    const cards = next.map((a) => buildCard(make, feedCard(a, env)));
    list.append(...cards);
    state.shown += next.length;
    more.hidden = state.shown >= state.articles.length;
    return cards;
  };

  const selections = () => {
    const picked = { products: [], industries: [] };
    el.querySelectorAll(`.${FEED.panel} input[type=checkbox]:checked`).forEach((box) => {
      const type = box.getAttribute('data-filter-type');
      if (picked[type]) picked[type].push(box.getAttribute('name'));
    });
    return picked;
  };

  const renderEmpty = (userFiltered) => {
    if (userFiltered) {
      setStatus(make('div', { class: FEED.empty }, [
        make('p', null, make('strong', null, placeholder(env.texts, 'no-matches'))),
        make('p', { class: FEED.emptyHelp }, placeholder(env.texts, 'user-help')),
      ]));
    } else {
      setStatus(make('p', { class: FEED.empty }, make('strong', null, placeholder(env.texts, 'no-results'))));
    }
  };

  const render = () => {
    const picked = selections();
    const filters = filtersOf(config, picked);
    state.articles = state.all.filter((a) => matches(a, filters, env.taxonomy) && !state.onPage.has(String(a.path || '').split('.')[0]));
    state.shown = 0;
    list.replaceChildren();
    setStatus(null);
    if (!state.articles.length) renderEmpty(!!(picked.products.length || picked.industries.length));
    renderMore();
    return picked;
  };

  const feed = {
    announce: (message) => setStatus(make('p', null, message)),
    close(wrap, focus) {
      const button = wrap.querySelector(`.${FEED.filterButton}`);
      const panel = wrap.querySelector(`.${FEED.panel}`);
      button.setAttribute('aria-expanded', 'false');
      panel.hidden = true;
      clearSearch(wrap);
      if (focus) button.focus();
    },
    toggle(wrap) {
      const button = wrap.querySelector(`.${FEED.filterButton}`);
      const open = button.getAttribute('aria-expanded') === 'true';
      state.filterWraps.forEach((w) => { if (w !== wrap) feed.close(w, false); });
      if (open) {
        feed.close(wrap, false);
        return;
      }
      button.setAttribute('aria-expanded', 'true');
      wrap.querySelector(`.${FEED.panel}`).hidden = false;
    },
    apply({ focus } = {}) {
      const picked = render();
      feed.renderChips(picked);
      if (focus && focus.isConnected && !focus.closest('[hidden]')) focus.focus();
    },
    renderChips(picked) {
      if (!state.chips) return;
      const names = [...picked.products, ...picked.industries];
      state.chips.replaceChildren(...names.map((name) => {
        const chip = make('button', { type: 'button', class: FEED.chip, 'aria-label': `Remove ${name} filter` }, name);
        chip.addEventListener('click', () => {
          el.querySelectorAll(`.${FEED.panel} input[type=checkbox]`).forEach((box) => {
            if (box.getAttribute('name') === name) box.checked = false;
          });
          const chipsNow = [...state.chips.querySelectorAll(`.${FEED.chip}`)];
          const at = chipsNow.indexOf(chip);
          const nextChip = chipsNow[at + 1] || chipsNow[at - 1] || null;
          const nextName = nextChip ? nextChip.textContent : null;
          feed.apply();
          feed.announce(`Removed ${name} filter`);
          const target = nextName && [...state.chips.querySelectorAll(`.${FEED.chip}`)].find((c) => c.textContent === nextName);
          (target || state.filterWraps[0]?.querySelector(`.${FEED.filterButton}`))?.focus();
        });
        return make('li', null, chip);
      }));
      state.selectedBox.hidden = names.length === 0;
    },
  };

  const buildFilters = () => {
    const labelId = `${env.id}-filters-label`;
    const wraps = FILTER_TYPES.map((type) => filterPanel(type, env.taxonomy, env, feed));
    state.filterWraps = wraps;
    const bar = make('div', { class: FEED.filters, role: 'group', 'aria-labelledby': labelId }, [
      make('p', { class: FEED.filtersLabel, id: labelId }, placeholder(env.texts, 'filters')),
      ...wraps,
    ]);
    state.chips = make('ul', { class: FEED.chips });
    const clear = make('button', { type: 'button', class: `${FEED.button} ${FEED.outline}` }, placeholder(env.texts, 'clear-all'));
    clear.addEventListener('click', () => {
      const had = !!el.querySelector(`.${FEED.panel} input[type=checkbox]:checked`);
      el.querySelectorAll(`.${FEED.panel} input[type=checkbox]`).forEach((box) => { box.checked = false; });
      feed.apply();
      if (had) feed.announce('All filters cleared');
      wraps[0]?.querySelector(`.${FEED.filterButton}`)?.focus();
    });
    state.selectedBox = make('div', { class: FEED.selected, hidden: true }, [
      make('p', { class: FEED.selectedLabel }, placeholder(env.texts, 'showing-articles-for')),
      state.chips,
      clear,
    ]);
    el.prepend(bar, state.selectedBox);
    doc.addEventListener('click', (e) => {
      wraps.forEach((w) => {
        if (w.querySelector(`.${FEED.filterButton}`).getAttribute('aria-expanded') === 'true' && !w.contains(e.target)) {
          feed.close(w, false);
        }
      });
    });
  };

  more.addEventListener('click', () => {
    const cards = renderMore();
    cards[0]?.querySelector(`.${CARD.link}`)?.focus();
  });

  const start = async () => {
    env.texts = await loadPlaceholders(doc, win);
    more.textContent = placeholder(env.texts, 'load-more');
    setStatus(make('p', null, placeholder(env.texts, 'loading')));
    try {
      env.taxonomy = await loadTaxonomy(root, win);
      if (config.filters && env.taxonomy) buildFilters();
      while (!blogIndex.complete) {
        const before = blogIndex.data.length;
        // eslint-disable-next-line no-await-in-loop
        await loadIndexPage({ feed: feedUrl || env.indexUrl }, undefined, { win, doc });
        if (blogIndex.data.length === before) break;
      }
      blogIndex.data.sort(byDateDesc);
      state.all = blogIndex.data;
      state.onPage = cardsOnPage(doc);
      render();
      el.dataset.feedStatus = state.articles.length ? 'ready' : 'empty';
    } catch (e) {
      list.replaceChildren();
      more.hidden = true;
      setStatus(make('p', { class: FEED.empty }, placeholder(env.texts, 'articles-unavailable')));
      el.dataset.feedStatus = 'error';
    }
  };

  const run = whenNear(el, win).then(start);
  runs.set(el, run);
}
