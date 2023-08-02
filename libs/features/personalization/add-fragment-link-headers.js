export default async function addFragmentLinkHeaders(fragment, a) {
  if (!a.dataset.manifestId) return;
  fragment.dataset.manifestId = a.dataset.manifestId;
  const manifestPrefix = a.dataset.manifestId.split(' ')[0];
  if (!manifestPrefix.includes('.json')) {
    let daaLh = a.getAttribute('daa-lh');
    if (daaLh) {
      daaLh = `${manifestPrefix} ${daaLh}`;
    } else {
      daaLh = manifestPrefix;
    }
    fragment.setAttribute('daa-lh', daaLh);
  }
}
