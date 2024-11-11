import { html } from '../../../deps/htm-preact.js';

const Tabs = [
  {
    label: 'Home',
    value: 'home',
  },
  {
    label: 'Plugins',
    value: 'plugins',
  },
  {
    label: 'Analytics',
    value: 'analytics',
  },
];

export default function Sidenav() {
  return html`
  <a href="https://milostudio.adobe.com/#/home" class="nav-link">
    <nav> 
      <ul class="nav-list"> 
        ${Tabs.map(({ value, label }) => (html`
          <li class="nav-item" key=${value}>
            <button class="nav-icon-common ${`nav-icon-${value}`}">some</button>
            <p class="nav-label">${label}</p>
          </li>
        `
  ))}
      </ul>
    </nav> 
  </a>
  `;
}
