<template>
    <router-view></router-view>
</template>

<script setup lang="ts">
defineOptions({
    customOptions: {
        route:{
            layout: 'noAuth'
        }
    }
})
</script>