// @forge-figma-ship — fast real-mode integration test for the Figma→DA ship path.
//
// Skips in demo mode. Requires:
//   - Backend running at FORGE_SERVER_URL (default http://localhost:8080)
//   - fixtures/figma-session.json populated (run `npm run nala:forge:capture` once)
//   - FORGE_REPO_PATH or REPO_PATH — consumer repo for the ship step
//   - FORGE_DA_TOKEN or DA_TOKEN — DA Authoring push token
//
// Does NOT call Claude/Anthropic. Restores pre-captured versions and ships to DA.
// Typical runtime: ~2 min.

import { expect, test } from '@playwright/test';
import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';
import { features } from './forge.spec.js';

const MODE = process.env.FORGE_TEST_MODE || 'demo';
const isReal = MODE === 'real';

const SERVER_URL = process.env.FORGE_SERVER_URL || 'http://localhost:8080';
const REPO_PATH = process.env.FORGE_REPO_PATH || process.env.REPO_PATH || '';
const DA_TOKEN = process.env.FORGE_DA_TOKEN || process.env.DA_TOKEN || 'dev-token';
const FORGE_ACCOUNT = process.env.FORGE_ACCOUNT || 'local-e2e';

const FIXTURE_PATH = resolve(process.cwd(), features[2].data.fixtureFile);

const SHIP_POLL_INTERVAL = 10_000;
const SHIP_TIMEOUT = 5 * 60 * 1_000;

function authHeaders() {
  return {
    'content-type': 'application/json',
    authorization: `Bearer ${FORGE_ACCOUNT}`,
  };
}

async function pollSession(request, sessionId, timeoutMs = SHIP_TIMEOUT) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const res = await request.get(`${SERVER_URL}/forge/sessions/${sessionId}`, {
      headers: authHeaders(),
    });
    const session = await res.json();
    if (session.status !== 'pending' && session.status !== 'running') return session;
    await new Promise((r) => setTimeout(r, SHIP_POLL_INTERVAL));
  }
  throw new Error(`Timed out polling session ${sessionId}`);
}

test.describe(`Forge — figma ship integration (${MODE} mode)`, () => {
  test(
    `[Test Id - ${features[2].tcid}] ${features[2].name}, ${features[2].tags}`,
    async ({ request }) => {
      test.skip(!isReal, 'forge-figma-ship only runs in real mode (FORGE_TEST_MODE=real)');
      test.skip(
        !existsSync(FIXTURE_PATH) || JSON.parse(readFileSync(FIXTURE_PATH)).versions?.length === 0,
        'Fixture not yet captured — run `npm run nala:forge:capture` first',
      );

      const fixture = JSON.parse(readFileSync(FIXTURE_PATH));

      await test.step('step-1: restore pre-captured Figma session on the server', async () => {
        const res = await request.post(`${SERVER_URL}/forge/sessions/restore`, {
          data: {
            source: fixture.source,
            sourceInput: fixture.sourceInput,
            versions: fixture.versions,
            daContext: null,
            serverConfig: { repoPath: REPO_PATH },
          },
          headers: authHeaders(),
        });
        expect(res.ok()).toBeTruthy();
        const session = await res.json();
        expect(session.sessionId || session.id).toBeTruthy();
        // Stash sessionId on test context for subsequent steps.
        test.info().annotations.push({ type: 'sessionId', description: session.sessionId || session.id });
      });

      // Retrieve the sessionId from annotations (set in step-1).
      const sessionId = test.info().annotations.find((a) => a.type === 'sessionId')?.description;
      expect(sessionId, 'sessionId must be set after restore').toBeTruthy();

      await test.step('step-2: wait for session to reach done/gate state', async () => {
        const session = await pollSession(request, sessionId);
        expect(['done', 'gate'], `Unexpected status: ${session.status}`).toContain(session.status);
        expect(session.versions?.length).toBeGreaterThan(0);
      });

      await test.step('step-3: ship restored session to DA Authoring', async () => {
        const res = await request.post(`${SERVER_URL}/forge/sessions/${sessionId}/ship`, {
          data: {
            daContext: null,
            token: DA_TOKEN,
            repoPath: REPO_PATH,
            consumerPreviewUrl: process.env.FORGE_CONSUMER_PREVIEW_URL || '',
          },
          headers: authHeaders(),
        });
        expect(res.ok()).toBeTruthy();
      });

      await test.step('step-4: poll until session status is shipped', async () => {
        const session = await pollSession(request, sessionId);
        expect(session.status).toBe('shipped');
        expect(session.shipped).toBeTruthy();
      });
    },
  );
});
