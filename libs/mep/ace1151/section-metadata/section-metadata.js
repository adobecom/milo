import { handleFocalpoint } from '../../../utils/decorate.js';
import { createTag, getConfig, getFedsPlaceholderConfig } from '../../../utils/utils.js';

const replacePlaceholder = async (key) => {
  const { replaceKey } = await import('../../../features/placeholders.js');
  return replaceKey(key, getFedsPlaceholderConfig());
};
const ADD_MORE_ICON = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" fill="none"><path fill="#292929" d="M12 24.24c-6.617 0-12-5.383-12-12s5.383-12 12-12 12 5.383 12 12-5.383 12-12 12Zm0-21.943c-5.483 0-9.943 4.46-9.943 9.943s4.46 9.943 9.943 9.943 9.943-4.46 9.943-9.943S17.483 2.297 12 2.297Z"/><path fill="#292929" d="M16.55 11.188h-3.5v-3.5a1.05 1.05 0 0 0-2.1 0v3.5h-3.5a1.05 1.05 0 0 0 0 2.1h3.5v3.5a1.05 1.05 0 0 0 2.1 0v-3.5h3.5a1.05 1.05 0 0 0 0-2.1Z"/></svg>';

const mediaQueries = {
  mobile: window.matchMedia('(max-width: 599px)'),
  tablet: window.matchMedia('(min-width: 600px) and (max-width: 1199px)'),
};

const applyBackground = (colors, section) => {
  if (colors.length === 1) {
    const [color] = colors;
    section.style.background = color;
    return;
  }
  if (colors.length === 2) {
    const [mobileColor, tabletDesktopColor] = colors;
    section.style.background = mediaQueries.mobile.matches ? mobileColor : tabletDesktopColor;
    return;
  }
  if (colors.length >= 3) {
    const [mobileColor, tabletColor, desktopColor] = colors;
    if (mediaQueries.mobile.matches) {
      section.style.background = mobileColor;
    } else if (mediaQueries.tablet.matches) {
      section.style.background = tabletColor;
    } else {
      section.style.background = desktopColor;
    }
  }
};

export function handleBackground(div, section) {
  const pic = div.background.content?.querySelector('picture');
  if (pic) {
    section.classList.add('has-background');
    pic.classList.add('section-background');
    handleFocalpoint(pic, div.background.content);
    section.insertAdjacentElement('afterbegin', pic);
  } else {
    const color = div.background.content?.textContent?.trim();
    if (color) {
      const colors = color.split('|').map((c) => c.trim());
      applyBackground(colors, section);
      Object.keys(mediaQueries).forEach((key) => {
        mediaQueries[key].addEventListener('change', () => applyBackground(colors, section), 100);
      });
    }
  }
}

export async function handleStyle(text, section) {
  if (!text || !section) return;
  const styles = text.split(', ').map((style) => style.replaceAll(' ', '-'));
  const sticky = styles.find((style) => style === 'sticky-top' || style === 'sticky-bottom');
  if (sticky) {
    const { default: handleStickySection } = await import('./sticky-section.js');
    await handleStickySection(sticky, section);
  }
  if (styles.includes('masonry')) styles.push('masonry-up');
  section.classList.add(...styles);
}

function handleMasonry(text, section) {
  section.classList.add(...['masonry-layout', 'masonry-up']);
  const divs = section.querySelectorAll(":scope > div:not([class*='metadata'])");
  const spans = [];
  text.split('\n').forEach((line) => spans.push(...line.trim().split(',')));
  [...divs].forEach((div, i) => {
    const spanWidth = spans[i] ? spans[i] : 'span 4';
    div.classList.add(`grid-${spanWidth.trim().replace(' ', '-')}`);
  });
}

function handleLayout(text, section) {
  if (!(text || section)) return;
  const layoutClass = `grid-template-columns-${text.replaceAll(' | ', '-')}`;
  section.classList.add(layoutClass);
}

export function getDelayTime(time) {
  if (time > 99) return time;
  return (time * 1000);
}

function handleDelay(time, section) {
  if (!(time || section)) return;
  section.classList.add('hide-sticky-section');
  setTimeout(() => { section.classList.remove('hide-sticky-section'); }, getDelayTime(time));
}

function handleAnchor(anchor, section) {
  if (!anchor || !section) return;
  section.id = anchor.toLowerCase().trim().replaceAll(/\s+/g, '-');
  section.classList.add('section-anchor');
}

export const getMetadata = (el) => [...el.childNodes].reduce((rdx, row) => {
  if (row.children) {
    const key = row.children[0].textContent.trim().toLowerCase();
    const content = row.children[1];
    const text = content.textContent.trim().toLowerCase();
    if (key && content) rdx[key] = { content, text };
  }
  return rdx;
}, {});

async function createShowMoreButton(section) {
  const seeMoreText = await replacePlaceholder('see-more-features');
  const showMoreButton = createTag('div', { class: 'show-more-button' });
  const button = createTag('button', {}, seeMoreText);

  const iconSpan = createTag('span', {
    class: 'show-more-icon',
    'aria-hidden': 'true',
  }, `${ADD_MORE_ICON}`);
  button.appendChild(iconSpan);

  button.addEventListener('click', () => {
    section.classList.add('show-all');
    section.querySelector('.show-more-button').remove();
  });

  showMoreButton.append(button);
  return showMoreButton;
}

async function handleCollapseSection(section) {
  if (!section) return;
  const blocks = section.querySelectorAll('div:not(:last-child)');
  const existingShowMoreButton = section.querySelector('.show-more-button');
  if (blocks.length <= 3 || existingShowMoreButton) return;
  const showMoreButton = await createShowMoreButton(section);
  section.append(showMoreButton);
  const { decorateDefaultLinkAnalytics } = await import('../../../martech/attributes.js');
  decorateDefaultLinkAnalytics(showMoreButton);
}

function addListAttrToSection(section) {
  if (!section) return;
  const isSectionUp = [...section.classList].some((c) => c.endsWith('-up'));
  const hasHeader = section.querySelector('h1, h2, h3, h4, h5, h6');
  const allowedBlocks = ['icon-block', 'action-item', 'section-metadata'];
  const hasAllowedChildren = [...section.children]
    .every((child) => allowedBlocks.some((block) => child.classList.contains(block)));
  if (!isSectionUp || hasHeader || !hasAllowedChildren) return;
  section.setAttribute('role', 'list');
  [...section.children].forEach((child) => {
    if (child.classList.contains('section-metadata')) return;
    child.setAttribute('role', 'listitem');
  });
}

function isInDeeplinkTab(section) {
  const tabPanel = section.closest('[role="tabpanel"], .tabpanel');
  if (!tabPanel) return false;
  if (tabPanel.hasAttribute('hidden')) return false;
  const params = new URLSearchParams(window.location.search);
  if (params.has('tab')) return true;
  const tabsBlock = section.closest('.tabs');
  if (tabsBlock) {
    const tabId = tabsBlock.id?.replace('tabs-', '');
    if (tabId && params.has(tabId)) return true;
  }

  return false;
}

async function loadFragmentContent(placeholder, url) {
  const { default: initFragment } = await import('../../../blocks/fragment/fragment.js');
  const link = createTag('a', { href: url, class: 'fragment' });
  placeholder.appendChild(link);
  await initFragment(link);
}

async function handleCollapseFrag(fragmentUrl, section, buttonText) {
  if (!fragmentUrl || !section || !buttonText) return null;

  // Check if section is in a deeplinked tab
  const shouldStartExpanded = isInDeeplinkTab(section);

  const contentId = `collapse-frag-${Math.random().toString(36).substr(2, 9)}`;
  const placeholder = createTag('div', {
    class: 'collapse-frag-placeholder',
    'data-fragment-url': fragmentUrl,
    id: contentId,
    'aria-hidden': shouldStartExpanded ? 'false' : 'true',
  });
  const toggleButton = createTag('button', {
    class: 'collapse-frag-button',
    'aria-expanded': shouldStartExpanded ? 'true' : 'false',
    'aria-controls': contentId,
  });
  const textSpan = createTag('span', { class: 'collapse-frag-text' }, buttonText);
  toggleButton.append(textSpan);
  let isLoaded = false;
  let fragSection = null;
  let fragContent = null;

  function collapseContent() {
    if (!fragSection || !fragContent) return;
    const currentHeight = fragSection.scrollHeight;
    fragSection.style.maxHeight = `${currentHeight}px`;
    // Force reflow
    /* eslint-disable-next-line no-unused-vars */
    const temp = fragSection.offsetHeight;
    fragContent.style.opacity = '0';
    fragSection.style.maxHeight = '0';
    fragSection.style.paddingBottom = '0';
    toggleButton.setAttribute('aria-expanded', 'false');
    placeholder.setAttribute('aria-hidden', 'true');
    section.classList.remove('frag-expanded');

    setTimeout(() => {
      fragSection.style.visibility = 'hidden';
    }, 300); // Wait for opacity transition to complete (0.3s)
  }

  function expandContent() {
    if (!fragSection || !fragContent) return;
    fragSection.style.visibility = 'visible';
    fragSection.style.maxHeight = 'none';
    fragSection.style.paddingBottom = '';
    const targetHeight = fragSection.scrollHeight;
    fragSection.style.maxHeight = '0';
    fragSection.style.paddingBottom = '0';
    // Force reflow
    /* eslint-disable-next-line no-unused-vars */
    const temp = fragSection.offsetHeight;
    fragSection.style.paddingBottom = '';
    fragSection.style.maxHeight = `${targetHeight}px`;
    toggleButton.setAttribute('aria-expanded', 'true');
    placeholder.setAttribute('aria-hidden', 'false');
    section.classList.add('frag-expanded');
    setTimeout(() => {
      fragContent.style.opacity = '1';
    }, 50);
    const transitionEnd = () => {
      fragSection.style.maxHeight = 'none';
      fragSection.removeEventListener('transitionend', transitionEnd);
    };
    fragSection.addEventListener('transitionend', transitionEnd);
  }

  async function loadAndSetupFragment() {
    toggleButton.disabled = true;
    try {
      await loadFragmentContent(placeholder, fragmentUrl);
      const loadedFragment = placeholder.querySelector('.fragment');
      fragSection = loadedFragment?.querySelector(':scope > .section');
      if (!fragSection) {
        toggleButton.disabled = false;
        return false;
      }
      fragContent = fragSection.querySelector(':scope > *') || fragSection;
      fragSection.style.overflow = 'hidden';
      fragSection.style.transition = 'max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      fragContent.style.transition = 'opacity 0.3s ease-in-out';
      isLoaded = true;
      toggleButton.disabled = false;
      return true;
    } catch (error) {
      toggleButton.disabled = false;
      return false;
    }
  }

  toggleButton.addEventListener('click', async () => {
    const isExpanded = toggleButton.getAttribute('aria-expanded') === 'true';
    if (!isLoaded && !isExpanded) {
      const loaded = await loadAndSetupFragment();
      if (!loaded) return;
      const { decorateSectionAnalytics } = await import('../../../martech/attributes.js');
      await decorateSectionAnalytics(fragSection, 'collapse-frag', getConfig());
      expandContent();
    } else if (isExpanded) {
      collapseContent();
    } else {
      expandContent();
    }
  });

  section.classList.add('has-collapse-frag');
  if (shouldStartExpanded) {
    (async () => {
      const loaded = await loadAndSetupFragment();
      if (!loaded) return;
      fragSection.style.visibility = 'visible';
      fragSection.style.maxHeight = 'none';
      fragContent.style.opacity = '1';
      section.classList.add('frag-expanded');
    })();
  }

  return { toggleButton, placeholder };
}

export default async function init(el) {
  const section = el.closest('.section');
  const metadata = getMetadata(el);
  if (metadata.style) await handleStyle(metadata.style.text, section);
  if (metadata.background) handleBackground(metadata, section);
  if (metadata.layout) handleLayout(metadata.layout.text, section);
  if (metadata.masonry) handleMasonry(metadata.masonry.text, section);
  if (metadata.delay) handleDelay(metadata.delay.text, section);
  if (metadata.anchor) handleAnchor(metadata.anchor.text, section);
  if (metadata['collapse-ups-mobile']?.text === 'on') await handleCollapseSection(section);

  const collapseFragText = metadata['collapse-frag-text']?.content?.textContent?.trim();
  const collapseFragPath = metadata['collapse-frag-path']?.content?.textContent?.trim();

  if (collapseFragText && collapseFragPath) {
    const result = await handleCollapseFrag(collapseFragPath, section, collapseFragText);
    if (result) {
      const { toggleButton, placeholder } = result;
      el.parentElement.insertBefore(toggleButton, el);
      el.parentElement.insertBefore(placeholder, el);
    }
  }

  addListAttrToSection(section);
}
