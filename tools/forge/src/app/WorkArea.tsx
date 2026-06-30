import { useSessions } from '../sessions/SessionsProvider';
import { useActiveSessionPoll } from '../sessions/useActiveSessionPoll';
import { InputPanel } from './InputPanel';
import { ActiveSession } from './ActiveSession';
import { DesignSystemView } from './DesignSystemView';
import { useUiState } from './UiStateContext';

export function WorkArea() {
  const { activeSessionId } = useSessions();
  const { state } = useUiState();

  // Start (or switch) the server poll whenever the active session changes.
  // This is the central mount point that vanilla called startPolling() from.
  useActiveSessionPoll(activeSessionId);

  // The standing Design system (flywheel) view overrides the work flow without
  // clearing the active session — Back returns to whatever was open.
  if (state.view === 'designSystem') {
    return (
      <div className="pf-work">
        <DesignSystemView />
      </div>
    );
  }

  return (
    <div className="pf-work">
      {activeSessionId
        ? <ActiveSession sessionId={activeSessionId} />
        : <InputPanel />}
    </div>
  );
}
