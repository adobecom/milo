import { runGeneralChecks } from '../panels/general.js';
import { openAllModals, checkImageDimensions } from './assets.js';
import { checkAlt } from '../accessibility/audit-image-alt-text.js';
import { 
    checkLcpEl, 
    checkSingleBlock, 
    checkImageSize, 
    checkVideoPoster, 
    checkFragments, 
    checkForPersonalization, 
    checkPlaceholders, 
    checkIcons 
} from './performance.js';
import { checkH1s, checkTitle, checkCanon, checkDescription, checkBody, checkLorem } from './seo.js';

const [ PERFORMANANCE_CHK, GENERAL_CHK, SEO_CHK, ACCESSIBILITY_CHK, ASSETS_CHK ] = ['performanance', 'general', 'seo', 'accessibility', 'assets'];

export default async function executeCheck(options) {
  const { excludes = [] } = options || {};
  window.contentInsights = {};
  if (!excludes.includes(PERFORMANANCE_CHK)) {
    const perfChecks = [
        checkLcpEl(window.location.href, document),
        checkSingleBlock(document),
        checkImageSize(window.location.href, document),
        checkVideoPoster(window.location.href, document),
        checkFragments(window.location.href, document),
        checkForPersonalization(document),
        checkPlaceholders(window.location.href, document),
        checkIcons(window.location.href, document),
    ];
    const perfKeys = ['lcpEl','singleBlock','imageSize','videoPoster','fragments','placeholders','personalization'];
    const perfResults = await Promise.all(perfChecks);
    window.contentInsights.performance = perfKeys.reduce((acc, key, idx) => {
        acc[key] = perfResults[idx];
        return acc;
    }, {});
  }
  
  if (!excludes.includes(GENERAL_CHK)) {
    window.contentInsights.general = runGeneralChecks();
  }

  if (!excludes.includes(SEO_CHK)) {
    const seoChecks = [
        checkH1s(document),
        checkTitle(document),
        checkCanon(document),
        checkDescription(document),
        checkBody(document),
        checkLorem(document),
    ];
    const keys = ['h1', 'title', 'canon', 'description', 'body', 'lorem'];
    const results = await Promise.all(seoChecks);
    window.contentInsights.seo = keys.reduce((acc, key, idx) => {
        acc[key] = results[idx];
        return acc;
    }, {});
  }

  if (!excludes.includes(ACCESSIBILITY_CHK)) {
    window.contentInsights.accessibility = await checkAlt();
  }

  if (!excludes.includes(ASSETS_CHK)) {
    await openAllModals(document);
    const {
      assetsWithMismatch: imagesWithMismatch = [],
      assetsWithMatch: imagesWithMatch = [],
    } = (await checkImageDimensions(window.location.href, document))?.details ?? {};
    
    window.contentInsights.assets = {
      imagesWithMismatch,
      imagesWithMatch,
    };
  }
  
  window.dispatchEvent(new CustomEvent('content-insights-complete', { detail: window.contentInsights }));
}
