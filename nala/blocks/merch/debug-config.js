// Debug configuration for production modal testing
export const DEBUG_CONFIG = {
  // Enable detailed logging
  enableDetailedLogging: true,

  // Timeout configurations
  timeouts: {
    modalOpen: 5000,
    pageLoad: 10000,
    navigation: 3000,
    retryDelay: 1000,
    maxRetries: 10,
  },

  // Screenshot settings
  screenshots: {
    onFailure: true,
    onSuccess: false,
    fullPage: true,
    path: './debug-screenshots/',
  },

  // Logging levels
  logLevel: {
    debug: true,
    info: true,
    warn: true,
    error: true,
  },

  // Environment detection
  isProduction: process.env.NODE_ENV === 'production' || process.env.CI === 'true',

  // Browser-specific settings
  browserSettings: { chromium: { extraHeaders: { 'sec-ch-ua': '"Chromium";v="123", "Not:A-Brand";v="8"' } } },
};

// Helper functions for debugging
export const debugHelpers = {
  log: (level, message, data = {}) => {
    if (DEBUG_CONFIG.logLevel[level]) {
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] [${level.toUpperCase()}] ${message}`, data);
    }
  },

  logModalState: async (page, context = '') => {
    const state = await page.evaluate(() => {
      const modal = document.querySelector('.dialog-modal');
      return {
        modalExists: !!modal,
        modalVisible: modal ? modal.offsetParent !== null : false,
        modalId: modal ? modal.id : null,
        hash: window.location.hash,
        url: window.location.href,
        timestamp: new Date().toISOString(),
      };
    });

    debugHelpers.log('debug', `Modal state ${context}`, state);
    return state;
  },

  waitForCondition: async (condition, maxAttempts = 10, delay = 1000) => {
    for (let i = 0; i < maxAttempts; i++) {
      try {
        const result = await condition();
        if (result) {
          return true;
        }
      } catch (error) {
        debugHelpers.log('debug', `Condition check ${i + 1} failed:`, error.message);
      }
      await new Promise((resolve) => {
        setTimeout(resolve, delay);
      });
    }
    return false;
  },
};
