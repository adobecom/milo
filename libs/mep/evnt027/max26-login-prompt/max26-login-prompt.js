import { createTag } from '../../../utils/utils.js';
import { decorateBlockBg, decorateBlockText, decorateViewportContent } from '../../../utils/decorate.js';
import { closeModal } from '../../../c2/blocks/modal/modal.js';
import initTrigger from '../login-trigger.js';

function decorate(block, root) {
  const [background, contentRow] = block.children;
  const content = contentRow?.firstElementChild;
  const logo = content?.querySelector(':scope > p:has(picture)');
  const heading = content?.querySelector('h1, h2, h3, h4, h5, h6');
  // DA can serialize copy and CTA lines as one paragraph with explicit breaks.
  content?.querySelectorAll(':scope > p:has(a):has(> br)').forEach((row) => {
    if (row === logo) return;
    const paragraphs = [createTag('p')];
    [...row.childNodes].forEach((node) => {
      if (node.nodeName === 'BR') paragraphs.push(createTag('p'));
      else paragraphs.at(-1).append(node);
    });
    row.replaceWith(...paragraphs.filter((paragraph) => (
      paragraph.textContent.trim() || paragraph.querySelector('picture, img')
    )));
  });
  const rows = [...(content?.children ?? [])];
  const lastRow = rows.at(-1);
  const previousRow = rows.at(-2);
  const hasGuest = !!previousRow?.querySelector('a') && !!lastRow?.querySelector('a');
  const signInRow = hasGuest ? previousRow : lastRow;
  const guestRow = hasGuest ? lastRow : null;
  const signIn = signInRow?.querySelector('a');
  const guest = guestRow?.querySelector('a');
  if (!background?.querySelector('picture') || !logo || !heading || !signIn) {
    throw new Error('max26-login-prompt requires background artwork, a logo, a heading, and a primary link.');
  }

  // Authors supply desktop artwork first; the shared background helper is mobile-first.
  if (background.children.length === 2) {
    background.replaceChildren(...[...background.children].reverse());
  }
  decorateBlockBg(block, background, { className: 'max26-login-prompt-background' });
  background.setAttribute('aria-hidden', 'true');
  background.querySelectorAll('img').forEach((img) => { img.alt = ''; });

  content.classList.add('max26-login-prompt-foreground');
  logo.classList.add('max26-login-prompt-logo');
  const copy = createTag('div', { class: 'max26-login-prompt-copy' });
  copy.append(...[...content.children].filter((child) => (
    child !== logo && child !== signInRow && child !== guestRow
  )));
  const actions = createTag('div', { class: 'max26-login-prompt-actions' });
  actions.append(...(guestRow ? [signInRow, guestRow] : [signInRow]));
  const body = createTag('div', { class: 'max26-login-prompt-body' }, [copy, actions]);
  content.replaceChildren(logo, body);
  block.replaceChildren(background, content);
  decorateBlockText(content, { heading: '2', body: 'lg', button: 'md' });

  signIn.classList.remove('blue', 'outline');
  signIn.classList.add('con-button', 'fill', 'button-md', 'max26-login-prompt-sign-in');
  if (guest) {
    const guestAttributes = Object.fromEntries([...guest.attributes]
      .filter(({ name }) => name.startsWith('aria-') || name.startsWith('daa-'))
      .map(({ name, value }) => [name, value]));
    const guestButton = createTag('button', {
      ...guestAttributes,
      type: 'button',
      class: 'max26-login-prompt-guest',
    });
    guestButton.append(...guest.childNodes);
    guestRow.replaceChildren(guestButton);
  }

  const dialog = root.closest('.dialog-modal');
  if (dialog) {
    heading.id = `${dialog.id}-max26-login-prompt-heading`;
    dialog.setAttribute('aria-labelledby', heading.id);
  }
}

export default function init(el) {
  decorateViewportContent(el, decorate);
  el.addEventListener('click', (event) => {
    if (!event.target.closest('.max26-login-prompt-guest')) return;
    const dialog = el.closest('.dialog-modal');
    if (dialog) closeModal(dialog);
  });
  const fragment = el.closest('.fragment[data-path]');
  if (fragment?.isConnected && !el.closest('.dialog-modal')) {
    fragment.hidden = true;
    initTrigger({ path: fragment.dataset.path, content: fragment });
  }
}
