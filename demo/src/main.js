import { createApp } from 'vue'

import App from './App.vue'

const VueApp = createApp(App);

// const modules = import.meta.glob(['./pages/**/*.vue','!**/src','!**/components'],{ eager: true })
// console.log(modules, 'modules1');

import AutoVueRouter from 'virtual:auto-vue-router';

VueApp.use(AutoVueRouter);

VueApp.mount('#app');