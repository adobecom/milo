import { decorateBlockText, decorateTextOverrides } from '../../../utils/decorate.js';
import { createTag } from '../../../utils/utils.js';

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
      decorateBlockText(headerTextCell);
      const children = [...headerTextCell.children];
      if (children.length) {
        modalTitle = createTag('div', { class: 'hub-hero-modal-title' });
        children.forEach((child) => modalTitle.append(child));
      }
    }
  }

  // Extract one sticky CTA from the first section row only.
  // Figma spec: a single frosted CTA bar sticks at the bottom of the modal.
  let modalCta = null;

  const sections = sectionRows.map((row, index) => {
    const cells = [...row.children];
    const textCell = cells[0];
    const mediaCell = cells[1];

    decorateBlockText(textCell);

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
        (p) => p.querySelector('a') && p.textContent.trim() === p.querySelector('a')?.textContent.trim(),
      ) ?? null;
    }
    if (actionArea) {
      actionArea.remove();
      if (index === 0) {
        modalCta = createTag('div', { class: 'hub-hero-modal-cta' });
        modalCta.append(actionArea);
      }
    }

    // Counter: ( X/Y )
    const counter = createTag('div', { class: 'hub-hero-modal-counter' });
    counter.textContent = `( ${index + 1}/${total} )`;

    // Content area: counter first, then remaining paragraph nodes.
    const content = createTag('div', { class: 'hub-hero-modal-content' });
    content.append(counter, ...textCell.children);

    // Media area: picture/video only — no per-section CTA overlay.
    const media = createTag('div', { class: 'hub-hero-modal-media' });
    if (mediaCell) media.append(...mediaCell.children);

    const section = createTag('section', {
      class: 'hub-hero-modal-section',
      'aria-label': `Section ${index + 1} of ${total}`,
    });
    section.append(content, media);
    return section;
  });

  block.replaceChildren();
  if (modalTitle) block.append(modalTitle);
  block.append(...sections);
  // Sticky CTA sits outside the scrollable sections, pinned to modal bottom.
  if (modalCta) block.append(modalCta);
}

export default function init(el) {
  el.setAttribute('daa-lh', 'hub-hero-modal');
  decorateSection(el);
  // Apply any text-size override modifier classes authored on the block element
  // (e.g. title-xl, body-lg) — previously handled by decorateViewportContent.
  decorateTextOverrides(el);
}
