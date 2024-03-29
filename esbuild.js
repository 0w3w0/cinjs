import {build} from 'esbuild'

build({
  entryPoints: ['src/index.ts'],
  outdir: 'dist',
  bundle: true,
  minify: true,
  splitting: true,
  format: 'esm',
  target: ['esnext'],
}).catch(() => process.exit(1));