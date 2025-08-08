#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function processTests(suite, timings) {
  // Get test file path - ensure it starts with 'nala/'
  let testFile = suite.file;
  if (testFile) {
    // Remove any leading path before 'nala/' or 'blocks/'/'features/'
    if (testFile.includes('/nala/')) {
      testFile = testFile.substring(testFile.indexOf('/nala/') + 1);
    } else if (
      testFile.startsWith('blocks/')
      || testFile.startsWith('features/')
    ) {
      // Add 'nala/' prefix if not present
      testFile = `nala/${testFile}`;
    } else if (
      testFile.includes('/blocks/')
      || testFile.includes('/features/')
    ) {
      // Extract from full path and add nala/ prefix
      const match = testFile.match(/(blocks\/.*|features\/.*)$/);
      if (match) {
        testFile = `nala/${match[1]}`;
      }
    }
  }

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
      totalFiles: Object.keys(timings).length,
    };

    fs.writeFileSync(timingsPath, JSON.stringify(output, null, 2));
    console.log(
      `Updated timings for ${Object.keys(timings).length} test files`,
    );
  } catch (error) {
    console.error(`Error processing ${jsonReportPath}:`, error.message);
  }
}

function collectDurations(suite, fileDurations) {
  // Get test file path - ensure it starts with 'nala/'
  let testFile = suite.file;
  if (testFile) {
    // Remove any leading path before 'nala/' or 'blocks/'/'features/'
    if (testFile.includes('/nala/')) {
      testFile = testFile.substring(testFile.indexOf('/nala/') + 1);
    } else if (
      testFile.startsWith('blocks/')
      || testFile.startsWith('features/')
    ) {
      // Add 'nala/' prefix if not present
      testFile = `nala/${testFile}`;
    } else if (
      testFile.includes('/blocks/')
      || testFile.includes('/features/')
    ) {
      // Extract from full path and add nala/ prefix
      const match = testFile.match(/(blocks\/.*|features\/.*)$/);
      if (match) {
        testFile = `nala/${match[1]}`;
      }
    }
  }

  if (testFile && suite.specs) {
    let totalDuration = 0;

    for (const spec of suite.specs) {
      if (spec.tests) {
        for (const test of spec.tests) {
          if (test.results) {
            for (const result of test.results) {
              if (result.duration) {
                totalDuration += result.duration;
              }
            }
          }
        }
      }
    }

    if (totalDuration > 0) {
      fileDurations[testFile] = (fileDurations[testFile] || 0) + totalDuration;
    }
  }

  // Process nested suites
  if (suite.suites) {
    for (const childSuite of suite.suites) {
      collectDurations(childSuite, fileDurations);
    }
  }
}

// Function to analyze and show how durations are calculated
function analyzeTestResults(jsonReportPath) {
  try {
    if (!fs.existsSync(jsonReportPath)) {
      console.log(`Test results file not found: ${jsonReportPath}`);
      return;
    }

    const report = JSON.parse(fs.readFileSync(jsonReportPath, 'utf8'));
    const fileDurations = {};

    // Process all suites to collect durations
    if (report.suites) {
      for (const suite of report.suites) {
        collectDurations(suite, fileDurations);
      }
    }

    // Sort by duration (longest first)
    const sorted = Object.entries(fileDurations)
      .map(([file, duration]) => ({ file, duration }))
      .sort((a, b) => b.duration - a.duration);

    // Display results
    console.log('\nFile durations:');
    console.log('──────────────');
    sorted.forEach((item) => {
      const seconds = (item.duration / 1000).toFixed(2);
      console.log(`${item.file}: ${seconds}s`);
    });

    // Show total
    const total = sorted.reduce((sum, item) => sum + item.duration, 0);
    console.log(`\nTotal: ${(total / 1000).toFixed(2)}s`);
    console.log(`Files: ${sorted.length}`);
  } catch (error) {
    console.error('Error analyzing test results:', error.message);
  }
}

// Command line usage
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.length === 0) {
    console.log(
      'Usage: node update-test-timings.js <json-report> <timings-file>',
    );
    console.log('       node update-test-timings.js --analyze <json-report>');
    console.log('');
    console.log('Options:');
    console.log(
      '  --analyze    Analyze test results and show how durations are calculated',
    );
    console.log('');
    console.log('Examples:');
    console.log('  # Update timing file');
    console.log(
      '  node update-test-timings.js test-results.json test-timings.json',
    );
    console.log('');
    console.log('  # Analyze test results to understand duration calculation');
    console.log(
      '  node update-test-timings.js --analyze test-results-shard-10.json',
    );
    process.exit(0);
  }

  if (args[0] === '--analyze' && args[1]) {
    analyzeTestResults(args[1]);
  } else if (args.length >= 2) {
    updateTestTimings(args[0], args[1]);
  } else {
    console.log('Invalid arguments. Use --help for usage information.');
    process.exit(1);
  }
}

module.exports = { updateTestTimings };
