import { html, render } from '../../../deps/htm-preact.js';

function Modal({ errFrag }) {
  return html`
  <div class="locui-fragment-modal">
   ${errFrag && Object.keys(errFrag).length > 0 && Object.keys(errFrag).map((errKey) => html`<div class=locui-create-error>
    <h2>${errKey}</h2>
    <div class='locui-create-error-frag-list'>
    ${errFrag[errKey].map((errFragPath) => html`<div>${errFragPath}</div>`)}
    </div>
    </div>`)}
  </div>
  `;
}

export default function renderModal(el, errFrag) {
  render(html`<${Modal} errFrag=${errFrag} />`, el);
  return el;
}
