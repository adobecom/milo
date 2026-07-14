import { useState, useEffect } from 'react';
import { TextField } from '@react-spectrum/s2';
import Close from '@react-spectrum/s2/icons/Close';
import { useConfig, validateForgeConfig, isForgeConfigValid } from '../config';
import type { ForgeConfig, ForgeConfigErrors } from '../config';
import styles from './SettingsSlideover.module.css';

// ── Props ─────────────────────────────────────────────────────────────────────

interface SettingsSlideoverProps {
  isOpen: boolean;
  onClose: () => void;
}

// ── Component ─────────────────────────────────────────────────────────────────
// Always mounted so it can animate in and out (a slide-over that returns null
// can't transition). Every field maps 1:1 to ForgeConfig — nothing invented.

export function SettingsSlideover({ isOpen, onClose }: SettingsSlideoverProps) {
  const { config, setConfig } = useConfig();

  // Local draft — committed only on Save. Re-synced from config each time the
  // panel opens, so a Cancel-then-reopen always shows the saved values.
  const [draft, setDraft] = useState<ForgeConfig>(config);
  // Per-field format errors from the last Save attempt. Cleared when the panel
  // re-opens (fresh draft) and when the offending field is edited.
  const [errors, setErrors] = useState<ForgeConfigErrors>({});
  useEffect(() => {
    if (isOpen) {
      setDraft(config);
      setErrors({});
    }
  }, [isOpen, config]);

  function update<K extends keyof ForgeConfig>(key: K, value: ForgeConfig[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
    // Drop this field's error as soon as the user edits it — don't nag mid-fix.
    setErrors((e) => {
      if (!(key in e)) return e;
      const next = { ...e };
      delete (next as Record<string, unknown>)[key as string];
      return next;
    });
  }

  function updateExport<K extends keyof ForgeConfig['export']>(
    key: K,
    value: ForgeConfig['export'][K],
  ) {
    setDraft((d) => ({ ...d, export: { ...d.export, [key]: value } }));
  }

  function handleSave() {
    // Pre-run format validation — a mistyped value fails inline HERE instead of
    // cryptically minutes into a run (MWPW-199254).
    const found = validateForgeConfig(draft);
    if (!isForgeConfigValid(found)) {
      setErrors(found);
      return;
    }
    setConfig(draft);
    try {
      localStorage.setItem('forge.config', JSON.stringify(draft));
    } catch {
      /* quota */
    }
    onClose();
  }

  const mode = draft.export.mode || 'milo';

  return (
    <>
      <div
        className={`${styles.scrim} ${isOpen ? styles.scrimOpen : ''}`}
        onClick={onClose}
        aria-hidden
      />
      <aside
        className={`${styles.slideover} ${isOpen ? styles.slideoverOpen : ''}`}
        role="dialog"
        aria-modal
        aria-label="Settings"
        aria-hidden={!isOpen}
      >
        <div className={styles.head}>
          <h2 className={styles.title}>Settings</h2>
          <button
            className={styles.closeBtn}
            type="button"
            onClick={onClose}
            aria-label="Close settings"
          >
            <Close />
          </button>
        </div>

        <div className={styles.body}>
          <div className={styles.group}>
            <h3 className={styles.groupTitle}>Server</h3>
            <div className={styles.field}>
              <TextField
                label="Server URL"
                value={draft.serverUrl}
                onChange={(v) => update('serverUrl', v)}
                description="Where the page-forge server is running. Default: http://localhost:8080"
                isInvalid={Boolean(errors.serverUrl)}
                errorMessage={errors.serverUrl}
                UNSAFE_style={{ width: '100%' }}
              />
            </div>
          </div>

          <div className={styles.group}>
            <h3 className={styles.groupTitle}>Consumer site</h3>
            <p className={styles.groupIntro}>
              The adobecom Milo consumer this tool ships to. Required to send to Authoring.
            </p>
            <div className={styles.field}>
              <TextField
                label="Consumer site repo path"
                value={draft.repoPath}
                onChange={(v) => update('repoPath', v)}
                placeholder="/Users/you/path/to/your-consumer-site"
                description="Local clone of your consumer site, for example adobecom/da-playground."
                isInvalid={Boolean(errors.repoPath)}
                errorMessage={errors.repoPath}
                UNSAFE_style={{ width: '100%' }}
              />
            </div>
            <div className={styles.field}>
              <TextField
                label="Consumer preview URL"
                value={draft.consumerPreviewUrl}
                onChange={(v) => update('consumerPreviewUrl', v)}
                placeholder="http://localhost:3000"
                description="Where your consumer's local dev server is reachable."
                isInvalid={Boolean(errors.consumerPreviewUrl)}
                errorMessage={errors.consumerPreviewUrl}
                UNSAFE_style={{ width: '100%' }}
              />
            </div>
          </div>

          <div className={styles.group}>
            <h3 className={styles.groupTitle}>Milo</h3>
            <div className={styles.field}>
              <TextField
                label="Milo path"
                value={draft.miloPath}
                onChange={(v) => update('miloPath', v)}
                placeholder="/Users/you/path/to/milo"
                description="Local clone of adobecom/milo. Required when new blocks go to Milo."
                isInvalid={Boolean(errors.miloPath)}
                errorMessage={errors.miloPath}
                UNSAFE_style={{ width: '100%' }}
              />
            </div>
          </div>

          <div className={styles.group}>
            <h3 className={styles.groupTitle}>Document Authoring</h3>
            <div className={styles.field}>
              <TextField
                label="DA username (LDAP)"
                value={draft.daUsername}
                onChange={(v) => update('daUsername', v)}
                placeholder="your-ldap, for example jdoe"
                description="Required to send to Authoring. Sets the folder: /drafts/<username>/forge/<slug>."
                isInvalid={Boolean(errors.daUsername)}
                errorMessage={errors.daUsername}
                UNSAFE_style={{ width: '100%' }}
              />
            </div>
          </div>

          <div className={styles.group}>
            <h3 className={styles.groupTitle}>Where new blocks go</h3>
            <p className={styles.groupIntro}>
              Applied every time you send to Authoring. Content ships to DA when connected, or to
              local files otherwise.
            </p>
            <div className={styles.field}>
              <div className="pf-segmented">
                {([
                  { id: 'milo', label: 'Milo fork' },
                  { id: 'project', label: 'This project only' },
                ] as const).map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    className={`pf-seg${mode === o.id ? ' pf-seg--active' : ''}`}
                    onClick={() => updateExport('mode', o.id)}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
              <div className="pf-help">
                {mode === 'project'
                  ? 'Content and generated forge-* blocks ship to this consumer project (da-playground) only. Blocks are not migrated to the Milo fork.'
                  : 'Ships real forge-* blocks to the Milo fork on a feature branch; preview the page against those blocks via ?milolibs=<branch>.'}
              </div>
            </div>
          </div>

          <div className={styles.group}>
            <h3 className={styles.groupTitle}>Developer</h3>
            <p className={styles.groupIntro}>
              For engineers running jobs. Off by default — designers and PMs see only
              the finished page.
            </p>
            <div className={styles.field}>
              <button
                type="button"
                className={`pf-toggle-row${draft.debugMode ? ' pf-toggle-row--on' : ''}`}
                role="switch"
                aria-checked={draft.debugMode}
                onClick={() => update('debugMode', !draft.debugMode)}
              >
                <span className="pf-toggle-copy">
                  <span className="pf-toggle-label">Debug mode</span>
                  <span className="pf-toggle-desc">
                    Show the engineering handoff, activity log, and local artifacts on
                    the result.
                  </span>
                </span>
                <span className="pf-toggle-track" aria-hidden>
                  <span className="pf-toggle-knob" />
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <button type="button" className="pf-btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="pf-btn-primary" onClick={handleSave}>
            Save
          </button>
        </div>
      </aside>
    </>
  );
}
