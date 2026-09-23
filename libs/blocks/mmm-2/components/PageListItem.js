import { html, useState, useRef, useEffect } from '../../../deps/htm-preact.js';
import { fetchData, DATA_TYPE } from '../../../features/personalization/personalization.js';
// TEMP: pinned to legacy preview.js for the ?mepnext fallback (see mmm.js for context).
import { getMepPopup, API_URLS } from '../../../features/personalization/preview.js';

/**
 * A single expandable page row. Fetches and renders the manifest-details popup
 * (existing getMepPopup DOM-building utility, reused as-is) the first time it's
 * expanded, then keeps it mounted for subsequent toggles.
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
      setPopupEl(await getMepPopup(pageData, true));
    }).finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expanded]);

  useEffect(() => {
    if (popupEl && contentRef.current) {
      contentRef.current.innerHTML = '';
      contentRef.current.append(popupEl);
    }
  }, [popupEl]);

  return html`
    <div class="mmm2-page-item">
      <button
        type="button"
        class="mmm2-page-trigger"
        aria-expanded=${expanded}
        onClick=${() => setExpanded(!expanded)}
      >
        <span class="mmm2-page-icon ${expanded ? 'is-expanded' : ''}"></span>
        <h5 class="mmm2-page-heading">
          <a href=${page.url} target="_blank" rel="noopener" onClick=${(e) => e.stopPropagation()}>${page.url}</a>
        </h5>
        <span class="mmm2-page-subtext">${page.numOfActivities} Manifest(s) found</span>
      </button>
      ${expanded ? html`
        <div class="mmm2-page-detail">
          ${(loading && !popupEl) ? html`<div class="mmm2-loading">Loading…</div>` : html`<div ref=${contentRef}></div>`}
        </div>
      ` : null}
    </div>
  `;
}

export default PageListItem;
