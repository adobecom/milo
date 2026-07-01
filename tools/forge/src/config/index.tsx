import { createContext, useContext, useState, type ReactNode } from 'react';

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
}

const ConfigContext = createContext<ConfigContextValue | null>(null);

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<ForgeConfig>(loadForgeConfig);
  return (
    <ConfigContext.Provider value={{ config, setConfig }}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig(): ConfigContextValue {
  const ctx = useContext(ConfigContext);
  if (!ctx) throw new Error('useConfig must be used inside <ConfigProvider>');
  return ctx;
}
