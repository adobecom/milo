import { stub } from 'sinon';

const stubedFetch = stub(window, 'fetch');
const HELIX_REVIEW_URL = '/data/review';
const data = [
  {
    total: 100,
    rating: 4,
    average: 4
  }
];

function jsonOk (body) {
  const mockResponse = new window.Response(JSON.stringify(body), {
    status: 200,
    headers: {
      'Content-type': 'application/json'
    }
  });

  return Promise.resolve(mockResponse);
}

function jsonError (status, body) {
  const mockResponse = new window.Response(JSON.stringify(body), {
    status: 500,
    ok: false,
    headers: {
      'Content-type': 'application/json'
    }
  });

  return Promise.reject(mockResponse);
}

export const stubFetch = () => {
  window.fetch.returns(jsonOk({
    data: JSON.stringify(data)
  }));
};

export const stubFetchError = () => {
  window.fetch.returns(jsonError({
    status: 500,
    data: JSON.stringify(data)
  }));
}

export const stubEmptyResponse = () => {
  window.fetch.returns(jsonOk({
    data: JSON.stringify([])
  }));
}
