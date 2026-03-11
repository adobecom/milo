import '../../../deps/axe.min.js';
import { AXE_CORE_CONFIG, CUSTOM_CHECKS_CONFIG } from './accessibility-config.js';
import customAccessibilityChecks from './accessibility-custom-checks.js';

let activeRun = null;

export default async function runAccessibilityTest(area = document) {
  if (activeRun) return activeRun;

  activeRun = (async () => {
    try {
      const { include, exclude, ...axeOptions } = AXE_CORE_CONFIG;
      const axeContext = area === document
        ? { include, exclude }
        : area;
      const [results, customViolations] = await Promise.all([
        window.axe.run(axeContext, axeOptions),
        customAccessibilityChecks(CUSTOM_CHECKS_CONFIG),
      ]);
      results.violations.push(...customViolations);
      return {
        pass: !results.violations.length,
        violations: results.violations,
      };
    } catch (error) {
      window.lana.log(`Error running accessibility test: ${error}`, {
        tags: 'preflight',
        severity: 'error',
      });
      return { error: `Error running accessibility test: ${error.message}` };
    }
  })();

  try {
    return await activeRun;
  } finally {
    activeRun = null;
  }
}
