import { createApp } from 'vue'

import App from './App.vue';

const VueApp = createApp(App);

import AutoVueRouter, { createVueAutoRouter } from 'virtual:auto-vue-router';

VueApp.use(AutoVueRouter);

VueApp.mount('#app');