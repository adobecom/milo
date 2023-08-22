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

function randIncrement(mean, sample) {
  let inc = 0;
  // central limit theorem
  for (let i = 0; i < sample; i += 1) {
    inc += Math.random() * (mean / sample);
  }
  return Math.round(inc);
}

export default function useProgressManager(
  updateUI = () => {},
  duration = 1000,
  { avgCallingTimes = 15, sample = 5 } = {},
) {
  let playingPercentage = 0;
  let curr = 0;
  let intervalId = null;
  const moveOne = () => {
    if (playingPercentage >= curr) {
      clearInterval(intervalId);
    } else {
      playingPercentage += 1;
      updateUI(playingPercentage);
      if (playingPercentage >= 100) {
        clearInterval(intervalId);
      }
    }
  };
  const update = (newPercentage) => {
    if (curr < newPercentage) {
      curr = newPercentage;
    } else {
      // fake some progress
      const fakeIncrement = randIncrement(100 / avgCallingTimes, sample);

      // always save the last 3%
      if (curr + fakeIncrement <= 97) {
        curr += fakeIncrement;
      }
    }

    clearInterval(intervalId);
    if (curr > playingPercentage) {
      intervalId = setInterval(moveOne, duration / (curr - playingPercentage));
    }
  };
  const reset = () => {
    playingPercentage = 0;
    curr = 0;
    clearInterval(intervalId);
    updateUI(0);
  };
  return { update, reset };
}
