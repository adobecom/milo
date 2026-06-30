import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import type { DaState } from '../sessions/types';
import { useConfig } from '../config';
import { setForgeAuthToken } from '../sessions/api';

// The import always uses the https:// URL; in dev mode Vite's alias in
// vite.config.ts redirects it to ./dev-stub.ts.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore — external URL import; types not available at compile time
import DA_SDK from 'https://da.live/nx/utils/sdk.js';

// ── Types ─────────────────────────────────────────────────────────────────────

interface DaSdkContextValue {
  da: DaState;
  refresh: () => Promise<void>;
}

// ── Context ───────────────────────────────────────────────────────────────────

const DaSdkContext = createContext<DaSdkContextValue | null>(null);

// ── Provider ──────────────────────────────────────────────────────────────────

export function DaSdkProvider({ children }: { children: ReactNode }) {
  const { config } = useConfig();

  const [da, setDa] = useState<DaState>({
    context: null,
    token: '',
    username: config.daUsername,
  });

  async function refresh(): Promise<void> {
    try {
      const { context, token } = await DA_SDK;
      setDa((prev) => ({
        // DA_SDK does not expose the signed-in user's LDAP: `context` carries
        // only org/repo/ref/path, and the token is stored raw (no decode, no
        // accessor). So username almost always comes from config.daUsername.
        // Kept as a graceful upgrade path in case DA ever adds the field.
        username: (context as { username?: string } | null)?.username || prev.username,
        context: context ?? prev.context,
        token: token ?? prev.token,
      }));
    } catch (err) {
      console.warn('DA_SDK refresh failed', err);
    }
  }

  // Boot: await DA_SDK once on mount.
  useEffect(() => {
    (async () => {
      try {
        const { context, token } = await DA_SDK;
        setDa({
          context: context ?? null,
          token: token ?? '',
          // DA_SDK does not expose the signed-in user's LDAP. The real source
          // is config.daUsername. Kept as a graceful upgrade path.
          username: (context as { username?: string } | null)?.username
            || config.daUsername,
        });
      } catch (err) {
        console.warn('DA_SDK init failed', err);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep username in sync when config changes.
  useEffect(() => {
    setDa((prev) => ({ ...prev, username: config.daUsername }));
  }, [config.daUsername]);

  // Feed the signed-in DA/IMS token to the API layer as the per-account auth
  // identity. Empty in the dev/bare-localhost case — api.ts then falls back to a
  // stable per-browser dev account.
  useEffect(() => {
    setForgeAuthToken(da.token);
  }, [da.token]);

  return (
    <DaSdkContext.Provider value={{ da, refresh }}>
      {children}
    </DaSdkContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useDaSdk(): DaSdkContextValue {
  const ctx = useContext(DaSdkContext);
  if (!ctx) throw new Error('useDaSdk must be used inside <DaSdkProvider>');
  return ctx;
}
