/**
 * Hash helpers used for content equality checks (e.g. diff stage comparing
 * local sitemap.html against remote DA content).
 */

import { createHash } from 'node:crypto';

/**
 * Hex-encoded SHA-256 of a UTF-8 string.
 * @param {string} content
 * @returns {string}
 */
export function sha256(content) {
  return createHash('sha256').update(content, 'utf8').digest('hex');
}
