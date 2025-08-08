function getActiveEl(target) {
  let active = target.shadowRoot?.activeElement ?? target;
  while (active.shadowRoot?.activeElement) {
    active = active.shadowRoot?.activeElement;
  }
  return active;
}

function shouldntScroll(element, elFromPoint) {
  return !elFromPoint
    || elFromPoint === element
    || element.contains(elFromPoint)
    || elFromPoint.contains(element)
    || element.shadowRoot?.contains(elFromPoint)
    || elFromPoint.shadowRoot?.contains(element);
}

function setScrollPadding() {
  document.documentElement.style.setProperty('--scroll-padding-block', '25vh');
}

function removeScrollPadding() {
  document.documentElement.style.removeProperty('--scroll-padding-block');
}

function getElementFromPoint(x, y) {
  let elFromPoint = document.elementFromPoint(x, y);
  while (elFromPoint.shadowRoot) {
    const el = elFromPoint.shadowRoot.elementFromPoint(x, y);
    if (el === elFromPoint) break;
    elFromPoint = el;
  }
  return elFromPoint;
}

function scrollTabFocusedElIntoView() {
  let isFocused = false;
  let isPadding = false;
  let isTab = false;

  function scrollElement(target) {
    if (!target) return;

    if (isPadding) removeScrollPadding();
    isTab = false;
    isPadding = false;
    isFocused = true;

    const element = getActiveEl(target);
    const rect = element.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const outsideViewport = rect.top < 0 || rect.bottom > viewportHeight;

    if (outsideViewport) {
      element.scrollIntoView({ behavior: 'instant', block: 'center' });
      return;
    }

    const centerX = rect.left + rect.width / 2;
    const bottomPointY = rect.bottom - rect.height * 0.05;

    const elFromPointTop = getElementFromPoint(centerX, rect.top);
    const elFromPointBottom = getElementFromPoint(centerX, bottomPointY);

    if (shouldntScroll(element, elFromPointTop)
      && shouldntScroll(element, elFromPointBottom)) return;

    element.scrollIntoView({ behavior: 'instant', block: 'center' });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab'
    || e.target.closest('.notification')?.parentElement?.querySelector('.notification-curtain')) return;
    isTab = true;
    isFocused = false;
    setTimeout(() => {
      if (isFocused) return;
      if (e.target.shadowRoot) {
        scrollElement(e.target);
        return;
      }
      setScrollPadding();
      isPadding = true;
      isTab = false;
    });
  });

  document.addEventListener('focusin', (e) => {
    if (!isTab && !e.target.closest('footer')) return;
    scrollElement(e.target);
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
