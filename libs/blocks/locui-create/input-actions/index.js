import { getModal } from '../../modal/modal.js';
import Modal from './modal.js';
import { createTag } from '../../../utils/utils.js';

export default function projectCreatedModal() {
  const div = createTag('div');
  const content = Modal(div);
  const modalOpts = { content };
  return getModal(null, modalOpts);
}
