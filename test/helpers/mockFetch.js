import { stub } from 'sinon';

stub(window, 'fetch');

function jsonOk(body) {
  const mockResponse = new window.Response(JSON.stringify(body), {
    status: 200,
    headers: { 'Content-type': 'application/json' },
  });

  return Promise.resolve(mockResponse);
}

function jsonError(status, body) {
  const mockResponse = new window.Response(JSON.stringify(body), {
    status: 500,
    ok: false,
    headers: { 'Content-type': 'application/json' },
  });

  return Promise.reject(mockResponse);
}

export const stubFetch = (data) => {
  const resp = jsonOk({ data: JSON.stringify(data) });
  window.fetch.returns(resp);
};

export const stubFetchError = (data) => {
  const resp = jsonError({
    status: 500,
    data: JSON.stringify(data),
  });
  window.fetch.returns(resp);
};

export const stubEmptyResponse = () => {
  const resp = jsonOk({ data: JSON.stringify([]) });
  window.fetch.returns(resp);
};
