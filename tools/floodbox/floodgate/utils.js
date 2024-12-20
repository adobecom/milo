/* eslint-disable import/no-unresolved */
import DA_SDK from 'https://da.live/nx/utils/sdk.js';

function validatePaths(paths) {
  const retData = { valid: false, org: '', repo: '' };
  if (!Array.isArray(paths) || paths.length === 0) return retData;

  let org; let repo;
  for (const path of paths) {
    if (!path.startsWith('/')) return retData;
    const parts = path.split('/').filter(Boolean);
    // Check that path has more than 2 parts
    if (parts.length <= 2) return retData;
    const [orgPart, repoPart] = parts;
    // Initialize or check <org> and <repo> consistency
    if (!org && !repo) {
      org = orgPart;
      repo = repoPart;
    }
    if (orgPart !== org || repoPart !== repo || repoPart.includes('-pink')) {
      return retData;
    }
  }
  return { valid: true, org, repo };
}

async function getValidFloodgate(sdk = DA_SDK) {
  const { context, token } = await sdk;
  const cmp = document.createElement('milo-floodgate');
  cmp.repo = context.repo;
  cmp.token = token;
  return cmp;
}

export {
  validatePaths,
  getValidFloodgate,
};
