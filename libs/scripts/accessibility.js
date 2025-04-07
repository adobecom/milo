const CONSENT_EVENTS = ['adobePrivacy:PrivacyConsent', 'adobePrivacy:PrivacyCustom', 'adobePrivacy:PrivacyReject'];

const setScrollPaddingBottom = (stickyBottomHeight = 0, consentBannerHeight = 0) => {
  document.documentElement.style.setProperty('--scroll-padding-bottom', `${Math.max(stickyBottomHeight, consentBannerHeight)}px`);
};

const setScrollPaddingTop = (gnavHeight, stickyTopHeight = 0) => {
  document.documentElement.style.setProperty('--scroll-padding-top', `${stickyTopHeight + gnavHeight}px`);
};

export const setScrollPadding = () => {
  // Get sticky elements height and gnav height
  const stickyTop = document.querySelector('.sticky-top');
  const stickyBottom = document.querySelector('.sticky-bottom');
  // Sticky notification pill has bottom: --spacing-xs(16)
  const stickyBottomOffset = stickyBottom?.querySelector('.pill') ? 16 : 0;
  const gnavHeightStyle = getComputedStyle(document.documentElement).getPropertyValue('--global-height-nav');
  const breadcrumbsStyle = getComputedStyle(document.documentElement).getPropertyValue('--global-height-breadcrumbs');
  const onlyGnavHeight = parseInt(gnavHeightStyle, 10) ?? 0;
  const breadcrumbsHeight = parseInt(breadcrumbsStyle, 10) ?? 0;
  const hasBreadcrumbs = !!document.querySelector('.breadcrumbs');
  const gnavHeight = hasBreadcrumbs ? onlyGnavHeight + breadcrumbsHeight : onlyGnavHeight;
  // If cookie is present user already closed cookie banner
  let isClosedConsent = document.cookie.includes('OptanonAlertBoxClosed');
  let consentBanner = null;
  let consentBannerHide = null;
  let consentBannerShow = null;

  const handleConsentBannerShow = () => {
    setScrollPaddingBottom(stickyBottom?.clientHeight + stickyBottomOffset, consentBanner?.clientHeight);
  }

  // On viewport < 1024px cookie banner can be hidden
  const handleConsentBannerHide = () => {
    setScrollPaddingBottom(stickyBottom?.clientHeight + stickyBottomOffset);
    consentBannerShow = document.querySelector('#ot-cookie-button');
    consentBannerShow?.addEventListener('click', handleConsentBannerShow);
  }

  // Update values on resize
  const handleResize = () => {
    setScrollPaddingTop(gnavHeight, stickyTop?.clientHeight);
    setScrollPaddingBottom(stickyBottom?.clientHeight + stickyBottomOffset, consentBanner?.clientHeight);
  }

  setScrollPaddingTop(gnavHeight, stickyTop?.clientHeight);
  setScrollPaddingBottom(stickyBottom?.clientHeight + stickyBottomOffset);

  if (!stickyTop && !stickyBottom && isClosedConsent) return;

  if (!isClosedConsent) {
    // Just in case if cookie banner is not shown on the page at all
    let attempts = 0;
    // Await for cookie banner
    const consentBannerInterval = setInterval(() => {
      consentBanner = document.querySelector('#onetrust-banner-sdk');
      if (attempts === 5) clearInterval(consentBannerInterval);
      if (!consentBanner) {
        attempts++;
        return;
      }
      clearInterval(consentBannerInterval);
      setScrollPaddingBottom(stickyBottom?.clientHeight + stickyBottomOffset, consentBanner.clientHeight);
      consentBannerHide = consentBanner.querySelector('#ot-banner-close');
      consentBannerHide?.addEventListener('click', handleConsentBannerHide);
    }, 1000);
    // Add event listeners for cookie banner events (accept, reject etc.)
    CONSENT_EVENTS.forEach((event) => {
      window.addEventListener(event, () => {
        if (!stickyBottom && !stickyTop) window.removeEventListener('resize', handleResize);
        isClosedConsent = true;
        setScrollPaddingBottom(stickyBottom?.clientHeight + stickyBottomOffset);
        consentBannerHide?.removeEventListener('click', handleConsentBannerHide);
        consentBannerShow?.removeEventListener('click', handleConsentBannerShow);
      });
    });
  }

  window.addEventListener('resize', handleResize);

  let stickyObserver = null;
  const stickyClosed = {
    top: !stickyTop,
    bottom: !stickyBottom,
  };
  [stickyTop, stickyBottom].forEach((sticky) => {
    if (!sticky) return;
    const stickyClose = sticky.querySelector('.close');
    // Handle closing of the sticky element if there is a close button
    stickyClose?.addEventListener('click', () => {
      if (sticky.classList.contains('sticky-top')) {
        stickyClosed.top = true;
        setScrollPaddingTop(gnavHeight);
      } else {
        stickyClosed.bottom = true;
        setScrollPaddingBottom(0, consentBanner?.clientHeight);
      }

      if (!stickyClosed.top || !stickyClosed.bottom || !isClosedConsent) return;
      // Disconnect observer if both sticky sections are closed
      stickyObserver?.disconnect();
      window.removeEventListener('resize', handleResize);
    });
    // If sticky section has 'hide-sticky-section' observe the changes so we can update padding when section is shown
    if (sticky.classList.contains('hide-sticky-section')) {
      stickyObserver = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
          if (mutation.attributeName === 'class') {
            if (sticky.classList.contains('sticky-bottom')) {
              setScrollPaddingBottom(sticky.clientHeight + stickyBottomOffset, consentBanner?.clientHeight);
            } else {
              setScrollPaddingTop(gnavHeight, sticky.clientHeight);
            }
          }
        }
      });
      stickyObserver.observe(sticky, { attributes: true });
    }
  });
};
