import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss';
import postcssPresetEnv from 'postcss-preset-env'
import autoprefixer from 'autoprefixer'

const extensions = ['.js', '.jsx', '.ts', '.tsx'];
const globals = {
  react: 'React',
  'react-dom': 'ReactDOM',
};

export default {
  input: ['./src/index.ts'],
  output: [
    {
      file: './dist/index.esm.js',
      format: 'esm',
      globals,
    },
    {
      file: './dist/index.cjs.cjs',
      format: 'cjs',
      globals,
    },
  ],
  plugins: [
    peerDepsExternal(),
    nodeResolve({extensions, browser: true}),
    commonjs(),
    typescript(),
    // we'll need some extra configuration for this one later
    postcss({
        plugins: [
          postcssPresetEnv(),
          autoprefixer(),
        ],
        autoModules: false,
        onlyModules: false,
        modules: {
          generateScopedName: (name, filename, css) => {
            if (filename.includes('global')) {
              return name;
            }
            const hash = stringHash(css).toString(36).substring(0, 5);
            return `test_${name}_${hash}`;
          },
        },
        extract: 'css/test-library.min.css',
        extensions: ['.scss'],
        use: ['sass'],
        minimize: true,
        sourceMap: false,
      }),
  ],
};