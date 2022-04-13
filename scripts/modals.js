import getFragment from '../blocks/fragment/fragment.js';

export default function modals() {
  window.addEventListener('hashchange', () => {
    const a = document.querySelector(`a[data-modal-hash="${window.location.hash}"]`);
    const wrapper = document.createElement('div');
    const linkBlock = document.createElement('a');
    linkBlock.href = a.dataset.modalPath;
    getFragment(linkBlock);
    wrapper.append(linkBlock);
    wrapper.className = 'modal-wrapper';
    document.body.append(wrapper);
  });
}
