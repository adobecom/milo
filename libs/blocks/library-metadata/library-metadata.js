export default function init(el) {
  el.classList.add('container');
  const rows = el.querySelectorAll(':scope > div');
  rows.forEach((row) => {
    row.classList.add('library-meta-row');
    row.firstElementChild.classList.add('library-meta-key');
  });
}
