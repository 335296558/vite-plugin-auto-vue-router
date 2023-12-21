import { createApp } from 'vue'

import App from './App.vue';
import { createWebHashHistory, createWebHistory,  } from 'vue-router';

const VueApp = createApp(App);

import AutoVueRouter from 'virtual:auto-vue-router';

VueApp.use(AutoVueRouter, {
    history: 'h5'
});

VueApp.mount('#app');