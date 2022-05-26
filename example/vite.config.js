import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vitePluginAutoVueRouter from '../dist/index.fg.js'
import vitePluginVueLayouts from '../../vite-plugin-vue-layouts/dist/index.js'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        vitePluginAutoVueRouter(),
        vitePluginVueLayouts({
            plugins:[
                'auto-vue-router'
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