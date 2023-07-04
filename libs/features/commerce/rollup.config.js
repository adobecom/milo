/* eslint-disable import/no-extraneous-dependencies */
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import node from '@rollup/plugin-node-resolve';
import { visualizer } from 'rollup-plugin-visualizer';

export default {
  external: ['react'],
  input: 'index.js',
  output: {
    file: '../../deps/tacocat.js',
    format: 'esm',
  },
  plugins: [
    commonjs(),
    json(),
    node({
      browser: true,
      ignoreSideEffectsForRoot: true,
    }),
    visualizer(),
  ],
  treeshake: { preset: 'smallest' },
};
