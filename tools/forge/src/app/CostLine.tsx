// ── CostLine — the one quiet cost fact a creator sees ─────────────────────────
// Reverses the prior omission of cost from the creator result view. The new stance:
// COST is a creator-relevant fact (it informs whether to run Reimagine, ~19× a
// Match), so we show it — but as ONE quiet line, not the dense 4-tile telemetry
// grid (turns/tokens/time stay debug-only). No card, no border, no tile.
//
// HONESTY: shown only from a real-shaped costUsd. A real (non-demo) session with no
// usage degrades to "— · AI cost not yet measured" — never a faked $0. Reimagine
// gets an honest "costs more than a rebuild" tail (the fixtures bear this out:
// $17.40 reimagine vs $0.90 match).

import type { Session } from '../sessions/types';
import { isReimagine } from './intent';

function readCostUsd(s: Session): number | null {
  const shipped = (s.shipped || {}) as Record<string, unknown>;
  const usage =
    (s.totalUsage as Record<string, unknown> | null) ||
    (shipped.deployUsage as Record<string, unknown> | null) ||
    null;
  const c = usage?.costUsd;
  return typeof c === 'number' && c > 0 ? c : null;
}

export function CostLine({ session }: { session: Session }) {
  const cost = readCostUsd(session);

  // Honest degradation: no measured cost → say so, never a faked 0.
  if (cost == null) {
    return (
      <p className="pf-cost-line pf-cost-line--none">
        <span className="pf-cost-amount">—</span> AI cost not yet measured
      </p>
    );
  }

  return (
    <p className="pf-cost-line">
      <span className="pf-cost-amount">${cost.toFixed(2)}</span> AI cost for this run
      {isReimagine(session) && (
        <span className="pf-cost-note"> · Reimagine runs cost more than a rebuild</span>
      )}
    </p>
  );
}
