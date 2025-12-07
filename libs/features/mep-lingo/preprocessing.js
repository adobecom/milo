/**
 * Processes anchors for mep-lingo preprocessing.
 * This must happen before async link processing to ensure proper fragment handling.
 * @param {HTMLCollection} anchors - Collection of anchor elements to process
 * @param {Function} createTag - Function to create DOM elements
 */
export default function processMepLingoAnchors(anchors, createTag) {
  [...anchors].forEach((a) => {
    let isMLBlockSwap = false;
    let linkCell = a.parentElement;
    const parentTag = linkCell?.tagName?.toLowerCase();
    if (parentTag === 'strong' || parentTag === 'em') {
      linkCell = linkCell.parentElement;
    }
    const previousCell = linkCell?.previousElementSibling;
    const cellText = previousCell?.textContent?.toLowerCase().trim();
    const isMLRow = cellText === 'mep-lingo';

    if (isMLRow) {
      const swapBlock = a.closest('[class]');
      if (swapBlock) {
        const blockName = swapBlock.classList[0];

        if (blockName === 'mep-lingo') {
          const p = createTag('p', null, a);
          a.dataset.mepLingo = true;
          swapBlock.insertAdjacentElement('afterend', p);
          swapBlock.remove();
        } else {
          isMLBlockSwap = true;
          const row = linkCell.parentElement;
          row.remove();
          const p = createTag('p', null, a);
          if (blockName === 'section-metadata') {
            a.dataset.mepLingoSectionMetadata = true;
            a.dataset.removeOriginalBlock = true;
            a.dataset.originalBlockId = `block-${Math.random().toString(36).substring(2, 11)}`;
            swapBlock.dataset.mepLingoOriginalBlock = a.dataset.originalBlockId;
            swapBlock.insertAdjacentElement('afterend', p);
          } else {
            a.dataset.removeOriginalBlock = true;
            a.dataset.originalBlockId = `block-${Math.random().toString(36).substring(2, 11)}`;
            swapBlock.dataset.mepLingoOriginalBlock = a.dataset.originalBlockId;
            swapBlock.insertAdjacentElement('afterend', p);
          }
          if (a.href.includes('#_mep-lingo')) a.href = a.href.replace('#_mep-lingo', '');
          a.dataset.mepLingoBlockFragment = a.href;
          a.dataset.mepLingo = true;
        }
      }
    }

    if (a.href.includes('#_mep-lingo') && !isMLBlockSwap) {
      a.dataset.mepLingo = true;
      a.href = a.href.replace('#_mep-lingo', '');
    }
  });
}
