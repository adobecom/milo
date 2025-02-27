import { rolloutLang } from '../utils/miloc.js';
import { heading, languages, polling, isLOCV3RolloutFlow } from '../utils/state.js';
import { getModal } from '../../modal/modal.js';
import Modal from './modal.js';
import { createTag } from '../../../utils/utils.js';
import { repo } from '../utils/franklin.js';

export function showUrls(item, prefix) {
  const div = createTag('div');
  const content = Modal(div, item, prefix);
  const modalOpts = {
    class: 'locui-modal',
    id: 'locui-modal',
    content,
    closeEvent: 'closeModal',
  };
  return getModal(null, modalOpts);
}

async function rollout(item, idx) {
  const reroll = item.status === 'completed';
  const retry = item.status === 'error';

  // stop polling until request is done
  polling.value = false;

  // Update the UI immediate instead of waiting on polling
  languages.value[idx].status = retry ? 'retrying' : 'rolling-out';
  languages.value[idx].done = 0;
  languages.value = [...languages.value];

  if (retry) await rolloutLang(item.code, reroll, 'retry', 'Retry.');
  else await rolloutLang(item.code, reroll);

  // start status polling again when request finishes
  polling.value = true;
}

export function showLangErrors(event, item) {
  if (!item.errors?.length
    || event.target.classList.contains('locui-subproject-locale')
    || event.target.classList.contains('locui-urls-heading-warnings')) return null;
  const div = createTag('div');
  const content = Modal(div, item, null, 'error');
  const modalOpts = {
    class: 'locui-modal-errors',
    id: 'locui-modal',
    content,
    closeEvent: 'closeModal',
  };
  return getModal(null, modalOpts);
}

export function getSkippedFileWarnings(item) {
  if (!item.warnings) return null;
  const skipped = item.warnings.filter((warning) => !warning.includes('skip'));
  return skipped;
}

export function showSkippedFiles(item) {
  const div = createTag('div');
  const content = Modal(div, item, null, 'skipped');
  const modalOpts = {
    class: 'locui-modal-skipped',
    id: 'locui-modal',
    content,
    closeEvent: 'closeModal',
  };
  return getModal(null, modalOpts);
}

function createSingleRolloutUrl(item) {
  try {
    const { origin: pageOrigin = '', hostname = '', search = '', protocol = '' } = window.location;
    const milolibs = heading.value.env !== 'prod' ? 'milostudio-stage' : 'milostudio';
    let v3Origin = pageOrigin;
    if (repo === 'milo') {
      const splittedHost = hostname.split('--');
      splittedHost.shift();
      splittedHost.unshift(milolibs);
      v3Origin = `${protocol}//${splittedHost.join('--')}`;
    }
    const url = new URL(`${v3Origin}/tools/locui-create`);
    const searchParams = new URLSearchParams(search);
    const DISCARD_KEYS = ['referrer', 'milolibs'];
    DISCARD_KEYS.forEach((key) => {
      if (searchParams.has(key)) {
        searchParams.delete(key);
      }
    });
    searchParams.append('milolibs', milolibs);
    searchParams.append('env', heading.value.env);
    searchParams.append('workflow', 'promoteRollout');
    searchParams.append('projectKey', heading.value.projectId);
    searchParams.append('language', item.LangCode);
    url.search = searchParams.toString();
    return url;
  } catch (e) {
    console.error('Problem while creating url', e);
    return '';
  }
}

export function handleRollout(item, idx) {
  if (isLOCV3RolloutFlow.value) {
    const createV3Url = createSingleRolloutUrl(item);
    if (createV3Url) { window.open(createV3Url, '_blank', 'noopener noreferrer'); }
  } else {
    rollout(item, idx);
  }
}
