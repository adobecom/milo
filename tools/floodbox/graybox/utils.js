import localeData from '../../../libs/utils/locales.js';

function validatePaths(paths) {
  const retData = { valid: false, org: '', repo: '', expName: '' };
  if (!Array.isArray(paths) || paths.length === 0) return retData;

  let org; let repo; let expName;
  for (const path of paths) {
    const parts = path.split('/').filter(Boolean);

    // Check that path has more than 3 parts
    if (parts.length <= 3) return retData;

    const [orgPart, repoPart, localeOrExpPart] = parts;

    // Initialize or check <org> and <repo> consistency
    if (!org && !repo) {
      org = orgPart;
      repo = repoPart;
    } else if (orgPart !== org || repoPart !== repo || !repoPart.includes('-graybox')) {
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

export default validatePaths;
