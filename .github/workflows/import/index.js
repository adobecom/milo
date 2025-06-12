import { DA_ORIGIN, AEM_ORIGIN } from './constants.js';
import { replaceHtml, daFetch } from './daFetch.js';
import { mdToDocDom, docDomToAemHtml } from './converters.js';
import { JSDOM } from 'jsdom';

// Run from the root of the project for local testing: node --env-file=.env .github/workflows/import/index.js
const EXTS = ['json', 'svg', 'png', 'jpg', 'jpeg', 'gif', 'mp4', 'pdf'];

const ROLLING_IMPORT_ENABLE_DEBUG_LOGS = process.env.ROLLING_IMPORT_ENABLE_DEBUG_LOGS;
const toOrg = "adobecom";
const toRepo = process.env.ROLLING_IMPORT_REPO;
const importFrom = process.env.ROLLING_IMPORT_IMPORT_FROM;
const liveDomain = process.env.ROLLING_IMPORT_LIVE_DOMAIN;
const excludedFiles = [
  '/redirects.json',
  '/metadata.json',
  '/metadata-seo.json',
];
const LINK_SELECTORS = [
  'a[href*="/fragments/"]',
  'a[href*=".mp4"]',
  'a[href*=".pdf"]',
  'a[href*=".svg"]',
  'img[alt*=".mp4"]',
];
// For any case where we need to find SVGs outside of any elements // in their text.
const LINK_SELECTOR_REGEX = /https:\/\/[^"'\s]+\.svg/g;

export function calculateTime(startTime) {
  const totalTime = Date.now() - startTime;
  return `${String(totalTime / 1000 / 60).substring(0, 4)}`;
}

async function importMedia(pageUrl, text, importedMedia) {
  if (importedMedia.has(pageUrl.pathname)) {
    if (ROLLING_IMPORT_ENABLE_DEBUG_LOGS)
      console.log(`Skipping ${pageUrl.pathname} as it's already imported`);
    return;
  }

  const aemLessOrigin = pageUrl.origin.split('.')[0];
  const prefixes = [aemLessOrigin];
  if (liveDomain) prefixes.push(liveDomain);
  const dom = new JSDOM(text);
  const results = dom.window.document.body.querySelectorAll(
    LINK_SELECTORS.join(', ')
  );
  const matches =
    text.match(LINK_SELECTOR_REGEX)?.map((svgUrl) => {
      const a = dom.window.document.createElement('a');
      a.href = svgUrl;
      return a;
    }) || [];

  const linkedMedia = [...results, ...matches].reduce((acc, a) => {
    let href = a.getAttribute('href') || a.getAttribute('alt');
    // Don't add any off origin content.
    const isSameDomain = prefixes.some((prefix) => href.startsWith(prefix));
    if (!isSameDomain) return acc;

    href = href.replace('.hlx.', '.aem.');

    [href] = href.match(/^[^?#| ]+/);

    const url = new URL(href);

    // Check if its already in our URL list
    const found = acc.some((existing) => existing.pathname === url.pathname);
    if (found) return acc;

    // Mine the page URL for where to send the file
    const { toOrg, toRepo } = pageUrl;

    url.toOrg = toOrg;
    url.toRepo = toRepo;

    acc.push(url);
    return acc;
  }, []);

  for (const mediaUrl of linkedMedia) {
    if (ROLLING_IMPORT_ENABLE_DEBUG_LOGS) console.log(`Importing media: ${mediaUrl.href}`);
    try {
      await importUrl(mediaUrl.pathname, importedMedia);
      importedMedia.add(mediaUrl.pathname);
    } catch (error) {
      if (ROLLING_IMPORT_ENABLE_DEBUG_LOGS) console.log({ msg: error.message });
    }
  }

  return;
}

async function saveAllToDa(url, blob) {
  const { destPath, editPath, route } = url;

  url.daHref = `https://da.live${route}#/${toOrg}/${toRepo}${editPath}`;

  const body = new FormData();
  body.append('data', blob);
  const opts = { method: 'PUT', body };

  // Convert underscores to hyphens
  const formattedPath = destPath.replaceAll('media_', 'media-');

  try {
    const resp = await daFetch(
      `${DA_ORIGIN}/source/${toOrg}/${toRepo}${formattedPath}`,
      opts
    );
    return resp.status;
  } catch {
    if (ROLLING_IMPORT_ENABLE_DEBUG_LOGS) console.log(`Couldn't save ${destPath}`);
    return 500;
  }
}

async function previewOrPublish({ path, action }) {
  const previewUrl = `${AEM_ORIGIN}/${action}/${toOrg}/${toRepo}/main${path}`;
  const opts = { method: 'POST' };
  const resp = await fetch(previewUrl, opts);
  if (resp.ok && ROLLING_IMPORT_ENABLE_DEBUG_LOGS)
    console.log(
      `Posted to ${action} successfully ${action}/${toOrg}/${toRepo}/main${path}`
    );
  if (resp.ok) return;

  if (ROLLING_IMPORT_ENABLE_DEBUG_LOGS)
    console.log(
      `Posting to ${action} failed. ${action}/${toOrg}/${toRepo}/main${path}`
    );
  throw new Error(
    `Failed ${action}/${toOrg}/${toRepo}/main${path}. Error: ${resp.status} ${resp.statusText}`
  );
}

// If an image in metadata starts with new line
// we'll need to remove the new line to prevent losing the reference to the img
// IMPORTANT: This currently not used as we only found this occuring on one page.
// It's still left in to enable in case we find more cases of this.
function safeguardMetadataImages(dom) {
  const metadata = dom.window.document.querySelector('.metadata');
  if (metadata) {
    metadata.querySelectorAll('div').forEach((row) => {
      const metadataKey = row
        .querySelector('div:first-child')
        ?.textContent.trim()
        .toLowerCase();
      if (metadataKey === 'image')
        row.querySelectorAll('br')?.forEach((br) => br.remove());
    });
  }
  const cardMetadata = dom.window.document.querySelector('.card-metadata');
  if (cardMetadata) {
    cardMetadata.querySelectorAll('div').forEach((row) => {
      const metadataKey = row
        .querySelector('div:first-child')
        ?.textContent.trim()
        .toLowerCase();
      if (metadataKey === 'cardImage')
        row.querySelectorAll('br')?.forEach((br) => br.remove());
    });
  }
}

async function importUrl(aemPath, importedMedia) {
  const url = new URL(importFrom + aemPath.replace('.md', ''));
  // Exclude auto publishing files from Sharepoint
  if (excludedFiles.some((excludedFile) => url.pathname === excludedFile)) {
    if (ROLLING_IMPORT_ENABLE_DEBUG_LOGS) console.log(`Stopped processing ${url.pathname}`);
    return;
  }

  if (ROLLING_IMPORT_ENABLE_DEBUG_LOGS) console.log('Started path: ', url.href);
  const [fromRepo, fromOrg] = url.hostname
    .split('.')[0]
    .split('--')
    .slice(1)
    .slice(-2);
  if (!(fromRepo || fromOrg)) {
    if (ROLLING_IMPORT_ENABLE_DEBUG_LOGS) console.log(liveDomain, url.origin === liveDomain);
    if (url.origin !== liveDomain) {
      url.status = '403';
      url.error = 'URL is not from AEM.';
      return;
    }
  }

  url.fromRepo ??= fromRepo;
  url.fromOrg ??= fromOrg;

  const { pathname, href } = url;
  if (
    href.endsWith('.xml') ||
    href.endsWith('.html') ||
    href.includes('query-index')
  ) {
    url.status = 'error';
    url.error = 'DA does not support XML, HTML, or query index files.';
    return;
  }

  const isExt = EXTS.some((ext) => href.endsWith(`.${ext}`));
  const path = href.endsWith('/') ? `${pathname}index` : pathname;
  const srcPath = isExt ? path : `${path}.md`;
  url.destPath = isExt ? path : `${path}.html`;
  url.editPath = href.endsWith('.json') ? path.replace('.json', '') : path;

  if (isExt) {
    url.route = url.destPath.endsWith('json') ? '/sheet' : '/media';
  } else {
    url.route = '/edit';
  }

  try {
    const resp = await fetch(`${url.origin}${srcPath}`);
    if (resp.status === 404) {
      if (ROLLING_IMPORT_ENABLE_DEBUG_LOGS)
        console.log('Resource not found: ', `${url.origin}${srcPath}`);
      return;
    }
    if (ROLLING_IMPORT_ENABLE_DEBUG_LOGS)
      console.log('fetched resource from AEM at:', `${url.origin}${srcPath}`);
    if (
      resp.redirected &&
      !(
        srcPath.endsWith('.mp4') ||
        srcPath.endsWith('.png') ||
        srcPath.endsWith('.jpg')
      )
    ) {
      url.status = 'redir';
      if (ROLLING_IMPORT_ENABLE_DEBUG_LOGS)
        console.log('Skipped importing redirected resource');
      return;
    }
    if (!resp.ok && resp.status !== 304) {
      url.status = 'error';
      if (ROLLING_IMPORT_ENABLE_DEBUG_LOGS)
        console.log(
          `Failed Status ${resp.status} /${toOrg}/${toRepo}/main${path}. Error: ${resp.status} ${resp.statusText}`
        );
      throw new Error(
        `Failed Status ${resp.status} /${toOrg}/${toRepo}/main${path}. Error: ${resp.status} ${resp.statusText}`
      );
    }
    let content = isExt ? await resp.blob() : await resp.text();
    if (!isExt) {
      const dom = mdToDocDom(content);
      // safeguardMetadataImages(dom);
      const aemHtml = docDomToAemHtml(dom);
      // importMedia is more of a backup, media should always have their own entries anyway
      await importMedia(url, aemHtml, importedMedia);
      let html = replaceHtml(aemHtml, url.fromOrg, url.fromRepo);
      content = new Blob([html], { type: 'text/html' });
    }
    url.status = await saveAllToDa(url, content);
    if (ROLLING_IMPORT_ENABLE_DEBUG_LOGS) console.log('imported resource to DA ' + url.daHref);
    await previewOrPublish({ path: pathname, action: 'preview' });
    await previewOrPublish({ path: pathname, action: 'live' });
  } catch (e) {
    if (ROLLING_IMPORT_ENABLE_DEBUG_LOGS) console.log(`Failed to import resource to DA ${toOrg}/${toRepo} | destination: ${url.pathname} | error: ${e.message}`);
    throw e;
  }
}

export default importUrl;
