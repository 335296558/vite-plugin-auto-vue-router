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
import { ref, watch, markRaw, shallowRef  } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import DefaultLayout from '@/layouts/default.vue'
import NoAuthLayout from '@/layouts/noAuth.vue'

const LayoutComponentName = shallowRef(NoAuthLayout)

function setLayout(layout='default') {
    LayoutComponentName.value = markRaw(layout=='noAuth'? NoAuthLayout: DefaultLayout)
}
const show = ref(true)
const Route = useRoute();
const Router = useRouter();
Router.beforeEach((to, from, next)=>{
    console.log(to, '==');
    next();
});
/*  
function init() {
    if (Router) {
        Router.isReady().then((e) => {
            try {
                const cuuRouteItem = Route.matched[0] || null
                if (cuuRouteItem) {
                    const cuurPage = cuuRouteItem.components.default
                    setLayout(cuurPage.layout)
                }
                watch(Route, (newRoute) => {
                    const item = newRoute.matched[0] || null
                    if (item) {
                        const page = item.components.default
                        setLayout(page.layout)
                    }
                    show.value = false
                    setTimeout(()=>{
                        show.value = true
                    }, 380)
                })
            } catch (error) {
                console.error(error)
            }
        })
    } else {
        console.error('Do you want to install vue-router@4')
    }
}

init();
*/
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