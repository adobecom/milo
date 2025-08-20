import { STATUS, SEO_TITLES, SEO_IDS, SEO_DESCRIPTIONS } from './constants.js';
import getServiceConfig from '../../../utils/service-config.js';
import { getConfig, updateConfig } from '../../../utils/utils.js';

const KNOWN_BAD_URLS = ['news.adobe.com'];
const SPIDY_URL_FALLBACK = 'https://spidy.corp.adobe.com';

const linksCache = new Map();

// Wait for footer using onFooterReady callback
function waitForFooter() {
  return new Promise((resolve) => {
    const config = getConfig();
    if (config.footerReady) {
      resolve();
      return;
    }

    const originalCallback = config.onFooterReady;

    config.onFooterReady = async () => {
      if (originalCallback) await originalCallback();
      await window.milo?.deferredPromise;
      config.footerReady = true;
      resolve();
    };

    updateConfig(config);
  });
}

export function checkH1s(area) {
  const h1s = area.querySelectorAll('h1');
  let status;
  let description;

  if (h1s.length === 0) {
    status = STATUS.FAIL;
    description = 'No H1 found on the page. Each page should have exactly one H1 heading.';
  } else if (h1s.length > 1) {
    status = STATUS.FAIL;
    description = `Found ${h1s.length} H1 headings. Each page should have exactly one H1 heading.`;
  } else {
    status = STATUS.PASS;
    description = SEO_DESCRIPTIONS.h1Count;
  }

  return {
    id: SEO_IDS.h1Count,
    title: SEO_TITLES.h1Count,
    status,
    description,
  };
}

export function checkTitle(area) {
  const titleSize = area.title.replace(/\s/g, '').length;
  let status;
  let description;

  if (titleSize < 15) {
    status = STATUS.FAIL;
    description = 'Title size is too short. A title should be at least 15 characters.';
  } else if (titleSize > 70) {
    status = STATUS.FAIL;
    description = 'Title size is too long. A title should not exceed 70 characters.';
  } else {
    status = STATUS.PASS;
    description = SEO_DESCRIPTIONS.title;
  }

  return {
    id: SEO_IDS.title,
    title: SEO_TITLES.title,
    status,
    description,
  };
}

export async function checkCanon(area) {
  const canon = area.querySelector("link[rel='canonical']");
  let status;
  let description;

  if (!canon) {
    status = STATUS.PASS;
    description = 'Canonical is self-referencing.';
  } else {
    const { href } = canon;
    try {
      const resp = await fetch(href, { method: 'HEAD' });
      if (!resp.ok) {
        status = STATUS.FAIL;
        description = 'Reason: Error with canonical reference.';
      } else if (resp.status >= 300 && resp.status <= 308) {
        status = STATUS.FAIL;
        description = 'Reason: Canonical reference redirects';
      } else {
        status = STATUS.PASS;
        description = SEO_DESCRIPTIONS.canonical;
      }
    } catch (e) {
      status = STATUS.LIMBO;
      description = 'Canonical cannot be crawled.';
    }
  }

  return {
    id: SEO_IDS.canonical,
    title: SEO_TITLES.canonical,
    status,
    description,
  };
}

export async function checkDescription(area) {
  const metaDesc = area.querySelector('meta[name="description"]');
  let status;
  let description;

  if (!metaDesc) {
    status = STATUS.FAIL;
    description = 'Reason: No meta description found.';
  } else {
    const descSize = metaDesc.content.replace(/\s/g, '').length;
    if (descSize < 50) {
      status = STATUS.FAIL;
      description = 'Reason: Meta description too short.';
    } else if (descSize > 150) {
      status = STATUS.FAIL;
      description = 'Reason: Meta description too long.';
    } else {
      status = STATUS.PASS;
      description = 'Meta description is good.';
    }
  }

  return {
    id: SEO_IDS.description,
    title: SEO_TITLES.description,
    status,
    description,
  };
}

export async function checkBody(area) {
  const { length } = area.documentElement.innerText.trim();
  let status;
  let description;

  if (length > 100) {
    status = STATUS.PASS;
    description = SEO_DESCRIPTIONS.bodySize;
  } else {
    status = STATUS.FAIL;
    description = 'Reason: Not enough content.';
  }

  return {
    id: SEO_IDS.bodySize,
    title: SEO_TITLES.bodySize,
    status,
    description,
  };
}

export async function checkLorem(area) {
  const { innerHTML } = area.documentElement;
  const htmlWithoutPreflight = innerHTML.replace(area.getElementById('preflight')?.outerHTML, '');
  let status;
  let description;

  if (htmlWithoutPreflight.toLowerCase().includes('lorem ipsum')) {
    status = STATUS.FAIL;
    description = 'Reason: Lorem ipsum is used on the page.';
  } else {
    status = STATUS.PASS;
    description = SEO_DESCRIPTIONS.loremIpsum;
  }

  return {
    id: SEO_IDS.loremIpsum,
    title: SEO_TITLES.loremIpsum,
    status,
    description,
  };
}

function makeGroups(arr, n = 20) {
  const batchSize = Math.ceil(arr.length / n);
  const size = Math.ceil(arr.length / batchSize);
  return Array.from({ length: batchSize }, (v, i) => arr.slice(i * size, i * size + size));
}

export function connectionError() {
  return {
    id: SEO_IDS.links,
    title: SEO_TITLES.links,
    status: STATUS.LIMBO,
    description: 'A VPN connection is required to use the link check service. Please turn on VPN and refresh the page.',
    details: { badLinks: [] },
  };
}

async function spidyCheck(url) {
  try {
    const resp = await fetch(url, { method: 'HEAD' });
    return !!resp.ok;
  } catch (e) {
    window.lana.log(`There was a problem connecting to the link check API ${url}. ${e}`, { tags: 'preflight', errorType: 'i' });
    return false;
  }
}

async function getSpidyResults(url, opts) {
  try {
    const resp = await fetch(`${url}/api/url-http-status`, opts);
    if (!resp.ok) return [];

    const json = await resp.json();
    if (!json.data || json.data.length === 0) return [];

    return json.data.reduce((acc, result) => {
      const status = result.status === 'ECONNREFUSED' ? 503 : result.status;
      if (status >= 399) {
        result.status = status;
        acc.push(result);
      }
      return acc;
    }, []);
  } catch (e) {
    window.lana.log(`There was a problem connecting to the link check API ${url}/api/url-http-status. ${e}`, { tags: 'preflight', errorType: 'i' });
    return [];
  }
}

function compareResults(result, link) {
  const match = link.liveHref === result.url;
  if (!match) return false;
  if (link.closest('header')) link.parent = 'gnav';
  if (link.closest('main')) link.parent = 'main';
  if (link.closest('footer')) link.parent = 'footer';
  link.classList.add('problem-link');
  link.status = result.status;
  link.dataset.status = link.status;
  return true;
}

export async function checkLinks({ area, urlHash, envName }) {
  if (urlHash && linksCache.has(urlHash)) {
    const cachedResult = linksCache.get(urlHash);
    return {
      ...cachedResult,
      details: { ...cachedResult.details, linksChecked: true },
    };
  }

  const { spidy, preflight } = await getServiceConfig(window.location.origin, envName);
  const spidyUrl = spidy?.url || SPIDY_URL_FALLBACK;
  const canSpidy = await spidyCheck(spidyUrl);
  if (!canSpidy) return connectionError();

  /**
   * Find all links with an href.
   * Filter out any local or existing preflight links.
   * Set link to use hlx.live so the service can see them without auth
   * */
  const knownBadUrls = preflight?.ignoreDomains
    ? preflight?.ignoreDomains.split(',').map((url) => url.trim())
    : KNOWN_BAD_URLS;

  const links = [...area.querySelectorAll('a')]
    .filter((link) => {
      if (
        link.href
        && !link.href.includes('local')
        && !link.closest('.preflight')
        && !knownBadUrls.some((url) => url === link.hostname)
      ) {
        link.liveHref = link.href;
        if (link.href.includes('hlx.page')) link.liveHref = link.href.replace('hlx.page', 'hlx.live');
        if (link.href.includes('aem.page')) link.liveHref = link.href.replace('aem.page', 'aem.live');
        return true;
      }
      return false;
    });

  const groups = makeGroups(links);
  const baseOpts = { method: 'POST', headers: { 'Content-Type': 'application/json' } };
  const badResults = [];

  [...area.querySelectorAll('a')].forEach((link) => {
    if (link.dataset?.httpLink) {
      const httpLink = {
        url: link.liveHref,
        status: 'authored as http',
      };
      badResults.push(httpLink);
    }
  });

  for (const group of groups) {
    const urls = group.map((link) => link.liveHref);
    const opts = { ...baseOpts, body: JSON.stringify({ urls }) };
    const spidyResults = await getSpidyResults(spidyUrl, opts);
    badResults.push(...spidyResults);
  }

  const badLinks = badResults.map((result) => links.find((link) => compareResults(result, link)))
    .filter(Boolean);

  const count = badLinks.length;
  const linkText = count > 1 || count === 0 ? 'links' : 'link';
  const status = count > 0 ? STATUS.FAIL : STATUS.PASS;
  const description = status === STATUS.FAIL
    ? `Reason: ${count} problem ${linkText}. Use the list below to fix them.`
    : SEO_DESCRIPTIONS.links;

  const result = {
    id: SEO_IDS.links,
    title: SEO_TITLES.links,
    status,
    description,
    details: { badLinks },
  };

  if (urlHash) {
    linksCache.set(urlHash, result);
  }

  return result;
}

export function runChecks({ url, area = document, envName }) {
  return [
    checkH1s(area),
    checkTitle(area),
    checkCanon(area),
    checkDescription(area),
    checkBody(area),
    checkLorem(area),
    (async () => {
      await waitForFooter();
      return checkLinks({ area, url, envName });
    })(),
  ];
}
