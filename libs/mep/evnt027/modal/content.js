import { createTag } from '../../../utils/utils.js';
import { decorateBlockBg, decorateBlockText, decorateViewportContent } from '../../../utils/decorate.js';
import { closeModal } from '../../../c2/blocks/modal/modal.js';

function decorate(block) {
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
  const links = [...(content?.querySelectorAll('a') ?? [])]
    .filter((link) => !logo?.contains(link));
  const guest = links.find((link) => link.hash === '#guest');
  const signIn = guest ? links[links.indexOf(guest) - 1] : links.at(-1);
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
  const signInRow = createTag('p', null, signIn);
  const guestRow = guest ? createTag('p', null, guest) : null;
  const copy = createTag('div', { class: 'max26-login-prompt-copy' });
  copy.append(...[...content.children].filter((child) => (
    child !== logo && (child.tagName !== 'P'
      || child.textContent.trim() || child.querySelector('picture, img'))
  )));
  const actions = createTag('div', { class: 'max26-login-prompt-actions' });
  actions.append(...(guestRow ? [signInRow, guestRow] : [signInRow]));
  const body = createTag('div', { class: 'max26-login-prompt-body' }, [copy, actions]);
  content.replaceChildren(logo, body);
  block.replaceChildren(background, content);
  decorateBlockText(content, { heading: '2', body: 'lg', button: 'md' });

  signIn.classList.remove('blue', 'outline');
  signIn.classList.add('con-button', 'fill', 'button-md', 'max26-login-prompt-sign-in');
  signIn.setAttribute('daa-ll', guest ? 'Register/Sign in|Login Modal' : 'Sign up|Login Modal');
  if (guest) {
    const guestAttributes = Object.fromEntries([...guest.attributes]
      .filter(({ name }) => name.startsWith('aria-') || name.startsWith('daa-'))
      .map(({ name, value }) => [name, value]));
    const guestButton = createTag('button', {
      ...guestAttributes,
      type: 'button',
      class: 'max26-login-prompt-guest',
      'daa-ll': 'Continue as guest|Login Modal',
    });
    guestButton.append(...guest.childNodes);
    guestRow.replaceChildren(guestButton);
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
