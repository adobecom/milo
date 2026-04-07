import test from 'node:test';
import assert from 'node:assert/strict';
import { parsePositionalStages, parseStagesOption } from '../lib/stages.ts';
import { handleStageFailures } from '../generate.ts';

test('parsePositionalStages expands transform shortcuts into atomic stages', () => {
  assert.deepEqual(parsePositionalStages('extract'), ['extract']);
  assert.deepEqual(parsePositionalStages('transform', 'data'), ['transform-data']);
  assert.deepEqual(parsePositionalStages('transform', 'da'), ['transform-da']);
  assert.deepEqual(parsePositionalStages('transform'), ['transform-data', 'transform-da']);
});

test('parseStagesOption normalizes, orders, and dedupes stage ids', () => {
  assert.deepEqual(
    parseStagesOption('publish,extract,transform'),
    ['extract', 'transform-data', 'transform-da', 'publish'],
  );
  assert.deepEqual(
    parseStagesOption('transform-da,transform-data,transform-da,preview'),
    ['transform-data', 'transform-da', 'preview'],
  );
});

test('parseStagesOption rejects unknown stages', () => {
  assert.throws(() => parseStagesOption('extract,nope'), /Unknown stage: nope/);
});

test('handleStageFailures is fail-fast only for delivery stages', () => {
  const originalExitCode = process.exitCode;
  process.exitCode = undefined;

  try {
    handleStageFailures('transform-da', true);
    assert.equal(process.exitCode, 1);

    process.exitCode = undefined;
    assert.throws(() => handleStageFailures('push', true), /push failed; stopping pipeline\./);
    assert.equal(process.exitCode, 1);

    process.exitCode = undefined;
    assert.throws(() => handleStageFailures('preview', true), /preview failed; stopping pipeline\./);
    assert.equal(process.exitCode, 1);

    process.exitCode = undefined;
    assert.throws(() => handleStageFailures('publish', true), /publish failed; stopping pipeline\./);
    assert.equal(process.exitCode, 1);
  } finally {
    process.exitCode = originalExitCode;
  }
});
