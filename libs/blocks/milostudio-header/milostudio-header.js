import { html } from '../../deps/htm-preact.js';

export default function Header() {
  return html`
  <div>
   <div class="milostudio-header-container">
     <a class="milostudio-header-link" href="https://milostudio.adobe.com/#/home">
       <div class="milostudio-header-logo"/>
       <span class="milostudio-header-title">Milo Studio</span>
     </a>
   </div>
  </div>
  `;
}
