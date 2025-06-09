import { html } from '../../../deps/lit-all.min.js';
import {
  renderConfigSkeleton,
  renderStatusSkeleton,
  renderModal,
} from './ui-components.js';
import { getStatusColor, isStepCompleted, isInProgressStep, isLastStep } from '../status-utils.js';
import { ALL_STATUSES } from '../constants.js';

const renderConfigSummary = (component) => {
  if (!component.configData) return renderConfigSkeleton();
  const currentStatus = component.currentStatus?.payload?.fileContent?.status;
  const isPromotionInProgress = currentStatus && (currentStatus !== 'final_preview_done');

  return html`
    <div class="config-summary" style="height: 100%; display: flex; flex-direction: column;">
      <h2 style="margin: 0 0 20px 0; height: 28px;">Configuration Summary</h2>
      <div class="config-list" style="flex: 1; overflow-y: auto;">
        ${component.repo ? html`
          <div class="config-item">
            <strong>Repository</strong>
            <span>${component.repo}</span>
          </div>
        ` : ''}
        <div class="config-item">
          <strong>Experience Name</strong>
          <span>${component.configData.experienceName}</span>
        </div>
        <div class="config-item">
          <strong>Environment</strong>
          <span>${component.configData.grayboxIoEnv || 'prod'}</span>
        </div>
        <div class="config-item">
          <strong>Project File</strong>
          <a href="${component.referrer}" target="_blank" style="display: inline-flex; align-items: center; gap: 4px; text-decoration: none;">
            <span style="text-decoration: underline;">${new URL(component.referrer).searchParams.get('file')}</span>
          </a>
        </div>
        <div class="config-item">
          <strong>Promote Drafts Only <span class="tooltip" title="Disables Gray Box promote from anywhere but the environments' drafts folder when TRUE.">ⓘ</span></strong>
          <span>${component.configData.draftsOnly ? 'Yes' : 'No'}</span>
        </div>
        ${component.configData.promoteIgnorePaths ? html`
          <div class="config-item">
            <div class="accordion">
              <div class="accordion-header ${component.isAccordionOpen ? '' : 'collapsed'}" @click="${component.toggleAccordion}">
                <strong>Ignored Paths</strong>
              </div>
              <div class="accordion-content ${component.isAccordionOpen ? 'expanded' : ''}">
                <pre>${component.configData?.promoteIgnorePaths?.split(',')?.map((path) => `${path}\n`)}</pre>
              </div>
            </div>
          </div>
        ` : ''}
      </div>
      <p style="height: 24px; margin: 32px 0;">Are you sure you want to promote the content for <strong>${component.configData.experienceName}</strong>?</p>
      <button
        @click="${() => component.promoteTask.run()}"
        style="height: 44px"
        >
        ${isPromotionInProgress ? 'Promotion in Progress...' : 'Promote'}
      </button>
    </div>
  `;
};

const renderStatusBar = (component) => {
  if (!component.currentStatus) return renderStatusSkeleton();

  const { status, statuses } = component.currentStatus.payload.fileContent;
  const currentIndex = ALL_STATUSES.indexOf(status);
  const progress = ((currentIndex + 1) / ALL_STATUSES.length) * 100;

  if (status === 'initiated') {
    component.isToastVisible = false;
  }

  const getStepNumberBg = (isCompleted, isCurrent) => {
    if (isCompleted) return '#4CAF50';
    if (isCurrent) return 'linear-gradient(135deg, var(--accent-color), var(--accent-hover))';
    return 'var(--progress-bg)';
  };

  const getStepTitleColor = (isCompleted, isCurrent) => {
    if (isCompleted) return '#4CAF50';
    if (isCurrent) return 'var(--text-primary)';
    return 'var(--text-secondary)';
  };

  return html`
    <div class="status-container">
      <div class="overall-status" style="height: 60px;">
        <h3 style="min-height: 28px; margin: 0 0 15px 0;">Overall Status:
          <span style="color: ${getStatusColor(status)}">
            ${status?.replace(/_/g, ' ').toUpperCase()}
          </span>
        </h3>
      </div>
      <div class="progress-bar" style="height: 20px; margin: 15px 0;">
        <div class="progress" style="width: ${progress}%"></div>
      </div>
      <div class="steps-container" style="flex: 1; overflow-y: auto;">
        ${ALL_STATUSES.map((stepStatus, index) => {
          const isCompleted = isStepCompleted(status, stepStatus);
          const isCurrent = stepStatus === status;
          const isLastStepStatus = isLastStep(stepStatus);
          const isInProgress = isCurrent && !isLastStepStatus
            && isInProgressStep(stepStatus, status);
          const stepNumberBg = getStepNumberBg(isCompleted, isCurrent);
          const stepTitleColor = getStepTitleColor(isCompleted, isCurrent);
          const stepData = statuses?.find((s) => s?.stepName === stepStatus);
          const hasFiles = stepData?.files?.length > 0;

          return html`
            <div class="step ${isCurrent ? 'current' : ''} ${isCompleted ? 'completed' : ''} ${isLastStepStatus ? 'last-step' : ''}"
              style="margin-bottom: 16px; opacity: ${isCompleted ? '0.7' : '1'}; ${isInProgress ? 'animation: pulse 2s infinite;' : ''}">
              <div style="display: flex; align-items: center; gap: 12px;">
                <div class="step-number" style="
                  background: ${stepNumberBg};
                  color: var(--text-primary);
                  width: 32px;
                  height: 32px;
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-weight: bold;
                  position: relative;
                ">
                  ${isCompleted ? '✓' : index + 1}
                  ${isInProgress ? html`
                    <div style="
                      position: absolute;
                      top: -4px;
                      left: -4px;
                      right: -4px;
                      bottom: -4px;
                      border: 2px solid var(--accent-color);
                      border-top-color: transparent;
                      border-radius: 50%;
                      animation: spin 1s linear infinite;
                    "></div>
                  ` : ''}
                </div>
                <div class="step-title" style="
                  color: ${stepTitleColor};
                  font-weight: ${isCurrent ? '600' : '400'};
                ">${stepStatus.replace(/_/g, ' ').toUpperCase()}</div>
              </div>
              <div class="step-content" style="flex: 1; min-width: 0; margin-left: 44px;">
                ${stepData ? html`
                  <div class="step-time" style="color: ${isCompleted ? '#4CAF50' : 'var(--text-secondary)'}">
                    ${stepData.timestamp}
                  </div>
                  ${hasFiles ? html`
                    <div class="step-files" style="color: ${isCompleted ? '#4CAF50' : 'var(--text-secondary)'}">
                      <button @click="${() => component.showFilesModal(stepData)}" style="
                        background: none;
                        border: 1px solid currentColor;
                        color: inherit;
                        padding: 4px 12px;
                        border-radius: 4px;
                        font-size: 14px;
                        cursor: pointer;
                        margin-top: 8px;
                      ">
                        View Files (${stepData.files.length})
                      </button>
                    </div>
                  ` : ''}
                ` : ''}
              </div>
            </div>
          `;
        })}
      </div>
    </div>
    ${renderModal(component.showModal, component.selectedStepData, component.closeModal)}
  `;
};

export { renderConfigSummary, renderStatusBar }; 
