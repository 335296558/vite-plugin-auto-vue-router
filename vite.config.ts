import { defineConfig } from 'vite';
import path from 'path';
// @ts-ignore
import copy from 'rollup-plugin-copy';
import vue from '@vitejs/plugin-vue';

const __dirname = path.resolve();

export default defineConfig({
    plugins: [
        vue(),
    ],
    build: {
        lib: {
            entry: {
                index: path.resolve(__dirname, 'src/index.ts'),
            },
            name: 'vitePluginAutoVueRouter',
            formats:['es']
        },
        rollupOptions: {
            external: ['vue', 'vue-router', 'url', 'fs', 'path', 'fast-glob'],
            plugins: [
                copy({
                    targets: [
                        { src: './src/types.d.ts', dest: 'dist/' }
                    ],
                    // 因为打包后dist目录会被先清空，所以要加hook: 'writeBundle'
                    hook: 'writeBundle' 
                })
            ]
        },
    }
})