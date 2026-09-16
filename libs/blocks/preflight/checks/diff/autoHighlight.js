import { loadStyle, getConfig } from '../../../../utils/utils.js';
import loadC2Tokens from '../../c2-tokens.js';
import fetchVersions from './fetchVersions.js';
import computeDiff from './computeDiff.js';
import collectFragmentChanges from './fragments.js';
import { autoHighlightOnPage } from '../../panels/diff-onpage.js';

export default async function autoHighlightUnpublished() {
  const root = document.querySelector('main');
  if (!root) return;
  try {
    const url = new URL(window.location.href);
    const page = computeDiff(await fetchVersions(url)).content;
    const fragments = await collectFragmentChanges(root, url);
    const content = {
      added: [...(page?.added || []), ...fragments.added],
      modified: [...(page?.modified || []), ...fragments.modified],
    };
    if (!content.added.length && !content.modified.length) return;
    const { miloLibs, codeRoot } = getConfig();
    const base = miloLibs || codeRoot;
    await Promise.all([
      new Promise((res) => { loadStyle(`${base}/blocks/preflight/panels/diff-onpage.css`, res); }),
      loadC2Tokens(base),
    ]);
    const cleanup = autoHighlightOnPage(content, root);
    if (cleanup) window.addEventListener('popstate', cleanup, { once: true });
  } catch (e) {
    window.lana?.log?.(`[preflight][diff] auto-highlight failed: ${e.message}`, { tags: 'preflight', errorType: 'i' });
  }
}
