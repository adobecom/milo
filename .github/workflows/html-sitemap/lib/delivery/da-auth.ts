import process from 'node:process';
import { fetchJson } from '../fetch.ts';

let imsTokenPromise: Promise<string> | null = null;

function getEnv(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value ? value : undefined;
}

function getDirectToken(): string | null {
  const token = getEnv('DA_SOURCE_TOKEN') || getEnv('DA_TOKEN');
  if (!token) return null;
  return token.startsWith('Bearer ') ? token : `Bearer ${token}`;
}

function getRollingImportEnv(): Record<string, string> | null {
  const env = {
    imsUrl: getEnv('ROLLING_IMPORT_IMS_URL'),
    clientId: getEnv('ROLLING_IMPORT_CLIENT_ID'),
    clientSecret: getEnv('ROLLING_IMPORT_CLIENT_SECRET'),
    code: getEnv('ROLLING_IMPORT_CODE'),
    grantType: getEnv('ROLLING_IMPORT_GRANT_TYPE'),
  };

  return Object.values(env).every(Boolean) ? env as Record<string, string> : null;
}

async function fetchRollingImportToken(fetchImpl: typeof fetch): Promise<string> {
  const env = getRollingImportEnv();
  if (!env) {
    throw new Error(
      'Push requires DA_SOURCE_TOKEN or DA_TOKEN, or the full ROLLING_IMPORT_* IMS credential set.',
    );
  }

  const params = new URLSearchParams();
  params.append('client_id', env.clientId);
  params.append('client_secret', env.clientSecret);
  params.append('code', env.code);
  params.append('grant_type', env.grantType);

  const response = await fetchJson(env.imsUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  }, { fetchImpl });

  if (!response.ok) {
    throw new Error(`Failed to retrieve IMS token: HTTP ${response.status}`);
  }

  const json = await response.json() as { access_token?: string };
  if (!json.access_token) {
    throw new Error('IMS token response did not include `access_token`.');
  }

  return `Bearer ${json.access_token}`;
}

export async function getDaAuthHeader(fetchImpl: typeof fetch = fetch): Promise<string> {
  const directToken = getDirectToken();
  if (directToken) return directToken;

  imsTokenPromise ||= fetchRollingImportToken(fetchImpl).catch((error) => {
    imsTokenPromise = null;
    throw error;
  });

  return imsTokenPromise;
}
