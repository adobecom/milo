// ── useActiveSessionPoll — polls a session by id and updates sessions state ────
// Ported from vanilla page-forge.js pollTick (lines 1021–1131).

import { useEffect, useRef } from 'react';
import { api } from './api';
import { useSessions } from './SessionsProvider';
import { useDaSdk } from '../da/DaSdkProvider';
import { useConfig } from '../config';
import { POLL_INTERVAL_MS, TOKEN_REFRESH_EVERY_N_TICKS } from './types';
import type { Session } from './types';
import { ToastQueue } from '@react-spectrum/s2';

// Statuses that are considered "busy" (mid-run)
function isBusy(s: Session): boolean {
  return ['queued', 'generating', 'refining', 'shipping', 'deploying', 'running'].includes(s.status);
}

export function useActiveSessionPoll(sessionId: string | null): void {
  const { sessions, dispatch, upsertHistory } = useSessions();
  const { da, refresh: refreshDaSdk } = useDaSdk();
  const { config } = useConfig();

  // Refs — do not cause re-renders
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const failureCountRef = useRef(0);
  const tokenTickRef = useRef(0);
  // Track whether we're using the slow interval (post-settle)
  const slowPollRef = useRef(false);

  // Keep latest values accessible inside the interval callback without
  // re-registering the effect (and thus resetting the interval) on every render.
  const sessionIdRef = useRef(sessionId);
  sessionIdRef.current = sessionId;

  const daRef = useRef(da);
  daRef.current = da;

  const configRef = useRef(config);
  configRef.current = config;

  const sessionsRef = useRef(sessions);
  sessionsRef.current = sessions;

  useEffect(() => {
    // Clear any existing interval when sessionId changes
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    failureCountRef.current = 0;
    tokenTickRef.current = 0;
    slowPollRef.current = false;

    if (!sessionId) return;

    // Immediate first tick, then set up interval
    async function pollTick() {
      const id = sessionIdRef.current;
      if (!id) return;

      const serverUrl = configRef.current.serverUrl;

      try {
        const fresh = await api.getSession(id, serverUrl);
        failureCountRef.current = 0;

        const prev = sessionsRef.current.get(id);
        dispatch({ type: 'upsertSession', session: fresh });

        // Token refresh heartbeat: while deploying/shipping, periodically
        // re-await DA_SDK and post the freshest token to the worktree.
        if (fresh.status === 'deploying' || fresh.status === 'shipping') {
          tokenTickRef.current++;
          if (tokenTickRef.current % TOKEN_REFRESH_EVERY_N_TICKS === 0) {
            refreshDaSdk().then(() => {
              const currentDa = daRef.current;
              if (currentDa.token) {
                api
                  .refreshToken(id, serverUrl, currentDa.token)
                  .catch((e: unknown) => console.warn('refreshToken failed', e));
              }
            });
          }
        } else {
          tokenTickRef.current = 0;
        }

        // Anchor run-scoped elapsed when a run starts server-side
        if ((!prev || !isBusy(prev)) && isBusy(fresh)) {
          dispatch({ type: 'markRunStart', sessionId: id });
          // A settled session that goes busy again (e.g. clicking "Send to
          // Authoring" at the gate kicks off the deploy beat) must return to the
          // FAST poll — otherwise we'd stay on the post-settle 5s cadence and the
          // deploy progress would crawl. Restore the normal interval.
          if (slowPollRef.current) {
            slowPollRef.current = false;
            if (intervalRef.current) clearInterval(intervalRef.current);
            intervalRef.current = setInterval(pollTick, POLL_INTERVAL_MS);
          }
        }
        // Freeze wall clock when run settles; surface deploy errors/warnings as toasts
        if (prev && isBusy(prev) && !isBusy(fresh)) {
          dispatch({ type: 'markRunEnd', sessionId: id });

          // Fire deploy-outcome toasts once, at the transition point.
          const sh = (fresh.shipped || {}) as {
            deployError?: string;
            deployStatus?: string;
            lintBlockedCount?: number;
            prototypeBranchName?: string;
          };
          if (sh.deployError) {
            ToastQueue.negative(`Deploy failed: ${sh.deployError}`);
          } else if (sh.deployStatus === 'partial') {
            ToastQueue.negative('Deploy completed with warnings — some blocks were skipped.');
          }
          // Only show the lint-blocked toast when the deploy didn't already fail outright
          // — both fields can be set simultaneously (inner catch sets lintBlockedCount,
          //   re-throws, outer catch sets deployError), and two stacked red toasts is
          //   confusing when the error toast already covers the failure.
          if (sh.lintBlockedCount && !sh.deployError) {
            const branch = sh.prototypeBranchName || '(see activity log)';
            ToastQueue.negative(
              `${sh.lintBlockedCount} block(s) stranded by forge-block-lint — preserved on branch ${branch}. See activity log to recover.`,
            );
          }
        }

        // Upsert history on every poll
        upsertHistory(fresh);

        // Slow the poll to 5s after settling
        const settled =
          fresh.status === 'done' ||
          fresh.status === 'error' ||
          fresh.status === 'paused';

        if (settled && !slowPollRef.current) {
          slowPollRef.current = true;
          if (intervalRef.current) clearInterval(intervalRef.current);
          intervalRef.current = setInterval(pollTick, 5000);
        }
      } catch (err: unknown) {
        const apiErr = err as Error & { status?: number };

        // 404 = server restart wiped the in-memory session. Try to restore from cache.
        if (apiErr.status === 404) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          intervalRef.current = null;

          const cached = sessionsRef.current.get(id);
          if (cached) {
            // Attempt to restore from cached versions
            const versions = (cached.versions || [])
              .filter((v) => v?.html)
              .map((v) => ({
                html: v.html as string,
                intent: v.intent ?? null,
                basedOnV: v.basedOnV ?? null,
              }));

            if (versions.length > 0) {
              try {
                const restored = await api.restoreSession(
                  {
                    source: cached.source || 'figma',
                    sourceInput: cached.sourceInput || {},
                    versions,
                  },
                  configRef.current.serverUrl,
                  daRef.current.context,
                  configRef.current,
                );
                // Remap old id → new id
                dispatch({
                  type: 'remapSessionId',
                  oldId: id,
                  newId: restored.sessionId,
                  session: restored,
                });
                // Infra-speak ("server restart") — engineer-only.
                if (configRef.current.debugMode === true) {
                  ToastQueue.info(
                    'Session restored after server restart — generate a new one to keep iterating.',
                  );
                }
              } catch (restoreErr) {
                console.warn('Session restore failed', restoreErr);
                if (configRef.current.debugMode === true) {
                  ToastQueue.info('Session not found on server — start a new one.');
                }
              }
            } else if (configRef.current.debugMode === true) {
              ToastQueue.info('Session not on server — try starting a new one.');
            }
          } else if (configRef.current.debugMode === true) {
            ToastQueue.info('Session not on server — try starting a new one.');
          }
          return;
        }

        failureCountRef.current++;
        console.warn('poll failed', apiErr.message);
        if (failureCountRef.current >= 5) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          intervalRef.current = null;
          ToastQueue.negative(`Lost connection to server: ${apiErr.message}`);
        }
      }
    }

    // Fire immediately then set up interval
    pollTick();
    intervalRef.current = setInterval(pollTick, POLL_INTERVAL_MS);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);
}
