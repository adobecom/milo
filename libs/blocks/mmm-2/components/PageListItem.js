import { html, useState, useRef, useEffect, useLayoutEffect } from '../../../deps/htm-preact.js';
import { fetchData, DATA_TYPE } from '../../../features/personalization/personalization.js';
import { getMepPopup, API_URLS } from '../../../features/mep/mep-next/mep-next.js';

const MANIFEST_SKELETON_WIDTHS = ['60%', '45%', '52%'];

// Mirrors the real getMepPopup() card shape (tabs + "Manifests" list) it's standing in
// for, so the layout doesn't jump once the fetch resolves.
function ManifestCardSkeleton() {
  return html`
    <div class="mmm2-skeleton-card">
      <div class="mmm2-skeleton-tabs">
        <span class="mmm2-skeleton mmm2-skeleton-text" style=${{ width: '56px' }}></span>
        <span class="mmm2-skeleton mmm2-skeleton-text" style=${{ width: '68px' }}></span>
      </div>
      <div class="mmm2-skeleton-body">
        <span class="mmm2-skeleton mmm2-skeleton-heading" style=${{ width: '110px' }}></span>
        ${MANIFEST_SKELETON_WIDTHS.map((width, i) => html`
          <div class="mmm2-skeleton-manifest" key=${i}>
            <span class="mmm2-skeleton mmm2-skeleton-heading" style=${{ width }}></span>
            <span class="mmm2-skeleton mmm2-skeleton-block"></span>
          </div>
        `)}
      </div>
    </div>
  `;
}

/**
 * A single expandable page row. Fetches and renders the manifest-details popup
 * (existing getMepPopup DOM-building utility, reused as-is) the first time it's
 * expanded, then caches it for subsequent toggles.
 */
function PageListItem({ page, lastSeenManifest, manifestSrc }) {
  const [expanded, setExpanded] = useState(false);
  const [popupEl, setPopupEl] = useState(null);
  const [loading, setLoading] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    if (!expanded || popupEl || loading) return;
    setLoading(true);
    fetchData(
      `${API_URLS.pageDetails}?id=${page.pageId}&lastSeen=${lastSeenManifest}&manifestSrc=${manifestSrc}`,
      DATA_TYPE.JSON,
    ).then(async (pageData) => {
      if (!pageData) return;
      setPopupEl(await getMepPopup(pageData));
    }).finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expanded]);

  useLayoutEffect(() => {
    // `expanded` is also a dep (not just `popupEl`): collapsing unmounts the
    // ref'd div entirely, so re-expanding mounts a brand-new one - without
    // `expanded` here, this wouldn't rerun to re-attach the (unchanged) popupEl
    // into that new node, leaving it empty.
    if (popupEl && contentRef.current) {
      contentRef.current.innerHTML = '';
      contentRef.current.append(popupEl);
    }
  }, [popupEl, expanded]);

  return html`
    <div class="mmm2-page-item ${expanded ? 'is-expanded' : ''}">
      <button
        type="button"
        class="mmm2-page-trigger"
        aria-expanded=${expanded}
        onClick=${() => setExpanded(!expanded)}
      >
        <span class="mmm2-page-icon ${expanded ? 'is-expanded' : ''}"></span>
        <h5 class="mmm2-page-heading">
          <a class="mmm2-primary-link" href=${page.url} target="_blank" rel="noopener" onClick=${(e) => e.stopPropagation()}>${page.url}</a>
        </h5>
        <span class="mmm2-page-subtext">${page.numOfActivities} Manifest(s) found</span>
      </button>
      ${expanded ? html`
        <div class="mmm2-page-detail">
          ${(loading && !popupEl) ? html`<${ManifestCardSkeleton} />` : html`<div class="mmm2-page-detail-container" ref=${contentRef}></div>`}
        </div>
      ` : null}
    </div>
  `;
}

export default PageListItem;
