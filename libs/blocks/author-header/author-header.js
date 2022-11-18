export default function init(blockEl) {
  const title = blockEl.querySelector('div:nth-child(1)');
  if (title) { title.classList.add('author-header-title'); }
  const img = blockEl.querySelector('div:nth-child(2)');
  if (img) { img.classList.add('author-header-img'); }
  const bio = blockEl.querySelector('div:nth-child(3)');
  if (bio) { bio.classList.add('author-header-bio'); }
}
