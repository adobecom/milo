import { getModal } from '../../modal/modal.js';
import Modal from './modal.js';
import { createTag } from '../../../utils/utils.js';

export default function showFragments(errorFragments) {
  const div = createTag('div');
  const errFragDict = errorFragments.reduce((acc, curr) => {
    if (acc[curr.valid]) {
      acc[curr.valid] = [...acc[curr.valid], curr?.pathname];
      return acc;
    }
    acc[curr.valid] = [curr?.pathname];
    return acc;
  }, {});
  const content = Modal(div, errFragDict);
  const modalOpts = {
    class: '',
    id: 'locui-create-fragment-modal',
    content,
    closeEvent: 'closeModal',
  };
  return getModal(null, modalOpts);
}
