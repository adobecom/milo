// MWPW-199266 — per-run cost/usage visibility (debug/admin).
// Renders the two usage surfaces directly (both are plain-DOM, no @react-spectrum/s2),
// covering: the accumulated per-session usage the debug grid reads (totalUsage +
// shipped.deployUsage fallback), the audience split (turns/tokens are debug-only in
// SessionUsage; CostLine shows cost ONLY to creators), and honest empty degradation.
//
// The debug BOOLEAN gate itself (`{debug && <SessionUsage/>}`) lives in
// ActiveSession.tsx; it isn't rendered here because ActiveSession pulls the
// @react-spectrum/s2 + provider chain the standalone vitest config deliberately
// omits. The substantive regression this ticket guards — that SessionUsage renders
// the telemetry and that turns/tokens never appear on the creator line — is covered
// at the component-contract level below.
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { SessionUsage } from './SessionUsage';
import { CostLine } from './CostLine';
import type { Session } from '../sessions/types';

afterEach(cleanup);

function session(overrides: Partial<Session>): Session {
  return {
    sessionId: 's1',
    status: 'done',
    source: 'figma',
    versions: [],
    ...overrides,
  };
}

const USAGE = {
  durationMs: 42_000,
  costUsd: 1.23,
  numTurns: 7,
  inputTokens: 12_000,
  outputTokens: 3_400,
};

describe('SessionUsage — the debug telemetry grid', () => {
  it('renders all four tiles from session.totalUsage', () => {
    render(<SessionUsage session={session({ totalUsage: USAGE })} />);
    for (const label of ['Time', 'Cost', 'Turns', 'Tokens']) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
    // The accumulated values surface (cost formatted, turns verbatim).
    expect(screen.getByText('7')).toBeInTheDocument();
    expect(screen.getByText(/\$1\.23/)).toBeInTheDocument();
  });

  it('falls back to shipped.deployUsage when totalUsage is absent (history sessions)', () => {
    render(<SessionUsage session={session({ shipped: { deployUsage: USAGE } })} />);
    expect(screen.getByText('Turns')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
  });

  it('a settled run with NO usage renders nothing (no faked zeros)', () => {
    const { container } = render(<SessionUsage session={session({ status: 'done' })} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('a busy run with no usage yet still renders the grid (placeholder dashes)', () => {
    const { container } = render(<SessionUsage session={session({ status: 'running' })} />);
    expect(container).not.toBeEmptyDOMElement();
    expect(screen.getByText('Tokens')).toBeInTheDocument();
  });

  it('exposes turns AND tokens (the debug-only telemetry this ticket makes viewable)', () => {
    render(<SessionUsage session={session({ totalUsage: USAGE })} />);
    expect(screen.getByText('Turns')).toBeInTheDocument();
    expect(screen.getByText('Tokens')).toBeInTheDocument();
    expect(screen.getByText('12k in / 3k out')).toBeInTheDocument();
  });
});

describe('CostLine — the one quiet cost fact for creators', () => {
  it('renders the cost line from a real costUsd', () => {
    render(<CostLine session={session({ totalUsage: USAGE })} />);
    expect(screen.getByText(/\$1\.23/)).toBeInTheDocument();
    expect(screen.getByText(/AI cost for this run/i)).toBeInTheDocument();
  });

  it('degrades honestly when no cost was measured (never a faked $0)', () => {
    render(<CostLine session={session({ status: 'done' })} />);
    expect(screen.getByText(/not yet measured/i)).toBeInTheDocument();
    expect(screen.queryByText(/AI cost for this run/i)).not.toBeInTheDocument();
  });

  it('never leaks turns or tokens to the creator view', () => {
    const { container } = render(<CostLine session={session({ totalUsage: USAGE })} />);
    expect(container.textContent).not.toMatch(/turns?/i);
    expect(container.textContent).not.toMatch(/tokens?/i);
  });

  it('adds the honest "cost more than a rebuild" tail for reimagine runs', () => {
    render(<CostLine session={session({ totalUsage: USAGE, intentPolicy: 'reimagine' })} />);
    expect(screen.getByText(/cost more than a rebuild/i)).toBeInTheDocument();
  });

  it('conformance (non-reimagine) run has no reimagine tail', () => {
    render(<CostLine session={session({ totalUsage: USAGE })} />);
    expect(screen.queryByText(/cost more than a rebuild/i)).not.toBeInTheDocument();
  });
});
