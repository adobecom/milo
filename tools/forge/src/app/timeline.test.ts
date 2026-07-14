// MWPW-199250 — unit tests for the generating-surface timeline state logic.
// Pure logic (no React / no @react-spectrum/s2), so this runs in plain vitest.
import { describe, it, expect } from 'vitest';
import { deriveTimeline, STEP_COUNT, type TimelineInfo } from './timeline';
import type { Session } from '../sessions/types';

// Minimal Session factory — only the fields deriveTimeline reads matter.
function session(overrides: Partial<Session>): Session {
  return {
    sessionId: 's1',
    status: 'running',
    source: 'figma',
    versions: [],
    ...overrides,
  };
}

const info = (o: Partial<Session>): TimelineInfo => deriveTimeline(session(o));

describe('deriveTimeline — PHASE_TO_STEP mapping (running)', () => {
  const cases: Array<[string, number]> = [
    ['queued', 0],
    ['fetch', 1], ['forge', 1], ['extracting', 1], ['redesign', 1], ['tweak', 1],
    ['converge', 2], ['converging', 2], ['negotiate', 2], ['convert', 2], ['matching', 2],
    ['worktree', 3], ['local-write', 3], ['composing', 3], ['generating-blocks', 3], ['linting', 3],
    ['push', 4], ['da-push', 4], ['shipping', 4],
    ['verify', 5],
  ];
  it.each(cases)('phase %s → step %i (running)', (phase, step) => {
    expect(info({ status: 'running', phase })).toEqual({ stepIdx: step, state: 'running' });
  });
});

describe('deriveTimeline — STATUS_MIN_STEP fallback for unrecognised phase', () => {
  it('generating + unknown phase → step 1', () => {
    expect(info({ status: 'generating', phase: 'nope' })).toEqual({ stepIdx: 1, state: 'running' });
  });
  it('waiting + unknown phase → step 1 (does not regress to Queued mid-run)', () => {
    expect(info({ status: 'waiting', phase: 'zzz' })).toEqual({ stepIdx: 1, state: 'running' });
  });
  it('shipping + unknown phase → step 4', () => {
    expect(info({ status: 'shipping', phase: 'zzz' })).toEqual({ stepIdx: 4, state: 'running' });
  });
  it('deploying + unknown phase → step 3', () => {
    expect(info({ status: 'deploying', phase: 'zzz' })).toEqual({ stepIdx: 3, state: 'running' });
  });
  it('queued + unknown phase → step 0', () => {
    expect(info({ status: 'queued', phase: 'zzz' })).toEqual({ stepIdx: 0, state: 'running' });
  });
  it('status with no STATUS_MIN_STEP entry (pending) + unknown phase → step 0', () => {
    expect(info({ status: 'pending', phase: 'zzz' })).toEqual({ stepIdx: 0, state: 'running' });
  });
  it('empty phase falls back to status minimum', () => {
    expect(info({ status: 'generating', phase: '' })).toEqual({ stepIdx: 1, state: 'running' });
  });
  it('a recognised phase wins over the status minimum (waiting + converge → 2, not 1)', () => {
    expect(info({ status: 'waiting', phase: 'converge' })).toEqual({ stepIdx: 2, state: 'running' });
  });
});

describe('deriveTimeline — done', () => {
  it('done + shipped.prototypeUrl → last step, done', () => {
    expect(info({ status: 'done', shipped: { prototypeUrl: 'https://x' } }))
      .toEqual({ stepIdx: STEP_COUNT - 1, state: 'done' });
  });
  it('done without prototypeUrl (figma) → gate at step 2', () => {
    expect(info({ status: 'done', source: 'figma' })).toEqual({ stepIdx: 2, state: 'gate' });
  });
  it('done without prototypeUrl (url) → gate at step 1', () => {
    expect(info({ status: 'done', source: 'url' })).toEqual({ stepIdx: 1, state: 'gate' });
  });
  it('done with empty shipped object (no prototypeUrl) → gate', () => {
    expect(info({ status: 'done', source: 'figma', shipped: {} })).toEqual({ stepIdx: 2, state: 'gate' });
  });
});

describe('deriveTimeline — paused (gate)', () => {
  it('paused (figma) → gate at step 2', () => {
    expect(info({ status: 'paused', source: 'figma' })).toEqual({ stepIdx: 2, state: 'gate' });
  });
  it('paused (url) → gate at step 1', () => {
    expect(info({ status: 'paused', source: 'url' })).toEqual({ stepIdx: 1, state: 'gate' });
  });
});

describe('deriveTimeline — error (non-cancel)', () => {
  it('error + unknown phase (figma) → step 2, error', () => {
    expect(info({ status: 'error', source: 'figma' })).toEqual({ stepIdx: 2, state: 'error' });
  });
  it('error + unknown phase (url) → step 1, error', () => {
    expect(info({ status: 'error', source: 'url' })).toEqual({ stepIdx: 1, state: 'error' });
  });
  it('error + known phase uses the phase step (author → 3)', () => {
    expect(info({ status: 'error', phase: 'composing' })).toEqual({ stepIdx: 3, state: 'error' });
  });
  it('error with a non-cancel message stays error', () => {
    expect(info({ status: 'error', phase: 'converge', error: 'boom: something failed' }))
      .toEqual({ stepIdx: 2, state: 'error' });
  });
});

describe('deriveTimeline — cancelled', () => {
  it('cancelled via phase==="cancelled" (figma) → step 2, cancelled', () => {
    expect(info({ status: 'error', phase: 'cancelled', source: 'figma' }))
      .toEqual({ stepIdx: 2, state: 'cancelled' });
  });
  it('cancelled via phase==="cancelled" (url) → step 1, cancelled', () => {
    expect(info({ status: 'error', phase: 'cancelled', source: 'url' }))
      .toEqual({ stepIdx: 1, state: 'cancelled' });
  });
  it('cancelled via /cancelled/i in session.error keeps the known phase step', () => {
    expect(info({ status: 'error', phase: 'converge', error: 'Run cancelled by user' }))
      .toEqual({ stepIdx: 2, state: 'cancelled' });
  });
  it('cancelled detection is case-insensitive', () => {
    expect(info({ status: 'error', phase: 'forge', error: 'CANCELLED' }))
      .toEqual({ stepIdx: 1, state: 'cancelled' });
  });
});

describe('deriveTimeline — invariants', () => {
  it('stepIdx is always within [0, STEP_COUNT-1]', () => {
    const samples: Array<Partial<Session>> = [
      { status: 'running', phase: 'zzz' },
      { status: 'pending', phase: '' },
      { status: 'error', phase: 'cancelled', source: 'url' },
      { status: 'done', shipped: { prototypeUrl: 'x' } },
      { status: 'paused', source: 'figma' },
    ];
    for (const s of samples) {
      const { stepIdx } = info(s);
      expect(stepIdx).toBeGreaterThanOrEqual(0);
      expect(stepIdx).toBeLessThanOrEqual(STEP_COUNT - 1);
    }
  });
});
