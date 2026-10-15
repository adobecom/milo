import { loadStyle } from '../../utils/utils.js';

const C2_TOKENS = ['tokens.primitives.css', 'tokens.primitives.light.css', 'tokens.semantic.light.css'];

export default function loadC2Tokens(base) {
  return Promise.all(C2_TOKENS.map((file) => new Promise((res) => {
    loadStyle(`${base}/c2/styles/deps/${file}`, res);
  })));
}
