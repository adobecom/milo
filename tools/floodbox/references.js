import RequestHandler from './request-handler.js';
import { DA_ORIGIN } from './constants.js';

// Endpoints whose `?schedule=<base64-json>` query param contains
// fragment references. Add new supported endpoints here.
const SCHEDULE_MAKER_ENDPOINTS = [
  'https://www.adobe.com/ecc/system/tools/schedule-maker',
];

// URL hashes are client-side only — strip them from any captured fragment path.
function stripHash(p) {
  const i = p.indexOf('#');
  return i === -1 ? p : p.slice(0, i);
}

class References {
  constructor(accessToken, htmlPaths, org, repo, signal, options = {}) {
    this.accessToken = accessToken;
    this.org = org;
    this.repo = repo;
    this.htmlPaths = htmlPaths;
    this.signal = signal;
    this.includeChronoBoxFragments = !!options.includeChronoBoxFragments;

    // eslint-disable-next-line no-useless-escape
    this.referencePattern = new RegExp(`https?:\/\/[^/]*--${repo}--${org}\\.[^/]*(?:page|live)(\/.*(?:fragments\/|\\.(?:pdf|svg|json))[^?#]*)`);
    this.requestHandler = new RequestHandler(accessToken, { signal });
  }

  isValidReference(link) {
    return !!(link && link.match(this.referencePattern));
  }

  getReferencePath(link) {
    if (this.isValidReference(link)) {
      return link.match(this.referencePattern)[1];
    }
    return null;
  }

  // eslint-disable-next-line class-methods-use-this
  extractScheduleMakerFragments(href) {
    if (!href) return [];
    let url;
    try {
      url = new URL(href);
    } catch {
      return [];
    }
    const endpoint = `${url.origin}${url.pathname}`;
    if (!SCHEDULE_MAKER_ENDPOINTS.includes(endpoint)) return [];
    const schedule = url.searchParams.get('schedule');
    if (!schedule) return [];
    let parsed;
    try {
      parsed = JSON.parse(atob(schedule));
    } catch {
      return [];
    }
    const blocks = Array.isArray(parsed?.blocks) ? parsed.blocks : [];
    const results = [];
    blocks.forEach((block) => {
      const fragmentPath = block && typeof block === 'object' ? block.fragmentPath : null;
      if (typeof fragmentPath !== 'string' || !fragmentPath) return;
      const normalized = fragmentPath.startsWith('/') ? fragmentPath : `/${fragmentPath}`;
      results.push(stripHash(normalized));
    });
    return results;
  }

  extractChronoBoxFragments(doc, htmlPath) {
    const results = [];
    const repoPrefix = `/${this.org}/${this.repo}`;
    const repoRelative = htmlPath.startsWith(repoPrefix)
      ? htmlPath.slice(repoPrefix.length)
      : htmlPath;
    const baseDir = repoRelative.slice(0, repoRelative.lastIndexOf('/'));
    const parseCell = (cell) => {
      const text = cell?.textContent?.trim();
      if (!text) return null;
      try {
        const parsed = JSON.parse(text);
        return Array.isArray(parsed) ? parsed : null;
      } catch {
        return null;
      }
    };
    doc.querySelectorAll('.chrono-box').forEach((block) => {
      Array.from(block.children).forEach((row) => {
        const entries = parseCell(row.children[1]);
        if (!entries) return;
        entries.forEach((entry) => {
          const pathToFragment = entry && typeof entry === 'object' ? entry.pathToFragment : null;
          if (typeof pathToFragment !== 'string' || !pathToFragment) return;
          const resolved = pathToFragment.startsWith('/')
            ? pathToFragment
            : `${baseDir}/${pathToFragment}`;
          results.push(stripHash(resolved));
        });
      });
    });
    return results;
  }

  async getReferencedFragmentsAndAssets() {
    const FRAGMENT_FETCH_BATCH = 10;
    const fragmentsAndAssets = new Set();
    const parser = new DOMParser();
    for (let i = 0; i < this.htmlPaths.length; i += FRAGMENT_FETCH_BATCH) {
      if (this.signal?.aborted) break;
      const batch = this.htmlPaths.slice(i, i + FRAGMENT_FETCH_BATCH);
      // eslint-disable-next-line no-await-in-loop
      await Promise.all(batch.map(async (path) => {
        try {
          const response = await this.requestHandler.daFetch(`${DA_ORIGIN}/source${path}.html`);
          if (!response.ok) return;
          const content = await response.text();
          const doc = parser.parseFromString(content, 'text/html');
          for (const link of doc.links) {
            const refPath = this.getReferencePath(link.href);
            if (refPath) {
              fragmentsAndAssets.add(`/${this.org}/${this.repo}${refPath}`);
            }
            if (this.includeChronoBoxFragments) {
              this.extractScheduleMakerFragments(link.href).forEach((p) => {
                fragmentsAndAssets.add(`/${this.org}/${this.repo}${p}`);
              });
            }
          }
          if (this.includeChronoBoxFragments) {
            this.extractChronoBoxFragments(doc, path).forEach((p) => {
              fragmentsAndAssets.add(`/${this.org}/${this.repo}${p}`);
            });
          }
        } catch (err) {
          if (err.name !== 'AbortError') throw err;
        }
      }));
    }
    return fragmentsAndAssets;
  }
}

function findFragmentsAndAssets({
  accessToken,
  htmlPaths,
  org,
  repo,
  signal,
  includeChronoBoxFragments,
}) {
  const references = new References(
    accessToken,
    htmlPaths,
    org,
    repo,
    signal,
    { includeChronoBoxFragments },
  );
  return references.getReferencedFragmentsAndAssets();
}

export default findFragmentsAndAssets;
