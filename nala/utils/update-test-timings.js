#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Simple key-value timing updater
function updateTestTimings(jsonReportPath, timingsPath) {
  // Read existing timings or start fresh
  let timings = {};
  if (fs.existsSync(timingsPath)) {
    try {
      const data = JSON.parse(fs.readFileSync(timingsPath, 'utf8'));
      timings = data.timings || {};
    } catch (e) {
      console.log('Starting with fresh timing data');
    }
  } else {
    // Try to load default timings as baseline
    const defaultPath = path.join(__dirname, 'default-test-timings.json');
    if (fs.existsSync(defaultPath)) {
      try {
        const defaults = JSON.parse(fs.readFileSync(defaultPath, 'utf8'));
        timings = { ...defaults.timings };
        console.log('Loaded default timing baselines');
      } catch (e) {
        console.log('Could not load defaults, starting empty');
      }
    }
  }

  // Read test results
  try {
    if (!fs.existsSync(jsonReportPath)) {
      console.log(`Test results file not found: ${jsonReportPath}`);
      return;
    }
    
    const fileContent = fs.readFileSync(jsonReportPath, 'utf8');
    if (!fileContent.trim()) {
      console.log(`Test results file is empty: ${jsonReportPath}`);
      return;
    }
    
    const report = JSON.parse(fileContent);
    
    // Extract timings from all tests
    if (report.suites) {
      for (const suite of report.suites) {
        processTests(suite, timings);
      }
    }
    
    // Save updated timings
    const output = {
      timings,
      lastUpdated: new Date().toISOString(),
      totalFiles: Object.keys(timings).length
    };
    
    fs.writeFileSync(timingsPath, JSON.stringify(output, null, 2));
    console.log(`Updated timings for ${Object.keys(timings).length} test files`);
    
  } catch (error) {
    console.error(`Error processing ${jsonReportPath}:`, error.message);
  }
}

function processTests(suite, timings) {
  // Get test file path
  const testFile = suite.file?.replace(/^.*\/nala\//, 'nala/');
  
  if (testFile && suite.specs) {
    let totalDuration = 0;
    let testCount = 0;
    
    for (const spec of suite.specs) {
      if (spec.tests) {
        for (const test of spec.tests) {
          if (test.results) {
            for (const result of test.results) {
              if (result.duration) {
                totalDuration += result.duration;
                testCount++;
              }
            }
          }
        }
      }
    }
    
    // Update timing for this file (simple duration value)
    if (testCount > 0) {
      timings[testFile] = Math.round(totalDuration);
    }
  }
  
  // Process nested suites
  if (suite.suites) {
    for (const childSuite of suite.suites) {
      processTests(childSuite, timings);
    }
  }
}

// Command line usage
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.log('Usage: node update-test-timings.js <json-report> <timings-file>');
    console.log('Example: node update-test-timings.js test-results.json test-timings.json');
    process.exit(1);
  }
  
  updateTestTimings(args[0], args[1]);
}

module.exports = { updateTestTimings };