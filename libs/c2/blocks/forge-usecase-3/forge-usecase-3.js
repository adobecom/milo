// forge-usecase-3 — Milo block authored by Forge from a section that matched no
// existing C2 block. EDS wraps the table-cell content in extra `<div>` row/cell
// wrappers (`block > div > div > <content>`); the scoped CSS in forge-usecase-3.css
// targets the natural HTML structure, so we lift the content out of EDS's
// wrappers before the styles apply.
export default async function init(el) {
  if (!el) return;
  const inner = el.querySelector(':scope > div > div');
  if (inner) {
    while (inner.firstChild) el.appendChild(inner.firstChild);
    inner.parentElement?.remove();
  }
  el.dataset.forgeAuthored = 'forge-usecase-3';
}
