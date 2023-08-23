/*
 * Copyright 2023 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import { createTag } from '../../utils/utils.js';
import { ImageGenerator, MONITOR_STATUS } from './nethraa/fireflyApi.js';
import useProgressManager from './progress-manager.js';

const imageGenerator = new ImageGenerator();
// import { openFeedbackModal } from './feedback-modal.js';
const fireflyState = {
  fetchingState: {
    intervalId: null,
    progressManager: null,
    results: null,
    searchPositionMap: new Map(),
  },
};

const NUM_RESULTS = 4;
const RESULTS_ROTATION = 3;
const MONITOR_INTERVAL = 2000;
const AVG_GENERATION_TIME = 30000;
const PROGRESS_ANIMATION_DURATION = 1000;
const PROGRESS_BAR_LINGER_DURATION = 500;
const REQUEST_GENERATION_RETRIES = 3;

function getTemplateBranchUrl(result) {
  const { thumbnail } = result;
  return `https://prod-search.creativecloud.adobe.com/express?express=true&protocol=https&imageHref=${thumbnail}`;
}

function createTemplate(result) {
  const templateBranchUrl = getTemplateBranchUrl(result);
  const templateWrapper = createTag('div', { class: 'generated-template-wrapper' });
  const hoverContainer = createTag('div', { class: 'hover-container' });

  const CTAButton = createTag('a', {
    class: 'cta-button button accent',
    target: '_blank',
    href: '#',
  });
  CTAButton.textContent = 'Edit this template';
  CTAButton.addEventListener('click', (e) => {
    e.preventDefault();
  });
  hoverContainer.append(CTAButton);

  const feedbackRow = createTag('div', { class: 'feedback-row' });

  feedbackRow.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
  });

  hoverContainer.append(feedbackRow);

  templateWrapper.append(createTag('img', { src: result, class: 'generated-template-image' }));
  hoverContainer.addEventListener('click', () => {
    window.open(templateBranchUrl, '_blank').focus();
  });
  templateWrapper.append(hoverContainer);
  return templateWrapper;
}

async function waitForGeneration(jobId) {
  const { fetchingState } = fireflyState;
  const { progressManager } = fetchingState;

  clearInterval(fetchingState.intervalId);
  let tries = Math.floor((60000 * 2) / MONITOR_INTERVAL); // 2 minutes max wait
  return new Promise((resolve, reject) => {
    fetchingState.intervalId = setInterval(async () => {
      if (tries <= 0) {
        clearInterval(fetchingState.intervalId);
        reject(new Error('timed out'));
      }
      tries -= 1;
      let res = null;
      try {
        res = await imageGenerator.monitorGeneration(jobId);
      } catch (err) {
        // ignore and keep trying
      }
      const { status, results } = res || {};
      if (!status) {
        progressManager.update(0);
      } else if (!status || status === MONITOR_STATUS.IN_PROGRESS) {
        progressManager.update(Math.floor(results.length / NUM_RESULTS) * 100);
      } else if (status === MONITOR_STATUS.COMPLETED) {
        progressManager.update(100);
        clearInterval(fetchingState.intervalId);
        setTimeout(() => {
          resolve(results);
        }, PROGRESS_ANIMATION_DURATION + PROGRESS_BAR_LINGER_DURATION);
      } else if (status === MONITOR_STATUS.FAILED) {
        clearInterval(fetchingState.intervalId);
        reject(new Error(JSON.stringify({ status })));
      } else {
        clearInterval(fetchingState.intervalId);
        reject(new Error(JSON.stringify({ status, results, reason: 'unexpected status' })));
      }
    }, MONITOR_INTERVAL);
  });
}

export function renderLoader(modalContent) {
  const loaderWrapper = createTag('div', {
    class: 'loader-wrapper',
    role: 'progressbar',
    'aria-valuemin': 0,
    'aria-valuemax': 100,
    'aria-valuenow': 0,
  });
  const textRow = createTag('div', { class: 'loader-text-row' });
  const text = createTag('span', { class: 'loader-text' });
  text.textContent = 'Loading results…'; // TODO: use placeholders
  const percentage = createTag('span', { class: 'loader-percentage' });
  percentage.textContent = '0%';
  textRow.append(text);
  textRow.append(percentage);
  loaderWrapper.append(textRow);

  const progressBar = createTag('div', { class: 'loader-progress-bar' });
  progressBar.append(createTag('div'));
  loaderWrapper.append(progressBar);

  const placeholderRow = createTag('div', { class: 'loader-placeholder-row' });
  for (let i = 0; i < NUM_RESULTS; i += 1) {
    placeholderRow.append(createTag('div', { class: 'loader-placeholder' }));
  }
  loaderWrapper.append(placeholderRow);

  modalContent.append(loaderWrapper);
}

function updateSearchable(modalContent, searchable) {
  const searchButton = modalContent.querySelector('.search-form .search-button');
  const searchBarInput = modalContent.querySelector('.search-form input.search-bar');

  if (!searchButton || !searchBarInput) return;
  if (searchable) {
    searchBarInput.disabled = false;
    searchBarInput.style.cursor = 'pointer';
    searchButton.classList.remove('disabled');
  } else {
    searchBarInput.disabled = true;
    searchBarInput.style.cursor = 'not-allowed';
    searchButton.classList.add('disabled');
  }
}

function createErrorDisplay() {
  const errorDisplay = createTag('h2', { class: 'error-display' });
  errorDisplay.textContent = 'Oops! Something could be momentarily wrong with our servers or the VPN connections.';
  errorDisplay.append(createTag('br'));
  errorDisplay.append('Please try again or come back later while we work on the fix. We appreciate your patience.');
  return errorDisplay;
}

function retry(maxRetries, fn, delay = 2000) {
  return fn().catch((err) => {
    if (maxRetries <= 0) {
      throw err;
    }
    return new Promise((resolve) => setTimeout(resolve, delay))
      .then(() => retry(maxRetries - 1, fn, delay));
  });
}

export async function fetchResults(modalContent) {
  const {
    query,
    fetchingState,
  } = fireflyState;
  const { searchPositionMap } = fetchingState;
  if (!fetchingState.progressManager) {
    const updateProgressBar = (percentage) => {
      const loaderWrapper = modalContent.querySelector('.loader-wrapper');
      const percentageEl = modalContent.querySelector('.loader-percentage');
      const progressBar = modalContent.querySelector('.loader-progress-bar div');
      if (!percentageEl || !progressBar || !loaderWrapper) return;
      percentageEl.textContent = `${percentage}%`;
      progressBar.style.width = `${percentage}%`;
      loaderWrapper.setAttribute('aria-valuenow', percentage);
    };
    fetchingState.progressManager = useProgressManager(
      updateProgressBar,
      PROGRESS_ANIMATION_DURATION,
      {
        avgCallingTimes: AVG_GENERATION_TIME / MONITOR_INTERVAL,
        sample: 2,
      },
    );
  }

  updateSearchable(modalContent, false);

  const oldLoader = modalContent.querySelector('.loader-wrapper');
  if (oldLoader) {
    fetchingState.progressManager.reset();
    oldLoader.style.display = 'flex';
  } else {
    renderLoader(modalContent);
  }
  const oldResults = modalContent.querySelector('.generated-results-wrapper');
  if (oldResults) {
    oldResults.remove();
  }
  const errorDisplay = modalContent.querySelector('.error-display');
  if (errorDisplay) {
    errorDisplay.remove();
  }

  // TODO: placeholders for locale and category
  const requestConfig = {
    query,
    num_results: NUM_RESULTS,
    locale: 'en-us',
    category: 'poster',
    force: searchPositionMap.has(query),
    start_index: searchPositionMap.get(query) || 0,
  };

  try {
    let jobId;
    await retry(REQUEST_GENERATION_RETRIES, async () => {
      const res = await imageGenerator.startJob(requestConfig.query, requestConfig.num_results);
      const { status, jobId: generatedJobId } = res;
      if (![MONITOR_STATUS.COMPLETED, MONITOR_STATUS.IN_PROGRESS].includes(status)) {
        throw new Error(`Error requesting generation: ${generatedJobId} ${status}`);
      }
      jobId = generatedJobId;
    }, 2500);
    // first 6-12% as the time for triggering generation
    fetchingState.progressManager.update(Math.floor(Math.random() * 6 + 6));
    fetchingState.results = await waitForGeneration(jobId);

    if (!searchPositionMap.has(query)) {
      searchPositionMap.set(query, NUM_RESULTS);
    } else {
      searchPositionMap.set(
        query,
        (searchPositionMap.get(query) + NUM_RESULTS) % (RESULTS_ROTATION * NUM_RESULTS),
      );
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    fetchingState.results = 'error';
  } finally {
    updateSearchable(modalContent, true);
  }
}

export function renderResults(modalContent) {
  const { fetchingState: { results } } = fireflyState;
  const oldLoader = modalContent.querySelector('.loader-wrapper');
  if (oldLoader) {
    oldLoader.style.display = 'none';
  }

  if (!results || results === 'error') {
    if (!modalContent.querySelector('.error-display')) {
      modalContent.append(createErrorDisplay());
    }
    return;
  }

  const generatedResultsWrapper = createTag('div', { class: 'generated-results-wrapper' });

  const generatedTitle = createTag('div', { class: 'generated-title' });
  generatedTitle.textContent = 'Here\'s results';
  const generatedRow = createTag('div', { class: 'generated-row' });
  results
    .map((result) => createTemplate(result))
    .forEach((image) => {
      generatedRow.append(image);
    });
  generatedResultsWrapper.append(generatedTitle);
  generatedResultsWrapper.append(generatedRow);
  modalContent.append(generatedResultsWrapper);
}

function createModalSearch(modalContent) {
  const aceState = fireflyState;
  const searchForm = createTag('form', { class: 'search-form' });
  const searchBar = createTag('input', {
    class: 'search-bar',
    type: 'text',
    placeholder: 'Describe what you want to generate...',
    enterKeyHint: 'Search',
  });
  // TODO demo just to quickly generate results while developing
  searchBar.value = 'A poster about a robot that sits on a tree';
  aceState.value = 'A poster about a robot that sits on a tree';
  searchForm.append(searchBar);

  const refreshText = 'Refresh results';
  const button = createTag('a', {
    href: '#',
    title: refreshText,
    class: 'con-button blue button-l', // TODO add disabled class initially
    target: '_blank',
  });
  button.textContent = refreshText;
  searchForm.append(button);
  button.addEventListener('click', async (e) => {
    e.preventDefault();
    if (!searchBar.value || button.classList.contains('disabled')) {
      return;
    }
    aceState.query = searchBar.value;
    await fetchResults(modalContent);
    renderResults(modalContent);
  });

  searchBar.addEventListener('input', () => {
    if (!searchBar.value) {
      button.classList.add('disabled');
    } else {
      button.classList.remove('disabled');
    }
  });

  searchBar.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      button.click();
    }
  });

  return searchForm;
}

function createTitleRow() {
  const titleRow = createTag('div', { class: 'modal-title-row' });
  const title = createTag('h1');
  titleRow.appendChild(title);
  title.textContent = 'Generate your image';
  return titleRow;
}

function createSubmittedTooltip() {
  const submittedTooltip = createTag('div', { class: 'submitted-tooltip' });
  const text = 'Thank you for the feedback. We strive to improve future results.'; // TODO: placeholders
  // TODO poc
  // const checkmarkIcon = getIconElement('checkmark-darkgreen');
  const tooltipWrapper = createTag('div', { class: 'tooltip-wrapper' });
  // submittedTooltip.append(checkmarkIcon);
  submittedTooltip.append(text);
  tooltipWrapper.append(submittedTooltip);
  const { feedbackState } = fireflyState;
  const tooltipTimeoutId = null;
  // feedbackState.showSubmittedTooltip = () => {
  //   tooltipWrapper.classList.add('show');
  //   if (tooltipTimeoutId) {
  //     clearTimeout(tooltipTimeoutId);
  //   }
  //   tooltipTimeoutId = setTimeout(() => {
  //     tooltipWrapper.classList.remove('show');
  //     tooltipTimeoutId = null;
  //   }, 3000);
  // };
  return tooltipWrapper;
}

export default function renderModalContent(block) {
  block.append(createTitleRow());
  block.append(createModalSearch(block));
  block.append(createSubmittedTooltip());
}
