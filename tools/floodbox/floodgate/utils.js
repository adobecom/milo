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
    } else if (orgPart !== org || repoPart !== repo || repoPart.includes('-pink')) {
      return retData;
    }
  }
  return { valid: true, org, repo };
}

export default validatePaths;
