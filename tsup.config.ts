import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/ts/index.ts',
    dataset: 'src/ts/dataset.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  sourcemap: true,
  treeshake: true,
  splitting: false,
});
