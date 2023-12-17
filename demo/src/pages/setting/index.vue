<template>
    <div>
        我是pages/setting/index.vue
    </div>
</template>

<script setup>
import { ref } from 'vue';
const y = 23423;
defineOptions({
    customOptions:{
        route:{
            meta:{ a: 323 },
            // alias: ['/setting'],
            beforeEnter: (to, from, next) => {
                console.log(to, y);
                next();
            },
            query:{
                as:{
                    g:9878
                }
            }
        }
    }
})
const YSHUNAG = ref(22323)
defineExpose({
	YSHUNAG
})
console.log(YSHUNAG, 'YSHUNAG')
</script>