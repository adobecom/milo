import { stub } from 'sinon';

const currentVersion = {
  ID: 3,
  ServerRelativeUrl: 'ServerRelativeUrl',
  UIVersionLabel: '3.0',
  CheckInComment: 'Tag 3',
  TimeLastModified: 'TimeLastModified'
}

const versions = [{
  ID: 1,
  Url: 'ServerRelativeUrl',
  VersionLabel: '1.0',
  CheckInComment: 'Tag 1',
  Created: 'TimeLastModified',
  IsCurrentVersion: true
},
{
  ID: 2,
  Url: 'ServerRelativeUrl',
  VersionLabel: '2.0',
  CheckInComment: 'Tag 2',
  Created: 'TimeLastModified',
  IsCurrentVersion: false
}];

const list = {
  value: versions
}
const url = `https://adobe.sharepoint.com/sites/adobecom/_api/web/GetFileById('undefined')`
const ogFetch = window.fetch;
window.fetch = stub();
export const stubFetch = () => {
  window.fetch.withArgs(`${url}`).returns(
    new Promise((resolve) => {
      resolve({
        ok: true,
        json: () => currentVersion,
      });
    }),
  );

};

export const stubFetchVersions = () => {
  window.fetch.withArgs(`${url}/Versions`).returns(
    new Promise((resolve) => {
      resolve({
        ok: true,
        json: () => list,
      });
    }),
  );
};

export const stubCreateVersions = (comment = '') => {
  window.fetch.withArgs(`${url}/Publish('Through API: ${comment}')`).returns(
    new Promise((resolve) => {
      resolve({
        ok: false,
      });
    }),
  );
};

export const stubLogin = stub().returns('Logged in')

export const restoreFetch = () => {
  window.fetch = ogFetch;
};
