import { getSiteEnvKey } from './helix-client.js';

export default function SiteConfig(org, repo, lingoConfigMap) {
  const key = getSiteEnvKey(org, repo);

  function loadAdminToken() {
    const tokenKey = `AEM_ADMIN_TOKEN_${key}`;
    return process.env[tokenKey];
  }

  function loadPreviewRoots() {
    const previewIndexKey = process.env[`PREVIEW_INDEX_KEY_${key}`];
    return lingoConfigMap[previewIndexKey] || [];
  }

  function loadExcludePaths() {
    const excludesKey = `EXCLUDE_PREVIEW_PATHS_${key}`;
    const excludePathsStr = process.env[excludesKey] || '';
    const excludePaths = excludePathsStr.split(',')
      .map((path) => path.trim())
      .filter(Boolean);
    excludePaths.push('/target-preview/');
    return excludePaths;
  }

  function buildExcludeRegex(excludePaths) {
    if (!excludePaths.length) {
      return null;
    }

    const escapedPaths = excludePaths.map((path) =>
      path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    );

    return new RegExp(escapedPaths.join('|'));
  }

  function loadPreviewIndexFilePath() {
    const filePathKey = `PREVIEW_INDEX_FILE_${key}`;
    return process.env[filePathKey]
      || process.env.PREVIEW_INDEX_FILE
      || '{REGION_PATH}/drafts/preview-index';
  }

  function sanitizeRegionName(regionPath) {
    return regionPath
      .replace(/^\/|\/$/g, '')
      .replaceAll('/', '-')
      .replaceAll('_', '-');
  }

  const adminToken = loadAdminToken();
  const previewRoots = loadPreviewRoots();
  const excludePaths = loadExcludePaths();
  const excludePathsRegex = buildExcludeRegex(excludePaths);
  const previewIndexFilePath = loadPreviewIndexFilePath();

  return {
    org,
    repo,
    key,
    lingoConfigMap,
    adminToken,
    previewRoots,
    excludePaths,
    excludePathsRegex,
    previewIndexFilePath,

    filterPreviewRoots(requestedRegionPaths) {
      if (!requestedRegionPaths || !requestedRegionPaths.length) {
        return previewRoots;
      }

      return previewRoots.filter((root) =>
        requestedRegionPaths.includes(root)
      );
    },

    getIndexPath(regionPath) {
      const region = sanitizeRegionName(regionPath);
      return previewIndexFilePath
        .replaceAll('{REGION_PATH}', regionPath)
        .replaceAll('{REGION}', region);
    },

    sanitizeRegionName,

    isValid() {
      return adminToken && previewRoots.length > 0;
    },

    getValidationError() {
      if (!adminToken) {
        return `Admin token not found for ${org}/${repo}`;
      }
      if (!previewRoots.length) {
        return `Preview roots are not setup for ${org}/${repo}`;
      }
      return null;
    },

    getPreviewPathExtension() {
      const previewPathExtensionKey = `PREVIEW_PATH_EXTN_${key}`;
      return process.env[previewPathExtensionKey] || '';
    },
  };
}
