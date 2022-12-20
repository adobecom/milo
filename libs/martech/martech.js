/* global _satellite */
/* eslint-disable no-underscore-dangle */

function getDetails(env) {
  /* c8 ignore start */
  if (env.name === 'prod') {
    return {
      url: 'https://assets.adobedtm.com/d4d114c60e50/a0e989131fd5/launch-5dd5dd2177e6.min.js',
      edgeConfigId: env.consumer?.edgeConfigId || env.edgeConfigId,
    };
  }
  return {
    url: 'https://assets.adobedtm.com/d4d114c60e50/a0e989131fd5/launch-2c94beadc94f-development.min.js',
    edgeConfigId: env.consumer?.edgeConfigId || env.edgeConfigId,
  };
  /* c8 ignore stop */
}

export default async function init(config, loadScript) {
  const { url, edgeConfigId } = getDetails(config.env);
  window.alloy_load ??= {};
  window.alloy_load.data ??= {};
  window.alloy_all ??= {};
  window.alloy_all.data ??= {};
  window.alloy_all.data._adobe_corpnew ??= {};
  window.alloy_all.data._adobe_corpnew.digitalData ??= {};
  window.alloy_all.data._adobe_corpnew.digitalData.page ??= {};
  window.alloy_all.data._adobe_corpnew.digitalData.page.pageInfo ??= {};
  window.alloy_all.data._adobe_corpnew.digitalData.page.pageInfo.language = config.locale.ietf;

  window.marketingtech = {
    adobe: {
      launch: { url, controlPageLoad: true },
      alloy: { edgeConfigId },
      target: false,
    },
  };

  window.edgeConfigId = edgeConfigId;

  window.digitalData ??= {};
  window.digitalData.diagnostic ??= {};
  window.digitalData.diagnostic.franklin = { implementation: 'milo' };

  await loadScript('https://www.adobe.com/marketingtech/main.standard.min.js');
  _satellite.track('pageload');
}
