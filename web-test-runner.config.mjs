import { importMapsPlugin } from '@web/dev-server-import-maps';

export default {
  coverageConfig: {
    exclude: [
      '**/mocks/**',
      '**/node_modules/**',
      '**/test/**',
      '**/deps/**',
      // TODO: folders below need to have tests written for 100% coverage
      '**/ui/controls/**',
      '**/blocks/library-config/**',
      '**/hooks/**',
    ],
  },
  plugins: [importMapsPlugin({})],
};
