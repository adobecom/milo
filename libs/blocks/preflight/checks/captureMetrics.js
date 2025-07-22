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

const capture = async (results) => {
  const token = window.adobeIMS.getAccessToken()?.token;
  const config = getConfig();
  const { imsClientId } = config;
  if (!token || !imsClientId) return;

  let profile;
  try {
    profile = await window.adobeIMS.getProfile();
  } catch (error) {
    // Handle IMS authentication failures gracefully
    console.warn('IMS profile fetch failed, continuing without profile data');
    profile = { email: '' };
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

  const endpoint = getLogsEndpoint();
  console.log('Using endpoint:', endpoint);

  try {
    const response = await fetch(`${endpoint}?clientId=${imsClientId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...results,
        ...contextData,
      }),
    });

    if (!response.ok) {
      // Handle HTTP error responses (401, 403, 500, etc.)
      console.warn(`Metrics endpoint returned ${response.status}: ${response.statusText}`);
      return;
    }

    const responseData = await response.json();
    console.log('Metrics sent successfully:', responseData);
  } catch (error) {
    // Handle network errors, CORS issues, etc.
    console.warn('Failed to send metrics:', error.message);
  }
};

const captureMetrics = async (results) => {
  try {
    await capture(results);
  } catch (error) {
    // TODO - rm console.error, we just wanna do nothing.
    console.error('Failed to send metrics:', error);
  }
};
export default captureMetrics;
