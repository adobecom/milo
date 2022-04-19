import { html, render } from '../../libs/deps/htm-preact.js';
import accordion from '../../libs/ui/accordion/accordion.js';

const items = [
  {
    title: 'Basics',
    content: html`<div />`,
  },
  {
    title: 'UI',
    content: html`<div />`,
  },
  {
    title: 'Filters',
    content: html`<div />`,
  },
];

export default async function init(el) {
  const key = el.classList[0];
  const title = el.querySelector('h1, h2, h3, h4, h5, h6, p').textContent;

  const app = html`
    <div class=tool-header>
      <div class=tool-title><h1>${title}</h1></div>
    </div>
    <div class=tool-content>
      <div class=config-panel>
        <${accordion} key=${key} items=${items} />
      </div>
      <div class=content-panel>
      </div>
    </div>
  `;

  render(app, el);
}
