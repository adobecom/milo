import { generateM7Link } from '../m7business/m7business.js';

export default function init(el) {
  el.href = generateM7Link([{ name: 'ms', value: 'EDU' }]) || el.href;
}
