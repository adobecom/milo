const modalRoots = new Map();
const rootLocks = new Map();
let pausedLenis;

function releaseRoot(modal) {
  const root = modalRoots.get(modal);
  if (!root) return;
  modalRoots.delete(modal);
  if ([...modalRoots.values()].includes(root)) return;
  if (!rootLocks.get(root)) root.classList.remove('disable-scroll');
  rootLocks.delete(root);
}

function releaseDisconnectedModals() {
  for (const modal of modalRoots.keys()) {
    if (!modal.isConnected || (modal.tagName === 'DIALOG' && !modal.open)) releaseRoot(modal);
  }
  if (!modalRoots.size && !document.querySelector('.modal-curtain, dialog.dialog-modal[open]')) {
    pausedLenis?.start();
    pausedLenis = undefined;
  }
}

export function lockModalScroll(modal, root = document.documentElement) {
  releaseDisconnectedModals();
  if (modalRoots.has(modal)) return;
  if (!modalRoots.size && window.lenis?.isStopped !== true) {
    pausedLenis = window.lenis;
    pausedLenis?.stop();
  }
  if (!rootLocks.has(root)) rootLocks.set(root, root.classList.contains('disable-scroll'));
  modalRoots.set(modal, root);
  root.classList.add('disable-scroll');
}

export function unlockModalScroll(modal) {
  releaseRoot(modal);
  releaseDisconnectedModals();
}

window.addEventListener('milo:modal:closed', () => {
  queueMicrotask(releaseDisconnectedModals);
});
