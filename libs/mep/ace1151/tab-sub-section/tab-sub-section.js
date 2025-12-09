export default async function init(el) {
  const rows = el.querySelectorAll(':scope > div');
  if (rows.length !== 2) return;
  const [head] = rows;
  const analyticsId = head.textContent?.trim();
  el.setAttribute('daa-lh', analyticsId);
  head.remove();
}
