import { findDeepFragments } from '../../locui/actions/index.js';
import { validateUrlsFormat } from '../../locui/loc/index.js';
import { getModal } from '../../modal/modal.js';
import Modal from './modal.js';
import { createTag } from '../../../utils/utils.js';

export async function findFragments(urls) {
  const fragmentUrls = urls.map((url) => findDeepFragments(url.pathname));
  const pageFragments = await Promise.all(fragmentUrls);
  const foundFragmentsDict = pageFragments.reduce((acc, fragments, index) => {
    if (fragments.length > 0) {
      fragments.forEach((fragment) => {
        if (acc[fragment.pathname]) {
          acc[fragment.pathname].parentPages.push(urls[index]);
          return acc;
        }
        fragment.parentPages = [urls[index]?.href];
        acc[fragment.pathname] = fragment;
        return acc;
      });
    }
    return acc;
  }, {});
  const foundFragments = Object.values(foundFragmentsDict);
  return validateUrlsFormat(foundFragments, true);
}

export function showFragments(errorFragments) {
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
    class: 'locui-create-fragment-modal',
    id: 'locui-create-fragment-modal',
    content,
    closeEvent: 'closeModal',
  };
  return getModal(null, modalOpts);
}
