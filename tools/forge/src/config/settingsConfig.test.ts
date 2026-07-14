// MWPW-199254 — unit tests for the Settings config layer: the new pre-run format
// validation, and the load/save round-trip + legacy migration that back the
// draft/commit/re-sync behavior of SettingsSlideover. Pure logic + localStorage
// (jsdom), no React / no @react-spectrum/s2.
import { describe, it, expect, beforeEach } from 'vitest';
import {
  validateForgeConfig,
  isForgeConfigValid,
  emptyForgeConfig,
  loadForgeConfig,
  saveForgeConfig,
  FORGE_CONFIG_KEY,
  type ForgeConfig,
} from './index';

// A config that passes validation: default server URL, everything else blank.
function validCfg(overrides: Partial<ForgeConfig> = {}): ForgeConfig {
  return { ...emptyForgeConfig(), ...overrides };
}

describe('validateForgeConfig — serverUrl (always required)', () => {
  it('accepts the default localhost URL', () => {
    expect(validateForgeConfig(validCfg())).toEqual({});
  });
  it('rejects an empty server URL', () => {
    expect(validateForgeConfig(validCfg({ serverUrl: '' })).serverUrl).toMatch(/required/i);
  });
  it('rejects a whitespace-only server URL', () => {
    expect(validateForgeConfig(validCfg({ serverUrl: '   ' })).serverUrl).toMatch(/required/i);
  });
  it('rejects a malformed server URL', () => {
    expect(validateForgeConfig(validCfg({ serverUrl: 'localhost:8080' })).serverUrl).toMatch(/full URL/i);
  });
  it('rejects a non-http(s) scheme', () => {
    expect(validateForgeConfig(validCfg({ serverUrl: 'ftp://x' })).serverUrl).toBeTruthy();
  });
  it('accepts https', () => {
    expect(validateForgeConfig(validCfg({ serverUrl: 'https://forge.example.com' })).serverUrl).toBeUndefined();
  });
});

describe('validateForgeConfig — optional fields validated only when present', () => {
  it('blank optional fields are all valid', () => {
    expect(isForgeConfigValid(validateForgeConfig(validCfg()))).toBe(true);
  });

  it('consumerPreviewUrl must be a URL when set', () => {
    expect(validateForgeConfig(validCfg({ consumerPreviewUrl: 'not a url' })).consumerPreviewUrl).toBeTruthy();
    expect(validateForgeConfig(validCfg({ consumerPreviewUrl: 'http://localhost:3000' })).consumerPreviewUrl).toBeUndefined();
  });

  it('repoPath must be absolute when set', () => {
    expect(validateForgeConfig(validCfg({ repoPath: 'da-playground' })).repoPath).toBeTruthy();
    expect(validateForgeConfig(validCfg({ repoPath: '/Users/me/da-playground' })).repoPath).toBeUndefined();
    expect(validateForgeConfig(validCfg({ repoPath: '~/da-playground' })).repoPath).toBeUndefined();
  });

  it('miloPath must be absolute when set', () => {
    expect(validateForgeConfig(validCfg({ miloPath: 'milo' })).miloPath).toBeTruthy();
    expect(validateForgeConfig(validCfg({ miloPath: '/Users/me/milo' })).miloPath).toBeUndefined();
  });

  it('daUsername must be a bare LDAP when set', () => {
    expect(validateForgeConfig(validCfg({ daUsername: 'jane@adobe.com' })).daUsername).toBeTruthy();
    expect(validateForgeConfig(validCfg({ daUsername: 'has space' })).daUsername).toBeTruthy();
    expect(validateForgeConfig(validCfg({ daUsername: 'a/b' })).daUsername).toBeTruthy();
    expect(validateForgeConfig(validCfg({ daUsername: 'jdoe' })).daUsername).toBeUndefined();
  });

  it('accumulates multiple field errors in one pass', () => {
    const errs = validateForgeConfig(validCfg({ serverUrl: '', repoPath: 'x', daUsername: 'a b' }));
    expect(Object.keys(errs).sort()).toEqual(['daUsername', 'repoPath', 'serverUrl']);
    expect(isForgeConfigValid(errs)).toBe(false);
  });
});

describe('isForgeConfigValid', () => {
  it('true for an empty error object', () => {
    expect(isForgeConfigValid({})).toBe(true);
  });
  it('false when any field error is present', () => {
    expect(isForgeConfigValid({ serverUrl: 'bad' })).toBe(false);
  });
});

describe('load/save round-trip (backs draft commit + re-sync)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('save then load returns the committed config', () => {
    const cfg = validCfg({ repoPath: '/Users/me/site', daUsername: 'jdoe', debugMode: true });
    saveForgeConfig(cfg);
    const loaded = loadForgeConfig();
    expect(loaded.repoPath).toBe('/Users/me/site');
    expect(loaded.daUsername).toBe('jdoe');
    expect(loaded.debugMode).toBe(true);
  });

  it('missing fields are backfilled from defaults (no undefined access downstream)', () => {
    localStorage.setItem(FORGE_CONFIG_KEY, JSON.stringify({ repoPath: '/Users/me/site' }));
    const loaded = loadForgeConfig();
    expect(loaded.serverUrl).toBe('http://localhost:8080'); // default
    expect(loaded.export.mode).toBe('milo'); // default nested
    expect(loaded.miloPath).toBe(''); // default blank
  });

  it('corrupt JSON falls back to defaults instead of throwing', () => {
    localStorage.setItem(FORGE_CONFIG_KEY, '{not json');
    expect(() => loadForgeConfig()).not.toThrow();
    expect(loadForgeConfig().serverUrl).toBe('http://localhost:8080');
  });

  it('migrates a legacy export shape (sendBlocksToMilo:false → project)', () => {
    localStorage.setItem(
      FORGE_CONFIG_KEY,
      JSON.stringify({ serverUrl: 'http://x:8080', export: { sendBlocksToMilo: false } }),
    );
    expect(loadForgeConfig().export.mode).toBe('project');
  });

  it('migrates a legacy export shape (block dev left on → milo)', () => {
    localStorage.setItem(
      FORGE_CONFIG_KEY,
      JSON.stringify({ serverUrl: 'http://x:8080', export: { sendBlocksToMilo: true } }),
    );
    expect(loadForgeConfig().export.mode).toBe('milo');
  });
});
