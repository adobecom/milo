// ── ActivityLog — collapsible, append-only activity log panel ─────────────────
// Ported from vanilla page-forge.js renderActivityLog (line 1950) +
// refreshLiveLog (line 1966) + mdLine (line 1931).

import { useRef, useEffect, memo } from 'react';
import { FootDisclosure } from './FootDisclosure';
import './ActivityLog.css';

// ── mdLine — inline markdown → HTML (ported from vanilla line ~1931) ──────────

// Escape ALL HTML-significant characters — including quotes. The quotes matter:
// the linkifier below injects the matched URL into an href="" attribute, and log
// lines carry UNSANITIZED agent stdout (server pushMsg), which echoes externally
// supplied Figma/page text. Without escaping `"`/`'`, a crafted URL such as
// `https://x/"onmouseover="alert(1)` would break out of the attribute and inject an
// event handler that runs in the app origin (attribute-injection XSS). After
// escaping, the URL class can never contain a raw quote, so the href stays inert.
export function mdLine(text: string): string {
  const s = String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
  return s
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(
      /(https?:\/\/[^\s<]+[^\s<.,;:!?)\]])/g,
      '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>',
    );
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface ActivityLogProps {
  sessionId: string;
  logLines: string[];
  defaultExpanded?: boolean;
  // Disclosure heading. Defaults to "Activity log"; the in-generation mount passes
  // "Progress details" (V3) so the raw per-line read log stays SECONDARY, folded away.
  title?: string;
}

// ── Inner list — memoized to avoid re-mounting ─────────────────────────────────

interface LogListProps {
  logLines: string[];
}

const LogList = memo(
  function LogList({ logLines }: LogListProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const pinnedRef = useRef(true);

    // Track scroll position to decide whether to auto-scroll
    function handleScroll() {
      const el = scrollRef.current;
      if (!el) return;
      pinnedRef.current = el.scrollTop >= el.scrollHeight - el.clientHeight - 10;
    }

    // Append-only scroll: only scrolls when pinned
    useEffect(() => {
      const el = scrollRef.current;
      if (!el) return;
      if (pinnedRef.current) {
        el.scrollTop = el.scrollHeight;
      }
    }, [logLines.length]);

    return (
      <div
        ref={scrollRef}
        className="pf-log"
        onScroll={handleScroll}
      >
        {logLines.map((line, i) => (
          // eslint-disable-next-line react/no-danger
          <div
            key={i}
            className="pf-log-line"
            // biome-ignore lint/security/noDangerouslySetInnerHtml: markdown converted by mdLine
            dangerouslySetInnerHTML={{ __html: mdLine(line) }}
          />
        ))}
      </div>
    );
  },
  // Only re-render when line count changes (append-only guard)
  (prev, next) => prev.logLines.length === next.logLines.length,
);

// ── Main component ────────────────────────────────────────────────────────────

export const ActivityLog = memo(function ActivityLog({
  sessionId,
  logLines,
  defaultExpanded = false,
  title = 'Activity log',
}: ActivityLogProps) {
  if (!logLines.length) return null;

  return (
    <div className="pf-log-container" key={sessionId}>
      <FootDisclosure title={`${title} (${logLines.length})`} defaultOpen={defaultExpanded}>
        <LogList logLines={logLines} />
      </FootDisclosure>
    </div>
  );
});
