// ── LocalArtifacts — collapsible panel of local deploy artifacts ───────────────
// Extracted from DeployReport; lives at the bottom of the session view, after
// the Activity log. Self-hides when there are no paths and no Milo blocks.

import { useState } from 'react';
import { ActionButton, ToastQueue } from '@react-spectrum/s2';
import { FootDisclosure } from './FootDisclosure';
import Checkmark from '@react-spectrum/s2/icons/Checkmark';
import Copy from '@react-spectrum/s2/icons/Copy';
import FolderOpen from '@react-spectrum/s2/icons/FolderOpen';
import { useConfig } from '../config';

// ── Helpers ───────────────────────────────────────────────────────────────────

function shortenPath(p: string | null | undefined): string {
  if (!p) return '';
  const m = p.match(/^(\/Users\/[^/]+|\/home\/[^/]+)(\/.*)?$/);
  if (m) return `~${m[2] || ''}`;
  return p;
}

// ── PathRow ───────────────────────────────────────────────────────────────────

function PathRow({ label, path, serverUrl }: { label: string; path: string; serverUrl: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(path);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // ignore
    }
  }

  async function handleReveal() {
    try {
      const r = await fetch(`${serverUrl}/reveal-path`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path }),
      });
      if (!r.ok) {
        const j = await r.json().catch(() => ({}));
        ToastQueue.negative(`Reveal failed: ${(j as { error?: string }).error || r.status}`);
      }
    } catch (e) {
      ToastQueue.negative(`Reveal failed: ${(e as Error).message}`);
    }
  }

  return (
    <div className="pf-path-row">
      <span className="pf-path-label">{label}</span>
      <code className="pf-path-value">{shortenPath(path)}</code>
      <ActionButton
        onPress={handleCopy}
        isQuiet
        aria-label="Copy path to clipboard"
      >
        {copied ? <Checkmark /> : <Copy />}
      </ActionButton>
      <ActionButton
        onPress={handleReveal}
        isQuiet
        aria-label="Reveal in Finder"
      >
        <FolderOpen />
      </ActionButton>
    </div>
  );
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface LocalArtifactsProps {
  session: {
    sessionId: string;
    shipped?: Record<string, unknown>;
  };
}

// ── Component ─────────────────────────────────────────────────────────────────

export function LocalArtifacts({ session }: LocalArtifactsProps) {
  const { config } = useConfig();
  const serverUrl = config.serverUrl;

  const shipped = (session.shipped || {}) as {
    forgePagePath?: string;
    forgeAssetsDir?: string;
    consumerWorktree?: string;
    miloWorktree?: string;
    localPath?: string;
    miloBlocks?: string[];
  };

  const paths: [string, string][] = (
    [
      ['Forge HTML', shipped.forgePagePath],
      ['Assets dir', shipped.forgeAssetsDir],
      ['Consumer worktree', shipped.consumerWorktree],
      ['Milo worktree', shipped.miloWorktree],
      ['Local ship path', shipped.localPath],
    ] as [string, string | undefined][]
  ).filter(([, p]) => !!p) as [string, string][];

  const miloBlocks = shipped.miloBlocks ?? [];
  const artifactCount = paths.length + (miloBlocks.length ? 1 : 0);

  if (artifactCount === 0) return null;

  return (
    <div className="pf-log-container">
      <FootDisclosure title={`Local artifacts (${artifactCount})`}>
        {paths.map(([label, p]) => (
          <PathRow key={label} label={label} path={p} serverUrl={serverUrl} />
        ))}
        {miloBlocks.length > 0 && (
          <div className="pf-path-row">
            <span className="pf-path-label">
              Milo blocks ({miloBlocks.length})
            </span>
            <div className="pf-deploy-block-tags">
              {miloBlocks.map((n) => (
                <span key={n} className="pf-block-tag">
                  {n}
                </span>
              ))}
            </div>
          </div>
        )}
      </FootDisclosure>
    </div>
  );
}
