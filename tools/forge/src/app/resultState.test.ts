// MWPW-199251 — unit tests for the result-surface state selection.
// Pure logic (no React / no @react-spectrum/s2), so this runs in plain vitest.
import { describe, it, expect } from 'vitest';
import { selectResultState, isBusy, isCancelled, type ResultState } from './resultState';
import type { Session, SessionStatus } from '../sessions/types';

// Minimal Session factory — only the fields selectResultState reads matter.
function session(overrides: Partial<Session>): Session {
  return {
    sessionId: 's1',
    status: 'pending',
    source: 'figma',
    versions: [],
    ...overrides,
  };
}

const state = (o: Partial<Session>): ResultState => selectResultState(session(o));

// A single built version — enough to flip noVersions / awaiting-publish.
const V = [{ v: 1 }];

describe('selectResultState — busy wins outright', () => {
  const BUSY: SessionStatus[] = [
    'queued', 'generating', 'waiting', 'refining', 'shipping', 'deploying', 'running',
  ];
  it.each(BUSY)('status %s → busy', (status) => {
    expect(state({ status })).toBe('busy');
  });

  it('busy wins even with stale versions attached', () => {
    expect(state({ status: 'running', versions: V })).toBe('busy');
  });
  it('busy wins even with a shipped.prototypeUrl attached', () => {
    expect(state({ status: 'deploying', shipped: { prototypeUrl: 'https://x' }, versions: V }))
      .toBe('busy');
  });
});

describe('selectResultState — cancelled (error, no versions)', () => {
  it('error + phase="cancelled" → cancelled', () => {
    expect(state({ status: 'error', phase: 'cancelled' })).toBe('cancelled');
  });
  it('error + /cancelled/i in error string → cancelled', () => {
    expect(state({ status: 'error', error: 'Run cancelled by user' })).toBe('cancelled');
  });
  it('cancelled detection is case-insensitive', () => {
    expect(state({ status: 'error', error: 'CANCELLED' })).toBe('cancelled');
  });
});

describe('selectResultState — error (error, no versions, not cancelled)', () => {
  it('error + generic message → error', () => {
    expect(state({ status: 'error', error: 'boom: something failed' })).toBe('error');
  });
  it('error + no message → error', () => {
    expect(state({ status: 'error' })).toBe('error');
  });
});

describe('selectResultState — errored run WITH versions falls through to done surfaces', () => {
  it('error + versions + no shipped → awaiting-publish (a late failure keeps the built page)', () => {
    expect(state({ status: 'error', versions: V })).toBe('awaiting-publish');
  });
  it('error + versions + shipped.prototypeUrl → published', () => {
    expect(state({ status: 'error', versions: V, shipped: { prototypeUrl: 'https://x' } }))
      .toBe('published');
  });
  it('a cancelled-phase run that still produced versions is NOT the cancelled card', () => {
    expect(state({ status: 'error', phase: 'cancelled', versions: V })).toBe('awaiting-publish');
  });
});

describe('selectResultState — published', () => {
  it('done + shipped.prototypeUrl → published', () => {
    expect(state({ status: 'done', versions: V, shipped: { prototypeUrl: 'https://x' } }))
      .toBe('published');
  });
  it('published even without versions (shipped is the signal)', () => {
    expect(state({ status: 'done', shipped: { prototypeUrl: 'https://x' } })).toBe('published');
  });
  it('empty shipped object (no prototypeUrl) is NOT published', () => {
    expect(state({ status: 'done', versions: V, shipped: {} })).toBe('awaiting-publish');
  });
});

describe('selectResultState — awaiting-publish', () => {
  it('done + versions, no shipped → awaiting-publish', () => {
    expect(state({ status: 'done', versions: V })).toBe('awaiting-publish');
  });
  it('paused + versions → awaiting-publish', () => {
    expect(state({ status: 'paused', versions: V })).toBe('awaiting-publish');
  });
});

describe('selectResultState — empty', () => {
  it('pending + nothing produced → empty', () => {
    expect(state({ status: 'pending' })).toBe('empty');
  });
  it('done but no versions and no shipped → empty', () => {
    expect(state({ status: 'done' })).toBe('empty');
  });
  it('a status with no busy/error/done signal and no output → empty', () => {
    expect(state({ status: 'paused' })).toBe('empty');
  });
});

describe('selectResultState — every state is reachable + exhaustive', () => {
  const reached = new Set<ResultState>([
    state({ status: 'running' }),
    state({ status: 'error', phase: 'cancelled' }),
    state({ status: 'error' }),
    state({ status: 'done', shipped: { prototypeUrl: 'x' } }),
    state({ status: 'done', versions: V }),
    state({ status: 'pending' }),
  ]);
  it('covers all six states', () => {
    expect([...reached].sort()).toEqual(
      ['awaiting-publish', 'busy', 'cancelled', 'empty', 'error', 'published'],
    );
  });
});

describe('isBusy / isCancelled helpers', () => {
  it('isBusy true for an in-flight status', () => {
    expect(isBusy(session({ status: 'generating' }))).toBe(true);
  });
  it('isBusy false for a settled status', () => {
    expect(isBusy(session({ status: 'done' }))).toBe(false);
  });
  it('isCancelled reads phase OR error string', () => {
    expect(isCancelled(session({ phase: 'cancelled' }))).toBe(true);
    expect(isCancelled(session({ error: 'was Cancelled midway' }))).toBe(true);
    expect(isCancelled(session({ error: 'network error' }))).toBe(false);
    expect(isCancelled(session({}))).toBe(false);
  });
});
