export const SPECTRUM_MOBILE_LANDSCAPE = '(max-width: 700px)';
export const MOBILE_LANDSCAPE = '(max-width: 767px)';
export const TABLET_DOWN = '(max-width: 1199px)';
export const TABLET_UP = '(min-width: 768px)';
export const DESKTOP_UP = '(min-width: 1200px)';
export const LARGE_DESKTOP = '(min-width: 1600px)';

export function matchMobile() {
    return window.matchMedia(MOBILE_LANDSCAPE);
}

export function matchDesktop() {
  return window.matchMedia(DESKTOP_UP);
}

export function isMobile() {
  return matchMobile().matches;
}

export function isDesktop() {
  return matchDesktop().matches;
}