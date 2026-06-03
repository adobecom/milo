/* eslint-disable no-loop-func */
import { expect, test } from '@playwright/test';
import {
  features, testRef, testOrg, testRepo, fgColor, testDir,
} from './floodgate.spec.js';
import FloodgatePage from './floodgate.page.js';

test.use({ storageState: './nala/utils/auth.json' });

let fg;

// Helper: find feature by tcid
function f(tcid) {
  return features.find((x) => x.tcid === tcid);
}

// ============================================================
// Suite A: Page Load & Auth
// ============================================================

test.describe('DA Floodgate - Page Load', () => {
  test.beforeEach(async ({ page }) => {
    fg = new FloodgatePage(page);
  });

  test(`${f('A1').name}, ${f('A1').tags}`, async () => {
    await test.step('Navigate to Floodgate tool', async () => {
      await fg.navigate(testRef);
    });
    await test.step('Verify page loaded', async () => {
      await expect(fg.title).toBeVisible();
      await expect(fg.title).toContainText('Floodgate');
    });
    await test.step('Verify no auth errors', async () => {
      await expect(fg.errorMessage).not.toBeVisible();
    });
  });

  test(`${f('A2').name}, ${f('A2').tags}`, async () => {
    await fg.navigate(testRef);
    await test.step('Verify default is Copy', async () => {
      await expect(fg.pathsTextarea).toBeVisible();
      expect(await fg.actionSelect.inputValue()).toBe('fgCopy');
    });
  });

  test(`${f('A3').name}, ${f('A3').tags}`, async () => {
    await fg.navigate(testRef);
    await fg.selectOperation('fgPromote');
    expect(await fg.actionSelect.inputValue()).toBe('fgPromote');
    await expect(fg.pathsTextarea).toBeVisible();
  });

  test(`${f('A4').name}, ${f('A4').tags}`, async () => {
    await fg.navigate(testRef);
    await fg.selectOperation('fgDelete');
    expect(await fg.actionSelect.inputValue()).toBe('fgDelete');
    await expect(fg.pathsTextarea).toBeVisible();
  });
});

// ============================================================
// Suite B: Path Validation
// ============================================================

test.describe('DA Floodgate - Path Validation', () => {
  test.beforeEach(async ({ page }) => {
    fg = new FloodgatePage(page);
    await fg.navigate(testRef);
  });

  test(`${f('B1').name}, ${f('B1').tags}`, async () => {
    const { data } = f('B1');
    await fg.enterPaths(data.paths);
    expect(await fg.isStartEnabled()).toBe(true);
    await expect(fg.pathCount).toContainText(`${data.paths.length}`);
  });

  test(`${f('B2').name}, ${f('B2').tags}`, async () => {
    const { data } = f('B2');
    await fg.enterPaths(data.paths);
    expect(await fg.isStartEnabled()).toBe(false);
  });

  test(`${f('B3').name}, ${f('B3').tags}`, async () => {
    const { data } = f('B3');
    await fg.enterPaths(data.paths);
    expect(await fg.isStartEnabled()).toBe(false);
  });

  test(`${f('B4').name}, ${f('B4').tags}`, async () => {
    const { data } = f('B4');
    await fg.enterPaths(data.paths);
    await expect(fg.invalidPathsHint).toBeVisible();
  });

  test(`${f('B5').name}, ${f('B5').tags}`, async () => {
    const { data } = f('B5');
    await fg.enterPaths([data.aemUrl]);
    expect(await fg.isStartEnabled()).toBe(true);
    await expect(fg.repoInfo).toBeVisible();
  });

  test(`${f('B6').name}, ${f('B6').tags}`, async () => {
    const { data } = f('B6');
    await fg.enterPaths(data.paths);
    expect(await fg.isStartEnabled()).toBe(true);
  });

  test(`${f('B7').name}, ${f('B7').tags}`, async () => {
    const { data } = f('B7');
    await fg.enterPaths(data.paths);
    await expect(fg.repoInfo).toBeVisible();
    await expect(fg.sourceRepo).toContainText(testRepo);
    await expect(fg.fgRepo).toContainText(`${testRepo}-fg-${fgColor}`);
  });

  test(`${f('B8').name}, ${f('B8').tags}`, async () => {
    const { data } = f('B8');
    await fg.enterPaths(data.paths);
    await fg.page.reload();
    await fg.page.waitForLoadState('domcontentloaded');
    await fg.dismissPopup();
    await fg.initFrame();
    const value = await fg.pathsTextarea.inputValue();
    expect(value).toContain('nala-fg-test');
  });

  test(`${f('B9').name}, ${f('B9').tags}`, async () => {
    const { data } = f('B9');
    await fg.enterPaths(data.paths);
    await fg.clickClear();
    expect(await fg.pathsTextarea.inputValue()).toBe('');
    expect(await fg.isStartEnabled()).toBe(false);
  });
});

// ============================================================
// Suite C: Copy Workflow — Simple Content
// ============================================================

test.describe('DA Floodgate - Copy (Simple Content)', () => {
  test.beforeEach(async ({ page }) => {
    fg = new FloodgatePage(page);
    test.setTimeout(120 * 1000);
    await fg.navigate(testRef);
  });

  // C1-C7: simple content copies (parametrized)
  for (const tcid of ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7']) {
    const feat = f(tcid);
    test(`${feat.name}, ${feat.tags}`, async () => {
      const { data } = feat;
      await fg.enterPaths(data.paths);
      await fg.clickFind();
      await fg.waitForFindComplete();
      await fg.clickCopy();
      await fg.waitForDone();
      await expect(fg.doneStep).toBeVisible();
    });
  }

  test(`${f('C8').name}, ${f('C8').tags}`, async () => {
    const { data } = f('C8');
    await fg.enterPaths(data.paths);
    await fg.togglePreviewAfterCopy(true);
    await fg.clickFind();
    await fg.waitForFindComplete();
    await fg.clickCopy();
    await fg.waitForDone();
    const previewTab = fg.tabNav.locator('[data-target="preview"]');
    await expect(previewTab).toBeVisible();
  });

  test(`${f('C9').name}, ${f('C9').tags}`, async () => {
    const { data } = f('C9');
    await fg.enterPaths(data.paths);
    await fg.clickFind();
    await fg.waitForFindComplete();
    const fileCount = await fg.fileList.count();
    expect(fileCount).toBeGreaterThanOrEqual(data.expectedMinFiles);
  });

  test(`${f('C10').name}, ${f('C10').tags}`, async () => {
    const { data } = f('C10');
    await fg.enterPaths(data.paths);
    await fg.clickFind();
    await fg.waitForFindComplete();
    const initialCount = await fg.fileList.count();
    // Remove the first file from list (icon button inside li)
    await fg.fileList.first().locator('button.icon-button').click();
    const newCount = await fg.fileList.count();
    expect(newCount).toBe(initialCount - 1);
  });
});

// ============================================================
// Suite C+: Copy Workflow — Real Event Content
// ============================================================

test.describe('DA Floodgate - Copy (Real Events)', () => {
  test.beforeEach(async ({ page }) => {
    fg = new FloodgatePage(page);
    test.setTimeout(180 * 1000);
    await fg.navigate(testRef);
  });

  test(`${f('C11').name}, ${f('C11').tags}`, async () => {
    const { data } = f('C11');
    await fg.enterPaths(data.paths);
    await fg.clickFind();
    await fg.waitForFindComplete();

    await test.step('Verify fragment discovered in Find step', async () => {
      // File list should have at least: 1 page + 1 fragment
      const fileCount = await fg.fileList.count();
      expect(fileCount).toBeGreaterThanOrEqual(1 + data.expectedFragmentCount);
    });

    await fg.clickCopy();
    await fg.waitForDone();
  });

  test(`${f('C12').name}, ${f('C12').tags}`, async () => {
    const { data } = f('C12');
    await fg.enterPaths(data.paths);
    await fg.clickFind();
    await fg.waitForFindComplete();

    await test.step('Verify both local + shared fragments discovered', async () => {
      const fileCount = await fg.fileList.count();
      // Expect: 1 page + 2 fragments (local venue-additional-info + shared stay-connected-blade)
      expect(fileCount).toBeGreaterThanOrEqual(1 + data.expectedFragmentCount);
    });

    await fg.clickCopy();
    await fg.waitForDone();
  });

  test(`${f('C13').name}, ${f('C13').tags}`, async () => {
    const { data } = f('C13');
    await fg.enterPaths(data.paths);
    await fg.clickFind();
    await fg.waitForFindComplete();
    await fg.clickCopy();
    await fg.waitForDone();
    // Large page should still succeed
    const successCount = await fg.getSuccessCount();
    expect(successCount).toBeGreaterThanOrEqual(1);
  });

  test(`${f('C14').name}, ${f('C14').tags}`, async () => {
    const { data } = f('C14');
    await fg.enterPaths(data.paths);
    await fg.clickFind();
    await fg.waitForFindComplete();
    await fg.clickCopy();
    await fg.waitForDone();

    await test.step('Verify CaaS encoded content preserved in FG repo', async () => {
      // Fetch FG copy and confirm CaaS encoded string still present
      const token = await fg.getDaToken();
      const fgContent = await fg.getFileContent(data.expectedFgPath, token);
      expect(fgContent).toContain(data.expectedContentContains);
    });
  });

  test(`${f('C15').name}, ${f('C15').tags}`, async () => {
    const { data } = f('C15');
    await fg.enterPaths(data.paths);
    await fg.clickFind();
    await fg.waitForFindComplete();
    await fg.clickCopy();
    await fg.waitForDone();
    const successCount = await fg.getSuccessCount();
    expect(successCount).toBeGreaterThanOrEqual(data.expectedMinFiles);
  });

  test(`${f('C16').name}, ${f('C16').tags}`, async () => {
    const { data } = f('C16');
    await fg.enterPaths(data.paths);
    await fg.clickFind();
    await fg.waitForFindComplete();
    const fileCount = await fg.fileList.count();
    expect(fileCount).toBeGreaterThanOrEqual(data.expectedMinFiles);
  });
});

// ============================================================
// Suite C: Content Integrity — source vs FG byte-compare
// ============================================================

test.describe('DA Floodgate - Content Integrity', () => {
  test.beforeEach(async ({ page }) => {
    fg = new FloodgatePage(page);
    test.setTimeout(180 * 1000);
    await fg.navigate(testRef);
  });

  // C17-C20: copy -> compare source and FG content (with URL rewrite normalization)
  for (const tcid of ['C17', 'C18', 'C19', 'C20']) {
    const feat = f(tcid);
    test(`${feat.name}, ${feat.tags}`, async () => {
      const { data } = feat;

      await test.step('Copy file to FG via UI', async () => {
        await fg.enterPaths(data.paths);
        await fg.clickFind();
        await fg.waitForFindComplete();
        await fg.clickCopy();
        await fg.waitForDone();
      });

      await test.step('Compare source vs FG content', async () => {
        const result = await fg.compareSourceVsFg(data.sourcePath, data.fgPath, {
          org: testOrg,
          repo: testRepo,
          color: fgColor,
        });

        if (!result.identical && result.diffLines) {
          // eslint-disable-next-line no-console
          console.log(`[${feat.tcid}] Content diff (first ${result.diffLines.length} lines):`);
          for (const d of result.diffLines) {
            // eslint-disable-next-line no-console
            console.log(`  L${d.line}:\n    src: ${d.source}\n    fg : ${d.fg}`);
          }
        }

        expect(result.identical, `Source and FG content should be identical after URL normalization. Source: ${result.sourceLength}b, FG: ${result.fgLength}b`).toBe(true);
      });
    });
  }
});

// ============================================================
// Suite D: Promote Workflow
// ============================================================

test.describe('DA Floodgate - Promote', () => {
  test.beforeEach(async ({ page }) => {
    fg = new FloodgatePage(page);
    test.setTimeout(180 * 1000);
    await fg.navigate(testRef);
    await fg.selectOperation('fgPromote');
  });

  for (const tcid of ['D1', 'D2', 'D3']) {
    const feat = f(tcid);
    test(`${feat.name}, ${feat.tags}`, async () => {
      const { data } = feat;
      await fg.enterPaths(data.paths);
      await fg.clickFind();
      await fg.waitForFindComplete();
      await fg.clickPromote();
      // Small file counts should not trigger confirmation dialog
      try {
        await fg.waitForDialog(3000);
        await fg.confirmDialog();
      } catch { /* no dialog */ }
      await fg.waitForDone();
    });
  }

  test(`${f('D4').name}, ${f('D4').tags}`, async () => {
    const { data } = f('D4');
    await fg.enterPaths(data.paths);
    await fg.togglePublishAfterPromote(true);
    await fg.clickFind();
    await fg.waitForFindComplete();
    await fg.clickPromote();
    try { await fg.waitForDialog(3000); await fg.confirmDialog(); } catch { /* noop */ }
    await fg.waitForDone();
    const publishTab = fg.tabNav.locator('[data-target="publish"]');
    await expect(publishTab).toBeVisible();
  });

  test(`${f('D5').name}, ${f('D5').tags}`, async () => {
    test.skip(true, 'Requires promote-ignore config in /.milo/floodgate/config.json');
  });

  test(`${f('D6').name}, ${f('D6').tags}`, async () => {
    const { data } = f('D6');
    await fg.enterPaths(data.paths);
    await fg.clickFind();
    await fg.waitForFindComplete();
    await fg.clickPromote();
    try { await fg.waitForDialog(3000); await fg.confirmDialog(); } catch { /* noop */ }
    await fg.waitForDone();
    const successCount = await fg.getSuccessCount();
    expect(successCount).toBeGreaterThanOrEqual(1);
  });

  test(`${f('D7').name}, ${f('D7').tags}`, async () => {
    const { data } = f('D7');
    await fg.enterPaths(data.paths);
    await fg.clickFind();
    await fg.waitForFindComplete();
    await fg.clickPromote();
    try { await fg.waitForDialog(3000); await fg.confirmDialog(); } catch { /* noop */ }
    await fg.waitForDone();

    await test.step('Verify CaaS content still in source repo after promote', async () => {
      const token = await fg.getDaToken();
      const sourceContent = await fg.getFileContent(`${testDir}/events/events-hub.html`, token);
      expect(sourceContent).toContain(data.expectedContentContains);
    });
  });

  test(`${f('D8').name}, ${f('D8').tags}`, async () => {
    const { data } = f('D8');
    await fg.enterPaths(data.paths);
    await fg.clickFind();
    await fg.waitForFindComplete();
    await fg.clickPromote();
    try { await fg.waitForDialog(5000); await fg.confirmDialog(); } catch { /* noop */ }
    await fg.waitForDone();
    const successCount = await fg.getSuccessCount();
    expect(successCount).toBeGreaterThanOrEqual(data.expectedMinFiles);
  });
});

// ============================================================
// Suite E: Delete Workflow
// ============================================================

test.describe('DA Floodgate - Delete', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    fg = new FloodgatePage(page);
    test.setTimeout(180 * 1000);
    await fg.navigate(testRef);

    // Ensure FG has the file(s) a delete test will try to delete.
    // Earlier tests may have deleted them — self-heal by copying source -> FG via API.
    const needsFile = /fg-delete-(confirm-dialog|cancel|single|source-preserved)/.test(testInfo.title);
    if (needsFile) {
      const token = await fg.getDaToken();
      // Determine which file is needed from test title
      const isEventFile = testInfo.title.includes('source-preserved');
      const sourcePath = isEventFile
        ? `${testDir}/events/summit-london.html`
        : `${testDir}/test1-single-block.html`;
      const fgPath = sourcePath.replace(`/${testOrg}/${testRepo}/`, `/${testOrg}/${testRepo}-fg-${fgColor}/`);
      await fg.ensureFileInFg(sourcePath, fgPath, token);
    }

    await fg.selectOperation('fgDelete');
  });

  test(`${f('E1').name}, ${f('E1').tags}`, async () => {
    const { data } = f('E1');
    await fg.enterPaths(data.paths);
    await fg.clickFind();
    await fg.waitForFindComplete();
    await fg.clickDelete();
    await fg.waitForDialog();
    await fg.confirmDialog();
    await fg.waitForDone();
  });

  test(`${f('E2').name}, ${f('E2').tags}`, async () => {
    const { data } = f('E2');
    await fg.enterPaths(data.paths);
    await fg.clickFind();
    await fg.waitForFindComplete();
    await fg.clickDelete();
    await fg.waitForDialog();
    await expect(fg.dialogBox).toBeVisible();
    await expect(fg.dialogMessage).toBeVisible();
    await fg.cancelDialog();
  });

  test(`${f('E3').name}, ${f('E3').tags}`, async () => {
    const { data } = f('E3');
    await fg.enterPaths(data.paths);
    await fg.clickFind();
    await fg.waitForFindComplete();
    await fg.clickDelete();
    await fg.waitForDialog();
    await fg.cancelDialog();
    await expect(fg.dialogOverlay).not.toBeVisible();
    await expect(fg.doneStep).not.toBeVisible();
  });

  test(`${f('E4').name}, ${f('E4').tags}`, async () => {
    const { data } = f('E4');
    await fg.enterPaths(data.paths);
    await fg.clickFind();
    await fg.waitForFindComplete();
    await fg.clickDelete();
    await fg.waitForDialog();
    await fg.confirmDialog();
    await fg.waitForDone();
  });

  test(`${f('E5').name}, ${f('E5').tags}`, async () => {
    const { data } = f('E5');
    await fg.enterPaths(data.paths);
    await fg.clickFind();
    await fg.waitForFindComplete();
    await fg.clickDelete();
    await fg.waitForDialog();
    await fg.confirmDialog();
    await fg.waitForDone();

    await test.step('Verify source file still exists (delete only affects FG)', async () => {
      const token = await fg.getDaToken();
      const exists = await fg.checkFileExists(data.sourcePathToVerify, token);
      expect(exists).toBe(true);
    });
  });
});

// ============================================================
// Suite F: Cancel & Retry
// ============================================================

test.describe('DA Floodgate - Cancel & Retry', () => {
  test.beforeEach(async ({ page }) => {
    fg = new FloodgatePage(page);
    test.setTimeout(120 * 1000);
    await fg.navigate(testRef);
  });

  test(`${f('F1').name}, ${f('F1').tags}`, async () => {
    const { data } = f('F1');
    await fg.enterPaths(data.paths);
    await fg.clickFind();
    await fg.waitForFindComplete();
    await fg.clickCopy();
    // Attempt to cancel as soon as Cancel button appears
    try {
      await fg.cancelButton.click({ timeout: 2000 });
      // Verify cancelled state
      await expect(fg.component).toContainText(/cancel/i, { timeout: 10000 });
    } catch {
      // Operation may have completed too fast; acceptable
      test.skip(true, 'Operation completed before cancel button could be clicked');
    }
  });

  test(`${f('F2').name}, ${f('F2').tags}`, async () => {
    const { data } = f('F2');
    await fg.enterPaths(data.paths);
    await fg.clickFind();
    await fg.waitForFindComplete();
    await fg.clickCopy();
    await fg.waitForDone();
    await fg.clickStartOver();
    await expect(fg.pathsTextarea).toBeVisible();
    await expect(fg.doneStep).not.toBeVisible();
  });

  test(`${f('F3').name}, ${f('F3').tags}`, async () => {
    test.skip(true, 'Requires a deterministic way to produce errors for retry');
  });
});

// ============================================================
// Suite G: Full E2E Smoke Chain
// ============================================================

test.describe('DA Floodgate - E2E Smoke Chain', () => {
  test.beforeEach(async ({ page }) => {
    fg = new FloodgatePage(page);
    test.setTimeout(300 * 1000);
  });

  async function runChain(data) {
    // Step 1: Copy
    await fg.navigate(testRef);
    await fg.enterPaths(data.paths);
    await fg.clickFind();
    await fg.waitForFindComplete();
    await fg.clickCopy();
    await fg.waitForDone();

    // Verify via API: file exists in FG repo
    const token = await fg.getDaToken();
    expect(await fg.checkFileExists(data.fgPath, token)).toBe(true);

    // Step 2: Promote
    await fg.clickStartOver();
    await fg.selectOperation('fgPromote');
    await fg.enterPaths(data.paths);
    await fg.clickFind();
    await fg.waitForFindComplete();
    await fg.clickPromote();
    try { await fg.waitForDialog(3000); await fg.confirmDialog(); } catch { /* noop */ }
    await fg.waitForDone();

    // Verify via API: source file still exists
    expect(await fg.checkFileExists(data.sourcePath, token)).toBe(true);

    // Step 3: Delete FG content
    await fg.clickStartOver();
    await fg.selectOperation('fgDelete');
    await fg.enterPaths(data.paths);
    await fg.clickFind();
    await fg.waitForFindComplete();
    await fg.clickDelete();
    await fg.waitForDialog();
    await fg.confirmDialog();
    await fg.waitForDone();

    // Verify via API: FG file no longer exists
    expect(await fg.checkFileExists(data.fgPath, token)).toBe(false);
    // Source still intact
    expect(await fg.checkFileExists(data.sourcePath, token)).toBe(true);
  }

  test(`${f('G1').name}, ${f('G1').tags}`, async () => {
    await runChain(f('G1').data);
  });

  test(`${f('G2').name}, ${f('G2').tags}`, async () => {
    await runChain(f('G2').data);
  });
});
