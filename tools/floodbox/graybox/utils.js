/* eslint-disable import/no-unresolved */
import DA_SDK from 'https://da.live/nx/utils/sdk.js';
import localeData from '../../../libs/utils/locales.js';

function validatePaths(paths) {
  const retData = { valid: false, org: '', repo: '', expName: '' };
  if (!Array.isArray(paths) || paths.length === 0) return retData;

  let org; let repo; let expName;
  for (const path of paths) {
    if (!path.startsWith('/')) return retData;
    const parts = path.split('/').filter(Boolean);

    // Check that path has more than 3 parts
    if (parts.length <= 3) return retData;

    const [orgPart, repoPart, localeOrExpPart] = parts;

    // Initialize or check <org> and <repo> consistency
    if (!org && !repo) {
      org = orgPart;
      repo = repoPart;
    }
    if (orgPart !== org || repoPart !== repo || !repoPart.includes('-graybox')) {
      return retData;
    }

    // Determine locale and validate position of <expName>
    let locale; let expNameIndex;
    if (localeOrExpPart in localeData) {
      // Locale exists at index 2
      locale = localeOrExpPart;
      expNameIndex = 3;
    } else {
      // No locale, expName expected at index 2
      locale = '';
      expNameIndex = 2;
    }

    // Check <expName> consistency
    const currentExpName = parts[expNameIndex];
    if (!expName) {
      expName = currentExpName;
    } else if (expName !== currentExpName) {
      return retData;
    }

    // Ensure locale is valid if specified
    if (locale && !(locale in localeData)) {
      return retData;
    }
  }

  return { valid: true, org, repo, expName };
}

async function getValidGraybox(sdk = DA_SDK) {
  const { context, token } = await sdk;
  const cmp = document.createElement('milo-graybox');
  cmp.repo = context.repo;
  cmp.token = token;
  return cmp;
}

export {
  validatePaths,
  getValidGraybox,
};
