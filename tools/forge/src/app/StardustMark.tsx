// ── StardustMark — the identity glyph for the Reimagine engine ────────────────
// A "forge-spark": one dominant concave four-point star + two satellite sparks.
// Ties to the Forge name, dodges the rounded "AI twinkle" cliché, reads at 16px.
// Single-color via currentColor so callers tint it with --pf-stardust. Its own
// module (not buried in InputPanel) so every surface that attributes Stardust —
// entry lane, generating eyebrow, result chip, build report, design-system view —
// imports the one source of truth without pulling in a heavy component.

export function StardustMark() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      {/* Dominant four-point star: concave diamond, points to the cardinal edges. */}
      <path d="M13 2c.4 3.1 1.4 5.4 3 7 1.6 1.6 3.9 2.6 7 3-3.1.4-5.4 1.4-7 3-1.6 1.6-2.6 3.9-3 7-.4-3.1-1.4-5.4-3-7-1.6-1.6-3.9-2.6-7-3 3.1-.4 5.4-1.4 7-3 1.6-1.6 2.6-3.9 3-7z" />
      {/* Two satellite sparks. */}
      <circle cx="5.5" cy="5.5" r="1.4" />
      <circle cx="19" cy="18.5" r="1" />
    </svg>
  );
}
