import '../../../deps/axe.min.js';
import { AXE_CORE_CONFIG, CUSTOM_CHECKS_CONFIG } from './accessibility-config.js';
import customAccessibilityChecks from './accessibility-custom-checks.js';

let activeRun = null;

export default async function runAccessibilityTest(area = document) {
  if (activeRun) {
    return activeRun;
  }

  activeRun = (async () => {
  try {
    const { include, exclude, ...axeOptions } = AXE_CORE_CONFIG;
    const axeContext = area === document
      ? { include, exclude }
      : area;
    const results = await window.axe.run(axeContext, axeOptions);
    const scopedCustomConfig = area === document
      ? CUSTOM_CHECKS_CONFIG
      : { ...CUSTOM_CHECKS_CONFIG, include: ['*'], root: area };
    const customViolations = await customAccessibilityChecks(scopedCustomConfig);
    results.violations.push(...customViolations);
    return {
      pass: !results.violations.length,
      violations: results.violations,
    };
  } catch (error) {
    window.lana.log(`Error running accessiblity test:, ${error}`);
    return { error: `Error running accessibility test: ${error.message}` };
  }
  })();

  try {
    return await activeRun;
  } finally {
    activeRun = null;
  }
}
