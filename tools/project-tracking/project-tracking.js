import { setConfig } from '../../libs/utils/utils.js';
import init from '../../libs/blocks/project-tracking/project-tracking.js';

setConfig({ miloLibs: '/libs' });
init(document.querySelector('.project-tracking'));
