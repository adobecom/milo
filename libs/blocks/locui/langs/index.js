import { rolloutLang } from '../utils/miloc.js';
import { languages, polling } from '../utils/state.js';
import { getModal } from '../../modal/modal.js';
import Modal from './modal.js';
import { createTag } from '../../../utils/utils.js';

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

export async function rollout(item, idx) {
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
