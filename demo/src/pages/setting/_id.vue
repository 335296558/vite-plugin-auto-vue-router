<template>
    <div>我是pages/setting/_id.vue</div>
</template>
<script setup>
import { useRouter, useRoute } from 'vue-router'
const $route = useRoute()
console.log($route, '$route')
</script>