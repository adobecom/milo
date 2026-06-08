import { stub, match } from 'sinon';
import tagsData from './tagsData.js';

const CAAS_TAGS_URL_BASE = 'https://www.adobe.com/chimera-api/tags';

const ogFetch = window.fetch;

export const stubFetch = () => {
  window.fetch = stub();
  window.fetch.withArgs(match((url) => url.startsWith(CAAS_TAGS_URL_BASE))).returns(
    new Promise((resolve) => {
      resolve({
        ok: true,
        json: () => tagsData,
      });
    }),
  );
};

export const restoreFetch = () => {
  window.fetch = ogFetch;
};
