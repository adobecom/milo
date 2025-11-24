/**
 * ROC Fragment Block
 * 
 * This block is processed and removed in utils.js decorateLinks() before blocks are loaded.
 * This file exists as a safety fallback and should never be called in normal operation.
 * 
 * Usage: Author a block with "roc-fragment" and a "roc" row containing a fragment link.
 * The block will be replaced with either the ROC or fallback fragment content.
 */
export default function init(el) {
  // This block should have been removed by decorateLinks in utils.js
  // If we reach here, something went wrong - log error and remove the block
  window.lana?.log('ERROR: roc-fragment block was not processed by decorateLinks', { 
    tags: 'roc-fragment,error',
  });
  el.remove();
}

