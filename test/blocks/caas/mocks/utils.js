import { stub } from 'sinon';

export const isValidUuid = () => true;

export const getHashConfig = stub();

export const getConfig = () => ({});

export const cloneObj = (obj) => JSON.parse(JSON.stringify(obj));

export const loadStyle = stub();

export const loadScript = stub();

export const utf8ToB64 = (str) => window.btoa(unescape(encodeURIComponent(str)));

export function updateObj(obj, defaultObj) {
  const ds = cloneObj(defaultObj);
  Object.keys(ds).forEach((key) => {
    if (obj[key] === undefined) obj[key] = ds[key];
  });
  return obj;
}

export function createIntersectionObserver({ el, callback }) {
  // fire immediately
  callback(el, { target: el });
}

export const parseEncodedConfig = stub().returns({
  analyticsTrackImpression: false,
  analyticsCollectionName: '',
  andLogicTags: [],
  bookmarkIconSelect: '',
  bookmarkIconUnselect: '',
  cardStyle: 'half-height',
  collectionBtnStyle: 'primary',
  container: '1200MaxWidth',
  country: 'caas:country/us',
  contentTypeTags: [],
  disableBanners: false,
  draftDb: false,
  environment: '',
  endpoint: 'www.adobe.com/chimera-api/collection',
  excludedCards: [],
  fallbackEndpoint: '',
  featuredCards: [],
  gutter: '4x',
  language: 'caas:language/en',
  layoutType: '4up',
  loadMoreBtnStyle: 'primary',
  onlyShowBookmarkedCards: false,
  orLogicTags: [],
  paginationAnimationStyle: 'paged',
  paginationEnabled: false,
  paginationQuantityShown: false,
  paginationUseTheme3: false,
  paginationType: 'none',
  placeholderUrl: '/my/placeholder.json',
  resultsPerPage: 5,
  searchFields: [],
  setCardBorders: false,
  showBookmarksFilter: false,
  showBookmarksOnCards: false,
  showFilters: false,
  showSearch: false,
  showTotalResults: false,
  sortDefault: 'dateDesc',
  sortEnablePopup: false,
  sortEnableRandomSampling: false,
  sortReservoirSample: 3,
  sortReservoirPool: 1000,
  source: ['hawks'],
  targetActivity: '',
  targetEnabled: false,
  theme: 'lightest',
  totalCardsToShow: 10,
  useLightText: false,
  useOverlayLinks: false,
  userInfo: [],
});
