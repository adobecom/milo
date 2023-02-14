import { html } from '../../../libs/deps/htm-preact.js';

export default function Button({ children, onClick, extraCls, disabled }) {
  let cls = disabled ? 'opacity-50' : 'clickable';
  if (extraCls) {
    extraCls.forEach((extra) => {
      cls += ` ${extra}`;
    });
  }
  cls = cls.trim();
  const onClickHandler = disabled ? null : onClick;
  return html`<button class=${cls} onClick=${onClickHandler}>${children}</button>`;
}
