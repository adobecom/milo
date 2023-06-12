// TODO: add support for displaying personalization in fragment previews

export default function init(el) {
  el.classList.add('contained');
  const rows = el.querySelectorAll(':scope > div');
  rows.forEach((row, rdx) => {
    row.className = `row row-${rdx + 1}`;
    const cols = row.querySelectorAll(':scope > div');
    cols.forEach((col, cdx) => {
      col.className = `col col-${cdx + 1}`;
    });
    // row.addEventListener('click', (e) => console.log(e.target.closest('.row')));
  });
  el.insertAdjacentHTML('afterbegin', '<h2>Fragment Personalization (info only):</h2>');
}
