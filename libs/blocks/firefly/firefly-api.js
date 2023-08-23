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
/* eslint-disable camelcase */

// import { mockId, mockData } from './mocks.js';

// const useMock = false;

// TODO remove the module in favour of nethraa's
import ImageGenerator from './nethraa/fireflyApi.js';

const imageGenerator = new ImageGenerator();

AbortSignal.timeout ??= function timeout(ms) {
  const ctrl = new AbortController();
  setTimeout(() => ctrl.abort(), ms);
  return ctrl.signal;
};

export const requestGeneration = ({
  num_results = 4,
  query,
}) => imageGenerator.startJob(query, num_results);

export const monitorGeneration = (jobId) => imageGenerator.monitorGeneration(jobId);

export const MONITOR_STATUS = Object.freeze({
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'DONE',
  FAILED: 'CANCELED',
});
