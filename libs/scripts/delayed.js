// eslint-disable-next-line import/no-cycle
import { sampleRUM, loadScript } from './scripts.js';

// Core Web Vitals RUM collection
sampleRUM('cwv');

// add more delayed functionality here

if (document.querySelector('.article-header') && !document.querySelector('[data-origin]')) {
  loadScript('/blocks/interlinks/interlinks.js', null, 'module');
}
