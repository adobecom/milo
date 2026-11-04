import { loadStyle, getConfig } from '../../../../utils/utils.js';
import loadC2Tokens from '../../c2-tokens.js';
import fetchVersions from './fetchVersions.js';
import computeDiff from './computeDiff.js';
import collectFragmentChanges from './fragments.js';
import collectDependencyChanges from './dependencies.js';
import { highlightOnPage } from '../../panels/diff-onpage.js';

export default async function autoHighlightUnpublished(forceHighlights) {
  const root = document.querySelector('main');
  if (!root) return;
  try {
    const url = new URL(window.location.href);
    const [page, fragments, dependencies] = await Promise.all([
      fetchVersions(url).then((versions) => computeDiff(versions).content),
      collectFragmentChanges(root, url),
      collectDependencyChanges(root, url),
    ]);
    const changes = [page, fragments, dependencies];
    const content = {
      added: changes.flatMap((change) => change?.added || []),
      modified: changes.flatMap((change) => change?.modified || []),
    };
    if (!content.added.length && !content.modified.length) return;
    const { miloLibs, codeRoot } = getConfig();
    const base = miloLibs || codeRoot;
    await Promise.all([
      new Promise((res) => { loadStyle(`${base}/blocks/preflight/panels/diff-onpage.css`, res); }),
      loadC2Tokens(base),
    ]);
    const cleanup = highlightOnPage(content, root, forceHighlights);
    window.addEventListener('popstate', cleanup, { once: true });
  } catch (e) {
    window.lana?.log?.(`[preflight][diff] auto-highlight failed: ${e.message}`, { tags: 'preflight', errorType: 'i' });
  }
}
