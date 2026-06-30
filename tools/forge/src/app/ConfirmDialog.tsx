import { useUiState } from './UiStateContext';
import styles from './ConfirmDialog.module.css';

export function ConfirmDialog() {
  const { state, dispatch } = useUiState();

  const isOpen = state.modal === 'confirm';
  const payload = state.confirmPayload;

  function handleClose() {
    dispatch({ type: 'closeModal' });
  }

  function handleConfirm() {
    handleClose();
    payload?.onConfirm();
  }

  if (!isOpen || !payload) return null;

  return (
    <div
      className={styles.backdrop}
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div role="alertdialog" aria-modal aria-labelledby="confirm-title" className={styles.dialog}>
        <h3 id="confirm-title" className={styles.title}>{payload.title}</h3>
        <p className={styles.message}>{payload.message}</p>
        <div className={styles.footer}>
          {/* Cancel takes initial focus — for a destructive confirm, a stray
              Enter should NOT trigger the delete. */}
          <button type="button" className="pf-btn-secondary" onClick={handleClose} autoFocus>
            Cancel
          </button>
          <button
            type="button"
            className={payload.destructive ? 'pf-btn-danger' : 'pf-btn-primary'}
            onClick={handleConfirm}
          >
            {payload.confirmLabel || 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}
