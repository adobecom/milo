import { html, useState, useEffect } from '../../../deps/htm-preact.js';
import '../../../deps/axe.min.js';
import customAccessibilityChecks from './accessiblityHelper.js';

/**
 * Runs the accessibility test using axe-core and custom checks.
 * @returns {Promise<Object>} Test results object (pass/fail + violations) or error.
 */
async function runAccessibilityTest() {
  try {
    window.lana.log(`Running Accessibility test on: ${window.location.href}`);

    const results = await window.axe.run({
      include: [['body']],
      exclude: [['.preflight']],
      runOnly: {
        type: 'tag',
        values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
      },
    });

    window.lana.log(
      `Axe-core Accessibility Test Completed. Violations Found: ${results.violations.length}`,
    );

    const customViolations = await customAccessibilityChecks({
      checks: ['altText'],
      include: ['main'],
      exclude: ['.preflight', '.global-navigation', 'footer'],
    });

    results.violations.push(...customViolations);

    window.lana.log(
      `Custom Accessibility Checks Completed. Violations Found: ${customViolations.length}`,
    );

    return {
      pass: results.violations.length === 0,
      violations: results.violations,
    };
  } catch (error) {
    window.lana.log(`Error running accessiblity test:, ${error}`);
    return { error: `Error running accessibility test: ${error.message}` };
  }
}

/**
 * Preflight Accessibility Tab/Panel
 */
export default function Accessibility() {
  const [pageURL, setPageURL] = useState(window.location.href);
  const [testResults, setTestResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expandedViolations, setExpandedViolations] = useState([]);

  // Run the test when the preflight panel opens
  useEffect(() => {
    const runTest = async () => {
      setLoading(true);
      setTestResults(null);
      setPageURL(window.location.href);

      const results = await runAccessibilityTest();
      setTestResults(results);
      setLoading(false);
    };

    runTest();
  }, []);

  // Toggle expand/collapse for violations
  const toggleViolation = (index) => {
    setExpandedViolations((prev) => {
      const isExpanded = prev.includes(index);
      return isExpanded ? prev.filter((i) => i !== index) : [...prev, index];
    });
  };

  return html`
    <div id="preflight-panel" class="preflight-general-content">
      <div class="preflight-columns">
        <!-- Summary Column -->
        <div class="preflight-column">
          ${loading && html`<p>Running Accessibility Test...</p>`}
          ${!loading
          && testResults
          && !testResults.error
          && html`
            <div class="preflight-content-group">
              <div class="preflight-item">
                <div
                  class="result-icon ${testResults.pass ? 'green' : 'red'}"
                ></div>
                <div class="preflight-item-text">
                  <p class="preflight-item-title">
                    ${testResults.pass
    ? 'Accessibility Test Passed'
    : 'Accessibility Test Failed'}
                  </p>
                  <p class="preflight-item-description">
                    ${testResults.pass
    ? 'No accessibility issues found.'
    : `${testResults.violations.length} accessibility violations detected.`}
                  </p>
                  <ul class="summary-list">
                    <li>
                      <strong>Page:</strong>
                      <a href="${pageURL}" target="_blank">${pageURL}</a>
                    </li>
                    <li><strong>Test Scope:</strong> body</li>
                    <li>
                      <strong>WCAG Tags:</strong> ['wcag2a', 'wcag2aa',
                      'wcag21a', 'wcag21aa']
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          `}
          ${!loading
          && testResults
          && testResults.error
          && html`
            <div class="preflight-content-group">
              <p class="preflight-item-title">Error</p>
              <p class="preflight-item-description">${testResults.error}</p>
            </div>
          `}
        </div>

        <!-- Violations Column -->
        ${testResults
        && !loading
        && !testResults.pass
        && html`
          <div class="preflight-column">
            <div class="preflight-content-group violations-section">
              <!-- Violations Header -->
              <div class="preflight-item">
                <div class="result-icon red"></div>
                <div class="preflight-item-text">
                  <p class="preflight-item-title">Accessibility Violations</p>
                  <p class="preflight-item-description">
                    Click each violation to view details
                  </p>
                </div>
              </div>

              <!-- Violations List -->
              <div class="violation-list">
                ${testResults.violations.map((violation, index) => {
    const isExpanded = expandedViolations.includes(index);

    return html`
                    <div class="violation-item">
                      <!-- Violation Summary Row -->
                      <div
                        class="preflight-group-row violation-summary ${isExpanded
    ? 'expanded'
    : ''}"
                        onClick=${() => toggleViolation(index)}
                      >
                        <div class="preflight-group-expand"></div>
                        <div class="preflight-content-heading">
                          <span class="violation-index">${index + 1}.</span>
                          Violation [
                          <span class="severity ${violation.impact}"
                            >${violation.impact}</span
                          >
                          ]: ${violation.description}
                        </div>
                      </div>

                      <!-- Violation Details -->
                      ${isExpanded
                      && html`
                        <div class="violation-details">
                          <ul class="violation-details-list">
                            <li><strong>Rule ID:</strong> ${violation.id}</li>
                            <li>
                              <strong>Severity:</strong>
                              <span class="severity ${violation.impact}"
                                >${violation.impact}</span
                              >
                            </li>
                            <li>
                              <strong>Fix:</strong>
                              <a
                                class="violation-link"
                                href="${violation.helpUrl}"
                                target="_blank"
                                >More Info</a
                              >
                            </li>
                            <li>
                              <strong>Affected Elements:</strong>
                              <ul class="affected-elements">
                                ${violation.nodes.map(
    (node) => html`
                                    <li><code>${node.target}</code></li>
                                  `,
  )}
                              </ul>
                            </li>
                          </ul>
                        </div>
                      `}
                    </div>
                  `;
  })}
              </div>
            </div>
          </div>
        `}
      </div>
    </div>
  `;
}
