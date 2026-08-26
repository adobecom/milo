import { createTag, loadStyle } from '../../../utils/utils.js';

const ACTIVE_CLASS = 'is-active';
const OPEN_CLASS = 'is-open';
const DESKTOP_BREAKPOINT = 1200;

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function getAnchorId(href) {
  return href?.split('#')[1] ?? '';
}

function hasMeta(section, value) {
  if (section.classList.contains(value)) return true;
  // Milo section-metadata uses divs not table cells — check value cells (second div in each row)
  const metas = section.querySelectorAll('.section-metadata');
  if (!metas.length) return false;
  return [...metas].some((meta) => [...meta.querySelectorAll(':scope > div > div:last-child')].some(
    (cell) => cell.textContent.toLowerCase().split(',').map((s) => s.trim().replace(/\s+/g, '-')).includes(value),
  ));
}

function getBlockConfig(block) {
  const ol = block.querySelector('ol');
  const ul = block.querySelector('ul');
  const list = ol || ul;
  const label = block.querySelector('p')?.textContent?.trim() || '';
  if (!list) return { links: null, label };
  const numbered = !!ol;
  const links = [...list.querySelectorAll('li')].map((li, i) => {
    const a = li.querySelector('a');
    const text = li.textContent.trim();
    const href = a?.getAttribute('href') ?? `#${slugify(text)}`;
    return { label: text, href, ...(numbered && { num: i + 1 }) };
  });
  return { links: links.length ? links : null, label };
}

function discoverSections(navSection) {
  let startEl = navSection.nextElementSibling;

  const explicitStart = [...document.querySelectorAll('.section')].find((s) => hasMeta(s, 'sticky-nav-start'));
  if (explicitStart) startEl = explicitStart;

  const navLinks = [];
  const allSections = [];
  let el = startEl;
  let foundEnd = false;

  while (el) {
    const skip = hasMeta(el, 'sticky-nav-skip');
    if (!skip) {
      const heading = el.querySelector('h2, h3');
      if (heading) {
        if (!heading.id) heading.id = slugify(heading.textContent);
        navLinks.push({ label: heading.textContent.trim(), href: `#${heading.id}`, id: heading.id });
      }
    }
    allSections.push(el);
    if (hasMeta(el, 'sticky-nav-end')) { foundEnd = true; break; }
    el = el.nextElementSibling;
  }

  if (!foundEnd) {
    // eslint-disable-next-line no-console
    console.warn('[sticky-nav] No sticky-nav-end marker found — walked to end of main.');
  }

  return { navLinks, allSections };
}

function buildDesktopNav(links, label) {
  const nav = createTag('nav', { class: 'ssn-desktop', ...(label && { 'aria-label': label }) });
  const list = createTag('ul', { class: 'ssn-list' });

  links.forEach(({ label: text, href, num }) => {
    const li = createTag('li');
    const a = createTag('a', { href, class: 'ssn-link' });
    if (num !== undefined) a.append(createTag('span', { class: 'ssn-num' }, String(num)));
    a.append(createTag('span', { class: 'ssn-link-label' }, text));
    li.append(a);
    list.append(li);
  });

  if (label) nav.append(createTag('p', { class: 'ssn-label' }, label.toUpperCase()));
  nav.append(list);
  return nav;
}

function buildMobileNav(links, label) {
  const nav = createTag('nav', { class: 'ssn-mobile', ...(label && { 'aria-label': label }) });
  const overlay = createTag('div', { class: 'ssn-overlay', 'aria-hidden': 'true' });

  const dropId = `ssn-dropdown-${Math.random().toString(36).slice(2, 7)}`;
  const bar = createTag('button', {
    class: 'ssn-bar',
    'aria-expanded': 'false',
    'aria-controls': dropId,
  });
  const firstLink = links[0];
  let firstLabel = '';
  if (firstLink) firstLabel = firstLink.num !== undefined ? `${firstLink.num}: ${firstLink.label}` : firstLink.label;
  const barCurrent = createTag('span', { class: 'ssn-bar-current' }, firstLabel);
  const barLabel = createTag('span', { class: 'ssn-bar-label' }, label ? label.toUpperCase() : '');
  const barIcon = createTag('span', { class: 'ssn-bar-icon', 'aria-hidden': 'true' }, '+');
  bar.append(barCurrent, barLabel, barIcon);

  const dropdown = createTag('div', { class: 'ssn-dropdown', id: dropId, hidden: true });
  const dropList = createTag('ul', { class: 'ssn-dropdown-list', role: 'list' });

  links.forEach(({ label: text, href, num }) => {
    const li = createTag('li', { role: 'listitem' });
    const a = createTag('a', { href, class: 'ssn-dropdown-link' });
    if (num !== undefined) a.append(createTag('span', { class: 'ssn-num' }, String(num)));
    a.append(createTag('span', { class: 'ssn-link-label' }, text));
    li.append(a);
    dropList.append(li);
  });

  dropdown.append(dropList);
  nav.append(bar, dropdown);

  function openDropdown() {
    bar.setAttribute('aria-expanded', 'true');
    dropdown.hidden = false;
    nav.classList.add(OPEN_CLASS);
    overlay.classList.add(OPEN_CLASS);
    barIcon.textContent = '—';
    dropdown.querySelector('.ssn-dropdown-link')?.focus();
  }

  function closeDropdown() {
    bar.setAttribute('aria-expanded', 'false');
    dropdown.hidden = true;
    nav.classList.remove(OPEN_CLASS);
    overlay.classList.remove(OPEN_CLASS);
    barIcon.textContent = '+';
    bar.focus();
  }

  bar.addEventListener('click', () => {
    if (bar.getAttribute('aria-expanded') === 'true') closeDropdown();
    else openDropdown();
  });

  bar.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDropdown();
  });

  dropdown.addEventListener('keydown', (e) => {
    const items = [...dropdown.querySelectorAll('.ssn-dropdown-link')];
    const idx = items.indexOf(document.activeElement);
    if (e.key === 'ArrowDown') { e.preventDefault(); items[idx + 1]?.focus(); }
    if (e.key === 'ArrowUp') { e.preventDefault(); if (items[idx - 1]) items[idx - 1].focus(); else bar.focus(); }
    if (e.key === 'Escape') closeDropdown();
    if (e.key === 'Tab' && !e.shiftKey && idx === items.length - 1) closeDropdown();
  });

  overlay.addEventListener('click', closeDropdown);

  dropList.addEventListener('click', (e) => {
    if (e.target.closest('a')) closeDropdown();
  });

  return { nav, overlay, barCurrent, dropList };
}

function setupLayout(navSection, desktopNav, allSections) {
  if (!allSections.length) return;

  const layout = createTag('div', { class: 'ssn-layout' });
  const navCol = createTag('div', { class: 'ssn-nav-col' });
  const contentCol = createTag('div', { class: 'ssn-content-col' });

  navCol.append(desktopNav);
  allSections.forEach((s) => contentCol.append(s));

  layout.append(navCol, contentCol);
  navSection.replaceWith(layout);
}

function observeSections(allSections, onActive, defaultId) {
  const THRESHOLD = 0.3;

  function update() {
    const limit = window.innerHeight * THRESHOLD;
    let activeId = null;
    for (const section of allSections) {
      const { top } = section.getBoundingClientRect();
      if (top <= limit) {
        const heading = section.querySelector('h2[id], h3[id]');
        if (heading) activeId = heading.id;
      }
    }
    onActive(activeId ?? defaultId);
  }

  window.addEventListener('scroll', update, { passive: true });
}

function setup(navSection, blockLinks, label) {
  const { navLinks, allSections } = discoverSections(navSection);

  // blockLinks supply display labels (and optional numbering);
  // hrefs/ids come from discovered headings
  let links;
  if (blockLinks && navLinks.length) {
    links = blockLinks.map((bl, i) => ({
      ...bl,
      href: navLinks[i]?.href ?? bl.href,
      id: navLinks[i]?.id ?? bl.href.split('#')[1],
    }));
  } else {
    links = blockLinks ?? navLinks;
  }
  if (!links.length) return;

  const desktopNav = buildDesktopNav(links, label);
  const { nav: mobileNav, overlay, barCurrent, dropList } = buildMobileNav(links, label);

  const main = document.querySelector('main');
  document.body.insertBefore(overlay, main ?? null);
  document.body.insertBefore(mobileNav, main ?? null);

  const anchorHeadings = links.map(({ id }) => document.getElementById(id)).filter(Boolean);

  function getHeaderBottom() {
    return document.querySelector('header')?.getBoundingClientRect().bottom ?? 0;
  }

  function positionMobileNav() {
    const top = getHeaderBottom();
    mobileNav.style.top = `${top}px`;
    overlay.style.top = `${top}px`;
    const offset = top + mobileNav.offsetHeight;
    anchorHeadings.forEach((h) => { h.style.scrollMarginTop = `${offset}px`; });
  }

  function positionDesktopNav() {
    const top = getHeaderBottom();
    anchorHeadings.forEach((h) => { h.style.scrollMarginTop = `${top}px`; });
  }

  function positionNav() {
    if (window.innerWidth >= DESKTOP_BREAKPOINT) positionDesktopNav();
    else positionMobileNav();
  }

  positionNav();
  window.addEventListener('resize', positionNav, { passive: true });

  const header = document.querySelector('header');
  if (header && window.ResizeObserver) {
    new ResizeObserver(positionNav).observe(header);
  }

  setupLayout(navSection, desktopNav, allSections);

  let currentId = null;

  function setActive(id) {
    if (id === currentId) return;
    currentId = id;

    desktopNav.querySelectorAll('.ssn-link').forEach((a) => {
      const isActive = getAnchorId(a.getAttribute('href')) === id;
      a.classList.toggle(ACTIVE_CLASS, isActive);
      if (isActive) a.setAttribute('aria-current', 'location');
      else a.removeAttribute('aria-current');
    });

    dropList.querySelectorAll('.ssn-dropdown-link').forEach((a) => {
      const isActive = getAnchorId(a.getAttribute('href')) === id;
      a.classList.toggle(ACTIVE_CLASS, isActive);
      if (isActive) a.setAttribute('aria-current', 'location');
      else a.removeAttribute('aria-current');
    });

    const active = links.find((l) => l.id === id);
    if (active) {
      barCurrent.textContent = active.num !== undefined ? `${active.num}: ${active.label}` : active.label;
    }
  }

  // Set active immediately on click, don't wait for scroll observer
  desktopNav.querySelectorAll('.ssn-link').forEach((a) => {
    a.addEventListener('click', () => setActive(getAnchorId(a.getAttribute('href'))));
  });

  dropList.querySelectorAll('.ssn-dropdown-link').forEach((a) => {
    a.addEventListener('click', () => setActive(getAnchorId(a.getAttribute('href'))));
  });

  setActive(links[0].id);
  observeSections(allSections, setActive, links[0].id);
}

export default function init(block) {
  loadStyle(new URL('./sticky-nav.css', import.meta.url).href);

  const navSection = block.closest('.section');
  if (!navSection) return;

  const { links: blockLinks, label } = getBlockConfig(block);
  block.innerHTML = '';
  setup(navSection, blockLinks, label);
}
