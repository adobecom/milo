export default function init(el) {
  el.classList.add('container');
  const rows = el.querySelectorAll(':scope > div');
  rows.forEach((row) => {
    row.classList.add('library-meta-row');
    row.firstElementChild.classList.add('library-meta-key');
  });
  // Fixes layout issue for groups of blocks using a grid layout
  const section = el.closest('.section');
  if (section.querySelector('.library-container-end')) {
    const content = section.querySelector('.content');
    section.insertAdjacentElement('afterend', el);

    if (!content) return;
    const reflowSection = document.createElement('div');
    reflowSection.classList.add('section');
    reflowSection.append(content);
    section.insertAdjacentElement('beforebegin', reflowSection);
  }
}
