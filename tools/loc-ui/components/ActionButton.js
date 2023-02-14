import { html } from '../../../libs/deps/htm-preact.js';
import Button from './Button.js';
import { loadStyle } from '../../../libs/utils/utils.js';

loadStyle('components/ActionButton.css');

export default function ActionButton({ children, onClick, disabled }) {
  const extraCls = ['action-button'];
  if (disabled) extraCls.push('action-button-disabled');
  return html`<${Button} onClick=${onClick} extraCls=${extraCls} disabled=${disabled}>${children}</${Button}>`;
}
