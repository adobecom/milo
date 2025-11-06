import { getSiteEnvKey } from './helix-client.js';

export class SiteConfig {
  constructor(org, repo, lingoConfigMap) {
    this.org = org;
    this.repo = repo;
    this.key = getSiteEnvKey(org, repo);
    this.lingoConfigMap = lingoConfigMap;
    this.adminToken = this.loadAdminToken();
    this.previewRoots = this.loadPreviewRoots();
    this.excludePaths = this.loadExcludePaths();
    this.excludePathsRegex = this.buildExcludeRegex();
    this.previewIndexFilePath = this.loadPreviewIndexFilePath();
  }

  loadAdminToken() {
    const tokenKey = `AEM_ADMIN_TOKEN_${this.key}`;
    return process.env[tokenKey];
  }

  loadPreviewRoots() {
    const previewRootsKey = `PREVIEW_ROOTS_${this.key}`;
    const configKey = process.env[previewRootsKey];
    return this.lingoConfigMap[configKey] || [];
  }

  loadExcludePaths() {
    const excludesKey = `EXCLUDE_PREVIEW_PATHS_${this.key}`;
    const excludePathsStr = process.env[excludesKey] || '';
    const excludePaths = excludePathsStr.split(',')
      .map((path) => path.trim())
      .filter(Boolean);
    excludePaths.push('/target-preview/');
    return excludePaths;
  }

  buildExcludeRegex() {
    if (!this.excludePaths.length) {
      return null;
    }

    const escapedPaths = this.excludePaths.map((path) =>
      path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    );

    return new RegExp(escapedPaths.join('|'));
  }

  loadPreviewIndexFilePath() {
    const filePathKey = `PREVIEW_INDEX_FILE_${this.key}`;
    return process.env[filePathKey]
      || process.env.PREVIEW_INDEX_FILE
      || '{REGION_PATH}/drafts/preview-index';
  }

  filterPreviewRoots(requestedRegionPaths) {
    if (!requestedRegionPaths || !requestedRegionPaths.length) {
      return this.previewRoots;
    }

    return this.previewRoots.filter((root) =>
      requestedRegionPaths.includes(root)
    );
  }

  getIndexPath(regionPath) {
    const region = this.sanitizeRegionName(regionPath);
    return this.previewIndexFilePath
      .replaceAll('{REGION_PATH}', regionPath)
      .replaceAll('{REGION}', region);
  }

  sanitizeRegionName(regionPath) {
    return regionPath
      .replace(/^\/|\/$/g, '')
      .replaceAll('/', '-')
      .replaceAll('_', '-');
  }

  isValid() {
    return this.adminToken && this.previewRoots.length > 0;
  }

  getValidationError() {
    if (!this.adminToken) {
      return `Admin token not found for ${this.org}/${this.repo}`;
    }
    if (!this.previewRoots.length) {
      return `Preview roots are not setup for ${this.org}/${this.repo}`;
    }
    return null;
  }
}
