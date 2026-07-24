import { isSignedOut } from '../../utils/utils.js';

/* c8 ignore start */
const getUA = () => navigator.userAgent;
const PHONE_SIZE = window.screen.width < 550 || window.screen.height < 550;
const safariIpad = getUA().includes('Macintosh') && navigator.maxTouchPoints > 1;
const isGalaxyTab = getUA().includes('Linux') && navigator.maxTouchPoints > 1;
const isChromeIOS = getUA().includes('CriOS');
const isEdgeIOS = getUA().includes('EdgiOS');
const isFirefoxIOS = getUA().includes('FxiOS');

export const PERSONALIZATION_TAGS = {
  all: () => true,
  chrome: () => (getUA().includes('Chrome') && !getUA().includes('Edg')) || isChromeIOS,
  firefox: () => getUA().includes('Firefox') || isFirefoxIOS,
  safari: () => getUA().includes('Safari') && !getUA().includes('Chrome') && !isChromeIOS && !isEdgeIOS && !isFirefoxIOS,
  edge: () => getUA().includes('Edg'),
  android: () => getUA().includes('Android') || isGalaxyTab,
  ios: () => /iPad|iPhone|iPod/.test(getUA()) || safariIpad,
  windows: () => getUA().includes('Windows'),
  mac: () => getUA().includes('Macintosh') && !safariIpad,
  'mobile-device': () => safariIpad
    || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Touch/i
      .test(getUA()) || isGalaxyTab,
  phone: () => PERSONALIZATION_TAGS['mobile-device']() && PHONE_SIZE,
  tablet: () => PERSONALIZATION_TAGS['mobile-device']() && !PHONE_SIZE,
  desktop: () => !PERSONALIZATION_TAGS['mobile-device'](),
  loggedout: () => isSignedOut(),
  loggedin: () => !isSignedOut(),
};
/* c8 ignore stop */

export const FLAGS = {
  all: 'all',
  includeFragments: 'include-fragments',
  includeGnav: 'include-gnav',
};
