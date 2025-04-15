import { STATUS, SEO_TITLES } from './constants.js';
import getServiceConfig from '../../../utils/service-config.js';

const KNOWN_BAD_URLS = ['news.adobe.com'];
const SPIDY_URL_FALLBACK = 'https://spidy.corp.adobe.com';

const linksCache = new Map();

export function checkH1s() {
  const h1s = document.querySelectorAll('h1');
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
    description = 'Found exactly one H1 heading.';
  }

  return {
    title: SEO_TITLES.H1Count,
    status,
    description,
  };
}

export function checkTitle() {
  const titleSize = document.title.replace(/\s/g, '').length;
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
    description = 'Title size is appropriate.';
  }

  return {
    title: SEO_TITLES.TitleSize,
    status,
    description,
  };
}

export async function checkCanon() {
  const canon = document.querySelector("link[rel='canonical']");
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
        description = 'Canonical reference is valid.';
      }
    } catch (e) {
      status = STATUS.LIMBO;
      description = 'Canonical cannot be crawled.';
    }
  }

  return {
    title: SEO_TITLES.Canonical,
    status,
    description,
  };
}

export async function checkDescription() {
  const metaDesc = document.querySelector('meta[name="description"]');
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
    title: SEO_TITLES.MetaDescription,
    status,
    description,
  };
}

export async function checkBody() {
  const { length } = document.documentElement.innerText;
  let status;
  let description;

  if (length > 100) {
    status = STATUS.PASS;
    description = 'Body content has a good length.';
  } else {
    status = STATUS.FAIL;
    description = 'Reason: Not enough content.';
  }

  return {
    title: SEO_TITLES.BodySize,
    status,
    description,
  };
}

export async function checkLorem() {
  const { innerHTML } = document.documentElement;
  const htmlWithoutPreflight = innerHTML.replace(document.getElementById('preflight')?.outerHTML, '');
  let status;
  let description;

  if (htmlWithoutPreflight.toLowerCase().includes('lorem ipsum')) {
    status = STATUS.FAIL;
    description = 'Reason: Lorem ipsum is used on the page.';
  } else {
    status = STATUS.PASS;
    description = 'No Lorem ipsum is used on the page.';
  }

  return {
    title: SEO_TITLES.Lorem,
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
    title: SEO_TITLES.Links,
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

export async function checkLinks(urlHash) {
  if (urlHash && linksCache.has(urlHash)) {
    const cachedResult = linksCache.get(urlHash);
    return {
      ...cachedResult,
      details: { ...cachedResult.details, linksChecked: true },
    };
  }

  const { spidy, preflight } = await getServiceConfig(window.location.origin);
  // Check to see if Spidy is available.
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

  const links = [...document.querySelectorAll('a')]
    .filter((link) => {
      if (
        link.href // Has an href tag
        && !link.href.includes('local') // Is not a local link
        && !link.closest('.preflight') // Is not inside preflight
        && !knownBadUrls.some((url) => url === link.hostname) // Is not a known bad url
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

  [...document.querySelectorAll('a')].forEach((link) => {
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

  // Format the results for display
  const count = badLinks.length;
  const linkText = count > 1 || count === 0 ? 'links' : 'link';
  const status = count > 0 ? STATUS.FAIL : STATUS.PASS;
  const description = status === STATUS.FAIL
    ? `Reason: ${count} problem ${linkText}. Use the list below to fix them.`
    : 'Links are valid.';

  // Build the result display object
  const result = {
    title: SEO_TITLES.Links,
    status,
    description,
    details: { badLinks },
  };

  if (urlHash) {
    linksCache.set(urlHash, result);
  }

  return result;
}

export function runChecks(url) {
  return [
    checkH1s(),
    checkTitle(),
    checkCanon(),
    checkDescription(),
    checkBody(),
    checkLorem(),
    checkLinks(url),
  ];
}
