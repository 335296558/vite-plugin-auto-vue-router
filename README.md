### vite-plugin-auto-vue-router 一个基于 vue-router@4 封装的自动创建路由插件，因为不想手动导入 🐳🤪🐯
### 该插件能做什么？
#### 1、根据指定目录自动创建路由，可选：动态加载、同步加载【同步加载首次访问会加载全部路由页面】
#### 2、支持页面文件名中定义多个参数
#### 3、页面跳转隐式传参
#### 4、支持layout布局

## Install 
```
pnpm add vite-plugin-auto-vue-router -D

npm i vite-plugin-auto-vue-router -D

yarn add vite-plugin-auto-vue-router --dev

```

#####使用方法

##### 配置参数说明
| 参数名 | 类型 | 默认值 | 说明 |
| -------- | -------- | -------- | -------- |
| dir | String | null | 指定目录下的.vue生成路由 |
| eager | Boolean | true | true默认一次加载所有路由页面，false动态加载，只加载当前访问的页面|
| ignore | Array | `['!**/src', '!**/components']` | 默认过滤${dir} 目录下的src、components目录不创建为路由,|

```text
关于 ignore 参数，配置ignore不会复盖原来的默认值，它只会增加过滤条件
```
如果不想要默认配置的过滤条件，移步[demo](./demo/vite.config.mjs)示例说明


```js
// vite.config.ts
import { defineConfig } from 'vite';
import path from 'path';
import { fileURLToPath, URL } from "url";
import AutoVueRouter from 'vite-plugin-auto-vue-router';

export default defineConfig({
    plugins: [
        AutoVueRouter({
            dir: fileURLToPath(new URL('/src/pages/', import.meta.url))
        }),
    ],
})

// main.ts
import AutoVueRouter from 'virtual:auto-vue-router';
VueApp.use(AutoVueRouter, { /* options */ });
```
##### AutoVueRouter options 配置参数说明
| 参数名 | 类型 | 默认值 | 说明 |
| -------- | -------- | -------- | -------- |
| history | String | h5 | h5、hash、ssr |
| index | String | 'index' | 指定首页的path|
| errorPagePath | String | '404' | 访问页面不存在时的页面|



```js
h5 等于 createWebHistory
hash 等于 createWebHashHistory
ssr 等于 createMemoryHistory
```

##### 页面文件名称中定义多参数
```js
//页面文件名： detail[id,uid,order_id].vue
//实际访问path: /detail/21/testing123/987654321
import { useRoute } from 'vue-router';
const route = useRoute();
// 参数读取
console.log(route.params.id) // = 21
console.log(route.params.uid) // = testing123
console.log(route.params.order_id) // = 987654321
```

##### 隐式传参, 插件内基于router.push 包了一层涵数而已Router.page，用于传输隐式参数
##### router.page(to, 'push||replace') 默认push
```js
import {  useRoute, useRouter } from 'vue-router';
const Router = useRouter();
const route = useRoute();
// hiddenParams隐藏式参数传参，其实它与Router.push相同
// 例如：user.vue
Router.page({ 
    name: 'user-detail', 
    hiddenParams:{ id: 9876543567 }
})
// user/detail.vue
console.log(route.params.id) // = 21

// 若无隐藏式参的需求可以直接用router.push 进行跳转
```

###### 关于layout布局，如果你需要帮助？可以参考[demo](demo)