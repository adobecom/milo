// ── Session-list grouping (pure) ────────────────────────────────────────────
// Extracted from Sidebar.tsx (MWPW-199253) so the time-grouped, urgency-hoisted
// bucketing can be unit-tested without importing React or @react-spectrum/s2.
// Depends only on the pure isLive() + Date-based dayStart().
import type { HistoryEntry } from '../sessions/types';
import { isLive } from './sessionStatus';

export interface Group {
	label: string;
	entries: HistoryEntry[];
}

// Start-of-today / start-of-yesterday boundaries for recency grouping.
export function dayStart(offsetDays: number): number {
	const d = new Date();
	d.setHours(0, 0, 0, 0);
	return d.getTime() - offsetDays * 86_400_000;
}

// Group order grafts urgency-then-recency WITHOUT churn: only LIVE and ERROR rows
// hoist into their own pinned groups; done rows stay in their time bucket and
// never jump under the user's cursor mid-run.
export function groupSessions(history: HistoryEntry[]): Group[] {
	const inProgress: HistoryEntry[] = [];
	const needsReview: HistoryEntry[] = [];
	const today: HistoryEntry[] = [];
	const yesterday: HistoryEntry[] = [];
	const earlier: HistoryEntry[] = [];

	const todayStart = dayStart(0);
	const yesterdayStart = dayStart(1);

	for (const e of history) {
		if (isLive(e.status)) {
			inProgress.push(e);
		} else if (e.status === 'error') {
			needsReview.push(e);
		} else if (e.ts >= todayStart) {
			today.push(e);
		} else if (e.ts >= yesterdayStart) {
			yesterday.push(e);
		} else {
			earlier.push(e);
		}
	}

	const groups: Group[] = [];
	if (inProgress.length) groups.push({ label: 'In progress', entries: inProgress });
	if (needsReview.length) groups.push({ label: 'Needs review', entries: needsReview });
	if (today.length) groups.push({ label: 'Today', entries: today });
	if (yesterday.length) groups.push({ label: 'Yesterday', entries: yesterday });
	if (earlier.length) groups.push({ label: 'Earlier', entries: earlier });
	return groups;
}
