function shouldntScroll(element, elFromPoint) {
  return !elFromPoint
    || elFromPoint === element
    || element.contains(elFromPoint)
    || elFromPoint.contains(element);
}

function setScrollPadding() {
  document.documentElement.style.setProperty('--scroll-padding-block', '25vh');
}

function removeScrollPadding() {
  document.documentElement.style.removeProperty('--scroll-padding-block');
}

function scrollTabFocusedElIntoView() {
  let isFocused = false;
  let isPadding = false;

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      isFocused = false;
      setTimeout(() => {
        if (isFocused) return;
        setScrollPadding();
        isPadding = true;
      });
    }
  });

  document.addEventListener('focusin', (e) => {
    if (isPadding) removeScrollPadding();
    isFocused = true;

    const { target: element } = e;
    const rect = element.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const outsideViewport = rect.top < 0 || rect.bottom > viewportHeight;

    if (outsideViewport) {
      element.scrollIntoView({ behavior: 'instant', block: 'center' });
      return;
    }

    const centerX = rect.left + rect.width / 2;
    const bottomPointY = rect.bottom - rect.height * 0.05;

    const elFromPointTop = document.elementFromPoint(centerX, rect.top);
    const elFromPointBottom = document.elementFromPoint(centerX, bottomPointY);

    if (shouldntScroll(element, elFromPointTop)
      && shouldntScroll(element, elFromPointBottom)) return;

    element.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
}

export default function init() {
  scrollTabFocusedElIntoView();
}
