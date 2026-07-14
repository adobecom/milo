// MWPW-200668 — the entry-side, door-fixed intent contract that replaced the
// retired IntentDial. Pure logic (no React / no @react-spectrum/s2), so it locks
// down what InputPanel submits per door without rendering the S2 form.
import { describe, it, expect } from 'vitest';
import { doorIntentPolicy, buildEntryIntent } from './intent';

describe('doorIntentPolicy — the door fixes the policy', () => {
  it('Figma door → conformance', () => {
    expect(doorIntentPolicy('figma')).toBe('conformance');
  });
  it('URL door → reimagine', () => {
    expect(doorIntentPolicy('url')).toBe('reimagine');
  });
});

describe('buildEntryIntent — the fields InputPanel submits per door', () => {
  it('Figma door forwards conformance + effort, and NO reimagine mode', () => {
    expect(buildEntryIntent('figma', 'balanced')).toEqual({
      intentPolicy: 'conformance',
      effort: 'balanced',
    });
  });

  it('Figma door with the default effort still forwards it', () => {
    expect(buildEntryIntent('figma', 'quick')).toEqual({
      intentPolicy: 'conformance',
      effort: 'quick',
    });
  });

  it('Figma door with no effort omits the field (no empty budget)', () => {
    expect(buildEntryIntent('figma')).toEqual({ intentPolicy: 'conformance' });
    expect(buildEntryIntent('figma', '')).toEqual({ intentPolicy: 'conformance' });
  });

  it('URL door forwards reimagine + mode, and NEVER an effort budget (Stardust has none)', () => {
    // Even if an effort value is passed through, the URL door must not forward it.
    expect(buildEntryIntent('url', 'thorough')).toEqual({
      intentPolicy: 'reimagine',
      mode: 'reimagine',
    });
  });

  it('conformance never carries a mode (only reimagine routes to a different engine)', () => {
    expect(buildEntryIntent('figma', 'quick')).not.toHaveProperty('mode');
  });
});
