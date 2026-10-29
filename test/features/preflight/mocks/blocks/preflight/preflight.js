import { html, render, useEffect } from '../../../../../../libs/deps/htm-preact.js';

function Report({ el }) {
  useEffect(() => () => window.unmountedReports?.push(el), [el]);
  return html`<p>${document.querySelector('main').textContent}</p>`;
}

export default async function init(el) {
  render(html`<${Report} el=${el} />`, el);
  await window.holdReport?.();
}
