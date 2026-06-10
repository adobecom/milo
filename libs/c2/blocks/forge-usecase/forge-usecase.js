// Snowflake block — bespoke section captured from a redesign prototype.
// EDS wraps the table-cell content in extra `<div>` row/cell wrappers
// (`block > div > div > <content>`). The scoped CSS in forge-usecase.css
// targets the natural HTML structure so we lift the content out of EDS's
// wrappers before the styles apply.
export default async function init(el) {
  if (!el) return;
  const inner = el.querySelector(':scope > div > div');
  if (inner) {
    while (inner.firstChild) el.appendChild(inner.firstChild);
    inner.parentElement?.remove();
  }
  el.dataset.bespoke = 'forge-usecase';
}
