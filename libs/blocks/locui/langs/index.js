import { postReqLang } from '../utils/miloc.js';
import { languages } from '../utils/state.js';
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

  // Update the UI immediate instead of waiting on polling
  languages.value[idx].status = 'rolling-out';
  languages.value[idx].done = 0;
  languages.value = [...languages.value];

  if (item.status === 'error') await postReqLang(item.code, reroll, 'retry', 'Retry.');
  else await postReqLang(item.code, reroll);
}

export function showLangErrors(event, item) {
  if (!item.errors.length
    || event.target.classList.contains('locui-subproject-locale')) return null;
  const div = createTag('div');
  const content = Modal(div, item, null, item);
  const modalOpts = {
    class: 'locui-modal-errors',
    id: 'locui-modal',
    content,
    closeEvent: 'closeModal',
  };
  return getModal(null, modalOpts);
}
