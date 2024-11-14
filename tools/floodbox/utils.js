import localeData from '../../../libs/utils/locales.js';

function calculatePromoteTime(startTime) {
  const endTime = Date.now();
  const timeTaken = (endTime - startTime) / 1000;
  console.log(`Time taken for promotion: ${timeTaken} seconds`);
}

function isEditableFile(fileExt) {
  return ['html', 'json'].includes(fileExt);
}

function validatePaths(paths) {
  const retData = { valid: false, org: '', repo: '', expName: '' };
  if (!Array.isArray(paths) || paths.length === 0) return retData;

  let org, repo, expName;
  for (const path of paths) {
    const parts = path.split("/").filter(Boolean);

    // Check that path has more than 3 parts
    if (parts.length <= 3) return retData;

    // Initialize or check <org> and <repo> consistency
    if (!org && !repo) {
      org = parts[0];
      repo = parts[1];
    } else if (parts[0] !== org || parts[1] !== repo || !parts[1].includes("-graybox")) {
      return retData;
    }

    // Determine locale and validate position of <expName>
    let locale, expNameIndex;
    if (parts[2] in localeData) {
      // Locale exists at index 2
      locale = parts[2];
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

export { calculatePromoteTime, isEditableFile, validatePaths };
