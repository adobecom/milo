const DEBUG_PARAM = 'fedsDebug';
const DEBUG_ALL = '*';
const DEBUG_MESSAGE = 'Debug mode';

/**
 * Module for logging messages in the console, mainly used for debugging purposes
 */
export default class Debug {
  /**
     * Debug constructor
     * @param {Object} options
     */
  constructor(options = {}) {
    const search = new URLSearchParams(window.location.search);
    this.module = options.control;
    this.debug = search.getAll(DEBUG_PARAM).some((module) => module === this.module
            || module === DEBUG_ALL);
    if (this.debug) {
      this.log(DEBUG_MESSAGE);
    }

    // Add available module to feds.debug
    window.feds = window.feds || {};
    window.feds.debug = window.feds.debug || [];
    window.feds.debug.push(this.module);
  }

  /**
     * Builds an array of messages to be written in the console.
     * @param  {...any} output Items to be logged in the console
     * @returns {Array} Array of items to be logged
     */
  message(...output) {
    const log = [`${this.module}:`];
    output.forEach((element) => log.push(element));

    return log.concat();
  }

  /**
     * Log a message in the console
     * @param  {...any} output Items to be logged in the console
     */
  log(...output) {
    if (this.debug) {
      window.console.log.apply(null, this.message(...output));
    }
  }

  /**
     * Throw a warning in the console
     * @param  {...any} output Items to be logged in the console
     */
  warn(...output) {
    if (this.debug) {
      window.console.warn.apply(null, this.message(...output));
    }
  }

  /**
     * Throw an error in the console
     * @param  {...any} output Items to be logged in the console
     */
  error(...output) {
    if (this.debug) {
      window.console.error.apply(null, this.message(...output));
    }
  }
}
