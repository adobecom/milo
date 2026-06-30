// ── SectionTable — Milo blocks match table ────────────────────────────────────
// Port of renderSectionTable (vanilla page-forge.js lines 466–531).

import type { ReactNode } from 'react';
import { Badge, TableView, TableHeader, Column, TableBody, Row, Cell } from '@react-spectrum/s2';
import type { RenderFidelity } from '../sessions/types';
import { FidelityMeter } from './FidelityMeter';

// ── Types ─────────────────────────────────────────────────────────────────────

interface SectionRow {
  index?: number | null;
  score?: number | null;
  block?: string | null;
  variantClasses?: string[];
  decision?: string | null;
  action?: string | null;
  error?: string | null;
  issues?: string | string[] | null;
  // Per-section render-diff fidelity — optional; absent until the server wires
  // per-section convergence scores through (currently they live in summary.json).
  fidelity?: RenderFidelity | null;
}

interface NewBlockTask {
  index?: number | null;
  blockName?: string | null;
}

interface JudgeVerdict {
  index?: number | null;
  error?: string | null;
  verdict?: string | null;
}

export interface SectionTableResult {
  sections?: SectionRow[] | null;
  newBlockTasks?: NewBlockTask[] | null;
  judgeVerdicts?: JudgeVerdict[] | null;
}

// ── Score level ───────────────────────────────────────────────────────────────
// 0–49 = low, 50–74 = mid, 75–100 = high

function scoreLevel(pct: number): 'high' | 'mid' | 'low' {
  if (pct >= 75) return 'high';
  if (pct >= 50) return 'mid';
  return 'low';
}

interface ActionInfo {
  label: string;
  tip?: string;
}

function deriveAction(section: SectionRow, generatedBlockNames: Record<number, string>): ActionInfo {
  const d = section.decision;
  const block = section.block || 'an existing block';
  if (d === 'tight-variant' || d === 'tight') {
    return {
      label: 'Reused an existing block',
      tip: `We matched this part to the "${block}" block and used it as-is.`,
    };
  }
  if (d === 'loose-variant' || d === 'loose') {
    return {
      label: 'Reused with small style tweaks',
      tip: `We used the "${block}" block and added small styling changes to fit your design.`,
    };
  }
  if (section.index != null && generatedBlockNames[section.index]) {
    return {
      label: 'Built a new block',
      tip: 'Nothing in the library fit, so we built a new block for this part.',
    };
  }
  if (d === 'below-threshold' || d === 'ambiguous' || d === 'new-block') {
    return {
      label: 'Kept your original design',
      tip: "We couldn't match this to a standard block, so we kept your original content for review.",
    };
  }
  return { label: '—' };
}

// ── Component ─────────────────────────────────────────────────────────────────

interface SectionTableProps {
  result: SectionTableResult;
}

export function SectionTable({ result }: SectionTableProps) {
  const sections = Array.isArray(result.sections) ? result.sections : [];

  if (!sections.length) {
    return (
      <p className="pf-section-empty">
        Block breakdown appears here after the page is processed.
      </p>
    );
  }

  // Map index → generated block name
  const generatedBlockNames: Record<number, string> = {};
  if (Array.isArray(result.newBlockTasks)) {
    for (const t of result.newBlockTasks) {
      if (t && t.index != null && t.blockName) {
        generatedBlockNames[t.index] = t.blockName;
      }
    }
  }

  // Map index → judge note
  const judgeNotes: Record<number, string> = {};
  if (Array.isArray(result.judgeVerdicts)) {
    for (const v of result.judgeVerdicts) {
      if (!v || v.index == null) continue;
      judgeNotes[v.index] = v.error
        ? `checker: ${v.error.slice(0, 60)}`
        : `checker: ${v.verdict}`;
    }
  }

  const columns = [
    { id: 'section', name: 'Section', width: 60 },
    { id: 'score', name: 'Match', width: 110 },
    { id: 'fidelity', name: 'Fidelity', width: 150 },
    { id: 'block', name: 'Design block', width: 150 },
    { id: 'action', name: 'What we did', width: 190 },
  ];

  type TableRow = {
    id: string;
    section: string;
    score: ReactNode;
    fidelity: ReactNode;
    block: string;
    action: ReactNode;
  };

  const rows: TableRow[] = sections.map((sec) => {
    // Score cell
    let scoreBadge: ReactNode;
    if (typeof sec.score === 'number') {
      const pct = Math.round(sec.score * 100);
      const hasJudge = sec.index != null && judgeNotes[sec.index];
      const tooltip = hasJudge
        ? 'Reviewed and approved by our checker'
        : 'How closely this part matched an existing block';
      scoreBadge = (
        <span
          className={`pf-match-meter pf-match-meter--${scoreLevel(pct)}`}
          role="meter"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${pct}% match — ${tooltip}`}
          title={tooltip}
        >
          <span className="pf-match-meter-track">
            <span className="pf-match-meter-fill" style={{ width: `${pct}%` }} />
          </span>
          <span className="pf-match-meter-pct" aria-hidden="true">{pct}%</span>
        </span>
      );
    } else {
      const d = sec.decision || '';
      const isNoMatch = ['below-threshold', 'ambiguous', 'new-block'].includes(d);
      scoreBadge = (
        <Badge variant="negative">{isNoMatch ? 'Custom' : '—'}</Badge>
      );
    }

    const variants =
      Array.isArray(sec.variantClasses) && sec.variantClasses.length
        ? ` (${sec.variantClasses.join(',')})`
        : '';
    const blockText = sec.block ? `${sec.block}${variants}` : '—';

    return {
      id: String(sec.index ?? Math.random()),
      section: String(sec.index ?? '—'),
      score: scoreBadge,
      fidelity: <FidelityMeter fidelity={sec.fidelity ?? null} compact />,
      block: blockText,
      action: (() => {
        const act = deriveAction(sec, generatedBlockNames);
        return act.tip ? <span title={act.tip}>{act.label}</span> : act.label;
      })(),
    };
  });

  return (
    <div className="pf-section-table-wrap">
      <TableView
        aria-label="Section match table"
        selectionMode="none"
        density="compact"
      >
        <TableHeader columns={columns}>
          {(col) => <Column isRowHeader={col.id === 'section'}>{col.name}</Column>}
        </TableHeader>
        <TableBody items={rows}>
          {(row) => (
            <Row>
              <Cell>{row.section}</Cell>
              <Cell>{row.score}</Cell>
              <Cell>{row.fidelity}</Cell>
              <Cell>{row.block}</Cell>
              <Cell>{row.action}</Cell>
            </Row>
          )}
        </TableBody>
      </TableView>
    </div>
  );
}
