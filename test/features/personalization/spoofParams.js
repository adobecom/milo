export default function spoofParams(params) {
  const url = new URL(window.location);
  for (const [key, value] of Object.entries(params)) {
    if (value === false) {
      url.searchParams.delete(key);
      return;
    }
    url.searchParams.set(key, value);
  }
  window.history.pushState({}, '', url);
}
