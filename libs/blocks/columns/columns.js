export default function init(el) {
  const rows = el.querySelectorAll(':scope > div');
  rows.forEach((row, rdx) => {
    row.className = `row row-${rdx + 1}`;
    const cols = row.querySelectorAll(':scope > div');
    cols.forEach((col, cdx) => {
      col.className = `col col-${cdx + 1}`;
    });
  });
}
