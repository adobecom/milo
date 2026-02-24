import { DataChunks, series, utils } from '../../deps/rum-distiller.min.js';
import { LOCALES } from '../caas/utils.js';

// Configuration
const API_ENDPOINT = 'https://bundles.aem.page';
const DOMAIN = 'www.adobe.com';
const DOMAIN_KEY = new URL(window.location.href).searchParams.get('domainkey') || '';

const projectsMap = {
  bacom: 'business.adobe.com', // will need another domain key for this
  blog: 'blog.adobe.com', // will need another domain key for this
  helpx: 'helpx.adobe.com', // will need another domain key for this
  news: 'news.adobe.com', // will need another domain key for this
  cc: ['www.adobe.com/creativecloud',
    'www.adobe.com/products',
    'www.adobe.com/solutions',
    'www.adobe.com/ai',
    'www.adobe.com/privacy',
    'www.adobe.com/education',
  ],
  dc: 'www.adobe.com/acrobat',
  express: 'www.adobe.com/express',
  homepage: 'www.adobe.com/',
  genuine: 'www.adobe.com/genuine',
};

const { addCalculatedProps } = utils;
const { pageViews } = series;

/**
 * Determine the locale from a page URL by matching the first
 * path segment against the LOCALES map.
 */
function getLocale(pageUrl) {
  try {
    const u = new URL(pageUrl);
    const firstSegment = u.pathname.split('/').filter(Boolean)[0] || '';
    if (firstSegment in LOCALES) return firstSegment;
    return ''; // default: en-US
  } catch {
    return '';
  }
}

/**
 * Determine the project from a page URL by matching against projectsMap.
 * Supports both string and array patterns. Uses longest-match-wins.
 * Strips the locale prefix (e.g. /au/) from the path before matching,
 * so localized URLs like /au/acrobat/... still match "dc".
 * "homepage" is treated specially: it only matches root URLs
 * (with an optional locale segment, e.g. /de/).
 */
function getProject(pageUrl) {
  try {
    const u = new URL(pageUrl);
    const locale = getLocale(pageUrl);
    // Strip locale prefix so e.g. /au/acrobat/... matches "dc"
    const path = locale
      ? u.pathname.replace(`/${locale}/`, '/')
      : u.pathname;
    const urlString = `${u.hostname}${path}`;
    let matchedProject = null;
    let matchLength = 0;

    for (const [project, patterns] of Object.entries(projectsMap)) {
      if (project === 'homepage') {
        // eslint-disable-next-line no-continue
        continue;
      }
      const list = Array.isArray(patterns) ? patterns : [patterns];
      for (const pattern of list) {
        if (urlString.startsWith(pattern)
          && pattern.length > matchLength) {
          matchedProject = project;
          matchLength = pattern.length;
        }
      }
    }

    // If no specific project matched, check for homepage
    // (root URL with optional locale segment only)
    if (!matchedProject && u.hostname === 'www.adobe.com') {
      const segments = u.pathname.split('/').filter(Boolean);
      const isRoot = segments.length === 0
        || (segments.length === 1 && segments[0] in LOCALES);
      if (isRoot) matchedProject = 'homepage';
    }

    return matchedProject;
  } catch {
    return null;
  }
}

/**
 * Fetch RUM bundles for a single UTC day.
 */
async function fetchUTCDay(utcISOString) {
  const [date] = utcISOString.split('T');
  const datePath = date.split('-').join('/');
  const url = `${API_ENDPOINT}/bundles/${DOMAIN}/${datePath}?domainkey=${DOMAIN_KEY}`;

  console.log(`Fetching ${datePath}...`);
  const resp = await fetch(url);
  if (!resp.ok) {
    console.warn(`Failed to fetch ${datePath}: ${resp.status}`);
    return { date, rumBundles: [] };
  }

  const json = await resp.json();
  const { rumBundles } = json;
  rumBundles.forEach((bundle) => addCalculatedProps(bundle));
  return { date, rumBundles };
}

/**
 * Fetch RUM data for the previous 31 days.
 */
async function fetchPrevious31Days() {
  const date = new Date();
  const promises = [];
  for (let i = 0; i < 31; i += 1) {
    promises.push(fetchUTCDay(date.toISOString()));
    date.setDate(date.getDate() - 1);
  }
  return Promise.all(promises);
}

/**
 * Fetches RUM data for the past 31 days and returns a block usage map.
 *
 * Output JSON structure:
 * {
 *   [blockName]: {                          // CSS selector of the block, e.g. ".marquee"
 *     [project]: {                          // project key from projectsMap, e.g. "cc", "bacom"
 *       [locale]: {                         // locale prefix from URL, e.g. "de", "fr", "" (en-US)
 *         [pageUrl]: <number of views>,     // weighted page views where the block was seen
 *         ...
 *       },
 *       ...
 *     },
 *     ...
 *     "totalViews": {
 *       "views": {
 *         [locale]: <total views for this locale across all projects>,
 *         ...
 *         "allLocales": <total views across all locales and projects>
 *       }
 *     }
 *   }
 * }
 *
 * @returns {Promise<Object>} the block usage map
 */
export default async function getRumData() {
  console.log(`Querying RUM data for ${DOMAIN}...`);

  // 1. Fetch raw data
  const chunks = await fetchPrevious31Days();

  // 2. Load into DataChunks
  const dataChunks = new DataChunks();
  dataChunks.load(chunks);

  console.log(`Loaded ${dataChunks.bundles.length} bundles`);

  // 3. Build block → project → locale → page → views mapping
  const blockMap = {};

  for (const bundle of dataChunks.bundles) {
    const pageUrl = bundle.url;
    const weight = pageViews(bundle);

    if (!weight) continue;

    const project = getProject(pageUrl);
    if (!project) continue;
    const locale = getLocale(pageUrl);

    // Collect unique block names seen in this bundle (skip id selectors and selectors with spaces)
    const blocks = new Set();
    for (const event of bundle.events) {
      if (event.checkpoint === 'viewblock' && event.source
        && event.source.startsWith('.') && !/\s/.test(event.source)) {
        blocks.add(event.source);
      }
    }

    // Accumulate views per block per project per locale per page
    for (const block of blocks) {
      if (!blockMap[block]) blockMap[block] = {};
      if (!blockMap[block][project]) blockMap[block][project] = {};
      if (!blockMap[block][project][locale]) blockMap[block][project][locale] = {};
      const localeMap = blockMap[block][project][locale];
      localeMap[pageUrl] = (localeMap[pageUrl] || 0) + weight;
    }
  }

  // 4. Add totalViews per block
  for (const block of Object.keys(blockMap)) {
    const views = {};
    let allLocales = 0;
    const projects = Object.entries(blockMap[block])
      .filter(([proj]) => proj !== 'totalViews');
    for (const [, locales] of projects) {
      for (const [locale, pages] of Object.entries(locales)) {
        const localeTotal = Object.values(pages)
          .reduce((sum, v) => sum + v, 0);
        views[locale] = (views[locale] || 0) + localeTotal;
        allLocales += localeTotal;
      }
    }
    views.allLocales = allLocales;
    blockMap[block].totalViews = { views };
  }

  // 5. Return the result
  console.log(`Done! Processed ${Object.keys(blockMap).length} blocks`);
  return blockMap;
}
