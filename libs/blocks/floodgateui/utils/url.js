export function isUrl(str) {
  try {
    const url = new URL(str);
    return url;
  } catch (error) {
    return undefined;
  }
}

export async function validateUrl(url) {
  try {
    const request = await fetch(url.href);
    return request;
  } catch (error) {
    return { ok: false, url: url.href };
  }
}

export function getUrl(url) {
  return Array.isArray(url) ? url[0] : url;
}
