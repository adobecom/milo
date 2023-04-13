/* eslint-disable no-await-in-loop */
import { createTag } from '../../utils/utils.js';
import { getMetadata, handleStyle } from '../section-metadata/section-metadata.js';

async function loadFragments(el, experiences) {
  // eslint-disable-next-line no-restricted-syntax
  for (const href of experiences) {
    const a = createTag('a', { href });
    el.append(a);
    const { default: createFragment } = await import('../fragment/fragment.js');
    await createFragment(a);
  }
}

function redirectPage(quizUrl) {
  const url = (quizUrl) ? quizUrl.text : 'https://adobe.com';
  console.log(`Invalid Result, redirecting to: ${url}`);
}

export default async function init(el) {
  const data = getMetadata(el);
  const metaData = el.querySelectorAll('div');
  const params = new URL(document.location).searchParams;
  const localStoreKey = params.get('quizKey');
  const quizUrl = data['quiz-url'];

  let results = localStorage.getItem(localStoreKey);

  for( const div of metaData){
    div.remove();
  }

  if (!results) {
    redirectPage(quizUrl);
    return
  }

  results = JSON.parse(results);

  if(data['nested-fragments'] && el.classList.contains('nested')) {
    const nested = results[data['nested-fragments'].text];
    if (nested) loadFragments(el, nested);
  } else if (el.classList.contains('basic')) {
    const structure = results['structure-fragments'];
    if (!structure) { 
      redirectPage(quizUrl);
      return
    }
    loadFragments(el, structure);
  } else {
    return
  }
  
  if(data.style) {
    el.classList.add('section');
    handleStyle(data.style.text, el);
  }
  el.classList.add('show');
}
