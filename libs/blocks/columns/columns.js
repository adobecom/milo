export default function init(el) {
  const rows = el.querySelectorAll(':scope > div');
  rows.forEach((row, rdx) => {
    const cols = row.querySelectorAll(':scope > div');
    cols.forEach((col, cdx) => {
      col.className = `item row-${rdx + 1} col-${cdx + 1}`;
      el.append(col);
    });
    row.remove();
  });
}
