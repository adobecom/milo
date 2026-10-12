// Only populated when MEP preview is active; WeakMap so entries
// GC with their host element.
// eslint-disable-next-line import/prefer-default-export
export const mepMasStudioUrls = new WeakMap();

// Viewport inheritance can clone hydrated fields; keep preview metadata without
// making the shared decoration module depend on MEP.
document.addEventListener('mep:content-cloned', ({ detail: { source, clone } }) => {
  const originals = [source, ...source.querySelectorAll('mas-field, [data-mas-block]')];
  const copies = [clone, ...clone.querySelectorAll('mas-field, [data-mas-block]')];
  originals.forEach((original, index) => {
    const studioUrl = mepMasStudioUrls.get(original);
    if (studioUrl) mepMasStudioUrls.set(copies[index], studioUrl);
  });
});
