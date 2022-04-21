export function utf8ToB64(str) {
  return window.btoa(unescape(encodeURIComponent(str)));
}

export function b64ToUtf8(str) {
  return decodeURIComponent(escape(window.atob(str)));
}

export function parseEncodedConfig(encodedConfig) {
  try {
    return JSON.parse(b64ToUtf8(decodeURIComponent(encodedConfig)));
  } catch (e) {
    console.log(e);
  }
  return null;
}

export function getHashConfig(hash = window.location.hash) {
  if (!hash) return null;
  const encodedConfig = hash.startsWith('#') ? hash.substring(1) : hash;
  window.location.hash = '';

  return parseEncodedConfig(encodedConfig);
}

export const defaultState = {
  cardStyle: 'half-height',
  collectionBtnStyle: 'primary',
  container: '1200MaxWidth',
  contentTypeTags: [],
  disableBanners: false,
  draftDb: false,
  gutter: '4x',
  layoutType: '4up',
  loadMoreBtnStyle: 'primary',
  paginationAnimationStyle: 'paged',
  paginationEnabled: false,
  paginationQuantityShown: false,
  paginationUseTheme3: false,
  paginationType: 'none',
  resultsPerPage: 5,
  setCardBorders: false,
  showFilters: false,
  showSearch: false,
  sortDefault: 'dateDesc',
  sortEnablePopup: false,
  sortEnableRandomSampling: false,
  sortReservoirSample: 3,
  sortReservoirPool: 1000,
  source: ['hawks'],
  theme: 'lightest',
  totalCardsToShow: 10,
  useLightText: false,
};
