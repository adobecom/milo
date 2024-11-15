import { html, render } from '../../../deps/htm-preact.js';

function Modal({ errFrag }) {
  return html`
  <div class="locui-create-fragment-modal">
   ${errFrag && Object.keys(errFrag).length > 0 && Object.keys(errFrag).map((errKey) => html`<div class=locui-create-error>
    <h3>${errKey}</h3>
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
