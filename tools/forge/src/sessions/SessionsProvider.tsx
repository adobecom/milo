// ── SessionsProvider — owns sessions map, history, and active session id ──────
// Ported from vanilla page-forge.js history helpers (lines 763–820) +
// session state management.

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  type ReactNode,
} from 'react';
import type { Session, HistoryEntry, HistoryEntryVersion } from './types';
import {
  MAX_HISTORY,
  MAX_HTML_IN_HISTORY_BYTES,
  STORAGE_KEY_HISTORY,
  STORAGE_KEY_RUNS,
} from './types';
import { api } from './api';
import { useConfig } from '../config';
import { useDaSdk } from '../da/DaSdkProvider';

// ── History helpers (ported from vanilla lines 763–820) ───────────────────────

function loadHistory(): HistoryEntry[] {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY_HISTORY) || '[]') as unknown[];
    // Filter pre-reshape entries that don't have the new `versions` field.
    return (raw as HistoryEntry[]).filter(
      (e) => Array.isArray((e as HistoryEntry).versions) && (e as HistoryEntry).sessionId,
    );
  } catch {
    return [];
  }
}

function saveHistory(entries: HistoryEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(entries.slice(0, MAX_HISTORY)));
  } catch {
    // quota etc.
  }
}

// ── Run timestamps — persisted so elapsed survives page refresh ───────────────

interface RunStore {
  start: Record<string, number>;
  end: Record<string, number>;
}

function loadRuns(): { runStart: Map<string, number>; runEnd: Map<string, number> } {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY_RUNS) || '{}') as RunStore;
    return {
      runStart: new Map(Object.entries(raw.start ?? {})),
      runEnd: new Map(Object.entries(raw.end ?? {})),
    };
  } catch {
    return { runStart: new Map(), runEnd: new Map() };
  }
}

function saveRuns(runStart: Map<string, number>, runEnd: Map<string, number>): void {
  try {
    const data: RunStore = {
      start: Object.fromEntries(runStart),
      end: Object.fromEntries(runEnd),
    };
    localStorage.setItem(STORAGE_KEY_RUNS, JSON.stringify(data));
  } catch {
    // quota etc.
  }
}

// Reconstruct a synthetic Session from a stored HistoryEntry so the sessions Map
// can be pre-populated before the poll fetches a live copy from the server.
// Mirrors vanilla loadHistoryEntry's synthetic-session build.
function historyEntryToSession(entry: HistoryEntry): Session {
  return {
    sessionId: entry.sessionId,
    source: entry.source,
    status: entry.status,
    phase: entry.phase,
    currentV: entry.currentV,
    figmaFilePath: entry.figmaFilePath ?? null,
    sourceInput: {},
    versions: (entry.versions ?? []).map((v) => ({
      v: v.v,
      intent: v.intent,
      basedOnV: v.basedOnV,
      producedAt: v.producedAt,
      html: v.html ?? null,
      summary: v.summary ?? null,
      usage: v.usage,
    })),
    messages: (entry.messagesTail ?? []).map((m) => ({ text: m.text })),
    shipped: entry.shipped || {},
    matchReport: entry.matchReportSummary ?? null,
  };
}

// Strip stardust variant-label decoration
function cleanVariantIntent(intent: string | null | undefined): string {
  let s = (intent || '').replace(/\s*·\s*Variant\s+[ABC](?:\s*—\s*cinematic)?$/i, '').trim();
  if (/^Variant\s+[ABC](?:\s*—\s*cinematic)?$/i.test(s) || /^Redesign$/i.test(s)) s = '';
  return s;
}

function deriveLabel(session: Session): string {
  const intent = cleanVariantIntent(session.versions?.[0]?.intent);
  if (intent) return intent.slice(0, 60);
  const src = session.sourceInput || {};
  if (src.url) return String(src.url).replace(/^https?:\/\//, '').slice(0, 60);
  if (src.figmaUrl) return String(src.figmaUrl).replace(/^https?:\/\/(www\.)?figma\.com\//, '').slice(0, 60);
  if (src.html) return '(raw HTML)';
  return '(untitled)';
}

function buildHistoryEntry(session: Session, existing?: HistoryEntry): HistoryEntry {
  const versionsMeta: HistoryEntryVersion[] = (session.versions ?? []).map((v) => ({
    v: v.v,
    intent: v.intent,
    basedOnV: v.basedOnV,
    producedAt: v.producedAt,
    html: v.html ?? null,
    summary: v.summary ?? null,
    usage: v.usage,
  }));

  // Trim oldest HTML blobs to stay under budget
  let total = versionsMeta.reduce((acc, v) => acc + (v.html?.length || 0), 0);
  while (total > MAX_HTML_IN_HISTORY_BYTES && versionsMeta.length > 1) {
    const first = versionsMeta.find((v) => v.html);
    if (!first) break;
    total -= first.html!.length;
    first.html = null;
  }

  const MAX_LOG_TAIL = 200;
  const msgs = Array.isArray(session.messages) ? session.messages : [];
  const messagesTail = msgs.slice(-MAX_LOG_TAIL).map((m) => ({ text: m.text || String(m) }));

  const mr = (session.matchReport || (session.shipped as Record<string, unknown>)?.matchReport) as Record<string, unknown> | null;
  const matchReportSummary = mr
    ? { counters: mr.counters, stats: mr.stats, sections: mr.sections, newBlockTasks: mr.newBlockTasks }
    : null;

  return {
    sessionId: session.sessionId,
    source: session.source,
    label: deriveLabel(session),
    versionCount: (session.versions ?? []).length,
    currentV: session.currentV,
    versions: versionsMeta,
    shipped: session.shipped || {},
    status: session.status,
    phase: session.phase,
    messagesTail,
    matchReportSummary,
    figmaFilePath: session.figmaFilePath || null,
    ts: (existing as HistoryEntry & { ts?: number })?.ts ?? Date.now(),
  };
}

// ── State / Actions ───────────────────────────────────────────────────────────

interface SessionsState {
  sessions: Map<string, Session>;
  history: HistoryEntry[];
  activeSessionId: string | null;
  runStart: Map<string, number>;
  runEnd: Map<string, number>;
}

type SessionsAction =
  | { type: 'upsertSession'; session: Session }
  | { type: 'upsertHistory'; session: Session }
  | { type: 'setActiveSessionId'; sessionId: string | null }
  | { type: 'remapSessionId'; oldId: string; newId: string; session: Session }
  | { type: 'markRunStart'; sessionId: string }
  | { type: 'markRunEnd'; sessionId: string }
  | { type: 'mergeSession'; sessionId: string; patch: Partial<Session> }
  | { type: 'removeSession'; sessionId: string };

function reducer(state: SessionsState, action: SessionsAction): SessionsState {
  switch (action.type) {
    case 'upsertSession': {
      const next = new Map(state.sessions);
      next.set(action.session.sessionId, action.session);
      return { ...state, sessions: next };
    }
    case 'upsertHistory': {
      const session = action.session;
      const idx = state.history.findIndex((e) => e.sessionId === session.sessionId);
      const existing = idx >= 0 ? state.history[idx] : undefined;
      const entry = buildHistoryEntry(session, existing);
      let next: HistoryEntry[];
      if (idx >= 0) {
        next = [...state.history];
        next[idx] = entry;
      } else {
        next = [entry, ...state.history];
      }
      next = next.slice(0, MAX_HISTORY);
      saveHistory(next);
      return { ...state, history: next };
    }
    case 'setActiveSessionId':
      return { ...state, activeSessionId: action.sessionId };
    case 'remapSessionId': {
      const nextSessions = new Map(state.sessions);
      nextSessions.delete(action.oldId);
      nextSessions.set(action.newId, action.session);
      const nextHistory = state.history.map((e) =>
        e.sessionId === action.oldId ? { ...e, sessionId: action.newId } : e,
      );
      saveHistory(nextHistory);
      return {
        ...state,
        sessions: nextSessions,
        history: nextHistory,
        activeSessionId: state.activeSessionId === action.oldId ? action.newId : state.activeSessionId,
      };
    }
    case 'markRunStart': {
      const next = new Map(state.runStart);
      next.set(action.sessionId, Date.now());
      const nextEnd = new Map(state.runEnd);
      nextEnd.delete(action.sessionId);
      saveRuns(next, nextEnd);
      return { ...state, runStart: next, runEnd: nextEnd };
    }
    case 'markRunEnd': {
      const next = new Map(state.runEnd);
      next.set(action.sessionId, Date.now());
      saveRuns(state.runStart, next);
      return { ...state, runEnd: next };
    }
    case 'mergeSession': {
      const existing = state.sessions.get(action.sessionId);
      if (!existing) return state;
      const next = new Map(state.sessions);
      next.set(action.sessionId, { ...existing, ...action.patch });
      return { ...state, sessions: next };
    }
    case 'removeSession': {
      const nextSessions = new Map(state.sessions);
      nextSessions.delete(action.sessionId);
      const nextHistory = state.history.filter((e) => e.sessionId !== action.sessionId);
      saveHistory(nextHistory);
      const nextRunStart = new Map(state.runStart);
      const nextRunEnd = new Map(state.runEnd);
      nextRunStart.delete(action.sessionId);
      nextRunEnd.delete(action.sessionId);
      saveRuns(nextRunStart, nextRunEnd);
      return { ...state, sessions: nextSessions, history: nextHistory, runStart: nextRunStart, runEnd: nextRunEnd };
    }
    default:
      return state;
  }
}

function getInitialState(): SessionsState {
  const { runStart, runEnd } = loadRuns();
  return {
    sessions: new Map(),
    history: loadHistory(),
    activeSessionId: null,
    runStart,
    runEnd,
  };
}

// ── Context ───────────────────────────────────────────────────────────────────

interface SessionsContextValue {
  sessions: Map<string, Session>;
  history: HistoryEntry[];
  activeSessionId: string | null;
  activeSession: Session | null;
  runStart: Map<string, number>;
  runEnd: Map<string, number>;
  dispatch: React.Dispatch<SessionsAction>;
  startSession: (body: { source: string; sourceInput: Record<string, unknown> }) => Promise<Session>;
  cancelSession: (sessionId: string) => Promise<void>;
  deploySession: (
    sessionId: string,
    opts?: {
      slug?: string;
      username?: string;
      mode?: 'blocks' | 'overlay';
      animations?: 'default' | 'preserve' | 'off';
      exportOpts?: unknown;
    },
  ) => Promise<void>;
  shipSession: (sessionId: string, opts?: { exportOpts?: unknown }) => Promise<void>;
  retrySession: (sessionId: string) => Promise<void>;
  upsertHistory: (session: Session) => void;
  selectHistoryEntry: (entry: HistoryEntry) => void;
}

const SessionsContext = createContext<SessionsContextValue | null>(null);

// ── Provider ──────────────────────────────────────────────────────────────────

export function SessionsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, getInitialState);
  const { config } = useConfig();
  const { da, refresh: refreshDaSdk } = useDaSdk();

  const serverUrl = config.serverUrl;

  const upsertHistory = useCallback(
    (session: Session) => dispatch({ type: 'upsertHistory', session }),
    [],
  );

  // Hydrate the sessions Map with a synthetic session built from the stored
  // HistoryEntry, then mark it active.  The poll hook will overwrite it with a
  // live copy from the server on the next tick.
  const selectHistoryEntry = useCallback((entry: HistoryEntry) => {
    dispatch({ type: 'upsertSession', session: historyEntryToSession(entry) });
    dispatch({ type: 'setActiveSessionId', sessionId: entry.sessionId });
  }, []);

  const startSession = useCallback(
    async (body: { source: string; sourceInput: Record<string, unknown> }): Promise<Session> => {
      const session = await api.createSession(body, serverUrl, da.context, config);
      dispatch({ type: 'upsertSession', session });
      dispatch({ type: 'setActiveSessionId', sessionId: session.sessionId });
      dispatch({ type: 'markRunStart', sessionId: session.sessionId });
      return session;
    },
    [serverUrl, da.context, config],
  );

  const cancelSession = useCallback(
    async (sessionId: string): Promise<void> => {
      await api.cancelSession(sessionId, serverUrl);
      // The cancel endpoint returns { ok, aborted } — not a full Session.
      // Merge only the status change; the poll will overwrite with the real
      // server state (including phase:'cancelled') on the next tick.
      dispatch({ type: 'mergeSession', sessionId, patch: { status: 'error', phase: 'cancelled' } });
      dispatch({ type: 'markRunEnd', sessionId });
    },
    [serverUrl],
  );

  const deploySession = useCallback(
    async (
      sessionId: string,
      opts?: {
        slug?: string;
        username?: string;
        mode?: 'blocks' | 'overlay';
        animations?: 'default' | 'preserve' | 'off';
        exportOpts?: unknown;
      },
    ): Promise<void> => {
      await refreshDaSdk();
      // The deploy endpoint returns 202 { sessionId, currentV } — not a full Session.
      // Merge only the optimistic status; the poll overwrites with live state within one tick.
      await api.deployPrototype(sessionId, serverUrl, da.context, da.token, config, opts);
      dispatch({ type: 'mergeSession', sessionId, patch: { status: 'deploying' } });
    },
    [serverUrl, da.context, da.token, config, refreshDaSdk],
  );

  const shipSession = useCallback(
    async (sessionId: string, opts?: { exportOpts?: unknown }): Promise<void> => {
      await refreshDaSdk();
      // The ship endpoint returns 202 { sessionId, currentV } — not a full Session.
      // Merge only the optimistic status; the poll overwrites with live state within one tick.
      await api.ship(sessionId, serverUrl, da.context, da.token, config, opts);
      dispatch({ type: 'mergeSession', sessionId, patch: { status: 'shipping' } });
    },
    [serverUrl, da.context, da.token, config, refreshDaSdk],
  );

  const retrySessionFn = useCallback(
    async (sessionId: string): Promise<void> => {
      const session = await api.retrySession(sessionId, serverUrl, da.context, da.token, config);
      dispatch({ type: 'upsertSession', session });
      dispatch({ type: 'markRunStart', sessionId });
    },
    [serverUrl, da.context, da.token, config],
  );

  const activeSession = state.activeSessionId
    ? (state.sessions.get(state.activeSessionId) ?? null)
    : null;

  const value: SessionsContextValue = {
    sessions: state.sessions,
    history: state.history,
    activeSessionId: state.activeSessionId,
    activeSession,
    runStart: state.runStart,
    runEnd: state.runEnd,
    dispatch,
    startSession,
    cancelSession,
    deploySession,
    shipSession,
    retrySession: retrySessionFn,
    upsertHistory,
    selectHistoryEntry,
  };

  return (
    <SessionsContext.Provider value={value}>
      {children}
    </SessionsContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useSessions(): SessionsContextValue {
  const ctx = useContext(SessionsContext);
  if (!ctx) throw new Error('useSessions must be used inside <SessionsProvider>');
  return ctx;
}

export { SessionsContext };
export type { SessionsContextValue };
