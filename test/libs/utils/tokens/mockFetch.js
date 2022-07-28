import { stub } from 'sinon';
import libTokensData from './libTokensData.js';

const ogFetch = window.fetch;

export const stubFetch = () => {
  window.fetch = stub();
  window.fetch.returns(
    Promise.resolve({
      ok: true,
      json: () => libTokensData,
    }),
  );
};

export const restoreFetch = () => {
  window.fetch = ogFetch;
};
