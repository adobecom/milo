function shouldntScroll(element, elFromPoint) {
  return !elFromPoint
    || elFromPoint === element
    || element.contains(elFromPoint)
    || elFromPoint.contains(element)
    || elFromPoint.shadowRoot?.contains(element);
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
    const element = e.target.shadowRoot?.activeElement ?? e.target;

    if (isPadding) removeScrollPadding();
    isFocused = true;

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

export const setDialogAndElementAttributes = ({ element, title }) => {
  if (!element || !title) return;
  element.title = title;
  element.closest('.dialog-modal')?.setAttribute('aria-label', title);
};

export default function init() {
  scrollTabFocusedElIntoView();
}
