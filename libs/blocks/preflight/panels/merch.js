import { html, signal, useEffect } from '../../../deps/htm-preact.js';

const wcsElements = signal([]);
const loading = signal(true);

async function checkWcsElements() {
  const elements = [];

  // Check for elements with data-wcs-osi attribute
  const allWcsElements = document.querySelectorAll('[data-wcs-osi]');
  
  for (const elem of allWcsElements) {
    const wcsOsi = elem.getAttribute('data-wcs-osi');
    const tagName = elem.tagName.toLowerCase();
    const href = elem.getAttribute('href');
    const ariaLabel = elem.getAttribute('aria-label');
    const textContent = elem.textContent?.trim();
    const displayText = ariaLabel || textContent || `<${tagName}> element`;
    
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
    };
    
    elements.push(elementData);
  }

  wcsElements.value = elements;
  loading.value = false;

  // Now check URLs asynchronously
  elements.forEach(async (elementData, index) => {
    if (elementData.href) {
      wcsElements.value[index].checking = true;
      wcsElements.value = [...wcsElements.value];
      
      const result = await checkUrl(elementData.href);
      wcsElements.value[index].urlStatus = result.status;
      wcsElements.value[index].finalUrl = result.finalUrl;
      wcsElements.value[index].checking = false;
      wcsElements.value = [...wcsElements.value];
      
      // Highlight error elements with red outline
      if (result.status === 'error') {
        elementData.element.classList.add('preflight-merch-error');
      } else {
        elementData.element.classList.remove('preflight-merch-error');
      }
    }
  });
}

async function checkUrl(url) {
  try {
    const response = await fetch(url, { 
      method: 'HEAD',
      redirect: 'follow',
    });
    
    const finalUrl = response.url;
    const hasError = finalUrl.toLowerCase().includes('error');
    
    return {
      status: hasError ? 'error' : 'success',
      finalUrl,
    };
  } catch (error) {
    return {
      status: 'error',
      finalUrl: url,
    };
  }
}

function getBlockLocation(element) {
  const rect = element.getBoundingClientRect();
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  return Math.round(rect.top + scrollTop);
}

function scrollToElement(location) {
  window.scrollTo({
    top: location - 100,
    behavior: 'smooth',
  });
}

function WcsElementItem({ wcsElem }) {
  const statusIconClass = wcsElem.urlStatus === 'error' ? 'result-icon red' : wcsElem.urlStatus === 'success' ? 'result-icon green' : '';
  const showUrlInfo = wcsElem.href;
  
  return html`
    <div class="preflight-item merch-item merch-wcs-item ${wcsElem.urlStatus === 'error' ? 'has-url-error' : ''}">
      <div class="preflight-item-text">
        <p class="preflight-item-title">
          ${statusIconClass && html`<span class="${statusIconClass}"></span>`}
          ${wcsElem.displayText}
        </p>
        <p class="preflight-item-description">
          <strong>WCS OSI:</strong> <code class="wcs-osi-code">${wcsElem.wcsOsi}</code>
          ${showUrlInfo && html`
            <br/><br/>
            <strong>Original URL: </strong> ${wcsElem.href}
            ${wcsElem.checking && html`<br/><span class="url-checking">hecking URL...</span>`}
            ${wcsElem.finalUrl && html`
              <br/><strong>Final URL: </strong> 
              <span class="${wcsElem.urlStatus === 'error' ? 'url-error' : 'url-success'}">
                ${wcsElem.finalUrl}
              </span>
            `}
            ${wcsElem.urlStatus === 'error' && html`
              <br/><span class="url-error-message">URL contains "error" or failed to load</span>
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

function MerchSummary() {
  const totalElements = wcsElements.value.length;
  const passedCount = wcsElements.value.filter((elem) => elem.urlStatus === 'success').length;
  const failedCount = wcsElements.value.filter((elem) => elem.urlStatus === 'error').length;

  if (totalElements === 0) {
    return html`
      <div class="merch-summary no-blocks">
        <h3>No Merch Elements Found</h3>
        <p>This page does not contain any elements with the <code>data-wcs-osi</code> attribute.</p>
      </div>
    `;
  }

  return html`
    <div class="merch-summary">
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
    </div>
  `;
}

export default function Merch() {
  useEffect(() => {
    setTimeout(() => {
      checkWcsElements();
    }, 1000);
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
      </div>
    `;
  }

  return html`
    <div class="merch-panel">
      <${MerchSummary} />
      <div class="merch-section">
        <h3 class="merch-section-title">Elements</h3>
        <div class="merch-blocks-list">
          ${wcsElements.value.map((elem) => html`<${WcsElementItem} wcsElem=${elem} />`)}
        </div>
      </div>
    </div>
  `;
}

