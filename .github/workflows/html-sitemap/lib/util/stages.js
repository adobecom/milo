/**
 * @typedef {import('../config/scope.js').ExtractUnit} ExtractUnit
 */

// --- Stage types and helpers ---

/**
 * @typedef {Object} UnitStageEntry
 * @property {boolean} ok
 * @property {ExtractUnit} unit
 * @property {*} [summary]
 * @property {unknown} [error]
 */

/**
 * @typedef {Object} UnitStageResult
 * @property {boolean} hadFailures
 * @property {UnitStageEntry[]} units
 */

/**
 * @param {string} geo
 * @returns {string}
 */
export function formatStageGeo(geo) {
  return geo || '(default)';
}

/**
 * @param {unknown} error
 * @returns {string}
 */
export function getErrorMessage(error) {
  return error instanceof Error ? error.message : String(error);
}

// --- Stage ordering and parsing ---

export const STAGE_ORDER = /** @type {const} */ ([
  'clean',
  'extract',
  'transform-data',
  'transform-da',
  'diff',
  'push',
  'preview',
  'publish',
]);

/**
 * @typedef {typeof STAGE_ORDER[number]} StageId
 */

/** @type {Set<string>} */
const VALID_STAGE_TOKENS = new Set([
  ...STAGE_ORDER,
  'transform',
]);

/**
 * @param {string} token
 * @returns {StageId[]}
 */
export function normalizeStageToken(token) {
  const normalized = token.trim().toLowerCase();
  if (!normalized) return [];
  if (!VALID_STAGE_TOKENS.has(normalized)) {
    throw new Error(`Unknown stage: ${token}`);
  }
  if (normalized === 'transform') {
    return ['transform-data', 'transform-da'];
  }
  return [/** @type {StageId} */ (normalized)];
}

/**
 * @param {string[]} tokens
 * @returns {StageId[]}
 */
export function normalizeStageList(tokens) {
  const requested = tokens.flatMap((token) => normalizeStageToken(token));
  const requestedSet = new Set(requested);
  return STAGE_ORDER.filter((stage) => requestedSet.has(stage));
}

/**
 * @param {string} value
 * @returns {StageId[]}
 */
export function parseStagesOption(value) {
  return normalizeStageList(value.split(','));
}

/**
 * @param {string} [stage]
 * @param {string} [mode]
 * @returns {StageId[]}
 */
export function parsePositionalStages(stage, mode) {
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
