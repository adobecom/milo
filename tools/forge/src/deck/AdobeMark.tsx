// ── AdobeMark — the Adobe icon glyph for the deck (THROWAWAY) ─────────────────
// The icon from the supplied SVG: a red rounded-square with the white "A". Just
// the glyph (no wordmark), used both as the top-left slide mark and, washed to a
// faint tint, as the oversized corner watermark. Its fills carry classes so the
// watermark context can recolor it.
// NOTE: the source SVG used an inline <style>.cls-2{} block; inline SVG styles
// leak document-wide, so the red is set as an explicit fill here instead.

// The icon paths.
const SQUARE_D =
  'M38.23,12h-20.46c-3.19,0-5.77,2.58-5.77,5.77v20.46c0,3.19,2.58,5.77,5.77,5.77h20.46c3.19,0,5.77-2.58,5.77-5.77v-20.46c0-3.19-2.58-5.77-5.77-5.77Z';
const A_D =
  'M37.01,36.3h-3.86c-.17,0-.33-.04-.47-.14-.14-.09-.25-.22-.32-.38l-4.2-9.87s-.03-.07-.07-.1c-.03-.02-.07-.04-.11-.04-.04,0-.08.01-.11.04-.03.02-.06.06-.07.09l-2.61,6.27s-.02.07-.02.11c0,.04.02.07.04.1.02.03.05.06.08.07.03.02.07.03.1.03h2.87c.09,0,.17.03.24.07.07.05.13.12.16.2l1.26,2.82c.03.08.05.17.04.25,0,.09-.04.17-.08.24-.05.07-.11.13-.19.17-.08.04-.16.06-.24.06h-10.46c-.08,0-.16-.02-.23-.06-.07-.04-.13-.09-.17-.16-.04-.07-.07-.14-.08-.22,0-.08,0-.16.04-.23l6.66-15.95c.07-.17.19-.31.34-.41.15-.1.33-.15.51-.15h3.84c.18,0,.36.05.51.15.15.1.27.25.34.41l6.7,15.95c.03.07.04.15.04.23,0,.08-.03.15-.08.22-.04.07-.1.12-.17.16-.07.04-.15.06-.22.06Z';

// Icon-only glyph (red square + white A), cropped to its box. Paths carry classes
// so the watermark context can recolor it to a faint tint.
export function AdobeGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="12 12 32 32" role="img" aria-label="Adobe">
      <path className="pf-adobe-sq" fill="#eb1000" d={SQUARE_D} />
      <path className="pf-adobe-a" fill="#fff" d={A_D} />
    </svg>
  );
}
