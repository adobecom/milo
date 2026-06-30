// ── LiveStage — the REAL product, embedded in a slide (THROWAWAY) ─────────────
// Instead of freezing dead component snapshots, the stage hosts the live app
// canvas: WorkArea (which runs the poll loop) + ModalRoot (so the Connect/Settings
// modals actually appear). In dev/demo mode the stubbed `api` drives the whole
// flow on a compressed clock — so a presenter clicks a door, watches it build
// through every stage, lands on the real result, and Sends to Authoring, all live.
//
// A faux browser chrome frames it as "the product." Going back a slide (or
// re-entering one) remounts the stage, so there's no need for an in-frame reset.

import { useEffect } from 'react';
import { ToastContainer } from '@react-spectrum/s2';
import { WorkArea } from '../app/WorkArea';
import { ModalRoot } from '../app/ModalRoot';
import { useSessions } from '../sessions/SessionsProvider';
import { useUiState } from '../app/UiStateContext';

interface LiveStageProps {
  // Where this slide's stage should land when it appears. 'doors' resets to the
  // entry; 'designSystem' opens the flywheel/library view. Defaults to 'doors'.
  start?: 'doors' | 'designSystem';
  // Which entry door is the LIVE one for this slide; the other is greyed + inert.
  // CSS-only (data-highlight on the canvas) so the real InputPanel is untouched.
  // Omit to leave both doors active.
  highlight?: 'figma' | 'url';
  label?: string;
}

export function LiveStage({ start = 'doors', highlight, label = 'Page Forge' }: LiveStageProps) {
  const { dispatch: sessionsDispatch } = useSessions();
  const { dispatch: uiDispatch } = useUiState();

  // Land in the right state when this slide mounts (each live slide remounts via
  // the slide key, so this runs once per slide entry).
  useEffect(() => {
    if (start === 'designSystem') {
      uiDispatch({ type: 'openDesignSystem' });
    } else {
      sessionsDispatch({ type: 'setActiveSessionId', sessionId: null });
      uiDispatch({ type: 'closeDesignSystem' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="pf-stage-frame">
      <div className="pf-stage-chrome">
        <span className="pf-stage-dots" aria-hidden><i /><i /><i /></span>
        <span className="pf-stage-url">{label}</span>
      </div>
      <div className="pf-stage-canvas" data-highlight={highlight}>
        <WorkArea />
        <ModalRoot />
        <ToastContainer />
      </div>
    </div>
  );
}
