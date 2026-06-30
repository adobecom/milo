// ── activityText — filter raw agent log lines for non-technical display ───────
// The server pushes every agent log line into session.messages: tool-use
// traces ("→ Bash: git -C /tmp/…"), JSON blobs, stderr, and model prose.
// We walk newest→oldest and return the first line that looks like a
// human-readable status string, or null if everything is noise.
//
// Conservative policy: when in doubt, DROP the line. The caller always has a
// phase-derived headline to fall back on.

interface RawMessage {
  text?: string;
}

// ── Noise detection ───────────────────────────────────────────────────────────

/** Patterns that mark a line as agent-internal noise. */
const NOISE_PREFIXES = [
  '→ ',            // tool-use trace (agent.js: "→ Bash: …", "→ Read: …")
  '[agent stderr]',
  'agent init',
  'agent error',
  'agent cancelled',
  'agent exit',
];

/** Patterns that appear inside noisy lines even without a recognisable prefix. */
const NOISE_PATTERNS: RegExp[] = [
  /^[{[]/,                          // JSON / array literal
  /\/tmp\//,                        // filesystem path — /tmp/…
  / -C /,                           // git -C flag
  /\b(?:git|npm|cd|node|bash|zsh|sh|python)\s/,  // shell invocations
  /[/\\][a-zA-Z0-9_\-./]{30,}/,    // long filesystem path token
];

/** A run of non-whitespace ≥ 40 chars is usually a hash, path, or command arg. */
const LONG_TOKEN_RE = /\S{40,}/;

export function isFriendly(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return false;

  for (const prefix of NOISE_PREFIXES) {
    if (trimmed.startsWith(prefix)) return false;
  }
  for (const re of NOISE_PATTERNS) {
    if (re.test(trimmed)) return false;
  }
  if (LONG_TOKEN_RE.test(trimmed)) return false;

  return true;
}

// ── Text cleaning ─────────────────────────────────────────────────────────────

/** Strip leading severity markers and normalise whitespace. */
export function cleanDetail(text: string): string {
  return text
    .trim()
    .replace(/^(?:warn|warning|error|info|debug)\s*:\s*/i, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Pick the most recent friendly message from a session's messages array.
 * Returns the cleaned text, or null when every recent line is noise.
 */
export function pickActivityDetail(
  messages: RawMessage[] | undefined | null,
): string | null {
  if (!messages || messages.length === 0) return null;

  // Walk newest → oldest; only scan the last 20 to keep it snappy
  const tail = messages.slice(-20);
  for (let i = tail.length - 1; i >= 0; i--) {
    const text = tail[i]?.text ?? '';
    if (isFriendly(text)) {
      return cleanDetail(text);
    }
  }
  return null;
}
