import { createTag, getConfig, loadBlock, MILO_EVENTS, scrollToHashedElement } from '../../../utils/utils.js';
import { replaceKey } from '../../../features/placeholders.js';
import { getBlogSections } from '../blog-header-c2/blog-header-c2.js';

const sectionTrackers = new WeakMap();
const authoredConfigs = new WeakMap();
const pendingInitializations = new WeakMap();

function getAuthoredConfig(block) {
  if (!authoredConfigs.has(block)) {
    const [firstRow, secondRow] = block.querySelectorAll(':scope > div:not(.blog-related-content-c2)');
    const listFirst = firstRow && (
      firstRow.querySelector('ol, ul') || /^\s*1\.(?:\s|$)/.test(firstRow.textContent)
    );
    const headingRow = listFirst ? undefined : firstRow;
    const labelsRow = listFirst ? firstRow : secondRow;
    const list = labelsRow?.querySelector('ol, ul');
    let labels = [];
    if (list) {
      labels = [...list.querySelectorAll(':scope > li')].map((item) => item.textContent);
    } else if (labelsRow) {
      const content = labelsRow.cloneNode(true);
      content.querySelectorAll('p, br').forEach((element) => element.after('\n'));
      labels = content.textContent.split(/\r?\n/)
        .filter((line) => line.trim())
        .map((line) => line.trim().replace(/^\d+\.\s*/, ''));
    }
    authoredConfigs.set(block, {
      heading: headingRow?.textContent.trim(),
      labels: labels.map((label) => {
        const text = label.trim();
        return text.toLowerCase() === 'no change' ? '' : text;
      }),
    });
  }
  return authoredConfigs.get(block);
}

function isSelectableId(id, heading) {
  try {
    return document.querySelector(`#${id}`) === heading;
  } catch {
    return false;
  }
}

function scrollToSection(hash, block) {
  const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ? 'instant' : 'smooth';
  const nav = block.querySelector('nav');
  const offset = getComputedStyle(nav).position === 'sticky'
    ? nav.getBoundingClientRect().height + 24 : 0;
  return scrollToHashedElement(hash, document, behavior, offset);
}

function trackActiveSection(block, headings, collapseControls) {
  const links = [...block.querySelectorAll('nav > ul > li > a')];
  const navigation = document.querySelector('.global-navigation');
  const jumpNavigation = block.querySelector('nav');
  const layout = block.closest('.blog-article-layout');
  let currentIndex = -1;
  let frame = 0;
  let measure = true;
  let headingTops = [];
  let scrollMargin = 0;
  const setActiveIndex = (index) => {
    if (index === currentIndex) return;
    links[currentIndex]?.removeAttribute('aria-current');
    links[index].setAttribute('aria-current', 'location');
    currentIndex = index;
    collapseControls?.setActiveIndex(index);
  };
  const update = () => {
    frame = 0;
    if (!block.isConnected) {
      sectionTrackers.get(block)?.();
      return;
    }
    const scrollTop = window.scrollY;
    if (measure) {
      const height = getComputedStyle(jumpNavigation).position === 'sticky'
        ? jumpNavigation.getBoundingClientRect().height : 0;
      layout?.style.setProperty('--blog-side-navigation-c2-height', `${height}px`);
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
    setActiveIndex(activeIndex);
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
    collapseControls?.cleanup();
    sectionTrackers.delete(block);
  });
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', invalidate);
  const main = block.closest('main');
  const article = block.closest('.blog-article-layout') || main;
  observer.observe(article);
  observer.observe(jumpNavigation);
  if (article !== main) observer.observe(main);
  if (navigation) observer.observe(navigation);
  update();
  return { setActiveIndex };
}

function addCollapseControl(list, label) {
  if (list.children.length <= 1) return undefined;

  list.id = 'blog-side-navigation-c2-sections';
  while (document.getElementById(list.id)) list.id += '-1';
  const icon = createTag('span', { class: 'blog-side-navigation-c2-toggle-icon', 'aria-hidden': 'true' });
  const button = createTag('button', {
    class: 'blog-side-navigation-c2-toggle',
    type: 'button',
    'aria-label': label,
    'aria-controls': list.id,
    'aria-expanded': 'true',
  }, icon);
  const items = [...list.children];
  items[0].append(button);
  const tablet = window.matchMedia('(width >= 768px)');
  const expanded = { tablet: false, mobile: false };
  let activeIndex = 0;
  const render = () => {
    const collapsible = !tablet.matches || items.length > 3;
    const open = !collapsible || expanded[tablet.matches ? 'tablet' : 'mobile'];
    const focusedElement = document.activeElement;
    const visibleItem = open ? items[0] : items[activeIndex];
    button.hidden = !collapsible;
    visibleItem.hidden = false;
    if (button.parentElement !== visibleItem) {
      visibleItem.append(button);
      if (focusedElement === button && !button.hidden) button.focus({ preventScroll: true });
    }
    if (!open && items.some((item, index) => (
      index !== activeIndex && item.contains(focusedElement)
    ))) {
      button.focus({ preventScroll: true });
    } else if (button.hidden && focusedElement === button) {
      visibleItem.querySelector('a').focus({ preventScroll: true });
    }
    button.setAttribute('aria-expanded', String(open));
    items.forEach((item, index) => { item.hidden = !open && index !== activeIndex; });
  };
  button.addEventListener('click', () => {
    const viewport = tablet.matches ? 'tablet' : 'mobile';
    expanded[viewport] = !expanded[viewport];
    render();
  });
  tablet.addEventListener('change', render);
  render();
  return {
    collapse() {
      expanded[tablet.matches ? 'tablet' : 'mobile'] = false;
      render();
    },
    setActiveIndex(index) {
      activeIndex = index;
      render();
    },
    cleanup() {
      tablet.removeEventListener('change', render);
    },
  };
}

function createLayout(block, headerSection, articleSections) {
  if (block.closest('.blog-article-layout')) return;

  if (!articleSections.length) {
    window.lana?.log('Could not find article sections for blog side navigation layout.', {
      tags: 'blog-side-navigation-c2',
      severity: 'warning',
    });
    return;
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
  if (!main?.querySelector('.blog-header-c2')) {
    window.lana?.log('Blog side navigation requires a blog header.', {
      tags: 'blog-side-navigation-c2',
      severity: 'warning',
    });
    block.hidden = true;
    return;
  }

  const headerSection = main.querySelector('.blog-header-c2').closest('.section');
  const pendingSection = main.querySelector([
    ':scope > .section[data-status="pending"]',
    ':scope > .blog-article-layout > .blog-article-content > .section[data-status="pending"]',
  ].join(', '));
  if (pendingSection) {
    // Build the two-column grid now, while the article sections are still hidden, so they
    // reveal in their final column instead of jumping once the navigation is ready.
    block.classList.add('is-pending');
    createLayout(block, headerSection, getBlogSections(headerSection));
    if (pendingInitializations.has(block)) return;
    const retry = () => {
      pendingInitializations.delete(block);
      if (!block.isConnected) return;
      init(block).catch((error) => {
        window.lana?.log(`Blog side navigation failed to initialize: ${error.message}`, {
          tags: 'blog-side-navigation-c2',
          severity: 'error',
        });
      });
    };
    pendingInitializations.set(block, retry);
    document.addEventListener(MILO_EVENTS.DEFERRED, retry, { once: true });
    return;
  }

  const pendingRetry = pendingInitializations.get(block);
  if (pendingRetry) {
    document.removeEventListener(MILO_EVENTS.DEFERRED, pendingRetry);
    pendingInitializations.delete(block);
  }

  const layout = block.closest('.blog-article-layout');
  const articleSections = layout
    ? [...layout.querySelectorAll(':scope > .blog-article-content > .section')]
    : getBlogSections(headerSection);
  const headings = articleSections.flatMap((section) => (
    [...section.querySelectorAll(':scope > .content h2')]
  )).filter((heading) => (
    heading.textContent.trim()
    && !heading.closest('.blog-header-c2, nav, .fragment, [hidden], [aria-hidden="true"]')
    && block.compareDocumentPosition(heading) === Node.DOCUMENT_POSITION_FOLLOWING
  ));
  const { heading: authoredHeading, labels } = getAuthoredConfig(block);
  delete block.dataset.failed;
  delete block.dataset.reason;
  if (labels.some(Boolean) && labels.length > headings.length) {
    const message = `Blog side navigation: ${labels.length} list items for ${headings.length} headings. `
      + 'Extra items have no destination heading and are ignored. Remove the extra items.';
    window.lana?.log(message, { tags: 'blog-side-navigation-c2', severity: 'warning' });
    if (getConfig().env?.name !== 'prod') {
      block.dataset.failed = 'true';
      block.dataset.reason = message;
    }
  }

  if (!headings.length) {
    block.classList.remove('is-pending');
    if (layout) layout.replaceWith(...articleSections);
    block.hidden = block.dataset.failed !== 'true';
    if (!block.hidden) block.replaceChildren();
    return;
  }

  const label = authoredHeading || await replaceKey('jump-to-section', getConfig());
  const nav = createTag('nav', { 'aria-label': label });
  const list = createTag('ul');

  headings.forEach((heading, index) => {
    const title = labels[index] || heading.textContent.trim();
    let { id } = heading;
    // Keep an existing anchor so deep links survive, unless the author chose a jump label
    // for it. The shared scroll helper needs the id to work as a CSS selector.
    if (labels[index] || !id || !isSelectableId(id, heading)) {
      const slug = title.normalize('NFC').toLowerCase()
        .replace(/[^\p{L}\p{N}\p{M}]+/gu, '-').replace(/^-|-$/g, '');
      const baseId = /^\d/.test(slug) ? `section-${slug}` : slug || `section-${index + 1}`;
      id = baseId;
      let suffix = 1;
      while (document.getElementById(id) && document.getElementById(id) !== heading) {
        id = `${baseId}-${suffix}`;
        suffix += 1;
      }
      heading.id = id;
    }
    const text = createTag('span', { class: 'blog-side-navigation-c2-label' });
    text.textContent = title;
    const link = createTag('a', { href: `#${id}` }, text);
    list.append(createTag('li', null, link));
  });

  const collapseControls = addCollapseControl(list, label);
  const relatedContent = block.querySelector('.blog-related-content-c2')
    || articleSections.map((section) => section.querySelector('.blog-related-content-c2')).find(Boolean);
  nav.append(list);
  const title = createTag('strong');
  title.textContent = label;
  block.replaceChildren(createTag('p', null, title), nav);
  block.hidden = false;
  block.classList.remove('is-pending');
  createLayout(block, headerSection, articleSections);
  const sectionTracker = trackActiveSection(block, headings, collapseControls);
  [...list.querySelectorAll(':scope > li > a')].forEach((link, index) => {
    const heading = headings[index];
    link.addEventListener('click', (event) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey
        || event.shiftKey || event.altKey) return;
      event.preventDefault();
      if (collapseControls && !window.matchMedia('(width >= 768px)').matches) {
        sectionTracker.setActiveIndex(index);
        collapseControls.collapse();
      }
      if (window.location.hash !== link.hash) window.history.pushState(null, '', link.hash);
      scrollToSection(link.hash, block).then(() => {
        if (!heading.hasAttribute('tabindex')) heading.tabIndex = -1;
        heading.focus({ preventScroll: true });
      }).catch((error) => {
        window.lana?.log(`Blog section scroll failed: ${error.message}`, {
          tags: 'blog-side-navigation-c2',
          severity: 'error',
        });
      });
    });
  });
  if (relatedContent) {
    block.append(relatedContent);
    loadBlock(relatedContent).catch((error) => {
      window.lana?.log(`Blog related content failed to initialize: ${error.message}`, {
        tags: 'blog-related-content-c2',
        severity: 'error',
      });
    });
  }
  if (headings.some((heading) => window.location.hash === `#${encodeURIComponent(heading.id)}`)) {
    await scrollToSection(window.location.hash, block);
  }
}
