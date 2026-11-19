export default function init(el) {
  [...el.children].forEach((row, index) => {
    const isImage = index === 0 && row.querySelector('picture, img');
    row.classList.add(isImage ? 'ai-summary-c2-image' : 'ai-summary-c2-content');
  });
}
