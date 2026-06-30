// ── ConnectConsumerModal — focused, "connect to publish" step ─────────────────
// Mirrors ConnectFigmaModal: a single focused modal, NOT the full settings panel.
// Publishing needs a destination — the consumer site Forge ships your page to
// (its local clone + preview URL). This collects exactly that and writes the same
// config fields the settings panel does (config.repoPath + config.consumerPreviewUrl),
// so once connected the publish step proceeds on its own. Opened from the deploy
// gate when you press Publish without a destination connected — the same pattern
// as the gated Figma door, so the demo never dead-ends on a toast.

import { useState } from 'react';
import { TextField } from '@react-spectrum/s2';
import Close from '@react-spectrum/s2/icons/Close';
import { useConfig } from '../config';
// Reuse the Figma modal's styles verbatim — same focused-modal shell, one source.
import styles from './ConnectFigmaModal.module.css';

interface ConnectConsumerModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Called after a successful connect, so the caller can continue the publish it
  // was about to do. Optional — opening the modal standalone just connects.
  onConnected?: () => void;
}

function ConsumerMark() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="#7155fa" strokeWidth="2" aria-hidden="true">
      <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" />
      <path d="M12 12l8-4.5M12 12v9M12 12L4 7.5" />
    </svg>
  );
}

export function ConnectConsumerModal({ isOpen, onClose, onConnected }: ConnectConsumerModalProps) {
  const { config, setConfig } = useConfig();
  const [previewUrl, setPreviewUrl] = useState(config.consumerPreviewUrl || '');
  const [repoPath, setRepoPath] = useState(config.repoPath || '');

  if (!isOpen) return null;

  const canConnect = previewUrl.trim().length > 0 && repoPath.trim().length > 0;

  function handleConnect() {
    if (!canConnect) return;
    const next = { ...config, consumerPreviewUrl: previewUrl.trim(), repoPath: repoPath.trim() };
    setConfig(next);
    try {
      localStorage.setItem('forge.config', JSON.stringify(next));
    } catch {
      /* quota */
    }
    onClose();
    onConnected?.();
  }

  return (
    <div
      className={styles.backdrop}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className={styles.modal} role="dialog" aria-modal aria-label="Connect to publish">
        <div className={styles.head}>
          <span className={styles.glyph}><ConsumerMark /></span>
          <h3 className={styles.title}>Connect to publish</h3>
          <button className={styles.close} type="button" onClick={onClose} aria-label="Close">
            <Close />
          </button>
        </div>

        <div className={styles.body}>
          <p className={styles.sub}>
            Publishing sends your page to a consumer site — the Milo project it goes live on.
            Point Forge at that site once and publishing is ready. Stored on this machine only.
          </p>
          <TextField
            label="Consumer preview URL"
            value={previewUrl}
            onChange={setPreviewUrl}
            placeholder="http://localhost:3000"
            UNSAFE_style={{ width: '100%' }}
          />
          <div style={{ height: 12 }} />
          <TextField
            label="Consumer repo path"
            value={repoPath}
            onChange={setRepoPath}
            placeholder="~/Documents/GitHub/da-playground"
            onKeyDown={(e) => { if (e.key === 'Enter') handleConnect(); }}
            UNSAFE_style={{ width: '100%' }}
          />
          <p className={styles.help}>
            The site your page publishes to (e.g. da-playground) and its local clone.
          </p>
        </div>

        <div className={styles.foot}>
          <button type="button" className="pf-btn-secondary" onClick={onClose}>Cancel</button>
          <button
            type="button"
            className="pf-btn-primary"
            onClick={handleConnect}
            disabled={!canConnect}
            style={!canConnect ? { opacity: 0.5, cursor: 'not-allowed' } : undefined}
          >
            Connect &amp; publish
          </button>
        </div>
      </div>
    </div>
  );
}
