/**
 * decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function init(header) {
  const navPath = '/nav';
  const resp = await fetch(`${navPath}.plain.html`);
  const html = await resp.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const nav = document.createElement('nav');
  nav.setAttribute('role', 'navigation');

  const toggle = document.createElement('button');
  toggle.classList.add('nav-toggle');

  nav.append(toggle, ...doc.querySelectorAll('div > *'));

  header.append(nav);
}
