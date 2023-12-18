import { ref } from 'vue';
import { createPinia, defineStore } from 'pinia';
import { createRouter, createMemoryHistory, createWebHistory } from 'vue-router';
//可写自定义转换插件方案 https://cn.vitejs.dev/guide/migration-from-v1.html#custom-blocks-transforms
const pinia = createPinia();

// ! /*#xxx*/ 这种备注一定要注意、注意、注意，它背并不是注释这么简单
// ! /*#xxx*/ 这种备注一定要注意、注意、注意，它背并不是注释这么简单
// ! /*#xxx*/ 这种备注一定要注意、注意、注意，它背并不是注释这么简单

/**
 * 
 * @param {*} comp 
 * @param {*} route 
 * @param {*} isEager 是否是同步加载
 */
function getRouteItem(comp, route, isEager = true) {
    const routeItem = {
        beforeEnter: null,
        redirect: null,
        aliasOf: null,
        path: null,
        name: null,
        props: false,
        ...route,
        component: comp
    }
    return routeItem;
}

function getRouteName(pathStr) { // pathStr = /xxx/xxx.vue
    const regex = /[^\/]+\/pages\/(.*)/;
    const match = pathStr.match(regex); 
    const pathWithSuffix = match ? match[1] : ''; // 这里的 match[1] 表示获取第一个捕获组的内容
    let RoutePath = pathWithSuffix?.replace(/.vue/, ''); // xxx/xxx
    const pathArrs = RoutePath.split('/');                  // ['xxx', 'xxx']
    const PathLastName = pathArrs[pathArrs.length-1];        // 取最后一个文件名
    let RouteName = RoutePath?.replace(/\//g, '-');       // xxx-xxx
    const aliasPath = pathArrs[pathArrs.length - 2];
    const queryRegex = /^\[(\w+)(,\s*\w+)*\]$/;
     /** 
     * 匹配多个path为参数
     * 文件命名规则必需遵守
     * _.vue = /:query+ 匹配: /one, /one/two, /one/two/three, 等...
     * user/_.vue = user/:query+ 匹配: user/one, user/one/two, user/one/two/three, 等...
     * 不过种建议在单文件目录下定义，例如：
     *  user
     *      detail
     *          _.vue , 
     *  而不是
     *  user
     *      _.vue
     *      [id].vue
     * 因为_.vue会匹配掉user/之后的一切
     */
    if (PathLastName==='_') {
        RoutePath = RoutePath.replace(new RegExp(PathLastName),'') // 例如：user/_ , 清除path最后一节的 _  = user/
        RouteName = RouteName.replace(new RegExp(PathLastName),'') // 例如：user-_ , 清除path最后一节的 _  = user-
        RouteName = RouteName.replace(/-/,'') // 例如：user- , 清除-  = user
        RoutePath = RoutePath +':query+'; // 结果示例： setting/:query+
    } else if (queryRegex.test(PathLastName)) {
        /**
         * 匹配单个、多个指定参数名称, 这种场景应该很少用到
         * 文件命名规则必需遵守, 虽然支持空格定义，但建议不要加空格
         * [id] = /:id
         * [id, uid, ...] = /:id/:uid/ 以此类推
         */
        const QueryRule = new RegExp(/[/[].+?]/, 'g');
        const queryNameString = PathLastName.replace(/[\[\]]/g, ''); // 使用正则表达式替换掉 '[xxx,xxx]' 结果等于：xxx,xxx
        const queryNames = queryNameString.split(','); // 结果等于：[xxx, xxx]
        RoutePath = RoutePath.replace(QueryRule,''); // 例如：user/[id] 结果等于：user/
        RouteName = RouteName.replace(QueryRule,''); // 例如：user-[id] 结果等于：user-
        RouteName = RouteName.replace(/-/,'') // 例如：user- , 清除-  = user
        let pathQ = '/:'+queryNames.join('/:'); // 结果等于：/:xxx/:xxx, 如果存在空格/:xxx/: xxx
        pathQ = pathQ.replace(/\s+/g, ''); // 清除空格
        RoutePath = RoutePath+pathQ;
    }

    RoutePath = '/'+ RoutePath;
    return {
        RoutePath,
        RouteName
    }
}

export const useRouteState = defineStore('RouteState', ()=> {
    const RouteState = ref();
    const RouteStateData = sessionStorage.getItem("RouteState") || '';

    try {
        RouteState.value = JSON.parse(RouteStateData);
    } catch (error) {
        RouteState.value = {}
    }

    function increment(path, query = {}) {
        // @ts-ignore
        RouteState.value[path] = query;
        sessionStorage.setItem("RouteState", JSON.stringify(RouteState.value));
    }

    return {
        RouteState,
        increment
    }
});

export default {
    install(app, options) {
        if (!app || !app.use) {
            return console.error('Vue App.use error')
        }
        
        options = Object.assign({
            history: null,
            index: '/index', // 默认首页
            RouteBefore:{  // 'path': { ...route }
                /* path: 'login' 
                '/login':{
                    beforeEnter:()=>{
                        console.log(989889);
                    }
                }
                */ 
            }
        }, options);
        
        app.use(pinia);
        let routerArray = [];
        /*#vite-plugin-auto-vue-router-options*/
        const modules = import.meta.glob(/*#vite-plugin-auto-vue-router-path*/ /*#vite-plugin-auto-vue-router-glob-rules*/);
        if (!configs.eager) { // 动态导入的逻辑, conpoment: ()=> import('xxx/xxx.vue')
            for (let k in modules) {
                const comp = modules[k];
                console.log(comp, 'comp.customOptions')
                const { RouteName, RoutePath } = getRouteName(k);
                const itemComp = getRouteItem(comp, { path: RoutePath, name: RouteName }, false);
                const RouteObjs = options.RouteBefore[RoutePath||RouteName] || {};
                Object.assign(itemComp,{ ...RouteObjs });
                routerArray.push(itemComp);
            }
        } else {
            for (let k in modules) {
                const comp = modules[k].default;
                const { RouteName, RoutePath } = getRouteName(k);
                const route = Object.assign({
                    props: false,
                    name: RouteName,
                    path: RoutePath,
                    meta: {
                        layout: comp['__route_layout'] || 'default',
                    },
                }, comp.customOptions?.route);
                const itemComp = getRouteItem(comp, route);
                routerArray.push(itemComp);
                switch (route.path) {
                    case options.index:
                        routerArray.push({
                            ...itemComp,
                            path:'/',
                            name: '/'
                        });
                        break;
                }
            }
        }
        
        const RouterAPP = createRouter({
            history: options.history || import.meta.env.SSR? createMemoryHistory(): createWebHistory(),
            routes: routerArray
        });
        
        const RouteStater = useRouteState();
        RouterAPP.page = (to)=> {
            const pathStr = to.path || to.name;
            RouteStater.increment(pathStr, to.hiddenParams);
            return RouterAPP.push(to);
        }

        RouterAPP.beforeResolve(to => {
            let d = {};
            if (Object.keys(RouteStater.RouteState).length) {
                d = RouteStater.RouteState[to.path] || RouteStater.RouteState[to.name];
            }
            to.params = Object.assign(to.params, d);
        });

        app.use(RouterAPP);
    }
}