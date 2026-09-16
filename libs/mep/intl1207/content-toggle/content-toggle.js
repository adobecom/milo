import { createTag, loadBlock } from '../../../utils/utils.js';

const DEFAULT_MOUNT_MARKER = '[content-toggle]';
const IDLE_TIMEOUT_MS = 4000;
const IDLE_FALLBACK_DELAY_MS = 2000;

const revealPromises = new WeakMap();

function toClassName(name) {
  return name && typeof name === 'string'
    ? name.toLowerCase().replace(/[^0-9a-z]/gi, '-')
    : '';
}

function stripDescription(value) {
  return typeof value === 'string' ? value.replace(/\s*\([^)]*\)\s*$/, '').trim() : value;
}

function addTempWrapperDeprecated($block, blockName) {
  const wrapper = document.createElement('div');
  const parent = $block.parentElement;
  wrapper.classList.add(`${blockName}-wrapper`);
  parent.insertBefore(wrapper, $block);
  wrapper.append($block);
}

function readBlockConfig(block) {
  const config = {};
  block.querySelectorAll(':scope>div').forEach(($row) => {
    if ($row.children) {
      const $cols = [...$row.children];
      if ($cols[1]) {
        const $value = $cols[1];
        const name = toClassName($cols[0].textContent.trim());
        let value;
        if ($value.querySelector('a')) {
          const $as = [...$value.querySelectorAll('a')];
          if ($as.length === 1) {
            value = $as[0].href;
          } else {
            value = $as.map(($a) => $a.href);
          }
        } else if ($value.querySelector('p')) {
          const $ps = [...$value.querySelectorAll('p')];
          if ($ps.length === 1) {
            value = $ps[0].textContent.trim();
          } else {
            value = $ps.map(($p) => $p.textContent.trim());
          }
        } else value = $row.children[1].textContent.trim();
        config[name] = value;
      }
    }
  });
  return config;
}

function decorateButton($block, $toggle, position) {
  const $button = createTag('button', { class: 'content-toggle-button' });
  const tagText = $toggle.textContent.trim().match(/\[(.*?)\]/);

  if (tagText) {
    const [fullText, tagTextContent] = tagText;
    const $tag = createTag('span', { class: 'tag' });
    $button.textContent = $toggle.textContent.trim().replace(fullText, '').trim();
    $tag.textContent = tagTextContent;
    $button.append($tag);
  } else {
    $button.textContent = $toggle.textContent.trim();
  }
  $button.dataset.text = $button.textContent.toLowerCase();
  $button.dataset.toggleId = String(position);
  $block.append($button);
}

function getButtonMatchValues($button) {
  return new Set([$button.dataset.toggleId, $button.dataset.text]);
}

function sectionMatchesButton($section, matchValues) {
  const value = $section.dataset.toggle?.toLowerCase();
  return value ? matchValues.has(value) : false;
}

function getColourScheme(config, $block) {
  const value = (config['colour-scheme'] || '').toLowerCase();
  if (value === 'dark') return 'dark';
  if (value === 'light') return 'light';
  return $block.classList.contains('dark') ? 'dark' : 'light';
}

function extractHeadingElement($toggleContainer) {
  const prev = $toggleContainer.previousElementSibling;
  return prev && prev.textContent.trim() ? prev : null;
}

function splitHeadingIntoLines($heading) {
  const lines = [];
  let current = createTag('span', { class: 'content-toggle-heading-line' });
  [...$heading.childNodes].forEach((node) => {
    if (node.nodeName === 'BR') {
      if (current.childNodes.length) lines.push(current);
      current = createTag('span', { class: 'content-toggle-heading-line' });
      node.remove();
    } else {
      current.append(node);
    }
  });
  if (current.childNodes.length) lines.push(current);
  $heading.append(...lines);
}

function getDefaultToggleIndex($block, config, $buttons) {
  const defaultLabel = stripDescription(config['default-toggle'] || '').toLowerCase().trim();
  if (defaultLabel) {
    const matchIndex = [...$buttons]
      .findIndex((btn) => getButtonMatchValues(btn).has(defaultLabel));
    if (matchIndex !== -1) return matchIndex;
  }
  const defaultClass = Array.from($block.classList).find((cls) => /^default-\d+$/.test(cls));
  if (defaultClass) return parseInt(defaultClass.split('-')[1], 10) - 1;
  return 0;
}

function deferSectionBlocks($section) {
  if ($section.dataset.status !== 'pending') {
    window.lana?.log(`content-toggle: could not defer section (status="${$section.dataset.status}") — already processed by loadArea`, { tags: 'content-toggle', severity: 'warning' });
    return;
  }
  $section.querySelectorAll(':scope > div[class]:not(.content)').forEach((div) => {
    if (div.dataset.deferredClass) return;
    div.dataset.deferredClass = div.className;
    div.removeAttribute('class');
  });
  $section.querySelectorAll(':scope > p > a[href*="/fragments/"], :scope > a[href*="/fragments/"]').forEach((a) => {
    if (a.dataset.deferredHref) return;
    a.dataset.deferredHref = a.href;
    a.removeAttribute('href');
  });
}

function revealSection($section) {
  if (!revealPromises.has($section)) {
    revealPromises.set($section, (async () => {
      const deferredBlocks = [...$section.querySelectorAll(':scope > div[data-deferred-class]')];
      const deferredFragments = [...$section.querySelectorAll('a[data-deferred-href]')];
      await Promise.all([
        ...deferredBlocks.map(async (div) => {
          div.className = div.dataset.deferredClass;
          delete div.dataset.deferredClass;
          await loadBlock(div);
        }),
        ...deferredFragments.map(async (a) => {
          a.href = a.dataset.deferredHref;
          delete a.dataset.deferredHref;
          a.classList.add('fragment', 'link-block');
          await loadBlock(a);
        }),
      ]);
    })());
  }
  return revealPromises.get($section);
}

function scheduleIdlePrefetch($sections, defaultIndex) {
  const inactive = [...$sections].filter((_, i) => i !== defaultIndex);
  if (!inactive.length) return;
  const prefetch = () => inactive.forEach((section) => revealSection(section));
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(prefetch, { timeout: IDLE_TIMEOUT_MS });
  } else {
    setTimeout(prefetch, IDLE_FALLBACK_DELAY_MS);
  }
}

function getStickyHeaderOffset() {
  const selectors = [
    'header.gnav', 'header.global-navigation', '.feds-localnav', '.feds-promo-aside-wrapper',
  ];
  return selectors.reduce((max, selector) => {
    const el = document.querySelector(selector);
    if (!el) return max;
    return Math.max(max, el.getBoundingClientRect().bottom);
  }, 0);
}

function getUntaggedToggleValue(config) {
  const value = config['untagged-sections'];
  return value ? stripDescription(value).toLowerCase().trim() : null;
}

function getTopLevelSection($enclosingMain, el) {
  let node = el.closest('.section');
  while (node && node.parentElement !== $enclosingMain) {
    node = node.parentElement?.closest('.section');
  }
  return node;
}

function isSubstantivelyEmpty(section) {
  if (section.textContent.trim() !== '') return false;
  if (section.querySelector('img, video, picture, svg, iframe')) return false;
  const hasPendingFragment = [...section.querySelectorAll('.fragment')]
    .some((fragment) => fragment.children.length === 0);
  return !hasPendingFragment;
}

function tagUntaggedSections($enclosingMain, ownTopLevelSection, untaggedValue) {
  if (!untaggedValue) return;
  $enclosingMain.querySelectorAll(':scope > .section').forEach((section) => {
    if (section === ownTopLevelSection) return;
    if (section.children.length === 0) return;
    if (section.dataset.toggle || section.querySelector('[data-toggle]')) return;
    section.dataset.toggle = untaggedValue;
    section.dataset.toggleUntagged = 'true';
  });
}

function getScrollMode(config) {
  const value = (config['scroll-on-toggle'] || '').toLowerCase();
  if (value === 'top') return 'top';
  if (value.startsWith('matched')) return 'matched';
  return 'none';
}

function getDeviceSections($sections, matchValues) {
  const topLevel = [...$sections].filter((s) => sectionMatchesButton(s, matchValues));
  return topLevel.flatMap((section) => {
    const fragmentSections = [...section.querySelectorAll('.fragment > .section')];
    return fragmentSections.length ? fragmentSections : [section];
  });
}

function getCurrentSectionIndex(units) {
  const headerOffset = getStickyHeaderOffset();
  let index = 0;
  units.forEach((unit, i) => {
    if (unit.getBoundingClientRect().top <= headerOffset + 1) index = i;
  });
  return index;
}

function scrollToSectionIndex(units, index) {
  const target = units[Math.min(index, units.length - 1)];
  if (!target) return;
  const top = target.getBoundingClientRect().top + window.scrollY - getStickyHeaderOffset();
  window.scrollTo({ top, behavior: 'smooth' });
}

function initButton($block, $sections, index, opts) {
  const { mountToggle, defaultIndex, stickyState, scrollMode, toggleState } = opts;
  const $enclosingMain = $block.closest('main');

  if ($enclosingMain) {
    const $buttons = $block.querySelectorAll('.content-toggle-button');
    const setActiveButton = (newIndex) => {
      $block.querySelectorAll('.content-toggle-button').forEach(($btn) => $btn.classList.remove('active'));
      $buttons[newIndex].classList.add('active');
    };

    if (index === defaultIndex) {
      setActiveButton(index);
    }

    $buttons[index].addEventListener('click', async () => {
      const $activeButton = $block.querySelector('button.active');

      if ($activeButton !== $buttons[index]) {
        stickyState.engaged = true;
        stickyState.forcePin?.();
        const incomingMatchValues = getButtonMatchValues($buttons[index]);
        toggleState.activeLabel = incomingMatchValues;
        const outgoingMatchValues = $activeButton ? getButtonMatchValues($activeButton) : null;
        const sourceIndex = scrollMode === 'matched' && outgoingMatchValues
          ? getCurrentSectionIndex(getDeviceSections($sections, outgoingMatchValues))
          : 0;

        setActiveButton(index);
        const matchingSections = [...$sections]
          .filter(($section) => sectionMatchesButton($section, incomingMatchValues));
        await Promise.all([...$sections].map(async ($section) => {
          if (matchingSections.includes($section)) {
            await revealSection($section);
            $section.style.display = 'block';
          } else {
            $section.style.display = 'none';
          }
        }));
        mountToggle(matchingSections);

        if (scrollMode !== 'none') {
          scrollToSectionIndex(getDeviceSections($sections, incomingMatchValues), sourceIndex);
        }
      }
    });
  }
}

function decorateSectionMetadata(section) {
  const metadataDiv = section.querySelector(':scope > .section-metadata');

  if (metadataDiv) {
    const meta = readBlockConfig(metadataDiv);
    const keys = Object.keys(meta);
    keys.forEach((key) => {
      if (!['style', 'anchor', 'background'].includes(key)) {
        const value = key === 'toggle' ? stripDescription(meta[key]) : meta[key];
        section.setAttribute(`data-${key}`, value);
      }
    });
  }
}

function decorateSectionsMetadata() {
  const sections = document.querySelectorAll('.section');
  sections.forEach(decorateSectionMetadata);
}

function isStickyPositioned($section) {
  const { position } = getComputedStyle($section);
  return position === 'fixed' || position === 'sticky';
}

function releaseUnreliableAncestor(trackedAncestor, $sections) {
  delete trackedAncestor.dataset.toggle;
  delete trackedAncestor.dataset.toggleUntagged;
  trackedAncestor.style.display = '';
  const idx = $sections.indexOf(trackedAncestor);
  if (idx !== -1) $sections.splice(idx, 1);
}

function findReliableAncestorToggle($section) {
  const ancestor = $section.parentElement?.closest('[data-toggle]');
  if (!ancestor || ancestor.dataset.toggleUntagged) return undefined;
  return ancestor.dataset.toggle;
}

function tagLateSection(
  $section,
  $sections,
  toggleState,
  relocatedToggle,
  untaggedValue,
) {
  if ($section.dataset.toggle || $sections.includes($section)) return;

  const trackedAncestor = $sections.find((tracked) => tracked.contains($section));
  const ancestorIsReliable = trackedAncestor && !trackedAncestor.dataset.toggleUntagged;
  const empty = $section.children.length === 0;

  if (empty && trackedAncestor && !ancestorIsReliable) {
    releaseUnreliableAncestor(trackedAncestor, $sections);
  }
  if (empty) return;
  if (ancestorIsReliable && !isStickyPositioned($section)) return;

  decorateSectionMetadata($section);
  if ($section.dataset.toggle && trackedAncestor && !ancestorIsReliable) {
    releaseUnreliableAncestor(trackedAncestor, $sections);
  }
  const hasNestedTag = [...$section.querySelectorAll('.section-metadata, [data-toggle]')]
    .some((el) => el.parentElement !== $section);
  const isFragmentContent = $section.parentElement?.classList.contains('fragment');
  if (!$section.dataset.toggle) {
    const ancestorToggle = ancestorIsReliable ? trackedAncestor?.dataset.toggle : undefined;
    const inherited = ancestorToggle
      || findReliableAncestorToggle($section)
      || relocatedToggle
      || (hasNestedTag || !isFragmentContent ? undefined : untaggedValue);
    if (inherited) {
      $section.dataset.toggle = inherited;
      $section.dataset.toggleUntagged = 'true';
    }
  }
  if (!$section.dataset.toggle) return;
  $sections.push($section);
  if (!sectionMatchesButton($section, toggleState.activeLabel)) {
    $section.style.display = 'none';
  }
}

function watchForLateSections(
  $enclosingMain,
  $sections,
  toggleState,
  untaggedValue,
) {
  const observer = new MutationObserver((mutations) => {
    const relocatedToggle = new Map();
    mutations.forEach(({ target, removedNodes }) => {
      removedNodes.forEach((node) => {
        if (node.nodeType !== Node.ELEMENT_NODE) return;
        const ancestorToggle = target.closest?.('[data-toggle]')?.dataset.toggle;
        if (ancestorToggle) relocatedToggle.set(node, ancestorToggle);
      });
    });
    mutations.forEach(({ addedNodes }) => {
      addedNodes.forEach((node) => {
        if (node.nodeType !== Node.ELEMENT_NODE) return;
        if (node.matches('.section')) {
          tagLateSection(
            node,
            $sections,
            toggleState,
            relocatedToggle.get(node),
            untaggedValue,
          );
        }
        node.querySelectorAll?.('.section').forEach(($s) => {
          tagLateSection(
            $s,
            $sections,
            toggleState,
            relocatedToggle.get($s),
            untaggedValue,
          );
        });
      });
    });
    [...$sections].forEach((section) => {
      if (section.dataset.toggleUntagged && isSubstantivelyEmpty(section)) {
        releaseUnreliableAncestor(section, $sections);
      }
    });
  });
  observer.observe($enclosingMain, { childList: true, subtree: true });
  return observer;
}

function waitForMarqueeHeight(marqueeSelector) {
  return new Promise((resolve) => {
    function check() {
      const marquees = document.querySelectorAll(marqueeSelector);
      for (const marquee of marquees) {
        const { height } = marquee.getBoundingClientRect();
        if (height > 0) {
          resolve(height);
          return;
        }
      }
      requestAnimationFrame(check);
    }
    check();
  });
}

function findMountMarker(root, markerText) {
  return [...root.querySelectorAll('*')]
    .find((el) => el.children.length === 0 && el.textContent.trim() === markerText);
}

function toClassSelector(className) {
  return `.${className.replace(/^\./, '')}`;
}

function resolveMountTarget($section, config) {
  const selector = (config['marquee-class'] && toClassSelector(config['marquee-class']))
    || config['mount-target']
    || '[class*="marquee"]';
  return $section.querySelector(selector);
}
function resolveMarkerFor($section, config) {
  if (!(config['mount-target'] || config['mount-marker'] || config['marquee-class'])) return null;
  const marqueeRoot = resolveMountTarget($section, config);
  if (!marqueeRoot) return null;
  const markerText = config['mount-marker'] || DEFAULT_MOUNT_MARKER;
  return findMountMarker(marqueeRoot, markerText);
}

function resolveMarkerForGroup($sections, config, $enclosingMain) {
  const scoped = $sections.map((section) => resolveMarkerFor(section, config)).find(Boolean);
  return scoped || resolveMarkerFor($enclosingMain, config);
}

function relocateToggleWrapper(toggleWrapper, marker) {
  if (!marker) return null;

  marker.classList.add('content-toggle-marker');
  marker.after(toggleWrapper);
  toggleWrapper.classList.add('embedded');

  let healing = false;
  const observer = new MutationObserver(() => {
    if (healing) return;
    if (marker.nextElementSibling === toggleWrapper) return;
    healing = true;
    marker.after(toggleWrapper);
    healing = false;
  });
  observer.observe(marker.parentElement, { childList: true });

  return observer;
}

function getStickyMode(config, $block) {
  const value = (config['sticky-behaviour'] || '').toLowerCase();
  if (value === 'always') return 'always';
  if (value === 'snap') return 'snap';
  if (value === 'sticky') return 'sticky';
  if (value === 'pinned') return 'pinned';
  if (!value) {
    if ($block.classList.contains('sticky-pinned')) return 'pinned';
    if ($block.classList.contains('sticky')) return 'sticky';
  }
  return null;
}

function createStickyPlaceholder(toggleWrapper, size) {
  const { width, height } = size || toggleWrapper.getBoundingClientRect();
  const safeWidth = Math.min(width, document.documentElement.clientWidth);
  const el = document.createElement('div');
  el.setAttribute('aria-hidden', 'true');
  el.style.cssText = `display: block; width: ${safeWidth}px; height: ${height}px; min-width: ${safeWidth}px; min-height: ${height}px; flex-shrink: 0;`;
  toggleWrapper.after(el);
  return el;
}

function syncPlaceholderWidth(placeholder) {
  const width = `${document.documentElement.clientWidth}px`;
  placeholder.style.width = width;
  placeholder.style.minWidth = width;
}

function waitForRenderedSize(el) {
  return new Promise((resolve) => {
    function check() {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        resolve(rect);
        return;
      }
      requestAnimationFrame(check);
    }
    check();
  });
}

function setupAlwaysFixedBehaviour(toggleWrapper, ownTopLevelSection, $enclosingMain) {
  let ticking = false;
  const applyOffset = () => {
    ticking = false;
    if (!toggleWrapper.classList.contains('fixed')) return;
    toggleWrapper.setAttribute('style', `top: ${getStickyHeaderOffset()}px; display: block;`);
  };

  waitForRenderedSize(toggleWrapper).then(() => {
    $enclosingMain.append(toggleWrapper);
    toggleWrapper.classList.add('fixed');
    ownTopLevelSection.style.display = 'none';
    applyOffset();
  });

  const requestUpdate = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(applyOffset);
  };
  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);
}
function setupSnapBehaviour(
  toggleWrapper,
  stickyState,
  mountState,
  $enclosingMain,
  marqueeSelector,
) {
  let ticking = false;
  let initialOffset;

  waitForMarqueeHeight(marqueeSelector).then(() => {
    initialOffset = toggleWrapper.getBoundingClientRect().top + window.scrollY;
  });

  const pinNow = () => {
    if (stickyState.isPinned) return;
    mountState.observer?.disconnect();
    mountState.observer = null;
    $enclosingMain.append(toggleWrapper);
    toggleWrapper.classList.add('fixed');
    toggleWrapper.setAttribute('style', `top: ${getStickyHeaderOffset()}px; display: block;`);
    stickyState.isPinned = true;
  };

  const applyStickyState = () => {
    ticking = false;
    if (stickyState.isPinned) {
      toggleWrapper.setAttribute('style', `top: ${getStickyHeaderOffset()}px; display: block;`);
      return;
    }
    if (initialOffset === undefined) return;
    const liveRect = toggleWrapper.getBoundingClientRect();
    if (liveRect.width > 0 && liveRect.height > 0) {
      initialOffset = liveRect.top + window.scrollY;
    }
    const shouldPin = window.scrollY >= initialOffset - getStickyHeaderOffset() - 6;
    if (shouldPin) pinNow();
  };

  const requestUpdate = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(applyStickyState);
  };
  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);

  stickyState.forcePin = pinNow;
}

function setupStickyBehaviour(toggleWrapper, mode, stickyState, marqueeSelector) {
  let isFixed = false;
  let ticking = false;
  let placeholder = null;
  let lastKnownSize = null;

  let initialOffset;
  waitForMarqueeHeight(marqueeSelector).then(() => {
    initialOffset = toggleWrapper.getBoundingClientRect().top + window.scrollY;
  });

  const createPlaceholder = () => createStickyPlaceholder(toggleWrapper, lastKnownSize);

  const applyStickyState = () => {
    ticking = false;
    const headerOffset = getStickyHeaderOffset();

    if (isFixed) {
      if (!placeholder || !placeholder.isConnected) placeholder = createPlaceholder();
      syncPlaceholderWidth(placeholder);
      toggleWrapper.setAttribute('style', `top: ${headerOffset}px`);
    } else {
      const liveRect = toggleWrapper.getBoundingClientRect();
      if (liveRect.width > 0 && liveRect.height > 0) {
        lastKnownSize = { width: liveRect.width, height: liveRect.height };
        initialOffset = liveRect.top + window.scrollY;
      }
    }

    const shouldPin = initialOffset !== undefined
      && window.scrollY >= initialOffset - headerOffset - 6;

    if (shouldPin && !isFixed) {
      placeholder = createPlaceholder();
      toggleWrapper.classList.add('fixed');
      toggleWrapper.setAttribute('style', `top: ${headerOffset}px`);
      isFixed = true;
    } else if (!shouldPin && isFixed && (mode !== 'pinned' || !stickyState.engaged)) {
      toggleWrapper.classList.remove('fixed');
      toggleWrapper.removeAttribute('style');
      placeholder?.remove();
      placeholder = null;
      isFixed = false;
    }
  };

  const requestUpdate = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(applyStickyState);
  };
  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);
}

export default async function decorate(block) {
  addTempWrapperDeprecated(block, 'content-toggle');
  const toggleWrapper = block.parentElement;
  const config = readBlockConfig(block);
  decorateSectionsMetadata();
  const ownSection = block.closest('.section');
  config['mount-target'] ||= ownSection?.dataset.mountTarget;
  config['mount-marker'] ||= ownSection?.dataset.mountMarker;
  config['marquee-class'] ||= ownSection?.dataset.marqueeClass;
  const marqueeSelector = config['marquee-class']
    ? toClassSelector(config['marquee-class']) : '[class*="marquee"]';

  const $enclosingMain = block.closest('main');
  if ($enclosingMain) {
    const ownTopLevelSection = getTopLevelSection($enclosingMain, block);
    const untaggedValue = getUntaggedToggleValue(config);
    tagUntaggedSections($enclosingMain, ownTopLevelSection, untaggedValue);
    const $sections = [...$enclosingMain.querySelectorAll('[data-toggle]')];
    const $toggleContainer = block.querySelector('ul');
    const $heading = extractHeadingElement($toggleContainer);

    block.classList.toggle('dark', getColourScheme(config, block) === 'dark');
    block.innerHTML = '';

    if ($heading) {
      $heading.classList.add('content-toggle-heading');
      splitHeadingIntoLines($heading);
      toggleWrapper.insertBefore($heading, block);
    }

    const stickyMode = getStickyMode(config, block);
    const stickyState = { engaged: false };
    const mountState = { observer: null };
    const mountToggle = stickyMode === 'always'
      ? (activeSections) => resolveMarkerForGroup(activeSections, config, $enclosingMain)?.classList.add('content-toggle-marker')
      : (activeSections) => {
        if (stickyState.isPinned) {
          resolveMarkerForGroup(activeSections, config, $enclosingMain)?.classList.add('content-toggle-marker');
          return;
        }
        const marker = resolveMarkerForGroup(activeSections, config, $enclosingMain);
        const observer = relocateToggleWrapper(toggleWrapper, marker);
        if (observer) {
          mountState.observer?.disconnect();
          mountState.observer = observer;
          ownTopLevelSection.style.display = 'none';
        } else if (config['mount-target'] || config['mount-marker'] || config['marquee-class']) {
          window.lana?.log('content-toggle: mount marker not found in the newly active section — leaving wrapper in its previous position', { tags: 'content-toggle', severity: 'warning' });
        }
      };

    Array.from($toggleContainer.children).forEach(($toggle, index) => {
      decorateButton(block, $toggle, index + 1);
    });

    const $buttons = block.querySelectorAll('.content-toggle-button');
    const defaultIndex = getDefaultToggleIndex(block, config, $buttons);
    const defaultMatchValues = getButtonMatchValues($buttons[defaultIndex]);
    const toggleState = { activeLabel: defaultMatchValues };
    const scrollMode = getScrollMode(config);

    const buttonOpts = { mountToggle, defaultIndex, stickyState, scrollMode, toggleState };
    Array.from($toggleContainer.children).forEach((_, index) => {
      initButton(block, $sections, index, buttonOpts);
    });

    const defaultSections = [];
    $sections.forEach(($section) => {
      if (sectionMatchesButton($section, defaultMatchValues)) {
        defaultSections.push($section);
      } else {
        $section.style.display = 'none';
        deferSectionBlocks($section);
      }
    });

    mountToggle(defaultSections);

    if (stickyMode === 'always') {
      block.classList.add('sticky');
      setupAlwaysFixedBehaviour(toggleWrapper, ownTopLevelSection, $enclosingMain);
    } else if (stickyMode === 'snap') {
      block.classList.add('sticky');
      setupSnapBehaviour(toggleWrapper, stickyState, mountState, $enclosingMain, marqueeSelector);
    } else if (stickyMode) {
      block.classList.add('sticky');
      setupStickyBehaviour(toggleWrapper, stickyMode, stickyState, marqueeSelector);
    }
    scheduleIdlePrefetch($sections, defaultIndex);
    watchForLateSections($enclosingMain, $sections, toggleState, untaggedValue);
  }
}
