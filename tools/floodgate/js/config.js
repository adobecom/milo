import { getUrlInfo } from '../../loc/utils.js';
import {
  fetchConfigJson,
  getSharepointConfig,
  getHelixAdminConfig,
} from '../../loc/config.js';

const FLOODGATE_CONFIG = '/drafts/floodgate/configs/config.json';

let decoratedConfig;

function getPromoteIgnorePaths(configJson) {
  const promoteIgnorePaths = configJson.promoteignorepaths.data;
  const paths = [];
  promoteIgnorePaths.forEach((pathRow) => {
    const path = pathRow.FilesToIgnoreFromPromote;
    paths.push(path);
  });
  return paths;
}

async function getConfig(fgColor) {
  if (!decoratedConfig) {
    const urlInfo = getUrlInfo();
    if (urlInfo.isValid()) {
      const configPath = `${urlInfo.origin}${FLOODGATE_CONFIG}`;
      const configJson = await fetchConfigJson(configPath);
      decoratedConfig = {
        sp: getSharepointConfig(configJson, fgColor),
        admin: getHelixAdminConfig(),
        promoteIgnorePaths: getPromoteIgnorePaths(configJson),
      };
    }
  }
  return decoratedConfig;
}

export {
  getConfig,
  FLOODGATE_CONFIG,
};
