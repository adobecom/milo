import { html, signal, useEffect } from '../../../deps/htm-preact.js';

const wcsElements = signal([]);
const masFieldsMultipleFragmentWarnings = signal([]);
const loading = signal(true);

const ALLOWED_MAS_HOSTS = ['mas.adobe.com'];

function isMasUrl(href) {
  if (!href) return false;
  try {
    const url = new URL(href);
    return ALLOWED_MAS_HOSTS.includes(url.host);
  } catch {
    return false;
  }
}

function getFragmentIdFromMasElement(el) {
  if (el.tagName === 'MAS-FIELD') {
    const aem = el.querySelector('aem-fragment');
    return aem?.getAttribute('fragment') || null;
  }
  if (el.tagName === 'A' && isMasUrl(el.href)) {
    try {
      const { hash } = new URL(el.href);
      const sp = new URLSearchParams(hash?.slice(1) || '');
      return sp.get('query') || sp.get('fragment') || null;
    } catch {
      return null;
    }
  }
  return null;
}

const MAS_MULTIPLE_FRAGMENTS_HIGHLIGHT = 'preflight-mas-multiple-fragments';

function getBlockContaining(el, section) {
  const conBlock = el.closest('.con-block');
  if (conBlock && section.contains(conBlock)) return conBlock;
  let parent = el.parentElement;
  while (parent && parent !== section) {
    if (parent.parentElement === section) return parent;
    parent = parent.parentElement;
  }
  return null;
}

function getBlockLocation(element) {
  const rect = element.getBoundingClientRect();
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  return Math.round(rect.top + scrollTop);
}

function checkMasFieldsMultipleFragments() {
  const main = document.querySelector('main');
  main?.querySelectorAll(`.${MAS_MULTIPLE_FRAGMENTS_HIGHLIGHT}`).forEach((el) => el.classList.remove(MAS_MULTIPLE_FRAGMENTS_HIGHLIGHT));
  const sections = main?.querySelectorAll(':scope > div.section') || [];
  const warnings = [];
  sections.forEach((section, index) => {
    const masFieldEls = section.querySelectorAll('mas-field, a[href*="mas.adobe.com/studio.html"]');
    const sectionFragmentIds = new Set();
    const fragmentIdsByBlock = new Map();
    masFieldEls.forEach((el) => {
      const id = getFragmentIdFromMasElement(el);
      if (!id) return;
      sectionFragmentIds.add(id);
      const block = getBlockContaining(el, section) || section;
      if (!fragmentIdsByBlock.has(block)) fragmentIdsByBlock.set(block, new Set());
      fragmentIdsByBlock.get(block).add(id);
    });
    if (sectionFragmentIds.size <= 1) return;
    fragmentIdsByBlock.forEach((fragmentIds, block) => {
      if (fragmentIds.size > 1) {
        if (block !== section) block.classList.add(MAS_MULTIPLE_FRAGMENTS_HIGHLIGHT);
        warnings.push({
          sectionIndex: index + 1,
          section,
          fragmentIds: [...fragmentIds],
          location: getBlockLocation(block),
        });
      }
    });
    if (warnings.filter((w) => w.section === section).length === 0) {
      const firstBlock = fragmentIdsByBlock.keys().next().value;
      warnings.push({
        sectionIndex: index + 1,
        section,
        fragmentIds: [...sectionFragmentIds],
        location: getBlockLocation(firstBlock),
      });
    }
  });
  masFieldsMultipleFragmentWarnings.value = warnings;
}

function getService() {
  return document.getElementsByTagName('mas-commerce-service')?.[0];
}

function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  });
}

function selectOffers(offers, { country }) {
  let selected;
  if (offers.length < 2) {
    selected = offers;
  } else {
    const language = country === 'GB' ? 'EN' : 'MULT';
    offers.sort((a, b) => {
      if (a.language === language) return -1;
      if (b.language === language) return 1;
      return 0;
    });
    offers.sort((a, b) => {
      if (!a.term && b.term) return -1;
      if (a.term && !b.term) return 1;
      return 0;
    });
    selected = [offers[0]];
  }
  return selected;
}

function isPromotionActive(promotion, instant, quantity = 1) {
  if (!promotion) return false;
  const {
    start,
    end,
    displaySummary: {
      amount,
      duration,
      minProductQuantity = 1,
      outcomeType,
    } = {},
  } = promotion;
  if (!(amount && duration && outcomeType)) {
    return false;
  }
  if (quantity < minProductQuantity) {
    return false;
  }
  const now = instant ? new Date(instant) : new Date();
  if (!start || !end) {
    return false;
  }

  const startDate = new Date(start);
  const endDate = new Date(end);

  return now >= startDate && now <= endDate;
}

async function checkUrl(url) {
  try {
    const response = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
    });

    const finalUrl = response.url;
    const hasError = finalUrl.toLowerCase().includes('error');

    const originalParams = new URLSearchParams(new URL(url).search);
    const finalParams = new URLSearchParams(new URL(finalUrl).search);

    const originalId = originalParams.get('items[0][id]');
    const finalId = finalParams.get('items[0][id]');

    const idMismatch = originalId && finalId && originalId !== finalId;

    const result = {
      status: (hasError || idMismatch) ? 'error' : 'success',
      finalUrl,
      idMismatch,
      originalId,
      finalId,
    };

    return result;
  } catch (error) {
    if (error.message === 'Failed to fetch') {
      return {
        status: 'success',
        finalUrl: url,
        idMismatch: false,
      };
    }
    return {
      status: 'undetermined',
      finalUrl: url,
      idMismatch: false,
      errorMessage: error.message,
    };
  }
}

async function checkWcsElements() {
  const elements = [];

  const allWcsElements = document.querySelectorAll('[data-wcs-osi]');

  for (const elem of allWcsElements) {
    const hasDisabledChild = elem.querySelector('[disabled], .disabled');
    const textContent = elem.textContent?.trim();

    if (!(hasDisabledChild && !textContent)) {
      const wcsOsi = elem.getAttribute('data-wcs-osi');
      const tagName = elem.tagName.toLowerCase();
      const href = elem.getAttribute('href');
      const ariaLabel = elem.getAttribute('aria-label');
      const displayText = ariaLabel || textContent || `<${tagName}> element`;
      const promoCode = elem.getAttribute('data-promotion-code');

      const elementData = {
        type: tagName,
        displayText,
        element: elem,
        wcsOsi,
        location: getBlockLocation(elem),
        href,
        urlStatus: null,
        finalUrl: null,
        checking: false,
        promoCode,
        promoCodeStatus: null,
      };

      elements.push(elementData);
    }
  }

  wcsElements.value = elements;
  loading.value = false;

  elements.forEach(async (elementData, index) => {
    if (elementData.href) {
      wcsElements.value[index].checking = true;
      wcsElements.value = [...wcsElements.value];

      const result = await checkUrl(elementData.href);
      wcsElements.value[index].urlStatus = result.status;
      wcsElements.value[index].finalUrl = result.finalUrl;
      wcsElements.value[index].idMismatch = result.idMismatch;
      wcsElements.value[index].originalId = result.originalId;
      wcsElements.value[index].finalId = result.finalId;
      wcsElements.value[index].checking = false;
      wcsElements.value = [...wcsElements.value];

      if (result.status === 'error' || result.status === 'undetermined') {
        elementData.element.classList.add('preflight-merch-error');
      } else {
        elementData.element.classList.remove('preflight-merch-error');
      }
    }
  });

  const service = getService();
  if (service) {
    elements.forEach(async (elementData, index) => {
      if (elementData.promoCode) {
        try {
          const quantity = parseInt(elementData.element.getAttribute('data-quantity'), 10) || 1;
          const country = elementData.element.getAttribute('data-ims-country') || service.settings.country;
          const language = elementData.element.getAttribute('data-language') || service.settings.language;

          const options = {
            country,
            language,
            promotionCode: elementData.promoCode,
            wcsOsi: [elementData.wcsOsi],
            quantity: [quantity],
          };

          const promises = service.resolveOfferSelectors(options);
          let offers = await Promise.all(promises);
          offers = offers.map((offer) => selectOffers(offer, options));
          const offerWithPromo = offers.flat().find((offer) => offer.promotion);

          if (offerWithPromo?.promotion) {
            const { promotion } = offerWithPromo;
            const isActive = isPromotionActive(
              promotion,
              promotion?.displaySummary?.instant,
              quantity,
            );

            wcsElements.value[index].promoCodeStatus = isActive ? 'valid' : 'expired';
            wcsElements.value[index].promoStartDate = promotion.start;
            wcsElements.value[index].promoEndDate = promotion.end;
            if (!isActive) {
              wcsElements.value[index].promoExpired = true;
              elementData.element.classList.add('preflight-merch-error');
            }
          } else {
            wcsElements.value[index].promoCodeStatus = 'not-found';
            wcsElements.value[index].promoExpired = true;
            elementData.element.classList.add('preflight-merch-error');
          }
          wcsElements.value = [...wcsElements.value];
        } catch {
          wcsElements.value[index].promoCodeStatus = 'not-found';
          wcsElements.value[index].promoExpired = true;
          elementData.element.classList.add('preflight-merch-error');
          wcsElements.value = [...wcsElements.value];
        }
      }
    });
  }
}

function scrollToElement(location) {
  window.scrollTo({
    top: location - 100,
    behavior: 'smooth',
  });
}

function WcsElementItem({ wcsElem }) {
  let statusIconClass = '';
  if (wcsElem.checking) {
    statusIconClass = 'result-icon purple';
  } else if (wcsElem.urlStatus === 'error' || wcsElem.promoCodeStatus === 'expired' || wcsElem.promoCodeStatus === 'not-found') {
    statusIconClass = 'result-icon red';
  } else if (wcsElem.urlStatus === 'undetermined') {
    statusIconClass = 'result-icon orange';
  } else if (wcsElem.urlStatus === 'success' || wcsElem.promoCodeStatus === 'valid') {
    statusIconClass = 'result-icon green';
  }
  const showUrlInfo = wcsElem.href;

  return html`
    <div class="preflight-item merch-item merch-wcs-item ${(wcsElem.urlStatus === 'error' || wcsElem.urlStatus === 'undetermined' || wcsElem.promoCodeStatus === 'expired' || wcsElem.promoCodeStatus === 'not-found') ? 'has-url-error' : ''}">
      <div class="preflight-item-text">
        <p class="preflight-item-title">
          ${statusIconClass && html`<span class="${statusIconClass}"></span>`}
          ${wcsElem.displayText}
        </p>
        <p class="preflight-item-description">
          <strong>WCS OSI:</strong> <code class="wcs-osi-code">${wcsElem.wcsOsi}</code>
          ${wcsElem.promoCode && html`
            <br/><br/>
            <strong>Promotion Code:</strong> <code class="wcs-osi-code">${wcsElem.promoCode}</code>
            ${wcsElem.promoEndDate && html`
              <br/><strong>Expires:</strong> ${formatDate(wcsElem.promoEndDate)}
            `}
            ${wcsElem.promoStartDate && html`
              <br/><strong>Starts:</strong> ${formatDate(wcsElem.promoStartDate)}
            `}
            ${wcsElem.promoCodeStatus && !wcsElem.promoEndDate && html`
              <br/><strong>Dates:</strong> <span class="url-error-message">No dates found</span>
            `}
            ${wcsElem.promoCodeStatus === 'expired' && html`
              <br/><span class="url-error-message">Promotion is expired or not active</span>
            `}
            ${wcsElem.promoCodeStatus === 'not-found' && html`
              <br/><span class="url-error-message">Promotion not found for this code</span>
            `}
            ${wcsElem.promoCodeStatus === 'valid' && html`
              <br/><span class="url-success">Promotion is active</span>
            `}
          `}
          ${showUrlInfo && html`
            <br/><br/>
            <strong>Original URL: </strong> ${wcsElem.href}
            ${wcsElem.checking && html`<br/><span class="url-checking">Checking URL...</span>`}
            ${wcsElem.finalUrl && html`
              <br/><strong>Final URL: </strong>
              <span class="${wcsElem.urlStatus === 'error' ? 'url-error' : 'url-success'}">
                ${wcsElem.finalUrl}
              </span>
            `}
            ${wcsElem.idMismatch && html`
              <br/><span class="url-error-message">items[0][id] parameter mismatch!</span>
              <br/><span class="id-comparison">
                Original ID: <code class="wcs-osi-code">${wcsElem.originalId}</code>
                → Final ID: <code class="wcs-osi-code">${wcsElem.finalId}</code>
              </span>
            `}
            ${wcsElem.urlStatus === 'error' && !wcsElem.idMismatch && html`
              <br/><span class="url-error-message">URL contains "error" or failed to load</span>
            `}
            ${wcsElem.urlStatus === 'undetermined' && html`
              <br/><span class="url-error-message">Check URL, status is undetermined</span>
            `}
          `}
        </p>
        <button
          class="preflight-action merch-scroll-btn"
          onclick=${() => scrollToElement(wcsElem.location)}>
          Scroll to element
        </button>
      </div>
    </div>
  `;
}

function MasFieldsMultipleFragmentItem({ warning }) {
  return html`
    <div class="preflight-item merch-item mas-fields-warning-item">
      <div class="preflight-item-text">
        <p class="preflight-item-title">
          <span class="result-icon orange"></span>
          Block ${warning.sectionIndex} has multiple M@S fragment IDs
        </p>
        <p class="preflight-item-description">
          Usually all M@S fields in a block should use the same fragment.
          <br/><strong>Fragment IDs in this block:</strong>
          <code class="wcs-osi-code">${warning.fragmentIds.join(', ')}</code>
        </p>
        <button
          class="preflight-action merch-scroll-btn"
          onclick=${() => scrollToElement(warning.location)}>
          Scroll to block
        </button>
      </div>
    </div>
  `;
}

function MasFieldsMultipleFragmentSection() {
  const warnings = masFieldsMultipleFragmentWarnings.value;
  if (warnings.length === 0) return null;
  return html`
    <div class="merch-section">
      <h3 class="merch-section-title">M@S Fields</h3>
      <p class="merch-section-description">Blocks with more than one fragment ID (fields should usually share the same fragment).</p>
      <div class="merch-blocks-list">
        ${warnings.map((w) => html`<${MasFieldsMultipleFragmentItem} warning=${w} />`)}
      </div>
    </div>
  `;
}

function MerchSummary() {
  const totalElements = wcsElements.value.length;
  const passedCount = wcsElements.value.filter((elem) => (elem.urlStatus === 'success' || !elem.href)
    && (!elem.promoCode || elem.promoCodeStatus === 'valid')).length;
  const failedCount = wcsElements.value.filter((elem) => elem.urlStatus === 'error'
    || elem.promoCodeStatus === 'expired'
    || elem.promoCodeStatus === 'not-found').length;
  const undeterminedCount = wcsElements.value.filter((elem) => elem.urlStatus === 'undetermined').length;
  const masWarningsCount = masFieldsMultipleFragmentWarnings.value.length;

  if (totalElements === 0 && masWarningsCount === 0) {
    return html`
      <div class="merch-summary no-blocks">
        <h3>No Merch Elements Found</h3>
        <p>This page does not contain any elements with the <code>data-wcs-osi</code> attribute.</p>
      </div>
    `;
  }

  return html`
    <div class="merch-summary">
      ${totalElements > 0 && html`
        <div class="merch-summary-stat">
          <span class="merch-stat-number">${totalElements}</span>
          <span class="merch-stat-label">Merch Elements</span>
        </div>
        <div class="merch-summary-stat">
          <span class="merch-stat-number">${passedCount}</span>
          <span class="merch-stat-label">Passed</span>
        </div>
        <div class="merch-summary-stat ${failedCount > 0 ? 'has-errors' : ''}">
          <span class="merch-stat-number">${failedCount}</span>
          <span class="merch-stat-label">Failed</span>
        </div>
        <div class="merch-summary-stat ${undeterminedCount > 0 ? 'has-warnings' : ''}">
          <span class="merch-stat-number">${undeterminedCount}</span>
          <span class="merch-stat-label">Undetermined</span>
        </div>
      `}
      ${masWarningsCount > 0 && html`
        <div class="merch-summary-stat has-warnings">
          <span class="merch-stat-number">${masWarningsCount}</span>
          <span class="merch-stat-label">Blocks w/ multiple fragment IDs</span>
        </div>
      `}
    </div>
  `;
}

export default function Merch() {
  useEffect(() => {
    checkMasFieldsMultipleFragments();
    setTimeout(() => {
      checkWcsElements();
    }, 3000);
  }, []);

  if (loading.value) {
    return html`
      <div class="merch-panel">
        <p class="merch-loading">Loading merch content...</p>
      </div>
    `;
  }

  if (wcsElements.value.length === 0) {
    return html`
      <div class="merch-panel">
        <${MerchSummary} />
        <${MasFieldsMultipleFragmentSection} />
      </div>
    `;
  }

  return html`
    <div class="merch-panel">
      <${MerchSummary} />
      <${MasFieldsMultipleFragmentSection} />
      <div class="merch-section">
        <h3 class="merch-section-title">Elements</h3>
        <div class="merch-blocks-list">
          ${wcsElements.value.map((elem) => html`<${WcsElementItem} wcsElem=${elem} />`)}
        </div>
      </div>
    </div>
  `;
}
