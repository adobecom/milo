import SyncLangStoreModal from '../actions/modal.js';
import { urls } from '../utils/state.js';

export function getModalByType(type) {
  const modal = {};
  // config future modals here
  switch (type) {
    case 'startSync':
      modal.renderContent = SyncLangStoreModal;
      modal.title = `Sync to Langstore (${urls.value[0].langstore.lang})?`;
      break;
    default:
      break;
  }
  return modal;
}

export default getModalByType;
