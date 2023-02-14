import { html, useErrorBoundary } from '../../../libs/deps/htm-preact.js';

export default function ErrorBoundary({ children }) {
  const [error] = useErrorBoundary();
  if (error) {
    console.error(error);
    return html`<div class="whole-app">
      <p>Oh no! We ran into an error: ${error.message}</p>
    </div>`;
  }
  return children;
}
