import type { ExtractUnit } from './planning/scope.ts';

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
