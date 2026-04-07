import { createHash } from 'node:crypto';

/**
 * @param {string} content
 * @returns {string}
 */
export function sha256(content) {
  return createHash('sha256').update(content, 'utf8').digest('hex');
}
