import { getNormalizedMetadata } from '../quiz/utils.js';
// import { createTag, getConfig } from '../../utils/utils.js';

export default async function init(el) {
  const data = getNormalizedMetadata(el);
  console.log('quiz-chat config data', data);
  el.replaceChildren();
}
