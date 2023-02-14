import { html } from '../../../libs/deps/htm-preact.js';
import IconButton from './IconButton.js';

const WORD_ICON_PATH = 'icons/word.svg';

export default function WordIconButton({ extraCls, alt, onClick, disabled }) {
  return html`<${IconButton} src=${WORD_ICON_PATH} extraCls=${extraCls} alt=${alt} onClick=${onClick} disabled=${disabled} />`;
}
