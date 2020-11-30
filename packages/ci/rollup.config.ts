import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import typescript from 'rollup-plugin-typescript2'
import license from 'rollup-plugin-license'
import json from 'rollup-plugin-json'
import process from 'child_process'
import path from 'path'
import builtins from 'builtin-modules'
import alias from '@rollup/plugin-alias'
import eslint from '@rollup/plugin-eslint'
import { version, name } from './package.json'

const commitHash = process.execSync('git rev-parse --short HEAD', { encoding: 'utf-8' }).trim()
console.log('eslintrc path', path.resolve(__dirname, '..', '..', '.eslintrc.js'))
const plugins = [
  // alias({
  //   entries: [
  //     {
  //       find: /^@\/(.*)$/,
  //       replacement: path.resolve(__dirname, 'src', '$1'),
  //     },
  //   ],
  // }),
  eslint({}),
  typescript(),
  json(),
  resolve(),
  commonjs(),
]

const bundleConfig = {
  input: path.resolve(__dirname, 'src/index.ts'),
  output: {
    format: 'cjs',
    name,
    sourcemap: true,
    extend: true,
    banner: `#!/usr/bin/env node\n/*! ${name} ${version} (${commitHash}) */`,
  },
  external: [
    ...builtins,
    'commander',
    'inquirer',
    'chalk',
    'shelljs',
    'terminal-link',
    'ora',
    'miniprogram-ci',
    'execa',
  ],
  plugins: [
    ...plugins,
    license({
      sourcemap: true,
    }),
  ],
}

export default {
  ...bundleConfig,
  output: {
    ...bundleConfig.output,
    file: 'bin/index.js',
  },
}
