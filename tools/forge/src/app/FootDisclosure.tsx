// ── FootDisclosure — a quiet, borderless disclosure for the result footer ─────
// The result page's footer sections (How we built this / Activity log / Local
// artifacts) were S2 Disclosures, each drawing its OWN top + bottom rule — three
// stacked accordions read as heavy chrome under a finished page. This is the same
// quiet text toggle we use for the entry "Advanced": a rotating caret + label,
// no borders. Native <details> so it needs no JS.

import type { ReactNode } from 'react';

interface FootDisclosureProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export function FootDisclosure({ title, children, defaultOpen = false }: FootDisclosureProps) {
  return (
    <details className="pf-foot-disc" open={defaultOpen}>
      <summary className="pf-foot-disc-summary">
        <span className="pf-foot-disc-caret">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
            <path d="M9 6l6 6-6 6" />
          </svg>
        </span>
        {title}
      </summary>
      <div className="pf-foot-disc-body">{children}</div>
    </details>
  );
}
