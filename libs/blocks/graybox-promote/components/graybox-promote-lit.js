import { getSheet } from '../../../../tools/utils/utils.js';
import { LitElement, html } from '../../../deps/lit-all.min.js';
import { Task } from '../../../deps/lit-task.min.js';
import { getConfig } from '../../../utils/utils.js';
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
  fetchBulkCopyStatus,
  pollBulkCopyStatus,
  initiateBulkCopy,
  initiatePromotion,
  fetchPromoteStatus,
} from '../services.js';
import {
  renderConfigSkeleton,
  renderToast,
} from './ui-components.js';
import renderBulkTab from './bulk-tab.js';
import { renderConfigSummary, renderStatusBar } from './promote-tab.js';

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

  bulkCopyPoller = null;

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

  fetchFragments = true;

  experienceName = '';

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
      const data = await fetchBulkCopyStatus(this.baseUrl, this.repo, effectiveExperienceName);

      if (data?.payload?.fileContent) {
        this.bulkCopyStatus = data;
      }
      this.requestUpdate();
    } catch (error) {
      console.error('Error fetching initial bulk copy status:', error);
    }
  }

  toggleTab(tab) {
    this.activeTab = tab;
    if (tab === 'promote') {
      // Stop bulk copy polling when switching to promote tab
      this.stopBulkCopyStatusPolling();
      this.startStatusPolling();
    } else if (tab === 'bulk') {
      // Stop promote status polling when switching to bulk tab
      this.stopStatusPolling();
      // Start bulk copy status polling when switching to bulk tab
      this.startBulkCopyStatusPolling();
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

  updateUrl(index, value) {
    this.urls = [...this.urls.slice(0, index), value, ...this.urls.slice(index + 1)];
    this.requestUpdate();
  }

  handleUrlPaste(e) {
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
    this.repo = value;
    this.requestUpdate();
  }

  toggleFetchFragments() {
    this.fetchFragments = !this.fetchFragments;
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

  async fetchBulkCopyStatus() {
    try {
      // eslint-disable-next-line max-len
      const data = await fetchBulkCopyStatus(this.baseUrl, this.repo, this.getEffectiveExperienceName());
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
    // Stop any existing polling first
    this.stopBulkCopyStatusPolling();

    // Check if required properties are available
    if (!this.baseUrl || !this.repo || !this.getEffectiveExperienceName()) {
      return;
    }

    // Create new poller instance
    this.bulkCopyPoller = pollBulkCopyStatus(
      this.baseUrl,
      this.repo,
      this.getEffectiveExperienceName(),
      (status) => {
        this.bulkCopyStatus = status;

        // Stop polling if status is completed
        if (status?.payload?.fileContent?.status === 'completed') {
          this.stopBulkCopyStatusPolling();
          this.showToast('Bulk copy completed successfully', 'success');
        }
        // Only update if we're on the bulk tab
        if (this.activeTab === 'bulk') {
          this.requestUpdate();
        }
      },
      (error) => {
        console.error('Error fetching bulk copy status:', error);
      },
      3000, // 3 seconds interval
    );

    // Start the polling
    this.bulkCopyPoller.start();
  }

  stopBulkCopyStatusPolling() {
    if (this.bulkCopyPoller) {
      this.bulkCopyPoller.stop();
      this.bulkCopyPoller = null;
    }
    // Also stop the old polling method as backup
    this.stopPollingTask('bulkCopy');
  }

  toggleStepExpansion(stepKey) {
    if (!this.expandedSteps) {
      this.expandedSteps = new Set();
    }

    if (this.expandedSteps.has(stepKey)) {
      this.expandedSteps.delete(stepKey);
    } else {
      this.expandedSteps.add(stepKey);
    }

    this.requestUpdate();
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
      const experienceName = this.getEffectiveExperienceName();
      if (!this.baseUrl || !this.repo || !experienceName) {
        return;
      }
      const data = await fetchPromoteStatus(this.baseUrl, this.repo, experienceName);
      this.currentStatus = data;
      // Only update if we're on the promote tab
      if (this.activeTab === 'promote') {
        this.requestUpdate();
      }
    } catch (error) {
      console.error('Error fetching status:', error);
    }
  }

  startStatusPolling() {
    // Check if required properties are available
    if (!this.baseUrl || !this.repo || !this.getEffectiveExperienceName()) {
      return;
    }
    this.startPollingTask('promote', () => this.fetchStatus());
  }

  stopStatusPolling() {
    this.stopPollingTask('promote');
  }

  connectedCallback() {
    super.connectedCallback();
    this.renderRoot.adoptedStyleSheets = [styleSheet, statusStyles];
  }

  async firstUpdated() {
    await this.setupTask.taskComplete;
    if (this.activeTab === 'bulk') {
      this.startBulkCopyStatusPolling();
    } else if (this.activeTab === 'promote') {
      this.startStatusPolling();
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    Object.keys(this.pollingIntervals).forEach((name) => this.stopPollingTask(name));
    // Stop bulk copy polling
    this.stopBulkCopyStatusPolling();
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
        this.setup.adminPageUri = 'https://milo.adobe.com/tools/graybox-promote'
          + `?ref=${this.ref}&repo=${mainRepo}&owner=${this.owner}&project=${mainRepo.toUpperCase()}`;
        await getGrayboxConfig(this);

        if (!this.enablePromote) {
          throw new Error('sharepoint.site.enablePromote is not enabled in graybox config');
        }

        this.configData = {
          experienceName: this.setup.experienceName,
          grayboxIoEnv: this.grayboxIoEnv,
          draftsOnly: this.setup.draftsOnly,
          promoteIgnorePaths: this.setup.promoteIgnorePaths,
          projectExcelPath: this.setup.projectExcelPath,
          projectExcelUrl: this.setup.projectExcelUrl,
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
          spToken: this.setup?.spToken,
          includeFragments: this.fetchFragments.toString(),
        });

        await initiateBulkCopy(this.baseUrl, params);

        this.showToast('Bulk copy initiated successfully', 'success');
        // Start polling for status
        this.startBulkCopyStatusPolling();
        return '';
      },
      autoRun: false,
    });

    this.promoteTask = new Task(this, {
      task: async () => {
        this.showToast('Promotion initiated...', 'info', 5000);

        const promoteRes = await initiatePromotion(this.baseUrl, this.setup);
        if (promoteRes?.code === 200) {
          return 'Promote triggered. Please check the status of your promote in the excel logs.';
        }
        throw new Error(`Could not promote: ${promoteRes.payload}`);
      },
      autoRun: false,
    });
  }

  render() {
    return html`
      <div class="wrapper">
        <div class="page-header">
          <h1>
            <svg width="32" height="28" viewBox="0 0 91 80" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-right: 12px; vertical-align: middle;">
              <g clip-path="url(#clip0_906_1839)">
                <path d="M56.9686 0H90.4318V80L56.9686 0Z" fill="#EB1000"/>
                <path d="M33.4632 0H0V80L33.4632 0Z" fill="#EB1000"/>
                <path d="M45.1821 29.4668L66.5199 80.0002H52.5657L46.1982 63.9461H30.6182L45.1821 29.4668Z" fill="#EB1000"/>
              </g>
              <defs>
                <clipPath id="clip0_906_1839">
                  <rect width="90.4318" height="80" fill="white"/>
                </clipPath>
              </defs>
            </svg>
            Graybox Promote & Bulk Copy Tool
          </h1>
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
            ${this.activeTab === 'bulk' ? renderBulkTab(this) : html`
              <div class="content-wrapper">
                <div class="sidebar">
                  ${this.setupTask.render({
    pending: () => renderConfigSkeleton(),
    complete: () => renderConfigSummary(this),
    error: (err) => html`<p>${err}</p>`,
  })}
            ${this.promoteTask.render({
    pending: () => html`<p>Promoting...</p>`,
    complete: () => '',
    error: (err) => html`<p>${err}</p>`,
  })}
                </div>
                <div class="main-content">
                  ${renderStatusBar(this)}
                </div>
              </div>
            `}
          </div>
        </div>
        ${renderToast(this.isToastVisible, this.toastMessage, this.toastType)}
      </div>
    `;
  }
}

customElements.define('graybox-promote', GrayboxPromote);
