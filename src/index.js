'use strict';
/**
 * @desc 自动生成vue-router路由，解放双手动配置
 * @author 凡尘
 * @date 2022/03
 * @author 335296558@qq.com
 * @name vite-plugin-auto-vue-router || vitePluginAutoVueRouter
 */

import fs from 'fs';
import { join } from 'path';
const AutoRouterCode = fs.readFileSync(`${__dirname}/auto-router.js`, 'utf8');
export default function vitePluginAutoVueRouter(opt={}) {
	const ModuleId = 'auto-vue-router'
    const resolvedModuleId = '\0' + ModuleId
	opt = Object.assign({
        // 指定目录下的.vue生成路由
		viewFolderName: 'pages',
        // 过滤的那些目录的.vue不要生成路由
		ignore: [join(`**/src`)], 
		src: `${process.cwd()}/src`,
        // 生成路由功能模式，
        // default=一次性加载全部、
        // resolveComponent=异步加载、
        // defineAsyncComponent=https://v3.cn.vuejs.org/api/global-api.html#defineasynccomponent、
        LoadComponentMode: 'resolveComponent',
        // 是否要骨架屏, 还没实现哦！
        isSkeleton: true,
        // 指定错误页面，文件名，如：404, 404.vue
        errorPage: '404',
        errorPageMatch: '/:pathMatch(.*)*',
        // 指定首页
        homePage: 'index'
	}, opt)

	return {
        name: 'vite-plugin-auto-vue-router',
        // transformIndexHtml(html) {
        //     return `${html}\n`
        // },
        resolveId(id) {
            if (id === ModuleId) {
                return resolvedModuleId
            }
        },
        async load(id, code) {
            if (id === resolvedModuleId) {
                return `'use strict';
                \nconst opt = ${JSON.stringify(opt)}
                \n${AutoRouterCode}
                `;
            }
        }
    }
}
