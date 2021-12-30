import resolve from '@rollup/plugin-node-resolve';
import pkg from './package.json';
import babel from '@rollup/plugin-babel';
const extensions = ['.js', '.ts'];
export default [
  // CommonJS (for Node) and ES module (for bundlers) build.
  {
    input: 'src/index.ts',
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: pkg.module,
        format: 'es',
        sourcemap: true,
      },
    ],
    plugins: [
      resolve({
        extensions,
      }),
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**',
        extensions,
      }),
    ],
  },
];
