import decorate from '../../../../blocks/rich-content/rich-content.js';

const SET_CLASS = 'reimagined-acom';
const SWAPS = {};

const tag = (x, el) => {
  if (x && x !== el && x.classList) x.classList.add(SET_CLASS);
  return x;
};

const swap = (el) => {
  const s = SWAPS[el.classList[0]];
  if (s) {
    el.classList.remove(...s.drop);
    el.classList.add(...s.add);
  }
};

// The set's class goes on before the family decorates, and on the block it returns.
export default function spectrum2Set(el, ...a) {
  swap(el);
  el.classList.add(SET_CLASS);
  const r = decorate(el, ...a);
  return r && typeof r.then === 'function' ? r.then((x) => tag(x, el)) : tag(r, el);
}
