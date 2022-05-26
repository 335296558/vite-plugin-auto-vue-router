'use strict';
/**
 * @desc 自动生成vue-router路由，解放双手手动配置
 * @author 凡尘
 * @date 2022/03
 * @author 335296558@qq.com
 * @name vite-plugin-auto-vue-router || vitePluginAutoVueRouter
 */

import fs from 'fs';
import { join } from 'path';
import { sync as fg } from 'fast-glob'
import { getMixName, getRouteData } from './utils.js';
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
        LoadComponentMode: 'default',
        // 是否要骨架屏, 还没实现哦！
        isSkeleton: true,
        // 指定错误页面，文件名，如：404, 404.vue
        errorPage: '404',
        errorPageMatch: '/:pathMatch(.*)*',
        // 指定首页
        homePage: 'index'
	}, opt)

    // ------layouts---------
    // const layoutsViewPath = `${opt.src}/${opt.layoutDirectoryName}/`
    // const layoutFiles = fg(`${layoutsViewPath}/**/*.vue`, {
    //     ignore: opt.ignore,
    //     onlyFiles: true,
    // })

    // layoutFiles.map(filePath=>{
    //     const item = getRouteData(filePath, layoutsViewPath)
    //     console.log(item, 'item-layouts')
    // })
    // const PageSkeletonImport = `\n
    //     \nimport PageSkeleton from 'vite-plugin-auto-vue-router/dist/PageSkeleton.vue'
    //     \nimport LayoutSkeleton from 'vite-plugin-auto-vue-router/dist/LayoutSkeleton.vue'
    // `;
    console.log('PageSkeleton', `${process.cwd()}`)
    // ------页面--------
    const viewPath = `${opt.src}/${opt.viewFolderName}/`;
    const files = fg(`${viewPath}**/*.vue`, {
        ignore: opt.ignore,
        onlyFiles: true,
    })
    let router = ``;
    let importComponents=``;
    function isHome(pagePath) {
        if (pagePath=='/'+opt.homePage) return true
        return false
    }

    function isError(pagePath) {
        if (pagePath=='/'+opt.errorPage) return true
        return false
    }
    
    let pageTestName = ''
    // LoadComponentMode=default 才会生效
    function otherRouteParam(component,name) {
    return `    beforeEnter:${component}.beforeEnter,
    redirect: ${component}.redirect,
    aliasOf: ${component}.aliasOf,
    meta: ${component}.meta || {},
    layout: ${component}.layout,
    path: '${name}'`
    }

    function defaultRouterF(component, name) {
        return `{\n    component: ${component}, \n${otherRouteParam(component, name)},
        \n},`
    }

    function resolveComponentF(component, name) {
        return `{ \n    path: '${name}', \n    component: ()=> import('${component}'), \n},`
    }

    function defineAsyncComponentF(component, name) {
        return `\n{
            \n  path: '${name}',
            \n  component: ()=> defineAsyncComponent({
                \n      loader: ()=> import('${component}'),
                \n      // loadingComponent: PageSkeleton
            \n  })
        \n},`
    }

    files.map(filePath=>{
        const item = getRouteData(filePath, viewPath)
        pageTestName = item.varName
        switch (opt.LoadComponentMode) {
            case 'default':
                if (isHome(item.path)) {
                    router+= defaultRouterF(item.varName, '/')
                }
                importComponents+= `\n${item.importString}`
                if (isError(item.path)) { // 404
                    router+= defaultRouterF(item.varName, opt.errorPageMatch)
                } else {
                    router+= defaultRouterF(item.varName, item.path)
                }
                break;
            case 'resolveComponent':
                if (isHome(item.path)) {
                    router+= resolveComponentF(filePath, '/')
                }
                if (isError(item.path)) { // 404
                    router+= resolveComponentF(filePath, opt.errorPageMatch)
                } else{
                    router+= resolveComponentF(filePath, item.path)
                }
                break;
            case 'defineAsyncComponent':
                if (isHome(item.path)) {
                    router+= defineAsyncComponentF(filePath, '/')
                }
                if (isError(item.path)) { // 404
                    router+= defineAsyncComponentF(filePath, opt.errorPageMatch)
                } else {
                    router+= defineAsyncComponentF(filePath, item.path)
                }
                break;
        }
    })
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
                \nimport { defineAsyncComponent } from 'vue'
                \nimport { createRouter, createWebHashHistory } from 'vue-router'
                \n${importComponents}
                \nconst routers = [${router}]
                \nexport const $router = createRouter({
                    \n  history: createWebHashHistory(),
                    \n  routes: routers
                \n})
                \nexport default $router
                `;
            }
        }
    }
}
