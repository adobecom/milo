#!/usr/bin/env node
/* eslint-disable no-console */

/**
 * Build Script for C2S2A Master Stylesheet
 *
 * This script combines all design token CSS files from the deps/ directory
 * into a single c2s2a.css file following the S2A Design System architecture:
 *
 * Layer 1: Primitives (raw values)
 * Layer 2: Semantic (meaning-based tokens)
 *
 * Usage: node libs/styles/build-c2s2a.js
 */

const fs = require('fs');
const path = require('path');

const DEPS_DIR = path.join(__dirname, 'deps');
const OUTPUT_FILE = path.join(__dirname, 'c2s2a.css');

// Define the token files in the correct order per README.md
const TOKEN_FILES = {
  primitives: [
    'tokens.primitives.css',
    'tokens.primitives.light.css',
    'tokens.primitives.dark.css',
  ],
  semantic: [
    'tokens.semantic.css',
    'tokens.semantic.light.css',
    'tokens.semantic.dark.css',
  ],
};

/**
 * Normalize CSS to fix common linting issues
 */
function normalizeCSS(content) {
  let normalized = content;

  // Remove "Do not edit directly" comment blocks from source files
  normalized = normalized.replace(/\/\*\*\s*\*\s*Do not edit directly[^*]*\*\//g, '');

  // Replace data-theme attribute selectors with class selectors
  // :root[data-theme="light"] → .light
  // :root[data-theme="dark"] → .dark
  normalized = normalized.replace(/:root\[data-theme="light"\]/g, '.light');
  normalized = normalized.replace(/:root\[data-theme="dark"\]/g, '.dark');

  // Clean up multiple consecutive blank lines immediately after comment removal
  normalized = normalized.replace(/\n{3,}/g, '\n\n');

  // Fix alpha-value-notation: 0.12 -> 12%
  normalized = normalized.replace(/: (\d*\.?\d+);/g, (match, value) => {
    const num = parseFloat(value);
    if (num >= 0 && num <= 1 && value.includes('.') && !value.includes('rem') && !value.includes('px')) {
      return `: ${Math.round(num * 100)}%;`;
    }
    return match;
  });

  // Fix color-function-notation: rgba(0, 0, 0, 0.12) -> rgb(0 0 0 / 12%)
  normalized = normalized.replace(/rgba?\(([^)]+)\)/g, (match, args) => {
    const parts = args.split(',').map((p) => p.trim());
    if (parts.length === 4) {
      const alpha = parseFloat(parts[3]);
      const alphaPercent = Math.round(alpha * 100);
      return `rgb(${parts[0]} ${parts[1]} ${parts[2]} / ${alphaPercent}%)`;
    }
    if (parts.length === 3) {
      return `rgb(${parts[0]} ${parts[1]} ${parts[2]})`;
    }
    return match;
  });

  // Fix bare alpha values in rgb() functions: rgb(0 0 0 / 0) -> rgb(0 0 0 / 0%)
  normalized = normalized.replace(/rgb\(([^/)]+)\s*\/\s*(\d+(?:\.\d+)?)\s*\)/g, (match, colors, alpha) => {
    // If alpha already has %, leave it; otherwise add %
    if (match.includes('%')) return match;
    return `rgb(${colors} / ${alpha}%)`;
  });

  // Fix color-hex-length: #ffffff -> #fff
  normalized = normalized.replace(/#([0-9a-fA-F])\1([0-9a-fA-F])\2([0-9a-fA-F])\3\b/g, '#$1$2$3');

  // Fix length-zero-no-unit: 0px -> 0
  normalized = normalized.replace(/\b0px\b/g, '0');

  // Fix value-keyword-case: Black -> black
  normalized = normalized.replace(/: (Black|ExtraBold|Bold|Medium|Regular)\b/g, (match, keyword) => `: ${keyword.toLowerCase()}`);

  // Fix number-max-precision: limit to 4 decimal places
  normalized = normalized.replace(/: (\d+\.\d{5,});/g, (match, value) => {
    const num = parseFloat(value);
    return `: ${num.toFixed(4).replace(/\.?0+$/, '')};`;
  });

  // Remove empty :root {} blocks
  normalized = normalized.replace(/:root\s*{\s*}/g, '');

  // Remove empty @media {} blocks
  normalized = normalized.replace(/@media[^{]*{\s*}/g, '');

  // Clean up blank lines after opening braces (inside @media and other blocks)
  normalized = normalized.replace(/{\n\n/g, '{\n');

  return normalized.trim();
}

/**
 * Fix empty line issues for linter compliance
 */
function fixEmptyLines(cssContent) {
  const lines = cssContent.split('\n');
  const result = [];

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const trimmed = line.trim();
    const prevLine = i > 0 ? lines[i - 1] : '';
    const prevTrimmed = prevLine.trim();

    // Add empty line before comments (except after opening braces or if already there)
    if (trimmed.startsWith('/*') && prevTrimmed && !prevTrimmed.endsWith('{')) {
      if (result[result.length - 1] !== '') {
        result.push('');
      }
    }

    result.push(line);
  }

  return result.join('\n');
}

/**
 * Merge multiple :root and class selectors into one
 */
function mergeRootSelectors(cssContent) {
  const lines = cssContent.split('\n');
  const rootBlocks = {}; // Store properties for each unique selector as a Map
  const selectorOrder = []; // Track order of first appearance
  let inRootBlock = false;
  let inMediaBlock = false;
  let currentSelector = '';
  let mediaBlockDepth = 0;

  // First pass: collect all :root and class blocks and their properties
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const trimmed = line.trim();

    // Track @media blocks
    if (trimmed.startsWith('@media')) {
      inMediaBlock = true;
      mediaBlockDepth = 0;
    }

    if (inMediaBlock) {
      if (trimmed.includes('{')) {
        mediaBlockDepth += 1;
      }
      if (trimmed.includes('}')) {
        mediaBlockDepth -= 1;
        if (mediaBlockDepth === 0) {
          inMediaBlock = false;
        }
      }
    }

    // Match :root, .light, or .dark selectors
    if (trimmed.match(/^(:root|\.light|\.dark)\s*{/)) {
      const selector = trimmed.replace(/\s*{\s*$/, '').trim();
      currentSelector = selector;
      inRootBlock = true;

      if (!rootBlocks[selector]) {
        rootBlocks[selector] = {};
        selectorOrder.push(selector);
      }
    } else if (inRootBlock) {
      if (trimmed === '}' && !inMediaBlock) {
        inRootBlock = false;
        currentSelector = '';
      } else if (trimmed && !trimmed.startsWith('/*')) {
        // Extract property name to deduplicate
        const match = trimmed.match(/^\s*(--[a-z0-9-]+):/);
        if (match) {
          const propName = match[1];
          // Store with property name as key to auto-deduplicate (last value wins)
          rootBlocks[currentSelector][propName] = line;
        }
      }
    }
  }

  // Second pass: rebuild content with merged blocks
  const result = [];
  inRootBlock = false;
  inMediaBlock = false;
  mediaBlockDepth = 0;
  let rootBlocksInserted = false;

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const trimmed = line.trim();

    // Track @media blocks
    if (trimmed.startsWith('@media')) {
      inMediaBlock = true;
      mediaBlockDepth = 0;
      result.push(line);
    } else if (inMediaBlock) {
      if (trimmed.includes('{')) {
        mediaBlockDepth += 1;
      }
      if (trimmed.includes('}')) {
        mediaBlockDepth -= 1;
        if (mediaBlockDepth === 0) {
          inMediaBlock = false;
        }
      }
      result.push(line);
    } else if (trimmed.match(/^(:root|\.light|\.dark)\s*{/)) {
      inRootBlock = true;

      // Insert all merged blocks on first encounter
      if (!rootBlocksInserted) {
        selectorOrder.forEach((selector) => {
          const properties = Object.values(rootBlocks[selector]);
          if (properties.length > 0) {
            result.push('');
            result.push(`${selector} {`);
            result.push(...properties);
            result.push('}');
          }
        });
        rootBlocksInserted = true;
      }
    } else if (inRootBlock && trimmed === '}') {
      inRootBlock = false;
      // Skip the closing brace - already handled in merged blocks
    } else if (!inRootBlock && !inMediaBlock) {
      // Keep all non-root/class, non-@media content
      result.push(line);
    }
  }

  return result.join('\n');
}

/**
 * Read a token file and return its content
 */
function readTokenFile(filename) {
  const filePath = path.join(DEPS_DIR, filename);
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return normalizeCSS(content);
  } catch (error) {
    console.error(`Error reading ${filename}:`, error.message);
    return '';
  }
}

/**
 * Build the header comment
 */
function buildHeader() {
  return `/**
 * C2S2A Master Stylesheet
 * Combined design tokens for S2A Design System
 *
 * This file combines all design tokens in the correct layer order:
 * 1. Primitives (raw values)
 * 2. Semantic (meaning-based tokens)
 *
 * Import order matters because CSS custom properties cascade and reference each other.
 * See tokens-readme.md in the deps/ directory for complete documentation.
 *
 * Theme Switching:
 * - Use .light class for light mode styles
 * - Use .dark class for dark mode styles
 *
 * Note: Multiple :root selectors are intentional for the layered token architecture.
 *
 * ⚠️  TOKEN LAYERS ARE AUTO-GENERATED
 * The token layers (LAYER 1, LAYER 2) are auto-generated by build-c2s2a.js
 * Any CSS after the token layers will be preserved
 * To update tokens: run 'npm run build:c2s2a'
 */
`.trimStart();
}

/**
 * Build a section with its token files
 */
function buildSection(layerNumber, layerName, description, files, subsectionLabels) {
  let sectionContent = '';

  files.forEach((filename, index) => {
    const content = readTokenFile(filename);
    if (!content) return;

    const subsection = subsectionLabels[index];
    sectionContent += `
/* --- ${layerNumber}.${index + 1} ${layerName}: ${subsection} --- */

/* Source: ${filename} */

${content}`;
  });

  return `
/* ========================================================================
   LAYER ${layerNumber}: ${layerName}
   ${description}
   ======================================================================== */
${sectionContent}`;
}

/**
 * Extract non-token CSS from existing c2s2a.css file
 */
function extractExistingStyles() {
  try {
    if (!fs.existsSync(OUTPUT_FILE)) {
      console.log('ℹ️  No existing c2s2a.css found - will create new file\n');
      return '';
    }

    const existingContent = fs.readFileSync(OUTPUT_FILE, 'utf8');
    const lines = existingContent.split('\n');

    // Find where token layers end - look for the last LAYER marker
    let lastLayerEndIndex = -1;
    let inLayerSection = false;
    let braceDepth = 0;

    for (let i = 0; i < lines.length; i += 1) {
      const line = lines[i].trim();

      // Track when we enter a LAYER section
      if (line.match(/^\/\* ========================================================================$/)) {
        const nextLine = i + 1 < lines.length ? lines[i + 1].trim() : '';
        if (nextLine.match(/^LAYER \d+:/)) {
          inLayerSection = true;
        }
      }

      // Track brace depth to know when we exit the layer's CSS rules
      if (inLayerSection) {
        if (line.includes('{')) {
          braceDepth += (line.match(/{/g) || []).length;
        }
        if (line.includes('}')) {
          braceDepth -= (line.match(/}/g) || []).length;
        }

        // When we exit the layer section (all braces closed and we hit a non-layer marker)
        if (braceDepth === 0 && line.match(/^\/\* ========================================================================$/) && i > 0) {
          const nextLine = i + 1 < lines.length ? lines[i + 1].trim() : '';
          if (!nextLine.match(/^LAYER \d+:/)) {
            // This is the start of non-token CSS
            lastLayerEndIndex = i;
            break;
          }
        }
      }
    }

    // Extract everything from the non-token section onwards
    if (lastLayerEndIndex > 0 && lastLayerEndIndex < lines.length) {
      const nonTokenCSS = lines.slice(lastLayerEndIndex).join('\n');
      console.log('✓ Preserved existing non-token CSS\n');
      return nonTokenCSS;
    }

    return '';
  } catch (error) {
    console.error('⚠️  Error reading existing file:', error.message);
    return '';
  }
}

/**
 * Build the complete c2s2a.css file
 */
function buildC2S2AFile() {
  console.log('🔨 Building C2S2A stylesheet...\n');

  // Extract any existing non-token CSS
  const existingStyles = extractExistingStyles();

  let output = buildHeader();

  // Layer 1: Primitives
  output += buildSection(
    1,
    'PRIMITIVES',
    'Raw values - foundation for all other tokens',
    TOKEN_FILES.primitives,
    ['Non-color', 'Light Mode', 'Dark Mode'],
  );

  // Layer 2: Semantic
  output += buildSection(
    2,
    'SEMANTIC TOKENS',
    'Meaning-based mappings that reference primitives',
    TOKEN_FILES.semantic,
    ['Non-color', 'Light Mode', 'Dark Mode'],
  );

  // Merge all duplicate :root selectors in the token sections
  const merged = mergeRootSelectors(output);

  // Fix empty lines for linter compliance in token sections
  const tokensWithFixedLines = fixEmptyLines(merged);

  // Append preserved non-token CSS (if any)
  if (existingStyles) {
    return `${tokensWithFixedLines}\n${existingStyles}`;
  }

  return tokensWithFixedLines;
}

/**
 * Write the output file
 */
function writeOutputFile(content, hasPreservedStyles) {
  try {
    fs.writeFileSync(OUTPUT_FILE, content, 'utf8');
    console.log(`✅ Successfully built: ${path.relative(process.cwd(), OUTPUT_FILE)}`);

    // Count the token files included
    const totalFiles = Object.values(TOKEN_FILES).flat().length;
    console.log(`📦 Combined ${totalFiles} token files`);
    console.log('\n📋 Token layers included:');
    console.log(`   • Primitives: ${TOKEN_FILES.primitives.length} files`);
    console.log(`   • Semantic: ${TOKEN_FILES.semantic.length} files`);

    if (hasPreservedStyles) {
      console.log('\n🔒 Non-token CSS preserved');
    }
  } catch (error) {
    console.error('❌ Error writing output file:', error.message);
    process.exit(1);
  }
}

/**
 * Verify all token files exist
 */
function verifyTokenFiles() {
  const allFiles = Object.values(TOKEN_FILES).flat();
  const missing = [];

  allFiles.forEach((filename) => {
    const filePath = path.join(DEPS_DIR, filename);
    if (!fs.existsSync(filePath)) {
      missing.push(filename);
    }
  });

  if (missing.length > 0) {
    console.error('❌ Missing token files:');
    missing.forEach((file) => console.error(`   • ${file}`));
    process.exit(1);
  }

  console.log(`✓ All ${allFiles.length} token files found in deps/\n`);
}

/**
 * Main execution
 */
function main() {
  console.log('C2S2A Build Script');
  console.log('==================\n');

  // Verify all files exist
  verifyTokenFiles();

  // Check if there are existing styles to preserve
  const hasExistingFile = fs.existsSync(OUTPUT_FILE);

  // Build the combined CSS
  const content = buildC2S2AFile();

  // Write to output file
  writeOutputFile(content, hasExistingFile);

  console.log('\n💡 Tip: Run "npm run lint:css" to verify the output\n');
}

// Run the script
main();
