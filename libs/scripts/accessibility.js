const PILL_BOTTOM = 16;

function shouldntScroll(element, elFromPoint) {
  return !elFromPoint
    || elFromPoint === element
    || element.contains(elFromPoint)
    || elFromPoint.contains(element);
}

function setScrollPaddingTop(header, stickyTop) {
  const headerHeight = header?.offsetHeight ?? 0;
  const stickyTopHeight = stickyTop?.offsetHeight ?? 0;
  document.documentElement.style.setProperty('--scroll-padding-top', `${headerHeight + stickyTopHeight}px`);
}

function setScrollPaddingBottom(stickyBottom, consentBanner, isPill) {
  const stickyBottomHeight = stickyBottom?.clientHeight ?? 0;
  const stickyBottomActualHeight = isPill ? stickyBottomHeight + PILL_BOTTOM : stickyBottomHeight;
  const isHiddenBanner = consentBanner?.classList.contains('slide-down');
  const consentHeight = consentBanner?.clientHeight ?? 0;
  const consentBannerAcctualHeight = isHiddenBanner ? 0 : consentHeight;
  document.documentElement.style.setProperty('--scroll-padding-bottom', `${Math.max(stickyBottomActualHeight, consentBannerAcctualHeight)}px`);
}

function removeScrollPadding() {
  document.documentElement.style.removeProperty('--scroll-padding-top');
  document.documentElement.style.removeProperty('--scroll-padding-bottom');
}

function scrollTabFocusedElIntoView() {
  const header = document.querySelector('header');
  const stickyTop = document.querySelector('.sticky-top');
  const stickyBottom = document.querySelector('.sticky-bottom');
  const isPill = stickyBottom?.querySelector('.pill');
  let consentBanner = null;
  let isFocused = false;
  let isPadding = false;

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      isFocused = false;
      setTimeout(() => {
        if (isFocused) return;
        if (!consentBanner) consentBanner = document.querySelector('#onetrust-banner-sdk');
        setScrollPaddingTop(header, stickyTop);
        setScrollPaddingBottom(stickyBottom, consentBanner, isPill);
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
