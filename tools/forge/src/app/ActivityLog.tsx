// ── ActivityLog — collapsible, append-only activity log panel ─────────────────
// Ported from vanilla page-forge.js renderActivityLog (line 1950) +
// refreshLiveLog (line 1966) + mdLine (line 1931).

import { useRef, useEffect, memo } from 'react';
import { FootDisclosure } from './FootDisclosure';
import './ActivityLog.css';

// ── mdLine — inline markdown → HTML (ported from vanilla line ~1931) ──────────

function mdLine(text: string): string {
  const s = String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
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
}: ActivityLogProps) {
  if (!logLines.length) return null;

  return (
    <div className="pf-log-container" key={sessionId}>
      <FootDisclosure title={`Activity log (${logLines.length})`} defaultOpen={defaultExpanded}>
        <LogList logLines={logLines} />
      </FootDisclosure>
    </div>
  );
});
