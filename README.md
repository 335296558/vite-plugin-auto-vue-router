# vite-plugin-auto-vue-router
[globEager模式的](README.globEager.md)
#### 介绍
    一个通过指定目录的.vue生成vue-router路由的插件
    安装vue-router@4 以上版本


#### 安装
    yarn add vite-plugin-auto-vue-router -D
    npm i vite-plugin-auto-vue-router -D
    pnpm install vite-plugin-auto-vue-router -D

#### vite 使用说明
```js
    // vite.config.js
    
    import vitePluginAutoVueRouter from 'vite-plugin-auto-vue-router'

    export default {
        plugins: [
            vitePluginAutoVueRouter({
                env: process.env.NODE_ENV,
            })
        ],
        // 务必要加上下面的代码，否则vite-plugin-auto-vue-router插件无法热更新
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
    };
```

#### main.js 使用说明
```js
    // main.js

    import { createApp } from 'vue'

    import App from './App.vue'

    const VueApp = createApp(App);

    import AutoVueRouter from 'auto-vue-router'

    VueApp.use(AutoVueRouter);

    VueApp.mount('#app')
```


#### 参数说明
| 参数名 | 类型 | 默认值 | 说明 |
| -------- | -------- | -------- | -------- |
| viewFolderName | String | pages | 指定目录下的.vue生成路由 |
| ignore | String | src | 过滤的那些目录的.vue不要生成路由 |
| LoadComponentMode | String | resolveComponent | 生成路由功能模式: default=一次性加载全部、resolveComponent=异步加载、defineAsyncComponent=https://v3.cn.vuejs.org/api/global-api.html#defineasynccomponent |

#### LoadComponentMode 说明
    如果LoadComponentMode=default 可以更好的支持layout布局

    支持路由页的xxx.vue中定义以下参数：
    参数最终会被分配到当前页面的route中，与components同级
    与https://router.vuejs.org/zh/api/#routerecordraw 一至
    <script>
        export default {
            mata:{},
            layout: 'default',
            redirect: '',
            aliasOf: '',
            meta: {},
            beforeEnter: ()=>{}
        }
    </script>

    否则不支持mata、redirect、aliasOf、meta、beforeEnter参数
###### 其它说明
    关于layout布局，如果你需要帮助？可以参考https://github.com/335296558/vite-plugin-auto-vue-router/tree/master/example
    实例去实现,
    

##### 已知问题
    1、新建、删除目录文件没有热更新，解决办法：重启服务、或重载vite.config.js
    2、LoadComponentMode=defineAsyncComponent 控制台警告，但不影响跳转！建议不要用此模式，
    
所以你一定要使用建议你用[globEager模式的](README.globEager.md)


##### 版本
    v2.0.0 增加import.meta.globEager方法生成的模式 [globEager模式的]