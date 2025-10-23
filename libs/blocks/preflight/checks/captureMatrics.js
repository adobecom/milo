import { getConfig } from '../../../utils/utils.js';

const getLogsEndpoint = () => {
  const currentUrl = window.location.href.toLowerCase();

  if (currentUrl.includes('preflightlogs=local')) {
    return 'http://localhost:8080/preflight-logs';
  }
  if (currentUrl.includes('preflightlogs=stage')) {
    return 'https://milo-core-stage.adobe.io/preflight-logs';
  }
  return 'https://milo-core-prod.adobe.io/preflight-logs';
};

let hasSentPreflightMetrics = false;
let sendPreflightMetricsPromise = null;

const capture = async (results) => {
  if (hasSentPreflightMetrics) return;
  if (sendPreflightMetricsPromise) return;

  sendPreflightMetricsPromise = (async () => {
    const token = window.adobeIMS?.getAccessToken?.()?.token;
    const config = getConfig();
    const { imsClientId } = config;
    const endpoint = getLogsEndpoint();
    const isLocal = endpoint.startsWith('http://localhost:');
    if (!isLocal && (!token || !imsClientId)) return;

    let profile = { email: '' };
    if (!isLocal && token && window.adobeIMS?.getProfile) {
      try {
        profile = await window.adobeIMS.getProfile();
      } catch (error) {
        // Non-blocking outside local; reduce noise in console
        console.debug('IMS profile fetch failed; continuing without profile data');
      }
    }

    const contextData = {
      email: profile.email || '',
      url: window.location.href,
      project_key: window.location.hostname.split('--')[1] || imsClientId,
      window_width: window.innerWidth,
      window_height: window.innerHeight,
      performance_lcp: 0,
      performance_fcp: 0,
      performance_ttfb: 0,
      performance_cls: 0,
    };

    contextData.performance_fcp = window.performance.getEntriesByType('paint')
      .find((entry) => entry.name === 'first-contentful-paint')?.startTime;

    contextData.performance_ttfb = window.performance.getEntriesByType('navigation')[0]?.responseStart;

    await new Promise((resolve) => {
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        contextData.performance_cls = entries.reduce((sum, entry) => sum + entry.value, 0);
        resolve(entries);
      }).observe({ type: 'layout-shift', buffered: true });
    });

    await new Promise((resolve) => {
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        contextData.performance_lcp = lastEntry.startTime;
        resolve(lastEntry);
      }).observe({ type: 'largest-contentful-paint', buffered: true });
    });

    const metrics = results.reduce((acc, check) => {
      if (check.key) {
        if ('length' in check) {
          acc[check.key] = check.length;
        } else if ('count' in check) {
          acc[check.key] = check.count;
        } else {
          acc[check.key] = check.status === 'pass' ? 1 : 0;
        }
      }
      return acc;
    }, {});

    try {
      const headers = { 'Content-Type': 'application/json' };
      if (!isLocal && token) headers.authorization = `Bearer ${token}`;

      const response = await fetch(`${endpoint}?clientId=${imsClientId || ''}`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          ...contextData,
          ...metrics,
          checks: Array.isArray(results) ? results : results?.checks || [],
        }),
      });

      if (!response.ok) {
        // Only log in local development
        if (isLocal) {
          console.warn(`Metrics endpoint returned ${response.status}: ${response.statusText}`);
        }
        return;
      }

      const responseData = await response.json();
      if (isLocal) {
        console.log('Metrics sent successfully:', responseData);
      }
      hasSentPreflightMetrics = true;
    } catch (error) {
      // Only log CORS/network errors in local development to reduce noise
      if (isLocal) {
        console.warn('Failed to send metrics:', error.message);
      }
      // For production, silently fail - metrics are optional
    }
  })();

  try {
    await sendPreflightMetricsPromise;
  } finally {
    sendPreflightMetricsPromise = null;
  }
};

const captureMetrics = async (results) => {
  try {
    await capture(results);
  } catch (error) {
    // Silently fail - metrics are optional and shouldn't break functionality
    // Only log in local development
    const isLocal = window.location.href.toLowerCase().includes('preflightlogs=local');
    if (isLocal) {
      console.warn('Metrics capture failed:', error.message);
    }
  }
};
export default captureMetrics;
