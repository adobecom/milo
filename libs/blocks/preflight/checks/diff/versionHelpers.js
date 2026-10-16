export function parseMain(html) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.querySelector('main') || doc.body;
}

export function isConfirmedUnpublished(versions) {
  return versions.status != null && !versions.status.live?.lastModified;
}
