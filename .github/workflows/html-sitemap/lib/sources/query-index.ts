import { fetchJson } from '../util/fetch.ts';
import { getErrorMessage } from '../util/stage.ts';

type QueryIndexJson = {
  total?: number;
  offset?: number;
  limit?: number;
  data?: unknown[];
  [key: string]: unknown;
};

function withGeoPrefix(geo: string, resourcePath: string): string {
  const prefix = geo ? `/${geo}` : '';
  return `${prefix}${resourcePath}`;
}

function getPageUrl(baseUrl: string, offset: number): string {
  const url = new URL(baseUrl);
  url.searchParams.set('offset', String(offset));
  return url.toString();
}

function isPagedQueryIndexJson(value: unknown): value is QueryIndexJson & { data: unknown[] } {
  return Boolean(value) && typeof value === 'object' && Array.isArray((value as QueryIndexJson).data);
}

async function fetchQueryIndexPage(
  url: string,
  fetchImpl?: typeof fetch,
): Promise<
  | { ok: false; status: number; statusText: string; url: string }
  | { ok: true; url: string; json: unknown }
> {
  const response = await fetchJson(url, {}, { fetchImpl });

  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      statusText: response.statusText,
      url,
    };
  }

  try {
    return {
      ok: true,
      url,
      json: await response.json(),
    };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      statusText: getErrorMessage(error),
      url,
    };
  }
}

export async function fetchQueryIndex(
  { site, geo, queryIndexPath, fetchImpl }: { site: string; geo: string; queryIndexPath: string; fetchImpl?: typeof fetch },
): Promise<
  | { ok: false; status: number; statusText: string; url: string }
  | { ok: true; url: string; json: unknown; rowCount: number }
> {
  const origin = `https://main--${site}--adobecom.aem.live`;
  const url = `${origin}${withGeoPrefix(geo, queryIndexPath)}`;
  const firstPage = await fetchQueryIndexPage(url, fetchImpl);

  if (!firstPage.ok) {
    return firstPage;
  }

  const { json } = firstPage;
  if (!isPagedQueryIndexJson(json)) {
    return {
      ok: true,
      url,
      json,
      rowCount: 0,
    };
  }

  const mergedData = [...json.data];
  const merged: QueryIndexJson = {
    ...json,
    data: mergedData,
  };
  const total = typeof json.total === 'number' ? json.total : mergedData.length;
  const pageSize = typeof json.limit === 'number' && json.limit > 0 ? json.limit : mergedData.length;
  let nextOffset = typeof json.offset === 'number' ? json.offset + mergedData.length : mergedData.length;

  while (pageSize > 0 && mergedData.length < total) {
    const page = await fetchQueryIndexPage(getPageUrl(url, nextOffset), fetchImpl);
    if (!page.ok) {
      return page;
    }

    if (!isPagedQueryIndexJson(page.json)) {
      break;
    }

    mergedData.push(...page.json.data);
    nextOffset += page.json.data.length || pageSize;

    if (page.json.data.length === 0) {
      break;
    }
  }

  return {
    ok: true,
    url,
    json: merged,
    rowCount: mergedData.length,
  };
}
