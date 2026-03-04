async function urlInMatchingIndex(matchingIndexes, sanitizedPath) {
  const pathArrays = await Promise.all(matchingIndexes.map((q) => q.pathsRequest));
  const arr = pathArrays.flat().filter(Boolean);
  return arr.includes(sanitizedPath);
}

async function findMatchingIndex(matchingIndexes, sanitizedPath) {
  const pathArrays = await Promise.all(matchingIndexes.map((q) => q.pathsRequest));
  const idx = pathArrays.findIndex((paths) => Array.isArray(paths) && paths.includes(sanitizedPath));
  return idx >= 0 ? matchingIndexes[idx] : null;
}

async function tryEarlyDecisionUsingBaseIndex(
  matchingIndexes,
  regionalPath,
  basePath,
  urlHostname,
  initialResolvedCount,
  baseQueryIndex = {},
) {
  if (!baseQueryIndex?.pathsRequest || !baseQueryIndex.domains?.includes(urlHostname)) return { decision: null };

  await Promise.race([
    baseQueryIndex.pathsRequest,
    Promise.all(matchingIndexes.map((m) => m.pathsRequest)),
  ]);

  if (!baseQueryIndex.requestResolved) return { decision: null };

  const currentResolvedIndexes = matchingIndexes.filter((m) => m.requestResolved);

  if (currentResolvedIndexes.length > initialResolvedCount) {
    const matchedIndex = await findMatchingIndex(currentResolvedIndexes, regionalPath);
    if (matchedIndex) return { decision: true, matchedIndex };
  }

  const urlExistsInBase = await urlInMatchingIndex([baseQueryIndex], basePath);
  return urlExistsInBase ? { decision: false, matchedIndex: baseQueryIndex } : { decision: null };
}

function isPrimaryIndex(matchedIndex, primaryIndexes) {
  return primaryIndexes?.length && matchedIndex && primaryIndexes.includes(matchedIndex);
}

async function pathFoundInPrimaryIndex(sanitizedPath, sanitizedBasePath, primaryIndexes) {
  if (!primaryIndexes?.length) return false;
  const primaryPathArrays = await Promise.all(primaryIndexes.map((q) => q.pathsRequest));
  const inPrimaryRegional = primaryPathArrays.some(
    (arr) => Array.isArray(arr) && arr.includes(sanitizedPath),
  );
  if (inPrimaryRegional) return true;
  if (sanitizedBasePath && sanitizedBasePath !== sanitizedPath) {
    const baseInPrimary = primaryPathArrays.some(
      (arr) => Array.isArray(arr) && arr.includes(sanitizedBasePath),
    );
    return baseInPrimary;
  }
  return false;
}

export default async function urlInQueryIndex(
  regionalPath,
  basePath,
  urlHostname,
  matchingIndexes,
  baseQueryIndex,
  aTag,
  primaryIndexes = [],
) {
  const sanitizedPath = regionalPath.replace(/\.html$/, '');
  const sanitizedBasePath = basePath.replace(/\.html$/, '');
  const prim = primaryIndexes;

  if (matchingIndexes.every((m) => m.requestResolved)) {
    const found = await urlInMatchingIndex(matchingIndexes, sanitizedPath);
    if (!found) {
      const inPrimary = await pathFoundInPrimaryIndex(sanitizedPath, sanitizedBasePath, prim);
      let source = null;
      if (inPrimary) source = 'primary';
      else if (await urlInMatchingIndex(matchingIndexes, sanitizedBasePath)) source = 'other';
      return { useRegionalPrefix: false, source };
    }
    const inPrimaryForFound = await pathFoundInPrimaryIndex(sanitizedPath, sanitizedBasePath, prim);
    const source = inPrimaryForFound ? 'primary' : 'other';
    return { useRegionalPrefix: true, source };
  }

  const resolvedIndexes = matchingIndexes.filter((m) => m.requestResolved);
  if (resolvedIndexes.length) {
    const foundInResolved = await urlInMatchingIndex(resolvedIndexes, sanitizedPath);
    if (foundInResolved) {
      const source = (await pathFoundInPrimaryIndex(sanitizedPath, sanitizedBasePath, prim)) ? 'primary' : 'other';
      return { useRegionalPrefix: true, source };
    }
  }

  if (regionalPath.includes('/fragments/') && aTag?.closest('.section')?.dataset.idx === '0') {
    fetch(sanitizedPath);
    fetch(sanitizedBasePath);
  }

  const earlyResult = await tryEarlyDecisionUsingBaseIndex(
    matchingIndexes,
    sanitizedPath,
    sanitizedBasePath,
    urlHostname,
    resolvedIndexes.length,
    baseQueryIndex,
  );

  if (earlyResult.decision !== null) {
    const fromPrimary = isPrimaryIndex(earlyResult.matchedIndex, prim)
      || (await pathFoundInPrimaryIndex(sanitizedPath, sanitizedBasePath, prim));
    const source = fromPrimary ? 'primary' : 'other';
    return { useRegionalPrefix: earlyResult.decision, source };
  }

  await Promise.all(matchingIndexes.map((m) => m.pathsRequest));
  const found = await urlInMatchingIndex(matchingIndexes, sanitizedPath);
  if (!found) {
    const inPrimary = await pathFoundInPrimaryIndex(sanitizedPath, sanitizedBasePath, prim);
    let source = null;
    if (inPrimary) source = 'primary';
    else if (await urlInMatchingIndex(matchingIndexes, sanitizedBasePath)) source = 'other';
    return { useRegionalPrefix: false, source };
  }
  const inPrimary = await pathFoundInPrimaryIndex(sanitizedPath, sanitizedBasePath, prim);
  const source = inPrimary ? 'primary' : 'other';
  return { useRegionalPrefix: true, source };
}
