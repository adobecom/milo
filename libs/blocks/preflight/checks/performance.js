import { STATUS, PERFORMANCE_TITLES, PERFORMANCE_IDS, PERFORMANCE_SEVERITIES } from './constants.js';
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
    checkId: PERFORMANCE_IDS.singleBlock,
    severity: PERFORMANCE_SEVERITIES.singleBlock,
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
    checkId: PERFORMANCE_IDS.personalization,
    severity: PERFORMANCE_SEVERITIES.personalization,
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
      checkId: PERFORMANCE_IDS.lcpElement,
      severity: PERFORMANCE_SEVERITIES.lcpElement,
      title: PERFORMANCE_TITLES.Performance,
      status: STATUS.FAIL,
      description: 'No LCP element found.',
    };
  }
  const firstSection = area.querySelector('main > div.section');
  const validLcp = lcp?.element && lcp?.url && firstSection?.contains(lcp.element);
  return {
    checkId: PERFORMANCE_IDS.lcpElement,
    severity: PERFORMANCE_SEVERITIES.lcpElement,
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
      checkId: PERFORMANCE_IDS.imageSize,
      severity: PERFORMANCE_SEVERITIES.imageSize,
      title: PERFORMANCE_TITLES.ImageSize,
      status: STATUS.EMPTY,
      description: 'No image as LCP element.',
    };
  }
  try {
    const blob = await fetch(lcp.url).then((res) => res.blob());
    const isSizeValid = blob.size / 1024 <= 100;
    return {
      checkId: PERFORMANCE_IDS.imageSize,
      severity: PERFORMANCE_SEVERITIES.imageSize,
      title: PERFORMANCE_TITLES.ImageSize,
      status: isSizeValid ? STATUS.PASS : STATUS.FAIL,
      description: isSizeValid
        ? 'LCP image is less than 100KB.'
        : 'LCP image is over 100KB.',
    };
  } catch (error) {
    return {
      checkId: PERFORMANCE_IDS.imageSize,
      severity: PERFORMANCE_SEVERITIES.imageSize,
      title: PERFORMANCE_TITLES.ImageSize,
      status: STATUS.EMPTY,
      description: 'Could not fetch LCP image.',
    };
  }
}

export async function checkVideoPoster(url, area, observeLcp) {
  const lcp = await getLcpEntry(url, area, observeLcp);
  const hasVideoUrl = lcp?.url?.match(/\.mp4/);
  const videoElement = lcp?.element?.closest('video') || lcp?.element?.querySelector('video');
  if (!hasVideoUrl && !videoElement) {
    return {
      checkId: PERFORMANCE_IDS.videoPoster,
      severity: PERFORMANCE_SEVERITIES.videoPoster,
      title: PERFORMANCE_TITLES.VideoPoster,
      status: STATUS.EMPTY,
      description: 'No video as LCP element.',
    };
  }
  const hasPoster = !!videoElement?.poster;
  return {
    checkId: PERFORMANCE_IDS.videoPoster,
    severity: PERFORMANCE_SEVERITIES.videoPoster,
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
      checkId: PERFORMANCE_IDS.fragments,
      severity: PERFORMANCE_SEVERITIES.fragments,
      title: PERFORMANCE_TITLES.Performance,
      status: STATUS.FAIL,
      description: 'No LCP element found.',
    };
  }
  const fragmentElements = Array.from(area.querySelectorAll('.fragment'));
  if (fragmentElements.length === 0) {
    return {
      checkId: PERFORMANCE_IDS.fragments,
      severity: PERFORMANCE_SEVERITIES.fragments,
      title: PERFORMANCE_TITLES.Fragments,
      status: STATUS.PASS,
      description: 'No fragments on the page.',
    };
  }
  const lcpInFragment = fragmentElements.some((f) => f.contains(lcp.element));
  return {
    checkId: PERFORMANCE_IDS.fragments,
    severity: PERFORMANCE_SEVERITIES.fragments,
    title: PERFORMANCE_TITLES.Fragments,
    status: lcpInFragment ? STATUS.FAIL : STATUS.PASS,
    description: lcpInFragment
      ? 'LCP element is in a fragment. This can cause performance issues.'
      : 'No fragments contain the LCP element.',
  };
}

export async function checkPlaceholders(url, area, observeLcp) {
  const lcp = await getLcpEntry(url, area, observeLcp);
  const placeholderElements = Array.from(area.querySelectorAll('[data-placeholder-content]'));

  let status;
  let description;

  if (!lcp?.element) {
    status = STATUS.FAIL;
    description = 'No LCP element found.';
  } else if (placeholderElements.length === 0) {
    status = STATUS.PASS;
    description = 'No placeholders on the page.';
  } else {
    const lcpInPlaceholder = placeholderElements.some((p) => p.contains(lcp.element));
    status = lcpInPlaceholder ? STATUS.FAIL : STATUS.PASS;
    description = lcpInPlaceholder
      ? 'LCP element contains placeholders. This can cause performance issues.'
      : 'No placeholders in the LCP element.';
  }

  return {
    checkId: PERFORMANCE_IDS.placeholders,
    severity: PERFORMANCE_SEVERITIES.placeholders,
    title: placeholderElements.length === 0
      ? PERFORMANCE_TITLES.Placeholders : PERFORMANCE_TITLES.Placeholders,
    status,
    description,
  };
}

export async function checkIcons(url, area, observeLcp) {
  const lcp = await getLcpEntry(url, area, observeLcp);
  const iconElements = Array.from(area.querySelectorAll('.icon'));

  let status;
  let description;

  if (!lcp?.element) {
    status = STATUS.FAIL;
    description = 'No LCP element found.';
  } else if (iconElements.length === 0) {
    status = STATUS.PASS;
    description = 'No icons on the page.';
  } else {
    const lcpContainsIcons = iconElements.some((i) => lcp.element.contains(i));
    status = lcpContainsIcons ? STATUS.FAIL : STATUS.PASS;
    description = lcpContainsIcons
      ? 'LCP element contains icons. This can cause performance issues.'
      : 'No icons in the LCP element.';
  }

  return {
    checkId: PERFORMANCE_IDS.icons,
    severity: PERFORMANCE_SEVERITIES.icons,
    title: PERFORMANCE_TITLES.Icons,
    status,
    description,
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
