// MWPW-199253 — unit tests for the sessions-shell sidebar grouping logic.
// Pure logic; day boundaries pinned with fake timers for determinism.
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { groupSessions, dayStart } from './sessionGrouping';
import type { HistoryEntry, SessionStatus } from '../sessions/types';

// Fixed "now" = 2026-07-14 12:00 local, so day boundaries never straddle midnight.
const NOW = new Date(2026, 6, 14, 12, 0, 0);

beforeEach(() => {
	vi.useFakeTimers();
	vi.setSystemTime(NOW);
});
afterEach(() => {
	vi.useRealTimers();
});

let seq = 0;
function entry(status: SessionStatus, ts: number, sessionId = `e${seq++}`): HistoryEntry {
	return { sessionId, source: 'figma', status, ts };
}

const labels = (h: HistoryEntry[]) => groupSessions(h).map((g) => g.label);

const LIVE: SessionStatus[] = ['generating', 'refining', 'running', 'waiting', 'deploying', 'shipping'];

describe('groupSessions — bucketing', () => {
	it('a live row lands in "In progress"', () => {
		expect(labels([entry('running', Date.now())])).toEqual(['In progress']);
	});
	it('an error row lands in "Needs review"', () => {
		expect(labels([entry('error', Date.now())])).toEqual(['Needs review']);
	});
	it('a settled row with today ts → "Today"', () => {
		expect(labels([entry('done', Date.now())])).toEqual(['Today']);
	});
	it('a settled row with yesterday ts → "Yesterday"', () => {
		expect(labels([entry('done', Date.now() - 86_400_000)])).toEqual(['Yesterday']);
	});
	it('a settled row with 3-days-ago ts → "Earlier"', () => {
		expect(labels([entry('done', Date.now() - 3 * 86_400_000)])).toEqual(['Earlier']);
	});

	it.each(LIVE)('status %s hoists to "In progress"', (status) => {
		expect(labels([entry(status, Date.now())])).toEqual(['In progress']);
	});
});

describe('groupSessions — urgency hoisting (no time-bucket leakage)', () => {
	it('a LIVE row with an OLD ts still hoists to "In progress" (not "Earlier")', () => {
		expect(labels([entry('generating', Date.now() - 10 * 86_400_000)])).toEqual(['In progress']);
	});
	it('an ERROR row with today ts hoists to "Needs review" (not "Today")', () => {
		expect(labels([entry('error', Date.now())])).toEqual(['Needs review']);
	});
});

describe('groupSessions — group order + omission', () => {
	it('emits groups in fixed order regardless of input order', () => {
		// Deliberately shuffled input; each row targets a distinct bucket.
		const history: HistoryEntry[] = [
			entry('done', Date.now() - 3 * 86_400_000),   // Earlier
			entry('error', Date.now()),                    // Needs review
			entry('done', Date.now()),                     // Today
			entry('running', Date.now()),                  // In progress
			entry('done', Date.now() - 86_400_000),        // Yesterday
		];
		expect(labels(history)).toEqual(['In progress', 'Needs review', 'Today', 'Yesterday', 'Earlier']);
	});

	it('omits empty groups', () => {
		expect(labels([entry('done', Date.now())])).toEqual(['Today']);
	});

	it('empty history → no groups', () => {
		expect(groupSessions([])).toEqual([]);
	});

	it('preserves entry order within a group', () => {
		const a = entry('running', Date.now(), 'a');
		const b = entry('generating', Date.now(), 'b');
		const groups = groupSessions([a, b]);
		expect(groups).toHaveLength(1);
		expect(groups[0].entries.map((e) => e.sessionId)).toEqual(['a', 'b']);
	});
});

describe('groupSessions — day-boundary edges', () => {
	it('ts exactly at start-of-today → "Today"', () => {
		expect(labels([entry('done', dayStart(0))])).toEqual(['Today']);
	});
	it('ts one ms before start-of-today → "Yesterday"', () => {
		expect(labels([entry('done', dayStart(0) - 1)])).toEqual(['Yesterday']);
	});
	it('ts exactly at start-of-yesterday → "Yesterday"', () => {
		expect(labels([entry('done', dayStart(1))])).toEqual(['Yesterday']);
	});
	it('ts one ms before start-of-yesterday → "Earlier"', () => {
		expect(labels([entry('done', dayStart(1) - 1)])).toEqual(['Earlier']);
	});
});
