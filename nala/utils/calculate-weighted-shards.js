/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Calculates optimal shard distribution based on test execution times
 */
class WeightedShardCalculator {
  constructor(maxShards = 6) {
    this.maxShards = maxShards;
    this.timingData = null;
    this.defaultTimings = null;
    this.averageDuration = 15000; // Default 15s per test file
    this.loadDefaultTimings();
  }

  /**
   * Load default timing data
   */
  loadDefaultTimings() {
    try {
      const defaultPath = path.join(__dirname, 'default-test-timings.json');
      if (fs.existsSync(defaultPath)) {
        const data = JSON.parse(fs.readFileSync(defaultPath, 'utf8'));
        this.defaultTimings = data.timings || {};
        console.log(`Loaded ${Object.keys(this.defaultTimings).length} default timing entries`);
      }
    } catch (error) {
      console.log('Could not load default timings:', error.message);
    }
  }

  /**
   * Load timing data from file
   * @param {string} timingFile - Path to timing data file
   */
  loadTimingData(timingFile) {
    try {
      if (fs.existsSync(timingFile)) {
        const data = JSON.parse(fs.readFileSync(timingFile, 'utf8'));
        this.timingData = data.timings || {};
        
        // Calculate average duration for files without timing data
        const durations = Object.values(this.timingData)
          .map(t => typeof t === 'number' ? t : (t.averageDuration || t.lastDuration))
          .filter(d => d > 0);
        
        if (durations.length > 0) {
          this.averageDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
        }
        
        console.log(`Loaded timing data for ${Object.keys(this.timingData).length} files`);
        console.log(`Average duration: ${Math.round(this.averageDuration / 1000)}s`);
      }
    } catch (error) {
      console.error('Error loading timing data:', error.message);
    }
  }

  /**
   * Get test duration for a file
   * @param {string} file - Test file path
   * @returns {number} Duration in milliseconds
   */
  getFileDuration(file) {
    // Normalize file path
    const normalizedFile = file.includes('nala/') 
      ? file.substring(file.indexOf('nala/'))
      : file;
    
    // First check actual timing data
    if (this.timingData && this.timingData[normalizedFile]) {
      const timing = this.timingData[normalizedFile];
      // Support both direct numbers and objects with duration properties
      if (typeof timing === 'number') {
        return timing;
      }
      return timing.averageDuration || timing.lastDuration || this.averageDuration;
    }
    
    // Then check default timings
    if (this.defaultTimings && this.defaultTimings[normalizedFile]) {
      const defaultTiming = this.defaultTimings[normalizedFile];
      if (typeof defaultTiming === 'number') {
        return defaultTiming;
      }
    }
    
    // Finally use average duration
    return this.averageDuration;
  }

  /**
   * Get all test files
   * @returns {Array<string>} List of test file paths
   */
  getTestFiles() {
    try {
      const files = execSync('find nala -name "*.test.js" -type f', { encoding: 'utf8' })
        .trim()
        .split('\n')
        .filter(f => f);
      
      console.log(`Found ${files.length} test files`);
      
      // Check for new files not in timing data
      if (this.timingData) {
        const newFiles = files.filter(file => {
          const normalizedFile = file.includes('nala/') 
            ? file.substring(file.indexOf('nala/'))
            : file;
          return !this.timingData[normalizedFile];
        });
        
        if (newFiles.length > 0) {
          console.log(`Found ${newFiles.length} new test files without timing data:`);
          newFiles.forEach(f => console.log(`  - ${f}`));
          console.log(`Will use average duration of ${Math.round(this.averageDuration / 1000)}s for new files`);
        }
      }
      
      return files;
    } catch (error) {
      console.error('Error finding test files:', error.message);
      return [];
    }
  }

  /**
   * Calculate optimal number of shards based on total duration
   * @param {Array<Object>} testFiles - Test files with durations
   * @returns {number} Optimal shard count
   */
  calculateOptimalShardCount(testFiles) {
    const totalDuration = testFiles.reduce((sum, f) => sum + f.duration, 0);
    const targetShardDuration = 120000; // Target 2 minutes per shard
    
    let optimalShards = Math.ceil(totalDuration / targetShardDuration);
    optimalShards = Math.max(2, Math.min(optimalShards, this.maxShards));
    
    console.log(`Total duration: ${Math.round(totalDuration / 1000)}s`);
    console.log(`Optimal shards: ${optimalShards}`);
    
    return optimalShards;
  }

  /**
   * Distribute tests across shards using bin packing algorithm
   * @param {Array<string>} files - Test file paths
   * @returns {Object} Shard assignments
   */
  distributeTests(files) {
    // Create test objects with durations
    const tests = files.map(file => ({
      file,
      duration: this.getFileDuration(file)
    }));
    
    // Sort by duration (longest first) for better bin packing
    tests.sort((a, b) => b.duration - a.duration);
    
    // Calculate optimal shard count
    const shardCount = this.calculateOptimalShardCount(tests);
    
    // Initialize shards
    const shards = Array(shardCount).fill(null).map(() => ({
      tests: [],
      totalDuration: 0
    }));
    
    // Distribute tests using "least loaded" bin packing
    tests.forEach(test => {
      // Find shard with minimum total duration
      let minShard = shards[0];
      let minIndex = 0;
      
      shards.forEach((shard, index) => {
        if (shard.totalDuration < minShard.totalDuration) {
          minShard = shard;
          minIndex = index;
        }
      });
      
      // Add test to least loaded shard
      minShard.tests.push(test.file);
      minShard.totalDuration += test.duration;
    });
    
    // Create result object
    const result = {
      shardCount,
      totalTests: files.length,
      shards: {},
      expectedDurations: {},
      distribution: []
    };
    
    shards.forEach((shard, index) => {
      const shardNum = index + 1;
      result.shards[shardNum] = shard.tests;
      result.expectedDurations[shardNum] = Math.round(shard.totalDuration);
      
      result.distribution.push({
        shard: shardNum,
        testCount: shard.tests.length,
        duration: Math.round(shard.totalDuration / 1000),
        percentage: Math.round((shard.tests.length / files.length) * 100)
      });
    });
    
    return result;
  }

  /**
   * Generate distribution summary
   * @param {Object} distribution - Shard distribution object
   * @returns {string} Summary text
   */
  generateSummary(distribution) {
    let summary = `\nShard Distribution Summary:\n`;
    summary += `Total tests: ${distribution.totalTests}\n`;
    summary += `Shards: ${distribution.shardCount}\n\n`;
    
    summary += 'Distribution by shard:\n';
    distribution.distribution.forEach(shard => {
      summary += `  Shard ${shard.shard}: ${shard.testCount} tests (${shard.percentage}%) - ${shard.duration}s\n`;
    });
    
    // Calculate balance metric
    const durations = distribution.distribution.map(s => s.duration);
    const maxDuration = Math.max(...durations);
    const minDuration = Math.min(...durations);
    const balance = ((minDuration / maxDuration) * 100).toFixed(1);
    
    summary += `\nBalance: ${balance}% (higher is better)\n`;
    
    return summary;
  }
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--help')) {
    console.log(`
Usage: node calculate-weighted-shards.js [options]

Options:
  --timing-data <file>   Timing data file from previous runs
  --max-shards <n>       Maximum number of shards (default: 6)
  --output <file>        Output file for shard assignments
  --test-files <files>   Specific test files (default: find all)
  --help                 Show this help message

Examples:
  # Calculate shards with timing data
  node calculate-weighted-shards.js --timing-data timings.json --output shards.json
  
  # Specify max shards
  node calculate-weighted-shards.js --timing-data timings.json --max-shards 4 --output shards.json
`);
    process.exit(0);
  }
  
  // Parse arguments
  const maxShardsIndex = args.indexOf('--max-shards');
  const maxShards = maxShardsIndex > -1 ? parseInt(args[maxShardsIndex + 1]) : 6;
  
  const calculator = new WeightedShardCalculator(maxShards);
  
  // Load timing data if provided
  const timingIndex = args.indexOf('--timing-data');
  if (timingIndex > -1) {
    calculator.loadTimingData(args[timingIndex + 1]);
  }
  
  // Get test files
  const testFilesIndex = args.indexOf('--test-files');
  let testFiles;
  
  if (testFilesIndex > -1) {
    // Use provided test files
    testFiles = args[testFilesIndex + 1].split(/\s+/).filter(f => f);
  } else {
    // Find all test files
    testFiles = calculator.getTestFiles();
  }
  
  if (testFiles.length === 0) {
    console.error('No test files found');
    process.exit(1);
  }
  
  // Calculate distribution
  const distribution = calculator.distributeTests(testFiles);
  
  // Output results
  const outputIndex = args.indexOf('--output');
  if (outputIndex > -1) {
    const outputFile = args[outputIndex + 1];
    fs.writeFileSync(outputFile, JSON.stringify(distribution, null, 2));
    console.log(`Shard assignments written to ${outputFile}`);
  } else {
    console.log(JSON.stringify(distribution, null, 2));
  }
  
  // Print summary
  console.log(calculator.generateSummary(distribution));
}

module.exports = WeightedShardCalculator;