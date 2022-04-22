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

// This file contains the project-specific configuration for the sidekick.
(() => {
  window.hlx.initSidekick({
    project: 'Milo',
    outerHost: 'main--milo--adobecom.hlx.live',
    previewHost: 'main--milo--adobecom.hlx.page',
    hlx3: true,
    plugins: [
      // TOOLS ---------------------------------------------------------------------
      {
        id: 'tools',
        condition: (s) => s.isEditor(),
        button: {
          text: 'Tools',
          action: (_, s) => {
            const { config } = s;
            window.open(`https://${config.previewHost}/tools/`, 'milo-tools');
          },
        },
      },
      {
        id: 'translate',
        condition: (s) => s.isEditor() && s.location.href.includes('/:x'),
        button: {
          text: 'Translate',
          action: (_, sk) => {
            const { config } = sk;
            window.open(`${config.pluginHost ? config.pluginHost : `http://${config.innerHost}`}/tools/translation/index.html?sp=${encodeURIComponent(window.location.href)}&owner=${config.owner}&repo=${config.repo}&ref=${config.ref}`, 'hlx-sidekick-spark-translation');
          },
        },
      },
    ],
  });
})();
