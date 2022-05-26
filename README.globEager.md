# vite-plugin-auto-vue-router
[默认模式的](README.md)
#### 介绍
    一个基于vite import.meta.globEager 并指定目录的.vue生成vue-router的路由插件
    安装vue-router@4 以上版本

#### vite 使用说明
```js
    // vite.config.js
    
    import vitePluginAutoVueRouter from 'vite-plugin-auto-vue-router/dist/globEager'

    export default {
        plugins: [
            vitePluginAutoVueRouter()
        ]
    };

    // main.js
    import { createApp } from 'vue'

    import App from './App.vue'

    const VueApp = createApp(App);

    import AutoVueRouter from 'auto-vue-router'

    VueApp.use(AutoVueRouter);

    VueApp.mount('#app')
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


#### 其它一样