import { importMapsPlugin } from '@web/dev-server-import-maps';
import { defaultReporter } from '@web/test-runner';
import { chromeLauncher } from '@web/test-runner-chrome';

const testRunnerHtml = (testFramework) =>
    `
    <html>
    <head>
      <link rel="icon" href="data:," size="any"/>
      <style>
          span {
              padding: 0px 2px;
          }
      </style>
      <script type='module'>
          window.adobeIMS = {
              initialized: true,
              isSignedInUser: () => false,
              getProfile: () => Promise.resolve({}),
          };
          window.lana = { log() {} };
          window.process = { env: {} };
      </script>
      <script type='module'>
        const oldFetch = window.fetch;
        window.fetch = async (resource, options) => {
          if (!resource.startsWith('/') && !resource.startsWith('http://localhost')) {
            console.error(
              '** fetch request for an external resource is disallowed in unit tests, please find a way to mock! https://github.com/orgs/adobecom/discussions/814#discussioncomment-6060759 provides guidance on how to fix the issue.',
              resource
            );
          }
          return oldFetch.call(window, resource, options);
        };

        const oldXHROpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = async function (...args) {
          let [method, url, asyn] = args;
          if (!resource.startsWith('/') && url.startsWith('http://localhost')) {
            console.error(
              '** XMLHttpRequest request for an external resource is disallowed in unit tests, please find a way to mock! https://github.com/orgs/adobecom/discussions/814#discussioncomment-6060759 provides guidance on how to fix the issue.',
              url
            );
          }
          return oldXHROpen.apply(this, args);
        };

        const observer = new MutationObserver((mutationsList, observer) => {
          for(let mutation of mutationsList) {
            if (mutation.type === 'childList') {
              for(let node of mutation.addedNodes) {
                if(node.nodeName === 'SCRIPT' && node.src && !node.src.startsWith('http://localhost')) {
                  console.error(
                    '** An external 3rd script has been added. This is disallowed in unit tests, please find a way to mock! https://github.com/orgs/adobecom/discussions/814#discussioncomment-6060891 provides guidance on how to fix the issue.',
                    node.src
                  );
                }
              }
            }
          }
        });
        observer.observe(document.head, { childList: true });
      </script>
    </head>
    <body>
      <script type='module' src='${testFramework}'></script>
    </body>
  </html>
    `;

function customReporter() {
    return {
        async reportTestFileResults({ logger, sessionsForTestFile }) {
            sessionsForTestFile.forEach((session) => {
                session.testResults.tests.forEach((test) => {
                    if (!test.passed && !test.skipped) {
                        logger.log(test);
                    }
                });
            });
        },
    };
}

/** @type {import('@web/test-runner').TestRunnerConfig} */
export default {
    browsers: [
        chromeLauncher({
            launchOptions: { args: ['--no-sandbox'] },
        }),
    ],
    coverageConfig: {
        include: ['src/**'],
        exclude: ['test/mocks/**', 'test/**', '**/node_modules/**'],
        threshold: {
            branches: 100,
            functions: 100,
            statements: 100,
            lines: 100,
        },
    },
    debug: false,
    files: ['test/**/*.test.(js|html)'],
    middleware: [
        async (ctx, next) => {
            await next();
            ctx.set('Cache-Control', 'public, max-age=604800, immutable');
            ctx.set('Access-Control-Allow-Credentials', true);
            ctx.set('Access-Control-Allow-Origin', ctx.request.headers.origin);
        },
    ],
    nodeResolve: true,
    plugins: [
        importMapsPlugin({
            inject: {
                importMap: {
                    imports: {
                        react: '/test/mocks/react.js',
                        '@pandora/fetch': '/test/mocks/pandora-fetch.js',
                    },
                },
            },
        }),
    ],
    port: 2023,
    reporters: [
        defaultReporter({ reportTestResults: true, reportTestProgress: true }),
        customReporter(),
    ],
    testRunnerHtml,
};
