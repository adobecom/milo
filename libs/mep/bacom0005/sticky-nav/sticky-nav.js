import { createTag, loadStyle } from '../../../utils/utils.js';

const ACTIVE_CLASS = 'is-active';
const OPEN_CLASS = 'is-open';
const DESKTOP_BREAKPOINT = 1200;
const DEFAULT_LABEL = 'Jump to section';

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
  const meta = section.querySelector('.section-metadata');
  if (!meta) return false;
  return [...meta.querySelectorAll(':scope > div > div:last-child')].some(
    (cell) => cell.textContent.toLowerCase().split(',').map((s) => s.trim().replace(/\s+/g, '-')).includes(value),
  );
}

function getBlockConfig(block) {
  const ol = block.querySelector('ol');
  const ul = block.querySelector('ul');
  const list = ol || ul;
  const label = block.querySelector('p')?.textContent?.trim() || DEFAULT_LABEL;
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
    if (hasMeta(el, 'sticky-nav-end')) break;
    el = el.nextElementSibling;
  }

  return { navLinks, allSections };
}

function buildDesktopNav(links, label) {
  const nav = createTag('nav', { class: 'ssn-desktop', 'aria-label': label });
  const labelEl = createTag('p', { class: 'ssn-label' }, label.toUpperCase());
  const list = createTag('ul', { class: 'ssn-list' });

  links.forEach(({ label: text, href, num }) => {
    const li = createTag('li');
    const a = createTag('a', { href, class: 'ssn-link' });
    if (num !== undefined) a.append(createTag('span', { class: 'ssn-num' }, String(num)));
    a.append(createTag('span', { class: 'ssn-link-label' }, text));
    li.append(a);
    list.append(li);
  });

  nav.append(labelEl, list);
  return nav;
}

function buildMobileNav(links, label) {
  const nav = createTag('nav', { class: 'ssn-mobile', 'aria-label': label });
  const overlay = createTag('div', { class: 'ssn-overlay', 'aria-hidden': 'true' });

  const bar = createTag('button', { class: 'ssn-bar', 'aria-expanded': 'false', 'aria-haspopup': 'listbox' });
  const firstLink = links[0];
  let firstLabel = '';
  if (firstLink) firstLabel = firstLink.num !== undefined ? `${firstLink.num}: ${firstLink.label}` : firstLink.label;
  const barCurrent = createTag('span', { class: 'ssn-bar-current' }, firstLabel);
  const barLabel = createTag('span', { class: 'ssn-bar-label' }, label.toUpperCase());
  const barIcon = createTag('span', { class: 'ssn-bar-icon', 'aria-hidden': 'true' }, '+');
  bar.append(barCurrent, barLabel, barIcon);

  const dropdown = createTag('div', { class: 'ssn-dropdown', hidden: true, role: 'listbox' });
  const dropList = createTag('ul', { class: 'ssn-dropdown-list' });

  links.forEach(({ label: text, href, num }) => {
    const li = createTag('li', { role: 'option' });
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
  }

  function closeDropdown() {
    bar.setAttribute('aria-expanded', 'false');
    dropdown.hidden = true;
    nav.classList.remove(OPEN_CLASS);
    overlay.classList.remove(OPEN_CLASS);
    barIcon.textContent = '+';
  }

  bar.addEventListener('click', () => {
    if (bar.getAttribute('aria-expanded') === 'true') closeDropdown();
    else openDropdown();
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
      a.classList.toggle(ACTIVE_CLASS, getAnchorId(a.getAttribute('href')) === id);
    });

    dropList.querySelectorAll('.ssn-dropdown-link').forEach((a) => {
      a.classList.toggle(ACTIVE_CLASS, getAnchorId(a.getAttribute('href')) === id);
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

  // Defer discovery until after section-metadata has applied classes to siblings
  setTimeout(() => setup(navSection, blockLinks, label), 0);
}
