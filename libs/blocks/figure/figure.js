function buildCaption(pEl) {
  const figCaptionEl = document.createElement('figcaption');
  pEl.classList.add('caption');
  figCaptionEl.append(pEl);
  return figCaptionEl;
}

function getImageCaption(picture) {
  const parentEl = picture.parentNode;
  let caption = parentEl.querySelector('em');
  if (caption) return caption;

  const parentSiblingEl = parentEl.nextElementSibling;
  caption = parentSiblingEl && !parentSiblingEl.querySelector('picture') && parentSiblingEl.querySelector('em') ? parentSiblingEl.querySelector('em') : undefined;
  return caption;
}

function buildFigure(blockEl) {
  const figEl = document.createElement('figure');
  figEl.classList.add('figure');
  Array.from(blockEl.children).forEach((child) => {
    const clone = child.cloneNode(true);
    // picture, video, or embed link is NOT wrapped in P tag
    if (clone.nodeName === 'PICTURE' || clone.nodeName === 'VIDEO' || clone.nodeName === 'A') {
      figEl.prepend(clone);
    } else {
      // content wrapped in P tag(s)
      const picture = clone.querySelector('picture');
      if (picture) {
        figEl.prepend(picture);
      }
      const video = clone.querySelector('video');
      if (video) {
        figEl.prepend(video);
      }
      const caption = clone.querySelector('em');
      if (caption) {
        const figElCaption = buildCaption(caption);
        figEl.append(figElCaption);
      }
      const link = clone.querySelector('a');
      if (link) {
        const img = figEl.querySelector('picture') || figEl.querySelector('video');
        if (img) {
          // wrap picture or video in A tag
          link.textContent = '';
          link.append(img);
        }
        figEl.prepend(link);
      }
    }
  });
  return figEl;
}

export default function init(blockEl) {
  console.log(blockEl.cloneNode(true))
  const children = blockEl.querySelectorAll(':scope > div > div');
  blockEl.innerHTML = '';

  const blockCount = children.length;
  if (!children.length) return;

  // For each child, creates a figure element using the buildFigure function
  // and adds it as a child of the given element
  children.forEach((pic) => {
    const figureEL = buildFigure(pic);
    blockEl.append(figureEL);
  });

  if (blockCount > 1) {
    blockEl.classList.add('figure-list', `figure-list-${blockCount}`);
  }
}

export function buildImagesBlock(section, createTag) {
  const imgEls = section.querySelectorAll('picture');
  if (!imgEls.length) return;

  let currentElementParent = imgEls[0].closest('p');
  const block = createTag('div', { class: 'figure' });
  imgEls.forEach((imgEl, index) => {
    const nextElementParent = imgEls[index + 1]?.closest('p') || null;

    const caption = getImageCaption(imgEl);
    const parentEl = imgEl.closest('p');
    const row = createTag('div', null);
    const col = createTag('div');
    if (!caption) {
      col.append(imgEl.cloneNode(true));
    } else {
      const picture = createTag('p', null, imgEl.cloneNode(true));
      const em = createTag('p', null, caption.cloneNode(true));
      col.append(picture, em);
      caption.remove();
    }

    row.append(col);
    block.append(row);
    if (currentElementParent === nextElementParent) {
      return;
    }

    init(block);
    const clone = block.cloneNode(true);
    parentEl.replaceWith(clone);

    currentElementParent = nextElementParent;
    block.innerHTML = '';
  });
}
