import { html } from '../../../../libs/deps/htm-preact.js';
import { useProgressState } from '../../wrappers/ProgressStateWrapper.js';

export default function ProjectHeader() {
  const { projectName } = useProgressState();
  return html`<div class="mb-5">
    <h5>PROJECT</h5>
    <h2>${projectName}</h2>
  </div>`;
}
