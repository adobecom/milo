// ── Demo fixtures — faithful, real-shaped session data for the stubbed demo ────
//
// These power the smoke-and-mirrors demo: clicking Generate on either entry
// point plays one of these back on a compressed clock (see demoApi.ts) instead
// of hitting the page-forge server (which does the real 30-min, paid run).
//
// Every shape here mirrors the REAL server contract so the existing UI lights
// up unchanged:
//   • counters       → shared/match/negotiate.js::computeCounters
//   • sections        → shared/match/matcher.js decision vocabulary
//   • shipped         → page-forge/server/server.js (the deploy write, ~L1300)
//   • fidelity        → RenderFidelity (combined = MISMATCH; ≥75% visual = "ready")
//
// The Figma fixture uses Brad's ACTUAL run (the Hub-—-A.com frame → the real
// forge-plans / forge-whatsnew / forge-workfaster blocks on the Milo fork branch
// forge-session-3adcf0f2-mqjya6fg). The URL fixtures are representative.

import type {
  CandidateBlock,
  CandidateTrigger,
  ForgeEngine,
  ForgeSource,
  IntentPolicy,
  PromotionLedgerEntry,
  RenderFidelity,
  SessionVersion,
} from '../types';
// A finished-page screenshot, inlined as a base64 data URI (see forge-demo-page.ts
// for why it's inlined rather than a bundled asset). Stands in for the real
// per-session render the server can't produce in a stubbed run, so the result
// preview shows a real page instead of the generic CSS skeleton.
import { DEMO_PAGE_IMAGE as demoPageImg } from './forge-demo-page';
// The reimagine fixtures show a distinct, bolder Stardust redesign (dust-1) so the
// Reimagine result preview doesn't reuse the Match page's screenshot.
import { REIMAGINE_PAGE_IMAGE as reimaginePageImg } from './forge-reimagine-page';
// The three Stardust directions for the inside.adobe.com reimagine run.
import { REIMAGINE_VARIANTS } from './forge-reimagine-variants';

export type DemoFlow = 'figma' | 'figma-reimagine' | 'url-match' | 'url-fidelity' | 'url-reimagine';

export interface DemoSectionRow {
  index: number;
  score?: number | null;
  block?: string | null;
  decision: string;
  variantClasses?: string[];
}

export interface DemoMatchReport {
  counters: {
    reusableBlocksUsed: number;
    newBlocksCreated: number;
    totalSections: number;
    reuseRate: number;
  };
  sections: DemoSectionRow[];
  newBlockTasks: Array<{ index: number; blockName: string }>;
}

export interface DemoUsage {
  durationMs: number;
  costUsd: number;
  numTurns: number;
  inputTokens: number;
  outputTokens: number;
}

export interface DemoFixture {
  flow: DemoFlow;
  source: ForgeSource;
  label: string;
  // The intent this flow represents + the engine that produced it. Stamped onto
  // the demo session/versions so the result chip, summary verb, and Stardust
  // attribution render. 'stardust' engine co-occurs ONLY with 'reimagine'.
  intentPolicy: IntentPolicy;
  engine: ForgeEngine;
  // Sections restyled to fit an approved block (accepted drift) — conformance
  // honesty. 0 for fidelity/reimagine where drift isn't the framing.
  driftCount: number;
  // Newly-authored blocks framed as promotion candidates (ROADMAP framing; the
  // block names themselves are REAL artifacts). Empty when nothing new was needed.
  candidateBlocks: CandidateBlock[];
  // How long the (compressed) generation beat runs before the deploy gate.
  genDurationMs: number;
  // How long the (compressed) deploy beat runs before the live result.
  deployDurationMs: number;
  versions: SessionVersion[];
  matchReport: DemoMatchReport;
  fidelity: RenderFidelity;
  miloBlockCount: number;
  // Finished-page screenshot shown in the result preview (crop of a real page).
  previewImage: string;
  // Reimagine-only: the Stardust directions, each with a thumbnail + hosted page
  // file (resolved to an absolute href by demoApi). Undefined for non-reimagine.
  reimagineVariants?: typeof import('./forge-reimagine-variants').REIMAGINE_VARIANTS;
  // The final `shipped` object once deployed (server.js deploy write shape).
  shipped: Record<string, unknown>;
  // Friendly, path-free lines revealed across the generation beat (activityText
  // drops anything with a path / shell / JSON, so keep these clean prose).
  genMessages: string[];
  deployMessages: string[];
  finalUsage: DemoUsage;
}

// ── Brad's real Figma run ──────────────────────────────────────────────────────

const FIGMA: DemoFixture = {
  flow: 'figma',
  source: 'figma',
  label: 'Hub — A.com',
  intentPolicy: 'conformance',
  engine: 'matcher',
  // Two loose-variant rows (sections 2 + 7) were restyled to fit — accepted drift.
  driftCount: 2,
  // 3 new blocks authored under conformance → coverage gaps (the strongest
  // promotion candidates). forge-plans recurs (seen across runs) to seed the
  // thesis: recurring coverage-gap blocks are the best promotion candidates.
  candidateBlocks: [
    { blockName: 'forge-whatsnew', trigger: 'coverage-gap', recurrenceCount: 1, status: 'candidate' },
    { blockName: 'forge-plans', trigger: 'coverage-gap', recurrenceCount: 3, status: 'candidate' },
    { blockName: 'forge-workfaster', trigger: 'coverage-gap', recurrenceCount: 1, status: 'candidate' },
  ],
  genDurationMs: 19500,
  deployDurationMs: 5500,
  versions: [
    {
      v: 1,
      intent: 'Hub — A.com',
      producedAt: '2026-06-18T22:00:00.000Z',
      intentPolicy: 'conformance',
      engine: 'matcher',
      summary:
        'Rebuilt the Hub frame as a Milo page — 4 sections reused approved blocks, 3 authored as new forge-* blocks.',
    },
  ],
  matchReport: {
    counters: {
      reusableBlocksUsed: 4,
      newBlocksCreated: 3,
      totalSections: 7,
      reuseRate: 4 / 7,
    },
    sections: [
      { index: 1, score: 0.93, block: 'marquee', decision: 'tight-variant' },
      { index: 2, score: 0.81, block: 'media', decision: 'loose-variant', variantClasses: ['dark'] },
      { index: 3, decision: 'new-block' },
      { index: 4, decision: 'new-block' },
      { index: 5, score: 0.88, block: 'text', decision: 'tight-variant' },
      { index: 6, decision: 'new-block' },
      { index: 7, score: 0.76, block: 'aside', decision: 'loose-variant', variantClasses: ['notification'] },
    ],
    newBlockTasks: [
      { index: 3, blockName: 'forge-whatsnew' },
      { index: 4, blockName: 'forge-plans' },
      { index: 6, blockName: 'forge-workfaster' },
    ],
  },
  fidelity: { combined: 0.12, textPresence: 0.96, pixelMismatch: 0.14, presenceMeasured: true },
  miloBlockCount: 3,
  previewImage: demoPageImg,
  shipped: {
    slug: 'figma-3adcf0',
    branchName: 'forge-session-3adcf0f2-mqjya6fg',
    branchUrl: 'https://github.com/fullcolorcoder/milo/tree/forge-session-3adcf0f2-mqjya6fg',
    sha: '6dfa28b80b511b4b8ab1c034647962ee1297c9d7',
    daPath: '/drafts/bradjohn/forge/figma-3adcf0',
    daUrl: 'https://da.live/edit#/adobecom/da-playground/drafts/bradjohn/forge/figma-3adcf0',
    daPreviewUrl: 'http://localhost:3000/drafts/bradjohn/forge/figma-3adcf0?milolibs=local',
    prototypeUrl: 'http://localhost:3000/drafts/bradjohn/forge/figma-3adcf0?milolibs=local',
    milolibsUrl: 'http://localhost:3000/drafts/bradjohn/forge/figma-3adcf0?milolibs=local',
    remotePreviewUrl:
      'https://forge-session-3adcf0f2-mqjya6fg--milo--fullcolorcoder.aem.page/drafts/bradjohn/forge/figma-3adcf0',
    miloBlockCount: 3,
    miloBlocks: ['forge-whatsnew', 'forge-plans', 'forge-workfaster'],
  },
  genMessages: [
    'Reading your Figma frame…',
    'Found 7 sections in the design.',
    'Matched the hero to the marquee block.',
    'Reused the media and text blocks with small style tweaks.',
    'Nothing in the library fit 3 sections — authoring new blocks.',
    'Authoring forge-whatsnew…',
    'Authoring forge-plans…',
    'Authoring forge-workfaster…',
    'Checking the page against your design…',
  ],
  deployMessages: [
    'Sending the page to Authoring…',
    'Shipping 3 new blocks to Milo…',
    'Getting your draft ready in DA…',
  ],
  finalUsage: {
    durationMs: 13000,
    costUsd: 6.40,
    numTurns: 38,
    inputTokens: 612000,
    outputTokens: 84000,
  },
};

// ── URL → Match (the cheap, deterministic, high-reuse flow) ────────────────────

const URL_MATCH: DemoFixture = {
  flow: 'url-match',
  source: 'url',
  label: 'acrobat/online.html',
  intentPolicy: 'conformance',
  engine: 'matcher',
  // One loose-variant row (section 5) was restyled to fit.
  driftCount: 1,
  // The MATCH spine: nothing new was needed → no candidates. The flywheel strip
  // still renders, teaching that "nothing new" is the goal.
  candidateBlocks: [],
  genDurationMs: 12000,
  deployDurationMs: 5000,
  versions: [
    {
      v: 1,
      intent: null,
      producedAt: '2026-06-18T22:10:00.000Z',
      intentPolicy: 'conformance',
      engine: 'matcher',
      summary: 'Recreated the page 1:1 in DA — every section reused an approved block.',
    },
  ],
  matchReport: {
    counters: {
      reusableBlocksUsed: 6,
      newBlocksCreated: 0,
      totalSections: 6,
      reuseRate: 1,
    },
    sections: [
      { index: 1, score: 0.96, block: 'marquee', decision: 'tight-variant' },
      { index: 2, score: 0.91, block: 'media', decision: 'tight-variant' },
      { index: 3, score: 0.89, block: 'cards', decision: 'tight-variant' },
      { index: 4, score: 0.94, block: 'text', decision: 'tight-variant' },
      { index: 5, score: 0.87, block: 'aside', decision: 'loose-variant', variantClasses: ['notification'] },
      { index: 6, score: 0.9, block: 'marquee', decision: 'tight-variant', variantClasses: ['small'] },
    ],
    newBlockTasks: [],
  },
  fidelity: { combined: 0.05, textPresence: 0.99, pixelMismatch: 0.06, presenceMeasured: true },
  miloBlockCount: 0,
  previewImage: demoPageImg,
  shipped: {
    slug: 'online',
    branchName: 'forge-session-match-online',
    branchUrl: 'https://github.com/fullcolorcoder/milo/tree/forge-session-match-online',
    sha: 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0',
    daPath: '/drafts/forge/online',
    daUrl: 'https://da.live/edit#/adobecom/da-playground/drafts/forge/online',
    daPreviewUrl: 'http://localhost:3000/drafts/forge/online?milolibs=local',
    prototypeUrl: 'http://localhost:3000/drafts/forge/online?milolibs=local',
    milolibsUrl: 'http://localhost:3000/drafts/forge/online?milolibs=local',
    remotePreviewUrl: 'https://main--da-playground--adobecom.aem.page/drafts/forge/online',
    miloBlockCount: 0,
    miloBlocks: [],
  },
  genMessages: [
    'Fetching the page…',
    'Found 6 sections.',
    'Matching each section to an approved block…',
    'Hero → marquee. Gallery → media. Cards → cards.',
    'Every section matched — no new blocks needed.',
    'Recreating the page 1:1 in DA…',
  ],
  deployMessages: [
    'Sending the page to Authoring…',
    'Getting your draft ready in DA…',
  ],
  finalUsage: {
    durationMs: 8000,
    costUsd: 0.90,
    numTurns: 11,
    inputTokens: 142000,
    outputTokens: 18000,
  },
};

// ── URL → Fidelity (Match my design — faithful 1:1, many one-off new blocks) ───
// The "Match my design" stop on the URL door. Same matcher engine as conformance,
// tuned for fidelity over reuse: most sections become new blocks BY DESIGN (each a
// one-off for this page). Cost sits between Match (cheap) and Reimagine (priciest).

const URL_FIDELITY: DemoFixture = {
  flow: 'url-fidelity',
  source: 'url',
  label: 'commerce/pricing.html',
  intentPolicy: 'fidelity',
  engine: 'matcher',
  // Fidelity isn't framed as drift — we authored to match, we didn't accept drift.
  driftCount: 0,
  // Many one-off new blocks BY DESIGN → bespoke-oneoff candidates (real code, but
  // built for this page; they earn a shared slot only by recurrence + review).
  candidateBlocks: [
    { blockName: 'forge-pricing-tiers', trigger: 'bespoke-oneoff', recurrenceCount: 1, status: 'candidate' },
    { blockName: 'forge-compare-grid', trigger: 'bespoke-oneoff', recurrenceCount: 1, status: 'candidate' },
    { blockName: 'forge-faq-accordion', trigger: 'bespoke-oneoff', recurrenceCount: 1, status: 'candidate' },
  ],
  genDurationMs: 17000,
  deployDurationMs: 5500,
  versions: [
    {
      v: 1,
      intent: 'Match my design as closely as possible.',
      producedAt: '2026-06-18T22:15:00.000Z',
      intentPolicy: 'fidelity',
      engine: 'matcher',
      summary:
        'Built to match your design. Reused 2 approved blocks, authored 3 new ones to hit the layout exactly.',
    },
  ],
  matchReport: {
    counters: {
      reusableBlocksUsed: 2,
      newBlocksCreated: 3,
      totalSections: 5,
      reuseRate: 2 / 5,
    },
    sections: [
      { index: 1, score: 0.9, block: 'marquee', decision: 'tight-variant' },
      { index: 2, decision: 'new-block' },
      { index: 3, decision: 'new-block' },
      { index: 4, score: 0.85, block: 'text', decision: 'tight-variant' },
      { index: 5, decision: 'new-block' },
    ],
    newBlockTasks: [
      { index: 2, blockName: 'forge-pricing-tiers' },
      { index: 3, blockName: 'forge-compare-grid' },
      { index: 5, blockName: 'forge-faq-accordion' },
    ],
  },
  fidelity: { combined: 0.08, textPresence: 0.98, pixelMismatch: 0.09, presenceMeasured: true },
  miloBlockCount: 3,
  previewImage: demoPageImg,
  shipped: {
    slug: 'pricing',
    branchName: 'forge-session-fidelity-pricing',
    branchUrl: 'https://github.com/fullcolorcoder/milo/tree/forge-session-fidelity-pricing',
    sha: 'b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1',
    daPath: '/drafts/forge/pricing',
    daUrl: 'https://da.live/edit#/adobecom/da-playground/drafts/forge/pricing',
    daPreviewUrl: 'http://localhost:3000/drafts/forge/pricing?milolibs=local',
    prototypeUrl: 'http://localhost:3000/drafts/forge/pricing?milolibs=local',
    milolibsUrl: 'http://localhost:3000/drafts/forge/pricing?milolibs=local',
    remotePreviewUrl: 'https://main--da-playground--adobecom.aem.page/drafts/forge/pricing',
    miloBlockCount: 3,
    miloBlocks: ['forge-pricing-tiers', 'forge-compare-grid', 'forge-faq-accordion'],
  },
  genMessages: [
    'Fetching the page…',
    'Found 5 sections.',
    'You asked us to match your design, so we are authoring blocks to hit it exactly.',
    'Hero and one text section fit approved blocks.',
    'Authoring forge-pricing-tiers…',
    'Authoring forge-compare-grid…',
    'Authoring forge-faq-accordion…',
    'Checking the page against your design…',
  ],
  deployMessages: [
    'Sending the page to Authoring…',
    'Shipping 3 new blocks to Milo…',
    'Getting your draft ready in DA…',
  ],
  finalUsage: {
    durationMs: 11500,
    costUsd: 4.20,
    numTurns: 29,
    inputTokens: 486000,
    outputTokens: 71000,
  },
};

// ── URL → Reimagine (the redesign flow — pricier, more authored blocks) ────────

const URL_REIMAGINE: DemoFixture = {
  flow: 'url-reimagine',
  source: 'url',
  label: 'inside.adobe.com',
  intentPolicy: 'reimagine',
  engine: 'stardust',
  // Reimagine isn't framed as drift (it's a redesign, not a faithful match).
  driftCount: 0,
  // Stardust reimagined the inside.adobe.com employee portal in THREE directions
  // (see reimagineVariants). 4 new blocks. forge-feature-grid recurs (count 2: a
  // news/feature card grid also came out of the Figma reimagine run) — a card grid
  // is a genuinely recurring layout, so it's the strongest promotion candidate and
  // the through-line into the Design system view (PROMOTION_LEDGER below).
  candidateBlocks: [
    { blockName: 'forge-feature-grid', trigger: 'reimagine', recurrenceCount: 2, status: 'candidate' },
    { blockName: 'forge-portal-hero', trigger: 'reimagine', recurrenceCount: 1, status: 'candidate' },
    { blockName: 'forge-news-rail', trigger: 'reimagine', recurrenceCount: 1, status: 'candidate' },
    { blockName: 'forge-dashboard-cards', trigger: 'reimagine', recurrenceCount: 1, status: 'candidate' },
  ],
  genDurationMs: 24000,
  deployDurationMs: 6000,
  versions: [
    {
      v: 1,
      intent: 'Reimagine inside.adobe.com',
      producedAt: '2026-06-18T22:20:00.000Z',
      intentPolicy: 'reimagine',
      engine: 'stardust',
      summary:
        'Reimagined the inside.adobe.com portal on our brand, in three directions. Kept 2 sections on approved blocks, authored 4 new ones.',
    },
  ],
  matchReport: {
    counters: {
      reusableBlocksUsed: 2,
      newBlocksCreated: 4,
      totalSections: 6,
      reuseRate: 2 / 6,
    },
    // Mapped to the portal top-to-bottom: welcome header (reused marquee), the
    // hero/featured story, the news card grid, the news rail, the dashboard cards,
    // and the footer (reused text).
    sections: [
      { index: 1, score: 0.74, block: 'marquee', decision: 'loose-variant', variantClasses: ['portal'] },
      { index: 2, decision: 'new-block' },
      { index: 3, decision: 'new-block' },
      { index: 4, decision: 'new-block' },
      { index: 5, decision: 'new-block' },
      { index: 6, score: 0.7, block: 'text', decision: 'loose-variant', variantClasses: ['footer'] },
    ],
    newBlockTasks: [
      { index: 2, blockName: 'forge-portal-hero' },
      { index: 3, blockName: 'forge-feature-grid' },
      { index: 4, blockName: 'forge-news-rail' },
      { index: 5, blockName: 'forge-dashboard-cards' },
    ],
  },
  fidelity: { combined: 0.22, textPresence: 0.93, pixelMismatch: 0.24, presenceMeasured: true },
  miloBlockCount: 4,
  // The result preview shows the first Stardust direction's thumbnail; the variant
  // strip (REIMAGINE_VARIANTS) lets the presenter swap and open each real hosted
  // prototype page live.
  previewImage: REIMAGINE_VARIANTS[0].thumb,
  reimagineVariants: REIMAGINE_VARIANTS,
  shipped: {
    slug: 'inside-reimagined',
    branchName: 'forge-session-reimagine-inside',
    branchUrl: 'https://github.com/fullcolorcoder/milo/tree/forge-session-reimagine-inside',
    sha: 'f9e8d7c6b5a4039281706f5e4d3c2b1a09f8e7d6',
    daPath: '/drafts/forge/inside-reimagined',
    daUrl: 'https://da.live/edit#/adobecom/da-playground/drafts/forge/inside-reimagined',
    daPreviewUrl: 'http://localhost:3000/drafts/forge/inside-reimagined?milolibs=local',
    prototypeUrl: 'http://localhost:3000/drafts/forge/inside-reimagined?milolibs=local',
    milolibsUrl: 'http://localhost:3000/drafts/forge/inside-reimagined?milolibs=local',
    remotePreviewUrl: 'https://main--da-playground--adobecom.aem.page/drafts/forge/inside-reimagined',
    miloBlockCount: 4,
    miloBlocks: ['forge-feature-grid', 'forge-portal-hero', 'forge-news-rail', 'forge-dashboard-cards'],
  },
  genMessages: [
    'Fetching inside.adobe.com…',
    'Reading the layout and content…',
    'Exploring directions on our brand…',
    'Direction 1: editorial. Direction 2: card grid. Direction 3: featured.',
    'Authoring forge-portal-hero…',
    'Authoring forge-feature-grid…',
    'Authoring forge-news-rail…',
    'Authoring forge-dashboard-cards…',
    'Checking the redesign against the original…',
  ],
  deployMessages: [
    'Sending the redesign to Authoring…',
    'Shipping 4 new blocks to Milo…',
    'Getting your draft ready in DA…',
  ],
  finalUsage: {
    durationMs: 16000,
    costUsd: 14.41,
    numTurns: 64,
    inputTokens: 1180000,
    outputTokens: 156000,
  },
};

// ── Figma → Reimagine (Stardust redesigns from a Figma frame) ──────────────────
// The "Reimagine" stop on the Figma door. Stardust takes the extracted frame HTML
// and redesigns it from scratch on the brand — same engine as the URL reimagine,
// fed by the frame instead of a crawl. Many authored blocks; pricey.

const FIGMA_REIMAGINE: DemoFixture = {
  flow: 'figma-reimagine',
  source: 'figma',
  label: 'Hub — reimagined',
  intentPolicy: 'reimagine',
  engine: 'stardust',
  driftCount: 0,
  // Shares the same reimagined Express-style preview, so it shares the recurring
  // forge-feature-grid (this is the 2nd run that produced it → recurrenceCount 2,
  // consistent with URL_REIMAGINE) plus two blocks from the frame's own content.
  candidateBlocks: [
    { blockName: 'forge-feature-grid', trigger: 'reimagine', recurrenceCount: 2, status: 'candidate' },
    { blockName: 'forge-audience-cards', trigger: 'reimagine', recurrenceCount: 1, status: 'candidate' },
    { blockName: 'forge-proof-stats', trigger: 'reimagine', recurrenceCount: 1, status: 'candidate' },
  ],
  genDurationMs: 23000,
  deployDurationMs: 6000,
  versions: [
    {
      v: 1,
      intent: 'Reimagine the Hub frame on the brand.',
      producedAt: '2026-06-18T22:25:00.000Z',
      intentPolicy: 'reimagine',
      engine: 'stardust',
      summary:
        'Reimagined the Hub frame on our brand. Kept 2 sections on approved blocks, authored 3 new ones.',
    },
  ],
  matchReport: {
    counters: {
      reusableBlocksUsed: 2,
      newBlocksCreated: 3,
      totalSections: 5,
      reuseRate: 2 / 5,
    },
    sections: [
      { index: 1, score: 0.74, block: 'marquee', decision: 'loose-variant', variantClasses: ['bold'] },
      { index: 2, decision: 'new-block' },
      { index: 3, decision: 'new-block' },
      { index: 4, score: 0.7, block: 'text', decision: 'loose-variant', variantClasses: ['center'] },
      { index: 5, decision: 'new-block' },
    ],
    newBlockTasks: [
      { index: 2, blockName: 'forge-feature-grid' },
      { index: 3, blockName: 'forge-audience-cards' },
      { index: 5, blockName: 'forge-proof-stats' },
    ],
  },
  fidelity: { combined: 0.26, textPresence: 0.9, pixelMismatch: 0.28, presenceMeasured: true },
  miloBlockCount: 3,
  previewImage: reimaginePageImg,
  shipped: {
    slug: 'hub-reimagined',
    branchName: 'forge-session-reimagine-hub',
    branchUrl: 'https://github.com/fullcolorcoder/milo/tree/forge-session-reimagine-hub',
    sha: 'c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2',
    daPath: '/drafts/forge/hub-reimagined',
    daUrl: 'https://da.live/edit#/adobecom/da-playground/drafts/forge/hub-reimagined',
    daPreviewUrl: 'http://localhost:3000/drafts/forge/hub-reimagined?milolibs=local',
    prototypeUrl: 'http://localhost:3000/drafts/forge/hub-reimagined?milolibs=local',
    milolibsUrl: 'http://localhost:3000/drafts/forge/hub-reimagined?milolibs=local',
    remotePreviewUrl: 'https://main--da-playground--adobecom.aem.page/drafts/forge/hub-reimagined',
    miloBlockCount: 3,
    miloBlocks: ['forge-feature-grid', 'forge-audience-cards', 'forge-proof-stats'],
  },
  genMessages: [
    'Rendering your Figma frame…',
    'Reading the layout and content…',
    'Reimagining it on our brand…',
    'Keeping the hero and the closing CTA on approved blocks.',
    'Authoring forge-feature-grid…',
    'Authoring forge-audience-cards…',
    'Authoring forge-proof-stats…',
    'Checking the redesign against your frame…',
  ],
  deployMessages: [
    'Sending the redesign to Authoring…',
    'Shipping 3 new blocks to Milo…',
    'Getting your draft ready in DA…',
  ],
  finalUsage: {
    durationMs: 15000,
    costUsd: 14.80,
    numTurns: 57,
    inputTokens: 980000,
    outputTokens: 138000,
  },
};

// ── Selection ───────────────────────────────────────────────────────────────────

const FIXTURES: Record<DemoFlow, DemoFixture> = {
  figma: FIGMA,
  'figma-reimagine': FIGMA_REIMAGINE,
  'url-match': URL_MATCH,
  'url-fidelity': URL_FIDELITY,
  'url-reimagine': URL_REIMAGINE,
};

// Map a createSession body to the right fixture. `source` may arrive as the UI's
// 'eds-url' id or the server's 'url'/'html'.
//
// The entry now writes an explicit `intentPolicy` (the 2-stop dial → conformance |
// fidelity; the Reimagine/Stardust lane → reimagine), so we branch on that FIRST.
// The legacy note-heuristic (an `intent` string present) is kept only as a fallback
// for any older/real body that predates the explicit field.
export function pickFixture(
  source: string,
  sourceInput: Record<string, unknown>,
): DemoFixture {
  const isFigma = source === 'figma' || Boolean(sourceInput.figmaUrl);
  const policy = sourceInput.intentPolicy as IntentPolicy | undefined;

  if (isFigma) {
    // Figma now carries the full dial. Reimagine routes to its own Stardust shape;
    // conformance/fidelity share the FIGMA page shape (the snapshot re-stamps the
    // chosen policy + remaps candidate triggers so the result reads correctly).
    if (policy === 'reimagine') return FIXTURES['figma-reimagine'];
    return FIXTURES.figma;
  }

  if (policy === 'reimagine') return FIXTURES['url-reimagine'];
  if (policy === 'fidelity') return FIXTURES['url-fidelity'];
  if (policy === 'conformance') return FIXTURES['url-match'];

  // Legacy fallback: a redesign direction in `intent` → the reimagine fixture;
  // otherwise the high-reuse Match fixture (the closest thing to a 1:1 recreation).
  const hasDirection = Boolean(String(sourceInput.intent || '').trim());
  return hasDirection ? FIXTURES['url-reimagine'] : FIXTURES['url-match'];
}

// The candidate trigger implied by the chosen intent — so a new block reads
// honestly for the run that produced it (conformance gap, fidelity one-off,
// reimagine redesign). Used by the demo snapshot to re-stamp the fixture's blocks
// when the user's choice differs from the fixture's baked default.
export function triggerForPolicy(policy: IntentPolicy): CandidateTrigger {
  if (policy === 'fidelity') return 'bespoke-oneoff';
  if (policy === 'reimagine') return 'reimagine';
  return 'coverage-gap';
}

// ── Promotion ledger (demo-only, ROADMAP) ─────────────────────────────────────
// A standing illustration of the (UNBUILT) promotion lifecycle for the Design
// system view: blocks across runs at each lifecycle stage. ENTIRELY a UI mockup of
// the thesis — never sent to or read from the server. Sorted thesis-first
// (coverage-gap is the strongest candidate, reimagine the weakest). Exactly one row
// per non-shipped status so the view can teach the shape without faking volume.
const PROMOTION_LEDGER: PromotionLedgerEntry[] = [
  // The ONLY promoted example is illustrative — hard-labeled in the UI as such,
  // because no block has actually been promoted (the lane doesn't exist).
  { blockName: 'forge-plans', trigger: 'coverage-gap', recurrenceCount: 3, status: 'candidate', origin: 'from the Hub run' },
  { blockName: 'forge-whatsnew', trigger: 'coverage-gap', recurrenceCount: 1, status: 'candidate', origin: 'from the Hub run' },
  { blockName: 'forge-pricing-tiers', trigger: 'bespoke-oneoff', recurrenceCount: 1, status: 'candidate', origin: 'from the pricing run' },
  // The reimagine candidate is the SAME block the Reimagine run authors on stage
  // (forge-feature-grid), so the flywheel reads continuously: you make it in the
  // demo, then find it waiting here in the library. It recurs (2 runs), which is
  // why it's the strongest reimagine candidate.
  { blockName: 'forge-feature-grid', trigger: 'reimagine', recurrenceCount: 2, status: 'candidate', origin: 'from the Reimagine runs' },
];

export { FIXTURES, PROMOTION_LEDGER };
