// Jira wiki-markup escaping for text this skill files into Jira (comments only).
// Vendored from Adobe-acom/forgeflex src/utils/jira-markup.js @5479db43 (cap .. wikiLink, unchanged except the
// default cap, which came from forgeflex's constants). Text is posted as the token's owner, so a raw `[~user]`,
// `[label|url]` or `{color}` in it would act as them: always escape through fixCell / wikiLink.
const MAX_FIELD_CHARS = 1000;

export function cap(text, max) {
  const s = String(text ?? '').trim();
  return s.length > max ? `${s.slice(0, max - 1)}…` : s;
}

/**
 * Escape Jira wiki markup's structural tokens in ATTACKER-AUTHORABLE text.
 *
 * Necessary for the same reason `escapeMrkdwn` exists in slack.js: the comment
 * body is written by one reviewer and read by another inside an Adobe-bot-created
 * ticket. Jira renders `{code}`, `{color:red}` and `[text|url]` as markup, so an
 * unescaped body could close the context block this description opens and inject
 * its own formatted content — including a link with attacker-chosen anchor text.
 *
 * `{{...}}` (monospace) is the neutralising wrapper Jira offers for exactly this,
 * but it does not nest, so the tokens are defanged individually instead: a
 * zero-width-free approach that keeps the text readable is to break the opening
 * brace/bracket with a backslash, which Jira renders literally.
 */
export function escapeWiki(text) {
  // forgeflex: W5.6c, a typed backslash first becomes U+FF3C (as handoff-core.mjs escInline does): otherwise `\[` typed
  // by a person reads `\\[` once escaped, Jira's forced line break and then a live `[`. Written as an escape (see ZWSP).
  return String(text ?? '')
    .replace(/\\/g, '\uFF3C')
    .replace(/([{}[\]|])/g, '\\$1');
}

// Written as an escape, never a raw byte: the sanitize gate's control-bytes check reads source files.
export const ZWSP = '\u200B';

/** Break every Jira mention form so a filed ticket pings nobody. Emails are left intact. */
export function neutraliseMentions(text) {
  return String(text ?? '')
    .replace(/\[~/g, `[${ZWSP}~`)
    .replace(/(^|[^A-Za-z0-9._%+-])@(?=[A-Za-z0-9])/g, `$1@${ZWSP}`);
}

/**
 * Jira's INLINE markup, defanged, on top of `escapeWiki`'s structural tokens.
 *
 * ⚠️ THIS IS WHAT BROKE EVERY `aem.page` URL ON THE FIRST REAL TICKET (MWPW-208720, T2-F). `-text-` is
 * STRIKETHROUGH in Jira wiki markup, and a `-` opens one wherever the character before it is not a word
 * character — including another `-`. So `main--da-cc--adobecom` rendered as `main-<del>da-cc</del>-adobecom`
 * (MEASURED on Jira's own renderer, `POST /rest/api/1.0/render`): the visible text read
 * `main-da-cc-adobecom`, and a bare URL in a cell was not even auto-linked any more. `*` `_` `+` `^` `~`
 * `??` open bold / italic / underline / superscript / subscript / citation by the same rule, `!x!` embeds
 * an image, and `(y)`, `(n)`, `:)`, `;P` and friends become emoticons (all measured the same way).
 *
 * A backslash makes each of them literal (measured: `\-` renders `&#45;`, `\(` `&#40;`, `\:` drops the
 * backslash and keeps the colon). The phrase markers are escaped ONLY where they could OPEN — after a
 * non-ASCII-alphanumeric character or at the start — so the ordinary intra-word hyphen in `hero-marquee`,
 * `da-cc` or `Jean-Luc` stays a bare `-` in the stored markup, which the harness planner reads raw; an
 * escaped opener is enough, because a closer with no opener renders as itself (measured: `main-\-da` is
 * `main--da`).
 */
export function escapeInline(text) {
  return escapeWiki(text)
    .replace(/!/g, '\\!')
    .replace(/(?<![A-Za-z0-9])([-*_+^~?])/g, '\\$1')
    .replace(/\((?=(?:[yni/x!+?*-]|on|off|\*[rgby]|flag|flagoff)\))/gi, '\\(')
    .replace(/([:;])(?=[()PDpd])/g, '\\$1');
}

/** A table cell: escaped (structural AND inline markup), mention-neutralised, bounded. */
export function fixCell(value, max = MAX_FIELD_CHARS) {
  return escapeInline(neutraliseMentions(cap(value, max)));
}

/**
 * The link TARGET for `[label|url]`: an http(s) URL, parsed and re-serialised, with every character that
 * could end the link early (`|`, `]`), open markup (`[`, `{`, `}`) or end the harness's own URL scan
 * (`references.js`'s `URL_RE` stops on whitespace, `|`, `]`, `}`, `)`, `>`, quotes and a backtick)
 * percent-encoded — so the URL Jira links and the URL the harness binds are the same bytes. Jira renders a
 * link target verbatim: MEASURED, `[x|https://main--da-cc--adobecom.aem.page/p]` keeps its `href` whole
 * while the same URL bare in a cell does not. `null` for anything that is not an http(s) URL.
 */
export function wikiLinkTarget(url) {
  let u;
  try { u = new URL(String(url ?? '').trim()); } catch { return null; }
  if (u.protocol !== 'https:' && u.protocol !== 'http:') return null;
  return u.href.replace(/[\s|[\]{}()<>"'`]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase().padStart(2, '0')}`);
}

/**
 * A URL as a wiki LINK, labelled so the label renders as itself too: the URL WITHOUT its scheme (the
 * host, path, query and fragment) or the caller's own label, through `fixCell`. ⚠️ THE LABEL NEVER
 * STARTS WITH `http`: the harness scans the RAW markup for `https?://…` and binds the FIRST page-shaped
 * match (`pageUrlFrom`, cohort.mjs), and a label reading `https://main-\-da…` would be matched ahead of
 * the target — with a backslash in its host, which `new URL()` reads as a path separator. A value that is
 * not an http(s) URL is the plain escaped cell it always was.
 */
export function wikiLink(url, label = null) {
  const target = wikiLinkTarget(url);
  if (!target) return fixCell(url);
  const u = new URL(target);
  const text = label ?? `${u.host}${u.pathname === '/' && !u.search && !u.hash ? '' : u.pathname}${u.search}${u.hash}`;
  return `[${fixCell(text)}|${target}]`;
}
