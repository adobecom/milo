/**
 * MEP Lingo Block
 *
 * This block is processed and removed in utils.js decorateLinksAsync() before blocks are loaded.
 * This file exists as a safety fallback and should never be called in normal operation.
 *
 * Usage: Author a block with "mep-lingo" (or legacy "roc-fragment") and a row with "mep-lingo"
 * (or legacy "roc") in the first cell and a fragment link in the second cell.
 * The block will be replaced with either the mep-lingo region or fallback fragment content.
 */
export default function init(el) {
  // This block should have been removed by decorateLinksAsync in utils.js
  // If we reach here, something went wrong - log error and remove the block
  window.lana?.log(
    'ERROR: mep-lingo block was not processed by decorateLinksAsync',
    { tags: 'mep-lingo,error' },
  );
  el.remove();
}
