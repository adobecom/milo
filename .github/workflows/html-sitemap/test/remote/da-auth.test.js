import test from 'node:test';
import assert from 'node:assert/strict';

const ENV_KEYS = [
  'DA_SOURCE_TOKEN',
  'DA_TOKEN',
  'ROLLING_IMPORT_IMS_URL',
  'ROLLING_IMPORT_CLIENT_ID',
  'ROLLING_IMPORT_CLIENT_SECRET',
  'ROLLING_IMPORT_SCOPES',
];

function snapshotEnv() {
  const snap = {};
  for (const key of ENV_KEYS) snap[key] = process.env[key];
  return snap;
}

function restoreEnv(snap) {
  for (const key of ENV_KEYS) {
    if (snap[key] === undefined) delete process.env[key];
    else process.env[key] = snap[key];
  }
}

function clearEnv() {
  for (const key of ENV_KEYS) delete process.env[key];
}

/**
 * Each test imports the module fresh so the cached IMS token promise
 * doesn't bleed between tests.
 */
async function freshGetDaAuthHeader() {
  const mod = await import(`../../lib/remote/da-auth.js?cacheBust=${Math.random()}`);
  return mod.getDaAuthHeader;
}

test('IMS exchange POSTs grant_type=client_credentials with client_id/secret', async () => {
  const snap = snapshotEnv();
  clearEnv();
  process.env.ROLLING_IMPORT_IMS_URL = 'https://ims.example/token';
  process.env.ROLLING_IMPORT_CLIENT_ID = 'cid';
  process.env.ROLLING_IMPORT_CLIENT_SECRET = 'csecret';

  try {
    const captured = {};
    const fetchImpl = async (url, init) => {
      captured.url = String(url);
      captured.body = init?.body;
      return new Response(JSON.stringify({ access_token: 'tok-cc' }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      });
    };

    const getDaAuthHeader = await freshGetDaAuthHeader();
    const header = await getDaAuthHeader(fetchImpl);

    assert.equal(header, 'Bearer tok-cc');
    assert.equal(captured.url, 'https://ims.example/token');
    const body = captured.body.toString();
    assert.match(body, /client_id=cid/);
    assert.match(body, /client_secret=csecret/);
    assert.match(body, /grant_type=client_credentials/);
    assert.ok(!body.includes('scope='), 'no `scope` param when SCOPES is unset');
  } finally {
    restoreEnv(snap);
  }
});

test('IMS exchange appends scope when ROLLING_IMPORT_SCOPES is set', async () => {
  const snap = snapshotEnv();
  clearEnv();
  process.env.ROLLING_IMPORT_IMS_URL = 'https://ims.example/token';
  process.env.ROLLING_IMPORT_CLIENT_ID = 'cid';
  process.env.ROLLING_IMPORT_CLIENT_SECRET = 'csecret';
  process.env.ROLLING_IMPORT_SCOPES = 'openid,AdobeID,aem.frontend.all';

  try {
    let capturedBody = '';
    const fetchImpl = async (_url, init) => {
      capturedBody = init?.body?.toString() || '';
      return new Response(JSON.stringify({ access_token: 'tok-scoped' }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      });
    };

    const getDaAuthHeader = await freshGetDaAuthHeader();
    const header = await getDaAuthHeader(fetchImpl);

    assert.equal(header, 'Bearer tok-scoped');
    assert.match(capturedBody, /scope=openid%2CAdobeID%2Caem\.frontend\.all/);
  } finally {
    restoreEnv(snap);
  }
});

test('IMS exchange fails with clear message when required vars are missing', async () => {
  const snap = snapshotEnv();
  clearEnv();
  // No env at all

  try {
    const getDaAuthHeader = await freshGetDaAuthHeader();
    await assert.rejects(
      () => getDaAuthHeader(async () => new Response('{}', { status: 200 })),
      /DA_SOURCE_TOKEN|DA_TOKEN|ROLLING_IMPORT/,
    );
  } finally {
    restoreEnv(snap);
  }
});

test('IMS error response body is included in thrown error', async () => {
  const snap = snapshotEnv();
  clearEnv();
  process.env.ROLLING_IMPORT_IMS_URL = 'https://ims.example/token';
  process.env.ROLLING_IMPORT_CLIENT_ID = 'cid';
  process.env.ROLLING_IMPORT_CLIENT_SECRET = 'csecret';

  try {
    const fetchImpl = async () => new Response(
      JSON.stringify({ error: 'invalid_target_scope', error_description: 'scope mismatch' }),
      { status: 400, headers: { 'content-type': 'application/json' } },
    );

    const getDaAuthHeader = await freshGetDaAuthHeader();
    await assert.rejects(
      () => getDaAuthHeader(fetchImpl),
      /HTTP 400.*invalid_target_scope.*scope mismatch/s,
    );
  } finally {
    restoreEnv(snap);
  }
});

test('direct DA_SOURCE_TOKEN wins over IMS exchange', async () => {
  const snap = snapshotEnv();
  clearEnv();
  process.env.DA_SOURCE_TOKEN = 'direct-token-value';
  // Set IMS env too — should be ignored
  process.env.ROLLING_IMPORT_IMS_URL = 'https://ims.example/token';
  process.env.ROLLING_IMPORT_CLIENT_ID = 'cid';
  process.env.ROLLING_IMPORT_CLIENT_SECRET = 'csecret';

  try {
    let imsCalled = false;
    const fetchImpl = async () => {
      imsCalled = true;
      return new Response('{}', { status: 200 });
    };

    const getDaAuthHeader = await freshGetDaAuthHeader();
    const header = await getDaAuthHeader(fetchImpl);

    assert.equal(header, 'Bearer direct-token-value');
    assert.equal(imsCalled, false, 'IMS endpoint should not be called when direct token is present');
  } finally {
    restoreEnv(snap);
  }
});
