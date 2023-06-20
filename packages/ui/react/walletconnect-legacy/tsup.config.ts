import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  target: 'es2021',
  splitting: false,
  minify:true,
  treeshake:true,
  clean: true,
  dts: true,
  external:['react', 'react-dom']
})