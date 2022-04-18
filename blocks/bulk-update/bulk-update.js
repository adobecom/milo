import { html, render } from '../../libs/deps/htm-preact.js';
import Accordion from '../../libs/ui/Accordion.js';

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
  const title = el.querySelector('h1, h2, h3, h4, h5, h6, p').textContent;

  const app = html`
    <div class=tool-header>
      <div class=tool-title><h1>${title}</h1></div>
    </div>
    <div class=tool-content>
      <div class=config-panel>
        <${Accordion} items=${items} />
      </div>
      <div class=content-panel>
      </div>
    </div>
  `;

  render(app, el);
}
