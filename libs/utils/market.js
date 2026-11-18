/**
 * @deprecated The market logic now lives in utils.js. Import from utils.js instead.
 * This file only re-exports it to avoid breaking existing consumers
 * and will be deleted in the future.
 */
export {
  norm,
  getMarketConfig,
  marketsLangForLocale,
  isSupportedMarket,
  getValidatedMarket,
} from './utils.js';
