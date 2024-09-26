import { html, render } from '../../deps/htm-preact.js';

// Cutsom Preact component
const App = ({ name, count, onClick } = {}) => {
  return html`<div class="preact-container">
    <h1>Preact Container</h1>
    <h2>Hello ${name}</h2>
    <h2>Count: ${count}</h2>
    <button onClick=${onClick}>Increase count</button>
  </div> `;
};

export default async function init(el, props) {
  const app = html`
    <${App}
      name="${props.name}"
      count="${props.count}"
      onClick=${props.onClick}
    />
  `;
  render(app, el);
}
