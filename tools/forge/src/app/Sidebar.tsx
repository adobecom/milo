import { ActionButton } from '@react-spectrum/s2';
import ChevronLeft from '@react-spectrum/s2/icons/ChevronLeft';
import ChevronRight from '@react-spectrum/s2/icons/ChevronRight';
import Delete from '@react-spectrum/s2/icons/Delete';
import Refresh from '@react-spectrum/s2/icons/Refresh';
import WebPage from '@react-spectrum/s2/icons/WebPage';
import { useUiState } from './UiStateContext';
import { useSessions } from '../sessions/SessionsProvider';
import type { HistoryEntry } from '../sessions/types';
import { sourceLabel, stateWord, statusKind, isLive } from './sessionStatus';
import styles from './Sidebar.module.css';
import { groupSessions } from './sessionGrouping';

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtAge(ts: number): string {
	const diffMs = Date.now() - ts;
	const diffMin = Math.floor(diffMs / 60_000);
	if (diffMin < 1) return 'just now';
	if (diffMin < 60) return `${diffMin}m ago`;
	const diffH = Math.floor(diffMin / 60);
	if (diffH < 24) return `${diffH}h ago`;
	return `${Math.floor(diffH / 24)}d ago`;
}

function sourceWordClass(source: string): string {
	if (source === 'figma') return `${styles.src} ${styles.srcFigma}`;
	if (source === 'url' || source === 'eds-url') return `${styles.src} ${styles.srcUrl}`;
	return `${styles.src} ${styles.srcHtml}`;
}


// The non-gradient status glyph: shape encodes settled-ness, color encodes meaning.
function StatusGlyph({ entry }: { entry: HistoryEntry }) {
	const kind = isLive(entry.status) ? 'gen' : statusKind(entry.status, entry.phase, entry.shipped);
	const cls =
		kind === 'gen' ? styles.stGen
			: kind === 'ready' ? styles.stReady
				: kind === 'done' ? styles.stDone
					: kind === 'error' ? styles.stErr
						: styles.stIdle;
	return <span className={`${styles.st} ${cls}`} title={stateWord(entry.status, entry.phase, entry.shipped)} />;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function Sidebar() {
	const { state, dispatch } = useUiState();
	const collapsed = state.sidebarCollapsed;
	const { history, activeSessionId, dispatch: sessionsDispatch, selectHistoryEntry } =
		useSessions();

	function handleCollapse() {
		dispatch({ type: 'toggleSidebar' });
	}

	function handleSelectEntry(entry: HistoryEntry) {
		selectHistoryEntry(entry);
	}

	function handleDelete(entry: HistoryEntry) {
		dispatch({
			type: 'openConfirm',
			payload: {
				title: 'Delete this page?',
				message: `"${entry.label || '(untitled)'}" will be removed from your history. This can't be undone.`,
				confirmLabel: 'Delete',
				destructive: true,
				onConfirm: () => {
					sessionsDispatch({ type: 'removeSession', sessionId: entry.sessionId });
					if (entry.sessionId === activeSessionId) {
						sessionsDispatch({ type: 'setActiveSessionId', sessionId: null });
					}
				},
			},
		});
	}

	// ── Collapsed rail = status spine (keeps ALL recent context, not just one) ──
	if (collapsed) {
		// Live rows first (so a working session stays on top), then the rest in order.
		const spine = [...history].sort((a, b) => {
			const la = isLive(a.status) ? 0 : 1;
			const lb = isLive(b.status) ? 0 : 1;
			return la - lb;
		});
		return (
			<aside className={`${styles.sidebar} ${styles.rail}`}>
				<ActionButton onPress={handleCollapse} isQuiet aria-label="Expand sidebar">
					<ChevronRight />
				</ActionButton>
				<div className={styles.spine}>
					{spine.map((entry) => {
						const isActive = entry.sessionId === activeSessionId;
						const tip = `${sourceLabel(entry.source)} — ${entry.label || '(untitled)'} · ${stateWord(entry.status, entry.phase, entry.shipped)}`;
						return (
							<button
								key={entry.sessionId}
								type="button"
								className={`${styles.spineItem} ${isActive ? styles.spineItemActive : ''}`}
								title={tip}
								aria-label={tip}
								onClick={() => { handleCollapse(); handleSelectEntry(entry); }}
							>
								<StatusGlyph entry={entry} />
							</button>
						);
					})}
				</div>
			</aside>
		);
	}

	const groups = groupSessions(history);

	return (
		<aside className={styles.sidebar}>
			{history.length === 0 ? (
				<div className={styles.empty}>
					<WebPage UNSAFE_className={styles.emptyGlyph} aria-hidden />
					<p className={styles.emptyHead}>Your pages will live here</p>
					<p className={styles.emptySub}>Start one from a Figma frame or a page URL.</p>
				</div>
			) : (
				<div className={styles.listWrap}>
					<ul className={styles.list}>
						{groups.map((group, groupIdx) => (
							<li key={group.label} className={styles.group}>
								{/* The collapse control shares the first group's label line —
								    no orphan row, no empty band above the list. */}
								<div className={styles.groupHead}>
									<span className={styles.groupLabel}>{group.label}</span>
									{groupIdx === 0 && (
										<ActionButton
											onPress={handleCollapse}
											isQuiet
											aria-label="Collapse sidebar"
										>
											<ChevronLeft />
										</ActionButton>
									)}
								</div>
								<ul className={styles.groupList}>
									{group.entries.map((entry) => {
										const isActive = entry.sessionId === activeSessionId;
										const live = isLive(entry.status);
										// A built-but-unpublished session is settled (not live) but its
										// "Ready to publish" state is actionable — surface the word in
										// place of the age so it doesn't read as just another old row.
										const showWord =
											live || statusKind(entry.status, entry.phase, entry.shipped) === 'ready';
										return (
											<li
												key={entry.sessionId}
												className={`${styles.item} ${isActive ? styles.itemActive : ''}`}
												onClick={() => handleSelectEntry(entry)}
												role="button"
												tabIndex={0}
												onKeyDown={(e) => e.key === 'Enter' && handleSelectEntry(entry)}
											>
												<span className={styles.itemTitle}>
													{entry.label || entry.input?.slice(0, 40) || '(untitled)'}
												</span>
												<span className={styles.meta}>
													<StatusGlyph entry={entry} />
													<span className={sourceWordClass(entry.source)}>
														{sourceLabel(entry.source)}
													</span>
													<span className={styles.mid}>·</span>
													{showWord ? (
														<span className={styles.phase}>{stateWord(entry.status, entry.phase, entry.shipped)}</span>
													) : (
														<span className={styles.age}>{fmtAge(entry.ts)}</span>
													)}
													<button
														type="button"
														className={styles.del}
														aria-label="Delete session"
														onClick={(e) => { e.stopPropagation(); handleDelete(entry); }}
													>
														<Delete />
													</button>
												</span>
											</li>
										);
									})}
								</ul>
							</li>
						))}
					</ul>
				</div>
			)}

			<button
				className={styles.loadMore}
				type="button"
				title="Load past sessions from server"
				onClick={() => {
					// Phase 3+ will implement server history loading
				}}
			>
				<Refresh /> Load earlier sessions
			</button>
		</aside>
	);
}
