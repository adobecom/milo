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
      <div class="bulk-copy-status" style="margin-top: 24px; padding: 16px; background: var(--bg-primary); border-radius: 8px; border: 1px solid var(--border-color);">
        <h3 style="margin: 0 0 16px 0; color: var(--text-primary);">Bulk Copy Status</h3>
        <div style="color: var(--text-secondary);">
          Current Status: <span style="color: ${component.bulkCopyStatus.payload.fileContent.status === 'completed' ? '#4CAF50' : 'var(--accent-color)'}">
            ${component.bulkCopyStatus.payload.fileContent.status.toUpperCase()}
          </span>
        </div>
        ${component.bulkCopyStatus.payload.fileContent.statuses ? html`
          <div style="margin-top: 16px;">
            <h4 style="margin: 0 0 8px 0; color: var(--text-primary);">Progress</h4>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              ${component.bulkCopyStatus.payload.fileContent.statuses.map((status) => html`
                <div style="
                  padding: 8px;
                  background: var(--bg-secondary);
                  border-radius: 4px;
                  font-size: 14px;
                  color: var(--text-secondary);
                ">
                  ${status.file ? `File: ${status.file}` : ''}
                  ${status.status ? `Status: ${status.status.replace(/_/g, ' ').toUpperCase()}` : ''}
                  ${status.timestamp ? `Time: ${new Date(status.timestamp).toLocaleTimeString()}` : ''}
                </div>
              `)}
            </div>
          </div>
        ` : ''}
      </div>
    ` : ''}
  </div>
`;

export default renderBulkTab;
