async function urlInMatchingIndex(matchingIndexes, sanitizedPath) {
  const pathsArrays = await Promise.all(matchingIndexes.map((q) => q.pathsRequest));
  const allPaths = pathsArrays.flat().filter(Boolean);
  return allPaths.some((path) => sanitizedPath === path);
}

async function tryEarlyDecisionUsingBaseIndex(
  matchingIndexes,
  sanitizedPath,
  urlHostname,
  initialResolvedCount,
  baseQueryIndex,
) {
  if (!baseQueryIndex?.pathsRequest) return null;

  const baseIndexMatches = Object.values(baseQueryIndex)
    .filter((q) => q.domains.includes(urlHostname));
  const allRegionalPromises = Promise.all(matchingIndexes.map((m) => m.pathsRequest));

  await Promise.race([baseQueryIndex.pathsRequest, allRegionalPromises]);

  if (!baseQueryIndex.requestResolved) return null;

  const currentResolvedIndexes = matchingIndexes.filter((m) => m.requestResolved);

  if (currentResolvedIndexes.length > initialResolvedCount) {
    const foundInNewlyResolved = await urlInMatchingIndex(currentResolvedIndexes, sanitizedPath);
    if (foundInNewlyResolved) return true;
  }

  const urlExistsInBase = await urlInMatchingIndex(baseIndexMatches, sanitizedPath);
  return urlExistsInBase ? false : null;
}

export default async function urlInQueryIndex(
  urlPath,
  urlHostname,
  matchingIndexes,
  baseQueryIndex,
) {
  const sanitizedPath = urlPath.replace(/\.html$/, '');

  const allResolved = matchingIndexes.every((m) => m.requestResolved);
  if (allResolved) return urlInMatchingIndex(matchingIndexes, sanitizedPath);

  const resolvedIndexes = matchingIndexes.filter((m) => m.requestResolved);
  if (resolvedIndexes.length) {
    const foundInResolved = await urlInMatchingIndex(resolvedIndexes, sanitizedPath);
    if (foundInResolved) return true;
  }

  const earlyDecision = await tryEarlyDecisionUsingBaseIndex(
    matchingIndexes,
    sanitizedPath,
    urlHostname,
    resolvedIndexes.length,
    baseQueryIndex,
  );

  if (earlyDecision !== null) return earlyDecision;

  await Promise.all(matchingIndexes.map((m) => m.pathsRequest));
  return urlInMatchingIndex(matchingIndexes, sanitizedPath);
}
