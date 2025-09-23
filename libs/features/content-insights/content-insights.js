/**
 * Content Insights feature - loads content insights functionality on demand
 */

export default async function initContentInsights() {
  // Only load if content insights is enabled via URL parameter or metadata
  const urlParams = new URLSearchParams(window.location.search);
  const contentInsightsParam = urlParams.get('content-insights');
  const contentInsightsMeta = document.querySelector('meta[name="content-insights"]')?.content;
  
  // Enable if URL param is 'on' or metadata is 'on'
  const isEnabled = contentInsightsParam === 'on' || contentInsightsMeta === 'on';
  
  if (!isEnabled) {
    return;
  }

  // Set up the content insights event listener
  window.addEventListener('content-insights-begin', async (evtd) => {
    const { default: executeCheck } = await import('../../blocks/preflight/checks/contentInsights.js');
    await executeCheck(evtd?.detail);
  });
}
