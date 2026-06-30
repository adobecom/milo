import { useUiState } from './UiStateContext';
import { SettingsSlideover } from './SettingsSlideover';
import { ConnectFigmaModal } from './ConnectFigmaModal';
import { ConnectConsumerModal } from './ConnectConsumerModal';
import { ConfirmDialog } from './ConfirmDialog';

export function ModalRoot() {
  const { state, dispatch } = useUiState();

  function handleClose() {
    dispatch({ type: 'closeModal' });
  }

  return (
    <>
      <SettingsSlideover
        isOpen={state.modal === 'settings'}
        onClose={handleClose}
      />
      <ConnectFigmaModal
        isOpen={state.modal === 'connectFigma'}
        onClose={handleClose}
      />
      <ConnectConsumerModal
        isOpen={state.modal === 'connectConsumer'}
        onClose={handleClose}
        onConnected={state.pendingPublish ?? undefined}
      />
      <ConfirmDialog />
    </>
  );
}
