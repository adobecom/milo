/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

/**
 * Merges multiple Playwright JSON report files into a single report
 */
class JsonReportMerger {
  constructor() {
    this.mergedReport = {
      config: {},
      suites: [],
      errors: [],
      stats: {
        duration: 0,
        expected: 0,
        unexpected: 0,
        flaky: 0,
        skipped: 0
      }
    };
  }

  /**
   * Load and merge a JSON report file
   * @param {string} filePath - Path to JSON report file
   */
  mergeReport(filePath) {
    try {
      const report = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      
      // Merge config (use first report's config)
      if (Object.keys(this.mergedReport.config).length === 0) {
        this.mergedReport.config = report.config || {};
      }
      
      // Merge suites
      if (report.suites) {
        this.mergedReport.suites.push(...report.suites);
      }
      
      // Merge errors
      if (report.errors) {
        this.mergedReport.errors.push(...report.errors);
      }
      
      // Merge stats
      if (report.stats) {
        this.mergedReport.stats.duration += report.stats.duration || 0;
        this.mergedReport.stats.expected += report.stats.expected || 0;
        this.mergedReport.stats.unexpected += report.stats.unexpected || 0;
        this.mergedReport.stats.flaky += report.stats.flaky || 0;
        this.mergedReport.stats.skipped += report.stats.skipped || 0;
      }
      
      console.error(`Merged report from: ${path.basename(filePath)}`);
    } catch (error) {
      console.error(`Error merging ${filePath}: ${error.message}`);
    }
  }

  /**
   * Get the merged report
   * @returns {Object} Merged report object
   */
  getMergedReport() {
    // Calculate derived stats
    this.mergedReport.stats.total = 
      this.mergedReport.stats.expected + 
      this.mergedReport.stats.unexpected + 
      this.mergedReport.stats.flaky + 
      this.mergedReport.stats.skipped;
    
    return this.mergedReport;
  }
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args.includes('--help')) {
    console.log(`
Usage: node merge-json-reports.js <report1.json> <report2.json> ... > merged.json

Merges multiple Playwright JSON report files into a single report.
Output is written to stdout, so redirect to save to a file.

Examples:
  # Merge two reports
  node merge-json-reports.js shard1.json shard2.json > merged.json
  
  # Merge all JSON files in a directory
  node merge-json-reports.js results/*.json > merged.json
`);
    process.exit(args.includes('--help') ? 0 : 1);
  }
  
  const merger = new JsonReportMerger();
  
  // Process all input files
  args.forEach(arg => {
    if (fs.existsSync(arg)) {
      merger.mergeReport(arg);
    } else {
      console.error(`File not found: ${arg}`);
    }
  });
  
  // Output merged report to stdout
  const merged = merger.getMergedReport();
  console.log(JSON.stringify(merged, null, 2));
}

module.exports = JsonReportMerger;