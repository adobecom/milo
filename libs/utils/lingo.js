async function urlInMatchingIndex(matchingIndexes, sanitizedPath) {
  const pathsArrays = await Promise.all(matchingIndexes.map((q) => q.pathsRequest));
  const allPaths = pathsArrays.flat().filter(Boolean);
  return allPaths.some((path) => sanitizedPath === path);
}

async function tryEarlyDecisionUsingBaseIndex(
  matchingIndexes,
  regionalPath,
  basePath,
  urlHostname,
  initialResolvedCount,
  baseQueryIndex,
) {
  if (!baseQueryIndex?.pathsRequest) return null;

  const baseIndexMatches = baseQueryIndex.domains.includes(urlHostname) ? [baseQueryIndex] : [];
  if (baseIndexMatches.length === 0) return null;

  const allRegionalPromises = Promise.all(matchingIndexes.map((m) => m.pathsRequest));

  await Promise.race([baseQueryIndex.pathsRequest, allRegionalPromises]);

  if (!baseQueryIndex.requestResolved) return null;

  const currentResolvedIndexes = matchingIndexes.filter((m) => m.requestResolved);

  if (currentResolvedIndexes.length > initialResolvedCount) {
    const foundInNewlyResolved = await urlInMatchingIndex(currentResolvedIndexes, regionalPath);
    if (foundInNewlyResolved) return true;
  }

  // Check if basePath exists in base query index
  const urlExistsInBase = await urlInMatchingIndex(baseIndexMatches, basePath);
  return urlExistsInBase ? false : null;
}

export default async function urlInQueryIndex(
  regionalPath,
  basePath,
  urlHostname,
  matchingIndexes,
  baseQueryIndex,
) {
  const sanitizedPath = regionalPath.replace(/\.html$/, '');

  const allResolved = matchingIndexes.every((m) => m.requestResolved);
  if (allResolved) return urlInMatchingIndex(matchingIndexes, sanitizedPath);

  const resolvedIndexes = matchingIndexes.filter((m) => m.requestResolved);
  if (resolvedIndexes.length) {
    const foundInResolved = await urlInMatchingIndex(resolvedIndexes, sanitizedPath);
    if (foundInResolved) return true;
  }

  const sanitizedBasePath = basePath.replace(/\.html$/, '');
  const earlyDecision = await tryEarlyDecisionUsingBaseIndex(
    matchingIndexes,
    sanitizedPath,
    sanitizedBasePath,
    urlHostname,
    resolvedIndexes.length,
    baseQueryIndex,
  );

  if (earlyDecision !== null) return earlyDecision;

  await Promise.all(matchingIndexes.map((m) => m.pathsRequest));
  return urlInMatchingIndex(matchingIndexes, sanitizedPath);
}
