<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
const Route = useRoute();
const Router = useRouter();
function setName() {
    console.log(99);
    console.log(Router, 'Router');
}
setName();
</script>

<template>
    <div>
        Login
        <br />
        <router-link to="/index">Index</router-link>
    </div>
</template>

<route lang="yaml">
meta:
    layout: 'noAuth'
</route>