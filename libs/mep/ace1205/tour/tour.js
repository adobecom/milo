import { decorateBlockText, decorateTextOverrides } from '../../../utils/decorate.js';
import { createTag, getFederatedUrl } from '../../../utils/utils.js';

/*
 * Explicit C2 text config.  The module-level `isC2` constant in decorate.js
 * is evaluated once at first import — if that happens before the fragment's
 * metadata is processed, `isC2` stays false and body text gets `body-s`
 * instead of `body-md`.  Since this IS a C2 block we always pass the
 * C2 config directly to bypass the cached constant.
 */
const C2_TEXT_CONFIG = { heading: '6', body: 'sm', button: 'lg' };

const isSvgUrl = (url) => /\.svg(\?.*)?$/i.test(url || '');

function decorateSection(block) {
  const rows = [...block.children];
  // Row 0 = modal header (eyebrow + headline); rows 1+ = scrollable content sections.
  const headerRow = rows[0];
  const sectionRows = rows.slice(1);
  const total = sectionRows.length;

  // Build the sticky modal title bar from the header row.
  let modalTitle = null;
  if (headerRow) {
    const headerTextCell = headerRow.children[0];
    if (headerTextCell) {
      decorateBlockText(headerTextCell, C2_TEXT_CONFIG);

      // decorateBlockText uses the module-level isC2 constant for class
      // prefixes, so even with C2_TEXT_CONFIG the heading gets 'heading-2'
      // (C1) instead of 'title-2' (C2) and the eyebrow is skipped.
      // Fix the classes for this C2 block.
      const heading = headerTextCell.querySelector('h1, h2, h3, h4, h5, h6');
      if (heading) {
        heading.className = heading.className.replace(/\bheading-\S+/g, '');
        heading.classList.add(`title-${C2_TEXT_CONFIG.heading}`);
        const prevSib = heading.previousElementSibling;
        if (prevSib && !prevSib.querySelector('picture')) {
          prevSib.classList.add('eyebrow');
        }
      }

      const children = [...headerTextCell.children];
      if (children.length) {
        modalTitle = createTag('div', { class: 'tour-title' });
        children.forEach((child) => modalTitle.append(child));
      }
    }
  }

  // Extract one sticky CTA from the first section row only.
  // Figma spec: a single frosted CTA bar sticks at the bottom of the modal.
  // The CTA supports variants via block-level classes (e.g., tour (arrow-down)):
  //   arrow-down, arrow-left, arrow-up — arrow direction
  //   size-small — smaller 24px icons
  //   full-width — stretches CTA to 100% width
  //   no-icon — text + arrow only (hides product icon)
  let modalCta = null;

  const sections = sectionRows.map((row, index) => {
    const cells = [...row.children];
    const textCell = cells[0];
    const mediaCell = cells[1];

    // DA may store cell text as bare text nodes (no <p> wrapper) depending on
    // how content was authored.  Element.children only returns element nodes, so
    // bare text nodes would be silently dropped when we spread textCell.children
    // into the content div.  Normalise them into <p> elements first.
    [...textCell.childNodes].forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        const p = createTag('p', {});
        node.replaceWith(p);
        p.append(node);
      }
    });

    decorateBlockText(textCell, C2_TEXT_CONFIG);

    // Section rows contain body copy only.  decorateBlockText may add .eyebrow
    // to the element immediately before the first heading; remove it from that
    // specific element only (not the whole subtree — authored eyebrow components survive).
    const firstHeading = textCell.querySelector('h1, h2, h3, h4, h5, h6');
    firstHeading?.previousElementSibling?.classList.remove('eyebrow');
    textCell.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((h) => h.remove());

    // Strip CTA-style links from every section row.
    // Only the first row's CTA is promoted to the modal-level sticky bar;
    // links in later rows are removed to prevent unstyled buttons leaking into content.
    let actionArea = textCell.querySelector('.action-area');
    if (!actionArea) {
      const paras = [...textCell.querySelectorAll('p')].reverse();
      actionArea = paras.find(
        (p) => p.querySelector('a')
          && p.textContent.trim() === p.querySelector('a')?.textContent.trim(),
      ) ?? null;
    }
    if (actionArea) {
      // Pull any icon <img> into the <a> so the promo-cta component
      // renders icon + label together.  DA may author the icon either
      // as a separate <p> preceding the CTA paragraph, or inline
      // inside the same <p> as a sibling of the <a>.
      const link = actionArea.querySelector('a');
      if (link) {
        let prev = actionArea.previousElementSibling;
        if (!prev?.querySelector('picture, img')) {
          prev = prev?.previousElementSibling;
        }
        const icon = prev?.querySelector('img');
        if (icon) {
          if (icon.hasAttribute('src') && isSvgUrl(icon.src)) {
            icon.src = getFederatedUrl(icon.getAttribute('src'));
          }
          prev.remove();
          link.prepend(icon);
        } else {
          const inlineIcon = actionArea.querySelector('picture img');
          if (inlineIcon) {
            if (inlineIcon.hasAttribute('src') && isSvgUrl(inlineIcon.src)) {
              inlineIcon.src = getFederatedUrl(inlineIcon.getAttribute('src'));
            }
            inlineIcon.closest('picture')?.remove();
            link.prepend(inlineIcon);
          }
        }
      }
      actionArea.remove();
      if (index === 0 && link) {
        link.classList.remove('con-button', 'blue', 'outline', 'fill', 'button-lg', 'button-md', 'button-sm');
        link.classList.add('promo-cta');
        link.setAttribute('daa-ll', link.textContent.trim());

        // Create icon button element
        const iconButton = createTag('span', {
          class: 'icon-button arrow',
          'aria-hidden': 'true',
        });

        // Apply arrow direction variants from block-level classes
        if (block.classList.contains('arrow-down')) {
          iconButton.classList.add('down');
        } else if (block.classList.contains('arrow-left')) {
          iconButton.classList.add('left');
        } else if (block.classList.contains('arrow-up')) {
          iconButton.classList.add('up');
        }
        // Default is right arrow (no additional class needed)

        // Apply size variant
        if (block.classList.contains('size-small')) {
          link.classList.add('size-small');
          iconButton.classList.add('small');
        }

        // Apply other variants
        if (block.classList.contains('full-width')) {
          link.classList.add('full-width');
        }

        // Append icon button to link (unless no-icon variant)
        if (!block.classList.contains('no-icon')) {
          link.append(iconButton);
        } else {
          link.classList.add('no-icon');
        }

        modalCta = createTag('div', { class: 'tour-cta' });
        modalCta.append(actionArea);
      }
    }

    // Counter: ( X/Y )
    const counter = createTag('div', { class: 'tour-counter' });
    counter.textContent = `( ${index + 1}/${total} )`;

    // Content area: counter first, then remaining paragraph nodes.
    const content = createTag('div', { class: 'tour-content' });
    content.append(counter, ...textCell.children);

    // Media area: first picture is artwork, additional pictures
    // become transition elements placed after the section.
    const media = createTag('div', { class: 'tour-media' });
    const mediaPics = mediaCell
      ? [...mediaCell.querySelectorAll('picture')] : [];
    if (mediaPics.length) media.append(mediaPics[0]);

    const section = createTag('section', {
      class: 'tour-section',
      'aria-label': `Section ${index + 1} of ${total}`,
    });
    section.append(content, media);

    // Extra pictures become transition elements between sections.
    const transition = mediaPics.length > 1
      ? createTag('div', { class: 'tour-transition' })
      : null;
    if (transition) mediaPics.slice(1).forEach((p) => transition.append(p));
    section.transition = transition;

    return section;
  });

  block.replaceChildren();
  if (modalTitle) block.append(modalTitle);
  sections.forEach((section) => {
    block.append(section);
    // Transition elements sit between sections (full modal width, centred).
    if (section.transition) block.append(section.transition);
  });
  // Sticky CTA sits after all sections, pinned to modal viewport bottom.
  if (modalCta) block.append(modalCta);
}

export default function init(el) {
  el.setAttribute('daa-lh', 'tour');
  decorateSection(el);
  // Apply any text-size override modifier classes authored on the block element
  // (e.g. title-xl, body-lg) — previously handled by decorateViewportContent.
  decorateTextOverrides(el);
}
