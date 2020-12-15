import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import multiInput from 'rollup-plugin-multi-input';

export default {
  input: ['src/rules/*.ts'],
  output: {
    dir: 'rules',
    format: 'cjs',
    banner: `
/** Copyright 2020-present, Pinterest, Inc.
 *
 * @${'generated'} with rollup
 *
 * This source code is licensed under the Apache License, Version 2.0
 * found in the LICENSE file in the root directory of this source tree.
 */
`,
  },
  plugins: [multiInput({ relative: 'src/rules' }), typescript(), nodeResolve(), commonjs()],
};
