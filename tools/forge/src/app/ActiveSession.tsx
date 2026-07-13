// ── ActiveSession — active session view ───────────────────────────────────────
// Port of renderActiveSession (vanilla page-forge.js line 1506).
// Props: sessionId: string
// Gets session from useSessions().

import { ToastQueue } from '@react-spectrum/s2';
import { useSessions } from '../sessions/SessionsProvider';
import { useDaSdk } from '../da/DaSdkProvider';
import { useConfig } from '../config';
import { useUiState } from './UiStateContext';
import { ResultCard } from './ResultCard';
import { ConversionReport } from './ConversionReport';
import { CatalogCandidates } from './CatalogCandidates';
import { resolveIntentPolicy } from './intent';
import { LocalArtifacts } from './LocalArtifacts';
import { ActivityLog } from './ActivityLog';
import { FootDisclosure } from './FootDisclosure';
import type { ConversionReportData } from './ConversionReport';

// ── Helpers ───────────────────────────────────────────────────────────────────

function kebab(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface ActiveSessionProps {
  sessionId: string;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function ActiveSession({ sessionId }: ActiveSessionProps) {
  const { sessions, deploySession, cancelSession, retrySession, dispatch } = useSessions();
  const { da } = useDaSdk();
  const { config } = useConfig();
  const { dispatch: uiDispatch } = useUiState();

  const session = sessions.get(sessionId) ?? null;

  if (!session) {
    return <div className="pf-loading">Loading session…</div>;
  }

  // TS narrowing doesn't flow into async closures — capture the non-null value
  const s = session;

  // ── Deploy handler ──────────────────────────────────────────────────────────
  // Publishing needs a destination (a connected consumer site). When it's missing
  // we don't dead-end on a toast — we open the focused "Connect to publish" modal
  // (mirrors the gated Figma door) and resume this publish once connected.
  async function handleDeploy() {
    if (!config.repoPath || !config.consumerPreviewUrl) {
      uiDispatch({ type: 'openConnectConsumer', onConnected: () => { void runDeploy(); } });
      return;
    }
    await runDeploy();
  }

  // The actual publish — assumes a destination is connected (handleDeploy gates it).
  async function runDeploy() {
    const overrides = config.export || { mode: 'milo' };

    // DA credentials are optional — the server ships to local files when they're
    // absent. Warn the user but don't block (consumerPreviewUrl is guaranteed by
    // the connect gate above, so local preview is always possible here).
    const deployUser = config.daUsername || da.username;
    const willFallBackToLocal = !da.token || !da.context || !deployUser || deployUser === 'anonymous';
    // Engineer-only caveat (local-vs-cloud ship). A creator doesn't know "DA" or
    // "local files" — only surface it in debug mode.
    if (willFallBackToLocal && config.debugMode === true) {
      ToastQueue.info(
        'Not connected to DA. Will ship to local files; open from DA to publish to the cloud.',
      );
    }

    // Derive slug from intent or source
    let slugSeed = s.versions?.[0]?.intent;
    if (!slugSeed && (s.sourceInput as Record<string, string> | undefined)?.url) {
      try {
        const u = new URL(String((s.sourceInput as Record<string, string>).url));
        const tail = u.pathname.split('/').filter(Boolean).pop();
        slugSeed = tail || u.hostname.split('.')[0] || 'page';
      } catch {
        slugSeed = 'page';
      }
    }
    if (!slugSeed && (s.sourceInput as Record<string, string> | undefined)?.figmaUrl) {
      slugSeed = 'figma';
    }
    const slug =
      kebab(slugSeed || 'untitled') + '-' + sessionId.replace(/-/g, '').slice(0, 6);

    try {
      await deploySession(sessionId, {
        slug,
        username: deployUser,
        mode: 'blocks',
        animations: 'default',
        exportOpts: overrides,
      });
      dispatch({ type: 'markRunStart', sessionId });
      // No "deploying…" toast — the on-page "Going live" state + progress IS the
      // feedback; a toast restating it is noise.
    } catch (err) {
      ToastQueue.negative(`Deploy failed: ${(err as Error).message}`);
    }
  }

  // ── Cancel handler ──────────────────────────────────────────────────────────
  async function handleCancel() {
    try {
      await cancelSession(sessionId);
    } catch (err) {
      // Cancel still clears locally
      console.warn('Cancel failed', err);
    }
  }

  // ── Retry handler ───────────────────────────────────────────────────────────
  async function handleRetry() {
    // Clear the stale failed/warning deploy state immediately so the user sees
    // a fresh slate without waiting for the server round-trip.
    const prevShipped = (s.shipped as Record<string, unknown>) || {};
    const { deployError: _de, deployStatus: _ds, deployFinishedAt: _df, lintBlockedCount: _lc, ...restShipped } = prevShipped;
    dispatch({ type: 'mergeSession', sessionId, patch: { shipped: restShipped } });

    try {
      await retrySession(sessionId);
      ToastQueue.info('Retrying…');
    } catch (err) {
      ToastQueue.negative(`Retry failed: ${(err as Error).message}`);
    }
  }

  // ── Match report data ───────────────────────────────────────────────────────
  const shipped = s.shipped as Record<string, unknown> | undefined;
  const matchReport =
    (s.matchReport as Record<string, unknown> | undefined) ||
    (shipped?.matchReport as Record<string, unknown> | undefined) ||
    null;

  const hasShipReport = Boolean(
    shipped?.slug ||
    (shipped?.blocks as unknown[] | undefined)?.length ||
    (shipped?.forgeBlocks as unknown[] | undefined)?.length ||
    (matchReport?.sections as unknown[] | undefined)?.length,
  );

  let conversionReportData: ConversionReportData | null = null;
  if (hasShipReport) {
    conversionReportData = {
      slug: shipped?.slug as string | undefined,
      branchUrl: shipped?.branchUrl as string | undefined,
      branchName: shipped?.branchName as string | undefined,
      sha: shipped?.sha as string | undefined,
      daPreviewUrl: shipped?.daPreviewUrl as string | undefined,
      milolibsUrl: (
        (shipped?.remotePreviewUrl ||
          shipped?.milolibsUrl ||
          (matchReport?.preview as Record<string, unknown> | undefined)?.remotePreviewUrl) as
          | string
          | undefined
      ),
      counters: matchReport?.counters as ConversionReportData['counters'],
      reuseRate:
        ((matchReport?.stats as Record<string, unknown> | undefined)?.reuseRate as
          | number
          | undefined) ??
        (matchReport?.counters as Record<string, unknown> | undefined)?.reuseRate as
          | number
          | undefined,
      sections: matchReport?.sections as ConversionReportData['sections'],
      newBlockTasks: matchReport?.newBlockTasks as ConversionReportData['newBlockTasks'],
      judgeVerdicts: matchReport?.judgeVerdicts as ConversionReportData['judgeVerdicts'],
      intentPolicy: resolveIntentPolicy(s),
    };
  }

  // Activity log: use messages array as log lines
  const logLines = (s.messages || []).map((m) => m.text || String(m));

  const isBusy = ['queued', 'generating', 'waiting', 'refining', 'shipping', 'deploying', 'running'].includes(
    s.status,
  );

  // While a run is in progress, the calm GeneratingCard (inside ResultCard) is the
  // whole story — no source header, no report, no telemetry competing with it. The
  // raw read log is SECONDARY (V3): tucked into a closed "Progress details"
  // disclosure below the card, for anyone who wants the play-by-play, without
  // competing with the visual. Shown to everyone (not debug-gated) — it's honest
  // progress, not engineering telemetry — but stays folded by default.
  if (isBusy) {
    return (
      <div className="pf-active-session">
        <ResultCard
          session={s}
          onDeploy={handleDeploy}
          onCancel={handleCancel}
          onRetry={handleRetry}
        />
        {logLines.length > 0 && (
          <div className="pf-foot-discs">
            <ActivityLog sessionId={sessionId} logLines={logLines} title="Progress details" key={`gen-${sessionId}`} />
          </div>
        )}
      </div>
    );
  }

  // Done/error: lead with the preview-first ResultCard, then tuck the friendly
  // section breakdown into one collapsed "How we built this" disclosure. That
  // breakdown stays for creators (it's the proportion bar, not telemetry).
  //
  // The ENGINEERING-only detail — the activity log and the local artifacts (and,
  // inside ResultCard, the "For engineering" handoff) — is audience-gated behind
  // debug mode. Designers/PMs see only the finished page; an engineer running the
  // job flips Settings → Developer → Debug mode to reveal it. See
  // forge_result_audience_layers. NOTE the new stance: COST is a creator-relevant
  // fact (it informs whether to run the pricier Reimagine), so ResultCard now shows
  // it as one quiet line (CostLine). Only turns/tokens stay engineer-only — the
  // dense 4-tile SessionUsage grid remains omitted from the creator view.
  const hasBuildDetail = Boolean(conversionReportData);
  const debug = config.debugMode === true;

  // Start a fresh page — clears the active session so the entry screen returns
  // (mirrors the TopBar "+" / brand-home affordance).
  function handleNewPage() {
    dispatch({ type: 'setActiveSessionId', sessionId: null });
  }

  return (
    <div className="pf-active-session">
      <ResultCard
        session={s}
        onDeploy={handleDeploy}
        onCancel={handleCancel}
        onRetry={handleRetry}
        onNewPage={handleNewPage}
      />

      {hasBuildDetail && (
        <div className="pf-foot-discs">
          <FootDisclosure title="How we built this">
            <ConversionReport report={conversionReportData!} />
          </FootDisclosure>

          {/* The flywheel on-ramp: what this run added to the design system. Shown
              to everyone (the flywheel is the product story); honestly labels new
              blocks as shipped-today + roadmap candidates. */}
          <FootDisclosure title="What this added to the design system">
            <CatalogCandidates session={s} />
          </FootDisclosure>

          {debug && logLines.length > 0 && (
            <ActivityLog sessionId={sessionId} logLines={logLines} key={sessionId} />
          )}

          {debug && <LocalArtifacts session={s} />}
        </div>
      )}

      {!hasBuildDetail && debug && logLines.length > 0 && (
        <div className="pf-foot-discs">
          <ActivityLog sessionId={sessionId} logLines={logLines} key={sessionId} />
          <LocalArtifacts session={s} />
        </div>
      )}
    </div>
  );
}
