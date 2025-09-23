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

window.preflightExecutors.general = {
  runGeneralChecks
}

window.preflightExecutors.assets = {
  openAllModals,
  checkImageDimensions
}

window.preflightExecutors.accessibility = {
  checkAlt
}

window.preflightExecutors.performance = {
  checkLcpEl, 
  checkSingleBlock, 
  checkImageSize, 
  checkVideoPoster, 
  checkFragments, 
  checkForPersonalization, 
  checkPlaceholders, 
  checkIcons 
}

window.preflightExecutors.seo = {
  checkH1s,
  checkTitle,
  checkCanon,
  checkDescription,
  checkBody,
  checkLorem
}
