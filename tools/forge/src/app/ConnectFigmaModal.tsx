// ── ConnectFigmaModal — focused, one-field Figma connect ──────────────────────
// "Connect Figma" from the door opens THIS, not the full 7-section settings
// slideover — connecting Figma is just pasting a dev personal access token. It
// writes the same config.figmaToken the settings panel does, so once saved the
// door's chip flips to "Connected to Figma" on its own (InputPanel derives the
// connected state from config, not a local flag). It is a quick setup step, not a
// hard wall: the token is optional (it fetches Figma assets at full resolution),
// so the door still works without it.

import { useState } from 'react';
import { TextField } from '@react-spectrum/s2';
import Close from '@react-spectrum/s2/icons/Close';
import { useConfig } from '../config';
import styles from './ConnectFigmaModal.module.css';

interface ConnectFigmaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function FigmaMark() {
  return (
    <svg viewBox="0 0 38 57" aria-hidden="true">
      <path fill="#1abcfe" d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z" />
      <path fill="#0acf83" d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z" />
      <path fill="#ff7262" d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z" />
      <path fill="#f24e1e" d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z" />
      <path fill="#a259ff" d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z" />
    </svg>
  );
}

export function ConnectFigmaModal({ isOpen, onClose }: ConnectFigmaModalProps) {
  const { config, setConfig } = useConfig();
  const [token, setToken] = useState(config.figmaToken || '');

  if (!isOpen) return null;

  function handleConnect() {
    const next = { ...config, figmaToken: token.trim() };
    setConfig(next);
    try {
      localStorage.setItem('forge.config', JSON.stringify(next));
    } catch {
      /* quota */
    }
    onClose();
  }

  return (
    <div
      className={styles.backdrop}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className={styles.modal} role="dialog" aria-modal aria-label="Connect Figma">
        <div className={styles.head}>
          <span className={styles.glyph}><FigmaMark /></span>
          <h3 className={styles.title}>Connect Figma</h3>
          <button className={styles.close} type="button" onClick={onClose} aria-label="Close">
            <Close />
          </button>
        </div>

        <div className={styles.body}>
          <p className={styles.sub}>
            Paste a Figma personal access token so Forge can read your frames at full resolution.
            It is stored on this machine only.
          </p>
          <TextField
            label="Figma token"
            value={token}
            onChange={setToken}
            type="password"
            placeholder="figd_…"
            onKeyDown={(e) => { if (e.key === 'Enter') handleConnect(); }}
            UNSAFE_style={{ width: '100%' }}
          />
          <p className={styles.help}>
            Create one in Figma under Settings, Security, Personal access tokens.{' '}
            <a
              className={styles.link}
              href="https://www.figma.com/developers/api#access-tokens"
              target="_blank"
              rel="noopener noreferrer"
            >
              Where do I get this?
            </a>
          </p>
        </div>

        <div className={styles.foot}>
          <button type="button" className="pf-btn-secondary" onClick={onClose}>Cancel</button>
          <button type="button" className="pf-btn-primary" onClick={handleConnect}>Connect</button>
        </div>
      </div>
    </div>
  );
}
