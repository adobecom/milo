import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

// ── Storage keys ─────────────────────────────────────────────────────────────

export const STORAGE_KEYS = {
  HISTORY: 'page-forge:history',
  ACTIVE: 'page-forge:activeSession',
  SOURCE: 'page-forge:lastSource',
  SIDEBAR: 'page-forge:sidebarCollapsed',
} as const;

export const FORGE_CONFIG_KEY = 'forge.config';

// Legacy per-field keys we migrate from on first load. Read-only — we
// leave them in place for one release so a stale tab doesn't lose data.
const LEGACY_KEYS: Record<string, string> = {
  serverUrl: 'page-forge:serverUrl',
  repoPath: 'page-forge:repoPath',
  miloPath: 'page-forge:miloPath',
  stardustSkillPath: 'page-forge:stardustSkillPath',
  impeccableSkillPath: 'page-forge:impeccableSkillPath',
  daUsername: 'page-forge:daUsername',
};

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ForgeConfig {
  serverUrl: string;
  repoPath: string;
  consumerPreviewUrl: string;
  miloPath: string;
  daUsername: string;
  stardustSkillPath: string;
  impeccableSkillPath: string;
  // Developer/debug mode. When ON, the result surfaces engineering-only detail
  // (the "For engineering" handoff, the activity log, and local artifacts) that
  // is hidden from designers/PMs by default. Off unless an engineer turns it on.
  debugMode: boolean;
  // UI color scheme preference. 'system' (default) follows the OS via
  // prefers-color-scheme and tracks it live; 'light'/'dark' pin an explicit choice.
  // Resolved to a concrete light|dark by useResolvedColorScheme(), which drives the
  // S2 Provider + the --pf-* token block (forge.css) + <html data-color-scheme>.
  colorScheme: 'system' | 'light' | 'dark';
  export: {
    // 'milo'    — DEFAULT. Develops + ships real forge-<kebab> Milo blocks to the
    //             Milo fork (fullcolorcoder/milo) on a feature branch; preview the
    //             page against those blocks via ?milolibs=<branch>.
    // 'project' — SECONDARY. Ship content to the consumer project only (da-playground);
    //             forge-* blocks stay local and are NOT migrated to the fork.
    // The ship destination (DA vs local files) is resolved automatically at
    // runtime based on whether DA credentials are available.
    mode: 'milo' | 'project';
  };
}

// ── Pre-run validation (MWPW-199254) ──────────────────────────────────────────
// Client-side FORMAT validation only. A browser cannot verify that a path exists
// on disk, that a token is accepted, or that a URL is reachable — those need a
// server round-trip (the page-forge server still does the missing-path check at
// run time). What we CAN do synchronously is catch the malformed input that
// otherwise fails cryptically minutes into a run: empty required fields and
// obviously-wrong shapes. Fields are validated only when present (except the
// always-required serverUrl), so an incomplete-but-valid config never blocks Save.

export type ForgeConfigField =
  | 'serverUrl'
  | 'repoPath'
  | 'consumerPreviewUrl'
  | 'miloPath'
  | 'daUsername';

export type ForgeConfigErrors = Partial<Record<ForgeConfigField, string>>;

function isHttpUrl(v: string): boolean {
  try {
    const u = new URL(v.trim());
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

// Absolute POSIX path (or a ~-relative one). We don't touch the filesystem —
// this only rejects a value that plainly isn't a path (e.g. a bare repo name).
function isAbsolutePath(v: string): boolean {
  const t = v.trim();
  return t.startsWith('/') || t.startsWith('~/');
}

// A bare LDAP: letters/digits/dot/dash/underscore. Rejects spaces, '@' (an email),
// and '/' (a path) — the common mistypes for this field.
function isLdap(v: string): boolean {
  return /^[a-zA-Z0-9._-]+$/.test(v.trim());
}

export function validateForgeConfig(cfg: ForgeConfig): ForgeConfigErrors {
  const errors: ForgeConfigErrors = {};

  if (!cfg.serverUrl?.trim()) {
    errors.serverUrl = 'Server URL is required.';
  } else if (!isHttpUrl(cfg.serverUrl)) {
    errors.serverUrl = 'Enter a full URL, e.g. http://localhost:8080.';
  }

  if (cfg.consumerPreviewUrl?.trim() && !isHttpUrl(cfg.consumerPreviewUrl)) {
    errors.consumerPreviewUrl = 'Enter a full URL, e.g. http://localhost:3000.';
  }

  if (cfg.repoPath?.trim() && !isAbsolutePath(cfg.repoPath)) {
    errors.repoPath = 'Enter an absolute path, e.g. /Users/you/your-consumer-site.';
  }

  if (cfg.miloPath?.trim() && !isAbsolutePath(cfg.miloPath)) {
    errors.miloPath = 'Enter an absolute path, e.g. /Users/you/milo.';
  }

  if (cfg.daUsername?.trim() && !isLdap(cfg.daUsername)) {
    errors.daUsername = 'Use your bare LDAP, e.g. jdoe (no spaces, @ or /).';
  }

  return errors;
}

// True when a validation result has no field errors → safe to commit.
export function isForgeConfigValid(errors: ForgeConfigErrors): boolean {
  return Object.keys(errors).length === 0;
}

// ── Config helpers ────────────────────────────────────────────────────────────

const DEFAULT_SERVER_URL = 'http://localhost:8080';

// Canonical shape of the forge.config blob. Adjustments overlay reads/writes
// the same shape, so a path the user enters in one surface applies to both.
export function emptyForgeConfig(): ForgeConfig {
  return {
    // Forge surfaces
    serverUrl: DEFAULT_SERVER_URL,            // page-forge server
    // Consumer site (any adobecom Milo consumer — da-playground, cc-shared, etc.)
    repoPath: '',                              // local clone path
    consumerPreviewUrl: '',                    // e.g. http://localhost:3000
    // Milo (blocks destination)
    miloPath: '',
    // DA upload — org/site/token come from DA_SDK daContext + git remote; only username is needed
    daUsername: '',
    // Skills
    stardustSkillPath: '', impeccableSkillPath: '',
    // Developer/debug mode — engineering detail hidden from creators by default.
    debugMode: false,
    // UI color scheme — follow the OS by default; the header toggle can pin it.
    colorScheme: 'system',
    // Export defaults — configurable in Settings.
    export: {
      mode: 'milo',   // DEFAULT 'milo' (ships real forge-* blocks to the fork); 'project' is secondary
    },
  };
}

// Load the forge.config blob, falling back to legacy per-field keys on first
// load (one-time migration). Always returns a fully-populated object — any
// missing fields are filled from emptyForgeConfig() so downstream code can
// access state.config.<field> without `?.` everywhere.
export function loadForgeConfig(): ForgeConfig {
  const base = emptyForgeConfig();
  let blob: Record<string, unknown> | null = null;
  try { blob = JSON.parse(localStorage.getItem(FORGE_CONFIG_KEY) || 'null'); } catch { /* corrupt — fall through */ }
  if (blob && typeof blob === 'object') {
    const cfg = {
      ...base,
      ...blob,
      export: { ...base.export, ...((blob.export as object) || {}) },
    } as ForgeConfig & Record<string, unknown>;
    // Strip dead keys that were removed — daOrg/daRepo/daToken were always vestigial (server
    // derives them from daContext + git remote); adjustmentsServerUrl was never rendered.
    const deadKeys = ['daOrg', 'daRepo', 'daToken', 'adjustmentsServerUrl'];
    const hadDead = deadKeys.some((k) => k in blob);
    deadKeys.forEach((k) => delete cfg[k]);

    // Migrate legacy export shape (shipTarget/sendBlocksToMilo/pushMiloBranch/pushConsumerBranch)
    // to the new single `mode` field. Biased to MILO (the develop-+-ship-real-blocks default):
    // key off sendBlocksToMilo (the develop-blocks flag, which gold defaulted TRUE). Land on
    // 'project' ONLY when the user explicitly disabled block development (sendBlocksToMilo === false);
    // everyone else — including those who never touched it — gets 'milo'.
    const le = (blob.export as Record<string, unknown>) || {};
    const hadLegacyExport = !('mode' in le) && (
      'shipTarget' in le || 'sendBlocksToMilo' in le || 'pushMiloBranch' in le || 'pushConsumerBranch' in le
    );
    if (hadLegacyExport) {
      cfg.export = { mode: le.sendBlocksToMilo === false ? 'project' : 'milo' };
    }

    if (hadDead || hadLegacyExport) {
      try { localStorage.setItem(FORGE_CONFIG_KEY, JSON.stringify(cfg)); } catch { /* quota */ }
    }
    return cfg as ForgeConfig;
  }
  // Migration path: pull every legacy key we know about into the new shape.
  const migrated: ForgeConfig = { ...base };
  let foundAny = false;
  for (const [field, legacyKey] of Object.entries(LEGACY_KEYS)) {
    const v = localStorage.getItem(legacyKey);
    if (v != null && v !== '') {
      (migrated as unknown as Record<string, unknown>)[field] = v;
      foundAny = true;
    }
  }
  if (foundAny) {
    try { localStorage.setItem(FORGE_CONFIG_KEY, JSON.stringify(migrated)); } catch { /* quota */ }
  }
  return migrated;
}

export function saveForgeConfig(cfg: ForgeConfig): void {
  try { localStorage.setItem(FORGE_CONFIG_KEY, JSON.stringify(cfg)); } catch { /* quota / blocked */ }
}

// ── React context ─────────────────────────────────────────────────────────────

interface ConfigContextValue {
  config: ForgeConfig;
  setConfig: (c: ForgeConfig) => void;
  // The colorScheme preference resolved to a concrete 'light' | 'dark' (i.e.
  // 'system' mapped to the live OS scheme). Consumers that need the effective
  // theme (the S2 Provider) read this rather than re-resolving.
  resolvedColorScheme: 'light' | 'dark';
}

const ConfigContext = createContext<ConfigContextValue | null>(null);

// Track the OS prefers-color-scheme, live (updates if the user flips their OS
// theme while Forge is open).
function useSystemColorScheme(): 'light' | 'dark' {
  const getSystem = (): 'light' | 'dark' =>
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  const [systemScheme, setSystemScheme] = useState<'light' | 'dark'>(getSystem);
  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-color-scheme: dark)');
    if (!mq) return;
    const onChange = () => setSystemScheme(mq.matches ? 'dark' : 'light');
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return systemScheme;
}

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<ForgeConfig>(loadForgeConfig);
  const systemScheme = useSystemColorScheme();
  // 'system' follows the OS; an explicit 'light'/'dark' pins the choice.
  const resolvedColorScheme =
    config.colorScheme === 'system' ? systemScheme : config.colorScheme;
  // Reflect the RESOLVED scheme onto <html> so the --pf-* dark override in forge.css
  // (keyed off [data-color-scheme="dark"]) applies globally, above the React root.
  // Also set the CSS `color-scheme` property so S2's page.css light-dark() rules
  // (which own the html/body background) flip, plus native form controls/scrollbars.
  useEffect(() => {
    document.documentElement.setAttribute('data-color-scheme', resolvedColorScheme);
    document.documentElement.style.colorScheme = resolvedColorScheme;
  }, [resolvedColorScheme]);
  return (
    <ConfigContext.Provider value={{ config, setConfig, resolvedColorScheme }}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig(): ConfigContextValue {
  const ctx = useContext(ConfigContext);
  if (!ctx) throw new Error('useConfig must be used inside <ConfigProvider>');
  return ctx;
}
