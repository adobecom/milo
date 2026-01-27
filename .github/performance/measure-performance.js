#!/usr/bin/env node

/**
 * Performance Measurement Script
 * Measures LCP, CLS, JS Size, and Long Running Tasks using Playwright
 * Compares against baseline thresholds and reports failures
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASELINE_PATH = path.join(__dirname, 'baseline.json');
const RESULTS_PATH = process.env.RESULTS_PATH || path.join(__dirname, 'results.json');
const VARIANT_NAME = process.env.VARIANT_NAME || 'PR';

async function loadBaseline() {
  const content = fs.readFileSync(BASELINE_PATH, 'utf-8');
  return JSON.parse(content);
}

async function measurePerformance(page, url) {
  console.log(`\n📊 Measuring performance for: ${url}`);
  
  // Navigate and wait for network idle
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  
  // Wait a bit for any lazy-loaded content
  await page.waitForTimeout(2000);

  // Get performance metrics using Performance API (leveraging buffered observer data)
  const metrics = await page.evaluate(() => {
    return new Promise((resolve) => {
      const results = {
        lcp: null,
        cls: null,
        longTasks: [],
        resources: [],
      };

      // Get LCP
      const lcpEntries = (window.__lcpEntries && window.__lcpEntries.length)
        ? window.__lcpEntries
        : performance.getEntriesByType('largest-contentful-paint');
      if (lcpEntries.length > 0) {
        results.lcp = lcpEntries[lcpEntries.length - 1].startTime;
      }

      // Get CLS from layout-shift entries
      const clsEntries = (window.__layoutShiftEntries && window.__layoutShiftEntries.length)
        ? window.__layoutShiftEntries
        : performance.getEntriesByType('layout-shift');
      let clsScore = 0;
      clsEntries.forEach((entry) => {
        if (!entry.hadRecentInput) {
          clsScore += entry.value;
        }
      });
      results.cls = clsScore;

      // Get long tasks (tasks > 50ms)
      const longTaskEntries = performance.getEntriesByType('longtask');
      results.longTasks = longTaskEntries.map((entry) => ({
        duration: entry.duration,
        startTime: entry.startTime,
      }));

      // Calculate Total Blocking Time (time beyond 50ms for each long task)
      results.tbt = longTaskEntries.reduce((total, entry) => {
        return total + Math.max(0, entry.duration - 50);
      }, 0);

      // Get resource sizes
      const resourceEntries = performance.getEntriesByName ? 
        performance.getEntriesByType('resource') : [];
      
      results.resources = resourceEntries.map((entry) => ({
        name: entry.name,
        type: entry.initiatorType,
        size: entry.transferSize || 0,
        duration: entry.duration,
      }));

      resolve(results);
    });
  });

  // Calculate JS size only for Milo libs (script or .js under /libs/)
  const jsResources = metrics.resources.filter((r) => {
    const isJs = r.type === 'script' || r.name.endsWith('.js');
    return isJs;
  });
  const jsSize = jsResources.reduce((total, r) => total + r.size, 0);
  
  // Calculate total page size
  const totalSize = metrics.resources.reduce((total, r) => total + r.size, 0);

  return {
    url,
    lcp: metrics.lcp,
    cls: metrics.cls,
    tbt: metrics.tbt,
    jsSize,
    totalSize,
    longTaskCount: metrics.longTasks.length,
    longTasks: metrics.longTasks,
    resources: metrics.resources,
    resourceCount: metrics.resources.length,
  };
}

async function runMultipleMeasurements(browser, url, runs) {
  const results = [];
  
  for (let i = 0; i < runs; i++) {
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
    });
    const page = await context.newPage();
    
    // Enable performance observers early so buffered entries (e.g., LCP/CLS) are captured
    await page.addInitScript(() => {
      if (typeof PerformanceObserver !== 'undefined') {
        // Capture LCP and CLS with buffered entries
        new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          (window.__lcpEntries = window.__lcpEntries || []).push(...entries);
        }).observe({ type: 'largest-contentful-paint', buffered: true });
        
        new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          (window.__layoutShiftEntries = window.__layoutShiftEntries || []).push(...entries);
        }).observe({ type: 'layout-shift', buffered: true });
        
        // Long tasks for TBT
        new PerformanceObserver(() => {}).observe({ type: 'longtask', buffered: true });
      }
    });
    
    try {
      const result = await measurePerformance(page, url);
      results.push(result);
      console.log(`  Run ${i + 1}/${runs}: LCP=${result.lcp?.toFixed(0)}ms, CLS=${result.cls?.toFixed(3)}, TBT=${result.tbt?.toFixed(0)}ms`);
    } catch (error) {
      console.error(`  Run ${i + 1}/${runs} failed:`, error.message);
    } finally {
      await context.close();
    }
  }
  
  // Return median values
  if (results.length === 0) {
    throw new Error(`All measurement runs failed for ${url}`);
  }
  
  const median = (arr) => {
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  };
  
  const bestRun = results.reduce((best, curr) => {
    if (!best) return curr;
    const bestSize = best.totalSize || 0;
    const currSize = curr.totalSize || 0;
    return currSize > bestSize ? curr : best;
  }, null);
  
  const topResources = (bestRun && bestRun.resources)
    ? [...bestRun.resources]
        .filter((r) => {
          const isJs = r.type === 'script' || r.name.endsWith('.js');
          return isJs;
        })
        .sort((a, b) => (b.size || 0) - (a.size || 0))
        .slice(0, 5)
    : [];
  
  return {
    url,
    lcp: median(results.map((r) => r.lcp).filter(Boolean)),
    cls: median(results.map((r) => r.cls).filter((v) => v !== null)),
    tbt: median(results.map((r) => r.tbt).filter(Boolean)),
    jsSize: median(results.map((r) => r.jsSize)),
    totalSize: median(results.map((r) => r.totalSize)),
    longTaskCount: Math.round(median(results.map((r) => r.longTaskCount))),
    runs: results.length,
    topResources,
  };
}

function checkThresholds(metrics, thresholds) {
  const failures = [];
  
  if (metrics.lcp !== null && metrics.lcp > thresholds.lcp.budget) {
    failures.push({
      metric: 'LCP',
      actual: `${metrics.lcp.toFixed(0)}ms`,
      budget: `${thresholds.lcp.budget}ms`,
      description: thresholds.lcp.description,
    });
  }
  
  if (metrics.cls !== null && metrics.cls > thresholds.cls.budget) {
    failures.push({
      metric: 'CLS',
      actual: metrics.cls.toFixed(3),
      budget: thresholds.cls.budget.toString(),
      description: thresholds.cls.description,
    });
  }
  
  if (metrics.tbt !== null && metrics.tbt > thresholds.tbt.budget) {
    failures.push({
      metric: 'TBT (Long Running Tasks)',
      actual: `${metrics.tbt.toFixed(0)}ms`,
      budget: `${thresholds.tbt.budget}ms`,
      description: thresholds.tbt.description,
    });
  }
  
  if (metrics.jsSize > thresholds.jsSize.budget) {
    failures.push({
      metric: 'JS Size',
      actual: `${(metrics.jsSize / 1024).toFixed(1)}KB`,
      budget: `${(thresholds.jsSize.budget / 1024).toFixed(1)}KB`,
      description: thresholds.jsSize.description,
    });
  }
  
  if (metrics.totalSize > thresholds.totalSize.budget) {
    failures.push({
      metric: 'Total Size',
      actual: `${(metrics.totalSize / 1024).toFixed(1)}KB`,
      budget: `${(thresholds.totalSize.budget / 1024).toFixed(1)}KB`,
      description: thresholds.totalSize.description,
    });
  }
  
  return failures;
}

function generateReport(allResults, thresholds) {
  let report = '\n' + '='.repeat(70) + '\n';
  report += '📈 PERFORMANCE REPORT\n';
  report += '='.repeat(70) + '\n\n';
  
  let hasFailures = false;
  
  for (const result of allResults) {
    const title = result.name || result.url;
    report += `\n🔗 ${title}\n`;
    if (result.name) {
      report += `   ${result.url}\n`;
    }
    report += '-'.repeat(50) + '\n';
    report += `   LCP:        ${result.lcp?.toFixed(0) || 'N/A'}ms (budget: ${thresholds.lcp.budget}ms)\n`;
    report += `   CLS:        ${result.cls?.toFixed(3) || 'N/A'} (budget: ${thresholds.cls.budget})\n`;
    report += `   TBT:        ${result.tbt?.toFixed(0) || 'N/A'}ms (budget: ${thresholds.tbt.budget}ms)\n`;
    report += `   JS Size:    ${(result.jsSize / 1024).toFixed(1)}KB (budget: ${(thresholds.jsSize.budget / 1024).toFixed(1)}KB)\n`;
    report += `   Total Size: ${(result.totalSize / 1024).toFixed(1)}KB (budget: ${(thresholds.totalSize.budget / 1024).toFixed(1)}KB)\n`;
    report += `   Long Tasks: ${result.longTaskCount} tasks detected\n`;
    
    if (result.topResources?.length) {
      report += '   Heaviest resources (top 5):\n';
      for (const res of result.topResources) {
        report += `      • ${(res.size / 1024).toFixed(1)}KB - ${res.name}\n`;
      }
    }
    
    const failures = checkThresholds(result, thresholds);
    if (failures.length > 0) {
      hasFailures = true;
      report += '\n   ❌ THRESHOLD VIOLATIONS:\n';
      for (const failure of failures) {
        report += `      • ${failure.metric}: ${failure.actual} exceeds budget of ${failure.budget}\n`;
      }
    } else {
      report += '\n   ✅ All metrics within budget\n';
    }
  }
  
  report += '\n' + '='.repeat(70) + '\n';
  
  if (hasFailures) {
    report += '❌ PERFORMANCE CHECK FAILED - Some metrics exceed budgets\n';
  } else {
    report += '✅ PERFORMANCE CHECK PASSED - All metrics within budgets\n';
  }
  
  report += '='.repeat(70) + '\n';
  
  return { report, hasFailures };
}

/**
 * Build the milolibs parameter for testing consumer sites with PR's Milo code
 * Format: {branch}--{repo}--{org}
 */
function buildMilolibs() {
  const branch = process.env.PR_BRANCH || process.env.GITHUB_HEAD_REF;
  const org = process.env.PR_ORG || 'adobecom';
  const repo = process.env.PR_REPO || 'milo';
  
  if (!branch) {
    return null;
  }
  
  // Clean branch name (replace / with -)
  const cleanBranch = branch.replace(/\//g, '-');
  return `${cleanBranch}--${repo}--${org}`;
}

/**
 * Build list of URLs to test from config
 */
function buildTestUrls(testUrls, baseUrl, milolibs) {
  const urls = [];
  
  // Handle legacy format (simple array of paths)
  if (Array.isArray(testUrls)) {
    for (const urlPath of testUrls) {
      urls.push({
        name: urlPath,
        url: new URL(urlPath, baseUrl).toString(),
      });
    }
    return urls;
  }
  
  // Handle new format with milo and consumer sections
  if (testUrls.milo) {
    for (const urlPath of testUrls.milo) {
      urls.push({
        name: `Milo: ${urlPath}`,
        url: new URL(urlPath, baseUrl).toString(),
      });
    }
  }
  
  if (testUrls.consumer) {
    for (const consumer of testUrls.consumer) {
      let testUrl = consumer.url;
      
      // Append milolibs parameter to test with PR's Milo code
      if (milolibs) {
        const urlObj = new URL(testUrl);
        urlObj.searchParams.set('milolibs', milolibs);
        urlObj.searchParams.set('martech', 'off'); // Disable martech for consistent measurements
        testUrl = urlObj.toString();
      }
      
      urls.push({
        name: consumer.name,
        url: testUrl,
      });
    }
  }
  
  return urls;
}

async function main() {
  const baseUrl = process.env.TEST_URL || process.argv[2];
  
  if (!baseUrl) {
    console.error('Error: Please provide a base URL via TEST_URL env var or as an argument');
    console.error('Usage: node measure-performance.js https://example.com');
    process.exit(1);
  }
  
  const milolibs = buildMilolibs();
  
  console.log('🚀 Starting Performance Measurement');
  console.log(`   Base URL: ${baseUrl}`);
  if (milolibs) {
    console.log(`   Milolibs: ${milolibs}`);
  }
  
  const baseline = await loadBaseline();
  const { thresholds, testUrls, runs } = baseline;
  
  if (Array.isArray(baseline.jsIncludePatterns) && baseline.jsIncludePatterns.length) {
    jsIncludePatterns = baseline.jsIncludePatterns;
  }
  
  const urlsToTest = buildTestUrls(testUrls, baseUrl, milolibs);
  
  console.log(`   Test URLs: ${urlsToTest.length}`);
  console.log(`   Runs per URL: ${runs}`);
  
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  
  const allResults = [];
  
  try {
    for (const { name, url } of urlsToTest) {
      console.log(`\n📍 Testing: ${name}`);
      const result = await runMultipleMeasurements(browser, url, runs);
      result.name = name;
      allResults.push(result);
    }
  } finally {
    await browser.close();
  }
  
  const { report, hasFailures } = generateReport(allResults, thresholds);
  console.log(report);
  
  // Write JSON results for GitHub Actions
  const outputPath = process.env.GITHUB_OUTPUT;
  if (outputPath) {
    const summary = allResults.map((r) => ({
      name: r.name,
      url: r.url,
      lcp: r.lcp?.toFixed(0),
      cls: r.cls?.toFixed(3),
      tbt: r.tbt?.toFixed(0),
      jsSize: (r.jsSize / 1024).toFixed(1),
      passed: checkThresholds(r, thresholds).length === 0,
    }));
    
    fs.appendFileSync(outputPath, `results=${JSON.stringify(summary)}\n`);
    fs.appendFileSync(outputPath, `passed=${!hasFailures}\n`);
  }
  
  // Write results to file for artifact upload
  fs.writeFileSync(
    RESULTS_PATH,
    JSON.stringify({ variant: VARIANT_NAME, results: allResults, thresholds, passed: !hasFailures }, null, 2)
  );
  
  if (hasFailures) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

