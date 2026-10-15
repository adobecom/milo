/**
 * Search and replace content based on the search type (floodgate or graybox).
 *
 * Used by the Floodgate COPY (direction 'toFloodgate') and PROMOTE
 * (direction 'toSource') operations, and by Graybox PROMOTE.
 */

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

class SearchReplace {
  constructor({
    searchType, org, repo, expName, color, direction = 'toSource',
  }) {
    this.searchType = searchType; // 'floodgate' or 'graybox'
    this.org = org;
    this.repo = repo;
    this.expName = expName;
    // Direction of the floodgate repo rewrite (both preview domains and
    // da.live/app links):
    //   'toSource'    – strip the -fg-<color> suffix (floodgate → source), promote
    //   'toFloodgate' – add the -fg-<color> suffix (source → floodgate), copy
    // Each direction is idempotent, so running searchAndReplace twice is safe.
    this.direction = direction;
    if (searchType === 'floodgate') {
      // Accept either the source repo or the floodgate repo and derive both, so
      // the rewrite works no matter which form the caller passes.
      this.sourceRepo = repo.replace(`-fg-${color}`, '');
      this.floodgateRepo = `${this.sourceRepo}-fg-${color}`;
    }
  }

  searchAndReplace(content) {
    let updatedContent;
    if (this.searchType === 'floodgate') {
      updatedContent = this.adjustUrlDomains(content);
    } else if (this.searchType === 'graybox') {
      updatedContent = this.adjustUrlDomains(content);
      const parser = new DOMParser();
      const doc = parser.parseFromString(updatedContent, 'text/html');
      SearchReplace.removeGrayboxStyles(doc); // Remove styles starting with 'gb-'
      SearchReplace.removeGrayboxBlock(doc); // Remove graybox block
      updatedContent = doc.body.outerHTML;
    } else {
      // eslint-disable-next-line no-console
      console.error(`Unknown search type: ${this.searchType}`);
      updatedContent = content;
    }
    return updatedContent;
  }

  adjustUrlDomains(content) {
    if (this.searchType === 'floodgate') {
      const toFloodgate = this.direction === 'toFloodgate';
      const fromRepo = toFloodgate ? this.sourceRepo : this.floodgateRepo;
      const toRepo = toFloodgate ? this.floodgateRepo : this.sourceRepo;
      // Rewrite preview/live hostnames (…--<repo>--<org>.aem.page). The trailing
      // dot anchors the match to the hostname boundary.
      const searchValue = `--${fromRepo}--${this.org}.`;
      const replaceValue = `--${toRepo}--${this.org}.`;
      const updatedContent = content.replaceAll(searchValue, replaceValue);
      // Rewrite da.live/app authoring links, but only those pointing at this
      // org's repo being processed — links to any other org/repo are left alone.
      // The lookahead keeps <repo> a whole path segment (so a `repo` prefix does
      // not match `repository`) and stops at HTML/URL delimiters, which also
      // covers a link to the repo root with no trailing path.
      const appLink = new RegExp(
        `(da\\.live/app/${escapeRegExp(this.org)}/)${escapeRegExp(fromRepo)}(?=[/?#"'<>\\s\\\\]|$)`,
        'g',
      );
      return updatedContent.replace(appLink, (match, prefix) => `${prefix}${toRepo}`);
    }
    if (this.searchType === 'graybox') {
      const updatedContent = content.replaceAll(`.page/${this.expName}`, '.page');
      return updatedContent.replaceAll(`.live/${this.expName}`, '.live');
    }
    return content;
  }

  static removeGrayboxStyles(doc) {
    const elements = doc.querySelectorAll('[class*="gb-"]');
    elements.forEach((element) => {
      const classes = element.className.split(' ');
      const filteredClasses = classes.filter(
        (className) => !className.startsWith('gb-'),
      );
      element.className = filteredClasses.join(' ');
    });
  }

  static removeGrayboxBlock(doc) {
    const elements = doc.querySelectorAll('div.graybox');
    elements.forEach((element) => element.remove());
  }
}

function searchAndReplace({
  content, searchType, org, repo, expName, color, direction,
}) {
  const searchReplace = new SearchReplace({
    searchType, org, repo, expName, color, direction,
  });
  return searchReplace.searchAndReplace(content);
}

export default searchAndReplace;
