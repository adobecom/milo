// ── SessionHeader — session source + intent header ────────────────────────────
// Port of renderSessionHeader (vanilla page-forge.js line 1547).

import type { Session } from '../sessions/types';

// ── Helpers ───────────────────────────────────────────────────────────────────

function sourceLabel(source: string): string {
  if (source === 'figma') return 'Figma';
  if (source === 'url' || source === 'eds-url') return 'URL';
  if (source === 'html') return 'HTML';
  return source;
}

function cleanVariantIntent(intent: string | null | undefined): string {
  let s = (intent || '').replace(/\s*·\s*Variant\s+[ABC](?:\s*—\s*cinematic)?$/i, '').trim();
  if (/^Variant\s+[ABC](?:\s*—\s*cinematic)?$/i.test(s) || /^Redesign$/i.test(s)) s = '';
  return s;
}

// ── Component ─────────────────────────────────────────────────────────────────

interface SessionHeaderProps {
  session: Session;
}

export function SessionHeader({ session }: SessionHeaderProps) {
  const intent =
    cleanVariantIntent(session.versions?.[0]?.intent) ||
    (session.sourceInput as Record<string, unknown> | undefined)?.intent as string | undefined;

  const src = session.sourceInput as Record<string, string> | undefined;
  const sourceVal =
    src?.url ||
    src?.figmaUrl ||
    (src?.html ? `(${src.html.length} bytes of HTML)` : '(no source)');

  return (
    <div className="pf-session-head">
      <div className="pf-session-head-row">
        <span className={`pf-side-chip pf-side-chip--${session.source}`}>
          {sourceLabel(session.source)}
        </span>
        <span className="pf-session-source">{sourceVal}</span>
      </div>
      {intent && (
        <div className="pf-session-intent">
          <span className="pf-session-intent-label">Intent</span>
          <span className="pf-session-intent-text">&quot;{intent}&quot;</span>
        </div>
      )}
    </div>
  );
}
