import { generateM7Link } from '../m7business/m7business.js';

export default async function init(el) {
  el.href = await generateM7Link([{ name: 'ms', value: 'EDU' }]);
}
