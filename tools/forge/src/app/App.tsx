import { ToastContainer } from '@react-spectrum/s2';
import { TopBar } from './TopBar';
import { Sidebar } from './Sidebar';
import { WorkArea } from './WorkArea';
import { ModalRoot } from './ModalRoot';
import styles from './App.module.css';

export function App() {
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
