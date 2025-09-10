import { html } from '../../../deps/lit-all.min.js';

const renderBulkTab = (component) => html`
  <div class="bulk-tab">
    <div class="form-group">
      <label>URLs</label>
      ${component.urls.map((url, index) => html`
        <div class="url-input-group">
          <input 
            type="text" 
            .value=${url}
            @input=${(e) => component.updateUrl(index, e.target.value)}
            @paste=${index === 0 ? component.handleUrlPaste : undefined}
            placeholder="Enter URL or paste multiple URLs"
          />
          ${component.urls.length > 1 ? html`
            <button 
              class="remove-url" 
              @click=${() => component.removeUrlField(index)}
            >×</button>
          ` : ''}
        </div>
      `)}
      ${component.validationErrors.urls ? html`
        <div class="error-message" style="color: var(--error-color); margin-top: 4px; font-size: 14px; display: flex; align-items: center; gap: 4px;">
          <span style="font-size: 16px;">⚠️</span>
          ${component.validationErrors.urls}
        </div>
      ` : ''}
      <button 
        class="add-url" 
        @click=${component.addUrlField}
      >+ Add URL</button>
    </div>

    <div class="form-group">
      <label class="toggle-label">
        <input 
          type="checkbox" 
          .checked=${component.fetchFragments}
          @change=${component.toggleFetchFragments}
        />
        Fetch Fragments
      </label>
    </div>

    <div class="form-group">
      <label>Experience Name</label>
      <input 
        type="text" 
        .value=${component.getEffectiveExperienceName()}
        @input=${(e) => component.updateExperienceName(e.target.value)}
        placeholder="Enter experience name"
      />
      ${component.validationErrors.experienceName ? html`
        <div class="error-message" style="color: var(--error-color); margin-top: 4px; font-size: 14px; display: flex; align-items: center; gap: 4px;">
          <span style="font-size: 16px;">⚠️</span>
          ${component.validationErrors.experienceName}
        </div>
      ` : ''}
    </div>

    <div class="form-group">
      <label>Repository</label>
      <input 
        type="text"
        .value=${component.configData?.repo || component.repo}
        readonly
        disabled
      />
    </div>

    <button 
      class="bulk-copy-btn"
      @click=${component.handleBulkCopy}
    >Bulk Copy</button>

    ${component.bulkCopyTask.render({
      pending: () => html`<p>Processing bulk copy...</p>`,
      complete: () => '',
      error: (err) => html`<p style="color: var(--error-color);">Error: ${err}</p>`,
    })}

    ${component.bulkCopyStatus ? html`
      <div class="bulk-copy-status" style="margin-top: 24px; padding: 20px; background: var(--bg-primary); border-radius: 12px; border: 1px solid var(--border-color);">
        <!-- Header Section -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <h3 style="margin: 0; color: var(--text-primary); font-size: 18px;">Bulk Copy Status</h3>
          <div style="display: flex; align-items: center; gap: 8px;">
            <div style="
              padding: 4px 12px; 
              border-radius: 20px; 
              background: ${component.bulkCopyStatus.payload.fileContent.overallStatus === 'completed' ? '#E8F5E8' : '#FFF3CD'};
              color: ${component.bulkCopyStatus.payload.fileContent.overallStatus === 'completed' ? '#2E7D32' : '#856404'};
              font-size: 12px;
              font-weight: 600;
              text-transform: uppercase;
            ">
              ${component.bulkCopyStatus.payload.fileContent.overallStatus}
            </div>
          </div>
        </div>

        

        <!-- Steps Section -->
        <div style="margin-bottom: 20px;">
          <h4 style="margin: 0 0 16px 0; color: var(--text-primary); font-size: 16px;">Processing Steps</h4>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            ${Object.entries(component.bulkCopyStatus.payload.fileContent.steps).map(([stepKey, step], index) => html`
              <div style="
                background: var(--bg-secondary); 
                border-radius: 8px; 
                border-left: 4px solid ${step.status === 'completed' ? '#4CAF50' : step.status === 'failed' ? '#F44336' : '#FF9800'};
                overflow: hidden;
              ">
                <!-- Step Header (Always Visible) -->
                <div style="
                  padding: 12px 16px; 
                  cursor: pointer; 
                  display: flex; 
                  justify-content: space-between; 
                  align-items: center;
                  transition: background-color 0.2s ease;
                " 
                @click=${() => component.toggleStepExpansion(stepKey)}
                onmouseover="this.style.backgroundColor='var(--bg-primary)'"
                onmouseout="this.style.backgroundColor='transparent'">
                  <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="
                      width: 24px; 
                      height: 24px; 
                      border-radius: 50%; 
                      background: ${step.status === 'completed' ? '#4CAF50' : step.status === 'failed' ? '#F44336' : '#FF9800'};
                      display: flex; 
                      align-items: center; 
                      justify-content: center;
                      color: white;
                      font-size: 12px;
                      font-weight: bold;
                    ">
                      ${step.status === 'completed' ? '✓' : step.status === 'failed' ? '✗' : index + 1}
                    </div>
                    <div>
                      <h5 style="margin: 0; color: var(--text-primary); font-size: 14px; font-weight: 600;">${step.name}</h5>
                      <div style="font-size: 12px; color: var(--text-secondary);">
                        ${step.progress.completed}/${step.progress.total} completed
                        ${step.endTime ? ` • ${new Date(step.endTime).toLocaleTimeString()}` : ''}
                      </div>
                    </div>
                  </div>
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <div style="
                      padding: 2px 8px; 
                      border-radius: 12px; 
                      background: ${step.status === 'completed' ? '#E8F5E8' : step.status === 'failed' ? '#FFEBEE' : '#FFF3CD'};
                      color: ${step.status === 'completed' ? '#2E7D32' : step.status === 'failed' ? '#C62828' : '#856404'};
                      font-size: 11px;
                      font-weight: 600;
                      text-transform: uppercase;
                    ">
                      ${step.status}
                    </div>
                    <div style="
                      transform: ${component.expandedSteps?.has(stepKey) ? 'rotate(180deg)' : 'rotate(0deg)'};
                      transition: transform 0.2s ease;
                      font-size: 12px;
                      color: var(--text-secondary);
                    ">
                      ▼
                    </div>
                  </div>
                </div>

                <!-- Expandable Content -->
                ${component.expandedSteps?.has(stepKey) ? html`
                  <div style="padding: 0 16px 16px 52px; border-top: 1px solid var(--border-color);">
                    <!-- Progress Bar -->
                    <div style="margin-bottom: 16px;">
                      <div style="display: flex; justify-content: space-between; font-size: 12px; color: var(--text-secondary); margin-bottom: 6px;">
                        <span>Progress</span>
                        <span>${step.progress.completed}/${step.progress.total}</span>
                      </div>
                      <div style="
                        width: 100%; 
                        height: 8px; 
                        background: #E0E0E0; 
                        border-radius: 4px; 
                        overflow: hidden;
                      ">
                        <div style="
                          width: ${(step.progress.completed / step.progress.total) * 100}%; 
                          height: 100%; 
                          background: ${step.status === 'completed' ? '#4CAF50' : step.status === 'failed' ? '#F44336' : '#FF9800'};
                          transition: width 0.3s ease;
                        "></div>
                      </div>
                    </div>

                    <!-- Step Details -->
                    ${step.details ? html`
                      <div style="margin-bottom: 16px;">
                        <h6 style="margin: 0 0 8px 0; color: var(--text-primary); font-size: 13px; font-weight: 600;">Details</h6>
                        <div style="font-size: 12px; color: var(--text-secondary);">
                          ${Object.entries(step.details).map(([key, value]) => {
                            if (Array.isArray(value)) {
                              return html`
                                <div style="margin-bottom: 8px;">
                                  <strong>${key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</strong>
                                  <div style="margin-left: 8px; margin-top: 4px; max-height: 120px; overflow-y: auto;">
                                    ${value.map(item => html`
                                      <div style="
                                        padding: 4px 8px; 
                                        margin: 2px 0; 
                                        background: var(--bg-primary); 
                                        border-radius: 4px; 
                                        font-family: monospace; 
                                        font-size: 11px;
                                        word-break: break-all;
                                      ">${item}</div>
                                    `)}
                                  </div>
                                </div>
                              `;
                            } else if (typeof value === 'object' && value !== null) {
                              return html`
                                <div style="margin-bottom: 8px;">
                                  <strong>${key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</strong>
                                  <div style="margin-left: 8px; margin-top: 4px;">
                                    ${Object.entries(value).map(([subKey, subValue]) => html`
                                      <div style="font-size: 11px; margin: 2px 0;">${subKey.replace(/_/g, ' ')}: ${subValue}</div>
                                    `)}
                                  </div>
                                </div>
                              `;
                            } else {
                              return html`
                                <div style="margin-bottom: 4px;">
                                  <strong>${key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</strong> ${value}
                                </div>
                              `;
                            }
                          })}
                        </div>
                      </div>
                    ` : ''}

                    <!-- Timing Information -->
                    ${step.startTime || step.endTime ? html`
                      <div style="
                        padding: 8px 12px; 
                        background: var(--bg-primary); 
                        border-radius: 6px; 
                        font-size: 11px; 
                        color: var(--text-secondary);
                      ">
                        <div style="display: flex; justify-content: space-between;">
                          ${step.startTime ? html`<span>Started: ${new Date(step.startTime).toLocaleString()}</span>` : ''}
                          ${step.endTime ? html`<span>Completed: ${new Date(step.endTime).toLocaleString()}</span>` : ''}
                        </div>
                      </div>
                    ` : ''}
                  </div>
                ` : ''}
              </div>
            `)}
          </div>
        </div>

        <!-- Overall Timing -->
        <div style="
          padding: 12px; 
          background: var(--bg-secondary); 
          border-radius: 8px; 
          font-size: 12px; 
          color: var(--text-secondary);
          border-top: 1px solid var(--border-color);
          margin-top: 16px;
        ">
          <div style="display: flex; justify-content: space-between;">
            <span>Started: ${new Date(component.bulkCopyStatus.payload.fileContent.startTime).toLocaleString()}</span>
            <span>Completed: ${new Date(component.bulkCopyStatus.payload.fileContent.endTime).toLocaleString()}</span>
          </div>
        </div>
      </div>
    ` : ''}
  </div>
`;

export default renderBulkTab;
