export default function isUrl(str) {
  try {
    const url = new URL(str);
    return url;
  } catch (error) {
    return false;
  }
}

export function getUrl(url) {
  return Array.isArray(url) ? url[0] : url;
}
