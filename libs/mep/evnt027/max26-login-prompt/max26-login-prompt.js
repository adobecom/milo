import { createTag } from '../../../utils/utils.js';
import { decorateBlockBg, decorateBlockText, decorateViewportContent } from '../../../utils/decorate.js';
import { closeModal } from '../../../c2/blocks/modal/modal.js';

function decorate(block, root) {
  const isPost = root.classList.contains('post');
  const [background, contentRow] = block.children;
  const content = contentRow?.firstElementChild;
  const logo = content?.querySelector(':scope > p:has(picture)');
  const heading = content?.querySelector('h1, h2, h3, h4, h5, h6');
  const [signInRow, guestRow] = [...(content?.children ?? [])].slice(isPost ? -1 : -2);
  const signIn = signInRow?.querySelector('a');
  const guest = guestRow?.querySelector('a');
  if (!background?.querySelector('picture') || !logo || !heading || !signIn || (!isPost && !guest)) {
    throw new Error('max26-login-prompt requires background artwork, a logo, a heading, and a primary link, plus a guest link for the live variant.');
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
  actions.append(...(isPost ? [signInRow] : [signInRow, guestRow]));
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
}
