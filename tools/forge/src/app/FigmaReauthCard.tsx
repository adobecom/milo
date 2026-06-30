// ── FigmaReauthCard — Figma OAuth re-authentication panel ─────────────────────
// Port of renderFigmaReauthCard (vanilla page-forge.js lines 1751–1819).

import { useState } from 'react';
import { Button } from '@react-spectrum/s2';

interface FigmaReauthCardProps {
  figmaAuthUrl: string;
  busy?: boolean;
  onRetry?: () => Promise<void>;
}

export function FigmaReauthCard({ figmaAuthUrl, busy = false, onRetry }: FigmaReauthCardProps) {
  const [opened, setOpened] = useState(false);
  const [retrying, setRetrying] = useState(false);

  function handleSignIn() {
    const w = window.open(figmaAuthUrl, '_blank', 'noopener,noreferrer');
    if (!w) window.location.href = figmaAuthUrl;
    setOpened(true);
  }

  async function handleRetry() {
    if (!onRetry) return;
    setRetrying(true);
    try {
      await onRetry();
    } finally {
      setRetrying(false);
    }
  }

  return (
    <div className="pf-preview-placeholder pf-preview-placeholder--err">
      <div className="pf-err-title">Figma sign-in required</div>
      <div className="pf-err-msg">
        {busy
          ? 'Sign in to refresh your Figma authentication. The agent is waiting — your design will resume automatically once you complete sign-in.'
          : 'Your Figma authentication has expired. Click Retry first to spawn a fresh sign-in session, then click Sign in to Figma in the new card.'}
      </div>
      {opened && (
        <div className="pf-err-msg" style={{ opacity: 0.7, marginTop: 8 }}>
          {busy
            ? 'Tab opened. Complete sign-in — the run will resume in a few seconds.'
            : 'Tab opened. Complete sign-in, then click Retry.'}
        </div>
      )}
      <div className="pf-err-actions">
        <Button variant="accent" onPress={handleSignIn}>
          Sign in to Figma
        </Button>
        {!busy && onRetry && (
          <Button
            variant="secondary"
            onPress={handleRetry}
            isPending={retrying}
            isDisabled={retrying}
          >
            Retry
          </Button>
        )}
      </div>
    </div>
  );
}
