import RequestHandler from './request-handler.js';
import { DA_ORIGIN } from './constants.js';

class References {
  constructor(accessToken, htmlPaths, org, repo) {
    this.accessToken = accessToken;
    this.org = org;
    this.repo = repo;
    this.htmlPaths = htmlPaths;

    // eslint-disable-next-line no-useless-escape
    this.referencePattern = new RegExp(`https?:\/\/[^/]*--${repo}--${org}\\.[^/]*(?:page|live)(\/.*(?:fragments\/|\\.(?:pdf|svg|json))[^?]*)`);
    this.requestHandler = new RequestHandler(accessToken);
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
    const fragmentsAndAssets = new Set();
    for (const path of this.htmlPaths) {
      const response = await this.requestHandler.daFetch(`${DA_ORIGIN}/source${path}.html`);
      if (!response.ok) {
        // eslint-disable-next-line no-continue
        continue;
      }
      const content = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, 'text/html');
      const { links } = doc;
      for (const link of links) {
        const { href } = link;
        const refPath = this.getReferencePath(href);
        if (refPath) {
          fragmentsAndAssets.add(`/${this.org}/${this.repo}${refPath}`);
        }
      }
    }
    return fragmentsAndAssets;
  }
}

function findFragmentsAndAssets({ accessToken, htmlPaths, org, repo }) {
  const references = new References(accessToken, htmlPaths, org, repo);
  return references.getReferencedFragmentsAndAssets();
}

export default findFragmentsAndAssets;
