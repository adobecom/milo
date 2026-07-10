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

// ── Step definitions ──────────────────────────────────────────────────────────

export const STEPS = [
  { key: 'queued',  label: 'Queued',          active: 'Getting started',                          Icon: Clock },
  { key: 'read',    label: 'Reading design',   active: 'Reading your design',                      Icon: Artboard },
  { key: 'match',   label: 'Matching blocks',  active: 'Matching your design to building blocks',  Icon: Search },
  { key: 'author',  label: 'Authoring page',   active: 'Authoring your page',                      Icon: Code },
  { key: 'publish', label: 'Sending to Authoring', active: 'Sending your page to DA',               Icon: UploadToCloud },
  { key: 'verify',  label: 'Finishing up',         active: 'Getting your draft ready in DA',        Icon: CheckmarkCircle },
] as const;

// ── Phase → step index ────────────────────────────────────────────────────────
// Every phase the server can emit is mapped to one of the 6 steps above.
// When a phase is unrecognised, deriveTimeline falls back to the status-minimum.

const PHASE_TO_STEP: Record<string, number> = {
  // step 0 — queued
  queued: 0,
  // step 1 — reading design
  fetch: 1, forge: 1, extracting: 1, redesign: 1, tweak: 1,
  // step 2 — matching blocks
  converge: 2, converging: 2, negotiate: 2, convert: 2, matching: 2,
  // step 3 — authoring page
  worktree: 3, 'local-write': 3,
  composing: 3, 'generating-blocks': 3, linting: 3,
  // step 4 — publishing to DA
  push: 4, 'da-push': 4, shipping: 4,
  // step 5 — going live (verify during deploy, or just done)
  verify: 5,
};

// Minimum step implied by session.status when the phase is unrecognised
const STATUS_MIN_STEP: Record<string, number> = {
  queued: 0, generating: 1, refining: 1, running: 1,
  // 'waiting' (MWPW-199520) is a rate-limit pause — its phase is usually a
  // recognised one (converge → 2) that wins, but the extract-phase wait has no
  // PHASE_TO_STEP entry, so anchor its minimum at 'reading' rather than regressing
  // the timeline to Queued mid-run.
  waiting: 1,
  shipping: 4, deploying: 3,
};

// ── Timeline derivation ───────────────────────────────────────────────────────

export type TimelineState = 'running' | 'gate' | 'done' | 'error' | 'cancelled';

export interface TimelineInfo {
  stepIdx: number;   // 0–(STEPS.length-1), never -1
  state: TimelineState;
}

export function deriveTimeline(session: Session): TimelineInfo {
  const phase = session.phase || '';
  const status = session.status;

  // ── Terminal: error / cancelled ───────────────────────────────────────────
  if (status === 'error') {
    const isCancelled = phase === 'cancelled' || /cancelled/i.test(session.error || '');
    const phaseStep = PHASE_TO_STEP[phase] ?? -1;
    // Best-effort last step: phase map first, then infer from source
    const stepIdx = phaseStep >= 0 ? phaseStep : (session.source === 'figma' ? 2 : 1);
    return { stepIdx, state: isCancelled ? 'cancelled' : 'error' };
  }

  // ── Terminal: done ────────────────────────────────────────────────────────
  if (status === 'done') {
    const shipped = session.shipped as Record<string, unknown> | undefined;
    if (shipped?.prototypeUrl) {
      // Fully deployed — all steps complete
      return { stepIdx: STEPS.length - 1, state: 'done' };
    }
    // Generation done, waiting for user to click Deploy (deploy gate)
    // Infer last completed step from source type
    const gateStep = session.source === 'figma' ? 2 : 1;
    return { stepIdx: gateStep, state: 'gate' };
  }

  // ── Paused (waiting for user action) ─────────────────────────────────────
  if (status === 'paused') {
    const gateStep = session.source === 'figma' ? 2 : 1;
    return { stepIdx: gateStep, state: 'gate' };
  }

  // ── Active (busy) ─────────────────────────────────────────────────────────
  const phaseStep = PHASE_TO_STEP[phase] ?? -1;
  const statusMin = STATUS_MIN_STEP[status] ?? 0;
  // Hold the last known step instead of dropping to -1 when phase is unrecognised
  const stepIdx = phaseStep >= 0 ? phaseStep : statusMin;
  return { stepIdx, state: 'running' };
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
