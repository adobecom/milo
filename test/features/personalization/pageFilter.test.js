import { expect } from '@esm-bundle/chai';
import { readFile } from '@web/test-runner-commands';
import { stub } from 'sinon';
import { getConfig } from '../../../libs/utils/utils.js';
import { applyPers } from '../../../libs/features/personalization/personalization.js';

document.body.innerHTML = await readFile({ path: './mocks/personalization.html' });

it('pageFilter should exclude page if it is not a match', async () => {
  const config = getConfig();
  config.env = { name: 'prod' };

  let manifestJson = await readFile({ path: './mocks/manifestPageFilterExclude.json' });
  manifestJson = JSON.parse(manifestJson);
  const replacePageHtml = await readFile({ path: './mocks/fragments/replacePage.plain.html' });

  window.fetch = stub();
  window.fetch.onCall(0).returns(
    new Promise((resolve) => {
      resolve({
        ok: true,
        json: () => manifestJson,
      });
    }),
  );
  window.fetch.onCall(1).returns(
    new Promise((resolve) => {
      resolve({
        ok: true,
        text: () => replacePageHtml,
      });
    }),
  );

  expect(document.querySelector('.marquee')).to.not.be.null;
  expect(document.querySelector('.newpage')).to.be.null;

  await applyPers([{ manifestPath: '/path/to/manifest.json' }]);

  // Nothing should be changed since the pageFilter excludes this page
  expect(document.querySelector('.marquee')).to.not.be.null;
  expect(document.querySelector('.newpage')).to.be.null;
});

it('pageFilter should include page if it is a match', async () => {
  const config = getConfig();
  config.env = { name: 'prod' };

  let manifestJson = await readFile({ path: './mocks/manifestPageFilterInclude.json' });
  manifestJson = JSON.parse(manifestJson);
  const replacePageHtml = await readFile({ path: './mocks/fragments/replacePage.plain.html' });

  window.fetch = stub();
  window.fetch.onCall(0).returns(
    new Promise((resolve) => {
      resolve({
        ok: true,
        json: () => manifestJson,
      });
    }),
  );
  window.fetch.onCall(1).returns(
    new Promise((resolve) => {
      resolve({
        ok: true,
        text: () => replacePageHtml,
      });
    }),
  );

  expect(document.querySelector('.marquee')).to.not.be.null;
  expect(document.querySelector('.newpage')).to.be.null;

  await applyPers([{ manifestPath: '/path/to/manifest.json' }]);

  expect(document.querySelector('.marquee')).to.be.null;
  expect(document.querySelector('.newpage')).to.not.be.null;
});
