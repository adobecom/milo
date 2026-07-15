import { ActionButton } from '@react-spectrum/s2';
import Add from '@react-spectrum/s2/icons/Add';
import Settings from '@react-spectrum/s2/icons/Settings';
import AppsAll from '@react-spectrum/s2/icons/AppsAll';
import HelpCircle from '@react-spectrum/s2/icons/HelpCircle';
import { useUiState } from './UiStateContext';
import { useSessions } from '../sessions/SessionsProvider';
import { sourceLabel, stateWord, isLive } from './sessionStatus';
import styles from './TopBar.module.css';

export function TopBar() {
	const { state, dispatch } = useUiState();
	const { dispatch: sessionsDispatch, activeSession, activeSessionId, history } =
		useSessions();

	function handleNewSession() {
		// Leaving the design-system view too, so "+" always lands on a fresh entry.
		dispatch({ type: 'closeDesignSystem' });
		sessionsDispatch({ type: 'setActiveSessionId', sessionId: null });
	}

	function handleSettings() {
		dispatch({ type: 'openSettings' });
	}

	function handleDesignSystem() {
		dispatch({ type: state.view === 'designSystem' ? 'closeDesignSystem' : 'openDesignSystem' });
	}

	function handleHelp() {
		dispatch({ type: 'openSplash' });
	}

	// The crumb title mirrors the sidebar row exactly — derive it from the same
	// history entry the list renders, so header and sidebar can never disagree.
	const entry = activeSessionId
		? history.find((e) => e.sessionId === activeSessionId)
		: undefined;
	const title =
		entry?.label ||
		entry?.input?.slice(0, 48) ||
		activeSession?.versions?.[0]?.intent ||
		'';

	const live = activeSession ? isLive(activeSession.status) : false;
	const word = activeSession
		? stateWord(activeSession.status, activeSession.phase, activeSession.shipped)
		: '';
	// A cancelled run is status:'error' + phase:'cancelled' — a user stop, not a
	// failure. Don't paint it with the error treatment.
	const isError = activeSession?.status === 'error' && activeSession.phase !== 'cancelled';

	return (
		<div className={styles.topbar}>
			{/* Brand lockup = home affordance. Pressing it returns to the entry screen. */}
			<button
				type="button"
				className={styles.brand}
				onClick={handleNewSession}
				aria-label="Page Forge home"
			>
				<span className={styles.brandMark}>PF</span>
				<span className={styles.brandName}>Page Forge</span>
			</button>

			{/* Wayfinding breadcrumb — plain text, no chips, no color coding. */}
			<div className={styles.crumb}>
				<span className={styles.sep}>/</span>
				{activeSession ? (
					<>
						{live && <span className={`${styles.ring} ${styles.ringGen}`} />}
						<span className={styles.crumbSrc}>
							{sourceLabel(activeSession.source)}
						</span>
						<span className={styles.crumbTitle}>{title}</span>
						<span
							className={`${styles.crumbState} ${isError ? styles.crumbStateErr : ''}`}
						>
							· {word}
						</span>
					</>
				) : (
					<span className={styles.crumbPlace}>Start a new page</span>
				)}
			</div>

			{/* Quiet S2 ActionButtons: New page (+), Design system, Settings. No CTA pill. */}
			<div className={styles.actions}>
				<ActionButton
					onPress={handleNewSession}
					isQuiet
					aria-label="New page"
				>
					<Add />
				</ActionButton>
				<ActionButton
					onPress={handleDesignSystem}
					isQuiet
					aria-label="Design system"
				>
					<AppsAll />
				</ActionButton>
				<ActionButton
					onPress={handleHelp}
					isQuiet
					aria-label="What is Forge? (welcome tour)"
				>
					<HelpCircle />
				</ActionButton>
				<ActionButton
					onPress={handleSettings}
					isQuiet
					aria-label="Settings"
				>
					<Settings />
				</ActionButton>
			</div>
		</div>
	);
}
