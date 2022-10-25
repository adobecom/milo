import { html, render } from '../../deps/htm-preact.js';
import DashboardApp from './app.js';

export default function init(el) {
  const app = html`<${DashboardApp} /`;
  render(app, el);
}
