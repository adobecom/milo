// ── API client (ported from vanilla page-forge.js lines 844–981) ──────────────

import type { RenderFidelity, Session } from './types';
import type { ForgeConfig } from '../config';
import { demoApi } from './demo/demoApi';

// ── Demo-mode toggle ────────────────────────────────────────────────────────────
// When on, every call routes to the smoke-and-mirrors driver (demo/demoApi.ts)
// instead of the page-forge server — so the demo runs with no backend, no key,
// and no 30-minute wait. ON in dev (vite dev / :5173) AND in a build that sets
// VITE_FORGE_DEMO=true (the da.live ?ref=local showtime build, which is a
// production build so DEV alone wouldn't cover it). A normal `client:build`
// sets neither → demo OFF, real server used. Nothing to remember, no leak risk.
const DEMO_MODE =
  import.meta.env.DEV || import.meta.env.VITE_FORGE_DEMO === 'true';

// ── Backend namespace + per-account auth (milo-logs-deploy port) ──────────────
// The backend now lives in milo-logs-deploy and namespaces forge routes under
// /forge (coexisting with /logs, /ping). All endpoint paths below stay relative;
// apiFetch prepends this prefix once.
const API_PREFIX = '/forge';

// Every request is account-scoped server-side. In the DA app shell the signed-in
// DA/IMS access token is the identity; on bare localhost (no DA parent) we fall
// back to a stable per-browser dev account so the tool still works and history
// stays consistent. The DA provider calls setForgeAuthToken() once it resolves.
let authToken = '';
export function setForgeAuthToken(token: string | null | undefined): void {
  authToken = token || '';
}
function currentAuthToken(): string {
  if (authToken) return authToken;
  try {
    let id = localStorage.getItem('forge.devAccount');
    if (!id) {
      id = `local-${Math.random().toString(36).slice(2, 10)}`;
      localStorage.setItem('forge.devAccount', id);
    }
    return id;
  } catch {
    return 'local-dev';
  }
}

// ── Render-diff fidelity normalizer (the-new-plan §4.2 item 8) ────────────────
// The server returns the raw session object. It does NOT yet attach a structured
// `fidelity` block (the convergence scalars live in the version summary string +
// an on-disk summary.json — see pendingLiveE2E). This reader is tolerant of the
// shapes the server is LIKELY to expose when it wires this through (top-level
// `fidelity`, or nested under `shipped` / `shipped.matchReport`) so the UI lights
// up with no further client change. Returns null when nothing is present.
function pickFidelity(s: Session): RenderFidelity | null {
  const shipped = (s.shipped as Record<string, unknown> | undefined) || {};
  const matchReport = (shipped.matchReport as Record<string, unknown> | undefined) || {};
  const raw =
    (s.fidelity as unknown) ||
    (shipped.fidelity as unknown) ||
    (matchReport.fidelity as unknown) ||
    null;
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  const num = (v: unknown): number | null =>
    typeof v === 'number' && Number.isFinite(v) ? v : null;
  const fidelity: RenderFidelity = {
    combined: num(r.combined),
    textPresence: num(r.textPresence),
    pixelMismatch: num(r.pixelMismatch),
    presenceMeasured: typeof r.presenceMeasured === 'boolean' ? r.presenceMeasured : null,
  };
  // Only surface the block if at least one scalar is real.
  const hasAny =
    fidelity.combined != null ||
    fidelity.textPresence != null ||
    fidelity.pixelMismatch != null;
  return hasAny ? fidelity : null;
}

function withFidelity(s: Session): Session {
  const fidelity = pickFidelity(s);
  return fidelity ? { ...s, fidelity } : s;
}

// ── Low-level fetch ───────────────────────────────────────────────────────────

export async function apiFetch(
  path: string,
  init: RequestInit = {},
  serverUrl: string,
): Promise<unknown> {
  const url = `${serverUrl}${API_PREFIX}${path}`;
  let res: Response;
  try {
    res = await fetch(url, {
      ...init,
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${currentAuthToken()}`,
        ...((init.headers as Record<string, string>) || {}),
      },
    });
  } catch (netErr) {
    const err = new Error(
      `Couldn't reach the page-forge server at ${serverUrl} — is it running? (${(netErr as Error).message})`,
    );
    (err as Error & { status: number }).status = 0;
    throw err;
  }
  const text = await res.text();
  let body: unknown;
  try {
    body = text ? JSON.parse(text) : {};
  } catch {
    body = { _raw: text };
  }
  if (!res.ok) {
    const err = new Error(
      (body as Record<string, string>).error || `HTTP ${res.status}: ${text.slice(0, 200)}`,
    );
    (err as Error & { status: number }).status = res.status;
    throw err;
  }
  return body;
}

// ── Server-facing config slice ────────────────────────────────────────────────

function buildServerConfig(config: ForgeConfig): Record<string, unknown> {
  return {
    repoPath: config.repoPath,
    consumerPreviewUrl: config.consumerPreviewUrl,
    miloPath: config.miloPath,
    figmaToken: config.figmaToken,
    stardustSkillPath: config.stardustSkillPath,
    impeccableSkillPath: config.impeccableSkillPath,
    daUsername: config.daUsername,
    export: config.export,
  };
}

// ── Typed DaContext ────────────────────────────────────────────────────────────

export interface DaContext {
  org: string;
  repo: string;
  ref?: string;
  path?: string;
}

// ── API surface ───────────────────────────────────────────────────────────────

const realApi = {
  createSession(
    body: { source: string; sourceInput: Record<string, unknown> },
    serverUrl: string,
    daContext: DaContext | null,
    config: ForgeConfig,
  ): Promise<Session> {
    return apiFetch(
      '/sessions',
      {
        method: 'POST',
        body: JSON.stringify({
          source: body.source,
          sourceInput: body.sourceInput,
          daContext,
          serverConfig: buildServerConfig(config),
        }),
      },
      serverUrl,
    ) as Promise<Session>;
  },

  restoreSession(
    body: {
      source: string;
      sourceInput: Record<string, unknown>;
      versions: Array<{ html: string; intent?: string | null; basedOnV?: number | null }>;
    },
    serverUrl: string,
    daContext: DaContext | null,
    config: ForgeConfig,
  ): Promise<Session> {
    return apiFetch(
      '/sessions/restore',
      {
        method: 'POST',
        body: JSON.stringify({
          source: body.source,
          sourceInput: body.sourceInput,
          versions: body.versions,
          daContext,
          serverConfig: buildServerConfig(config),
        }),
      },
      serverUrl,
    ) as Promise<Session>;
  },

  async getSession(sessionId: string, serverUrl: string): Promise<Session> {
    const s = (await apiFetch(`/sessions/${sessionId}`, {}, serverUrl)) as Session;
    return withFidelity(s);
  },

  cancelSession(sessionId: string, serverUrl: string): Promise<{ ok: boolean; aborted: boolean }> {
    return apiFetch(
      `/sessions/${sessionId}/cancel`,
      { method: 'POST' },
      serverUrl,
    ) as Promise<{ ok: boolean; aborted: boolean }>;
  },

  deployPrototype(
    sessionId: string,
    serverUrl: string,
    daContext: DaContext | null,
    daToken: string,
    config: ForgeConfig,
    opts?: {
      slug?: string;
      username?: string;
      mode?: 'blocks' | 'overlay';
      animations?: 'default' | 'preserve' | 'off';
      exportOpts?: unknown;
    },
  ): Promise<{ sessionId: string; currentV: number }> {
    return apiFetch(
      `/sessions/${sessionId}/deploy-prototype`,
      {
        method: 'POST',
        body: JSON.stringify({
          slug: opts?.slug,
          username: opts?.username,
          mode: opts?.mode,
          animations: opts?.animations,
          daContext,
          token: daToken,
          repoPath: config.repoPath,
          consumerPreviewUrl: config.consumerPreviewUrl,
          export: opts?.exportOpts || config.export,
        }),
      },
      serverUrl,
    ) as Promise<{ sessionId: string; currentV: number }>;
  },

  ship(
    sessionId: string,
    serverUrl: string,
    daContext: DaContext | null,
    daToken: string,
    config: ForgeConfig,
    opts?: { exportOpts?: unknown },
  ): Promise<{ sessionId: string; currentV: number }> {
    return apiFetch(
      `/sessions/${sessionId}/ship`,
      {
        method: 'POST',
        body: JSON.stringify({
          daContext,
          token: daToken,
          repoPath: config.repoPath,
          consumerPreviewUrl: config.consumerPreviewUrl,
          export: opts?.exportOpts || config.export,
        }),
      },
      serverUrl,
    ) as Promise<{ sessionId: string; currentV: number }>;
  },

  // Stand up / re-prop the local render stack (:3000 content + :6456 libs) for an
  // already-shipped session and return its localhost ?milolibs=local preview URL.
  previewLocal(
    sessionId: string,
    serverUrl: string,
    config?: ForgeConfig,
  ): Promise<{ ok: boolean; previewUrl: string; started?: string[] }> {
    return apiFetch(
      `/sessions/${sessionId}/preview-local`,
      { method: 'POST', body: JSON.stringify({ repoPath: config?.repoPath }) },
      serverUrl,
    ) as Promise<{ ok: boolean; previewUrl: string; started?: string[] }>;
  },

  refreshToken(sessionId: string, serverUrl: string, token: string): Promise<unknown> {
    return apiFetch(
      `/sessions/${sessionId}/refresh-token`,
      {
        method: 'POST',
        body: JSON.stringify({ token }),
      },
      serverUrl,
    );
  },

  retrySession(
    sessionId: string,
    serverUrl: string,
    daContext: DaContext | null,
    daToken: string,
    config: ForgeConfig,
  ): Promise<Session> {
    return apiFetch(
      `/sessions/${sessionId}/retry`,
      {
        method: 'POST',
        body: JSON.stringify({
          serverConfig: buildServerConfig(config),
          daContext,
          token: daToken,
        }),
      },
      serverUrl,
    ) as Promise<Session>;
  },

  getMatchReport(sessionId: string, serverUrl: string): Promise<unknown> {
    return apiFetch(`/sessions/${sessionId}/match-report`, {}, serverUrl);
  },

  getSessionsHistory(serverUrl: string): Promise<unknown> {
    return apiFetch('/sessions/history', {}, serverUrl);
  },

  revealPath(path: string, serverUrl: string): Promise<unknown> {
    return apiFetch(
      '/reveal-path',
      {
        method: 'POST',
        body: JSON.stringify({ path }),
      },
      serverUrl,
    );
  },
};

// In demo mode, fold the smoke-and-mirrors driver over the real surface. The
// demo methods are a subset with matching names + return shapes; they ignore the
// extra (serverUrl/daContext/config/token) args harmlessly. Anything the demo
// doesn't override (none today) falls through to realApi.
export const api: typeof realApi = DEMO_MODE
  ? ({ ...realApi, ...(demoApi as Partial<typeof realApi>) } as typeof realApi)
  : realApi;

export default api;
