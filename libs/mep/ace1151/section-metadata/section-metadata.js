import { handleFocalpoint } from '../../../utils/decorate.js';
import { createTag, getConfig, getFedsPlaceholderConfig } from '../../../utils/utils.js';
import { processTrackingLabels } from '../../../martech/attributes.js';

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
    const content = row?.children[1];
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

function isInDeeplinkHash() {
  const deeplinkParams = ['filter', 'category', 'search', 'sort', 'types', 'single_app', 'page'];

  const hash = window.location.hash.substring(1);
  if (hash) {
    const hashParams = new URLSearchParams(hash);
    if (deeplinkParams.some((param) => hashParams.has(param))) return true;
  }

  const searchParams = new URLSearchParams(window.location.search);
  return deeplinkParams.some((param) => searchParams.has(param));
}

async function loadFragmentContent(placeholder, url) {
  const { default: initFragment } = await import('../../../blocks/fragment/fragment.js');
  const link = createTag('a', { href: url, class: 'fragment' });
  placeholder.appendChild(link);
  await initFragment(link);
}

async function handleCollapseFrag(fragmentUrl, section, buttonText) {
  if (!fragmentUrl || !section || !buttonText) {
    return null;
  }

  const shouldStartExpanded = isInDeeplinkTab(section) || isInDeeplinkHash(section);

  const contentId = `collapse-frag-${Math.random().toString(36).substring(2, 11)}`;
  const analyticsString = `open-${processTrackingLabels(buttonText)}`;
  const placeholder = createTag('div', {
    class: 'collapse-frag-placeholder',
    'data-fragment-url': fragmentUrl,
    id: contentId,
    'aria-hidden': shouldStartExpanded ? 'false' : 'true',
  });
  const buttonWrapper = createTag('div', { class: 'collapse-frag-button' });
  const toggleButton = createTag('button', {
    'aria-expanded': shouldStartExpanded ? 'true' : 'false',
    'aria-controls': contentId,
    'daa-ll': analyticsString,
  });
  toggleButton.innerHTML = `
    <span>${buttonText}</span>
    <svg width="15" height="9" viewBox="0 0 15 9" fill="none" aria-hidden="true">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M2.55578 0.432756L7.49638 5.37325L12.437 0.432757C12.7192 0.15563 13.0994 0.0011564 13.4949 0.00294756C13.8904 0.00473872 14.2692 0.162649 14.5489 0.442321C14.8286 0.721993 14.9865 1.1008 14.9883 1.49631C14.9901 1.89182 14.8356 2.27204 14.5585 2.55423L8.55712 8.55556C8.27593 8.8369 7.8945 8.99501 7.49673 8.99512C7.09897 8.99522 6.71745 8.83731 6.43611 8.55612L0.434223 2.55423C0.155818 2.27228 0.000262095 1.89165 0.00151717 1.49542C0.00277224 1.09918 0.160736 0.719539 0.440922 0.439365C0.721107 0.159191 1.10076 0.00124444 1.49699 6.15687e-06C1.89322 -0.00123213 2.27385 0.154339 2.55578 0.432756Z" fill="currentColor"/>
    </svg>
  `;
  buttonWrapper.appendChild(toggleButton);
  let isLoaded = false;
  let loadedFragment = null;

  function collapseContent() {
    if (!loadedFragment) return;
    const currentHeight = loadedFragment.scrollHeight;
    loadedFragment.style.maxHeight = `${currentHeight}px`;
    loadedFragment.style.overflow = 'hidden';
    // Force reflow
    /* eslint-disable-next-line no-unused-vars */
    const temp = loadedFragment.offsetHeight;
    loadedFragment.style.maxHeight = '0';
    toggleButton.setAttribute('aria-expanded', 'false');
    placeholder.setAttribute('aria-hidden', 'true');
    section.classList.remove('frag-expanded');
    // Update analytics to track close action
    const analyticsValue = toggleButton.getAttribute('daa-ll');
    if (analyticsValue) {
      toggleButton.setAttribute('daa-ll', analyticsValue.replace(/close-/, 'open-'));
    }
  }

  function expandContent() {
    if (!loadedFragment) return;
    loadedFragment.style.overflow = 'hidden';
    loadedFragment.style.maxHeight = 'none';
    const targetHeight = loadedFragment.scrollHeight;
    loadedFragment.style.maxHeight = '0';
    // Force reflow
    /* eslint-disable-next-line no-unused-vars */
    const temp = loadedFragment.offsetHeight;
    loadedFragment.style.maxHeight = `${targetHeight}px`;
    toggleButton.setAttribute('aria-expanded', 'true');
    placeholder.setAttribute('aria-hidden', 'false');
    section.classList.add('frag-expanded');
    const transitionEnd = () => {
      loadedFragment.style.maxHeight = 'none';
      loadedFragment.style.overflow = '';
      loadedFragment.removeEventListener('transitionend', transitionEnd);
    };
    loadedFragment.addEventListener('transitionend', transitionEnd);
    const analyticsValue = toggleButton.getAttribute('daa-ll');
    if (analyticsValue) {
      toggleButton.setAttribute('daa-ll', analyticsValue.replace(/open-/, 'close-'));
    }
  }

  async function loadAndSetupFragment() {
    toggleButton.disabled = true;
    try {
      await loadFragmentContent(placeholder, fragmentUrl);
      loadedFragment = placeholder.querySelector('.fragment');
      const fragSection = loadedFragment?.querySelector(':scope > .section');
      if (!fragSection) {
        toggleButton.disabled = false;
        return false;
      }
      loadedFragment.style.transition = 'max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
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
      expandContent();
    } else if (isExpanded) {
      collapseContent();
    } else {
      expandContent();
    }
  });

  section.classList.add('has-collapse-frag');
  // Return a promise if we need to wait for expansion before scrolling
  const expansionPromise = shouldStartExpanded ? (async () => {
    const loaded = await loadAndSetupFragment();
    if (!loaded) return false;
    loadedFragment.style.maxHeight = 'none';
    section.classList.add('frag-expanded');
    // Add temporary min-height to footer to prevent layout shift during initial load
    const footer = document.querySelector('footer');
    if (footer) {
      const estimatedMinHeight = 4000;
      footer.style.minHeight = `${estimatedMinHeight}px`;
      const removeMinHeight = () => {
        if (footer.style.minHeight) {
          footer.style.transition = 'min-height 0.5s ease';
          footer.style.minHeight = '';
          setTimeout(() => {
            footer.style.transition = '';
          }, 500);
        }
      };
      setTimeout(removeMinHeight, 10000);
    }
    const { decorateSectionAnalytics } = await import('../../../martech/attributes.js');
    await decorateSectionAnalytics(loadedFragment, 'collapse-frag', getConfig());
    return true;
  })() : null;

  // Preload content in background after tabs become interactive (non-deeplink case)
  if (!shouldStartExpanded) {
    const preloadContent = async () => {
      const tabsBlock = section.closest('.tabs');
      if (!tabsBlock) {
        // Feature requires tabs block - exit if not found
        return;
      }

      const waitForTabs = () => {
        const tabContent = tabsBlock.querySelector('.tab-content-container');
        if (tabContent) {
          setTimeout(async () => {
            if (!isLoaded) {
              const loaded = await loadAndSetupFragment();
              if (loaded && loadedFragment) {
                loadedFragment.style.maxHeight = '0';
                loadedFragment.style.overflow = 'hidden';
              }
            }
          }, 300);
        } else {
          requestAnimationFrame(waitForTabs);
        }
      };
      waitForTabs();
    };
    preloadContent();
  }

  return {
    buttonWrapper,
    toggleButton,
    placeholder,
    shouldScroll: isInDeeplinkHash(section),
    expansionPromise,
  };
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
      const { buttonWrapper, toggleButton, placeholder, shouldScroll, expansionPromise } = result;
      const firstChild = section.children[0];
      if (firstChild && firstChild.nextSibling) {
        section.insertBefore(buttonWrapper, firstChild.nextSibling);
        section.insertBefore(placeholder, buttonWrapper.nextSibling);
      } else if (firstChild) {
        firstChild.insertAdjacentElement('afterend', buttonWrapper);
        buttonWrapper.insertAdjacentElement('afterend', placeholder);
      } else {
        el.parentElement.insertBefore(buttonWrapper, el);
        el.parentElement.insertBefore(placeholder, el);
      }
      if (shouldScroll) {
        // Wait for fragment to fully expand before scrolling to it for layout shift prevention
        if (expansionPromise) {
          await expansionPromise;
        }
        // Phase 1: Immediate scroll to get button visible quickly
        const immediateScroll = () => {
          const rect = toggleButton.getBoundingClientRect();
          const currentPosition = rect.top + window.scrollY;
          const targetScroll = Math.max(0, currentPosition - 88);
          window.scrollTo({ top: targetScroll, behavior: 'instant' });
        };
        setTimeout(immediateScroll, 50);
        // Phase 2: Monitor and refine position as page content loads
        let lastPosition = 0;
        let stableCount = 0;
        let checkCount = 0;
        const maxChecks = 60;
        const refinePosition = () => {
          checkCount += 1;
          const rect = toggleButton.getBoundingClientRect();
          const currentPosition = rect.top + window.scrollY;
          // Check if position has stabilized
          if (Math.abs(currentPosition - lastPosition) < 1) {
            stableCount += 1;
            if (stableCount >= 3) {
              // Position stable for 3 frames, do final smooth scroll if needed
              const currentTop = rect.top;
              if (Math.abs(currentTop - 88) > 5) {
                const targetScroll = Math.max(0, currentPosition - 88);
                window.scrollTo({ top: targetScroll, behavior: 'smooth' });
              }
              toggleButton.setAttribute('data-programmatic-focus', 'true');
              toggleButton.focus({ preventScroll: true });
              toggleButton.addEventListener('blur', () => {
                toggleButton.removeAttribute('data-programmatic-focus');
              }, { once: true });
              return;
            }
          } else {
            stableCount = 0;
            // if position changed significantly, adjust scroll immediately
            if (Math.abs(currentPosition - lastPosition) > 50) {
              const targetScroll = Math.max(0, currentPosition - 88);
              window.scrollTo({ top: targetScroll, behavior: 'instant' });
            }
          }
          lastPosition = currentPosition;
          if (checkCount < maxChecks) {
            requestAnimationFrame(refinePosition);
          }
        };
        setTimeout(() => requestAnimationFrame(refinePosition), 200);
      }
    }
  }

  addListAttrToSection(section);
}
