import { type App } from 'vue';
import { 
    createRouter, createMemoryHistory, createWebHistory,
    type RouterHistory, type RouteRecordRedirectOption, type RouteComponent
} from 'vue-router';

export interface IOptions {
    history?: RouterHistory;
}

export interface IRoute {
    beforeEnter: Function;
    redirect: RouteRecordRedirectOption;
    aliasOf?: string;
    meta?: Record<string, any>;
    layout: string;
    path: string;
    name: string;
    props?: boolean;
}

export interface IRouteItem extends IRoute {
    component: RouteComponent
}

function getRouteItem(comp: IRouteItem, route: IRoute): IRouteItem {
    return {
        ...route,
        component: comp
    }
}

function getRouteName(pathStr: string) { // pathStr = /xxx/xxx.vue
    const regex = /[^\/]+\/pages\/(.*)/;
    const match = pathStr.match(regex); 
    const pathWithSuffix: string = match ? match[1] : ''; // 这里的 match[1] 表示获取第一个捕获组的内容
    let RoutePath = pathWithSuffix?.replace(/.vue/, ''); // xxx/xxx
    const pathArrs = RoutePath.split('/');                  // ['xxx', 'xxx']
    const PathLastName = pathArrs[pathArrs.length-1];        // 取最后一个文件名
    let RouteName = RoutePath?.replace(/\//g, '-');       // xxx-xxx

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



export default {
    install(app: App, options: IOptions) {
        let routerArray:IRouteItem[]  = [];
        const modules = import.meta.glob('../demo/src/pages/**/*.vue', { eager: true });
        for (let k in modules) {
            // @ts-ignore
            const comp = modules[k].default;
            const { RouteName, RoutePath } = getRouteName(k);
            const route = Object.assign({
                layout: 'default',
                props: true,
            }, comp.customOptions?.route);
            route.name = RouteName;
            route.path = RoutePath;
            // @ts-ignore
            const itemComp = getRouteItem(comp, route);
            routerArray.push(itemComp);
        }
        
        const RouterAPP = createRouter({
            history: options.history || import.meta.env.SSR? createMemoryHistory(): createWebHistory(),
            routes: routerArray as any[]
        });

        app.use(RouterAPP);
    }
}
