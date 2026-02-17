import { STATUS, SEVERITY } from './constants.js';
import runAccessibilityTest from '../accessibility/accessibility-runner.js';

const ACCESSIBILITY_CHECK_ID = 'accessibility';

function getPanelAltSummary(area = document) {
  const imgSelector = area === document ? ':is(header, main, footer) img:not(.accessibility-control)' : 'img:not(.accessibility-control)';
  const images = area.querySelectorAll(imgSelector);
  if (!images?.length) {
    return {
      totalImages: 0,
      withAltText: 0,
      decorativeImages: 0,
      missingAlt: 0,
    };
  }

  let withAltText = 0;
  let decorativeImages = 0;
  let missingAlt = 0;

  images.forEach((img) => {
    const alt = img.getAttribute('alt');
    if (alt === '') decorativeImages += 1;
    else if (alt) withAltText += 1;
    else missingAlt += 1;
  });

  return {
    totalImages: images.length,
    withAltText,
    decorativeImages,
    missingAlt,
  };
}

async function checkAccessibility(area = document) {
  const result = await runAccessibilityTest(area);
  const panelAltSummary = getPanelAltSummary(area);

  if (result?.error) {
    return {
      checkId: ACCESSIBILITY_CHECK_ID,
      id: ACCESSIBILITY_CHECK_ID,
      severity: SEVERITY.CRITICAL,
      title: 'Accessibility',
      status: STATUS.LIMBO,
      description: result.error,
      details: {
        issuesCount: null,
        violations: [],
        panelAltSummary,
      },
    };
  }

  const issuesCount = result?.violations?.length || 0;
  const status = result?.pass ? STATUS.PASS : STATUS.FAIL;
  return {
    checkId: ACCESSIBILITY_CHECK_ID,
    id: ACCESSIBILITY_CHECK_ID,
    severity: SEVERITY.CRITICAL,
    title: 'Accessibility',
    status,
    description: status === STATUS.PASS
      ? 'No accessibility issues found.'
      : `${issuesCount} accessibility violations detected.`,
    details: {
      issuesCount,
      violations: result.violations,
      panelAltSummary,
    },
  };
}

export default function runChecks({ area = document } = {}) {
  return [checkAccessibility(area)];
}
