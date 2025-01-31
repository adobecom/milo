import RequestHandler from '../request-handler.js';
import { DA_ORIGIN } from '../constants.js';

const FLOODGATE_CONFIG_FILE = '/.milo/floodgate/config.json';

/**
 * FloodgateConfig provides the configuration setup for the Floodgate app.
 */
class FloodgateConfig {
  constructor(org, repo, accessToken) {
    this.org = org;
    this.repo = repo;
    this.accessToken = accessToken;
    this.requestHandler = new RequestHandler(accessToken);

    // config
    this.isPromoteEnabled = false;
    this.isDeleteEnabled = false;
    this.isPromoteDraftsOnly = false;

    // promote ignore paths
    this.promoteIgnorePaths = [];
  }

  async getConfig() {
    const resp = await this.requestHandler.daFetch(`${DA_ORIGIN}/source/${this.org}/${this.repo}${FLOODGATE_CONFIG_FILE}`);
    if (resp.ok) {
      const json = await resp.json();
      const {
        config,
        'promote-ignore-paths': promoteIgnorePathsConfig,
      } = json;

      if (config) {
        this.#setConfig(config);
      }

      if (promoteIgnorePathsConfig) {
        this.promoteIgnorePaths = promoteIgnorePathsConfig.data.map(
          ({ promoteIgnorePaths }) => promoteIgnorePaths,
        );
      }
    } else {
      // eslint-disable-next-line no-console
      console.error(`Failed to fetch Floodgate config for ${this.org}/${this.repo}`);
    }
  }

  getPromoteIgnorePaths() {
    return this.promoteIgnorePaths;
  }

  #setConfig(config) {
    const enablePromoteConfig = config.data.find(({ key }) => key === 'enablePromote');
    this.isPromoteEnabled = enablePromoteConfig?.value === 'true';
    const enableDeleteConfig = config.data.find(({ key }) => key === 'enableDelete');
    this.isDeleteEnabled = enableDeleteConfig?.value === 'true';
    const promoteDraftsOnlyConfig = config.data.find(({ key }) => key === 'promoteDraftsOnly');
    this.isPromoteDraftsOnly = promoteDraftsOnlyConfig?.value === 'true';
  }
}

export default FloodgateConfig;
