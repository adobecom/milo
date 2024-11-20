import RequestHandler from '../request-handler.js';
import { DA_ORIGIN } from '../constants.js';

const GRAYBOX_CONFIG_FILE = '/.milo/graybox/config.json';

/**
 * GrayboxConfig provides the configuration setup for the graybox app.
 * If the global config is not defined, it will default to the experience config.
 * If global config is defined (true or false), it will override the experience config.
 */
class GrayboxConfig {
  constructor(org, repo, accessToken) {
    this.org = org;
    this.repo = repo;
    this.accessToken = accessToken;
    this.requestHandler = new RequestHandler(accessToken);

    // global config
    this.isGlobalPromoteEnabled = null;
    this.isGlobalDeleteEnabled = null;
    this.isGlobalPromoteDraftsOnly = null;

    // global promote ignore paths
    this.globalPromoteIgnorePaths = [];

    // experience config
    this.experiencePromoteConfig = [];
    this.experienceDeleteConfig = [];
    this.experienceDraftsOnlyConfig = [];
  }

  async getConfig() {
    const resp = await this.requestHandler.daFetch(`${DA_ORIGIN}/source/${this.org}/${this.repo}${GRAYBOX_CONFIG_FILE}`);
    if (resp.ok) {
      const json = await resp.json();
      const {
        'global-config': globalConfig,
        'experience-config': experienceConfig,
        'global-promote-ignore-paths': globalPromoteIgnorePathsConfig,
      } = json;

      if (globalConfig) {
        this.#setGlobalConfig(globalConfig);
      }

      if (experienceConfig) {
        this.#setExperienceConfig(experienceConfig);
      }

      if (globalPromoteIgnorePathsConfig) {
        this.globalPromoteIgnorePaths = globalPromoteIgnorePathsConfig.data.map(
          ({ globalPromoteIgnorePaths }) => globalPromoteIgnorePaths,
        );
      }
    } else {
      // eslint-disable-next-line no-console
      console.error(`Failed to fetch graybox config for ${this.org}/${this.repo}`);
    }
  }

  isPromoteEnabled(expName) {
    if (this.isGlobalPromoteEnabled === null) {
      return this.experiencePromoteConfig.includes(expName);
    }
    return this.isGlobalPromoteEnabled;
  }

  isDeleteEnabled(expName) {
    if (this.isGlobalDeleteEnabled === null) {
      return this.experienceDeleteConfig.includes(expName);
    }
    return this.isGlobalDeleteEnabled;
  }

  isDraftsOnly(expName) {
    if (this.isGlobalPromoteDraftsOnly === null) {
      return this.experienceDraftsOnlyConfig.includes(expName);
    }
    return this.isGlobalPromoteDraftsOnly;
  }

  getGlobalPromoteIgnorePaths() {
    return this.globalPromoteIgnorePaths;
  }

  #setGlobalConfig(globalConfig) {
    const enablePromoteConfig = globalConfig.data.find(({ key }) => key === 'enablePromote');
    this.isGlobalPromoteEnabled = !enablePromoteConfig || enablePromoteConfig.value === '' ? null : enablePromoteConfig.value === 'true';
    const enableDeleteConfig = globalConfig.data.find(({ key }) => key === 'enableDelete');
    this.isGlobalDeleteEnabled = !enableDeleteConfig || enableDeleteConfig.value === '' ? null : enableDeleteConfig.value === 'true';
    const promoteDraftsOnlyConfig = globalConfig.data.find(({ key }) => key === 'promoteDraftsOnly');
    this.isGlobalPromoteDraftsOnly = !promoteDraftsOnlyConfig || promoteDraftsOnlyConfig.value === '' ? null : promoteDraftsOnlyConfig.value === 'true';
  }

  #setExperienceConfig(experienceConfig) {
    const promoteConfig = experienceConfig.data.find(({ key }) => key === 'enablePromote');
    if (promoteConfig) {
      this.experiencePromoteConfig = promoteConfig.experienceNames.split(',').map((expName) => expName.trim());
    }
    const deleteConfig = experienceConfig.data.find(({ key }) => key === 'enableDelete');
    if (deleteConfig) {
      this.experienceDeleteConfig = deleteConfig.experienceNames.split(',').map((expName) => expName.trim());
    }
    const draftsOnlyConfig = experienceConfig.data.find(({ key }) => key === 'promoteDraftsOnly');
    if (draftsOnlyConfig) {
      this.experienceDraftsOnlyConfig = draftsOnlyConfig.experienceNames.split(',').map((expName) => expName.trim());
    }
  }
}

export default GrayboxConfig;
