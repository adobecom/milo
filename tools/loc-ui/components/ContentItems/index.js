import { html } from '../../../../libs/deps/htm-preact.js';
import { useProgressState } from '../../wrappers/ProgressStateWrapper.js';
import ItemGrid from './ItemGrid.js';

export default function ContentItems() {
  const { allItems } = useProgressState();
  return html`<${ItemGrid} allItems=${allItems} />`;
}
