import { createTag, getConfig, loadBlock, MILO_EVENTS, scrollToHashedElement } from '../../../utils/utils.js';
import { replaceKey } from '../../../features/placeholders.js';
import { getBlogSections } from '../blog-header/blog-header.js';

const sectionTrackers = new WeakMap();
const authoredConfigs = new WeakMap();
const pendingInitializations = new WeakMap();
const ARTICLE_CLASSES = ['blog-article-section', 'blog-article-start', 'blog-article-end'];

function getAuthoredConfig(block) {
  if (!authoredConfigs.has(block)) {
    const [firstRow, secondRow] = block.querySelectorAll(':scope > div:not(.blog-related-content)');
    const listFirst = firstRow && (
      firstRow.querySelector('ol, ul') || /^\s*1\.(?:\s|$)/.test(firstRow.textContent)
    );
    const [headingRow, labelsRow] = [undefined, firstRow, secondRow].slice(listFirst ? 0 : 1);
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

function isUniqueId(id, heading) {
  return document.getElementById(id) === heading
    && document.querySelectorAll(`#${CSS.escape(id)}`).length === 1;
}

function scrollToSection(heading, block) {
  const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ? 'instant' : 'smooth';
  const nav = block.querySelector('nav');
  const offset = (getComputedStyle(nav).position === 'sticky'
    ? nav.getBoundingClientRect().height : 0) + 24;
  // Kept author ids need not be valid selectors (e.g. "2024-trends"); escape before the lookup.
  const hash = `#${encodeURIComponent(CSS.escape(heading.id))}`;
  return scrollToHashedElement(hash, document, behavior, offset);
}

// A navigation authored in its own section is not part of the article.
function getArticleSections(headerSection, block) {
  return getBlogSections(headerSection).filter((section) => !section.contains(block));
}

// The article sections stay where they are in main, so section analytics (daa-lh) and
// MEP's positional section selectors keep counting them. Classes place them beside the nav.
function markArticle(main, sections) {
  main.querySelectorAll(`:scope > .${ARTICLE_CLASSES[0]}`)
    .forEach((section) => section.classList.remove(...ARTICLE_CLASSES));
  sections.forEach((section) => section.classList.add(ARTICLE_CLASSES[0]));
  sections[0]?.classList.add(ARTICLE_CLASSES[1]);
  sections.at(-1)?.classList.add(ARTICLE_CLASSES[2]);
}

function addHeadingClasses(sections) {
  sections.forEach((section) => {
    // A section still waiting to load has its default content unwrapped; decorateContent
    // later moves these same elements into .content, so the class carries over.
    section.querySelectorAll(':scope > h2, :scope > .content > h2').forEach((heading) => {
      if (![...heading.classList].some((name) => name.startsWith('heading-'))) {
        heading.classList.add('heading-3');
      }
    });
  });
}

function unmarkArticle(main, block) {
  markArticle(main, []);
  block.style.removeProperty('--blog-side-navigation-track-size');
  ['--blog-side-navigation-height', '--blog-side-navigation-block-size', '--blog-side-navigation-overflow-size']
    .forEach((name) => main.style.removeProperty(name));
}

function setSize(element, name, size) {
  const value = `${size}px`;
  if (element.style.getPropertyValue(name) !== value) element.style.setProperty(name, value);
}

function trackActiveSection(block, headings, collapseControls) {
  const links = [...block.querySelectorAll('nav > ul > li > a')];
  const navigation = document.querySelector('.global-navigation');
  const jumpNavigation = block.querySelector('nav');
  const panel = block.querySelector('.blog-side-navigation-panel');
  const main = block.closest('main');
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
      main.style.setProperty('--blog-side-navigation-height', `${height}px`);
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
  // Below 768px the navigation is above the article but out of flow, so the article reserves
  // its height. Set it from the observer, before paint, so the article never shifts.
  // The track spans from the header section to the end of the article, so the panel can
  // stick for the whole article whether or not the header draws dividers. A panel taller than
  // the article extends it, as a grid row would. The article moves with the reserved sizes, so
  // set them before measuring the track.
  const navSection = block.closest('.section');
  const reserve = () => {
    const stacked = getComputedStyle(panel).display === 'contents';
    const size = stacked ? [...panel.children].reduce((total, child) => {
      if (child.hidden || getComputedStyle(child).display === 'none') return total;
      const style = getComputedStyle(child);
      return total + child.offsetHeight
        + parseFloat(style.marginBlockStart) + parseFloat(style.marginBlockEnd);
    }, 0) : 0;
    setSize(main, '--blog-side-navigation-block-size', size);
    const end = main.querySelector(':scope > .blog-article-end') || navSection;
    const overflow = parseFloat(main.style.getPropertyValue('--blog-side-navigation-overflow-size')) || 0;
    const article = end.getBoundingClientRect().bottom - overflow
      - navSection.getBoundingClientRect().bottom;
    const extra = stacked ? 0 : Math.max(0, panel.offsetHeight - article);
    setSize(main, '--blog-side-navigation-overflow-size', extra);
    setSize(block, '--blog-side-navigation-track-size', Math.max(0, article + extra));
  };
  const resize = () => {
    reserve();
    invalidate();
  };
  const observer = new ResizeObserver(resize);
  sectionTrackers.set(block, () => {
    window.removeEventListener('scroll', schedule);
    window.removeEventListener('resize', resize);
    observer.disconnect();
    cancelAnimationFrame(frame);
    collapseControls?.cleanup();
    sectionTrackers.delete(block);
  });
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', resize);
  // Not main: the reserved space resizes it, which would loop the observer. The article
  // sections' content boxes do not change with the space reserved above them.
  [navSection, ...main.querySelectorAll(':scope > .blog-article-section')]
    .forEach((section) => observer.observe(section));
  [...panel.children].forEach((child) => observer.observe(child));
  if (navigation) observer.observe(navigation);
  reserve();
  update();
  return { setActiveIndex, reserve };
}

function addCollapseControl(list, label, collapsed) {
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
  const tablet = window.matchMedia('(width >= 768px)');
  const expanded = { tablet: !collapsed, mobile: false };
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
  list.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || tablet.matches || !expanded.mobile) return;
    expanded.mobile = false;
    render();
    button.focus({ preventScroll: true });
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

  const headerSection = main.querySelector('.blog-header').closest('.section');
  if (main.querySelector(':scope > .section[data-status="pending"]')) {
    // Place the article sections now, while they are still hidden, so they reveal in their
    // final column instead of jumping once the navigation is ready.
    block.classList.add('is-pending');
    const pendingSections = getArticleSections(headerSection, block);
    markArticle(main, pendingSections);
    // Size the headings before the sections reveal, not after the navigation initializes.
    addHeadingClasses(pendingSections);
    if (pendingInitializations.has(block)) return;
    const retry = () => {
      pendingInitializations.delete(block);
      if (!block.isConnected) return;
      init(block).catch((error) => {
        window.lana?.log(`Blog side navigation failed to initialize: ${error.message}`, {
          tags: 'blog-side-navigation',
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

  const articleSections = getArticleSections(headerSection, block);
  addHeadingClasses(articleSections);
  const headings = articleSections.flatMap((section) => (
    [...section.querySelectorAll(':scope > .content h2')]
  )).filter((heading) => (
    heading.textContent.trim()
    && !heading.closest('.blog-header, nav, .fragment, [hidden], [aria-hidden="true"]')
    && block.compareDocumentPosition(heading) === Node.DOCUMENT_POSITION_FOLLOWING
  ));
  const { heading: authoredHeading, labels } = getAuthoredConfig(block);
  delete block.dataset.failed;
  delete block.dataset.reason;
  if (labels.some(Boolean) && labels.length > headings.length) {
    const message = `Blog side navigation: ${labels.length} list items for ${headings.length} headings. `
      + 'Extra items have no destination heading and are ignored. Remove the extra items.';
    window.lana?.log(message, { tags: 'blog-side-navigation', severity: 'warning' });
    if (getConfig().env?.name !== 'prod') {
      block.dataset.failed = 'true';
      block.dataset.reason = message;
    }
  }

  if (!headings.length) {
    block.classList.remove('is-pending');
    unmarkArticle(main, block);
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
    // Keep an existing anchor so deep links survive, even when the author chose a jump label.
    if (!id || !isUniqueId(id, heading)) {
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
    const text = createTag('span', { class: 'blog-side-navigation-label' });
    text.textContent = title;
    const link = createTag('a', { href: `#${id}` }, text);
    list.append(createTag('li', null, link));
  });

  const collapseControls = addCollapseControl(list, label, block.classList.contains('collapsed'));
  const relatedContent = block.querySelector('.blog-related-content')
    || articleSections.map((section) => section.querySelector('.blog-related-content')).find(Boolean);
  nav.append(list);
  const title = createTag('strong');
  title.textContent = label;
  const panel = createTag('div', { class: 'blog-side-navigation-panel' }, [createTag('p', null, title), nav]);
  block.replaceChildren(panel);
  block.hidden = false;
  block.classList.remove('is-pending');
  markArticle(main, articleSections);
  if (relatedContent) panel.append(relatedContent);
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
        // Release the space the open list reserved before measuring the scroll target.
        sectionTracker.reserve();
      }
      if (window.location.hash !== link.hash) window.history.pushState(null, '', link.hash);
      scrollToSection(heading, block).then(() => {
        if (!heading.hasAttribute('tabindex')) heading.tabIndex = -1;
        heading.focus({ preventScroll: true });
      }).catch((error) => {
        window.lana?.log(`Blog section scroll failed: ${error.message}`, {
          tags: 'blog-side-navigation',
          severity: 'error',
        });
      });
    });
  });
  if (relatedContent) {
    loadBlock(relatedContent).catch((error) => {
      window.lana?.log(`Blog related content failed to initialize: ${error.message}`, {
        tags: 'blog-related-content',
        severity: 'error',
      });
    });
  }
  let linkedId = '';
  try {
    linkedId = decodeURIComponent(window.location.hash.slice(1));
  } catch {
    // A malformed fragment links to no heading.
  }
  const linkedHeading = linkedId && headings.find((heading) => heading.id === linkedId);
  if (linkedHeading) await scrollToSection(linkedHeading, block);
}
