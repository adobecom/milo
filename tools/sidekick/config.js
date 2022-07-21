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

function hasSchema(host) {
  if (window.location.hostname === host) {
    const schema = document.querySelector('script[type="application/ld+json"]');
    return schema !== null;
  }
  return false;
}

// This file contains the project-specific configuration for the sidekick.
(() => {
  window.hlx.initSidekick({
    project: 'Milo',
    host: 'milo.adobe.com',
    byocdn: true,
    hlx3: true,
    libraries: [
      {
        text: 'Blocks',
        path: '/docs/library/blocks.json',
      },
      {
        text: 'Templates',
        path: '/docs/library/templates.json',
      },
      {
        text: 'Placeholders',
        path: '/docs/library/placeholders.json',
      },
      {
        text: 'Tokens',
        path: '/docs/library/tokens.json',
      },
    ],
    plugins: [
      // TOOLS ---------------------------------------------------------------------
      {
        id: 'library',
        condition: () => true,
        button: {
          text: 'Library',
          action: (_, s) => {
            const { config } = s;
            const script = document.createElement('script');
            script.onload = () => {
              const skEvent = new CustomEvent(
                'hlx:library-loaded',
                { detail: { domain: `https://${config.innerHost}`, libraries: config.libraries } },
              );
              document.dispatchEvent(skEvent);
            };
            script.src = `https://${config.innerHost}/libs/ui/library/library.js`;
            document.head.appendChild(script);
          },
        },
      },
      {
        id: 'tools',
        condition: (s) => s.isEditor(),
        button: {
          text: 'Tools',
          action: (_, s) => {
            const { config } = s;
            window.open(`https://${config.innerHost}/tools/`, 'milo-tools');
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
      {
        id: 'seo',
        condition: (s) => hasSchema(s.config.host),
        button: {
          text: 'Check Schema',
          action: () => {
            window.open(`https://search.google.com/test/rich-results?url=${encodeURIComponent(window.location.href)}`, 'check-schema');
          },
        },
      },
    ],
  });
})();
