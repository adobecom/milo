
import { getModal } from '../../../modal/modal.js';
import Modal from './modal.js';
import { createTag } from '../../../../utils/utils.js';

export function showFragments() {
  const div = createTag('div');
  const content = Modal(div);
  const modalOpts = {
    class: 'locui-fragment-modal',
    id: 'locui-fragment-modal',
    content,
    closeEvent: 'closeModal',
  };
  return getModal(null, modalOpts);
}