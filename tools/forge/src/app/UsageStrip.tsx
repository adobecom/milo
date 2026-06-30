// ── UsageStrip — time taken + AI cost cells ───────────────────────────────────
// Port of renderUsageStrip (vanilla page-forge.js line 319).

import type { ReactNode } from 'react';

// ── Format helpers ─────────────────────────────────────────────────────────────

export function fmtCost(usd: number | null | undefined): string {
  if (usd == null || usd === 0) return '—';
  return `$${usd.toFixed(2)}`;
}

export function fmtTokens(n: number | null | undefined): string {
  if (!n) return '0';
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}k`;
  return String(n);
}

export function fmtMs(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  const s = ms / 1000;
  if (s < 60) return `${s.toFixed(1)}s`;
  const m = Math.floor(s / 60);
  const rem = Math.round(s % 60);
  return rem > 0 ? `${m}m ${rem}s` : `${m}m`;
}

export function fmtElapsed(sec: number | null | undefined): string {
  if (sec == null) return '';
  if (sec < 60) return `${sec}s`;
  const m = Math.floor(sec / 60);
  const r = sec % 60;
  return r > 0 ? `${m}m ${r}s` : `${m}m`;
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface UsageData {
  durationMs?: number | null;
  costUsd?: number | null;
}

interface UsageStripProps {
  usage: UsageData | null | undefined;
  elapsedSec?: number | null;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function UsageStrip({ usage, elapsedSec }: UsageStripProps) {
  if (!usage) return null;

  const timeVal =
    elapsedSec != null
      ? fmtElapsed(elapsedSec)
      : usage.durationMs != null
        ? fmtMs(usage.durationMs)
        : null;

  const cells: ReactNode[] = [];

  if (timeVal) {
    cells.push(
      <div key="time" className="pf-token-cell">
        <span className="pf-token-value">{timeVal}</span>
        <span className="pf-token-label">Time taken</span>
      </div>,
    );
  }

  if (usage.costUsd != null && usage.costUsd > 0) {
    cells.push(
      <div key="cost" className="pf-token-cell">
        <span className="pf-token-value">${usage.costUsd.toFixed(2)}</span>
        <span className="pf-token-label">AI cost</span>
      </div>,
    );
  }

  if (!cells.length) return null;

  return <div className="pf-token-strip">{cells}</div>;
}
