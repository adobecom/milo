import { getSheet } from '../../../../tools/utils/utils.js';
import { LitElement, html } from '../../../deps/lit-all.min.js';
import { Task } from '../../../deps/lit-task.min.js';
import { getConfig } from '../../../utils/utils.js';
import { ALL_STATUSES } from '../constants.js';
import {
  accessToken,
  accessTokenExtra,
} from '../../../tools/sharepoint/state.js';
import {
  getAemInfo,
  getFilePath,
  getGrayboxConfig,
  getProjectInfo,
  getSharepointData,
  loginToSharepoint,
  preview,
} from '../services.js';
import {
  renderConfigSkeleton,
  renderStatusSkeleton,
  renderToast,
  renderModal,
} from './ui-components.js';
import { getStatusColor, isStepCompleted, isInProgressStep, isLastStep } from '../status-utils.js';

const { miloLibs, codeRoot } = getConfig();
const base = miloLibs || codeRoot;
const styleSheet = await getSheet(
  `${base}/blocks/graybox-promote/graybox-promote.css`,
);

const statusStyles = new CSSStyleSheet();
statusStyles.replaceSync('');

class GrayboxPromote extends LitElement {
  setup = { spToken: accessToken.value || accessTokenExtra.value };

  isAccordionOpen = false;

  configData = null;

  pollingIntervals = {};

  currentStatus = null;

  expandedSteps = new Set();

  showModal = false;

  selectedStepData = null;

  isToastVisible = false;

  toastMessage = '';

  toastType = '';

  isPromotionInProgress = false;

  activeTab = 'bulk'; // 'bulk' or 'promote'

  urls = [''];

  fetchFragments = false;

  experienceName = '';

  selectedRepo = 'bacom-graybox';

  repos = [
    'bacom-graybox',
    'cc-graybox',
    'dc-graybox',
    'homepage-graybox',
    'federal-graybox',
  ];

  showFragmentsModal = false;

  foundFragments = [];

  validationErrors = {
    urls: '',
    experienceName: '',
  };

  bulkCopyStatus = null;

  showToast(message, type, duration = 3000) {
    this.toastMessage = message;
    this.toastType = type;
    this.isToastVisible = true;
    this.requestUpdate();

    if (duration > 0) {
      setTimeout(() => {
        this.isToastVisible = false;
        this.requestUpdate();
      }, duration);
    }
  }

  async fetchInitialBulkCopyStatus() {
    const effectiveExperienceName = this.getEffectiveExperienceName();
    if (!effectiveExperienceName) return;

    try {
      const statusUrl = `${this.baseUrl}/file-status.json?showContent=graybox_promote/${this.selectedRepo}/${effectiveExperienceName}/bulk-copy-status.json`;
      const response = await fetch(statusUrl);
      const data = await response.json();

      if (data?.payload?.fileContent) {
        this.bulkCopyStatus = data;
        // If status is completed, show the success toast briefly
        if (data.payload.fileContent.status === 'completed') {
          this.showToast('Bulk copy completed successfully', 'success');
        }
      }
      this.requestUpdate();
    } catch (error) {
      console.error('Error fetching initial bulk copy status:', error);
    }
  }

  toggleTab(tab) {
    this.activeTab = tab;
    if (tab === 'promote') {
      this.startStatusPolling();
    } else {
      this.stopStatusPolling();
      // Check bulk copy status when switching to bulk tab
      this.fetchInitialBulkCopyStatus();
    }
    this.requestUpdate();
  }

  addUrlField() {
    this.urls = [...this.urls, ''];
    this.requestUpdate();
  }

  removeUrlField(index) {
    if (this.urls.length > 1) {
      this.urls = this.urls.filter((_, i) => i !== index);
      this.requestUpdate();
    }
  }

  async updateUrl(index, value) {
    this.urls = [...this.urls.slice(0, index), value, ...this.urls.slice(index + 1)];
    if (this.fetchFragments && value.trim()) {
      try {
        await this.setupTask.taskComplete;
        const fragments = await this.findFragments();
        // Normalize fragments to expected format
        this.foundFragments = fragments.map((frag) => (
          typeof frag === 'string'
            ? [{ pathname: frag, valid: 'found' }]
            : frag
        ));
        if (this.foundFragments && this.foundFragments.length > 0) {
          this.showFragments();
        }
        this.requestUpdate();
      } catch (error) {
        console.error('Error finding fragments:', error);
        alert('Error finding fragments. Please try again.');
      }
    }
    this.requestUpdate();
  }

  async handleUrlPaste(e) {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const urls = pastedText
      .split(/[\n\r]+/)
      .map((url) => url.trim())
      .filter((url) => url.length > 0);

    if (urls.length > 1) {
      // Replace current URL with first one and add the rest
      this.urls = [urls[0], ...urls.slice(1)];
    } else {
      // Just update the current URL
      this.updateUrl(0, urls[0]);
    }

    // If fetch fragments is enabled, find fragments for the new URLs
    if (this.fetchFragments) {
      try {
        await this.setupTask.taskComplete;
        const fragments = await this.findFragments();
        // Normalize fragments to expected format
        this.foundFragments = fragments.map((frag) => (
          typeof frag === 'string'
            ? [{ pathname: frag, valid: 'found' }]
            : frag
        ));
        if (this.foundFragments && this.foundFragments.length > 0) {
          this.showFragments();
        }
        this.requestUpdate();
      } catch (error) {
        console.error('Error finding fragments:', error);
        alert('Error finding fragments. Please try again.');
      }
    }

    this.requestUpdate();
  }

  updateExperienceName(value) {
    this.experienceName = value;
    if (value.trim()) {
      this.validationErrors.experienceName = '';
    }
    this.requestUpdate();
  }

  getEffectiveExperienceName() {
    return this.experienceName || this.configData?.experienceName || '';
  }

  updateSelectedRepo(value) {
    this.selectedRepo = value;
    this.requestUpdate();
  }

  async toggleFetchFragments() {
    this.fetchFragments = !this.fetchFragments;
    if (this.fetchFragments && this.urls.some((url) => url.trim())) {
      try {
        await this.setupTask.taskComplete;
        const fragments = await this.findFragments();
        console.log('fragments in toggleFetchFragments', fragments);
        // Normalize fragments to expected format
        this.foundFragments = fragments.map((frag) => (
          typeof frag === 'string'
            ? [{ pathname: frag, valid: 'found' }]
            : frag
        ));
        if (this.foundFragments && this.foundFragments.length > 0) {
          this.showFragments();
        }
        this.requestUpdate();
      } catch (error) {
        console.error('Error finding fragments:', error);
        alert('Error finding fragments. Please try again.');
        this.fetchFragments = false;
        this.requestUpdate();
      }
    } else {
      this.foundFragments = [];
      this.showFragmentsModal = false;
    }
    this.requestUpdate();
  }

  validateUrls() {
    if (!this.urls.length) {
      this.validationErrors.urls = 'Please enter at least one URL';
      return false;
    }

    try {
      const firstUrl = new URL(this.urls[0]);
      const allValid = this.urls.every((url) => {
        try {
          const urlObj = new URL(url);
          return urlObj.hostname === firstUrl.hostname;
        } catch {
          return false;
        }
      });

      if (!allValid) {
        this.validationErrors.urls = 'All URLs must be from the same domain';
        return false;
      }

      this.validationErrors.urls = '';
      return true;
    } catch {
      this.validationErrors.urls = 'Please enter valid URLs';
      return false;
    }
  }

  static getLangstorePrefix() {
    const { locale } = getConfig();
    if (!locale?.prefix) return '';
    return locale.prefix;
  }

  static getUrls(fragments) {
    return fragments.map((fragment) => ({
      pathname: fragment.pathname,
      valid: fragment.valid,
    }));
  }

  async findFragments() {
    const filteredUrls = this.urls.filter((url) => url.trim());
    if (!filteredUrls.length) return [];

    const params = new URLSearchParams({
      sourcePaths: filteredUrls.join(', '),
      adminPageUri: this.setup.adminPageUri,
      driveId: this.setup.driveId,
      gbRootFolder: this.setup.gbRootFolder,
      rootFolder: this.setup.rootFolder,
      experienceName: this.getEffectiveExperienceName(),
      projectExcelPath: this.configData?.projectExcelPath,
    });

    const apiUrl = `${this.baseUrl}/find-fragments?${params.toString()}`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Handle the API response based on the actual format
    if (data.fragmentLinks && Array.isArray(data.fragmentLinks)) {
      const frags = data.fragmentLinks;
      console.log('fragments fetched from server', frags);
      return frags;
    }

    if (Array.isArray(data)) {
      console.log('fragments fetched from server', data);
      return data;
    }

    return [];
  }

  showFragments() {
    this.showFragmentsModal = true;
    this.requestUpdate();
  }

  closeFragmentsModal() {
    this.showFragmentsModal = false;
    this.requestUpdate();
  }

  renderFragmentsModal() {
    if (!this.showFragmentsModal) return '';
    return html`
      <div class="modal-overlay" style="
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgb(0 0 0 / 50%);
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
          <button @click="${this.closeFragmentsModal}" style="
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
          ">Found Fragments</h3>
          
          <div style="color: var(--text-secondary); margin-bottom: 16px;">
            ${this.foundFragments.length} fragments found
          </div>
          
          <div style="
            display: grid;
            gap: 8px;
            margin-bottom: 24px;
          ">
            ${this.foundFragments.map((fragment) => html`
              <div style="
                padding: 12px;
                background: var(--bg-primary);
                border-radius: 4px;
                border: 1px solid var(--border-color);
                display: flex;
                align-items: center;
                gap: 12px;
              ">
                <div style="
                  width: 8px;
                  height: 8px;
                  border-radius: 50%;
                  background: ${fragment[0].valid === 'not found' ? 'var(--error-color)' : 'var(--accent-color)'};
                "></div>
                <div style="
                  flex: 1;
                  font-family: 'Adobe Clean Mono', monospace;
                  font-size: 14px;
                  color: var(--text-primary);
                  word-break: break-all;
                ">${fragment[0].pathname}</div>
              </div>
            `)}
          </div>

          <div style="
            display: flex;
            gap: 12px;
            justify-content: flex-end;
          ">
            <button 
              @click="${this.closeFragmentsModal}"
              style="
                background: var(--bg-primary);
                color: var(--text-primary);
                border: 1px solid var(--border-color);
              "
            >Close</button>
            <button 
              @click="${this.addFragmentsToUrls}"
              style="
                background: var(--accent-color);
                color: var(--text-primary);
              "
            >Add to the list</button>
          </div>
        </div>
      </div>
    `;
  }

  addFragmentsToUrls() {
    // Get all valid fragment URLs
    const fragmentUrls = this.foundFragments
      .filter((fragment) => fragment[0].valid !== 'not found')
      .map((fragment) => fragment[0].pathname);

    const existingUrls = new Set(this.urls);
    const urlsToAdd = fragmentUrls.filter((url) => !existingUrls.has(url));

    if (urlsToAdd.length > 0) {
      this.urls = [...this.urls, ...urlsToAdd];
    }

    // Close the modal
    this.closeFragmentsModal();
    this.requestUpdate();
  }

  async fetchBulkCopyStatus() {
    try {
      const statusUrl = `${this.baseUrl}/file-status.json?showContent=graybox_promote/${this.selectedRepo}/${this.getEffectiveExperienceName()}/bulk-copy-status.json`;
      const response = await fetch(statusUrl);
      const data = await response.json();
      this.bulkCopyStatus = data;

      // Stop polling if status is completed
      if (data?.payload?.fileContent?.status === 'completed') {
        this.stopBulkCopyStatusPolling();
        this.showToast('Bulk copy completed successfully', 'success');
      }
      this.requestUpdate();
    } catch (error) {
      console.error('Error fetching bulk copy status:', error);
    }
  }

  startPollingTask(name, callback, interval = 3000) {
    this.stopPollingTask(name); // Ensure no duplicate polls
    this.pollingIntervals[name] = setInterval(callback, interval);
  }

  stopPollingTask(name) {
    if (this.pollingIntervals[name]) {
      clearInterval(this.pollingIntervals[name]);
      this.pollingIntervals[name] = null;
    }
  }

  startBulkCopyStatusPolling() {
    this.startPollingTask('bulkCopy', () => this.fetchBulkCopyStatus());
  }

  stopBulkCopyStatusPolling() {
    this.stopPollingTask('bulkCopy');
  }

  async handleBulkCopy() {
    // Validate URLs
    const urlsValid = this.validateUrls();

    // Validate experience name
    const effectiveExperienceName = this.getEffectiveExperienceName();
    if (!effectiveExperienceName.trim()) {
      this.validationErrors.experienceName = 'Please enter an experience name';
    } else {
      this.validationErrors.experienceName = '';
    }

    // If validation fails, update UI and return
    if (!urlsValid || !effectiveExperienceName.trim()) {
      this.requestUpdate();
      return;
    }

    await this.setupTask.taskComplete;

    // Run the bulk copy task
    this.bulkCopyTask.run();
  }

  toggleFiles(stepStatus) {
    if (this.expandedSteps.has(stepStatus)) {
      this.expandedSteps.delete(stepStatus);
    } else {
      this.expandedSteps.add(stepStatus);
    }
    this.requestUpdate();
  }

  showFilesModal(stepData) {
    this.selectedStepData = stepData;
    this.showModal = true;
    this.requestUpdate();
  }

  closeModal() {
    this.showModal = false;
    this.selectedStepData = null;
    this.requestUpdate();
  }

  async fetchStatus() {
    try {
      const { experienceName } = this.setup;
      const statusUrl = `${this.baseUrl}/file-status.json?showContent=graybox_promote/${this.repo}/${experienceName}/status.json`;
      const response = await fetch(statusUrl);
      const data = await response.json();
      this.currentStatus = data;
      this.requestUpdate();
    } catch (error) {
      console.error('Error fetching status:', error);
    }
  }

  startStatusPolling() {
    this.startPollingTask('promote', () => this.fetchStatus());
  }

  stopStatusPolling() {
    this.stopPollingTask('promote');
  }

  async connectedCallback() {
    super.connectedCallback();
    this.renderRoot.adoptedStyleSheets = [styleSheet, statusStyles];
    if (this.activeTab === 'promote') {
      this.startStatusPolling();
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    Object.keys(this.pollingIntervals).forEach((name) => this.stopPollingTask(name));
  }

  constructor() {
    super();
    this.expandedSteps = new Set();
    this.showModal = false;
    this.selectedStepData = null;

    this.setupTask = new Task(this, {
      task: async () => {
        if (!this.setup.spToken) await loginToSharepoint(this);
        getAemInfo(this);
        await getFilePath(this);
        if (!this.previewUrl) await preview(this);
        await getProjectInfo(this);
        await getSharepointData(this);
        const mainRepo = this.repo.replace('-graybox', '');
        this.setup.adminPageUri = `https://milo.adobe.com/tools/graybox-promote?ref=${this.ref}&repo=${mainRepo}&owner=${this.owner}&project=${mainRepo.toUpperCase()}`;
        await getGrayboxConfig(this);

        if (!this.enablePromote) throw new Error('sharepoint.site.enablePromote is not enabled in graybox config');

        this.configData = {
          experienceName: this.setup.experienceName,
          grayboxIoEnv: this.grayboxIoEnv,
          draftsOnly: this.setup.draftsOnly,
          promoteIgnorePaths: this.setup.promoteIgnorePaths,
          projectExcelPath: this.setup.projectExcelPath,
        };

        return true;
      },
      args: () => [],
    });

    this.bulkCopyTask = new Task(this, {
      task: async () => {
        this.showToast('Bulk copy initiated...', 'info', 5000);

        // Prepare the API call parameters
        const params = new URLSearchParams({
          sourcePaths: this.urls.join(', '),
          adminPageUri: this.setup.adminPageUri,
          driveId: this.setup.driveId,
          gbRootFolder: this.setup.gbRootFolder,
          rootFolder: this.setup.rootFolder,
          experienceName: this.getEffectiveExperienceName(),
          projectExcelPath: this.configData?.projectExcelPath,
        });

        const bulkCopyUrl = `${this.baseUrl}/bulk-copy?${params.toString()}`;
        const response = await fetch(bulkCopyUrl);
        const data = await response.json();

        if (response.ok) {
          this.showToast('Bulk copy initiated successfully', 'success');
          // Start polling for status
          this.startBulkCopyStatusPolling();
          return '';
        }
        throw new Error(data?.payload || 'Failed to initiate bulk copy');
      },
      autoRun: false,
    });

    this.promoteTask = new Task(this, {
      task: async () => {
        this.showToast('Promotion initiated...', 'info', 5000);

        const promote = await fetch(`${this.baseUrl}/promote.json`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(this.setup).toString(),
        });
        const promoteRes = await promote.json();
        if (promoteRes?.code === 200) {
          return 'Promote triggered. Please check the status of your promote in the excel logs.';
        }
        throw new Error(`Could not promote: ${promote.payload}`);
      },
      autoRun: false,
    });
  }

  renderConfigSummary() {
    if (!this.configData) return renderConfigSkeleton();
    const currentStatus = this.currentStatus?.payload?.fileContent?.status;
    const isPromotionInProgress = currentStatus && (currentStatus !== 'final_preview_done');

    return html`
      <div class="config-summary" style="height: 100%; display: flex; flex-direction: column;">
        <h2 style="margin: 0 0 20px 0; height: 28px;">Configuration Summary</h2>
        <div class="config-list" style="flex: 1; overflow-y: auto;">
          ${this.repo ? html`
            <div class="config-item">
              <strong>Repository</strong>
              <span>${this.repo}</span>
            </div>
          ` : ''}
          <div class="config-item">
            <strong>Experience Name</strong>
            <span>${this.configData.experienceName}</span>
          </div>
          <div class="config-item">
            <strong>Environment</strong>
            <span>${this.configData.grayboxIoEnv || 'prod'}</span>
          </div>
          <div class="config-item">
            <strong>Project File</strong>
            <a href="${this.referrer}" target="_blank" style="display: inline-flex; align-items: center; gap: 4px; text-decoration: none;">
              <span style="text-decoration: underline;">${new URL(this.referrer).searchParams.get('file')}</span>
            </a>
          </div>
          <div class="config-item">
            <strong>Promote Drafts Only <span class="tooltip" title="Disables Gray Box promote from anywhere but the environments' drafts folder when TRUE.">ⓘ</span></strong>
            <span>${this.configData.draftsOnly ? 'Yes' : 'No'}</span>
          </div>
          ${this.configData.promoteIgnorePaths ? html`
            <div class="config-item">
              <div class="accordion">
                <div class="accordion-header ${this.isAccordionOpen ? '' : 'collapsed'}" @click="${this.toggleAccordion}">
                  <strong>Ignored Paths</strong>
                </div>
                <div class="accordion-content ${this.isAccordionOpen ? 'expanded' : ''}">
                  <pre>${this.configData?.promoteIgnorePaths?.split(',')?.map((path) => `${path}\n`)}</pre>
                </div>
              </div>
            </div>
          ` : ''}
        </div>
        <p style="height: 24px; margin: 32px 0;">Are you sure you want to promote the content for <strong>${this.configData.experienceName}</strong>?</p>
        <button 
          @click="${() => this.promoteTask.run()}" 
          style="height: 44px"
          >
          ${isPromotionInProgress ? 'Promotion in Progress...' : 'Promote'}
        </button>
      </div>
    `;
  }

  renderStatusBar() {
    if (!this.currentStatus) return renderStatusSkeleton();

    const { status, statuses } = this.currentStatus.payload.fileContent;
    const currentIndex = ALL_STATUSES.indexOf(status);
    const progress = ((currentIndex + 1) / ALL_STATUSES.length) * 100;

    // Hide toast when status steps are reflecting
    if (status === 'initiated') {
      this.isToastVisible = false;
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
                        <button @click="${() => this.showFilesModal(stepData)}" style="
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
      ${renderModal(this.showModal, this.selectedStepData, this.closeModal)}
    `;
  }

  renderBulkTab() {
    return html`
      <div class="bulk-tab">
        <div class="form-group">
          <label>URLs</label>
          ${this.urls.map((url, index) => html`
            <div class="url-input-group">
              <input 
                type="text" 
                .value=${url}
                @input=${(e) => this.updateUrl(index, e.target.value)}
                @paste=${index === 0 ? this.handleUrlPaste : undefined}
                placeholder="Enter URL or paste multiple URLs"
              />
              ${this.urls.length > 1 ? html`
                <button 
                  class="remove-url" 
                  @click=${() => this.removeUrlField(index)}
                >×</button>
              ` : ''}
            </div>
          `)}
          ${this.validationErrors.urls ? html`
            <div class="error-message" style="color: var(--error-color); margin-top: 4px; font-size: 14px; display: flex; align-items: center; gap: 4px;">
              <span style="font-size: 16px;">⚠️</span>
              ${this.validationErrors.urls}
            </div>
          ` : ''}
          <button 
            class="add-url" 
            @click=${this.addUrlField}
          >+ Add URL</button>
        </div>

        <div class="form-group">
          <label class="toggle-label">
            <input 
              type="checkbox" 
              .checked=${this.fetchFragments}
              @change=${this.toggleFetchFragments}
            />
            Fetch Fragments
          </label>
        </div>

        <div class="form-group">
          <label>Experience Name</label>
          <input 
            type="text" 
            .value=${this.getEffectiveExperienceName()}
            @input=${(e) => this.updateExperienceName(e.target.value)}
            placeholder="Enter experience name"
          />
          ${this.validationErrors.experienceName ? html`
            <div class="error-message" style="color: var(--error-color); margin-top: 4px; font-size: 14px; display: flex; align-items: center; gap: 4px;">
              <span style="font-size: 16px;">⚠️</span>
              ${this.validationErrors.experienceName}
            </div>
          ` : ''}
        </div>

        <div class="form-group">
          <label>Repository</label>
          <input 
            type="text"
            .value=${this.configData?.repo || this.repo}
            readonly
            disabled
          />
        </div>

        <button 
          class="bulk-copy-btn"
          @click=${this.handleBulkCopy}
        >Bulk Copy</button>

        ${this.bulkCopyTask.render({
          pending: () => html`<p>Processing bulk copy...</p>`,
          complete: () => '',
          error: (err) => html`<p style="color: var(--error-color);">Error: ${err}</p>`,
        })}

        ${this.bulkCopyStatus ? html`
          <div class="bulk-copy-status" style="margin-top: 24px; padding: 16px; background: var(--bg-primary); border-radius: 8px; border: 1px solid var(--border-color);">
            <h3 style="margin: 0 0 16px 0; color: var(--text-primary);">Bulk Copy Status</h3>
            <div style="color: var(--text-secondary);">
              Current Status: <span style="color: ${this.bulkCopyStatus.payload.fileContent.status === 'completed' ? '#4CAF50' : 'var(--accent-color)'}">
                ${this.bulkCopyStatus.payload.fileContent.status.toUpperCase()}
              </span>
            </div>
            ${this.bulkCopyStatus.payload.fileContent.statuses ? html`
              <div style="margin-top: 16px;">
                <h4 style="margin: 0 0 8px 0; color: var(--text-primary);">Progress</h4>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                  ${this.bulkCopyStatus.payload.fileContent.statuses.map((status) => html`
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
  }

  render() {
    return html`
      <div class="wrapper">
        <div class="page-header">
          <h1>Graybox Promote Tool</h1>
        </div>
        <div class="tabs">
          <div class="tab-buttons">
            <button 
              class=${this.activeTab === 'bulk' ? 'active' : ''}
              @click=${() => this.toggleTab('bulk')}
            >Bulk Copy</button>
            <button 
              class=${this.activeTab === 'promote' ? 'active' : ''}
              @click=${() => this.toggleTab('promote')}
            >Promote</button>
          </div>
          <div class="tab-content">
            ${this.activeTab === 'bulk' ? this.renderBulkTab() : html`
              <div class="content-wrapper">
                <div class="sidebar">
                  ${this.setupTask.render({
                    pending: () => renderConfigSkeleton(),
                    complete: () => this.renderConfigSummary(),
                    error: (err) => html`<p>${err}</p>`,
                  })}
                  ${this.promoteTask.render({
                    pending: () => html`<p>Promoting...</p>`,
                    complete: () => '',
                    error: (err) => html`<p>${err}</p>`,
                  })}
                </div>
                <div class="main-content">
                  ${this.renderStatusBar()}
                </div>
              </div>
            `}
          </div>
        </div>
        ${renderToast(this.isToastVisible, this.toastMessage, this.toastType)}
        ${this.renderFragmentsModal()}
      </div>
    `;
  }
}

customElements.define('graybox-promote', GrayboxPromote);
