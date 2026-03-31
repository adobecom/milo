async function urlInMatchingIndex(matchingIndexes, sanitizedPath) {
  return (await Promise.all(matchingIndexes.map((q) => q.pathsRequest)))
    .flat()
    .filter(Boolean)
    .includes(sanitizedPath);
}

async function tryEarlyDecisionUsingBaseIndex(
  matchingIndexes,
  regionalPath,
  basePath,
  urlHostname,
  initialResolvedCount,
  baseQueryIndex = {},
) {
  if (!baseQueryIndex?.pathsRequest || !baseQueryIndex.domains?.includes(urlHostname)) return null;

  await Promise.race([
    baseQueryIndex.pathsRequest,
    Promise.all(matchingIndexes.map((m) => m.pathsRequest)),
  ]);

  if (!baseQueryIndex.requestResolved) return null;

  const currentResolvedIndexes = matchingIndexes.filter((m) => m.requestResolved);

  if (currentResolvedIndexes.length > initialResolvedCount) {
    const foundInNewlyResolved = await urlInMatchingIndex(currentResolvedIndexes, regionalPath);
    if (foundInNewlyResolved) return true;
  }

  const urlExistsInBase = await urlInMatchingIndex([baseQueryIndex], basePath);
  return urlExistsInBase ? false : null;
}

async function urlInQueryIndex(
  regionalPath,
  basePath,
  urlHostname,
  matchingIndexes,
  baseQueryIndex,
  aTag,
) {
  const sanitizedPath = regionalPath.replace(/\.html$/, '');
  if (matchingIndexes.every((m) => m.requestResolved)) {
    return urlInMatchingIndex(matchingIndexes, sanitizedPath);
  }

  const resolvedIndexes = matchingIndexes.filter((m) => m.requestResolved);
  if (resolvedIndexes.length) {
    const foundInResolved = await urlInMatchingIndex(resolvedIndexes, sanitizedPath);
    if (foundInResolved) return true;
  }

  const sanitizedBasePath = basePath.replace(/\.html$/, '');

  if (regionalPath.includes('/fragments/') && aTag?.closest('.section')?.dataset.idx === '0') {
    fetch(sanitizedPath);
    fetch(sanitizedBasePath);
  }

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

function setLinkHref(a, prefix, rawPath) {
  const { origin, search, hash } = new URL(a.href);
  a.href = `${origin}${prefix}${rawPath}${search}${hash}`;
}

export async function resolveLingoPrefix(
  path,
  prefix,
  basePrefix,
  hostname,
  matchingIndexes,
  baseQueryIndex,
  aTag,
  { isMepLingo = false, domainInSiteMap = false, isBasePage = false } = {},
) {
  if (!matchingIndexes.length) {
    if (isMepLingo && !domainInSiteMap) return prefix;
    if (!domainInSiteMap) return isBasePage ? basePrefix : prefix;
    return basePrefix;
  }

  const useRegional = await urlInQueryIndex(
    `${prefix}${path}`,
    `${basePrefix}${path}`,
    hostname,
    matchingIndexes,
    baseQueryIndex,
    aTag,
  );
  return useRegional ? prefix : basePrefix;
}

export async function tryLocalizeLink(
  a,
  hostname,
  rawPath,
  basePrefix,
  regionalPrefix,
  isBasePage,
  allQueryIndexes,
  baseQueryIndex,
  isFinal,
) {
  if (!a.isConnected) return true;

  const indexes = allQueryIndexes
    .filter((q) => q.domains.includes(hostname) && q.requestResolved);

  if (!indexes.length) {
    if (isFinal) {
      const hasIndex = allQueryIndexes.some((q) => q.domains.includes(hostname));
      if (!hasIndex && !isBasePage && regionalPrefix !== basePrefix) {
        setLinkHref(a, regionalPrefix, rawPath);
      }
      return true;
    }
    return false;
  }

  const newPrefix = await resolveLingoPrefix(
    rawPath,
    regionalPrefix,
    basePrefix,
    hostname,
    indexes,
    baseQueryIndex,
    null,
  );

  if (!a.isConnected) return true;

  if (newPrefix !== basePrefix) {
    setLinkHref(a, newPrefix, rawPath);
    return true;
  }

  return isFinal;
}
