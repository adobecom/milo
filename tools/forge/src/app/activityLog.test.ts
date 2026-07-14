// Security regression test for mdLine (PR #6284 review finding): log lines carry
// UNSANITIZED agent stdout, so mdLine's escaping is the only thing between an
// attacker-influenced Figma/page string and dangerouslySetInnerHTML in the app
// origin. These lock the attribute-injection fix (quotes escaped) + the tag escape.
import { describe, it, expect } from 'vitest';
import { mdLine } from './ActivityLog';

describe('mdLine — HTML escaping (XSS defense)', () => {
  it('escapes angle brackets so raw tags cannot be injected', () => {
    const out = mdLine('<img src=x onerror=alert(1)>');
    expect(out).not.toContain('<img');
    expect(out).toContain('&lt;img');
  });

  it('escapes double quotes so a URL cannot break out of the href attribute', () => {
    // The reported vector: a quote mid-URL would otherwise close href="" and start
    // an onmouseover handler. After escaping there is no raw quote to break out with.
    const out = mdLine('see https://x.com/a"onmouseover="alert(document.domain) end');
    // The raw-quote breakout sequence must be gone: the quote is now &quot;, so the
    // browser reads one quoted href value, never a separate onmouseover attribute.
    expect(out).not.toContain('a"onmouseover'); // no raw-quote attribute breakout
    expect(out).toContain('&quot;onmouseover'); // the injected quote was neutralized
    // Sanity: the only raw double-quotes are the attribute delimiters mdLine itself
    // emits (href="…", target="…", rel="…") — none from the input URL.
    expect(out).not.toMatch(/href="[^"]*"[^ ]/); // href value closes cleanly, no trailing junk
  });

  it('escapes single quotes too', () => {
    expect(mdLine("it's a 'test'")).not.toContain("'");
    expect(mdLine("it's")).toContain('&#39;');
  });

  it('the & escape runs first so it does not double-escape entities', () => {
    // A raw & becomes &amp; exactly once (not &amp;amp;).
    expect(mdLine('a & b')).toContain('a &amp; b');
    expect(mdLine('a & b')).not.toContain('&amp;amp;');
  });

  it('still linkifies a clean URL (functionality preserved)', () => {
    const out = mdLine('open https://example.com/page now');
    expect(out).toContain('<a href="https://example.com/page"');
    expect(out).toContain('rel="noopener noreferrer"');
  });

  it('still renders inline markdown (bold/em/code) on escaped text', () => {
    expect(mdLine('**bold**')).toContain('<strong>bold</strong>');
    expect(mdLine('*em*')).toContain('<em>em</em>');
    expect(mdLine('`code`')).toContain('<code>code</code>');
  });
});
