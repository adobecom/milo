import { getCachedMetadata, toClassName } from './utils.js';

function toCamelCase(name) {
  return toClassName(name).replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}

function getPlacement(btn) {
  let parentBlock;
  const wrapper = btn.closest('.section > div[class*="-wrapper"]');
  if (wrapper) parentBlock = btn.closest('.section > div > div');
  else if (btn.closest('.section > div:not(.content)')?.classList?.length > 0) parentBlock = btn.closest('.section > div');
  let placement = 'outside-blocks';

  if (parentBlock) {
    const blockName = parentBlock.classList[0];
    const sameBlocks = btn.closest('main')?.querySelectorAll(`.${blockName}`);

    if (sameBlocks && sameBlocks.length > 1) {
      sameBlocks.forEach((b, i) => {
        if (b === parentBlock) {
          placement = `${blockName}-${i + 1}`;
        }
      });
    } else {
      placement = blockName;
    }

    if (['template-x'].includes(blockName) && btn.classList.contains('placeholder')) {
      placement = 'blank-template-cta';
    }
  }

  return placement;
}

const setBasicBranchMetadata = new Set([
  'search-term',
  'canvas-height',
  'canvas-width',
  'canvas-unit',
  'sceneline',
  'task-id',
  'asset-collection',
  'category',
  'search-category',
  'load-print-addon',
  'tab',
  'action',
  'prompt',
]);

export async function getTrackingAppendedURL(url, options = {}) {
  const [{ getConfig }, { replaceKey }] = await Promise.all([import('../../../utils/utils.js'), import('../../../utils/utils.js')]);

  const { placement, isSearchOverride } = options;
  const windowParams = new URLSearchParams(window.location.search);
  const [
    searchTerm,
    canvasHeight,
    canvasWidth,
    canvasUnit,
    sceneline,
    taskID,
    assetCollection,
    category,
    searchCategory,
    loadPrintAddon,
    tab,
    action,
    prompt,
    sdid,
    mv,
    mv2,
    sKwcId,
    efId,
    promoId,
    trackingId,
    cgen,
  ] = [
    getCachedMetadata('branch-search-term'),
    getCachedMetadata('branch-canvas-height'),
    getCachedMetadata('branch-canvas-width'),
    getCachedMetadata('branch-canvas-unit'),
    getCachedMetadata('branch-sceneline'),
    getCachedMetadata('branch-task-id'),
    getCachedMetadata('branch-asset-collection'),
    getCachedMetadata('branch-category'),
    getCachedMetadata('branch-search-category'),
    getCachedMetadata('branch-load-print-addon'),
    getCachedMetadata('branch-tab'),
    getCachedMetadata('branch-action'),
    getCachedMetadata('branch-prompt'),
    windowParams.get('sdid'),
    windowParams.get('mv'),
    windowParams.get('mv2'),
    windowParams.get('s_kwcid'),
    windowParams.get('ef_id'),
    windowParams.get('promoid'),
    windowParams.get('trackingid'),
    windowParams.get('cgen'),
  ];
  const { referrer } = window.document;
  const pageUrl = window.location.pathname;
  const { experiment } = window.hlx || {};

  const experimentStatus = experiment ? experiment.status.toLocaleLowerCase() : null;

  const listBranchMetadataNodes = [...document.head.querySelectorAll('meta[name^=branch-]')];
  const listAdditionalBranchMetadataNodes = listBranchMetadataNodes.filter((e) => !setBasicBranchMetadata.has(e.name.replace(/^branch-/, '')));

  const appending = new URL(url);
  const urlParams = appending.searchParams;

  let searchBranchLinks = await replaceKey('search-branch-links', getConfig());
  searchBranchLinks = searchBranchLinks === 'search branch links' ? '' : searchBranchLinks;
  const isSearchBranchLink = searchBranchLinks?.replace(/\s/g, '').split(',').includes(`${appending.origin}${appending.pathname}`);

  const setParams = (k, v) => {
    if (v) {
      if (urlParams.has(k)) {
        urlParams.set(k, encodeURIComponent(v));
      } else {
        urlParams.append(k, encodeURIComponent(v));
      }
    }
  };

  if (isSearchBranchLink || isSearchOverride) {
    setParams('category', category || 'templates');
    setParams('taskID', taskID);
    setParams('assetCollection', assetCollection);
    setParams('height', canvasHeight);
    setParams('width', canvasWidth);
    setParams('unit', canvasUnit);
    setParams('sceneline', sceneline);

    if (searchCategory) {
      setParams('searchCategory', searchCategory);
    } else if (searchTerm) {
      setParams('q', searchTerm);
    }
    if (loadPrintAddon) setParams('loadPrintAddon', loadPrintAddon);
    setParams('tab', tab);
    setParams('action', action);
    setParams('prompt', prompt);
  }

  for (const { name, content } of listAdditionalBranchMetadataNodes) {
    const paramName = toCamelCase(name.replace(/^branch-/, ''));
    setParams(paramName, content);
  }

  setParams('referrer', referrer);
  setParams('url', pageUrl);
  setParams('sdid', sdid);
  setParams('mv', mv);
  setParams('mv2', mv2);
  setParams('efid', efId);
  setParams('promoid', promoId);
  setParams('trackingid', trackingId);
  setParams('cgen', cgen);
  if (placement) setParams('placement', placement);
  const { locale: { ietf, region } } = getConfig();
  setParams('locale', ietf);
  setParams('contentRegion', region === 'uk' ? 'gb' : region);

  if (sKwcId) {
    const sKwcIdParameters = sKwcId.split('!');

    if (typeof sKwcIdParameters[2] !== 'undefined' && sKwcIdParameters[2] === '3') {
      setParams('customer_placement', 'Google%20AdWords');
    }

    if (typeof sKwcIdParameters[8] !== 'undefined' && sKwcIdParameters[8] !== '') {
      setParams('keyword', sKwcIdParameters[8]);
    }
  }

  // eslint-disable-next-line chai-friendly/no-unused-expressions
  experimentStatus === 'active' && setParams('expid', `${experiment.id}-${experiment.selectedVariant}`);

  appending.search = urlParams.toString();
  return decodeURIComponent(appending.toString());
}

export default async function trackBranchParameters(links) {
  const { isSearchOverride } = links;
  await Promise.all([...links].map((a) => {
    if (a.href && a.href.match(/adobesparkpost(-web)?\.app\.link/)) {
      const placement = getPlacement(a);
      a.rel = 'nofollow';
      const btnUrl = new URL(a.href);
      const urlParams = btnUrl.searchParams;
      if (urlParams.has('acomx-dno')) {
        urlParams.delete('acomx-dno');
        btnUrl.search = urlParams.toString();
        a.href = decodeURIComponent(btnUrl.toString());
        // eslint-disable-next-line no-promise-executor-return
        return new Promise((r) => r(''));
      }
      return getTrackingAppendedURL(btnUrl, { placement, isSearchOverride }).then((url) => {
        a.href = url;
      });
    }
    // eslint-disable-next-line no-promise-executor-return
    return new Promise((r) => r(''));
  }));
}
