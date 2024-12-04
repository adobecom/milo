import { importMapsPlugin } from '@web/dev-server-import-maps';
import { defaultReporter } from '@web/test-runner';
import { chromeLauncher } from '@web/test-runner-chrome';

export default {
    browsers: [
        chromeLauncher({
            launchOptions: { args: ['--no-sandbox'] },
        }),
    ],
    coverageConfig: {
        include: ['src/**'],
        exclude: [
            'test/mocks/**',
            'test/**',
            '**/node_modules/**',
            'src/merch-twp-d2p.js', // on hold
            'src/aem.js', // WIP
            'src/bodyScrollLock.js', // todo
            'src/merch-subscription-panel.js', // on hold
            'src/ merch-whats-included.js', // on hold
        ],
        threshold: {
            // TODO bump to 100%
            branches: 85,
            functions: 65,
            statements: 85,
            lines: 85,
        },
    },
    debug: false,
    files: ['test/**/*.test.(js|html)'],
    nodeResolve: true,
    mimeTypes: {
        '**/*.snap': 'html',
    },
    testFramework: {
        config: {
            timeout: 10000, // timeout in milliseconds
        },
    },
    plugins: [
        importMapsPlugin({
            inject: {
                importMap: {
                    imports: {
                        '@adobe/react-spectrum': '/dist/rsv3.js',
                        react: '/dist/rsv3.js',
                        'react-dom': '/dist/rsv3.js',
                        'react-dom/client': '/dist/rsv3.js',
                    },
                },
            },
        }),
    ],
    port: 2023,
    reporters: [
        defaultReporter({ reportTestResults: true, reportTestProgress: true }),
    ],
};
