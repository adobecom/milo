import { html, useEffect, useState, Component } from '../../../deps/htm-preact.js';
import { accessToken } from '../../../tools/sharepoint/state.js';
import getServiceConfig from '../../../utils/service-config.js';
import { getServiceConfigFg, getParamsFg, postData } from '../utils/miloc.js';
import { origin } from '../../locui/utils/franklin.js';
import { heading } from '../utils/state.js';

class PromoteStatusModal extends Component {
  constructor() {
    super();
    this.state = {
      modalVisible: false,
      batches: [],
      selectedBatch: null,
      errorDetails: null,
      batchFiles: null,
      loading: false,
      showFailedPagesModal: false,
      failedPages: null,
      overallDataLoading: false,
    };
  }

  getCategoryRowStyle(category) {
    if (category === 'failedPromotes' || category === 'failedPreviews' || category === 'failedPublishes') {
      return 'background-color: #f1f1f1;'; // Light gray background for rows with failed actions
    }
    return '';
  }

  openModal = async () => {
    this.setState({
      modalVisible: true,
      loading: true,
      showBatchFiles: false,
    });

    try {
      const batchesData = await this.fetchBatchesData();
      this.setState({
        batches: batchesData,
        loading: false,
      });
    } catch (error) {
      console.error(error);
      this.setState({
        loading: false,
      });
    }
  };

  closeModal = () => {
    this.setState({
      modalVisible: false,
      selectedBatch: null,
      errorDetails: null,
      batchFiles: null,
      showFailedPagesModal: false,
      failedPages: null,
    });
  };

  handleBatchErrorClick = async (batch) => {
    this.setState({
      selectedBatch: batch,
    });

    // Fetch failed pages
    await this.fetchFailedPages(batch.batchNumber);
  };

  handleBatchClick = async (batch) => {
    this.setState({
      selectedBatch: batch,
    });

    await this.fetchBatchFiles(batch.batchNumber);
  };

  fetchBatchFiles = async (batchNumber) => {
    this.setState({ loading: true });

    try {
      const batchFilesData = await this.batchFiles(batchNumber);
      this.setState({
        batchFiles: batchFilesData,
        loading: false,
        showBatchFiles: true,
      });
    } catch (error) {
      console.error(error);
      this.setState({
        loading: false,
        showBatchFiles: false,
      });
    }
  };

  componentDidMount() {
    // Call openModal when the component is mounted
    this.openModal();
  }

  openOverallDataModal = async () => {
    this.setState({ loading: true });
    try {
      const overallData = await this.overallData();
      // Update state to show the modal with overall data
      this.setState({
        overallDataModalVisible: true,
        overallData,
        loading: false,
      });
    } catch (error) {
      console.error(error);
      // Handle error if needed
    }
  };

  closeOverallDataModal = () => {
    // Close the overall data modal
    this.setState({
      overallDataModalVisible: false,
      overallData: null,
    });
  };

  batchFiles = async (batchNumber) => {
    const config = await getServiceConfigFg(origin);
    const paramsFg = await getParamsFg(config);
    const env = heading.value.env;
    const { url } = config[env].milofg.promotestatus;
    let params = { spToken: accessToken, fgShareUrl: paramsFg.fgShareUrl, batchFiles: batchNumber };
    const batchFilesData = await postData(url, params);
    return batchFilesData.batchFiles;
  };

  fetchBatchesData = async () => {
    const config = await getServiceConfigFg(origin);
    const paramsFg = await getParamsFg(config);
    const env = heading.value.env;
    const { url } = config[env].milofg.promotestatus;
    let params = { spToken: accessToken, fgShareUrl: paramsFg.fgShareUrl, promoteStatus: true };
    const promoteStatus = await postData(url, params);
    return promoteStatus.promoteStatus.batchesInfo;
  };

  overallData = async () => {
    const config = await getServiceConfigFg(origin);
    const paramsFg = await getParamsFg(config);
    const env = heading.value.env;
    const { url } = config[env].milofg.promotestatus;
    let params = { spToken: accessToken, fgShareUrl: paramsFg.fgShareUrl, promoteResults: true };
    const overallStatus = await postData(url, params);
    const { failedPromotes, failedPreviews, failedPublishes } = overallStatus.promoteResults;

    return { failedPromotes, failedPreviews, failedPublishes };
  };

  fetchFailedPages = async (batchNumber) => {
    this.setState({ loading: true });

    try {
      const failedPagesData = await this.failedPages(batchNumber);
      this.setState({
        failedPages: failedPagesData,
        loading: false,
        showFailedPagesModal: true,
      });
    } catch (error) {
      console.error(error);
      this.setState({
        loading: false,
        showFailedPagesModal: false,
      });
    }
  };

  failedPages = async (batchNumber) => {
    const config = await getServiceConfigFg(origin);
    const paramsFg = await getParamsFg(config);
    let params = { spToken: accessToken, fgShareUrl: paramsFg.fgShareUrl, batchResults: batchNumber };
    const failedPagesData = await postData('https://14257-milofg-stage.adobeioruntime.net/api/v1/web/milo-fg/promote-status.json', params);
    const { failedPromotes, failedPreviews, failedPublishes } = failedPagesData.batchResults;

    return { failedPromotes, failedPreviews, failedPublishes };
  };

  handleBackClick = () => {
    this.setState({
      showBatchFiles: false,
      showFailedPagesModal: false,
      failedPages: null,
    });
  };

  getCategoryHeading = (category) => {
    switch (category) {
      case 'failedPreviews':
        return 'Failed Previews';
      case 'failedPromotes':
        return 'Failed Promotes';
      case 'failedPublishes':
        return 'Failed Publishes';
      default:
        return category;
    }
  };

  render() {
    const { modalVisible, batches, selectedBatch, loading, batchFiles, showBatchFiles, showFailedPagesModal, failedPages, getCategoryHeading, overallDataModalVisible, overallData, } = this.state;

    const errorSymbolVisible = batches.some(batch => batch.status === 'COMPLETED WITH ERROR');

    const modalContent = modalVisible && html`
    <div id="modal-overlay" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center; z-index: 1000;">
    <div class="modal-content larger-modal" style="position: relative; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); max-height: 80vh; overflow-y: auto; width: auto; max-width: 90%; min-height: 150px; min-width: 500px">
      <div style="text-align: center;">
        <strong style="font-size: larger; font-weight: bold;">Promote Status</strong>
        ${errorSymbolVisible && html`
          <span class="error-symbol" style="font-size: 24px; cursor: pointer; margin-left: 10px;" onClick=${this.openOverallDataModal}>⚠️</span>
        `}
      </div>
      <span class="close-btn" style="position: absolute; top: 10px; right: 10px; font-size: 24px; cursor: pointer;" onClick=${this.closeModal}>×</span>
      <div style="text-align: center; min-height: 150px; display: flex; flex-direction: column; align-items: center; justify-content: center;">
        ${loading
          ? html`<span class="loading-icon-container">
              <span class="loading-icon"></span>
            </span>`
          : html`
              ${!showBatchFiles
                ? html`
                  <table style="border-collapse: collapse; width: 100%;">
                    <thead style="background-color: #f1f1f1;">
                      <tr>
                        <th style="border: 1px solid #ddd; padding: 8px; width: 10%;">Batch Number</th>
                        <th style="border: 1px solid #ddd; padding: 8px; width: 20%;">Start Time</th>
                        <th style="border: 1px solid #ddd; padding: 8px; width: 20%;">End Time</th>
                        <th style="border: 1px solid #ddd; padding: 8px; width: 10%;">Status</th>
                        <th style="border: 1px solid #ddd; padding: 8px; width: 20%;">Files</th>
                        <th style="border: 1px solid #ddd; padding: 8px; width: 20%;">Error</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${batches.map((batch) => html`
                        <tr key=${batch.batchNumber}>
                          <td style="border: 1px solid #ddd; padding: 8px;">${batch.batchNumber}</td>
                          <td style="border: 1px solid #ddd; padding: 8px;">${batch.startTime ? new Date(batch.startTime).toLocaleString('en-US', { timeZoneName: 'short' }) : '-'}</td>
                          <td style="border: 1px solid #ddd; padding: 8px;">${batch.endTime ? new Date(batch.endTime).toLocaleString('en-US', { timeZoneName: 'short' }) : '-'}</td>
                          <td style="border: 1px solid #ddd; padding: 8px;">${batch.status || 'NOT STARTED'}</td>
                          <td style="border: 1px solid #ddd; padding: 8px; cursor: pointer; font-size: 24px;" onClick=${() => this.handleBatchClick(batch)}>
                            📂
                          </td>
                          <td style="border: 1px solid #ddd; padding: 8px;">
                            ${batch.status === 'COMPLETED WITH ERROR'
                              ? html`<span style="cursor: pointer; font-size: 24px;" onClick=${() => !showBatchFiles && this.handleBatchErrorClick(batch)}>⚠️</span>`
                              : ''}
                          </td>
                        </tr>
                      `)}
                    </tbody>
                  </table>
                `
                : html`
                  <div>
                    ${selectedBatch && html`
                      <p>Batch Number: ${selectedBatch.batchNumber}</p>
                    `}
                    ${batchFiles !== null
                      ? html`
                      <button class="back-btn fgui-urls-heading-action" style="position: absolute; top: 16px; left: 16px;" onClick=${() => this.handleBackClick()}>Back</button>
                          <table style="border-collapse: collapse; width: 100%; margin-top: 10px; border: 1px solid #ddd;">
                            <tr>
                              <td style="width: 50%; padding: 10px; vertical-align: top; border-right: 1px solid #ddd;">
                                <ol style="list-style-type: decimal; padding-left: 30px; margin: 0;">
                                  ${batchFiles.slice(0, Math.ceil(batchFiles.length / 2)).map((file, index) => html`
                                    <li style="text-align: left;">${file}</li>
                                  `)}
                                </ol>
                              </td>
                              <td style="width: 50%; padding: 10px; vertical-align: top; border-left: 1px solid #ddd;">
                                <ol start=${Math.ceil(batchFiles.length / 2) + 1} style="list-style-type: decimal; padding-left: 30px; margin: 0;">
                                  ${batchFiles.slice(Math.ceil(batchFiles.length / 2)).map((file, index) => html`
                                    <li style="text-align: left;">${file}</li>
                                  `)}
                                </ol>
                              </td>
                            </tr>
                          </table>
                        `
                      : html`<strong>Loading batch files...</strong>`}
                  </div>
                `}
            `}
        </div>
      </div>
    </div>
  `;

    // New modal for failed pages
    const failedPagesModal = showFailedPagesModal && html`
  <div id="failed-pages-modal-overlay" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center; z-index: 1001;">
    <div class="modal-content larger-modal" style="position: relative; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); max-height: 80vh; overflow-y: auto; width: 600px;"> <!-- Set a constant width for the modal -->
      <button class="back-btn fgui-urls-heading-action" style="position: absolute; top: 16px; left: 16px;" onClick=${() => this.handleBackClick()}>Back</button>
      <strong>Failed Pages for Batch ${selectedBatch ? selectedBatch.batchNumber : ''}</strong>
      ${loading
        ? html`<div><strong>Loading...</strong></div>`
        : html`
          ${Object.keys(failedPages).map((category) => html`
            <table style="border-collapse: collapse; width: 100%; margin-top: 10px; border: 1px solid #ddd;">
              <tr style="${this.getCategoryRowStyle(category)}">
                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">${this.getCategoryHeading(category)}</th>
              </tr>
              <tr>
                <td style="border: 1px solid #ddd; padding: 10px;">
                  <ol style="list-style-type: decimal; padding-left: 30px; margin: 0;">
                    ${failedPages[category].map((page, index) => html`
                      <li style="text-align: left;"> ${page}</li>
                    `)}
                  </ol>
                </td>
              </tr>
            </table>
          `)}
        `}
    </div>
  </div>
`;

const overallDataModal = overallDataModalVisible && html`
<div id="overall-data-modal-overlay" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center; z-index: 1002;">
  <div class="modal-content larger-modal" style="position: relative; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); max-height: 80vh; overflow-y: auto; width: 600px;">
    <button class="back-btn fgui-urls-heading-action" style="position: absolute; top: 16px; right: 16px;" onClick=${this.closeOverallDataModal}>×</button>
    <strong>Overall Data</strong>
    ${loading
      ? html`<span class="loading-icon-container">
      <span class="loading-icon"></span>
    </span>`
      : html`
        ${Object.keys(overallData).map((category) => html`
          <table style="border-collapse: collapse; width: 100%; margin-top: 10px; border: 1px solid #ddd;">
            <tr style="${this.getCategoryRowStyle(category)}">
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">${this.getCategoryHeading(category)}</th>
            </tr>
            <tr>
              <td style="border: 1px solid #ddd; padding: 10px;">
                <ol style="list-style-type: decimal; padding-left: 30px; margin: 0;">
                  ${overallData[category].map((item, index) => html`
                    <li style="text-align: left;"> ${item}</li>
                  `)}
                </ol>
              </td>
            </tr>
          </table>
        `)}
      `}
  </div>
</div>
`;


    return html`
    <div>
        ${modalContent}
        ${failedPagesModal}
        ${overallDataModal}
      </div>
    `;
  }
}
export default PromoteStatusModal;
