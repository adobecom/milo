import { html } from '../../../libs/deps/htm-preact.js';
import IconButton from './IconButton.js';

const GLOBE_ICON_PATH = 'icons/globe.svg';

export default function GlobeIconButton({ extraCls, alt, onClick }) {
  return html`<${IconButton} src=${GLOBE_ICON_PATH} extraCls=${extraCls} alt=${alt} onClick=${onClick} />`;
}
