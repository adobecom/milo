const TEST_REF = process.env.FG_REF || 'da-floodgate';
const TEST_ORG = process.env.FG_ORG || 'adobecom';
const TEST_REPO = process.env.FG_REPO || 'da-events';
const FG_COLOR = process.env.FG_COLOR || 'pink';

// Test sandbox in the source repo
const TEST_DIR = `/${TEST_ORG}/${TEST_REPO}/drafts/nala-fg-test`;
const FG_DIR = `/${TEST_ORG}/${TEST_REPO}-fg-${FG_COLOR}/drafts/nala-fg-test`;

// ---------------------------------------------------------------------------
// Test file inventory
// ---------------------------------------------------------------------------

// Tier 1: Simple authored test files (created manually)
const SIMPLE = {
  singleBlock: `${TEST_DIR}/test1-single-block`,
  multipleBlocks: `${TEST_DIR}/test2-multiple-blocks`,
  sheetJson: `${TEST_DIR}/test3-sheet.json`,
  withFragments: `${TEST_DIR}/test4-with-fragments`,
  datedPage: `${TEST_DIR}/2024-11-14`,
  fragment: `${TEST_DIR}/fragments/test-fragment-1`,
  imageRoot: `${TEST_DIR}/test1.png`,
  imageAssets: `${TEST_DIR}/assets/001.png`,
  linkFile: `${TEST_DIR}/google.link`,
};

// Tier 2: Real event content (seeded via seed-real-content.js)
// Each event page has known characteristics useful for specific test scenarios.
const EVENTS = {
  summitLondon: `${TEST_DIR}/events/summit-london`, // 31KB, 1 fragment, 3 jpg — standard UK event
  summitMunich: `${TEST_DIR}/events/summit-munich`, // 32KB, 1 fragment, 3 img — DE locale
  creativeCafeNy: `${TEST_DIR}/events/creative-cafe-ny`, // 27KB, 2 fragments (local + shared) — fragment discovery
  creatorLive: `${TEST_DIR}/events/creator-live-london`, // 68KB, 1 fragment, 3 png — largest page
  eventsHub: `${TEST_DIR}/events/events-hub`, // 16KB, CaaS dynamic content — hub page
};

module.exports = {
  FeatureName: 'DA Floodgate',
  testRef: TEST_REF,
  testOrg: TEST_ORG,
  testRepo: TEST_REPO,
  fgColor: FG_COLOR,
  testDir: TEST_DIR,
  fgDir: FG_DIR,
  files: SIMPLE,
  events: EVENTS,

  features: [
    // ============================================================
    // Suite A: Page Load & Auth
    // ============================================================
    {
      tcid: 'A1',
      name: '@fg-page-load',
      tags: '@smoke @floodgate @nopr',
      desc: 'Load Floodgate tool after DA login',
    },
    {
      tcid: 'A2',
      name: '@fg-default-copy',
      tags: '@smoke @floodgate @nopr',
      desc: 'Default state is Copy operation',
    },
    {
      tcid: 'A3',
      name: '@fg-switch-promote',
      tags: '@smoke @floodgate @nopr',
      desc: 'Switch to Promote operation',
    },
    {
      tcid: 'A4',
      name: '@fg-switch-delete',
      tags: '@smoke @floodgate @nopr',
      desc: 'Switch to Delete operation',
    },

    // ============================================================
    // Suite B: Path Validation
    // ============================================================
    {
      tcid: 'B1',
      name: '@fg-valid-paths',
      tags: '@regression @floodgate @nopr',
      desc: 'Valid paths enable Start button',
      data: { paths: [SIMPLE.singleBlock] },
    },
    {
      tcid: 'B2',
      name: '@fg-invalid-short-path',
      tags: '@regression @floodgate @nopr',
      desc: 'Path with < 3 parts disables Start',
      data: { paths: ['/org-only'] },
    },
    {
      tcid: 'B3',
      name: '@fg-reject-fg-path',
      tags: '@regression @floodgate @nopr',
      desc: 'Paths with -fg- in repo are rejected',
      data: { paths: [`/${TEST_ORG}/${TEST_REPO}-fg-pink/drafts/nala-fg-test/test1-single-block`] },
    },
    {
      tcid: 'B4',
      name: '@fg-mixed-org-rejected',
      tags: '@regression @floodgate @nopr',
      desc: 'Mixed org/repo paths are rejected',
      data: { paths: [SIMPLE.singleBlock, '/other-org/other-repo/drafts/page2'] },
    },
    {
      tcid: 'B5',
      name: '@fg-aem-url-convert',
      tags: '@regression @floodgate @nopr',
      desc: 'AEM preview URL auto-converted to path',
      data: { aemUrl: `https://main--${TEST_REPO}--${TEST_ORG}.aem.page/drafts/nala-fg-test/test1-single-block` },
    },
    {
      tcid: 'B6',
      name: '@fg-wildcard-path',
      tags: '@regression @floodgate @nopr',
      desc: 'Wildcard path (*) accepted',
      data: { paths: [`${TEST_DIR}/*`] },
    },
    {
      tcid: 'B7',
      name: '@fg-repo-info',
      tags: '@regression @floodgate @nopr',
      desc: 'Repo info shows source and FG repo',
      data: { paths: [SIMPLE.singleBlock] },
    },
    {
      tcid: 'B8',
      name: '@fg-session-storage',
      tags: '@regression @floodgate @nopr',
      desc: 'Paths persist in sessionStorage across reload',
      data: { paths: [SIMPLE.singleBlock] },
    },
    {
      tcid: 'B9',
      name: '@fg-clear-button',
      tags: '@regression @floodgate @nopr',
      desc: 'Clear button empties textarea and resets state',
      data: { paths: [SIMPLE.singleBlock] },
    },

    // ============================================================
    // Suite C: Copy Workflow — Simple Content
    // ============================================================
    {
      tcid: 'C1',
      name: '@fg-copy-single-block',
      tags: '@smoke @floodgate @nopr',
      desc: 'Copy single-block HTML page',
      data: {
        paths: [SIMPLE.singleBlock],
        expectedFgPath: `${FG_DIR}/test1-single-block.html`,
      },
    },
    {
      tcid: 'C2',
      name: '@fg-copy-multiple-blocks',
      tags: '@regression @floodgate @nopr',
      desc: 'Copy HTML page with multiple blocks',
      data: {
        paths: [SIMPLE.multipleBlocks],
        expectedFgPath: `${FG_DIR}/test2-multiple-blocks.html`,
      },
    },
    {
      tcid: 'C3',
      name: '@fg-copy-with-fragments',
      tags: '@regression @floodgate @nopr',
      desc: 'Copy page containing fragment references',
      data: {
        paths: [SIMPLE.withFragments],
        expectedFragmentDiscovered: true,
      },
    },
    {
      tcid: 'C4',
      name: '@fg-copy-json',
      tags: '@regression @floodgate @nopr',
      desc: 'Copy JSON sheet file',
      data: {
        paths: [SIMPLE.sheetJson],
        expectedFgPath: `${FG_DIR}/test3-sheet.json`,
      },
    },
    {
      tcid: 'C5',
      name: '@fg-copy-image',
      tags: '@regression @floodgate @nopr',
      desc: 'Copy PNG image file',
      data: {
        paths: [SIMPLE.imageRoot],
        expectedFgPath: `${FG_DIR}/test1.png`,
      },
    },
    {
      tcid: 'C6',
      name: '@fg-copy-nested-asset',
      tags: '@regression @floodgate @nopr',
      desc: 'Copy asset from subfolder (/assets/)',
      data: {
        paths: [SIMPLE.imageAssets],
        expectedFgPath: `${FG_DIR}/assets/001.png`,
      },
    },
    {
      tcid: 'C7',
      name: '@fg-copy-link-file',
      tags: '@regression @floodgate @nopr',
      desc: 'Copy .link file (known gap: google.link missing in previous FG copy)',
      data: {
        paths: [SIMPLE.linkFile],
        expectedFgPath: `${FG_DIR}/google.link`,
      },
    },
    {
      tcid: 'C8',
      name: '@fg-copy-preview-toggle',
      tags: '@regression @floodgate @nopr',
      desc: 'Preview after copy toggle works',
      data: { paths: [SIMPLE.singleBlock] },
    },
    {
      tcid: 'C9',
      name: '@fg-copy-wildcard',
      tags: '@regression @floodgate @nopr',
      desc: 'Wildcard expansion copies all files',
      data: {
        paths: [`${TEST_DIR}/*`],
        expectedMinFiles: 10,
      },
    },
    {
      tcid: 'C10',
      name: '@fg-copy-remove-file',
      tags: '@regression @floodgate @nopr',
      desc: 'Remove file from list before copying',
      data: { paths: [SIMPLE.singleBlock, SIMPLE.multipleBlocks] },
    },

    // ============================================================
    // Suite C+: Copy Workflow — Real Event Content
    // ============================================================
    {
      tcid: 'C11',
      name: '@fg-copy-event-simple',
      tags: '@smoke @floodgate @nopr',
      desc: 'Copy real UK event page (Summit London) with 1 local fragment',
      data: {
        paths: [EVENTS.summitLondon],
        expectedFgPath: `${FG_DIR}/events/summit-london.html`,
        expectedFragmentCount: 1,
      },
    },
    {
      tcid: 'C12',
      name: '@fg-copy-event-shared-fragment',
      tags: '@regression @floodgate @nopr',
      desc: 'Copy Creative Cafe NY — verify shared fragment discovery (2 fragments total)',
      data: {
        paths: [EVENTS.creativeCafeNy],
        expectedFragmentCount: 2,
      },
    },
    {
      tcid: 'C13',
      name: '@fg-copy-large-page',
      tags: '@regression @floodgate @nopr',
      desc: 'Copy Creator Live London — largest page (~68KB) with full block stack',
      data: {
        paths: [EVENTS.creatorLive],
        expectedFgPath: `${FG_DIR}/events/creator-live-london.html`,
        expectedFragmentCount: 1,
      },
    },
    {
      tcid: 'C14',
      name: '@fg-copy-caas-page',
      tags: '@regression @floodgate @nopr',
      desc: 'Copy Events Hub — verify CaaS encoded blocks preserved in FG repo',
      data: {
        paths: [EVENTS.eventsHub],
        expectedFgPath: `${FG_DIR}/events/events-hub.html`,
        expectedContentContains: 'caas#~~H4sIAA',
      },
    },
    {
      tcid: 'C15',
      name: '@fg-copy-multi-locale',
      tags: '@regression @floodgate @nopr',
      desc: 'Copy UK + DE event pages in same batch',
      data: {
        paths: [EVENTS.summitLondon, EVENTS.summitMunich],
        expectedMinFiles: 2,
      },
    },
    {
      tcid: 'C16',
      name: '@fg-copy-events-wildcard',
      tags: '@regression @floodgate @nopr',
      desc: 'Wildcard on events/ subfolder copies all 5 real event pages',
      data: {
        paths: [`${TEST_DIR}/events/*`],
        expectedMinFiles: 5,
      },
    },

    // Content integrity — compare source vs FG after copy (normalizing URL rewrites)
    {
      tcid: 'C17',
      name: '@fg-copy-integrity-simple',
      tags: '@regression @floodgate @nopr',
      desc: 'Copy simple page — source and FG content identical (modulo URL rewrite)',
      data: {
        paths: [SIMPLE.singleBlock],
        sourcePath: `${TEST_DIR}/test1-single-block.html`,
        fgPath: `${FG_DIR}/test1-single-block.html`,
      },
    },
    {
      tcid: 'C18',
      name: '@fg-copy-integrity-event',
      tags: '@regression @floodgate @nopr',
      desc: 'Copy real event page — source and FG content byte-identical after URL normalization',
      data: {
        paths: [EVENTS.summitLondon],
        sourcePath: `${TEST_DIR}/events/summit-london.html`,
        fgPath: `${FG_DIR}/events/summit-london.html`,
      },
    },
    {
      tcid: 'C19',
      name: '@fg-copy-integrity-caas',
      tags: '@regression @floodgate @nopr',
      desc: 'Copy CaaS hub page — encoded payload survives copy byte-perfect',
      data: {
        paths: [EVENTS.eventsHub],
        sourcePath: `${TEST_DIR}/events/events-hub.html`,
        fgPath: `${FG_DIR}/events/events-hub.html`,
      },
    },
    {
      tcid: 'C20',
      name: '@fg-copy-integrity-json',
      tags: '@regression @floodgate @nopr',
      desc: 'Copy JSON file — byte-identical in FG (no URL rewrite for JSON)',
      data: {
        paths: [SIMPLE.sheetJson],
        sourcePath: `${TEST_DIR}/test3-sheet.json`,
        fgPath: `${FG_DIR}/test3-sheet.json`,
      },
    },

    // ============================================================
    // Suite D: Promote Workflow
    // ============================================================
    {
      tcid: 'D1',
      name: '@fg-promote-single',
      tags: '@smoke @floodgate @nopr',
      desc: 'Promote a single file from FG to source',
      data: { paths: [SIMPLE.singleBlock] },
    },
    {
      tcid: 'D2',
      name: '@fg-promote-with-fragments',
      tags: '@regression @floodgate @nopr',
      desc: 'Promote page with fragment references',
      data: { paths: [SIMPLE.withFragments] },
    },
    {
      tcid: 'D3',
      name: '@fg-promote-json',
      tags: '@regression @floodgate @nopr',
      desc: 'Promote JSON sheet file',
      data: { paths: [SIMPLE.sheetJson] },
    },
    {
      tcid: 'D4',
      name: '@fg-promote-publish-toggle',
      tags: '@regression @floodgate @nopr',
      desc: 'Publish after promote toggle adds Publish step',
      data: { paths: [SIMPLE.singleBlock] },
    },
    {
      tcid: 'D5',
      name: '@fg-promote-ignore',
      tags: '@regression @floodgate @nopr',
      desc: 'Promote ignore paths excluded from promote',
      data: {
        paths: [`${TEST_DIR}/*`],
        ignorePaths: [SIMPLE.sheetJson],
      },
    },
    {
      tcid: 'D6',
      name: '@fg-promote-real-event',
      tags: '@regression @floodgate @nopr',
      desc: 'Promote a real event page — verify content integrity after round-trip',
      data: { paths: [EVENTS.summitLondon] },
    },
    {
      tcid: 'D7',
      name: '@fg-promote-caas',
      tags: '@regression @floodgate @nopr',
      desc: 'Promote Events Hub — verify CaaS encoded strings survive promote',
      data: {
        paths: [EVENTS.eventsHub],
        expectedContentContains: 'caas#~~H4sIAA',
      },
    },
    {
      tcid: 'D8',
      name: '@fg-promote-large-batch',
      tags: '@regression @floodgate @nopr',
      desc: 'Promote all 5 real event pages together',
      data: {
        paths: [`${TEST_DIR}/events/*`],
        expectedMinFiles: 5,
      },
    },

    // ============================================================
    // Suite E: Delete Workflow
    // ============================================================
    {
      tcid: 'E1',
      name: '@fg-delete-single',
      tags: '@smoke @floodgate @nopr',
      desc: 'Delete single file from FG repo (not source)',
      data: { paths: [SIMPLE.singleBlock] },
    },
    {
      tcid: 'E2',
      name: '@fg-delete-confirm-dialog',
      tags: '@regression @floodgate @nopr',
      desc: 'Delete shows confirmation dialog',
      data: { paths: [SIMPLE.singleBlock] },
    },
    {
      tcid: 'E3',
      name: '@fg-delete-cancel',
      tags: '@regression @floodgate @nopr',
      desc: 'Delete cancel aborts operation',
      data: { paths: [SIMPLE.singleBlock] },
    },
    {
      tcid: 'E4',
      name: '@fg-delete-wildcard',
      tags: '@regression @floodgate @nopr',
      desc: 'Delete wildcard path removes all FG content',
      data: { paths: [`${TEST_DIR}/*`] },
    },
    {
      tcid: 'E5',
      name: '@fg-delete-source-preserved',
      tags: '@regression @floodgate @nopr',
      desc: 'Delete only affects FG repo — source file remains intact',
      data: {
        paths: [EVENTS.summitLondon],
        sourcePathToVerify: `${TEST_DIR}/events/summit-london.html`,
      },
    },

    // ============================================================
    // Suite F: Cancel & Retry
    // ============================================================
    {
      tcid: 'F1',
      name: '@fg-cancel-mid-run',
      tags: '@regression @floodgate @nopr',
      desc: 'Cancel during large copy operation',
      data: { paths: [`${TEST_DIR}/events/*`] },
    },
    {
      tcid: 'F2',
      name: '@fg-start-over',
      tags: '@regression @floodgate @nopr',
      desc: 'Start Over resets all state',
      data: { paths: [SIMPLE.singleBlock] },
    },
    {
      tcid: 'F3',
      name: '@fg-retry-errors',
      tags: '@regression @floodgate @nopr',
      desc: 'Retry Errors button retries failed files only',
    },

    // ============================================================
    // Suite G: Full E2E Smoke Chain
    // ============================================================
    {
      tcid: 'G1',
      name: '@fg-e2e-chain-simple',
      tags: '@smoke @floodgate @nopr',
      desc: 'Simple file: Copy -> Verify -> Promote -> Verify -> Delete -> Verify',
      data: {
        paths: [SIMPLE.singleBlock],
        sourcePath: `${TEST_DIR}/test1-single-block.html`,
        fgPath: `${FG_DIR}/test1-single-block.html`,
      },
    },
    {
      tcid: 'G2',
      name: '@fg-e2e-chain-real-event',
      tags: '@smoke @floodgate @nopr',
      desc: 'Real event page: Copy -> Verify -> Promote -> Verify -> Delete -> Verify',
      data: {
        paths: [EVENTS.summitLondon],
        sourcePath: `${TEST_DIR}/events/summit-london.html`,
        fgPath: `${FG_DIR}/events/summit-london.html`,
      },
    },
  ],
};
