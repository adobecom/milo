// ── SessionUsage — persistent usage strip, always mounted above activity log ──
// Shows Time / Cost / Turns / Tokens tiles.
// Shows — for each item while data is still loading.

import { fmtMs, fmtCost, fmtTokens } from './UsageStrip';
import type { Session } from '../sessions/types';

// ── Props ─────────────────────────────────────────────────────────────────────

interface SessionUsageProps {
  session: Session;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function SessionUsage({ session }: SessionUsageProps) {
  // Prefer live totalUsage; fall back to shipped.deployUsage for history sessions
  const shipped = (session.shipped || {}) as Record<string, unknown>;
  const usage =
    (session.totalUsage as Record<string, unknown> | null) ||
    (shipped.deployUsage as Record<string, unknown> | null) ||
    null;

  const isBusy = ['queued', 'generating', 'refining', 'running', 'shipping', 'deploying'].includes(
    session.status,
  );

  // Done/error with no usage data at all — hide entirely
  if (!usage && !isBusy) return null;

  const durationMs = usage?.durationMs as number | undefined;
  const costUsd = usage?.costUsd as number | undefined;
  const numTurns = usage?.numTurns as number | undefined;
  const inputTokens = usage?.inputTokens as number | undefined;
  const outputTokens = usage?.outputTokens as number | undefined;

  const tiles = [
    { label: 'Time',   value: durationMs != null ? fmtMs(durationMs) : '—' },
    { label: 'Cost',   value: costUsd != null && costUsd > 0 ? fmtCost(costUsd) : '—' },
    { label: 'Turns',  value: numTurns ? String(numTurns) : '—' },
    { label: 'Tokens', value: (inputTokens || outputTokens) ? `${fmtTokens(inputTokens)} in / ${fmtTokens(outputTokens)} out` : '—' },
  ];

  return (
    <div className="pf-usage-report">
      {tiles.map(({ label, value }) => (
        <div key={label} className="pf-usage-tile">
          <span className="pf-usage-tile-value">{value}</span>
          <span className="pf-usage-tile-label">{label}</span>
        </div>
      ))}
    </div>
  );
}
