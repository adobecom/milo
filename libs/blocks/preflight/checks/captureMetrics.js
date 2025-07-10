import { getConfig } from '../../../utils/utils.js';

const capture = async (results) => {
  const token = window.adobeIMS.getAccessToken()?.token;
  const config = getConfig();
  const { imsClientId } = config;
  if (!token || !imsClientId) return;
  const profile = await window.adobeIMS.getProfile();
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

  const response = await fetch(`http://localhost:8080/logs?clientId=${imsClientId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      ...results,
      ...contextData,
    }),
  })
    .then((res) => res.json())
    .catch((err) => console.error('Failed to send metrics:', err));
  console.log('Metrics sent successfully:', response);
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
