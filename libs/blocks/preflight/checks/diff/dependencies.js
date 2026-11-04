import { getPageStatus, isCrossRepo } from '../adminStatus.js';
import { getXPath } from './nodePath.js';

const ASSET_SELECTOR = 'img[src$=".svg"], a[href$=".pdf"]';

const crossRepoFragments = (root) => [...root.querySelectorAll('.fragment[data-path]')]
  .filter((fragment) => isCrossRepo(fragment.dataset.path));

const urlOf = (el, pageUrl) => new URL(el.dataset.path || el.src || el.href, pageUrl.origin);

function publishChange({ preview, live }) {
  if (!preview.lastModified) return null;
  if (!live.lastModified) return 'added';
  return Date.parse(preview.lastModified) > Date.parse(live.lastModified) ? 'modified' : null;
}

export default async function collectDependencyChanges(root, pageUrl) {
  const statuses = new Map();
  const statusOf = (url) => {
    if (!statuses.has(url.href)) {
      statuses.set(url.href, getPageStatus(url).catch((e) => {
        window.lana?.log?.(`[preflight][diff] dependency ${url.pathname}: ${e.message}`, { tags: 'preflight', errorType: 'i' });
        return null;
      }));
    }
    return statuses.get(url.href);
  };

  const changes = { added: [], modified: [] };
  const dependencies = [...crossRepoFragments(root), ...root.querySelectorAll(ASSET_SELECTOR)];
  await Promise.all(dependencies.map(async (el) => {
    const status = await statusOf(urlOf(el, pageUrl));
    const type = status && publishChange(status);
    if (type) changes[type].push({ type, kind: 'leaf', tag: el.tagName, path: getXPath(el, root) });
  }));
  return changes;
}
