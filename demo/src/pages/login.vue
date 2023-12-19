<script setup lang="ts">
import { useRoute } from 'vue-router';
const Route = useRoute();
function setName() {
    console.log(99);
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