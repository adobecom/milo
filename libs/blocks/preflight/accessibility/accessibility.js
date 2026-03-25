import { html, useState, useEffect } from '../../../deps/htm-preact.js';
import '../../../deps/axe.min.js';
import { AXE_CORE_CONFIG, CUSTOM_CHECKS_CONFIG } from './accessibility-config.js';
import customAccessibilityChecks from './accessibility-custom-checks.js';
import AuditImageAltText from './audit-image-alt-text.js';

/**
 * Runs the accessibility test using axe-core and custom checks.
 * @returns {Promise<Object>} Test results object (pass/fail + violations) or error.
 */
async function runAccessibilityTest() {
  try {
    const results = await window.axe.run(AXE_CORE_CONFIG);
    const customViolations = await customAccessibilityChecks(CUSTOM_CHECKS_CONFIG);
    results.violations.push(...customViolations);
    return {
      pass: !results.violations.length,
      violations: results.violations,
    };
  } catch (error) {
    window.lana.log(`Error running accessiblity test:, ${error}`);
    return { error: `Error running accessibility test: ${error.message}` };
  }
}

/**
 * Preflight Accessibility Tab/Panel.
 */
export default function Accessibility() {
  const [pageURL, setPageURL] = useState(window.location.href);
  const [testResults, setTestResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expandedViolations, setExpandedViolations] = useState([]);

  useEffect(() => {
    const runTest = async () => {
      setLoading(true);
      setTestResults(null);
      setExpandedViolations([]);
      setPageURL(window.location.href);
      const results = await runAccessibilityTest();
      setTestResults(results);
      setLoading(false);
    };
    runTest();
  }, []);
  const toggleViolation = (index) => {
    setExpandedViolations((prev) => {
      const isExpanded = prev.includes(index);
      return isExpanded ? prev.filter((i) => i !== index) : [...prev, index];
    });
  };
  // Loading markup
  const loadingMarkup = () => html`
    <div class="preflight-columns">
      <div class="preflight-column">
        <p>Running Accessibility Test...</p>
      </div>
    </div>
  `;
  // Error markup
  const errorMarkup = (errorMsg) => html`
    <div class="preflight-columns">
      <div class="preflight-column">
        <div class="preflight-content-group">
          <p class="preflight-item-title">Error</p>
          <p class="preflight-item-description">${errorMsg}</p>
        </div>
      </div>
    </div>
  `;
  // Results summary markup
  const resultsSummary = (results, url) => {
    if (!results) {
      return html`
        <div class="preflight-column">
          <p>No accessibility results available.</p>
        </div>
      `;
    }
    return html`
      <div class="preflight-column">
        <div class="preflight-content-group">
          <div class="preflight-accessibility-item">
            <div class="result-icon ${results.pass ? 'green' : 'red'}"></div>
            <div class="preflight-item-text">
              <p class="preflight-item-title">
                ${results.pass
    ? 'Accessibility Test Passed'
    : 'Accessibility Test Failed'}
              </p>
              <p class="preflight-item-description">
                ${results.pass
    ? 'No accessibility issues found.'
    : `${results.violations.length} accessibility violations detected.`}
              </p>
              <ul class="summary-list">
                <li><strong>Page:</strong> <a href="${url}" target="_blank">${url}</a></li>
                <li><strong>Test Scope:</strong> body</li>
                <li><strong>WCAG Tags:</strong> ${AXE_CORE_CONFIG.runOnly?.values?.join(', ') || 'NONE'}</li>
              </ul>
              <p class="preflight-accessibility-note">
                <strong>Note:</strong> This test does not include screen reader behavior, focus order, or voice navigation checks.
              </p>
            </div>
          </div>
        </div>
      </div>
    `;
  };
  // Violations markup
  const violationsList = (violations = []) => {
    if (!violations.length) {
      return html`
        <div class="preflight-column">
          <p>No violations found.</p>
        </div>
      `;
    }
    return html`
      <div class="preflight-column">
        <div class="preflight-content-group violations-section">
          <div class="preflight-accessibility-item">
            <div class="result-icon red"></div>
            <div class="preflight-item-text">
              <p class="preflight-item-title">Accessibility Violations</p>
              <p class="preflight-item-description">
                Click each violation to view details
              </p>
            </div>
          </div>

          <div class="violation-list">
            ${violations.map((violation, index) => {
    const isExpanded = expandedViolations.includes(index);
    return html`
                <div class="violation-item">
                  <div
                    class="violation-summary ${isExpanded ? 'expanded' : ''}"
                    onClick=${() => toggleViolation(index)}
                  >
                    <div class="violation-expand"></div>
                    <div class="preflight-content-heading">
                      <span class="violation-index">${index + 1}.</span>
                      Violation [
                      <span class="severity ${violation.impact}">${violation.impact}</span>
                      ]: ${violation.description}
                    </div>
                  </div>

                  ${isExpanded && html`
                    <div class="violation-details">
                      <ul class="violation-details-list">
                        <li><strong>Rule ID:</strong> ${violation.id}</li>
                        <li><strong>Severity:</strong> <span class="severity ${violation.impact}">${violation.impact}</span></li>
                        <li><strong>Fix: </strong> 
                          <a class="violation-link" href="${violation.helpUrl}" target="_blank">
                            More Info
                          </a>
                        </li>
                        <li><strong>Affected Elements:</strong>
                          <ul class="affected-elements">
                            ${violation.nodes.map((node) => html`<li><code>${node.html}</code></li>`)}
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
    `;
  };
  // Conditional rendering based on state
  if (loading) return loadingMarkup();
  if (testResults?.error) return errorMarkup(testResults.error);
  if (!testResults) {
    return html`
      <div class="preflight-columns">
        <div class="preflight-column">
          <p>No accessibility test has been run yet.</p>
        </div>
      </div>
    `;
  }
  return html`
  <div class="preflight-columns accessibility-columns">
    ${resultsSummary(testResults, pageURL)}
    <div class="preflight-column violations-column">
      ${!testResults.pass && violationsList(testResults.violations)}
    </div>
  </div>
  <div class="preflight-full-width">
    <${AuditImageAltText} />
  </div>
`;
}
