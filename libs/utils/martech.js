/* eslint-disable no-underscore-dangle */
/* eslint-disable max-len */

function getDetails(env) {
  if (env.name === 'prod') {
    return {
      url: 'https://assets.adobedtm.com/d4d114c60e50/a0e989131fd5/launch-5dd5dd2177e6.min.js',
      edgeConfigId: '2cba807b-7430-41ae-9aac-db2b0da742d5',
    };
  }
  return {
    url: 'https://assets.adobedtm.com/d4d114c60e50/a0e989131fd5/launch-2c94beadc94f-development.min.js',
    edgeConfigId: '8d2805dd-85bf-4748-82eb-f99fdad117a6',
  };
}

export default function init(config, loadScript, getMetadata) {
  const { url, edgeConfigId } = getDetails(config.env);
  window.alloy_load = window.alloy_load || {};
  window.alloy_load.data = window.alloy_load.data || {};
  window.alloy_all = window.alloy_all || {};
  window.alloy_all.data = window.alloy_all.data || {};
  window.alloy_all.data._adobe_corpnew = window.alloy_all.data._adobe_corpnew || {};
  window.alloy_all.data._adobe_corpnew.digitalData = window.alloy_all.data._adobe_corpnew.digitalData || {};
  window.alloy_all.data._adobe_corpnew.digitalData.page = window.alloy_all.data._adobe_corpnew.digitalData.page || {};
  window.alloy_all.data._adobe_corpnew.digitalData.page.pageInfo = window.alloy_all.data._adobe_corpnew.digitalData.page.pageInfo || {};
  window.alloy_all.data._adobe_corpnew.digitalData.page.pageInfo.language = config.locale.ietf;

  window.marketingtech = {
    adobe: {
      launch: { url, controlPageLoad: true },
      alloy: { edgeConfigId },
      target: getMetadata('target') === 'on',
    },
  };

  loadScript('https://www.adobe.com/marketingtech/main.standard.min.js');
}
