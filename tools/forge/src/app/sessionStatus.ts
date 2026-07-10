// ── Shared session-status vocabulary ──────────────────────────────────────────
// One source of truth consumed by BOTH the header breadcrumb (TopBar) and the
// sessions sidebar, so the two surfaces can never drift on what a status reads as
// or how a source is labeled. Keeping this in one helper is a deliberate design
// constraint: state is communicated as a plain-language WORD (not just a color),
// which also keeps the indicator accessible.

import type { SessionStatus } from '../sessions/types';

// Plain-language state word shown after the title in the header crumb and, for a
// live/non-done row, in place of the relative age on the sidebar meta line.
const STATE_WORDS: Record<SessionStatus, string> = {
	pending: 'Queued',
	queued: 'Queued',
	generating: 'Building',
	waiting: 'Waiting on Figma',
	refining: 'Building',
	running: 'Building',
	deploying: 'Going live',
	shipping: 'Going live',
	done: 'Live',
	error: 'Needs review',
	paused: 'Paused',
	cancelled: 'Stopped',
};

// A cancelled run arrives as status:'error' + phase:'cancelled' (both the demo
// stub and the real server). That's a user STOP, not a failure — so it must read
// as "Stopped" (idle/gray), never "Needs review" (error/red). Callers pass the
// session phase so this one helper keeps the whole app honest about it.
function isCancelled(status: SessionStatus, phase?: string): boolean {
	return status === 'error' && phase === 'cancelled';
}

// `status: 'done'` is reached TWICE in the lifecycle: first at the build gate
// (page generated, nothing shipped) and again after publish. The ONLY thing that
// separates them is shipped.prototypeUrl — the exact same signal ResultCard uses
// to switch its "ready" vs "live" verdict. We thread `shipped` through here so the
// sidebar + breadcrumb can never drift from the result card on this distinction:
// a built-but-unpublished page reads "Ready to publish", not "Live".
type ShipState = Record<string, unknown> | undefined;
function isPublished(shipped: ShipState): boolean {
	return Boolean(shipped && shipped.prototypeUrl);
}
function isBuildGate(status: SessionStatus, shipped: ShipState): boolean {
	return status === 'done' && !isPublished(shipped);
}

export function stateWord(status: SessionStatus, phase?: string, shipped?: ShipState): string {
	if (isCancelled(status, phase)) return STATE_WORDS.cancelled;
	if (isBuildGate(status, shipped)) return 'Ready to publish';
	return STATE_WORDS[status] ?? status;
}

// Source word for the breadcrumb + sidebar. 'eds-url' arrives from the entry UI;
// normalize it to the plain 'URL' the rest of the app shows.
export function sourceLabel(source: string): string {
	if (source === 'figma') return 'Figma';
	if (source === 'url' || source === 'eds-url') return 'URL';
	if (source === 'html') return 'HTML';
	return source;
}

// The indicator families. SHAPE encodes settled-ness (hollow = not yet settled,
// solid = settled); COLOR encodes meaning (green good/live, amber ready-to-ship,
// red problem, gray idle). The generating ring is the only one that animates. NO
// brand gradient and NO blue is ever used for status — blue stays interactive-only.
// 'ready' = built but not yet published (the deliberate publish gate).
export type StatusKind = 'gen' | 'ready' | 'done' | 'error' | 'idle';

export function statusKind(status: SessionStatus, phase?: string, shipped?: ShipState): StatusKind {
	// A cancelled run is idle (gray dot), not an error (red dot).
	if (isCancelled(status, phase)) return 'idle';
	if (status === 'generating' || status === 'refining' || status === 'running'
		|| status === 'waiting' || status === 'deploying' || status === 'shipping'
		|| status === 'queued' || status === 'pending') {
		// queued/pending also read as "not yet settled" but should not breathe; the
		// caller distinguishes by checking `isLive` below. Default the working set
		// to 'gen' and let pending/paused/cancelled fall to idle via isLive.
		return status === 'queued' || status === 'pending' ? 'idle' : 'gen';
	}
	// A finished build that hasn't been published yet sits at the publish gate.
	if (isBuildGate(status, shipped)) return 'ready';
	if (status === 'done') return 'done';
	if (status === 'error') return 'error';
	return 'idle'; // paused, cancelled
}

// A session is "live" (actively working) when it should hoist to the top and the
// header should show the breathing ring + phase word.
export function isLive(status: SessionStatus): boolean {
	return status === 'generating' || status === 'refining' || status === 'running'
		|| status === 'waiting' || status === 'deploying' || status === 'shipping';
}
