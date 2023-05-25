import { getUrlInfo } from '../../loc/utils.js';
import {
  fetchConfigJson,
  getSharepointConfig,
  getSharepointRestConfig,
  getHelixAdminConfig,
} from '../../loc/config.js';

const FLOODGATE_CONFIG = '/drafts/floodgate/configs/config.json';

let decoratedConfig;

async function getConfig() {
  if (!decoratedConfig) {
    const urlInfo = getUrlInfo();
    if (urlInfo.isValid()) {
      const configPath = `${urlInfo.origin}${FLOODGATE_CONFIG}`;
      const configJson = await fetchConfigJson(configPath);
      decoratedConfig = {
        sprest: getSharepointRestConfig(configJson),
        admin: getHelixAdminConfig(),
      };
    }
  }
  return decoratedConfig;
}

export {
  getConfig,
  FLOODGATE_CONFIG,
};
