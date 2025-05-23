import { STATUS, PERFORMANCE_TITLES } from './constants.js';
import { getMetadata } from '../../../utils/utils.js';

const lcpCache = new Map();

function defaultObserveLcp(area) {
  if (area !== document) {
    return Promise.resolve(null);
  }
  return new Promise((resolve) => {
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      if (lastEntry) {
        resolve(lastEntry);
      }
    }).observe({ type: 'largest-contentful-paint', buffered: true });
  });
}

export async function getLcpEntry(url, area, observeLcp = defaultObserveLcp) {
  if (lcpCache.has(url)) {
    return lcpCache.get(url);
  }
  const lcpPromise = observeLcp(area);
  lcpCache.set(url, lcpPromise);
  return lcpPromise;
}

export function checkSingleBlock(area) {
  const firstSection = area.querySelector('main > div.section');
  const hasMultipleBlocks = firstSection && firstSection.childElementCount > 1;
  return {
    title: PERFORMANCE_TITLES.SingleBlock,
    status: hasMultipleBlocks ? STATUS.FAIL : STATUS.PASS,
    description: hasMultipleBlocks
      ? 'First section has more than one block.'
      : 'First section has exactly one block.',
  };
}

export function checkForPersonalization(area) {
  const personalization = getMetadata('personalization', area);
  const target = getMetadata('target', area) === 'on';
  const hasPersonalization = personalization || target;
  return {
    title: PERFORMANCE_TITLES.Personalization,
    status: hasPersonalization ? STATUS.FAIL : STATUS.PASS,
    description: hasPersonalization
      ? 'MEP or Target enabled.'
      : 'Personalization is currently not enabled.',
  };
}

export async function checkLcpEl(url, area, observeLcp) {
  const lcp = await getLcpEntry(url, area, observeLcp);
  if (!lcp) {
    return {
      title: PERFORMANCE_TITLES.Performance,
      status: STATUS.FAIL,
      description: 'No LCP element found.',
    };
  }
  const firstSection = area.querySelector('main > div.section');
  const validLcp = lcp?.element && lcp?.url && firstSection?.contains(lcp.element);
  return {
    title: PERFORMANCE_TITLES.LcpEl,
    status: validLcp ? STATUS.PASS : STATUS.FAIL,
    description: validLcp
      ? 'Valid LCP in the first section detected.'
      : 'No LCP image or video in the first section detected. Please check the page and make sure the first section is your marquee and all the fragments are working properly. If everything is good, ignore the error.',
  };
}

export async function checkImageSize(url, area, observeLcp) {
  const lcp = await getLcpEntry(url, area, observeLcp);
  if (!lcp || !lcp.url || lcp.url.match('media_.*.mp4')) {
    return {
      title: PERFORMANCE_TITLES.ImageSize,
      status: STATUS.EMPTY,
      description: 'No image as LCP element.',
    };
  }
  try {
    const blob = await fetch(lcp.url).then((res) => res.blob());
    const isSizeValid = blob.size / 1024 <= 100;
    return {
      title: PERFORMANCE_TITLES.ImageSize,
      status: isSizeValid ? STATUS.PASS : STATUS.FAIL,
      description: isSizeValid
        ? 'LCP image is less than 100KB.'
        : 'LCP image is over 100KB.',
    };
  } catch (error) {
    return {
      title: PERFORMANCE_TITLES.ImageSize,
      status: STATUS.EMPTY,
      description: 'Could not fetch LCP image.',
    };
  }
}

export async function checkVideoPoster(url, area, observeLcp) {
  const lcp = await getLcpEntry(url, area, observeLcp);
  if (!lcp?.url?.match('media_.*.mp4')) {
    return {
      title: PERFORMANCE_TITLES.VideoPoster,
      status: STATUS.EMPTY,
      description: 'No video as LCP element.',
    };
  }
  const hasPoster = !!lcp.element.poster;
  return {
    title: PERFORMANCE_TITLES.VideoPoster,
    status: hasPoster ? STATUS.PASS : STATUS.FAIL,
    description: hasPoster
      ? 'LCP video has a poster attribute.'
      : 'LCP video has no poster attribute.',
  };
}

export async function checkFragments(url, area, observeLcp) {
  const lcp = await getLcpEntry(url, area, observeLcp);
  if (!lcp?.element) {
    return {
      title: PERFORMANCE_TITLES.Performance,
      status: STATUS.FAIL,
      description: 'No LCP element found.',
    };
  }
  const hasFragments = lcp.element.closest('.fragment') || lcp.element.closest('.section')?.querySelector('[data-path*="fragment"]');
  return {
    title: PERFORMANCE_TITLES.Fragments,
    status: hasFragments ? STATUS.FAIL : STATUS.PASS,
    description: hasFragments
      ? 'Fragments used within the LCP section.'
      : 'No fragments used within the LCP section.',
  };
}

export async function checkPlaceholders(url, area, observeLcp) {
  const lcp = await getLcpEntry(url, area, observeLcp);
  if (!lcp?.element) {
    return {
      title: PERFORMANCE_TITLES.Performance,
      status: STATUS.FAIL,
      description: 'No LCP element found.',
    };
  }
  const section = lcp.element.closest('.section');
  const hasPlaceholders = section?.dataset.hasPlaceholders === 'true';
  return {
    title: PERFORMANCE_TITLES.Placeholders,
    status: hasPlaceholders ? STATUS.FAIL : STATUS.PASS,
    description: hasPlaceholders
      ? 'Placeholders found within the LCP section'
      : 'No placeholders found within the LCP section.',
  };
}

export async function checkIcons(url, area, observeLcp) {
  const lcp = await getLcpEntry(url, area, observeLcp);
  if (!lcp?.element) {
    return {
      title: PERFORMANCE_TITLES.Icons,
      status: STATUS.FAIL,
      description: 'No LCP element found.',
    };
  }
  const hasIcons = lcp.element.closest('.section')?.querySelector('.icon-milo');
  return {
    title: PERFORMANCE_TITLES.Icons,
    status: hasIcons ? STATUS.FAIL : STATUS.PASS,
    description: hasIcons
      ? 'Icons found within the LCP section.'
      : 'No icons found within the LCP section.',
  };
}

export function runChecks(url, area, observeLcp = defaultObserveLcp) {
  return [
    checkLcpEl(url, area, observeLcp),
    checkSingleBlock(area),
    checkImageSize(url, area, observeLcp),
    checkVideoPoster(url, area, observeLcp),
    checkFragments(url, area, observeLcp),
    checkForPersonalization(area),
    checkPlaceholders(url, area, observeLcp),
    checkIcons(url, area, observeLcp),
  ];
}
