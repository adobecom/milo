import { runGeneralChecks } from '../panels/general.js';
import {
  openAllModals,
  checkImageDimensions
} from './assets.js';
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
import { 
  checkH1s,
  checkTitle,
  checkCanon,
  checkDescription,
  checkBody,
  checkLorem,
  validLinkFilter
} from './seo.js';

window.preflightExecutors = {
  general: {
    runGeneralChecks
  },
  assets: {
    openAllModals,
    checkImageDimensions
  }, 
  accessibility: {
    checkAlt
  },
  performance: {
    checkLcpEl, 
    checkSingleBlock, 
    checkImageSize, 
    checkVideoPoster, 
    checkFragments, 
    checkForPersonalization, 
    checkPlaceholders, 
    checkIcons 
  },
  seo: {
    checkH1s,
    checkTitle,
    checkCanon,
    checkDescription,
    checkBody,
    checkLorem,
    validLinkFilter
  }
};
window.dispatchEvent(new CustomEvent('content-insights-begin'));
