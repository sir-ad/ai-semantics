import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/index.ts'],
    format: ['cjs', 'esm', 'iife'],
    dts: true,
    clean: true,
    globalName: 'GrainWeb',
    external: ['grain'],
    minify: true,
    sourcemap: true,
});
