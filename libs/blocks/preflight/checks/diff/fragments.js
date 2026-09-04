import fetchVersions from './fetchVersions.js';
import computeDiff from './computeDiff.js';
import { isCrossRepo } from '../adminStatus.js';

const stripDetached = ({ previewEl, liveEl, ...change }) => change;

export function hasPendingFragments(root) {
  return [...root.querySelectorAll('a[href*="/fragments/"]')]
    .some((a) => !isCrossRepo(new URL(a.href).pathname));
}

export default async function collectFragmentChanges(root, pageUrl) {
  const byPath = new Map();
  root.querySelectorAll('.fragment[data-path]').forEach((el) => {
    const path = el.getAttribute('data-path');
    if (!path || isCrossRepo(path)) return;
    const els = byPath.get(path) || [];
    els.push(el);
    byPath.set(path, els);
  });

  const added = [];
  const modified = [];
  await Promise.all([...byPath].map(async ([path, els]) => {
    let url;
    try {
      url = new URL(path, pageUrl.origin);
    } catch (e) {
      window.lana?.log?.(`[preflight][diff] fragment ${path}: ${e.message}`, { tags: 'preflight', errorType: 'i' });
      return;
    }
    const { content } = computeDiff(await fetchVersions(url));
    if (!content) return;
    els.forEach((scope) => {
      content.added.forEach((change) => added.push({ ...stripDetached(change), scope }));
      content.modified.forEach((change) => modified.push({ ...stripDetached(change), scope }));
    });
  }));

  return { added, modified };
}
