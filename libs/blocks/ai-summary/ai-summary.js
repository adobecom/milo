export default function init(el) {
  [...el.children].forEach((row, index) => {
    const isImage = index === 0 && row.querySelector('picture, img');
    row.classList.add(isImage ? 'ai-summary-image' : 'ai-summary-content');
  });
}
