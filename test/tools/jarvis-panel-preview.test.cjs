const { test } = require('node:test');
const assert = require('node:assert/strict');
const { installSurfaceOverride } = require('../../nala/utils/jarvis-panel-preview.js');

const INIT_URL = 'https://integration-server.messaging.adobe.com/core/v1/messaging/init';
const CONVERSATION_URL = 'https://assistant-integration.adobe.io/brand-concierge/conversations?sessionId=test';
const LOCAL_UI = 'https://localhost.corp.adobe.com:3443/';
const HOSTED_UI = 'https://cdn.dev.assistant.adobe.com/integration/static/ui/2026.10.92/index.html?coepEnabled=false';

function makeRoute({ url, frame, payload, response, method = 'POST' }) {
  return {
    request: () => ({
      method: () => method,
      frame: () => frame,
      postDataJSON: () => JSON.parse(payload),
    }),
    fetch: async () => ({
      ok: () => true,
      json: async () => response,
    }),
    continue(options) { this.forwarded = options || null; },
    fulfill(options) { this.fulfilled = options; },
    abort(reason) { this.aborted = reason; },
    url,
  };
}

async function fixture() {
  const routes = [];
  const logs = [];
  const page = {};
  const frame = { page: () => page, url: () => LOCAL_UI };
  const context = { route: async (matches, handler) => routes.push({ matches, handler }) };
  await installSurfaceOverride(context, (message) => logs.push(message));
  const dispatch = async (route) => {
    const handler = routes.find(({ matches }) => matches(new URL(route.url)));
    if (handler) await handler.handler(route);
  };
  const init = makeRoute({
    url: INIT_URL,
    frame,
    response: { releaseControl: { showAdobeMessaging: true, assistantUiURL: HOSTED_UI } },
  });
  await dispatch(init);
  return { dispatch, frame, logs, init, routes };
}

function conversation(frame, surfaces = ['web://localhost.corp.adobe.com:3443/']) {
  return makeRoute({
    url: CONVERSATION_URL,
    frame,
    payload: JSON.stringify({
      events: [{
        query: { conversation: { surfaces, message: 'Hello', data: { type: 'auth', payload: { token: 'test-token' } } } },
        xdm: { messagingSessionId: 'session', authToken: 'test-token' },
        data: { nested: { keep: ['all', 'values'] } },
      }, { xdm: { eventType: 'conversation.feedback' } }],
    }),
  });
}

test('changes only local surfaces, preserving every other field and hosted surface', async () => {
  const { dispatch, frame, logs, init } = await fixture();
  const route = conversation(frame, ['web://localhost.corp.adobe.com:3443/', 'web://keep.example/']);
  const expected = route.request().postDataJSON();
  expected.events[0].query.conversation.surfaces[0] = `web://${new URL(HOSTED_UI).host}${new URL(HOSTED_UI).pathname}`;
  await dispatch(route);
  assert.deepEqual(JSON.parse(route.forwarded.postData), expected);
  assert.deepEqual(Object.keys(route.forwarded), ['postData']);
  assert.ok(init.fulfilled.response);
  assert.equal(logs.some((line) => line.includes('test-token')), false);
});

test('does not reserialize requests with no local surface or a non-local caller', async () => {
  const { dispatch, frame } = await fixture();
  const hosted = conversation(frame, ['web://keep.example/']);
  await dispatch(hosted);
  assert.equal(hosted.forwarded, null);
  const otherCaller = conversation({ ...frame, url: () => HOSTED_UI });
  await dispatch(otherCaller);
  assert.equal(otherCaller.forwarded, null);
  const preflight = conversation(frame);
  preflight.request = () => ({ method: () => 'OPTIONS' });
  await dispatch(preflight);
  assert.equal(preflight.forwarded, null);
});

test('does not intercept production or other integration endpoints', async () => {
  const { routes } = await fixture();
  ['https://assistant.adobe.io/brand-concierge/conversations',
    'https://assistant-integration.adobe.io/api/v2/session',
    'https://integration-server.messaging.adobe.com/core/v1/log'].forEach((url) => {
    assert.equal(routes.some(({ matches }) => matches(new URL(url))), false);
  });
});

test('fails explicitly rather than borrowing another page surface or forwarding malformed JSON', async () => {
  const { dispatch, logs } = await fixture();
  const frame = { page: () => ({}), url: () => LOCAL_UI };
  const missing = conversation(frame);
  await dispatch(missing);
  assert.equal(missing.aborted, 'failed');
  assert.equal(missing.forwarded, undefined);
  const malformed = makeRoute({ url: CONVERSATION_URL, frame, payload: 'not json' });
  await dispatch(malformed);
  assert.equal(malformed.aborted, 'failed');
  assert.match(logs.at(-1), /Could not rewrite/);
});

test('clears a previous surface when initialization is disabled on a later reload', async () => {
  const { dispatch, frame } = await fixture();
  await dispatch(makeRoute({
    url: INIT_URL,
    frame,
    response: { releaseControl: { showAdobeMessaging: false } },
  }));
  const route = conversation(frame);
  await dispatch(route);
  assert.equal(route.aborted, 'failed');
  assert.equal(route.forwarded, undefined);
});
