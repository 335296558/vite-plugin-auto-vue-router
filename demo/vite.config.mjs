import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import { fileURLToPath, URL } from "url";
import AutoVueRouter from 'vite-plugin-auto-vue-router';
// import AutoVueRouter from '../dist/index';

// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        alias: [{
            find: '@', replacement: fileURLToPath(new URL('/src', import.meta.url))
        }]
    },
    plugins: [
        vue(),
        AutoVueRouter({
            /* 
            dir、glob 只能2选1，如果2个都在设置那么glob优先，
            并不推荐直接在调用插件时配置glob！
            但依然保留了glob参数可通过调用时配置。
            指定目录生成路由的推荐通过dir参数配置path
            要指定过滤的目录推荐用ignore 参数去配置
            */
            dir: fileURLToPath(new URL('/src/pages/', import.meta.url)),
            // glob: [fileURLToPath(new URL('/src/pages/**/*.vue', import.meta.url)), '!**/components','!**/max'],
            // ignore: ['!**/components','!**/max'] 配置的最终会合并到glob中，但不会重复
        }),
    ],
});