import { useEffect } from 'react';
import { ToastContainer } from '@react-spectrum/s2';
import { TopBar } from './TopBar';
import { Sidebar } from './Sidebar';
import { WorkArea } from './WorkArea';
import { ModalRoot } from './ModalRoot';
import { useUiState } from './UiStateContext';
import { useConfig } from '../config';
import styles from './App.module.css';

export function App() {
  const { state, dispatch } = useUiState();
  const { config } = useConfig();

  // Auto-open the welcome tour once on first run. Mount-only: closing marks it
  // seen (ModalRoot), so it can't re-fire.
  useEffect(() => {
    if (!config.splashSeen && state.modal === null) {
      dispatch({ type: 'openSplash' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.shell}>
      <TopBar />
      <div className={styles.body}>
        <Sidebar />
        <WorkArea />
      </div>
      <ModalRoot />
      <ToastContainer />
    </div>
  );
}
