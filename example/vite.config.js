import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vitePluginAutoVueRouter from 'vite-plugin-auto-vue-router/dist/globEager'
// import vitePluginVueLayouts from '../../vite-plugin-vue3-layouts/dist/index.js'
import vitePluginVueLayouts from 'vite-plugin-vue3-layouts'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        vitePluginAutoVueRouter(),
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
	}
});