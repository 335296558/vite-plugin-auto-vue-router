import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// import vitePluginAutoVueRouter from 'vite-plugin-auto-vue-router/dist/globEager'
// import vitePluginAutoVueRouter from '../src/index.js';
import vitePluginAutoVueRouter from '../src/globEager.js';
// import vitePluginVueLayouts from '../../vite-plugin-vue3-layouts/dist/index.js'
import vitePluginVueLayouts from 'vite-plugin-vue3-layouts'
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        vitePluginAutoVueRouter({}),
        vitePluginVueLayouts({
            plugins:[
                'auto-vue-router',
            ]
        })
    ],
    resolve: {
		alias: [
			{
				find: '@',
				replacement: `${process.cwd()}/src`,
			},
		],
	},
    server: {
        watch: {
            ignored: ['!**/node_modules/vite-plugin-auto-vue-router/**']
        }
    },
    // 被监听的包必须被排除在优化之外，
    // 以便它能出现在依赖关系图中并触发热更新。
    optimizeDeps: {
        exclude: ['vite-plugin-auto-vue-router']
    }
});