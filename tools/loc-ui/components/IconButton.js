import { html } from '../../../libs/deps/htm-preact.js';
import Button from './Button.js';

const ICON_IMG_CLASS_NAME = 'icon-button';

export default function IconButton({ src, extraCls, alt, onClick, disabled }) {
  return html`<${Button} extraCls=${extraCls} onClick=${onClick} disabled=${disabled}>
    <img alt=${alt} src=${src} class=${ICON_IMG_CLASS_NAME} />
  </${Button}>`;
}
