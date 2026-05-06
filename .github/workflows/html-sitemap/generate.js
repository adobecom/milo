#!/usr/bin/env node

import process from 'node:process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runExtract } from './lib/stages/extract.js';
import { runClean } from './lib/stages/clean.js';
import { runTransformData } from './lib/stages/transform-data.js';
import { runTransformDa } from './lib/stages/transform-da.js';
import { runDiff } from './lib/output/diff.js';
import { runPush } from './lib/stages/push.js';
import { runPromote } from './lib/stages/promote.js';
import { parsePositionalStages, parseStagesOption, STAGE_ORDER } from './lib/util/stages.js';

/**
 * @typedef {import('./lib/util/stages.js').StageId} StageId
 */

const DEFAULT_CONFIG = 'https://main--federal--adobecom.aem.live/federal/assets/data/html-sitemap.json';
const DEFAULT_OUTPUT = 'tmp/html-sitemap';

/**
 * @typedef {Object} ParsedArgs
 * @property {string} [stage]
 * @property {string} [mode]
 * @property {StageId[]} stages
 * @property {boolean} help
 * @property {{ config: string, output: string, subdomain?: string, geo?: string, daRoot?: string, stages?: string, force: boolean }} options
 */

/**
 * @param {string} value
 * @returns {string}
 */
function normalizeGeoOption(value) {
  if (value === 'default' || value === 'root') return '';
  return value;
}

/**
 * @returns {string}
 */
function getHelpText() {
  return `HTML Sitemap Generator

Usage:
  node --env-file=.env generate.js [options]                       # full pipeline
  node --env-file=.env generate.js [stage] [mode] [options]        # narrow to a stage
  node --env-file=.env generate.js --stages <list> [options]       # narrow to a list

Stages:
  clean            Delete generated output data under --output
  extract          Fetch config, GNAV fragments, and query index files
  transform-data   Build normalized sitemap.json from extracted inputs
  transform-da     Build sitemap.html from sitemap.json
  diff             Compare local sitemap.html against remote DA content
  push             Upload sitemap.html to DA under --da-root
  preview          Trigger AEM preview for pushed pages
  publish          Trigger AEM publish for previewed pages

Options:
  --config <url|path>   Sitemap config JSON (default: ${DEFAULT_CONFIG})
  --output <dir>        Root directory for generated files (default: ${DEFAULT_OUTPUT})
  --subdomain <name>       Filter to a single subdomain: www | business
  --geo <prefix>        Filter to a single base geo (e.g. fr, de, default)
  --da-root <path>      Remote DA folder root for diff/push/preview/publish
  --force               Push even if remote content is unchanged
  --stages <list>       Comma-separated stage ids (override; omit to run all)
  -h, --help            Show this help

Notes:
  Stages and config:
    Omit --stages (and positional stage args) to run the full pipeline.
    Per-geo delivery scope is gated by the config's geo-map.stage column
    (preview / publish / empty), so the full pipeline is the safe default.
    --stages is an override for narrowing scope during local development.

  Positional stage shortcuts:
    transform data -> transform-data
    transform da   -> transform-da
    transform      -> transform-data,transform-da
  Positional stage mode and --stages are mutually exclusive.

Examples:
  node --env-file=.env generate.js extract --subdomain www --geo fr
  node --env-file=.env generate.js transform --subdomain www --geo fr
  node --env-file=.env generate.js push --subdomain business --geo default --da-root /drafts/hgpa/html-sitemap
  node --env-file=.env generate.js preview --subdomain business --geo default --da-root /drafts/hgpa/html-sitemap
  node --env-file=.env generate.js publish --subdomain business --geo default --da-root /drafts/hgpa/html-sitemap`;
}

/**
 * @param {string[]} argv
 * @returns {ParsedArgs}
 */
function parseArgs(argv) {
  const positional = [];
  /** @type {ParsedArgs['options']} */
  const options = {
    config: DEFAULT_CONFIG,
    output: DEFAULT_OUTPUT,
    subdomain: undefined,
    geo: undefined,
    daRoot: undefined,
    stages: undefined,
    force: false,
  };
  let help = false;

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '-h' || arg === '--help') {
      help = true;
      continue;
    }
    if (arg === '--force') {
      options.force = true;
      continue;
    }
    if (!arg.startsWith('--')) {
      positional.push(arg);
      continue;
    }

    const value = argv[index + 1];
    if (!value || value.startsWith('--')) {
      throw new Error(`Missing value for ${arg}`);
    }

    switch (arg) {
      case '--config':
        options.config = value;
        break;
      case '--output':
        options.output = value;
        break;
      case '--subdomain':
        options.subdomain = value;
        break;
      case '--geo':
        options.geo = normalizeGeoOption(value);
        break;
      case '--da-root':
        options.daRoot = value;
        break;
      case '--stages':
        options.stages = value;
        break;
      default:
        throw new Error(`Unknown option: ${arg}`);
    }

    index += 1;
  }

  const [stage, mode] = positional;
  if (options.stages && (stage || mode)) {
    throw new Error('Use either positional stage arguments or `--stages`, not both.');
  }

  return {
    stage,
    mode,
    stages: options.stages ? parseStagesOption(options.stages) : parsePositionalStages(stage, mode),
    help,
    options,
  };
}

/** @type {Set<StageId>} */
const STRICT_DELIVERY_STAGES = new Set(['push', 'preview', 'publish']);

/**
 * @param {StageId} stage
 * @param {boolean} hadFailures
 * @returns {void}
 */
export function handleStageFailures(stage, hadFailures) {
  if (!hadFailures) return;
  process.exitCode = 1;
  if (STRICT_DELIVERY_STAGES.has(stage)) {
    throw new Error(`${stage} failed; stopping pipeline.`);
  }
}

async function main() {
  const { stages: parsedStages, options, help } = parseArgs(process.argv.slice(2));
  // No explicit stage selection => run the full pipeline. Per-geo delivery
  // scope is gated by the config's geo-map.stage column (preview / publish /
  // empty), so this is the safe production default.
  const stages = parsedStages.length ? parsedStages : [...STAGE_ORDER];
  const outputDir = path.resolve(process.cwd(), options.output);

  if (help) {
    console.log(getHelpText());
    return;
  }


  for (const stage of stages) {
    if (stage === 'clean') {
      await runClean({ outputDir });
      continue;
    }

    if (stage === 'extract') {
      const result = await runExtract({
        configRef: options.config,
        outputDir,
        subdomainFilter: options.subdomain,
        geoFilter: options.geo,
      });
      handleStageFailures(stage, result.hadFailures);
      continue;
    }

    const configRef = options.config.startsWith('http')
      ? path.join(outputDir, 'html-sitemap.json')
      : options.config;

    if (stage === 'transform-data') {
      const result = await runTransformData({
        configRef,
        outputDir,
        subdomainFilter: options.subdomain,
        geoFilter: options.geo,
      });
      handleStageFailures(stage, result.hadFailures);
      continue;
    }

    if (stage === 'transform-da') {
      const result = await runTransformDa({
        configRef,
        outputDir,
        subdomainFilter: options.subdomain,
        geoFilter: options.geo,
      });
      handleStageFailures(stage, result.hadFailures);
      continue;
    }

    if (stage === 'diff') {
      if (!options.daRoot) {
        throw new Error('Diff requires `--da-root`.');
      }
      const result = await runDiff({
        configRef,
        outputDir,
        subdomainFilter: options.subdomain,
        geoFilter: options.geo,
        daRoot: options.daRoot,
      });
      handleStageFailures(stage, result.hadFailures);
      continue;
    }

    if (stage === 'push') {
      if (!options.daRoot) {
        throw new Error('Push requires `--da-root`.');
      }
      const result = await runPush({
        configRef,
        outputDir,
        subdomainFilter: options.subdomain,
        geoFilter: options.geo,
        daRoot: options.daRoot,
        force: options.force,
      });
      handleStageFailures(stage, result.hadFailures);
      continue;
    }

    if (stage === 'preview' || stage === 'publish') {
      if (!options.daRoot) {
        throw new Error(`${stage} requires \`--da-root\`.`);
      }
      const result = await runPromote({
        action: stage,
        configRef,
        outputDir,
        subdomainFilter: options.subdomain,
        geoFilter: options.geo,
        daRoot: options.daRoot,
      });
      handleStageFailures(stage, result.hadFailures);
    }
  }
}

/**
 * @returns {boolean}
 */
function isCliEntryPoint() {
  if (!process.argv[1]) return false;
  return path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
}

if (isCliEntryPoint()) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
