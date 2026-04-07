import type { ExtractUnit } from '../config/scope.ts';

// --- Stage types and helpers ---

export type UnitStageEntry<TSummary> = {
  ok: boolean;
  unit: ExtractUnit;
  summary?: TSummary;
  error?: unknown;
};

export type UnitStageResult<TSummary> = {
  hadFailures: boolean;
  units: UnitStageEntry<TSummary>[];
};

export function formatStageGeo(geo: string): string {
  return geo || '(default)';
}

export function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

// --- Stage ordering and parsing ---

export const STAGE_ORDER = [
  'clean',
  'extract',
  'transform-data',
  'transform-da',
  'diff',
  'push',
  'preview',
  'publish',
] as const;

export type StageId = (typeof STAGE_ORDER)[number];

const VALID_STAGE_TOKENS = new Set<string>([
  ...STAGE_ORDER,
  'transform',
]);

export function normalizeStageToken(token: string): StageId[] {
  const normalized = token.trim().toLowerCase();
  if (!normalized) return [];
  if (!VALID_STAGE_TOKENS.has(normalized)) {
    throw new Error(`Unknown stage: ${token}`);
  }
  if (normalized === 'transform') {
    return ['transform-data', 'transform-da'];
  }
  return [normalized as StageId];
}

export function normalizeStageList(tokens: string[]): StageId[] {
  const requested = tokens.flatMap((token) => normalizeStageToken(token));
  const requestedSet = new Set(requested);
  return STAGE_ORDER.filter((stage) => requestedSet.has(stage));
}

export function parseStagesOption(value: string): StageId[] {
  return normalizeStageList(value.split(','));
}

export function parsePositionalStages(stage?: string, mode?: string): StageId[] {
  if (!stage) return [];

  if (stage === 'transform') {
    if (!mode) return ['transform-data', 'transform-da'];
    if (mode === 'data') return ['transform-data'];
    if (mode === 'da') return ['transform-da'];
    throw new Error(`Transform mode \`${mode}\` is not implemented yet.`);
  }

  if (mode) {
    throw new Error(`Unexpected positional mode \`${mode}\` for stage \`${stage}\`.`);
  }

  return normalizeStageToken(stage);
}
