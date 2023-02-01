/*
 * Copyright 2022 Adobe. All rights reserved.
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

function extractWallParameters(block) {
  const parameterContainers = Array.from(block.children);
  const parameters = {
    src: 'https://walls.io/js/wallsio-widget-1.2.js',
    async: true,
    'data-width': '100%',
    'data-autoheight': 1,
    'data-lazyload': 1,
  };

  parameterContainers.forEach((parameterContainer) => {
    const key = parameterContainer.children[0].textContent?.toLowerCase();
    const val = parameterContainer.children[1].textContent;

    if (!key || !val) return;

    switch (key) {
      case 'url':
        try {
          const url = new URL(val);
          const { host } = url;
          const wallsioHost = 'my.walls.io';
          parameters['data-wallurl'] = host === wallsioHost ? url : null;
        } catch (err) {
          console.error('Invalid URL');
        }
        break;
      case 'height':
        parameters['data-height'] = val.replace('px', '');
        break;
      case 'title':
        parameters['data-title'] = val;
        break;
      case 'load more':
        parameters['data-injectloadmorebutton'] = 1;
        parameters['data-loadmorecount'] = parseInt(val, 10);
        break;
      default:
        break;
    }
  });
  return parameters;
}

export default function init(block) {
  const parameters = extractWallParameters(block);

  block.innerHTML = '';

  if (parameters['data-wallurl']) {
    const script = createTag('script', parameters, null);
    block.appendChild(script);
  } else {
    block.innerHTML = 'The Walls.io block requires a valid Walls.io URL to function.';
  }
}
