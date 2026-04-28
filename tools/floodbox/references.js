import RequestHandler from './request-handler.js';
import { DA_ORIGIN } from './constants.js';

class References {
  constructor(accessToken, htmlPaths, org, repo, signal) {
    this.accessToken = accessToken;
    this.org = org;
    this.repo = repo;
    this.htmlPaths = htmlPaths;
    this.signal = signal;

    // eslint-disable-next-line no-useless-escape
    this.referencePattern = new RegExp(`https?:\/\/[^/]*--${repo}--${org}\\.[^/]*(?:page|live)(\/.*(?:fragments\/|\\.(?:pdf|svg|json))[^?]*)`);
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
          }
        } catch (err) {
          if (err.name !== 'AbortError') throw err;
        }
      }));
    }
    return fragmentsAndAssets;
  }
}

function findFragmentsAndAssets({ accessToken, htmlPaths, org, repo, signal }) {
  const references = new References(accessToken, htmlPaths, org, repo, signal);
  return references.getReferencedFragmentsAndAssets();
}

export default findFragmentsAndAssets;
