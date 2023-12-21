<template>
    <component :is="LayoutComponentName">
        <router-view v-slot="{ Component, route }">
            <transition name="slide-fade">
                <component
                    v-if="show"
                    :is="Component"
                    :key="route.path || undefined"
                />
            </transition>
        </router-view>
    </component>
</template>

<script setup>
import { ref, watch, markRaw, shallowRef, computed  } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import DefaultLayout from '@/layouts/default.vue'
import NoAuthLayout from '@/layouts/noAuth.vue'

const show = ref(true)
const Route = useRoute();
const Router = useRouter();
// 计算当前路由的布局组件
const LayoutComponentName = computed(() => {
    show.value = false
    setTimeout(()=>{
        show.value = true
    }, 380)
    console.log(Route.meta, 'Route.meta');
    return markRaw(Route.meta.layout=='noAuth'? NoAuthLayout: DefaultLayout)
});
</script>

<style scoped>
/* 可以设置不同的进入和离开动画   */
/* 设置持续时间和动画函数        */
.slide-fade-enter-active {
	transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
	transition: all 0.3s ease-out;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
	transform: translateX(30px);
	opacity: 0;
}
</style>