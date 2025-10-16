export const SPECTRUM_MOBILE_LANDSCAPE = '(max-width: 700px)';
export const MOBILE_LANDSCAPE = '(max-width: 767px)';
export const TABLET_DOWN = '(max-width: 1199px)';
export const TABLET_UP = '(min-width: 768px)';
export const DESKTOP_UP = '(min-width: 1200px)';
export const LARGE_DESKTOP = '(min-width: 1600px)';

const Media = {
  matchMobile: window.matchMedia(MOBILE_LANDSCAPE),
  matchDesktop: window.matchMedia(`${DESKTOP_UP} and (not ${LARGE_DESKTOP})`),
  matchDesktopOrUp: window.matchMedia(DESKTOP_UP),
  matchLargeDesktop: window.matchMedia(LARGE_DESKTOP),
  get isMobile() {
    return this.matchMobile.matches;
  },
  get isDesktop() {
    return this.matchDesktop.matches;
  },
  get isDesktopOrUp() {
    return this.matchDesktopOrUp.matches;
  }
}

export default Media;

export function isDesktop() {
  return Media.isDesktop;
}
