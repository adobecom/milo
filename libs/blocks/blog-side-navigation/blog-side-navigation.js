import { createTag, getConfig, scrollToHashedElement } from '../../utils/utils.js';
import { replaceKey } from '../../features/placeholders.js';

const sectionTrackers = new WeakMap();

function scrollToSection(hash) {
  const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ? 'instant' : 'smooth';
  return scrollToHashedElement(hash, document, behavior);
}

function trackActiveSection(block, headings, cleanupControls) {
  const links = [...block.querySelectorAll('nav > ul > li > a')];
  const navigation = document.querySelector('.global-navigation');
  let currentIndex = -1;
  let frame = 0;
  let measure = true;
  let headingTops = [];
  let scrollMargin = 0;
  const update = () => {
    frame = 0;
    if (!block.isConnected) {
      sectionTrackers.get(block)?.();
      return;
    }
    const scrollTop = window.scrollY;
    if (measure) {
      headingTops = headings.map((heading) => heading.getBoundingClientRect().top + scrollTop);
      scrollMargin = parseFloat(getComputedStyle(headings[0]).scrollMarginTop) || 0;
      measure = false;
    }
    const navigationBottom = navigation?.getBoundingClientRect().bottom || 0;
    const offset = scrollTop + Math.max(navigationBottom, scrollMargin) + 1;
    let activeIndex = 0;
    headingTops.forEach((top, index) => {
      if (top <= offset) activeIndex = index;
    });
    if (activeIndex === currentIndex) return;
    links[currentIndex]?.removeAttribute('aria-current');
    links[activeIndex].setAttribute('aria-current', 'location');
    currentIndex = activeIndex;
  };
  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(update);
  };
  const invalidate = () => {
    measure = true;
    schedule();
  };
  const observer = new ResizeObserver(invalidate);
  sectionTrackers.set(block, () => {
    window.removeEventListener('scroll', schedule);
    window.removeEventListener('resize', invalidate);
    observer.disconnect();
    cancelAnimationFrame(frame);
    cleanupControls?.();
    sectionTrackers.delete(block);
  });
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', invalidate);
  const main = block.closest('main');
  const article = block.closest('.blog-article-layout') || main;
  observer.observe(article);
  if (article !== main) observer.observe(main);
  if (navigation) observer.observe(navigation);
  update();
}

function addCollapseControl(list, label) {
  if (list.children.length <= 1) return undefined;

  list.id = 'blog-side-navigation-sections';
  while (document.getElementById(list.id)) list.id += '-1';
  const icon = createTag('span', { class: 'blog-side-navigation-toggle-icon', 'aria-hidden': 'true' });
  const button = createTag('button', {
    class: 'blog-side-navigation-toggle',
    type: 'button',
    'aria-label': label,
    'aria-controls': list.id,
    'aria-expanded': 'true',
  }, icon);
  const items = [...list.children];
  items[0].append(button);
  const tablet = window.matchMedia('(min-width: 600px)');
  const expanded = { tablet: true, mobile: false };
  const render = () => {
    const collapsible = items.length > (tablet.matches ? 3 : 1);
    const open = !collapsible || expanded[tablet.matches ? 'tablet' : 'mobile'];
    const focusedElement = document.activeElement;
    button.hidden = !collapsible;
    if (!open && items.slice(1).some((item) => item.contains(focusedElement))) {
      button.focus({ preventScroll: true });
    } else if (button.hidden && focusedElement === button) {
      items[0].querySelector('a').focus({ preventScroll: true });
    }
    button.setAttribute('aria-expanded', String(open));
    items.forEach((item, index) => { item.hidden = !open && index > 0; });
  };
  button.addEventListener('click', () => {
    const viewport = tablet.matches ? 'tablet' : 'mobile';
    expanded[viewport] = !expanded[viewport];
    render();
  });
  tablet.addEventListener('change', render);
  render();
  return () => tablet.removeEventListener('change', render);
}

function createLayout(block, main) {
  if (block.closest('.blog-article-layout')) return;

  const sections = [...main.children];
  const headerSection = sections.find((section) => section.querySelector('.blog-header'));
  const followingSections = sections.slice(sections.indexOf(headerSection) + 1);
  const lastSection = followingSections.filter((section) => section.querySelector(':scope > .content')).at(-1);
  if (!lastSection) {
    window.lana?.log('Could not find article sections for blog side navigation layout.', {
      tags: 'blog-side-navigation',
      severity: 'warning',
    });
    return;
  }

  const articleSections = followingSections.slice(0, followingSections.indexOf(lastSection) + 1);
  const children = [...lastSection.children];
  const lastContent = children.filter((child) => child.classList.contains('content')).at(-1);
  const trailingContent = children.slice(children.indexOf(lastContent) + 1);
  if (trailingContent.some((child) => !child.matches('.section-metadata, .card-metadata, [hidden]'))) {
    const remainder = lastSection.cloneNode(false);
    remainder.removeAttribute('id');
    remainder.append(...trailingContent);
    lastSection.after(remainder);
  }

  const layout = createTag('div', { class: 'blog-article-layout' });
  const article = createTag('div', { class: 'blog-article-content' });
  headerSection.after(layout);
  article.append(...articleSections);
  layout.append(block, article);
}

export default async function init(block) {
  sectionTrackers.get(block)?.();
  const main = block.closest('main');
  if (!main?.querySelector('.blog-header')) {
    window.lana?.log('Blog side navigation requires a blog header.', {
      tags: 'blog-side-navigation',
      severity: 'warning',
    });
    block.hidden = true;
    return;
  }

  const headings = [...main.querySelectorAll('.section > .content h2')].filter((heading) => (
    heading.textContent.trim()
    && !heading.closest('.blog-header, nav, .fragment, [hidden], [aria-hidden="true"]')
    && block.compareDocumentPosition(heading) === Node.DOCUMENT_POSITION_FOLLOWING
  ));
  if (!headings.length) {
    block.hidden = true;
    return;
  }

  const label = await replaceKey('jump-to-section', getConfig());
  const nav = createTag('nav', { 'aria-label': label });
  const list = createTag('ul');

  headings.forEach((heading, index) => {
    const baseId = `section-${index + 1}`;
    let id = baseId;
    let suffix = 1;
    while (document.getElementById(id) && document.getElementById(id) !== heading) {
      id = `${baseId}-${suffix}`;
      suffix += 1;
    }
    heading.id = id;
    const link = createTag('a', { href: `#${id}` }, heading.textContent.trim());
    link.addEventListener('click', (event) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey
        || event.shiftKey || event.altKey) return;
      event.preventDefault();
      if (window.location.hash !== link.hash) window.history.pushState(null, '', link.hash);
      scrollToSection(link.hash).then(() => {
        if (!heading.hasAttribute('tabindex')) heading.tabIndex = -1;
        heading.focus({ preventScroll: true });
      }).catch((error) => {
        window.lana?.log(`Blog section scroll failed: ${error.message}`, {
          tags: 'blog-side-navigation',
          severity: 'error',
        });
      });
    });
    list.append(createTag('li', null, link));
  });

  const cleanupControls = addCollapseControl(list, label);
  nav.append(createTag('p', null, createTag('strong', null, label)), list);
  block.replaceChildren(nav);
  block.hidden = false;
  createLayout(block, main);
  trackActiveSection(block, headings, cleanupControls);
  if (headings.some((heading) => window.location.hash === `#${heading.id}`)) {
    await scrollToSection(window.location.hash);
  }
}
