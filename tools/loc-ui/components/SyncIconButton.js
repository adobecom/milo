import { html } from '../../../libs/deps/htm-preact.js';
import IconButton from './IconButton.js';

const SYNC_ICON_PATH = 'icons/sync.svg';

export default function SyncIconButton({ extraCls, alt, onClick, disabled }) {
  return html`<${IconButton} src=${SYNC_ICON_PATH} extraCls=${extraCls} alt=${alt} onClick=${onClick} disabled=${disabled} />`;
}
