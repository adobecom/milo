// ── ProgressTimeline — persistent full-width step indicator ──────────────────
// Spans the complete user journey: generation → deploy gate → deploy → done.
// Mounted once at the top of ActiveSession so it persists across both the
// generation request and the separate deploy-prototype request.

import React from 'react';
import Clock from '@react-spectrum/s2/icons/Clock';
import Artboard from '@react-spectrum/s2/icons/Artboard';
import Search from '@react-spectrum/s2/icons/Search';
import Code from '@react-spectrum/s2/icons/Code';
import UploadToCloud from '@react-spectrum/s2/icons/UploadToCloud';
import CheckmarkCircle from '@react-spectrum/s2/icons/CheckmarkCircle';
import type { Session } from '../sessions/types';
import { deriveTimeline, STEP_COUNT } from './timeline';

// The phase/status → step+state logic lives in the pure, React-free ./timeline
// module (MWPW-199250) so it can be unit-tested without the S2 icon chain.
// Re-exported here so existing importers keep `import { deriveTimeline } from './ProgressTimeline'`.
export { deriveTimeline };
export type { TimelineState, TimelineInfo } from './timeline';

// ── Step definitions ──────────────────────────────────────────────────────────

export const STEPS = [
  { key: 'queued',  label: 'Queued',          active: 'Getting started',                          Icon: Clock },
  { key: 'read',    label: 'Reading design',   active: 'Reading your design',                      Icon: Artboard },
  { key: 'match',   label: 'Matching blocks',  active: 'Matching your design to building blocks',  Icon: Search },
  { key: 'author',  label: 'Authoring page',   active: 'Authoring your page',                      Icon: Code },
  { key: 'publish', label: 'Sending to Authoring', active: 'Sending your page to DA',               Icon: UploadToCloud },
  { key: 'verify',  label: 'Finishing up',         active: 'Getting your draft ready in DA',        Icon: CheckmarkCircle },
] as const;

// Invariant: the pure timeline logic (timeline.ts) assumes STEPS.length === STEP_COUNT.
// Throw loudly at module load if a step is added/removed without updating STEP_COUNT.
if (STEPS.length !== STEP_COUNT) {
  throw new Error(`ProgressTimeline: STEPS.length (${STEPS.length}) must equal STEP_COUNT (${STEP_COUNT})`);
}

// ── Component ─────────────────────────────────────────────────────────────────

interface ProgressTimelineProps {
  session: Session;
}

export function ProgressTimeline({ session }: ProgressTimelineProps) {
  const { stepIdx, state } = deriveTimeline(session);
  const fill = stepIdx / (STEPS.length - 1);

  return (
    <div
      className="pf-timeline"
      role="progressbar"
      aria-valuenow={stepIdx + 1}
      aria-valuemin={1}
      aria-valuemax={STEPS.length}
      aria-label={`Step ${stepIdx + 1} of ${STEPS.length}: ${STEPS[stepIdx].label}`}
    >
      <div
        className="pf-tl-steps"
        style={{ '--pf-step-fill': `${fill}` } as React.CSSProperties}
      >
        {STEPS.map(({ key, label, Icon }, i) => {
          // Determine the visual state of this step's node
          const isPast =
            state === 'done' ? true :
            state === 'gate' ? i <= stepIdx :
            i < stepIdx; // running / error / cancelled: only prior steps filled

          const isActive   = i === stepIdx && state === 'running';
          const isError    = i === stepIdx && state === 'error';
          const isCancelled = i === stepIdx && state === 'cancelled';

          const nodeClass = [
            'pf-tl-node',
            isPast      ? 'pf-tl-node--past'      : '',
            isActive    ? 'pf-tl-node--active'    : '',
            isError     ? 'pf-tl-node--error'     : '',
            isCancelled ? 'pf-tl-node--cancelled' : '',
          ].filter(Boolean).join(' ');

          const labelClass = [
            'pf-tl-label',
            (isPast || isActive) ? 'pf-tl-label--lit'   : '',
            isError              ? 'pf-tl-label--error' : '',
          ].filter(Boolean).join(' ');

          return (
            <div className="pf-tl-step" key={key}>
              <div className={nodeClass}>
                <Icon UNSAFE_className="pf-tl-icon" aria-hidden />
              </div>
              <div className={labelClass}>{label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
