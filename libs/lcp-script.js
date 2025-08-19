export default function init(el, media = null, size = null) {
  let isInitialized = false;
  if (window.matchMedia('(max-width: 768px)').matches) {
    setTimeout(() => {
      if (size === 'regular' && media.querySelector('img, video')) return;

      const allElements = el.querySelectorAll('*');
      let biggestElement = null;
      let maxHeight = 0;

      allElements.forEach((element) => {
        const hasChildElements = element.children.length > 0;
        if (hasChildElements) return;

        const { height } = element.getBoundingClientRect();
        if (height > maxHeight) {
          maxHeight = height;
          biggestElement = element;
        }
      });

      if (biggestElement) {
        const biggestHeight = biggestElement.getBoundingClientRect().height + 35;
        el.closest('.section').style.minHeight = (`calc(100svh - ${biggestHeight}px)`);
        isInitialized = true;
      }
    }, 100);
  }

  window.addEventListener('resize', () => {
    if (isInitialized || !window.matchMedia('(max-width: 768px)').matches) return;
    isInitialized = true;

    init(el, media, size);
  });
}
