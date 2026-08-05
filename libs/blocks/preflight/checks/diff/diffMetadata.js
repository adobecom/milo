import { normalizeText } from './nodePath.js';

export function parseMetadata(rootEl) {
  const meta = {};
  const block = rootEl.querySelector('.metadata');
  if (!block) return meta;
  [...block.children].forEach((rowEl) => {
    const cells = rowEl.children;
    if (cells.length >= 2) {
      const key = normalizeText(cells[0].textContent).toLowerCase();
      if (key) meta[key] = normalizeText(cells[1].textContent);
    }
  });
  return meta;
}

export default function diffMetadata(previewRoot, liveRoot) {
  const pv = parseMetadata(previewRoot);
  const lv = parseMetadata(liveRoot);
  const added = [];
  const modified = [];
  const removed = [];
  new Set([...Object.keys(pv), ...Object.keys(lv)]).forEach((key) => {
    const p = pv[key];
    const l = lv[key];
    if (p !== undefined && l === undefined) added.push({ key, previewValue: p });
    else if (p === undefined && l !== undefined) removed.push({ key, liveValue: l });
    else if (p !== l) modified.push({ key, previewValue: p, liveValue: l });
  });
  return { added, modified, removed };
}
