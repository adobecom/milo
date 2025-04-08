function shouldntScroll(element, elFromPoint) {
  return !elFromPoint
    || elFromPoint === element
    || element.contains(elFromPoint)
    || elFromPoint.contains(element);
}

function scrollTabFocusedElIntoView() {
  document.addEventListener('focusin', (e) => {
    const { target: element } = e;
    const rect = element.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const centerX = rect.left + rect.width / 2;
    const outsideViewport = rect.top < 0 || rect.bottom > viewportHeight;

    if (outsideViewport) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const bottomPointY = rect.bottom - rect.height * 0.05;

    const elFromPointTop = document.elementFromPoint(centerX, rect.top);
    const elFromPointBottom = document.elementFromPoint(centerX, bottomPointY);

    if (shouldntScroll(element, elFromPointTop)
    && shouldntScroll(element, elFromPointBottom)) return;

    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
}

export default function init() {
  scrollTabFocusedElIntoView();
}
