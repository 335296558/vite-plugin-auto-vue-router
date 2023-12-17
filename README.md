# AutoVueRouter 
## Auto Router Plugin 基于 Vue3 + vue-router@4 
### 可自动根据指定目录创建路由、支持页面文件定义多个参数、隐式传参

#### install
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
| eager | Boolean | true | true=默认一次加载所有路由页面，false=动态加载，只加载访问的页面|
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
VueApp.use(AutoVueRouter);
```

##### 页面文件定义多参数
```js
// detail/[id,uid,order_id].vue
// detail/21/testing123/987654321
import { useRoute } from 'vue-router';
const route = useRoute();
console.log(route.params.id) // = 21
console.log(route.params.uid) // = testing123
console.log(route.params.order_id) // = 987654321
```

##### 隐式传参, 插件内基于router.push 包了一层涵数而已Router.page，用于传输隐式参数
```js
import {  useRoute, useRouter } from 'vue-router';
const Router = useRouter();
const route = useRoute();
// hiddenParams隐藏式参数传参，其它与Router.push相同
// 例如：user.vue
Router.page({ 
    name: 'user-detail', 
    hiddenParams:{ id: 9876543567 }
})
// user/detail.vue
console.log(route.params.id) // = 21

// 若无此需求可以直接用router.push 进行跳转
```

###### 关于layout布局，如果你需要帮助？可以参考[demo](demo)