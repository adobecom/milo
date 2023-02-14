import { itemStatus } from './utils.js';

// FIXME: pass props
export const fakeUrl = 'https://main--milo--adobecom.hlx.page/drafts/cmillar/about-adobe-demo-jingle';
export const fakeEditUrl =
  'https://adobe.sharepoint.com/:w:/r/sites/adobecom/_layouts/15/Doc.aspx?sourcedoc=%7BAF551F88-2B18-46AE-827A-DAC8BC8A4C01%7D&file=about-adobe-demo-jingle.docx&action=default&mobileredirect=true';
const fakeItems = [
  {
    url: '/drafts/jingleh/marquee',
    sourceEditUrl: fakeEditUrl,
    sourcePreviewUrl: fakeUrl,
    sourceLiveUrl: fakeUrl,
    storeSyncUrl: fakeUrl,
    storeEditUrl: fakeEditUrl,
    storePreviewUrl: fakeUrl,
  },
  {
    url: '/drafts/jingleh/mas',
    sourceEditUrl: fakeEditUrl,
    sourcePreviewUrl: fakeUrl,
    sourceLiveUrl: fakeUrl,
    storeSyncUrl: fakeUrl,
    storeEditUrl: fakeEditUrl,
    storePreviewUrl: fakeUrl,
  },
  {
    url: '/drafts/jingleh/section-container',
    sourceEditUrl: fakeEditUrl,
    sourcePreviewUrl: fakeUrl,
    sourceLiveUrl: fakeUrl,
    storeSyncUrl: fakeUrl,
    storeEditUrl: fakeEditUrl,
    storePreviewUrl: fakeUrl,
  },
  {
    url: '/about/index',
    sourceEditUrl: fakeEditUrl,
    sourcePreviewUrl: fakeUrl,
    sourceLiveUrl: fakeUrl,
    storeSyncUrl: fakeUrl,
    storeEditUrl: fakeEditUrl,
    storePreviewUrl: fakeUrl,
  },
  {
    url: '/demo',
    sourceEditUrl: fakeEditUrl,
    sourcePreviewUrl: fakeUrl,
    sourceLiveUrl: fakeUrl,
    storeSyncUrl: fakeUrl,
    storeEditUrl: fakeEditUrl,
    storePreviewUrl: fakeUrl,
  },
];

const en_regions = ['in_en', 'uk', 'cn'];
const de_regions = ['de', 'lu_de', 'ch_de'];

export const fakeProjectName = 'Geo Expansion 2H 2022';

const fakeLocales = [
  {
    language: 'de',
    itemsCnt: 11,
    method: 'Human',
    regions: de_regions,
  },
  {
    language: 'pt',
    itemsCnt: 164,
    completeCnt: 56,
    method: 'Machine + Human',
    regions: de_regions,
  },
  {
    language: 'en-gb',
    itemsCnt: 263,
    method: 'Alternate Language',
    regions: en_regions,
  },
  {
    language: 'fr',
    itemsCnt: 263,
    method: 'Machine + Human',
    regions: de_regions,
  },
  {
    language: 'en',
    itemsCnt: 45,
    method: 'Copy',
    regions: en_regions,
  },
  {
    language: 'ch',
    itemsCnt: 59,
    method: 'Machine + Human',
    regions: de_regions,
  },
  {
    language: 'jk',
    itemsCnt: 59,
    method: 'Human',
    regions: de_regions,
  },
  {
    language: 'kr',
    itemsCnt: 59,
    method: 'Human',
    regions: de_regions,
  },
];

const fakeRolloutLocales = ['in_en', 'ca', 'uk'];

/**
 * {
 *  projectName: fakeProjectName,
 *  subprojectStates: {
 *    [language]: {
 *      regions: de_regions,
 *      method: 'Human',
 *      itemsCnt: 11,
 *      completeCnt: 0,
 *      items: {
 *       [url]: {
 *         url: '/drafts/jingleh/marquee',
 *         sourceEditUrl: fakeEditUrl,
 *         sourcePreviewUrl: fakeUrl,
 *         sourceLiveUrl: fakeUrl,
 *         storeSyncUrl: fakeUrl,
 *         storeEditUrl: fakeEditUrl,
 *         storePreviewUrl: fakeUrl,
 *         status: 'initial'
 *        },
 *      },
 *  },
 *  allItems: [
 *   {
 *    url: '/drafts/jingleh/marquee',
 *    inENLangstore: false,
 *   }
 *  ]
 * }
 */
export const initialProjectState = (() => {
  const subprojectStates = {};
  fakeLocales.forEach((locale) => {
    const { language, regions, method, itemsCnt, completeCnt } = locale;
    const localeState = { regions, method, itemsCnt, completeCnt: 0 };
    const itemsMap = {};
    fakeItems.forEach((item) => {
      const { url, sourceEditUrl, sourceLiveUrl, sourcePreviewUrl, storeSyncUrl, storeEditUrl, storePreviewUrl } = item;
      const itemState = { ...item, status: itemStatus[0] };
      itemsMap[url] = itemState;
    });
    localeState.items = itemsMap;
    localeState.rolloutLocales = fakeRolloutLocales;
    subprojectStates[language] = localeState;
  });

  const state = { projectName: fakeProjectName, subprojectStates, allItems: fakeItems.map((item) => ({ ...item, inENLangstore: false })) };

  return state;
  // return {
  //   state,
  //   updateSubprojectItem: (language, url, newSubprojectItemState) => {
  //     subprojectStates[language][url] = newSubprojectItemState;
  //     return { state };
  //   },
  // };
})();
