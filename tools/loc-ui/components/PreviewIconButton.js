import { html } from '../../../libs/deps/htm-preact.js';
import IconButton from './IconButton.js';

const PREVIEW_ICON_PATH = 'icons/preview.svg';

export default function PreviewIconButton({ extraCls, alt, onClick, disabled }) {
  return html`<${IconButton} src=${PREVIEW_ICON_PATH} extraCls=${extraCls} alt=${alt} onClick=${onClick} disabled=${disabled} />`;
}
