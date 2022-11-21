import { stub } from 'sinon';
import tagsData from './tagsData.js';

const CAAS_TAG_URL = 'https://www.adobe.com/chimera-api/tags';

const ogFetch = window.fetch;

export const stubFetch = () => {
  window.fetch = stub();
  window.fetch.withArgs(CAAS_TAG_URL).returns(
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
