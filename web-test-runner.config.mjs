import { importMapsPlugin } from '@web/dev-server-import-maps';

export default {
  coverageConfig: {
    exclude: [
      '**/mocks/**',
      '**/node_modules/**',
      '**/test/**',
      // TODO: folders below need to have tests written for 100% coverage
      '**/ui/controls/**',
      '**/libs/blocks/faas/**',
      '**/libs/blocks/faas-config/**',
    ],
  },
  plugins: [importMapsPlugin({})],
};
