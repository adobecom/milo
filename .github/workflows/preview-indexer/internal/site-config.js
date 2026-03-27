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

  function regExFromPattern(pattern) {
    try {
      return pattern ? new RegExp(pattern) : null;
    } catch (error) {
      console.error(`Error creating regex from pattern ${pattern}: ${error}`);
      return null;
    }
  }

  function buildPathTester(sKey) {
    const excludesKeyDef = `EXCLUDE_PREVIEW_PATHS_PATTERN`;
    const excludesKey = `${excludesKeyDef}_${sKey}`;
    const includesKey = `INCLUDE_PREVIEW_PATHS_PATTERN_${sKey}`;
    const excludeRegex = regExFromPattern(process.env[excludesKey] || process.env[excludesKeyDef]);
    const includeRegex = regExFromPattern(process.env[includesKey])

    return (path) => {
      if (excludeRegex?.test(path)) {
        return false;
      }
      return includeRegex ? includeRegex.test(path) : true;
    };
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
  const canIncludePath = buildPathTester(key);
  const previewIndexFilePath = loadPreviewIndexFilePath();

  return {
    org,
    repo,
    key,
    lingoConfigMap,
    adminToken,
    previewRoots,
    canIncludePath,
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

    getPreviewFileExtension() {
      const previewPathExtensionKey = `PREVIEW_FILE_EXTN_${key}`;
      return process.env[previewPathExtensionKey] || '';
    },
  };
}
