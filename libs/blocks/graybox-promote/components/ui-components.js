import { html } from '../../../deps/lit-all.min.js';

export const renderConfigSkeleton = () => html`
  <div class="config-summary" style="height: 100%; display: flex; flex-direction: column;">
    <h2 style="margin: 0 0 20px 0; height: 28px;">Configuration Summary</h2>
    <div class="config-list" style="flex: 1; overflow-y: auto;">
      <div class="config-item">
        <strong>Experience Name</strong>
        <div class="skeleton skeleton-text" style="width: 180px; height: 20px;"></div>
      </div>
      <div class="config-item">
        <strong>Environment</strong>
        <div class="skeleton skeleton-text" style="width: 100px; height: 20px;"></div>
      </div>
      <div class="config-item">
        <strong>Promote Drafts Only <span class="tooltip" title="Disables Gray Box promote from anywhere but the environments' drafts folder when TRUE.">ⓘ</span></strong>
        <div class="skeleton skeleton-text" style="width: 40px; height: 20px;"></div>
      </div>
      <div class="config-item">
        <div class="accordion">
          <div class="accordion-header">
            <strong>Ignored Paths</strong>
          </div>
          <div class="accordion-content">
            <div class="skeleton skeleton-text" style="width: 100%; height: 120px;"></div>
          </div>
        </div>
      </div>
    </div>
    <p style="height: 24px; margin: 32px 0;">
      <div class="skeleton skeleton-text" style="width: 300px; height: 24px; margin: 0 auto;"></div>
    </p>
    <button style="opacity: 0.5; pointer-events: none; height: 44px;">Promote</button>
  </div>
`;

export const renderStatusSkeleton = () => html`
  <div class="status-container" style="height: 100%; display: flex; flex-direction: column;">
    <div class="overall-status" style="height: 60px;">
      <h3 style="min-height: 28px; margin: 0 0 15px 0;">
        <div class="skeleton skeleton-text" style="width: 280px; height: 28px;"></div>
      </h3>
    </div>
    <div class="progress-bar" style="height: 20px; margin: 15px 0;">
      <div class="skeleton skeleton-progress"></div>
    </div>
    <div class="steps-container" style="flex: 1; overflow-y: auto;">
      ${[1, 2, 3, 4, 5].map(() => html`
        <div class="step" style="height: 80px; margin-bottom: 16px;">
          <div class="skeleton skeleton-circle"></div>
          <div class="step-content" style="flex: 1; min-width: 0;">
            <div class="skeleton skeleton-text" style="width: 85%; height: 20px; margin-bottom: 8px;"></div>
            <div class="skeleton skeleton-text" style="width: 120px; height: 16px; margin-bottom: 8px;"></div>
            <div class="skeleton skeleton-text" style="width: 100px; height: 16px;"></div>
          </div>
        </div>
      `)}
    </div>
  </div>
`;

export const renderToast = (showToast, message, type) => {
  if (!showToast) return '';
  return html`
    <div class="toast" style="display: flex !important;">
      <div class="toast-spinner"></div>
      <div class="toast-message">${message}</div>
    </div>
  `;
};

export const renderModal = (showModal, selectedStepData, closeModal) => {
  if (!showModal || !selectedStepData) return '';

  return html`
    <div class="modal-overlay" style="
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    ">
      <div class="modal-content" style="
        background: var(--bg-secondary);
        border-radius: 8px;
        padding: 24px;
        width: 80%;
        max-width: 800px;
        max-height: 80vh;
        overflow-y: auto;
        position: relative;
      ">
        <button @click="${closeModal}" style="
          position: absolute;
          top: 16px;
          right: 16px;
          background: none;
          border: none;
          color: var(--text-secondary);
          font-size: 24px;
          cursor: pointer;
          padding: 4px;
          line-height: 1;
        ">×</button>
        
        <h3 style="
          margin: 0 0 16px 0;
          color: var(--text-primary);
          font-size: 20px;
        ">Files for ${selectedStepData.step}</h3>
        
        <div style="color: var(--text-secondary); margin-bottom: 16px;">
          ${selectedStepData.timestamp}
        </div>
        
        <ul style="
          margin: 0;
          padding: 0;
          list-style: none;
        ">
          ${selectedStepData.files.map((file) => html`
            <li style="
              padding: 8px;
              border-bottom: 1px solid var(--border-color);
              color: var(--text-primary);
              font-family: 'Adobe Clean Mono', monospace;
              font-size: 14px;
            ">${file}</li>
          `)}
        </ul>
      </div>
    </div>
  `;
};
