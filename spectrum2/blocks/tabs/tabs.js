import { dispatch } from '../_shared/members.js';
import { pageShims } from '../_shared/s1-page.js';
import { trackingLabel } from '../_shared/analytics.js';
import { isAuthoredColour } from '../_shared/background.js';

const SVG_NS = 'http://www.w3.org/2000/svg';
const PADDLE_PATH = 'M1.5 13.25a1.09 1.09 0 0 1-.77-.32 1.1 1.1 0 0 1 0-1.55L5.11 7 .73 2.62a1.1 1.1 0 0 1 1.54-1.55l5.16 5.16a1.09 1.09 0 0 1 0 1.54l-5.16 5.16a1.08 1.08 0 0 1-.77.32Z';
const PANEL_KEYS = ['tab', 'tab-background', 'link', 'deeplink'];
const BADGE_TONES = { green: 'positive', yellow: 'yellow' };
const RELATIVE_LINK = /^\/(?:[a-zA-Z0-9-_]+(?:\/[a-zA-Z0-9-_]+)*)?$/;
const TAB_CHANGED = 'milo:tab:changed';
const DEFERRED = 'milo:deferred';

export function keyName(str) {
  return String(str ?? '').trim().toLowerCase().replace(/\s+/g, '-')
    .replace(/[^\p{L}\p{N}_-]/gu, '');
}

const quoteAttr = (value) => String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
export function byId(root, id) {
  return root.querySelector(`[id="${quoteAttr(id)}"]`);
}

function reducedMotion(win) {
  return !!win?.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}

function storage(win) {
  try {
    return win?.sessionStorage ?? null;
  } catch (e) {
    return null;
  }
}

export function readConfig(rows) {
  const config = {};
  rows.slice(1).forEach((row) => {
    const [keyCell, valueCell] = row.children;
    const key = keyName(keyCell?.textContent);
    const value = (valueCell?.textContent ?? '').trim();
    if (key === 'badge') {
      if (!config.badge) config.badge = [];
      config.badge.push(value);
    } else if (key) {
      config[key] = value;
    }
    row.remove();
  });
  return config;
}

export function readBadges(entries = []) {
  return entries.map((entry) => {
    const parts = entry.split(',').map((s) => s.trim());
    return { index: parseInt(parts[0], 10), label: parts[1] ?? '', tone: BADGE_TONES[parts[2]?.toLowerCase()] ?? 'positive' };
  });
}

export function pillSize(el) {
  const pill = [...el.classList].find((c) => c.includes('pill'));
  if (!pill) return null;
  const variant = pill.substring(0, pill.indexOf('-pill'));
  return ['s', 'm', 'l'].find((size) => variant.startsWith(size)) ?? 'm';
}

export function redirectionUrl(linked, targetId, location) {
  if (!location || !targetId || !linked[targetId] || location.pathname === linked[targetId]) return '';
  const url = new URL(location.href);
  const tabParam = url.searchParams.get('tab');
  if (tabParam) url.searchParams.set('tab', `${tabParam.split('-')[0]}-${targetId.split('-')[2]}`);
  url.pathname = linked[targetId];
  return url;
}

function linkedPath(link) {
  try {
    return new URL(link).pathname;
  } catch (e) {
    return RELATIVE_LINK.test(link) ? link : null;
  }
}

function paddle(make, doc, side, label) {
  const svg = doc.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', '0 0 8 14');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  const path = doc.createElementNS(SVG_NS, 'path');
  path.setAttribute('d', PADDLE_PATH);
  path.setAttribute('fill', 'currentColor');
  svg.append(path);
  return make('button', {
    type: 'button',
    class: `tabs-paddle tabs-paddle-${side}`,
    disabled: true,
    'aria-hidden': 'true',
    tabindex: '-1',
    'aria-label': label,
  }, svg);
}

function isRtl(el) {
  const dir = el.closest('[dir]')?.getAttribute('dir') || el.ownerDocument.dir;
  return String(dir).toLowerCase() === 'rtl';
}

function scrollTabIntoList(tab, align = 'center') {
  const list = tab.closest('[role="tablist"], [role="radiogroup"]');
  if (!list || typeof list.scrollBy !== 'function') return;
  const t = tab.getBoundingClientRect();
  const l = list.getBoundingClientRect();
  const inside = Math.round(t.left) >= Math.round(l.left)
    && Math.round(t.right) <= Math.round(l.right);
  if (inside) return;
  let delta = t.left - l.left - (l.width - t.width) / 2;
  if (align === 'start') delta = t.left - l.left;
  if (align === 'end') delta = t.right - l.right;
  list.scrollBy({ left: delta, behavior: reducedMotion(tab.ownerDocument.defaultView) ? 'auto' : 'smooth' });
}

function inListView(tab) {
  const list = tab.closest('[role="tablist"], [role="radiogroup"]');
  const t = tab.getBoundingClientRect();
  const l = list.getBoundingClientRect();
  return Math.round(t.left) >= Math.round(l.left) && Math.round(t.right) <= Math.round(l.right);
}

function initPaddles(list, prev, next, tabs) {
  const first = tabs[0];
  const last = tabs[tabs.length - 1];
  const win = list.ownerDocument.defaultView;
  const page = (dir) => {
    const found = dir < 0
      ? tabs.find((t, i) => tabs[i + 1] && !inListView(t) && inListView(tabs[i + 1]))
      : tabs.find((t, i) => tabs[i - 1] && inListView(tabs[i - 1]) && !inListView(t));
    if (found) {
      scrollTabIntoList(found, dir < 0 ? 'end' : 'start');
      return;
    }
    const { width } = list.getBoundingClientRect();
    list.scrollBy?.({ left: (dir * width) / 2, behavior: reducedMotion(win) ? 'auto' : 'smooth' });
  };
  prev.addEventListener('click', () => page(-1));
  next.addEventListener('click', () => page(1));
  if (!first || typeof win?.IntersectionObserver !== 'function') return;
  const observer = new win.IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.target === first) prev.toggleAttribute('disabled', entry.isIntersecting);
      if (entry.target === last) next.toggleAttribute('disabled', entry.isIntersecting);
    });
  }, { root: list, rootMargin: '0px', threshold: 0.9 });
  observer.observe(first);
  if (last !== first) observer.observe(last);
}

function initOverflowCue(list, tabs) {
  const first = tabs[0];
  const last = tabs[tabs.length - 1];
  const win = list.ownerDocument.defaultView;
  if (!first || typeof win?.IntersectionObserver !== 'function') return;
  const observer = new win.IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.target === first) list.classList.toggle('tabs-list-more-start', !entry.isIntersecting);
      if (entry.target === last) list.classList.toggle('tabs-list-more-end', !entry.isIntersecting);
    });
  }, { root: list, rootMargin: '0px', threshold: 0.9 });
  observer.observe(first);
  if (last !== first) observer.observe(last);
}

function scrollStackedMobile(content) {
  const win = content?.ownerDocument.defaultView;
  if (!content || !win?.matchMedia?.('(width < 768px)').matches) return;
  const doc = content.ownerDocument;
  const stickyTop = doc.querySelector('.feds-localnav') ?? doc.querySelector('.global-navigation, .gnav');
  const sticky = stickyTop?.scrollHeight || 0;
  const top = content.getBoundingClientRect().top + win.scrollY - sticky - 1;
  win.scrollTo?.({ top, behavior: reducedMotion(win) ? 'auto' : 'smooth' });
}

function positionIndicator(el) {
  const container = el.querySelector('.tabs-list-container');
  const indicator = container?.querySelector(':scope > .tabs-indicator');
  const selected = container?.querySelector('[aria-selected="true"], [aria-checked="true"]');
  if (!indicator || !selected) return;
  const box = container.clientWidth || 0;
  container.style.setProperty('--_indicator-x', `${selected.offsetLeft || 0}px`);
  container.style.setProperty('--_indicator-scale', box ? String((selected.offsetWidth || 0) / box) : '0');
}

function decorateTabs(el, ctx) {
  const { make } = ctx;
  const doc = el.ownerDocument;
  const win = doc.defaultView;
  el.classList.add('tabs');
  pageShims(el, make);

  const rootElem = el.closest('.fragment') || doc;
  const rows = [...el.querySelectorAll(':scope > div')];
  if (!rows.length) return;
  const parentSection = el.closest('.section');

  const config = readConfig(rows);
  const tabId = config.id || [...rootElem.querySelectorAll('.tabs')].indexOf(el) + 1;
  config['tab-id'] = tabId;
  const badges = readBadges(config.badge);
  const store = storage(win);
  const storageName = `${win?.location?.pathname ?? ''}/${tabId}-tab-state`;
  if (config.remember === 'on') {
    let saved = null;
    try { saved = store?.getItem(storageName) ?? null; } catch (e) { saved = null; }
    if (saved) config['active-tab'] = saved;
  }

  const blockId = `tabs-${tabId}`;
  el.id = blockId;
  parentSection?.classList.add(`tablist-${tabId}-section`);

  const isRadio = el.classList.contains('radio');
  const isSegmented = el.classList.contains('segmented-control');
  const pill = pillSize(el);
  const selectedAttr = isRadio ? 'aria-checked' : 'aria-selected';

  const contentContainer = make('div', { class: 'tabs-content-container tab-content-container' });
  const content = make('div', { class: 'tabs-content' }, contentContainer);
  el.append(content);

  const list = rows[0];
  list.classList.add('tabs-list');
  list.setAttribute('role', isRadio ? 'radiogroup' : 'tablist');
  let container = list.querySelector(':scope > div');
  if (!container) {
    container = make('div');
    list.append(container);
  }
  container.classList.add('tabs-list-container');
  if (config.pretext) list.setAttribute('aria-label', config.pretext);

  const items = [...list.querySelectorAll(':scope li')];
  const tabClass = ['tabs-tab'];
  if (pill) tabClass.push(`tabs-tab-pill-${pill}`);
  else if (isSegmented) tabClass.push('tabs-tab-segment');
  const tabs = items.map((item, i) => {
    const tabName = config.id ? i + 1 : keyName(item.textContent);
    const controlId = `tab-panel-${tabId}-${tabName}`;
    const tab = make('button', {
      type: 'button',
      role: isRadio ? 'radio' : 'tab',
      class: tabClass.join(' '),
      id: `tab-${tabId}-${tabName}`,
      tabindex: i === 0 ? '0' : '-1',
      [selectedAttr]: i === 0 ? 'true' : 'false',
      'data-block-id': blockId,
      'daa-state': 'true',
      'daa-ll': `tab-${tabId}-${tabName}`,
      ...(isRadio ? { 'data-control-id': controlId } : { 'aria-controls': controlId }),
    }, make('span', { class: 'tabs-tab-label' }, item.textContent));
    if (badges.length) {
      const badge = badges.find((b) => b.index === i + 1);
      tab.append(badge
        ? make('span', { class: `tabs-badge tabs-badge-${badge.tone}` }, badge.label)
        : make('span', { class: 'tabs-badge-placeholder', 'aria-hidden': 'true' }));
    }
    container.append(tab);
    const panel = make('div', {
      id: controlId,
      role: isRadio ? null : 'tabpanel',
      class: 'tabs-panel tabpanel',
      'aria-labelledby': tab.id,
      'data-block-id': blockId,
      hidden: i > 0,
    });
    contentContainer.append(panel);
    return tab;
  });
  items[0]?.parentElement?.remove();
  if (typeof config.pretext === 'string') {
    container.dataset.pretext = config.pretext;
    if (isRadio && config.pretext) container.prepend(make('span', { class: 'tabs-pretext', 'aria-hidden': 'true' }, config.pretext));
  }
  const underline = !isRadio && !isSegmented && !pill;
  if (underline) container.append(make('span', { class: 'tabs-indicator', 'aria-hidden': 'true' }));

  const wrapper = make('div', { class: 'tabs-list-wrapper' });
  list.before(wrapper);
  wrapper.append(list);
  if (!isSegmented) {
    const prev = paddle(make, doc, 'prev', 'Scroll tabs to left');
    const next = paddle(make, doc, 'next', 'Scroll tabs to right');
    list.before(prev);
    list.after(next);
    initPaddles(list, prev, next, tabs);
  } else {
    initOverflowCue(list, tabs);
  }

  const tabColor = {};
  const linkedTabs = {};
  [...rootElem.querySelectorAll('div.section')].forEach((section) => {
    const sectionMetadata = section.querySelector(':scope > .section-metadata');
    if (!sectionMetadata) return;
    const meta = {};
    sectionMetadata.querySelectorAll(':scope > div').forEach((row) => {
      const key = keyName(row.children[0]?.textContent);
      if (!PANEL_KEYS.includes(key)) return;
      const value = row.children[1]?.textContent;
      if (!value) return;
      meta[key] = value;
    });
    if (!meta.tab) return;
    let id = tabId;
    let val = keyName(meta.tab);
    if (meta.deeplink !== undefined) byId(rootElem, `tab-${val}`)?.setAttribute('data-deeplink', meta.deeplink);
    if (config.id) {
      const values = meta.tab.split(',');
      [id] = values;
      val = keyName(String(values[1]));
    }
    const panel = byId(rootElem, `tab-panel-${id}-${val}`);
    if (!panel) return;
    if (meta['tab-background']) tabColor[`tab-${id}-${val}`] = meta['tab-background'];
    if (meta.link && id && val) {
      const path = linkedPath(meta.link);
      if (path) linkedTabs[`tab-${id}-${val}`] = path;
    }
    const label = items[val - 1]?.textContent;
    if (label) panel.setAttribute('data-nested-lh', `t${val}${trackingLabel(label, 3)}`);
    panel.append(section);
  });

  const paint = (tab, on) => {
    const colour = tabColor[tab.id];
    const authored = on && !!colour && isAuthoredColour(colour);
    tab.classList.toggle('tabs-tab-authored-bg', authored);
    if (authored) tab.style.setProperty('--_tab-bg', colour.trim());
    else tab.style.removeProperty('--_tab-bg');
  };
  tabs.forEach((tab) => { if (tab.getAttribute(selectedAttr) === 'true') paint(tab, true); });

  const select = (target) => {
    const redirect = redirectionUrl(linkedTabs, target.id, win?.location);
    if (redirect) {
      win.location.assign(redirect);
      return;
    }
    tabs.forEach((t) => {
      if (t.getAttribute(selectedAttr) !== 'true') return;
      t.setAttribute(selectedAttr, 'false');
      t.setAttribute('tabindex', '-1');
      paint(t, false);
    });
    target.setAttribute(selectedAttr, 'true');
    target.setAttribute('tabindex', '0');
    paint(target, true);
    scrollTabIntoList(target);
    const controlId = target.getAttribute(isRadio ? 'data-control-id' : 'aria-controls');
    contentContainer.querySelectorAll(`:scope > .tabs-panel[data-block-id="${quoteAttr(blockId)}"]`)
      .forEach((p) => p.setAttribute('hidden', ''));
    const panel = byId(contentContainer, controlId);
    panel?.removeAttribute('hidden');
    positionIndicator(el);
    if (el.classList.contains('stacked-mobile')) scrollStackedMobile(panel);
    win?.dispatchEvent(new win.Event(TAB_CHANGED));
    if (config.remember === 'on') {
      try { store?.setItem(storageName, target.id.substring(target.id.lastIndexOf('-') + 1)); } catch (e) { /* storage unavailable */ }
    }
  };

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => select(tab));
    if (isSegmented) tab.addEventListener('focus', () => scrollTabIntoList(tab));
  });

  list.addEventListener('keydown', (e) => {
    const keys = isRtl(el) ? { ArrowLeft: 1, ArrowRight: -1 } : { ArrowLeft: -1, ArrowRight: 1 };
    if (!(e.key in keys) && e.key !== 'Home' && e.key !== 'End') return;
    if (!tabs.length) return;
    const current = tabs.indexOf(doc.activeElement);
    const from = current >= 0 ? current : tabs.findIndex((t) => t.getAttribute('tabindex') === '0');
    let to;
    if (e.key === 'Home') to = 0;
    else if (e.key === 'End') to = tabs.length - 1;
    else to = (Math.max(from, 0) + keys[e.key] + tabs.length) % tabs.length;
    e.preventDefault();
    const tab = tabs[to];
    if (redirectionUrl(linkedTabs, tab.id, win?.location)) {
      tabs.forEach((t) => t.setAttribute('tabindex', t === tab ? '0' : '-1'));
    } else {
      select(tab);
    }
    tab.focus();
  });

  doc.addEventListener(DEFERRED, () => {
    el.querySelectorAll('img[loading="lazy"]').forEach((img) => img.removeAttribute('loading'));
  }, { once: true, capture: true });

  const ResizeObs = win?.ResizeObserver;
  if (underline && typeof ResizeObs === 'function') {
    const ro = new ResizeObs(() => positionIndicator(el));
    ro.observe(container);
    tabs.forEach((tab) => ro.observe(tab));
  }
  positionIndicator(el);

  const params = new URLSearchParams(win?.location?.search ?? '');
  const deeplink = config.id ? params.get(config.id) : null;
  if (deeplink) {
    const btn = rootElem.querySelector(`[data-deeplink="${quoteAttr(deeplink)}"]`);
    if (btn) {
      btn.click();
      if (config.remember === 'on' && win?.history && win.location) {
        const url = new URL(win.location.href);
        url.searchParams.delete(config.id);
        win.history.replaceState({}, '', url);
      }
      return;
    }
  }
  const tabParam = params.get('tab');
  if (tabParam) {
    const dash = tabParam.lastIndexOf('-');
    if (tabParam.substring(0, dash) === config.id) {
      const btn = byId(rootElem, `tab-${config.id}-${tabParam.substring(dash + 1)}`);
      if (btn) {
        btn.click();
        return;
      }
    }
  }
  if (config['active-tab']) {
    const sel = byId(rootElem, `tab-${tabId}-${keyName(config['active-tab'])}`);
    if (sel) {
      sel.addEventListener('click', (e) => e.stopPropagation(), { once: true });
      sel.click();
    }
  }
}

export const MEMBERS = {
  tabs: {
    origin: 'c1',
    compat: 'canonical',
    overrides: 'none',
    viewportPrePass: false,
    decorate: decorateTabs,
  },
};

export default function decorate(el) {
  return dispatch(el, MEMBERS, { block: 'tabs' });
}
