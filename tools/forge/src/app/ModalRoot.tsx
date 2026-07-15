import { useUiState } from './UiStateContext';
import { useConfig, saveForgeConfig } from '../config';
import { SettingsSlideover } from './SettingsSlideover';
import { ConnectConsumerModal } from './ConnectConsumerModal';
import { ConfirmDialog } from './ConfirmDialog';
import { SplashModal } from './SplashModal';

export function ModalRoot() {
  const { state, dispatch } = useUiState();
  const { config, setConfig } = useConfig();

  function handleClose() {
    dispatch({ type: 'closeModal' });
  }

  // Closing marks the tour seen so it won't auto-show again (still re-openable).
  function handleCloseSplash() {
    if (!config.splashSeen) {
      const next = { ...config, splashSeen: true };
      setConfig(next);
      saveForgeConfig(next);
    }
    handleClose();
  }

  return (
    <>
      <SettingsSlideover
        isOpen={state.modal === 'settings'}
        onClose={handleClose}
      />
      <ConnectConsumerModal
        isOpen={state.modal === 'connectConsumer'}
        onClose={handleClose}
        onConnected={state.pendingPublish ?? undefined}
      />
      <SplashModal isOpen={state.modal === 'splash'} onClose={handleCloseSplash} />
      <ConfirmDialog />
    </>
  );
}
