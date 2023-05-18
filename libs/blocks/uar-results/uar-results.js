import { createTag } from '../../utils/utils.js';
import { getMetadata, handleStyle } from '../section-metadata/section-metadata.js';

async function loadFragments(el, experiences) {
  // eslint-disable-next-line no-restricted-syntax
  for (const href of experiences) {
    /* eslint-disable no-await-in-loop */
    const a = createTag('a', { href });
    el.append(a);
    const { default: createFragment } = await import('../fragment/fragment.js');
    await createFragment(a);
  }
}

function redirectPage(quizUrl, debug, message) {
  const url = (quizUrl) ? quizUrl.text : 'https://adobe.com';
  window.lana.log(message);

  if (debug === 'uar') {
    // eslint-disable-next-line no-console
    console.log(`${message}, redirecting to: ${url}`);
  } else {
    window.location = url;
  }
}

function setAnalytics(hashValue, debug) {
  /* eslint-disable no-underscore-dangle */
  window.alloy_load ??= {};
  window.alloy_load.data ??= {};
  window.alloy_all ??= {};
  window.alloy_all.data ??= {};
  window.alloy_all.data._adobe_corpnew ??= {};
  window.alloy_all.data._adobe_corpnew.digitalData ??= {};
  window.alloy_all.data._adobe_corpnew.digitalData.page ??= {};
  window.alloy_all.data._adobe_corpnew.digitalData.page.pageInfo ??= {};
  window.alloy_all.data._adobe_corpnew.digitalData.page.pageInfo.customHash = hashValue;
  if (debug === 'uar') {
    // eslint-disable-next-line no-console
    console.log(`Setting a custom hash for pageload to: ${window.alloy_all.data._adobe_corpnew.digitalData.page.pageInfo.customHash}`);
  }
}

export const loadingErrorText = 'Could not load UAR results:';

export default async function init(el, debug = null, localStoreKey = null) {
  const data = getMetadata(el);
  const metaData = el.querySelectorAll('div');
  const params = new URL(document.location).searchParams;
  const quizUrl = data['quiz-url'];
  const BASIC_KEY = 'basicFragments';
  const NESTED_KEY = 'nestedFragments';
  const HASH_KEY = 'pageloadHash';

  /* eslint-disable no-param-reassign */
  // handle these two query param values in this way to facilitate unit tests
  localStoreKey ??= params.get('quizKey');
  debug ??= params.get('debug');

  let results = localStorage.getItem(localStoreKey);
  if (!results) {
    redirectPage(quizUrl, debug, `${loadingErrorText} local storage missing`);
    return;
  }
  results = JSON.parse(results);

  if (data['nested-fragments'] && el.classList.contains('nested')) {
    const nested = results[NESTED_KEY][data['nested-fragments'].text];
    if (nested) loadFragments(el, nested);
  } else if (el.classList.contains('basic')) {
    const basic = results[BASIC_KEY];
    const pageloadHash = results[HASH_KEY];

    if (!basic) {
      redirectPage(quizUrl, debug, `${loadingErrorText} Basic fragments are missing`);
      return;
    }

    if (pageloadHash) {
      setAnalytics(pageloadHash, debug);
    }

    loadFragments(el, basic);
  } else {
    return;
  }

  // eslint-disable-next-line no-restricted-syntax
  for (const div of metaData) {
    div.remove();
  }

  if (data.style) {
    el.classList.add('section');
    handleStyle(data.style.text, el);
  }
  el.classList.add('show');
}
