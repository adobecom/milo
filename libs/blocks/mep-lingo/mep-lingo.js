/**
 * MEP Lingo Block
 * This block is a wrapper for mep-lingo fragment links.
 * The actual processing happens in processMepLingoAnchors() in libs/features/mep/lingo.js
 * This file exists only to prevent 404 errors during block loading.
 */

export default function decorate(block) {
  // Block is already processed and removed by processMepLingoAnchors()
  // This function should never be called, but exists for completeness
  return block;
}
