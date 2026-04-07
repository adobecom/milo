import test from 'node:test';
import assert from 'node:assert/strict';
import { fetchQueryIndex } from '../../lib/sources/query-index.js';

function makeResponse(status, body, contentType = 'application/json') {
  return new Response(body, {
    status,
    headers: { 'content-type': contentType },
  });
}

function stubFetch(routes) {
  return async (url) => routes.get(String(url))?.clone() || makeResponse(404, 'missing', 'text/plain');
}

test('fetchQueryIndex returns rowCount 0 when response has no data array', async () => {
  const routes = new Map();
  routes.set('https://main--site--adobecom.aem.live/query-index.json', makeResponse(200, JSON.stringify({ total: 0 })));

  const result = await fetchQueryIndex({
    site: 'site',
    geo: '',
    queryIndexPath: '/query-index.json',
    fetchImpl: stubFetch(routes),
  });

  assert.equal(result.ok, true);
  assert.ok(result.ok && result.rowCount === 0);
});

test('fetchQueryIndex defaults total to data length when total is absent', async () => {
  const routes = new Map();
  routes.set('https://main--site--adobecom.aem.live/query-index.json', makeResponse(200, JSON.stringify({
    data: [{ path: '/a' }, { path: '/b' }],
  })));

  const result = await fetchQueryIndex({
    site: 'site',
    geo: '',
    queryIndexPath: '/query-index.json',
    fetchImpl: stubFetch(routes),
  });

  assert.ok(result.ok);
  assert.ok(result.ok && result.rowCount === 2);
});

test('fetchQueryIndex stops on empty data in subsequent page', async () => {
  const routes = new Map();
  routes.set('https://main--site--adobecom.aem.live/query-index.json', makeResponse(200, JSON.stringify({
    total: 100,
    offset: 0,
    limit: 2,
    data: [{ path: '/a' }, { path: '/b' }],
  })));
  routes.set('https://main--site--adobecom.aem.live/query-index.json?offset=2', makeResponse(200, JSON.stringify({
    total: 100,
    offset: 2,
    limit: 2,
    data: [],
  })));

  const result = await fetchQueryIndex({
    site: 'site',
    geo: '',
    queryIndexPath: '/query-index.json',
    fetchImpl: stubFetch(routes),
  });

  assert.ok(result.ok);
  assert.ok(result.ok && result.rowCount === 2);
});

test('fetchQueryIndex returns error when second page fails', async () => {
  const routes = new Map();
  routes.set('https://main--site--adobecom.aem.live/fr/query-index.json', makeResponse(200, JSON.stringify({
    total: 4,
    offset: 0,
    limit: 2,
    data: [{ path: '/fr/a' }, { path: '/fr/b' }],
  })));
  routes.set('https://main--site--adobecom.aem.live/fr/query-index.json?offset=2', makeResponse(500, 'server error', 'text/plain'));

  const result = await fetchQueryIndex({
    site: 'site',
    geo: 'fr',
    queryIndexPath: '/query-index.json',
    fetchImpl: stubFetch(routes),
  });

  assert.equal(result.ok, false);
  assert.ok(!result.ok && result.status === 500);
});
