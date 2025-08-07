/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

/**
 * Analyzes test timings from Playwright JSON reports to help with shard distribution
 */
class TestTimingAnalyzer {
  constructor() {
    this.timings = {};
  }

  /**
   * Load and merge timing data from a JSON report file
   * @param {string} jsonFile - Path to Playwright JSON report
   */
  loadJsonReport(jsonFile) {
    try {
      const data = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));
      
      if (data.suites) {
        this.processSuites(data.suites);
      }
      
      // Also check for tests at root level
      if (data.tests) {
        this.processTests(data.tests);
      }
    } catch (error) {
      console.error(`Error loading ${jsonFile}:`, error.message);
    }
  }

  /**
   * Process test suites recursively
   * @param {Array} suites - Array of test suites
   * @param {string} parentFile - Parent file path
   */
  processSuites(suites, parentFile = '') {
    suites.forEach(suite => {
      // Get file path from suite or use parent
      const filePath = suite.file || parentFile;
      
      if (suite.tests) {
        this.processTests(suite.tests, filePath);
      }
      
      if (suite.suites) {
        this.processSuites(suite.suites, filePath);
      }
    });
  }

  /**
   * Process individual tests
   * @param {Array} tests - Array of tests
   * @param {string} filePath - Test file path
   */
  processTests(tests, filePath = '') {
    tests.forEach(test => {
      const file = test.file || filePath;
      if (!file) return;
      
      // Normalize file path to be relative to nala directory
      const normalizedFile = file.includes('nala/') 
        ? file.substring(file.indexOf('nala/'))
        : file;
      
      if (!this.timings[normalizedFile]) {
        this.timings[normalizedFile] = {
          totalDuration: 0,
          testCount: 0,
          runs: []
        };
      }
      
      // Add test duration
      const duration = test.duration || 0;
      this.timings[normalizedFile].totalDuration += duration;
      this.timings[normalizedFile].testCount += 1;
      this.timings[normalizedFile].runs.push(duration);
    });
  }

  /**
   * Merge with historical timing data
   * @param {string} historicalFile - Path to historical timing data
   */
  mergeWithHistorical(historicalFile) {
    try {
      if (fs.existsSync(historicalFile)) {
        const historical = JSON.parse(fs.readFileSync(historicalFile, 'utf8'));
        
        Object.entries(historical.timings || {}).forEach(([file, data]) => {
          if (!this.timings[file]) {
            this.timings[file] = data;
          } else {
            // Merge historical data with new data
            const combined = {
              totalDuration: (this.timings[file].totalDuration + (data.averageDuration * data.runCount)) / 2,
              testCount: Math.max(this.timings[file].testCount, data.testCount || 1),
              runCount: (data.runCount || 0) + 1,
              averageDuration: 0
            };
            
            // Keep only last 5 runs for rolling average
            combined.averageDuration = combined.totalDuration;
            combined.lastDuration = this.timings[file].totalDuration;
            
            this.timings[file] = combined;
          }
        });
      }
    } catch (error) {
      console.error('Error loading historical data:', error.message);
    }
  }

  /**
   * Calculate final timing statistics
   */
  calculateStats() {
    const result = {
      timings: {},
      lastUpdated: new Date().toISOString(),
      totalFiles: 0,
      totalDuration: 0,
      newFiles: []
    };
    
    Object.entries(this.timings).forEach(([file, data]) => {
      const avgDuration = data.totalDuration / (data.testCount || 1);
      
      result.timings[file] = {
        averageDuration: Math.round(avgDuration),
        lastDuration: Math.round(data.totalDuration),
        testCount: data.testCount,
        runCount: data.runCount || 1
      };
      
      // Track new files (first time seeing them)
      if (data.runCount === 1 || !data.runCount) {
        result.newFiles.push(file);
      }
      
      result.totalFiles += 1;
      result.totalDuration += data.totalDuration;
    });
    
    if (result.newFiles.length > 0) {
      console.log(`Detected ${result.newFiles.length} new test files in this run`);
    }
    
    return result;
  }

  /**
   * Generate summary report
   * @param {Object} timingData - Timing data object
   * @returns {string} Summary report
   */
  generateSummary(timingData) {
    const files = Object.entries(timingData.timings)
      .sort((a, b) => b[1].averageDuration - a[1].averageDuration)
      .slice(0, 10);
    
    let summary = '### Test Timing Summary\\n\\n';
    summary += `- **Total test files**: ${timingData.totalFiles}\\n`;
    summary += `- **Total duration**: ${Math.round(timingData.totalDuration / 1000)}s\\n\\n`;
    summary += '#### Top 10 Slowest Test Files:\\n';
    summary += '| File | Avg Duration | Tests |\\n';
    summary += '|------|-------------|-------|\\n';
    
    files.forEach(([file, data]) => {
      const fileName = path.basename(file);
      const duration = Math.round(data.averageDuration / 1000);
      summary += `| ${fileName} | ${duration}s | ${data.testCount} |\\n`;
    });
    
    return summary;
  }
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const analyzer = new TestTimingAnalyzer();
  
  if (args.includes('--help')) {
    console.log(`
Usage: node analyze-test-timings.js [options] [json-files...]

Options:
  --input <file>      Input JSON report file(s)
  --previous <file>   Previous timing data file
  --output <file>     Output timing data file
  --summary [file]    Generate summary (optionally from specific file)
  --help              Show this help message

Examples:
  # Analyze single JSON report
  node analyze-test-timings.js --input test-results.json --output timings.json
  
  # Merge with historical data
  node analyze-test-timings.js --input test-results.json --previous old-timings.json --output new-timings.json
  
  # Generate summary
  node analyze-test-timings.js --summary timings.json
`);
    process.exit(0);
  }
  
  // Handle --summary mode
  if (args.includes('--summary')) {
    const summaryIndex = args.indexOf('--summary');
    const summaryFile = args[summaryIndex + 1];
    
    if (summaryFile && !summaryFile.startsWith('--')) {
      const data = JSON.parse(fs.readFileSync(summaryFile, 'utf8'));
      console.log(analyzer.generateSummary(data));
    } else {
      console.error('Please provide a timing data file for summary');
    }
    process.exit(0);
  }
  
  // Load input files
  const inputIndex = args.indexOf('--input');
  if (inputIndex > -1) {
    const inputFile = args[inputIndex + 1];
    analyzer.loadJsonReport(inputFile);
  } else {
    // Load all JSON files passed as arguments
    args.filter(arg => arg.endsWith('.json') && !arg.startsWith('--'))
      .forEach(file => analyzer.loadJsonReport(file));
  }
  
  // Merge with historical data
  const previousIndex = args.indexOf('--previous');
  if (previousIndex > -1) {
    analyzer.mergeWithHistorical(args[previousIndex + 1]);
  }
  
  // Calculate and output results
  const results = analyzer.calculateStats();
  
  const outputIndex = args.indexOf('--output');
  if (outputIndex > -1) {
    const outputFile = args[outputIndex + 1];
    fs.writeFileSync(outputFile, JSON.stringify(results, null, 2));
    console.log(`Timing data written to ${outputFile}`);
    console.log(`Analyzed ${results.totalFiles} test files with total duration ${Math.round(results.totalDuration / 1000)}s`);
  } else {
    console.log(JSON.stringify(results, null, 2));
  }
}

module.exports = TestTimingAnalyzer;