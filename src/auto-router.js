// 一次性加载所有页面的自动路由方案，主要采用import.meta.globEager for 实现

import { createRouter, createWebHashHistory } from 'vue-router'
// const modules = import.meta.glob('./src/pages/**/*.vue')

// *[^src] 意思是：匹配所有，但不包括有src字符的

const modules = import.meta.globEager('./src/pages/**/*.vue')
export const getMixName = ()=> {
    let str = '';
    for(let i =0;i<6;i++){
        str += String.fromCharCode(Math.floor(Math.random()*26+65))
    }
    return str
}

const getRouteData = (filePath, viewPath='./src/pages/')=> {
    // /aaa/bbb.vue
    const NewPath = filePath.replace(new RegExp(viewPath, 'g'), '/')
    // /aaa/bbb
    const PagePath = NewPath.replace(/.vue/, '')
    // [aaa,bbb]
    const PagePathArray = PagePath.split('/')
    // bbb
    const PathLastStr = PagePathArray[PagePathArray.length-1]
    // 取 带_后面的字符为参数，_b, b:'xxx'
    let match,name=PagePath;
    let RoutePath = PagePath
    const RoutePathFirst = PagePath.replace(new RegExp(PathLastStr),'') // 清除 最后节名称
    if (PathLastStr.indexOf('_')>=0) {
        name = RoutePathFirst.substring(1).replace(/\//g, '-')
        const param = PathLastStr.replace(/_/, '') // 文件以_开头的，取后面字符串当参数名
        if (!param) {
            match = `:query+`
            name = name+'all'
        } else {
            match = `:${param}`
            name = name+param
        }
        RoutePath = `${RoutePathFirst}${match}`
    }
    const varName = getMixName()+Date.now()
    let item = {
        filePath,
        path: RoutePath,
        match,
        name,
        varName,
        importStringFun: `()=>import('${filePath}')`,
        importString: `import ${varName? varName : `* as `} from '${filePath}'`
    }
    return item
}


function otherRouteParam(component,name) {
    return {
        beforeEnter: component.beforeEnter,
        redirect: component.redirect,
        aliasOf: component.aliasOf,
        meta: component.meta || {},
        layout: component.layout,
        path: name
    }
}

function defaultRouterF(component, name) {
    return { component, ...otherRouteParam(component, name) }
}

function isHome(pagePath) {
    if (pagePath=='/'+opt.homePage) return true
    return false
}

function isError(pagePath) {
    if (pagePath=='/'+opt.errorPage) return true
    return false
}

let routers = []
for (const path in modules) {
    const frontPath = new RegExp("./src/pages", 'g');
    const newPath = path.replace(frontPath, '')
    const rex = new RegExp("/src/", 'g');
    if (!rex.test(newPath)) {
        const item = getRouteData(path)
        if (isHome(item.path)) {
            const com = defaultRouterF(modules[path].default, '/')
            routers.push(defaultRouterF(modules[path].default, '/index'))
            routers.push(com)
        }else if (isError(item.path)) { // 404
            routers.push(defaultRouterF(modules[path].default, opt.errorPageMatch))
        } else {
            routers.push(defaultRouterF(modules[path].default, item.path))
        }
    }
}
// routers.push(defaultRouterF(modules[path].default, opt.errorPageMatch))

export const $router = createRouter({
    history: createWebHashHistory(),
    routes: routers
})

export default $router