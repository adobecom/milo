import { textOf } from '../_shared/dom.js';
import { dispatch } from '../_shared/members.js';

const FAMILY = 'tree-view';
const BACOM_HOSTS = ['localhost', '--da-bacom--adobecom.aem.page', '--da-bacom--adobecom.aem.live', 'business.adobe.com'];
const TITLE = 'h1, h2, h3, h4, h5, h6, p';
const SVG_NS = 'http://www.w3.org/2000/svg';
const CHEVRON_PATH = 'm9.30103,6c0-.04883-.02002-.09521-.02783-.14343-.01074-.06726-.01294-.13586-.03894-.19971-.04456-.10974-.11121-.21252-.20007-.30139L4.34277.66309c-.35547-.35547-.93359-.35547-1.28906,0s-.35645.93262,0,1.28906l4.047,4.04785-4.047,4.04785c-.35645.35645-.35547.93359,0,1.28906.17773.17773.41113.2666.64453.2666s.4668-.08887.64453-.2666l4.69141-4.69238c.08887-.08887.15552-.19165.20007-.30139.026-.06384.0282-.13245.03894-.19971.00781-.04822.02783-.0946.02783-.14343Z';

export function isCurrentPage(link, win) {
  const currentPath = (win?.location?.pathname || '').replace('.html', '');
  try {
    const url = new URL(link.href);
    const isBacomHost = url.host === '' || BACOM_HOSTS.some((host) => url.host.includes(host));
    if (isBacomHost && url.pathname.replace('.html', '') === currentPath) return true;
  } catch (e) {
    return false;
  }
  return false;
}

function blockNumber(el) {
  const doc = el.ownerDocument;
  let n = doc.querySelectorAll('[data-tree-view-block]').length + 1;
  while (doc.getElementById(`${FAMILY}-${n}-title`) || doc.getElementById(`${FAMILY}-${n}-group-1`)) n += 1;
  el.dataset.treeViewBlock = String(n);
  return n;
}

function chevron(doc) {
  const svg = doc.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', '0 0 12 12');
  svg.setAttribute('focusable', 'false');
  svg.setAttribute('aria-hidden', 'true');
  const path = doc.createElementNS(SVG_NS, 'path');
  path.setAttribute('d', CHEVRON_PATH);
  svg.append(path);
  return svg;
}

function unwrapListParagraphs(list) {
  list.querySelectorAll('li p').forEach((p) => p.replaceWith(...p.childNodes));
}

function setOpen(button, list, open) {
  button.setAttribute('aria-expanded', String(open));
  list.hidden = !open;
  button.closest('li')?.classList.toggle('tree-view-open', open);
}

function visibleItems(nav) {
  return [...nav.querySelectorAll('.tree-view-toggle, a[href]')]
    .filter((node) => !node.closest('[hidden]'));
}

function onKeydown(event, nav) {
  const { key, target } = event;
  if (!target.matches('.tree-view-toggle, a[href]')) return;
  if (key === 'Escape') {
    const group = target.closest('.tree-view-group');
    const button = group?.querySelector(':scope > .tree-view-toggle');
    const list = group?.querySelector(':scope > .tree-view-sublist');
    if (button && list && button.getAttribute('aria-expanded') === 'true') {
      setOpen(button, list, false);
      button.focus();
    }
    return;
  }
  const items = visibleItems(nav);
  const i = items.indexOf(target);
  if (i < 0) return;
  let next = null;
  if (key === 'ArrowDown') next = items[(i + 1) % items.length];
  else if (key === 'ArrowUp') next = items[(i - 1 + items.length) % items.length];
  else if (key === 'Home') [next] = items;
  else if (key === 'End') next = items[items.length - 1];
  if (!next) return;
  event.preventDefault();
  next.focus();
}

function wireAnchor(link, win) {
  const doc = link.ownerDocument;
  let url;
  try { url = new URL(link.href); } catch (e) { return; }
  const hash = url.hash.slice(1);
  if (!hash) return;
  const here = new URL(win.location.href);
  if (url.origin !== here.origin || url.pathname !== here.pathname) return;
  if (url.search !== here.search) return;
  let id = hash;
  try { id = decodeURIComponent(hash); } catch (e) { id = hash; }
  link.addEventListener('click', (event) => {
    const target = doc.getElementById(id);
    if (!target) return;
    event.preventDefault();
    const pageTop = doc.querySelector('header')?.offsetHeight ?? 0;
    const top = target.getBoundingClientRect().top + win.pageYOffset - pageTop;
    win.scrollTo(0, top);
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  });
}

function groupLabel(item, subList) {
  const own = [...item.childNodes].filter((node) => node !== subList);
  const text = own.map((node) => node.textContent).join('');
  const line = text.split('\n').find((t) => t.trim() !== '');
  return (line ?? textOf(item)).trim();
}

function decorateTreeView(el, ctx) {
  el.classList.add(FAMILY);
  if (el.dataset.treeViewDecorated) return;
  const { make } = ctx;
  const doc = el.ownerDocument;
  const win = doc.defaultView;
  const topList = el.querySelector('ul');
  if (!topList) return;
  el.dataset.treeViewDecorated = 'true';
  unwrapListParagraphs(topList);

  const n = blockNumber(el);
  const isAccordion = !!topList.querySelector('ul');
  const links = [...el.querySelectorAll('a[href]')];
  const current = links.filter((link) => isCurrentPage(link, win));
  const title = el.querySelector(TITLE);

  const nav = make('nav', { class: 'tree-view-nav' });
  if (title) {
    if (!title.id) title.id = `${FAMILY}-${n}-title`;
    title.classList.add('tree-view-title');
    nav.setAttribute('aria-labelledby', title.id);
  } else {
    nav.setAttribute('aria-label', 'Navigation');
  }
  nav.append(...el.childNodes);
  el.append(nav);
  el.classList.add(isAccordion ? 'tree-view-accordion' : 'tree-view-simple');
  topList.classList.add('tree-view-list');

  if (current.length === 1) {
    current[0].classList.add('tree-view-current');
    current[0].setAttribute('aria-current', 'page');
  }
  links.forEach((link) => wireAnchor(link, win));

  if (isAccordion) {
    [...topList.children].filter((li) => li.tagName === 'LI').forEach((item, i) => {
      const subList = item.querySelector(':scope > ul') ?? item.querySelector('ul');
      if (!subList) return;
      const label = groupLabel(item, subList);
      const listId = `${FAMILY}-${n}-list-${i + 1}`;
      const button = make('button', {
        type: 'button',
        class: 'tree-view-toggle',
        id: `${FAMILY}-${n}-group-${i + 1}`,
        'aria-expanded': 'false',
        'aria-controls': listId,
      });
      button.append(make('span', { class: 'tree-view-toggle-label' }, label), chevron(doc));
      subList.id = listId;
      subList.classList.add('tree-view-sublist');
      item.classList.add('tree-view-group');
      item.replaceChildren(button, subList);
      setOpen(button, subList, false);
      button.addEventListener('click', () => setOpen(button, subList, button.getAttribute('aria-expanded') !== 'true'));
    });
  }
  nav.addEventListener('keydown', (event) => onKeydown(event, nav));
}

export const MEMBERS = {
  'tree-view': {
    origin: 'c1',
    compat: 'canonical',
    overrides: 'none',
    viewportPrePass: false,
    decorate: decorateTreeView,
  },
};

export default function decorate(el) {
  return dispatch(el, MEMBERS, { block: FAMILY });
}
