function buildCaption(pEl) {
  const figCaptionEl = document.createElement('figcaption');
  pEl.classList.add('caption');
  figCaptionEl.append(pEl);
  return figCaptionEl;
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
