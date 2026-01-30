#!/usr/bin/env node

/**
 * Performance Measurement Script
 * Measures LCP, CLS, JS Size, and Long Running Tasks using Playwright
 * Compares against baseline thresholds and reports failures
 * 
 * Optimizations:
 * - Parallel URL testing with concurrency limit
 * - Efficient resource filtering (single pass)
 * - Streamlined metric collection
 * - Reduced memory footprint
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASELINE_PATH = path.join(__dirname, 'baseline.json');
const RESULTS_PATH = process.env.RESULTS_PATH || path.join(__dirname, 'results.json');
const VARIANT_NAME = process.env.VARIANT_NAME || 'PR';
const MAX_CONCURRENCY = parseInt(process.env.PERF_CONCURRENCY, 10) || 2;
const TOP_RESOURCES_COUNT = 5;

/**
 * Throttle presets for network and CPU simulation
 * Network values: latency (ms), downloadThroughput (bytes/s), uploadThroughput (bytes/s)
 * CPU slowdown is a multiplier (e.g., 4 = 4x slower)
 */
const THROTTLE_PRESETS = {
  none: null,
  slow3g: {
    network: {
      offline: false,
      latency: 400,
      downloadThroughput: (40 * 1024) / 8, // 40 Kbps
      uploadThroughput: (40 * 1024) / 8,
    },
    cpuSlowdown: 6,
  },
  fast3g: {
    network: {
      offline: false,
      latency: 150,
      downloadThroughput: (1.5 * 1024 * 1024) / 8, // 1.5 Mbps
      uploadThroughput: (750 * 1024) / 8, // 750 Kbps
    },
    cpuSlowdown: 4,
  },
  '4g': {
    network: {
      offline: false,
      latency: 50,
      downloadThroughput: (9 * 1024 * 1024) / 8, // 9 Mbps
      uploadThroughput: (1.5 * 1024 * 1024) / 8, // 1.5 Mbps
    },
    cpuSlowdown: 2,
  },
};

/**
 * Apply throttling to a CDP session
 */
async function applyThrottle(cdpSession, preset) {
  const config = THROTTLE_PRESETS[preset];
  if (!config) return;

  if (config.network) {
    await cdpSession.send('Network.emulateNetworkConditions', config.network);
  }
  if (config.cpuSlowdown) {
    await cdpSession.send('Emulation.setCPUThrottlingRate', { rate: config.cpuSlowdown });
  }
}

function loadBaseline() {
  return JSON.parse(fs.readFileSync(BASELINE_PATH, 'utf-8'));
}

/**
 * Inject performance observers before page load
 */
const INIT_SCRIPT = `
  window.__perfMetrics = { lcp: null, cls: 0, longTasks: [] };
  if (typeof PerformanceObserver !== 'undefined') {
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      if (entries.length) window.__perfMetrics.lcp = entries[entries.length - 1].startTime;
    }).observe({ type: 'largest-contentful-paint', buffered: true });

    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) window.__perfMetrics.cls += entry.value;
      }
    }).observe({ type: 'layout-shift', buffered: true });

    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        window.__perfMetrics.longTasks.push(entry.duration);
      }
    }).observe({ type: 'longtask', buffered: true });
  }
`;

/**
 * Collect metrics from page - runs in browser context
 */
function collectMetrics() {
  const perf = window.__perfMetrics || {};
  const resources = performance.getEntriesByType('resource');
  
  // Single-pass resource processing
  let jsSize = 0;
  let totalSize = 0;
  const jsResources = [];
  
  for (const r of resources) {
    const size = r.transferSize || 0;
    totalSize += size;
    
    if (r.initiatorType === 'script' || r.name.endsWith('.js')) {
      jsSize += size;
      jsResources.push({ name: r.name, size });
    }
  }
  
  // Sort and slice in one operation - only keep top N
  jsResources.sort((a, b) => b.size - a.size);
  
  // Calculate TBT from long tasks
  const tbt = (perf.longTasks || []).reduce((sum, d) => sum + Math.max(0, d - 50), 0);
  
  return {
    lcp: perf.lcp,
    cls: perf.cls || 0,
    tbt,
    jsSize,
    totalSize,
    longTaskCount: (perf.longTasks || []).length,
    topResources: jsResources.slice(0, 5),
  };
}

async function measureOnce(context, url, throttlePreset) {
  const page = await context.newPage();
  
  try {
    // Apply throttling via CDP if preset is specified
    if (throttlePreset && throttlePreset !== 'none') {
      const cdpSession = await context.newCDPSession(page);
      await applyThrottle(cdpSession, throttlePreset);
    }
    
    await page.addInitScript(INIT_SCRIPT);
    await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
    
    // Wait for LCP to stabilize (typically within 2.5s after load)
    await page.waitForTimeout(2500);
    
    return await page.evaluate(collectMetrics);
  } finally {
    await page.close();
  }
}

/**
 * Calculate median of numeric array
 */
function median(arr) {
  if (!arr.length) return null;
  const sorted = Float64Array.from(arr).sort();
  const mid = sorted.length >> 1;
  return sorted.length & 1 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

async function runMeasurements(browser, url, runs, throttlePreset) {
  const results = [];
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  
  try {
    for (let i = 0; i < runs; i++) {
      try {
        const metrics = await measureOnce(context, url, throttlePreset);
        results.push(metrics);
        console.log(`  Run ${i + 1}/${runs}: LCP=${metrics.lcp?.toFixed(0) ?? 'N/A'}ms, CLS=${metrics.cls.toFixed(3)}, TBT=${metrics.tbt.toFixed(0)}ms`);
      } catch (err) {
        console.error(`  Run ${i + 1}/${runs} failed:`, err.message);
      }
    }
  } finally {
    await context.close();
  }
  
  if (!results.length) throw new Error(`All runs failed for ${url}`);
  
  // Aggregate results using median
  const lcpValues = results.map(r => r.lcp).filter(Boolean);
  const clsValues = results.map(r => r.cls);
  const tbtValues = results.map(r => r.tbt);
  const jsSizeValues = results.map(r => r.jsSize);
  const totalSizeValues = results.map(r => r.totalSize);
  
  // Get top resources from the run with most resources captured
  const bestRun = results.reduce((best, curr) => 
    (curr.topResources?.length || 0) > (best?.topResources?.length || 0) ? curr : best
  , results[0]);
  
  return {
    url,
    lcp: median(lcpValues),
    cls: median(clsValues),
    tbt: median(tbtValues),
    jsSize: median(jsSizeValues),
    totalSize: median(totalSizeValues),
    longTaskCount: Math.round(median(results.map(r => r.longTaskCount))),
    topResources: bestRun?.topResources?.slice(0, TOP_RESOURCES_COUNT) || [],
    runs: results.length,
  };
}

/**
 * Run tests with controlled concurrency
 */
async function runWithConcurrency(browser, urlsToTest, runs, concurrency, throttlePreset) {
  const results = [];
  const queue = [...urlsToTest];
  const inFlight = new Set();
  
  async function processNext() {
    if (!queue.length) return;
    
    const { name, url } = queue.shift();
    console.log(`\n📍 Testing: ${name}`);
    
    try {
      const result = await runMeasurements(browser, url, runs, throttlePreset);
      result.name = name;
      results.push(result);
    } catch (err) {
      console.error(`Failed to measure ${name}:`, err.message);
      results.push({ name, url, error: err.message });
    }
  }
  
  // Process URLs with concurrency limit
  while (queue.length || inFlight.size) {
    while (inFlight.size < concurrency && queue.length) {
      const promise = processNext();
      inFlight.add(promise);
      promise.finally(() => inFlight.delete(promise));
    }
    if (inFlight.size) await Promise.race(inFlight);
  }
  
  return results;
}

function checkThresholds(metrics, thresholds) {
  const failures = [];
  const checks = [
    { key: 'lcp', label: 'LCP', format: v => `${v.toFixed(0)}ms` },
    { key: 'cls', label: 'CLS', format: v => v.toFixed(3) },
    { key: 'tbt', label: 'TBT (Long Running Tasks)', format: v => `${v.toFixed(0)}ms` },
    { key: 'jsSize', label: 'JS Size', format: v => `${(v / 1024).toFixed(1)}KB` },
    { key: 'totalSize', label: 'Total Size', format: v => `${(v / 1024).toFixed(1)}KB` },
  ];
  
  for (const { key, label, format } of checks) {
    const value = metrics[key];
    const threshold = thresholds[key];
    if (value != null && threshold && value > threshold.budget) {
      failures.push({
        metric: label,
        actual: format(value),
        budget: format(threshold.budget),
        description: threshold.description,
      });
    }
  }
  
  return failures;
}

function generateReport(allResults, thresholds) {
  const lines = [
    '',
    '='.repeat(70),
    '📈 PERFORMANCE REPORT',
    '='.repeat(70),
    '',
  ];
  
  let hasFailures = false;
  
  for (const result of allResults) {
    if (result.error) {
      lines.push(`\n❌ ${result.name}: ${result.error}`);
      hasFailures = true;
      continue;
    }
    
    const title = result.name || result.url;
    lines.push(`\n🔗 ${title}`);
    if (result.name) lines.push(`   ${result.url}`);
    lines.push('-'.repeat(50));
    lines.push(`   LCP:        ${result.lcp?.toFixed(0) ?? 'N/A'}ms (budget: ${thresholds.lcp.budget}ms)`);
    lines.push(`   CLS:        ${result.cls?.toFixed(3) ?? 'N/A'} (budget: ${thresholds.cls.budget})`);
    lines.push(`   TBT:        ${result.tbt?.toFixed(0) ?? 'N/A'}ms (budget: ${thresholds.tbt.budget}ms)`);
    lines.push(`   JS Size:    ${(result.jsSize / 1024).toFixed(1)}KB (budget: ${(thresholds.jsSize.budget / 1024).toFixed(1)}KB)`);
    lines.push(`   Total Size: ${(result.totalSize / 1024).toFixed(1)}KB (budget: ${(thresholds.totalSize.budget / 1024).toFixed(1)}KB)`);
    lines.push(`   Long Tasks: ${result.longTaskCount} tasks detected`);
    
    if (result.topResources?.length) {
      lines.push('   Heaviest JS resources:');
      for (const res of result.topResources) {
        lines.push(`      • ${(res.size / 1024).toFixed(1)}KB — ${res.name.split('/').pop()}`);
      }
    }
    
    const failures = checkThresholds(result, thresholds);
    if (failures.length) {
      hasFailures = true;
      lines.push('\n   ❌ THRESHOLD VIOLATIONS:');
      for (const f of failures) {
        lines.push(`      • ${f.metric}: ${f.actual} exceeds budget of ${f.budget}`);
      }
    } else {
      lines.push('\n   ✅ All metrics within budget');
    }
  }
  
  lines.push('', '='.repeat(70));
  lines.push(hasFailures 
    ? '❌ PERFORMANCE CHECK FAILED - Some metrics exceed budgets'
    : '✅ PERFORMANCE CHECK PASSED - All metrics within budgets'
  );
  lines.push('='.repeat(70));
  
  return { report: lines.join('\n'), hasFailures };
}

function buildMilolibs() {
  const branch = process.env.PR_BRANCH || process.env.GITHUB_HEAD_REF;
  if (!branch) return null;
  
  const org = process.env.PR_ORG || 'adobecom';
  const repo = process.env.PR_REPO || 'milo';
  return `${branch.replace(/\//g, '-')}--${repo}--${org}`;
}

/**
 * Get the PR branch name (cleaned for URL use)
 */
function getPrBranch() {
  const branch = process.env.PR_BRANCH || process.env.GITHUB_HEAD_REF;
  return branch ? branch.replace(/\//g, '-') : null;
}

/**
 * Replace the branch in an AEM cloud URL
 * URL format: https://{branch}--{repo}--{org}.aem.live/...
 */
function replaceBranchInUrl(url, newBranch) {
  const urlObj = new URL(url);
  const hostParts = urlObj.hostname.split('.');
  
  // Expected format: branch--repo--org.aem.live
  if (hostParts.length >= 2 && hostParts[1] === 'aem') {
    const subdomain = hostParts[0];
    const parts = subdomain.split('--');
    if (parts.length >= 3) {
      // Replace the branch (first part), keep repo and org
      parts[0] = newBranch;
      hostParts[0] = parts.join('--');
      urlObj.hostname = hostParts.join('.');
    }
  }
  
  return urlObj.toString();
}

/**
 * Build test URLs with appropriate transformations based on type
 * - "milolibs": Add milolibs query parameter (default)
 * - "cloud": Replace branch in URL hostname
 */
function buildTestUrls(testUrls, baseUrl, milolibs, prBranch) {
  if (!Array.isArray(testUrls)) {
    console.error('testUrls must be an array');
    return [];
  }
  
  return testUrls.map((item) => {
    // Handle object format: { name, url, type }
    if (typeof item === 'object' && item.url) {
      const urlType = item.type || 'milolibs';
      let finalUrl = item.url;
      
      if (urlType === 'cloud' && prBranch) {
        // Replace branch in the cloud URL
        finalUrl = replaceBranchInUrl(item.url, prBranch);
      } else if (urlType === 'milolibs' && milolibs) {
        // Add milolibs parameter
        const urlObj = new URL(item.url);
        urlObj.searchParams.set('milolibs', milolibs);
        urlObj.searchParams.set('martech', 'off');
        finalUrl = urlObj.toString();
      }
      
      return { name: item.name || item.url, url: finalUrl, type: urlType };
    }
    
    // Handle string format (relative path)
    return { name: item, url: new URL(item, baseUrl).toString(), type: 'milolibs' };
  });
}

async function main() {
  const baseUrl = process.env.TEST_URL || process.argv[2];
  
  if (!baseUrl) {
    console.error('Usage: node measure-performance.js <base-url>');
    console.error('  Or set TEST_URL environment variable');
    process.exit(1);
  }
  
  const milolibs = buildMilolibs();
  const prBranch = getPrBranch();
  const baseline = loadBaseline();
  const { thresholds, testUrls, runs = 3, throttle = 'none' } = baseline;
  
  // Parse PR-specific test URLs from environment variable
  let prTestUrls = [];
  if (process.env.PR_TEST_URLS) {
    try {
      prTestUrls = JSON.parse(process.env.PR_TEST_URLS);
      if (prTestUrls.length) {
        console.log(`📋 Found ${prTestUrls.length} PR-specific test URLs`);
      }
    } catch (e) {
      console.warn('Warning: Failed to parse PR_TEST_URLS:', e.message);
    }
  }
  
  // Merge baseline URLs with PR-specific URLs
  const allTestUrls = [...testUrls, ...prTestUrls];
  const urlsToTest = buildTestUrls(allTestUrls, baseUrl, milolibs, prBranch);
  
  // Count URL types
  const cloudUrls = urlsToTest.filter(u => u.type === 'cloud');
  const milolibsUrls = urlsToTest.filter(u => u.type === 'milolibs');
  const prUrlCount = prTestUrls.length;
  
  // Environment variable can override baseline throttle setting
  const throttlePreset = (process.env.THROTTLE_PRESET || throttle).toLowerCase();
  const throttleConfig = THROTTLE_PRESETS[throttlePreset];
  
  console.log('🚀 Starting Performance Measurement');
  console.log(`   Base URL: ${baseUrl}`);
  if (prBranch) console.log(`   PR Branch: ${prBranch}`);
  if (milolibs) console.log(`   Milolibs: ${milolibs}`);
  console.log(`   URLs: ${urlsToTest.length} total (${cloudUrls.length} cloud, ${milolibsUrls.length} milolibs${prUrlCount ? `, ${prUrlCount} from PR` : ''}) | Runs: ${runs} | Concurrency: ${MAX_CONCURRENCY}`);
  if (throttlePreset !== 'none' && throttleConfig) {
    console.log(`   Throttle: ${throttlePreset} (CPU: ${throttleConfig.cpuSlowdown}x slowdown, Latency: ${throttleConfig.network.latency}ms)`);
  } else {
    console.log('   Throttle: none');
  }
  
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });
  
  let allResults;
  try {
    allResults = await runWithConcurrency(browser, urlsToTest, runs, MAX_CONCURRENCY, throttlePreset);
  } finally {
    await browser.close();
  }
  
  const { report, hasFailures } = generateReport(allResults, thresholds);
  console.log(report);
  
  // Write outputs
  const validResults = allResults.filter(r => !r.error);
  
  if (process.env.GITHUB_OUTPUT) {
    const summary = validResults.map(r => ({
      name: r.name,
      url: r.url,
      lcp: r.lcp?.toFixed(0),
      cls: r.cls?.toFixed(3),
      tbt: r.tbt?.toFixed(0),
      jsSize: (r.jsSize / 1024).toFixed(1),
      passed: !checkThresholds(r, thresholds).length,
    }));
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `results=${JSON.stringify(summary)}\n`);
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `passed=${!hasFailures}\n`);
  }
  
  fs.writeFileSync(RESULTS_PATH, JSON.stringify({
    variant: VARIANT_NAME,
    throttle: throttlePreset,
    results: allResults,
    thresholds,
    passed: !hasFailures,
  }, null, 2));
  
  process.exit(hasFailures ? 1 : 0);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});

