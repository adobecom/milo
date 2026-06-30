// ── Flywheel — the design-system loop, as a real turning wheel (THROWAWAY) ─────
// Four one-word stations clockwise around a central hub: Build → Ship → Recur →
// Promote, and the hub (the shared library) grows each turn. One word per station
// keeps the chips small. An SVG ring with a clockwise arrow carries the motion.
// First two stations are real today (green check); the last two are the build
// ahead (numbered). Exec audience: few words, no legend clutter.

interface Station {
  label: string;
  real: boolean;
}

// Clockwise from top. One word each.
const STATIONS: Station[] = [
  { label: 'Build', real: true },
  { label: 'Ship', real: true },
  { label: 'Recur', real: false },
  { label: 'Promote', real: false },
];

export function Flywheel() {
  // Lay the 4 stations at top / right / bottom / left of a ring.
  const positions = ['top', 'right', 'bottom', 'left'] as const;

  return (
    <div className="pf-fw3">
      <div className="pf-fw3-wheel">
        {/* The ring + clockwise motion arc, behind the station chips. */}
        <svg className="pf-fw3-ring" viewBox="0 0 100 100" aria-hidden>
          <circle className="pf-fw3-ring-track" cx="50" cy="50" r="38" />
          {/* A clockwise arc sweeping most of the ring, with an arrowhead, to show
              the wheel turns in one direction. */}
          <path
            className="pf-fw3-ring-arc"
            d="M 50 12 A 38 38 0 1 1 14.5 64"
            markerEnd="url(#fw3-arrow)"
          />
          <defs>
            <marker id="fw3-arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
              <path className="pf-fw3-arrowhead" d="M0 0 L6 3 L0 6 z" />
            </marker>
          </defs>
        </svg>

        {/* The hub — what compounds. */}
        <div className="pf-fw3-hub">
          <span className="pf-fw3-hub-label">Forge</span>
        </div>

        {/* The four stations, one word each, positioned around the ring. */}
        {STATIONS.map((s, i) => (
          <div className={`pf-fw3-station pf-fw3-station--${positions[i]}${s.real ? ' pf-fw3-station--real' : ''}`} key={s.label}>
            <span className="pf-fw3-dot">{s.real ? <Check /> : i + 1}</span>
            <span className="pf-fw3-label">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Small check glyph for the "real today" stations.
function Check() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden>
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}
